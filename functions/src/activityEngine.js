import manifest from './generated/activity-manifest.json' with { type: 'json' };

export const ACTIVITY_IDS_BY_PHASE = Object.freeze({
  1: 'perigo-doce-quiz',
  2: 'custo-vicio',
  3: 'ilusao-dinheiro-caminhos-v1',
  4: 'engenharia-desejo-fato-fake-v1',
});

const activities = manifest.activities;

function requireArray(value, message) {
  if (!Array.isArray(value)) throw new Error(message);
  return value;
}

function answerMap(answers, itemField, choiceField) {
  const normalized = new Map();

  for (const answer of requireArray(answers, 'Respostas inválidas.')) {
    const itemId = String(answer?.[itemField] ?? '').trim();
    const choiceId = String(answer?.[choiceField] ?? '').trim();

    if (!itemId || !choiceId || normalized.has(itemId)) {
      throw new Error('A atividade contém respostas ausentes ou duplicadas.');
    }

    normalized.set(itemId, choiceId);
  }

  return normalized;
}

function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function getActivityDefinition(phaseNumber, overrideDefinition = null) {
  const activityId = ACTIVITY_IDS_BY_PHASE[Number(phaseNumber)];
  const definition = overrideDefinition ?? (activityId ? activities[activityId] : null);

  if (!definition || definition.phaseNumber !== Number(phaseNumber)) {
    throw new Error('A fase informada não possui atividade autoritativa.');
  }

  return { activityId, definition };
}

export function buildStaticSession(
  phaseNumber,
  {
    variantId = null,
    random = Math.random,
    definition: overrideDefinition = null,
  } = {},
) {
  const { activityId, definition } = getActivityDefinition(
    phaseNumber,
    overrideDefinition,
  );

  if (phaseNumber === 2) {
    const selectedCase = definition.cases.find(
      (caseItem) => caseItem.id === variantId,
    );
    if (!selectedCase) throw new Error('O personagem escolhido não existe.');

    return {
      activityId: `custo-vicio-case-${selectedCase.id}`,
      variantId: selectedCase.id,
      contentVersion: definition.contentVersion,
      publicPayload: {
        variantId: selectedCase.id,
        caseData: overrideDefinition ? selectedCase : undefined,
      },
      answerKey: { decisions: selectedCase.decisions },
    };
  }

  if (phaseNumber === 3) {
    return {
      activityId,
      variantId: null,
      contentVersion: definition.contentVersion,
      publicPayload: {
        mission: overrideDefinition ? definition : undefined,
      },
      answerKey: { decisions: definition.decisions },
    };
  }

  if (phaseNumber === 4) {
    const realCards = shuffle(
      definition.cards.filter((card) => card.classification === 'REAL'),
      random,
    ).slice(0, 3);
    const inventedCards = shuffle(
      definition.cards.filter((card) => card.classification === 'INVENTED'),
      random,
    ).slice(0, 3);
    const cards = shuffle([...realCards, ...inventedCards], random);

    return {
      activityId,
      variantId: null,
      contentVersion: definition.contentVersion,
      publicPayload: {
        cardIds: cards.map((card) => card.id),
        cards: overrideDefinition ? cards : undefined,
      },
      answerKey: { cards },
    };
  }

  throw new Error('A Fase 1 exige uma sessão de quiz preparada no servidor.');
}

function scorePerigoDoce(answerKey, answers) {
  const expected = requireArray(
    answerKey?.questions,
    'Gabarito do quiz inválido.',
  );
  const submitted = answerMap(answers, 'questionId', 'optionId');
  if (expected.length !== 5 || submitted.size !== expected.length) {
    throw new Error('Responda as cinco questões antes de enviar.');
  }

  const correctAnswers = expected.filter(
    (question) => submitted.get(question.id) === question.correctOptionId,
  ).length;

  return resultFromCorrectAnswers(correctAnswers, expected.length, 60);
}

function scoreCustoVicio(answerKey, answers) {
  const decisions = requireArray(
    answerKey?.decisions,
    'Gabarito do estudo de caso inválido.',
  );
  const submitted = answerMap(answers, 'decisionId', 'optionId');
  if (decisions.length !== 5 || submitted.size !== decisions.length) {
    throw new Error('Analise as cinco decisões antes de enviar.');
  }

  const points = decisions.reduce((total, decision) => {
    const option = decision.options.find(
      (item) => item.id === submitted.get(decision.id),
    );
    if (!option) throw new Error(`Resposta inválida em ${decision.id}.`);
    return total + option.points;
  }, 0);
  const score = Math.round(60 + ((points - 5) / 10) * 40);

  return { score, correctAnswers: 5, wrongAnswers: 0, passed: true };
}

function scoreIlusaoDinheiro(answerKey, answers) {
  const decisions = requireArray(
    answerKey?.decisions,
    'Gabarito dos caminhos inválido.',
  );
  const submitted = answerMap(answers, 'decisionId', 'choiceId');
  if (decisions.length !== 6 || submitted.size !== decisions.length) {
    throw new Error('Tome as seis decisões antes de enviar.');
  }

  let analysisPoints = 0;
  let strategicChoices = 0;
  for (const decision of decisions) {
    const choice = decision.choices.find(
      (item) => item.id === submitted.get(decision.id),
    );
    if (!choice) throw new Error(`Resposta inválida em ${decision.id}.`);
    analysisPoints += choice.analysisPoints;
    if (choice.analysisPoints > 0) strategicChoices += 1;
  }

  const score = Math.round((analysisPoints / 12) * 100);
  return {
    score,
    correctAnswers: strategicChoices,
    wrongAnswers: decisions.length - strategicChoices,
    passed: score >= 60,
  };
}

function scoreEngenhariaDesejo(answerKey, answers) {
  const cards = requireArray(
    answerKey?.cards,
    'Gabarito da investigação inválido.',
  );
  const submitted = answerMap(
    answers,
    'cardId',
    'selectedClassification',
  );
  if (cards.length !== 6 || submitted.size !== cards.length) {
    throw new Error('Classifique as seis peças antes de enviar.');
  }

  const correctAnswers = cards.filter((card) => {
    const classification = submitted.get(card.id);
    if (!['REAL', 'INVENTED'].includes(classification)) {
      throw new Error(`Classificação inválida em ${card.id}.`);
    }
    return classification === card.classification;
  }).length;

  return resultFromCorrectAnswers(correctAnswers, cards.length, 60);
}

function resultFromCorrectAnswers(correctAnswers, total, passingScore) {
  const score = Math.round((correctAnswers / total) * 100);
  return {
    score,
    correctAnswers,
    wrongAnswers: total - correctAnswers,
    passed: score >= passingScore,
  };
}

export function scoreActivitySession(session, answers) {
  switch (session?.phaseNumber) {
    case 1:
      return scorePerigoDoce(session.answerKey, answers);
    case 2:
      return scoreCustoVicio(session.answerKey, answers);
    case 3:
      return scoreIlusaoDinheiro(session.answerKey, answers);
    case 4:
      return scoreEngenhariaDesejo(session.answerKey, answers);
    default:
      throw new Error('Sessão de atividade inválida.');
  }
}

export function getPerigoDoceDefinition(overrideDefinition = null) {
  return overrideDefinition ?? activities['perigo-doce-quiz'];
}
