import { GoogleGenAI } from '@google/genai';

const PHASE_TITLES = Object.freeze({
  1: 'O Perigo Doce',
  2: 'O Custo do Vício',
  3: 'A Ilusão do Dinheiro',
  4: 'A Engenharia do Desejo',
});

export const TEACHER_CHAT_INTENTS = Object.freeze({
  OVERVIEW: 'OVERVIEW',
  CLASS_COMPARISON: 'CLASS_COMPARISON',
  PHASE_DIFFICULTY: 'PHASE_DIFFICULTY',
  PARTICIPATION: 'PARTICIPATION',
  COMPETITION_POINTS: 'COMPETITION_POINTS',
  UNSUPPORTED: 'UNSUPPORTED',
});

const BLOCKED_PATTERNS = [
  /\b(uid|e-?mail|senha|token|cpf|telefone)\b/i,
  /\b(sql|graphql|select|insert|update|delete|drop|schema|tabela)\b/i,
  /ignore\s+(as|todas|qualquer)\s+instru/i,
  /prompt\s+(interno|do sistema|system)/i,
];

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['suggestion'],
  properties: {
    suggestion: { type: 'string', minLength: 20, maxLength: 280 },
  },
};

function percentage(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(number(value));
}

function classLabel(value) {
  if (value === 'THIRD_DSA') return '3º DSA';
  if (value === 'THIRD_DSB') return '3º DSB';
  return 'Turma não identificada';
}

function normalizeContext(rawContext) {
  const summary = rawContext?.summary;
  if (!summary || typeof summary !== 'object') return null;

  return {
    summary: {
      totalStudents: number(summary.totalStudents),
      participatingStudents: number(summary.participatingStudents),
      totalPoints: number(summary.totalPoints),
      totalAttempts: number(summary.totalAttempts),
      approvedAttempts: number(summary.approvedAttempts),
      averageScore: number(summary.averageScore),
      completedTrailStudents: number(summary.completedTrailStudents),
    },
    classes: Array.isArray(rawContext.classMetrics)
      ? rawContext.classMetrics.map((item) => ({
          className: classLabel(item.classGroup),
          registeredStudents: number(item.registeredStudents),
          participatingStudents: number(item.participatingStudents),
          totalPoints: number(item.totalPoints),
          totalAttempts: number(item.totalAttempts),
          averageScore: number(item.averageScore),
          progressPercent: number(item.progressPercent),
        }))
      : [],
    phases: Array.isArray(rawContext.phaseMetrics)
      ? rawContext.phaseMetrics.map((item) => ({
          phaseNumber: number(item.phaseNumber),
          title: PHASE_TITLES[number(item.phaseNumber)] || 'Fase',
          studentsReached: number(item.studentsReached),
          studentsCompleted: number(item.studentsCompleted),
          totalAttempts: number(item.totalAttempts),
          approvedAttempts: number(item.approvedAttempts),
          averageScore: number(item.averageScore),
          correctAnswers: number(item.correctAnswers),
          wrongAnswers: number(item.wrongAnswers),
        }))
      : [],
  };
}

export function normalizeTeacherQuestion(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, 500);
}

export function classifyTeacherQuestion(value) {
  const question = normalizeTeacherQuestion(value);
  if (!question || BLOCKED_PATTERNS.some((pattern) => pattern.test(question))) {
    return TEACHER_CHAT_INTENTS.UNSUPPORTED;
  }

  if (/\b(dsa|dsb|turmas?|compar|contra|versus|diferença)\b/i.test(question)) {
    return TEACHER_CHAT_INTENTS.CLASS_COMPARISON;
  }
  if (/\b(fases?|atividade|difícil|dificuldade|erro|erros|acerto|nota)\b/i.test(question)) {
    return TEACHER_CHAT_INTENTS.PHASE_DIFFICULTY;
  }
  if (/\b(particip|engaj|alunos? ativos?|adesão|acess)/i.test(question)) {
    return TEACHER_CHAT_INTENTS.PARTICIPATION;
  }
  if (/\b(pontos?|capicoins?|moedas?|competição|ranking|saldo)\b/i.test(question)) {
    return TEACHER_CHAT_INTENTS.COMPETITION_POINTS;
  }
  if (/\b(resumo|visão geral|desempenho|resultado|período|como estão)\b/i.test(question)) {
    return TEACHER_CHAT_INTENTS.OVERVIEW;
  }
  return TEACHER_CHAT_INTENTS.UNSUPPORTED;
}

function difficultyRate(phase) {
  return percentage(
    phase.wrongAnswers,
    phase.correctAnswers + phase.wrongAnswers,
  );
}

function buildOverview(context) {
  const { summary } = context;
  const participation = percentage(
    summary.participatingStudents,
    summary.totalStudents,
  );
  const approval = percentage(
    summary.approvedAttempts,
    summary.totalAttempts,
  );
  return `No período, ${summary.participatingStudents} de ${summary.totalStudents} alunos participaram (${participation}%). Foram registradas ${formatNumber(summary.totalAttempts)} tentativas, com média de ${summary.averageScore}% e ${approval}% de aprovação. A competição acumulou ${formatNumber(summary.totalPoints)} pontos.`;
}

function buildClassComparison(context) {
  if (context.classes.length < 2) {
    return 'Ainda não há dados suficientes das duas turmas para fazer uma comparação justa neste período.';
  }
  const sorted = [...context.classes].sort(
    (left, right) => right.totalPoints - left.totalPoints,
  );
  const [leader, other] = sorted;
  const difference = leader.totalPoints - other.totalPoints;
  return `${leader.className} soma ${formatNumber(leader.totalPoints)} pontos e ${other.className} soma ${formatNumber(other.totalPoints)}. A diferença atual é de ${formatNumber(difference)} pontos. As médias são ${leader.averageScore}% e ${other.averageScore}%, respectivamente; compare também a participação antes de interpretar a liderança.`;
}

function buildPhaseDifficulty(context) {
  const phasesWithAnswers = context.phases.filter(
    (phase) => phase.correctAnswers + phase.wrongAnswers > 0,
  );
  if (phasesWithAnswers.length === 0) {
    return 'Ainda não existem respostas suficientes no período para identificar a atividade com maior dificuldade.';
  }
  const hardest = [...phasesWithAnswers].sort(
    (left, right) => difficultyRate(right) - difficultyRate(left),
  )[0];
  return `A maior dificuldade observada está na Fase ${hardest.phaseNumber}, ${hardest.title}: ${difficultyRate(hardest)}% das respostas registradas foram erros. A média da fase é ${hardest.averageScore}% em ${formatNumber(hardest.totalAttempts)} tentativas.`;
}

function buildParticipation(context) {
  const { summary } = context;
  const rate = percentage(
    summary.participatingStudents,
    summary.totalStudents,
  );
  return `${summary.participatingStudents} de ${summary.totalStudents} alunos participaram do período, uma taxa de ${rate}%. Participação significa ter ao menos uma tentativa ou um crédito competitivo vinculado ao período.`;
}

function buildCompetitionPoints(context) {
  const classes = [...context.classes].sort(
    (left, right) => right.totalPoints - left.totalPoints,
  );
  const details = classes.length
    ? ` ${classes.map((item) => `${item.className}: ${formatNumber(item.totalPoints)}`).join(' · ')}.`
    : '';
  return `Foram acumulados ${formatNumber(context.summary.totalPoints)} pontos competitivos no período.${details} Somente créditos positivos vinculados ao período entram nessa soma.`;
}

export function buildSafeTeacherAnswer(intent, rawContext) {
  const context = normalizeContext(rawContext);
  if (!context) return null;

  const builders = {
    [TEACHER_CHAT_INTENTS.OVERVIEW]: buildOverview,
    [TEACHER_CHAT_INTENTS.CLASS_COMPARISON]: buildClassComparison,
    [TEACHER_CHAT_INTENTS.PHASE_DIFFICULTY]: buildPhaseDifficulty,
    [TEACHER_CHAT_INTENTS.PARTICIPATION]: buildParticipation,
    [TEACHER_CHAT_INTENTS.COMPETITION_POINTS]: buildCompetitionPoints,
  };
  return builders[intent]?.(context) || null;
}

function fallbackSuggestion(intent) {
  const suggestions = {
    [TEACHER_CHAT_INTENTS.OVERVIEW]:
      'Use o resumo como ponto de partida e confronte participação, média e aprovação antes de planejar uma intervenção.',
    [TEACHER_CHAT_INTENTS.CLASS_COMPARISON]:
      'Compare participação e desempenho junto com os pontos para evitar que o ranking seja interpretado fora do contexto.',
    [TEACHER_CHAT_INTENTS.PHASE_DIFFICULTY]:
      'Retome o conceito mais difícil com um exemplo curto e observe se as próximas tentativas mostram redução dos erros.',
    [TEACHER_CHAT_INTENTS.PARTICIPATION]:
      'Convide a turma a concluir a próxima etapa e acompanhe se a participação aumenta após a orientação.',
    [TEACHER_CHAT_INTENTS.COMPETITION_POINTS]:
      'Apresente a disputa como estímulo coletivo e reforce que os pontos devem acompanhar aprendizagem e participação.',
  };
  return suggestions[intent] || '';
}

function validateSuggestion(value) {
  if (typeof value !== 'string') return null;
  const suggestion = value.trim().replace(/\s+/g, ' ');
  if (
    suggestion.length < 20 ||
    suggestion.length > 280 ||
    /\d|%|R\$|capicoins?|nome|e-?mail|uid/i.test(suggestion)
  ) {
    return null;
  }
  return suggestion;
}

export async function buildTeacherChatResponse({
  question,
  rawContext,
  apiKey,
  model,
  requestId,
  timeoutMs = 15_000,
  onDiagnostic,
}) {
  const intent = classifyTeacherQuestion(question);
  if (intent === TEACHER_CHAT_INTENTS.UNSUPPORTED) {
    return {
      intent,
      answer: 'Consigo responder apenas sobre o resumo do período, participação, comparação entre as turmas, pontos e dificuldades por fase. Não consulto dados pessoais nem executo comandos de banco.',
      suggestion: '',
      generatedBy: 'policy',
      aiStatus: 'not_applicable',
      requestId,
    };
  }

  const answer = buildSafeTeacherAnswer(intent, rawContext);
  if (!answer) return null;

  let suggestion = fallbackSuggestion(intent);
  let generatedBy = 'aggregate-only';
  let aiStatus = 'unavailable';
  let diagnosticCode = null;
  if (apiKey && apiKey !== 'local-fallback') {
    const startedAt = Date.now();
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: timeoutMs,
          retryOptions: { strategy: 'attempt-count-backoff', maxRetries: 1 },
        },
      });
      const response = await ai.models.generateContent({
        model,
        contents: [
          'Você é o Capi Analista, assistente pedagógico de um professor de escola técnica.',
          'Escreva somente uma recomendação pedagógica curta em português brasileiro.',
          'Não repita números, não invente fatos, não cite alunos e não mencione banco de dados.',
          'Período: período selecionado e autorizado no Capi Bank.',
          `Pergunta categorizada como: ${intent}.`,
          `Leitura factual já calculada pelo servidor: ${answer}`,
        ].join('\n'),
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: RESPONSE_SCHEMA,
          temperature: 0.25,
          maxOutputTokens: 180,
        },
      });
      const candidate = validateSuggestion(
        JSON.parse(response.text)?.suggestion,
      );
      if (candidate) {
        suggestion = candidate;
        generatedBy = 'aggregate+gemini';
        aiStatus = 'ok';
        const diagnostic = { requestId, model, ok: true, latencyMs: Date.now() - startedAt };
        onDiagnostic?.(diagnostic);
        console.log(JSON.stringify({ event: 'teacher_analyst_success', ...diagnostic }));
      } else {
        throw new Error('invalid_analyst_suggestion');
      }
    } catch (error) {
      diagnosticCode = requestId;
      const diagnostic = {
        requestId,
        model,
        ok: false,
        latencyMs: Date.now() - startedAt,
        reason: String(error?.message || 'analyst_request_failed').slice(0, 240),
      };
      onDiagnostic?.(diagnostic);
      console.warn(JSON.stringify({ event: 'teacher_analyst_unavailable', ...diagnostic }));
    }
  } else {
    diagnosticCode = requestId;
    onDiagnostic?.({ requestId, model, ok: false, latencyMs: 0, reason: 'missing_api_key' });
  }

  return {
    intent,
    answer,
    calculatedData: answer,
    interpretation: suggestion,
    suggestion,
    generatedBy,
    aiStatus,
    diagnosticCode,
    requestId,
  };
}
