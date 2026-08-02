import {
  ilusaoDinheiroKnowledge,
  ilusaoDinheiroMission,
} from '../data/ilusaoDinheiroPaths.js';

export const ILUSAO_DINHEIRO_DECISION_COUNT = 6;
export const ILUSAO_DINHEIRO_MAX_ANALYSIS_POINTS =
  ILUSAO_DINHEIRO_DECISION_COUNT * 2;
export const ILUSAO_DINHEIRO_PASSING_SCORE = 60;

function requireText(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Campo obrigatório ausente: ${field}.`);
  }

  return value.trim();
}

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

function validateSourceIds(sourceFactIds, field, knowledgeIds) {
  if (
    !Array.isArray(sourceFactIds) ||
    sourceFactIds.length === 0 ||
    sourceFactIds.some((factId) => !knowledgeIds.has(factId))
  ) {
    throw new Error(`Fonte inválida em ${field}.`);
  }
}

export function validateIlusaoDinheiroMission() {
  const knowledgeIds = new Set(
    ilusaoDinheiroKnowledge.map(({ id }) => id),
  );
  const decisionIds = new Set();

  requireText(ilusaoDinheiroMission.id, 'mission.id');
  requireText(ilusaoDinheiroMission.title, 'mission.title');
  validateSourceIds(
    ilusaoDinheiroMission.sourceFactIds,
    'missão',
    knowledgeIds,
  );

  if (
    !Number.isInteger(ilusaoDinheiroMission.initialBalance) ||
    ilusaoDinheiroMission.initialBalance <= 0 ||
    !Number.isInteger(ilusaoDinheiroMission.goalCost) ||
    ilusaoDinheiroMission.goalCost <= 0
  ) {
    throw new Error('Saldo inicial ou meta inválida na missão.');
  }

  if (
    !Array.isArray(ilusaoDinheiroMission.decisions) ||
    ilusaoDinheiroMission.decisions.length !==
      ILUSAO_DINHEIRO_DECISION_COUNT
  ) {
    throw new Error(
      `A missão precisa de ${ILUSAO_DINHEIRO_DECISION_COUNT} decisões.`,
    );
  }

  for (const decision of ilusaoDinheiroMission.decisions) {
    requireText(decision.id, 'decision.id');
    requireText(decision.narrative, `${decision.id}.narrative`);
    requireText(decision.question, `${decision.id}.question`);

    if (decisionIds.has(decision.id)) {
      throw new Error(`Decisão duplicada: ${decision.id}.`);
    }
    decisionIds.add(decision.id);
    validateSourceIds(decision.sourceFactIds, decision.id, knowledgeIds);

    if (!Array.isArray(decision.choices) || decision.choices.length !== 3) {
      throw new Error(`A decisão ${decision.id} precisa de três caminhos.`);
    }

    const choiceIds = new Set();
    const points = new Set();

    for (const choice of decision.choices) {
      requireText(choice.id, `${decision.id}.choice.id`);
      requireText(choice.label, `${decision.id}.${choice.id}.label`);
      requireText(
        choice.consequence,
        `${decision.id}.${choice.id}.consequence`,
      );

      if (choiceIds.has(choice.id)) {
        throw new Error(`Caminho duplicado em ${decision.id}.`);
      }
      choiceIds.add(choice.id);
      points.add(choice.analysisPoints);

      if (!Number.isInteger(choice.balanceDelta)) {
        throw new Error(`Variação de saldo inválida em ${decision.id}.`);
      }
    }

    if (![0, 1, 2].every((value) => points.has(value))) {
      throw new Error(
        `A decisão ${decision.id} deve ter caminhos de 0, 1 e 2 pontos.`,
      );
    }
  }

  return true;
}

export function buildIlusaoDinheiroSession(seed = Date.now()) {
  const random = createSeededRandom(seed);

  return {
    ...ilusaoDinheiroMission,
    decisions: ilusaoDinheiroMission.decisions.map((decision) => ({
      ...decision,
      choices: shuffleWithRandom(decision.choices, random),
    })),
  };
}

function normalizeAnswers(answers) {
  if (!Array.isArray(answers)) {
    throw new Error('As escolhas da missão são inválidas.');
  }

  const answerMap = new Map();

  for (const answer of answers) {
    const decisionId = requireText(answer?.decisionId, 'answer.decisionId');
    const choiceId = requireText(answer?.choiceId, 'answer.choiceId');

    if (answerMap.has(decisionId)) {
      throw new Error(`A decisão ${decisionId} foi respondida mais de uma vez.`);
    }
    answerMap.set(decisionId, choiceId);
  }

  let runningBalance = ilusaoDinheiroMission.initialBalance;

  return ilusaoDinheiroMission.decisions.map((decision) => {
    const choiceId = answerMap.get(decision.id);
    const selectedChoice = decision.choices.find(
      (choice) => choice.id === choiceId,
    );

    if (!selectedChoice) {
      throw new Error(`Falta escolher um caminho em ${decision.id}.`);
    }

    const balanceBefore = runningBalance;
    runningBalance += selectedChoice.balanceDelta;

    return {
      decisionId: decision.id,
      stepLabel: decision.stepLabel,
      choiceId: selectedChoice.id,
      analysisPoints: selectedChoice.analysisPoints,
      balanceDelta: selectedChoice.balanceDelta,
      balanceBefore,
      balanceAfter: runningBalance,
      consequence: selectedChoice.consequence,
      principle: selectedChoice.principle,
    };
  });
}

function getEnding(finalBalance, score) {
  if (
    score >= ILUSAO_DINHEIRO_PASSING_SCORE &&
    finalBalance >= ilusaoDinheiroMission.goalCost
  ) {
    return {
      id: 'goal-achieved',
      title: 'Meta protegida',
      description:
        'Alex chegou ao fim com recursos para a feira técnica. As pausas e comparações impediram que ofertas paralelas ocupassem o lugar da meta.',
    };
  }

  if (score >= ILUSAO_DINHEIRO_PASSING_SCORE) {
    return {
      id: 'recovery-plan',
      title: 'Plano de recuperação',
      description:
        'Alex reconheceu as armadilhas mais importantes, mas parte do saldo foi comprometida. A meta precisará de um novo prazo e de um plano de reposição.',
    };
  }

  if (finalBalance < 0) {
    return {
      id: 'overcommitted',
      title: 'Futuro comprometido',
      description:
        'As compras e os compromissos ultrapassaram o caixa simulado. Alex precisará reorganizar despesas e refazer o caminho antes de financiar a meta.',
    };
  }

  return {
    id: 'goal-delayed',
    title: 'Meta adiada',
    description:
      'O caixa permaneceu acima de zero, mas impulsos e pressões consumiram uma parte importante da meta. Um novo caminho pode preservar mais escolhas futuras.',
  };
}

export function calculateIlusaoDinheiroResult(answers) {
  const normalizedAnswers = normalizeAnswers(answers);
  const analysisPoints = normalizedAnswers.reduce(
    (sum, answer) => sum + answer.analysisPoints,
    0,
  );
  const score = Math.round(
    (analysisPoints / ILUSAO_DINHEIRO_MAX_ANALYSIS_POINTS) * 100,
  );
  const finalBalance = normalizedAnswers.at(-1).balanceAfter;
  const passed = score >= ILUSAO_DINHEIRO_PASSING_SCORE;

  return {
    score,
    passed,
    analysisPoints,
    maximumAnalysisPoints: ILUSAO_DINHEIRO_MAX_ANALYSIS_POINTS,
    initialBalance: ilusaoDinheiroMission.initialBalance,
    finalBalance,
    goalCost: ilusaoDinheiroMission.goalCost,
    goalGap: Math.max(ilusaoDinheiroMission.goalCost - finalBalance, 0),
    remainingAfterGoal: Math.max(
      finalBalance - ilusaoDinheiroMission.goalCost,
      0,
    ),
    ending: getEnding(finalBalance, score),
    answers: normalizedAnswers,
  };
}

export function toIlusaoDinheiroActivityResult(gameResult) {
  if (
    !gameResult ||
    !Number.isInteger(gameResult.score) ||
    gameResult.answers?.length !== ILUSAO_DINHEIRO_DECISION_COUNT
  ) {
    throw new Error('O resultado da missão é inválido.');
  }

  const strategicChoices = gameResult.answers.filter(
    ({ analysisPoints }) => analysisPoints > 0,
  ).length;

  return {
    score: gameResult.score,
    correctAnswers: strategicChoices,
    wrongAnswers: ILUSAO_DINHEIRO_DECISION_COUNT - strategicChoices,
  };
}
