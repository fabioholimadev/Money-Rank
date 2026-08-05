import {
  ENGENHARIA_DESEJO_ACTIVITY,
  engenhariaDesejoAdBank,
} from '../data/engenhariaDesejoAds.js';

export const ENGENHARIA_DESEJO_CARD_COUNT = 6;
export const ENGENHARIA_DESEJO_REAL_CARD_COUNT = 3;
export const ENGENHARIA_DESEJO_INVENTED_CARD_COUNT = 3;

export const ENGENHARIA_DESEJO_CLASSIFICATIONS = {
  REAL: 'REAL',
  INVENTED: 'INVENTED',
};

const RESPONSE_LABELS = {
  REAL: 'Isso realmente foi veiculado',
  INVENTED: 'É uma peça inventada',
};

function hashSeed(seed) {
  const normalized = String(seed ?? Date.now());
  let hash = 2166136261;

  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed) {
  let state = hashSeed(seed) || 1;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [
      shuffled[target],
      shuffled[index],
    ];
  }

  return shuffled;
}

function requireText(value, fieldName, cardId) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`O card ${cardId} não possui ${fieldName}.`);
  }
}

export function validateEngenhariaDesejoBank(bank = engenhariaDesejoAdBank) {
  if (!Array.isArray(bank)) {
    throw new Error('O banco da Engenharia do Desejo deve ser uma lista.');
  }

  const identifiers = new Set();
  let realCount = 0;
  let inventedCount = 0;

  bank.forEach((card) => {
    requireText(card?.id, 'identificador', 'sem identificador');

    if (identifiers.has(card.id)) {
      throw new Error(`O identificador ${card.id} está duplicado.`);
    }

    identifiers.add(card.id);
    requireText(card.title, 'título', card.id);
    requireText(card.scenario, 'descrição', card.id);
    requireText(card.channel, 'canal', card.id);
    requireText(card.location, 'local', card.id);
    requireText(card.observedAt, 'período', card.id);
    requireText(card.explanation, 'explicação', card.id);
    requireText(card.tactic?.label, 'tática de persuasão', card.id);
    requireText(card.tactic?.explanation, 'análise da tática', card.id);

    if (card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL) {
      realCount += 1;
      requireText(card.evidence?.institution, 'instituição da fonte', card.id);
      requireText(card.evidence?.title, 'título da fonte', card.id);
      requireText(card.evidence?.accessedAt, 'data de consulta', card.id);

      if (!card.evidence?.url?.startsWith('https://')) {
        throw new Error(`A fonte real do card ${card.id} deve usar HTTPS.`);
      }

      if (card.review?.technical !== 'source_verified') {
        throw new Error(`O card real ${card.id} não foi marcado como verificado.`);
      }

      return;
    }

    if (
      card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED
    ) {
      inventedCount += 1;

      if (card.evidence !== null) {
        throw new Error(`O card inventado ${card.id} não pode citar uma fonte.`);
      }

      if (card.review?.technical !== 'project_created') {
        throw new Error(`O card inventado ${card.id} não foi identificado.`);
      }

      return;
    }

    throw new Error(`O card ${card.id} possui classificação inválida.`);
  });

  if (realCount < ENGENHARIA_DESEJO_REAL_CARD_COUNT) {
    throw new Error('O banco não possui peças reais suficientes.');
  }

  if (inventedCount < ENGENHARIA_DESEJO_INVENTED_CARD_COUNT) {
    throw new Error('O banco não possui peças inventadas suficientes.');
  }

  return {
    total: bank.length,
    realCount,
    inventedCount,
  };
}

function createResponseOptions(random) {
  return shuffle(
    Object.values(ENGENHARIA_DESEJO_CLASSIFICATIONS).map((classification) => ({
      id: classification.toLowerCase(),
      classification,
      label: RESPONSE_LABELS[classification],
    })),
    random,
  );
}

export function buildEngenhariaDesejoSession(
  seed = Date.now(),
  bank = engenhariaDesejoAdBank,
) {
  validateEngenhariaDesejoBank(bank);
  const random = createSeededRandom(seed);
  const realCards = shuffle(
    bank.filter(
      (card) => card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL,
    ),
    random,
  ).slice(0, ENGENHARIA_DESEJO_REAL_CARD_COUNT);
  const inventedCards = shuffle(
    bank.filter(
      (card) =>
        card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED,
    ),
    random,
  ).slice(0, ENGENHARIA_DESEJO_INVENTED_CARD_COUNT);

  return {
    id: `${ENGENHARIA_DESEJO_ACTIVITY.id}-${hashSeed(seed)}`,
    seed,
    cards: shuffle([...realCards, ...inventedCards], random).map((card) => ({
      ...card,
      responseOptions: createResponseOptions(random),
    })),
  };
}

export function evaluateEngenhariaDesejoChoice(card, selectedClassification) {
  if (!card) {
    throw new Error('Selecione uma peça antes de responder.');
  }

  if (!Object.values(ENGENHARIA_DESEJO_CLASSIFICATIONS).includes(
    selectedClassification,
  )) {
    throw new Error('Selecione uma classificação válida.');
  }

  return {
    cardId: card.id,
    selectedClassification,
    correctClassification: card.classification,
    correct: selectedClassification === card.classification,
  };
}

export function calculateEngenhariaDesejoResult(
  session,
  answers,
  activity = ENGENHARIA_DESEJO_ACTIVITY,
) {
  if (!session?.cards || session.cards.length !== ENGENHARIA_DESEJO_CARD_COUNT) {
    throw new Error('A rodada deve conter exatamente seis peças.');
  }

  if (!Array.isArray(answers) || answers.length !== session.cards.length) {
    throw new Error('Responda todas as peças antes de calcular o resultado.');
  }

  const answerByCard = new Map(
    answers.map((answer) => [answer.cardId, answer]),
  );

  if (answerByCard.size !== session.cards.length) {
    throw new Error('A rodada contém respostas ausentes ou duplicadas.');
  }

  const reviewedAnswers = session.cards.map((card) => {
    const answer = answerByCard.get(card.id);

    if (!answer) {
      throw new Error(`A peça ${card.id} não foi respondida.`);
    }

    return {
      ...evaluateEngenhariaDesejoChoice(
        card,
        answer.selectedClassification,
      ),
      title: card.title,
      classification: card.classification,
      location: card.location,
      evidence: card.evidence,
    };
  });
  const correctAnswers = reviewedAnswers.filter((answer) => answer.correct)
    .length;
  const wrongAnswers = reviewedAnswers.length - correctAnswers;
  const score = Math.round((correctAnswers / reviewedAnswers.length) * 100);

  return {
    score,
    correctAnswers,
    wrongAnswers,
    passed:
      correctAnswers >= activity.passingCorrectAnswers,
    answers: reviewedAnswers,
    profile: getEngenhariaDesejoProfile(correctAnswers),
  };
}

export function getEngenhariaDesejoProfile(correctAnswers) {
  if (correctAnswers === ENGENHARIA_DESEJO_CARD_COUNT) {
    return {
      title: 'Olhar de auditor',
      description:
        'Você separou evidência de invenção em todas as peças da rodada.',
    };
  }

  if (correctAnswers === ENGENHARIA_DESEJO_CARD_COUNT - 1) {
    return {
      title: 'Radar publicitário afiado',
      description:
        'Você reconheceu quase todas as estratégias e conferiu as evidências com cuidado.',
    };
  }

  if (correctAnswers >= ENGENHARIA_DESEJO_ACTIVITY.passingCorrectAnswers) {
    return {
      title: 'Leitura crítica em ação',
      description:
        'Você atingiu a meta. Continue verificando fonte, promessa e público-alvo.',
    };
  }

  return {
    title: 'Radar em treinamento',
    description:
      'Reveja as fontes e observe como urgência, autoridade e recompensa desviam a atenção do risco.',
  };
}

export function toEngenhariaDesejoActivityResult(result) {
  return {
    score: result.score,
    correctAnswers: result.correctAnswers,
    wrongAnswers: result.wrongAnswers,
  };
}
