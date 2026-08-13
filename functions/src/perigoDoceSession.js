import { GoogleGenAI } from '@google/genai';
import { getPerigoDoceDefinition } from './activityEngine.js';

const OPTION_IDS = ['A', 'B', 'C', 'D'];
const DIFFICULTIES = ['facil', 'media', 'desafiadora'];
const ENGINE_DIFFICULTY = Object.freeze({
  facil: 'EASY',
  media: 'MEDIUM',
  desafiadora: 'HARD',
});

function requireText(value, field, minimum, maximum) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (text.length < minimum || text.length > maximum) {
    throw new Error(`Campo inválido na questão: ${field}.`);
  }
  return text;
}

function validateQuestions(payload, definition) {
  if (!Array.isArray(payload?.questions) || payload.questions.length !== 5) {
    throw new Error('A atividade precisa de cinco questões.');
  }

  const knowledgeIds = new Set(definition.knowledge.map((fact) => fact.id));
  const questionIds = new Set();

  return payload.questions.map((question, index) => {
    const id = requireText(question?.id, 'id', 3, 100);
    if (questionIds.has(id)) throw new Error('Questões duplicadas.');
    questionIds.add(id);

    if (!DIFFICULTIES.includes(question?.difficulty)) {
      throw new Error('Dificuldade de questão inválida.');
    }
    if (!Array.isArray(question?.options) || question.options.length !== 4) {
      throw new Error('Cada questão deve possuir quatro alternativas.');
    }

    const options = question.options.map((option, optionIndex) => {
      const optionId = String(option?.id ?? '').trim().toUpperCase();
      if (optionId !== OPTION_IDS[optionIndex]) {
        throw new Error('Identificador de alternativa inválido.');
      }
      return {
        id: optionId,
        text: requireText(option?.text, `alternativa ${optionId}`, 8, 260),
      };
    });
    const correctOptionId = String(
      question?.correctOptionId ?? '',
    ).toUpperCase();
    if (!OPTION_IDS.includes(correctOptionId)) {
      throw new Error('Gabarito de questão inválido.');
    }
    const sourceFactIds = [...new Set(
      Array.isArray(question?.sourceFactIds)
        ? question.sourceFactIds.map(String)
        : [],
    )];
    if (
      sourceFactIds.length < 1 ||
      sourceFactIds.length > 2 ||
      sourceFactIds.some((factId) => !knowledgeIds.has(factId))
    ) {
      throw new Error('Fonte de questão inválida.');
    }

    return {
      id: id || `perigo-doce-${index + 1}`,
      difficulty: question.difficulty,
      prompt: requireText(question?.prompt, 'enunciado', 20, 420),
      options,
      correctOptionId,
      explanation: requireText(
        question?.explanation,
        'explicação',
        20,
        500,
      ),
      sourceFactIds,
    };
  });
}

function splitQuestionPayload(questions, source, model = null) {
  return {
    publicPayload: {
      source,
      model,
      questions: questions.map((question) => ({
        id: question.id,
        itemId: question.id,
        difficulty: question.difficulty,
        prompt: question.prompt,
        options: question.options.map((option) => ({
          ...option,
          label: option.text,
        })),
      })),
    },
    answerKey: {
      items: questions.map(({
        id,
        difficulty,
        correctOptionId,
        explanation,
        sourceFactIds,
      }) => ({
        itemId: id,
        difficulty: ENGINE_DIFFICULTY[difficulty] || 'MEDIUM',
        correctOptionId,
        explanation,
        source: { factIds: sourceFactIds },
        tags: ['perigo-doce', 'gemini-generated'],
      })),
      selectedItemIds: questions.map((question) => question.id),
    },
  };
}

const responseSchema = {
  type: 'object',
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        required: [
          'id',
          'difficulty',
          'prompt',
          'options',
          'correctOptionId',
          'explanation',
          'sourceFactIds',
        ],
        properties: {
          id: { type: 'string' },
          difficulty: { type: 'string', enum: DIFFICULTIES },
          prompt: { type: 'string' },
          options: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: {
              type: 'object',
              required: ['id', 'text'],
              properties: {
                id: { type: 'string', enum: OPTION_IDS },
                text: { type: 'string' },
              },
            },
          },
          correctOptionId: { type: 'string', enum: OPTION_IDS },
          explanation: { type: 'string' },
          sourceFactIds: {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: { type: 'string' },
          },
        },
      },
    },
  },
};

export function parseGeneratedQuestions(text, overrideDefinition = null) {
  const definition = getPerigoDoceDefinition(overrideDefinition);
  const normalized = String(text || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  if (!normalized) throw new Error('O Gemini devolveu uma resposta vazia.');
  return validateQuestions(JSON.parse(normalized), definition);
}

export class PerigoDoceUnavailableError extends Error {
  constructor({ reason, model, cause }) {
    super('A atividade Perigo Doce está temporariamente indisponível porque a geração por IA falhou.');
    this.name = 'PerigoDoceUnavailableError';
    this.code = 'activity_generation_unavailable';
    this.status = 503;
    this.reason = reason;
    this.model = model;
    this.cause = cause;
  }
}

export async function buildAiPerigoDoceSession({
  apiKey,
  model,
  definition,
  onDiagnostic,
}) {
  if (!apiKey || apiKey === 'local-fallback') {
    const diagnostic = {
      model,
      ok: false,
      source: 'unavailable',
      reason: 'missing_api_key',
      latencyMs: 0,
    };
    onDiagnostic?.(diagnostic);
    throw new PerigoDoceUnavailableError({
      reason: diagnostic.reason,
      model,
    });
  }

  const activeDefinition = getPerigoDoceDefinition(definition);
  const ai = new GoogleGenAI({ apiKey });
  const startedAt = Date.now();
  const prompt = [
    'Você é o Capi Tutor, tutor jovem e responsável de educação financeira para o 3º ano de escolas técnicas brasileiras.',
    'Gere exatamente cinco questões de múltipla escolha em português brasileiro.',
    'Use somente os fatos fornecidos. Não invente estatísticas ou fontes.',
    'Cada questão deve ter A, B, C e D, uma resposta correta e um ou dois sourceFactIds existentes.',
    'Não inclua dados pessoais, pontuação, streak ou recompensa.',
    JSON.stringify({ knowledgeBase: activeDefinition.knowledge }),
  ].join('\n\n');

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: attempt === 1
          ? prompt
          : `${prompt}\n\nA resposta anterior ficou vazia, incompleta ou inválida. Gere novamente o objeto JSON completo.`,
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: responseSchema,
          maxOutputTokens: 8192,
        },
      });
      const questions = parseGeneratedQuestions(response.text, activeDefinition);
      const prepared = {
        activityId: 'perigo-doce-quiz',
        variantId: 'ai',
        contentVersion: activeDefinition.contentVersion,
        ...splitQuestionPayload(questions, 'ai', model),
      };
      onDiagnostic?.({
        model,
        ok: true,
        source: 'ai',
        reason: null,
        attempts: attempt,
        latencyMs: Date.now() - startedAt,
      });
      return prepared;
    } catch (error) {
      lastError = error;
      // Erros HTTP, especialmente falta de cota, não melhoram repetindo a
      // mesma chamada. A segunda tentativa é reservada a conteúdo malformado.
      if (Number(error?.status) > 0) break;
    }
  }

  const diagnostic = {
    model,
    ok: false,
    source: 'unavailable',
    reason: String(lastError?.message || 'gemini_request_failed').slice(0, 240),
    errorName: String(lastError?.name || 'Error').slice(0, 80),
    errorStatus: Number(lastError?.status) || undefined,
    attempts: Number(lastError?.status) > 0 ? 1 : 2,
    latencyMs: Date.now() - startedAt,
  };
  onDiagnostic?.(diagnostic);
  console.warn(JSON.stringify({
    event: 'perigo_doce_gemini_unavailable',
    ...diagnostic,
  }));
  throw new PerigoDoceUnavailableError({
    reason: diagnostic.reason,
    model,
    cause: lastError,
  });
}
