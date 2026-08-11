import { GoogleGenAI } from '@google/genai';

const PHASE_TOPICS = Object.freeze({
  0: 'introdução à educação financeira, fiscal, cidadã e de saúde',
  1: 'açúcar, orçamento, saúde pública e tributação',
  2: 'gastos recorrentes, vícios e custo de oportunidade',
  3: 'consumo por impulso, pressão social e planejamento',
  4: 'publicidade de apostas, risco e proteção do orçamento',
});

const OUT_OF_SCOPE = [
  /\b(futebol|celebridade|fofoca|filme|série|namoro|receita culinária)\b/i,
  /\b(hack|senha|token|uid|e-?mail|sql|banco de dados|prompt interno)\b/i,
];
const ANSWER_REQUEST = /\b(gabarito|qual (é )?a (resposta|alternativa)|marco [abcd]|responda por mim)\b/i;
const OFFICIAL_HOST = /(?:^|\.)(?:gov\.br|gov|leg\.br|jus\.br|edu\.br|edu|who\.int|paho\.org)$/i;
const PRIVATE_HOST = /^(?:localhost|127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|\[?::1\]?$)/i;

function cleanText(value, maximum = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').slice(0, maximum);
}

export function normalizeMentorQuestion(value) {
  return cleanText(value, 500);
}

export function classifyMentorQuestion(question) {
  const normalized = normalizeMentorQuestion(question);
  if (!normalized || OUT_OF_SCOPE.some((pattern) => pattern.test(normalized))) return 'OUT_OF_SCOPE';
  if (ANSWER_REQUEST.test(normalized)) return 'ACTIVE_ANSWER';
  return 'MONEY_RANK_EDUCATION';
}

function normalizeStudentContext(rawContext) {
  const profile = rawContext?.profile;
  if (!profile || profile.role !== 'STUDENT' || !profile.profileCompleted) return null;
  const currentPhase = Math.min(Math.max(Number(profile.currentPhase) || 0, 0), 4);
  const progress = Array.isArray(rawContext.progress) ? rawContext.progress : [];
  const difficultPhases = progress
    .filter((item) => Number(item.wrongAnswers) > Number(item.correctAnswers))
    .map((item) => Number(item.phaseNumber))
    .filter((phase) => phase >= 1 && phase <= 4)
    .slice(0, 2);
  return {
    currentTopic: PHASE_TOPICS[currentPhase],
    difficultTopics: difficultPhases.map((phase) => PHASE_TOPICS[phase]),
  };
}

function validateAiAnswer(value) {
  const answer = cleanText(value, 5_000);
  if (answer.length < 120 || /\b(uid|e-?mail|token|prompt interno)\b/i.test(answer)) return null;
  return answer;
}

export function isSafeCitationUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && !PRIVATE_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

function sanitizeSuggestionsHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .slice(0, 20_000)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/javascript:/gi, '');
}

function sourcePriority(source) {
  try {
    return OFFICIAL_HOST.test(new URL(source.url).hostname) ? 0 : 1;
  } catch {
    return 2;
  }
}

export function extractInteractionGrounding(interaction) {
  const sources = [];
  const citations = [];
  let searchSuggestionsHtml = '';
  let searchUsed = false;
  const steps = Array.isArray(interaction?.steps) ? interaction.steps : [];

  for (const step of steps) {
    if (step?.type === 'google_search_call') searchUsed = true;
    if (step?.type === 'google_search_result') {
      searchUsed = true;
      const results = Array.isArray(step.result) ? step.result : [];
      const suggestion = results.find((item) => typeof item?.search_suggestions === 'string')?.search_suggestions;
      if (!searchSuggestionsHtml && suggestion) searchSuggestionsHtml = sanitizeSuggestionsHtml(suggestion);
    }
    if (step?.type !== 'model_output') continue;
    for (const block of Array.isArray(step.content) ? step.content : []) {
      if (block?.type !== 'text') continue;
      for (const annotation of Array.isArray(block.annotations) ? block.annotations : []) {
        if (annotation?.type !== 'url_citation' || !isSafeCitationUrl(annotation.url)) continue;
        const title = cleanText(annotation.title || new URL(annotation.url).hostname, 140);
        const url = String(annotation.url);
        if (!sources.some((item) => item.url === url)) sources.push({ title, url });
        citations.push({
          title,
          url,
          startIndex: Number(annotation.startIndex ?? annotation.start_index) || 0,
          endIndex: Number(annotation.endIndex ?? annotation.end_index) || 0,
        });
      }
    }
  }

  sources.sort((left, right) => sourcePriority(left) - sourcePriority(right));
  return { sources: sources.slice(0, 5), citations: citations.slice(0, 12), searchSuggestionsHtml, searchUsed };
}

export function selectMentorResponse(response) {
  const answer = validateAiAnswer(response?.output_text);
  if (!answer) return null;
  const grounding = extractInteractionGrounding(response);
  if (!grounding.searchUsed || grounding.sources.length === 0) return null;
  return { answer, ...grounding, generatedBy: 'gemini-grounded' };
}

export class MentorUnavailableError extends Error {
  constructor({ requestId, reason, model, cause }) {
    super('CapiMentor temporariamente indisponível. Tente novamente mais tarde.');
    this.name = 'MentorUnavailableError';
    this.code = 'mentor_unavailable';
    this.status = 503;
    this.requestId = requestId;
    this.reason = reason;
    this.model = model;
    this.cause = cause;
  }
}

function sanitizedFailure(error) {
  return {
    errorName: cleanText(error?.name || 'Error', 80),
    errorMessage: cleanText(error?.message || String(error), 320),
    errorStatus: Number(error?.status) || undefined,
  };
}

export async function answerStudentMentor({
  question,
  rawContext,
  apiKey,
  model,
  requestId,
  timeoutMs = 15_000,
  onDiagnostic,
}) {
  const normalizedQuestion = normalizeMentorQuestion(question);
  const classification = classifyMentorQuestion(normalizedQuestion);
  const context = normalizeStudentContext(rawContext);
  if (!context) return null;

  if (classification === 'OUT_OF_SCOPE') {
    return {
      answer: 'Eu cuido dos temas do Money Rank: educação financeira e fiscal, cidadania, saúde pública, consumo responsável, direitos do consumidor, orçamento e políticas públicas relacionadas. Não acesso dados pessoais, sistemas ou assuntos sem relação com esse escopo.',
      sources: [], citations: [], searchUsed: false, generatedBy: 'policy', requestId,
    };
  }
  if (classification === 'ACTIVE_ANSWER') {
    return {
      answer: 'Não posso entregar o gabarito nem escolher uma alternativa de uma atividade. Posso explicar o conceito e ajudar você a comparar as opções com suas próprias palavras.',
      sources: [], citations: [], searchUsed: false, generatedBy: 'policy', requestId,
    };
  }

  const startedAt = Date.now();
  const normalizedApiKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!normalizedApiKey || normalizedApiKey === 'local-fallback') {
    const diagnostic = { requestId, model, ok: false, searchUsed: false, sourceCount: 0, latencyMs: 0, reason: 'missing_api_key' };
    onDiagnostic?.(diagnostic);
    console.warn(JSON.stringify({ event: 'student_mentor_unavailable', ...diagnostic }));
    throw new MentorUnavailableError({ requestId, reason: 'missing_api_key', model });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: normalizedApiKey });
    const prompt = [
      'Você é o CapiMentor, tutor pedagógico do Money Rank para estudantes do ensino médio técnico.',
      'Antes de responder, execute a Pesquisa Google e use ao menos uma fonte pertinente. Priorize fontes oficiais.',
      'O escopo inclui educação financeira e fiscal, cidadania, saúde pública, consumo responsável, direitos do consumidor, orçamento público e políticas públicas relacionadas.',
      'Responda em português brasileiro de forma específica para a pergunta. Diferencie fatos, interpretações e exemplos.',
      'Não invente fontes, não entregue gabaritos e não forneça aconselhamento médico, jurídico ou financeiro individual.',
      'Não mencione contexto interno, saldo, UID, e-mail ou outros identificadores.',
      `Tema atual da trilha: ${context.currentTopic}.`,
      `Tópicos para possível reforço: ${context.difficultTopics.join('; ') || 'nenhum identificado'}.`,
      `Pergunta do estudante: ${normalizedQuestion}`,
    ].join('\n');
    const response = await ai.interactions.create({
      model,
      input: prompt,
      tools: [{ type: 'google_search' }],
      generation_config: { temperature: 0.3, max_output_tokens: 1_400 },
    }, { timeout: timeoutMs, maxRetries: 1 });
    const selected = selectMentorResponse(response);
    if (!selected) throw new Error('grounded_response_required');
    const diagnostic = {
      requestId,
      interactionId: cleanText(response?.id, 160) || null,
      model,
      ok: true,
      searchUsed: true,
      sourceCount: selected.sources.length,
      latencyMs: Date.now() - startedAt,
      reason: null,
    };
    onDiagnostic?.(diagnostic);
    console.log(JSON.stringify({ event: 'student_mentor_success', ...diagnostic }));
    return { ...selected, requestId, model };
  } catch (error) {
    const diagnostic = {
      requestId,
      model,
      ok: false,
      searchUsed: false,
      sourceCount: 0,
      latencyMs: Date.now() - startedAt,
      reason: error?.message === 'grounded_response_required' ? 'grounding_missing' : 'gemini_request_failed',
      ...sanitizedFailure(error),
    };
    onDiagnostic?.(diagnostic);
    console.warn(JSON.stringify({ event: 'student_mentor_unavailable', ...diagnostic }));
    throw new MentorUnavailableError({ requestId, reason: diagnostic.reason, model, cause: error });
  }
}
