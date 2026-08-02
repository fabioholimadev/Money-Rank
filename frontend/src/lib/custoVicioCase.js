import {
  custoVicioCases,
  custoVicioKnowledge,
  getCustoVicioCase,
} from '../data/custoVicioCases.js';

export const CUSTO_VICIO_DECISION_COUNT = 5;
export const CUSTO_VICIO_MIN_POINTS = CUSTO_VICIO_DECISION_COUNT;
export const CUSTO_VICIO_MAX_POINTS = CUSTO_VICIO_DECISION_COUNT * 3;
export const CUSTO_VICIO_MIN_SCORE = 60;
export const CUSTO_VICIO_MAX_SCORE = 100;

function createSeededRandom(seed) {
  let state = Number(seed) >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(values, random) {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function requireText(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Campo obrigatório ausente: ${field}.`);
  }

  return value.trim();
}

function validateSourceIds(sourceFactIds, field, knowledgeIds) {
  if (
    !Array.isArray(sourceFactIds) ||
    sourceFactIds.length === 0 ||
    sourceFactIds.some((factId) => !knowledgeIds.has(factId))
  ) {
    throw new Error(`Fonte inválida em ${field}.`);
  }
}

export function validateCustoVicioCaseBank() {
  const knowledgeIds = new Set(custoVicioKnowledge.map(({ id }) => id));
  const caseIds = new Set();
  const decisionIds = new Set();

  if (custoVicioCases.length < 3) {
    throw new Error('O Custo do Vício precisa de pelo menos três personagens.');
  }

  for (const caseItem of custoVicioCases) {
    requireText(caseItem.id, 'personagem.id');
    requireText(caseItem.name, `${caseItem.id}.name`);
    requireText(caseItem.story, `${caseItem.id}.story`);

    if (caseIds.has(caseItem.id)) {
      throw new Error(`Personagem duplicado: ${caseItem.id}.`);
    }
    caseIds.add(caseItem.id);

    validateSourceIds(
      caseItem.sourceFactIds,
      `personagem ${caseItem.id}`,
      knowledgeIds,
    );

    if (caseItem.decisions.length !== CUSTO_VICIO_DECISION_COUNT) {
      throw new Error(
        `${caseItem.name} precisa de ${CUSTO_VICIO_DECISION_COUNT} decisões.`,
      );
    }

    for (const decision of caseItem.decisions) {
      requireText(decision.id, `${caseItem.id}.decisao.id`);
      requireText(decision.narrative, `${decision.id}.narrative`);
      requireText(decision.question, `${decision.id}.question`);

      if (decisionIds.has(decision.id)) {
        throw new Error(`Decisão duplicada: ${decision.id}.`);
      }
      decisionIds.add(decision.id);

      validateSourceIds(
        decision.sourceFactIds,
        `decisão ${decision.id}`,
        knowledgeIds,
      );

      if (!Array.isArray(decision.options) || decision.options.length !== 3) {
        throw new Error(`A decisão ${decision.id} precisa de três análises.`);
      }

      const optionIds = new Set();
      const optionPoints = new Set();

      for (const option of decision.options) {
        requireText(option.id, `${decision.id}.option.id`);
        requireText(option.label, `${decision.id}.${option.id}.label`);
        requireText(option.feedback, `${decision.id}.${option.id}.feedback`);

        if (optionIds.has(option.id)) {
          throw new Error(`Alternativa duplicada em ${decision.id}.`);
        }
        optionIds.add(option.id);
        optionPoints.add(option.points);
      }

      if (
        optionPoints.size !== 3 ||
        ![1, 2, 3].every((points) => optionPoints.has(points))
      ) {
        throw new Error(
          `A decisão ${decision.id} deve oferecer leituras de 1, 2 e 3 pontos.`,
        );
      }
    }
  }

  return true;
}

/**
 * Cria o baralho usado em uma tentativa. O identificador interno da opção
 * permanece estável para a correção, mas a posição A/B/C muda em cada sessão.
 */
export function buildCustoVicioCaseSession(caseId, seed = Date.now()) {
  const caseItem = getCustoVicioCase(caseId);

  if (!caseItem) {
    throw new Error('O personagem escolhido não existe.');
  }

  const random = createSeededRandom(seed);

  return {
    ...caseItem,
    decisions: caseItem.decisions.map((decision) => ({
      ...decision,
      options: shuffleWithRandom(decision.options, random),
    })),
  };
}

function getInsightProfile(score) {
  if (score <= 72) {
    return {
      id: 'observador',
      label: 'Observador atento',
      summary:
        'Você identificou impactos imediatos. Na revisão, tente conectar cada escolha a metas, tempo e rede de apoio.',
    };
  }

  if (score <= 88) {
    return {
      id: 'estrategista',
      label: 'Estrategista financeiro',
      summary:
        'Você relacionou gastos recorrentes, planejamento e consequências. Ainda pode ampliar a análise para custos sociais.',
    };
  }

  return {
    id: 'sistemico',
    label: 'Analista sistêmico',
    summary:
      'Você integrou dinheiro, tempo, saúde, contexto social e apoio sem culpabilizar o personagem.',
  };
}

function normalizeAnswers(caseItem, answers) {
  if (!Array.isArray(answers)) {
    throw new Error('As análises da atividade são inválidas.');
  }

  const answerMap = new Map();

  for (const answer of answers) {
    const decisionId = requireText(answer?.decisionId, 'answer.decisionId');
    const optionId = requireText(answer?.optionId, 'answer.optionId');

    if (answerMap.has(decisionId)) {
      throw new Error(`A decisão ${decisionId} foi respondida mais de uma vez.`);
    }

    answerMap.set(decisionId, optionId);
  }

  return caseItem.decisions.map((decision) => {
    const optionId = answerMap.get(decision.id);
    const selectedOption = decision.options.find(
      (option) => option.id === optionId,
    );

    if (!selectedOption) {
      throw new Error(`Falta analisar a decisão ${decision.id}.`);
    }

    return {
      decisionId: decision.id,
      moment: decision.moment,
      optionId: selectedOption.id,
      points: selectedOption.points,
      insightLabel: selectedOption.insightLabel,
      principle: selectedOption.principle,
      feedback: selectedOption.feedback,
    };
  });
}

export function calculateCustoVicioResult(caseId, answers) {
  const caseItem = getCustoVicioCase(caseId);

  if (!caseItem) {
    throw new Error('O personagem escolhido não existe.');
  }

  const normalizedAnswers = normalizeAnswers(caseItem, answers);
  const totalPoints = normalizedAnswers.reduce(
    (sum, answer) => sum + answer.points,
    0,
  );
  const score = Math.round(
    CUSTO_VICIO_MIN_SCORE +
      ((totalPoints - CUSTO_VICIO_MIN_POINTS) /
        (CUSTO_VICIO_MAX_POINTS - CUSTO_VICIO_MIN_POINTS)) *
        (CUSTO_VICIO_MAX_SCORE - CUSTO_VICIO_MIN_SCORE),
  );

  return {
    caseId: caseItem.id,
    characterName: caseItem.name,
    totalPoints,
    maximumPoints: CUSTO_VICIO_MAX_POINTS,
    score,
    insightProfile: getInsightProfile(score),
    answers: normalizedAnswers,
  };
}

export function toCustoVicioActivityResult(caseResult) {
  if (
    !caseResult ||
    !Number.isInteger(caseResult.score) ||
    caseResult.answers?.length !== CUSTO_VICIO_DECISION_COUNT
  ) {
    throw new Error('O resultado do estudo de caso é inválido.');
  }

  return {
    score: caseResult.score,
    correctAnswers: CUSTO_VICIO_DECISION_COUNT,
    wrongAnswers: 0,
  };
}
