import legacyManifest from './generated/activity-manifest.json' with { type: 'json' };
import pedagogicalBank from './generated/pedagogical-bank.json' with { type: 'json' };

export const ACTIVITY_IDS_BY_PHASE = Object.freeze({
  1: 'perigo-doce-quiz',
  2: 'custo-vicio',
  3: 'ilusao-dinheiro-caminhos-v1',
  4: 'engenharia-desejo-fato-fake-v1',
});

const CHARACTER_NAMES = Object.freeze({
  'lara-consumo-social': 'Lara',
  'miguel-apostas': 'Miguel',
  'rafael-vape': 'Rafael',
});

const activeItems = pedagogicalBank.items.filter((item) => item.active);

function requireArray(value, message) {
  if (!Array.isArray(value)) throw new Error(message);
  return value;
}

function answerMap(answers, itemField, choiceField) {
  const normalized = new Map();
  for (const answer of requireArray(answers, 'Respostas inválidas.')) {
    const itemId = String(answer?.[itemField] ?? '').trim();
    const choiceId = String(answer?.[choiceField] ?? '').trim().toUpperCase();
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

function publicItem(item) {
  return {
    id: item.itemId,
    itemId: item.itemId,
    prompt: item.publicPayload.prompt,
    difficulty: item.difficulty,
    tags: item.tags,
    options: item.publicPayload.options.map((option) => ({
      id: option.id,
      label: option.label,
      text: option.label,
    })),
    ...(item.characterId ? { characterId: item.characterId } : {}),
    ...(item.stage ? { stage: item.stage } : {}),
    ...(item.publicPayload.stageName
      ? { stageName: item.publicPayload.stageName }
      : {}),
  };
}

function privateItem(item) {
  return {
    itemId: item.itemId,
    difficulty: item.difficulty,
    characterId: item.characterId,
    stage: item.stage,
    pathCondition: item.pathCondition,
    tags: item.tags,
    ...item.secretPayload,
  };
}

function resetCycleIfExhausted(candidates, seenIds) {
  const seen = new Set(seenIds ?? []);
  return candidates.every((item) => seen.has(item.itemId)) ? new Set() : seen;
}

function chooseQuota(candidates, quota, seenIds, random) {
  const seen = resetCycleIfExhausted(candidates, seenIds);
  const chosen = [];
  for (const [difficulty, count] of Object.entries(quota)) {
    const pool = candidates.filter((item) => item.difficulty === difficulty);
    let available = shuffle(pool.filter((item) => !seen.has(item.itemId)), random);
    if (available.length < count) available = shuffle(pool, random);
    if (available.length < count) {
      throw new Error(`Banco insuficiente para a dificuldade ${difficulty}.`);
    }
    chosen.push(...available.slice(0, count));
  }
  return shuffle(chosen, random);
}

function chooseEngineeringCards(candidates, seenIds, random) {
  const seen = resetCycleIfExhausted(candidates, seenIds);
  const themes = shuffle([...new Set(candidates.map((item) => item.tags[1]))], random);
  const targets = [
    ['EASY', 'A'], ['EASY', 'A'],
    ['MEDIUM', 'A'], ['MEDIUM', 'A'],
    ['MEDIUM', 'B'], ['MEDIUM', 'B'],
    ['HARD', 'B'], ['HARD', 'B'],
  ];

  function attempt(allowSeen) {
    const assignments = shuffle(targets, random);
    const chosen = [];
    for (let index = 0; index < themes.length; index += 1) {
      const [difficulty, correctOptionId] = assignments[index];
      const matches = shuffle(candidates.filter((item) =>
        item.tags[1] === themes[index]
        && item.difficulty === difficulty
        && item.secretPayload.correctOptionId === correctOptionId
        && (allowSeen || !seen.has(item.itemId))), random);
      if (!matches.length) return null;
      chosen.push(matches[0]);
    }
    return shuffle(chosen, random);
  }

  const selected = attempt(false) ?? attempt(true);
  if (!selected || selected.length !== 8) {
    throw new Error('O banco não permite uma rodada 2/4/2, 4 V/4 F e um card por tema.');
  }
  return selected;
}

function itemsForPhase(phaseNumber, definition = null) {
  if (Array.isArray(definition?.items)) return definition.items;
  const activityId = ACTIVITY_IDS_BY_PHASE[Number(phaseNumber)];
  return activeItems.filter((item) => item.activityId === activityId);
}

export function getActivityDefinition(phaseNumber, overrideDefinition = null) {
  const activityId = ACTIVITY_IDS_BY_PHASE[Number(phaseNumber)];
  const items = itemsForPhase(phaseNumber, overrideDefinition);
  if (!activityId || !items.length) {
    throw new Error('A fase informada não possui atividade autoritativa.');
  }
  return {
    activityId,
    definition: {
      phaseNumber: Number(phaseNumber),
      contentVersion: pedagogicalBank.loadVersion,
      items,
    },
  };
}

export function buildStaticSession(
  phaseNumber,
  {
    variantId = null,
    random = Math.random,
    definition: overrideDefinition = null,
    seenItemIds = [],
  } = {},
) {
  const { activityId, definition } = getActivityDefinition(
    phaseNumber,
    overrideDefinition,
  );
  const items = definition.items;
  let selected;
  let publicPayload;

  if (Number(phaseNumber) === 1) {
    selected = chooseQuota(items, { EASY: 2, MEDIUM: 2, HARD: 1 }, seenItemIds, random);
    publicPayload = {
      source: 'pedagogical-bank',
      questions: selected.map(publicItem),
    };
  } else if (Number(phaseNumber) === 2) {
    const characterIds = [...new Set(items.map((item) => item.characterId))];
    const characterId = variantId || shuffle(characterIds, random)[0];
    const characterItems = items.filter((item) => item.characterId === characterId);
    if (!characterItems.length) throw new Error('O personagem escolhido não existe.');
    selected = chooseQuota(
      characterItems,
      { EASY: 2, MEDIUM: 2, HARD: 2 },
      seenItemIds,
      random,
    );
    publicPayload = {
      variantId: characterId,
      caseData: {
        id: characterId,
        name: CHARACTER_NAMES[characterId] ?? characterId,
        decisions: selected.map((item) => ({
          ...publicItem(item),
          narrative: item.publicPayload.prompt,
          question: item.publicPayload.prompt,
        })),
      },
    };
  } else if (Number(phaseNumber) === 3) {
    const stageOne = items.filter((item) => item.stage === 1);
    selected = [shuffle(stageOne.filter((item) => !new Set(seenItemIds).has(item.itemId)), random)[0]
      ?? shuffle(stageOne, random)[0]];
    publicPayload = {
      mission: {
        id: activityId,
        initialCredit: 100,
        minCredit: 0,
        maxCredit: 120,
        currentStage: 1,
        currentItem: publicItem(selected[0]),
      },
    };
  } else if (Number(phaseNumber) === 4) {
    selected = chooseEngineeringCards(items, seenItemIds, random);
    publicPayload = {
      cardIds: selected.map((item) => item.itemId),
      cards: selected.map(publicItem),
    };
  } else {
    throw new Error('Fase autoritativa inválida.');
  }

  return {
    activityId,
    variantId: Number(phaseNumber) === 2 ? publicPayload.variantId : null,
    contentVersion: definition.contentVersion,
    publicPayload,
    answerKey: {
      items: (Number(phaseNumber) === 3 ? items : selected).map(privateItem),
      selectedItemIds: selected.map((item) => item.itemId),
      ...(Number(phaseNumber) === 3 ? {
        previouslySeenItemIds: [...seenItemIds],
        progress: { stage: 1, credit: 100, answers: [] },
      } : {}),
      sourceHash: pedagogicalBank.sourceHash,
    },
  };
}

export function advanceIlusaoDinheiroSession(answerKey, answer, random = Math.random) {
  const items = requireArray(answerKey?.items, 'Gabarito dos caminhos inválido.');
  const progress = answerKey?.progress ?? { stage: 1, credit: 100, answers: [] };
  if (progress.stage < 1 || progress.stage > 6) throw new Error('A missão já foi finalizada.');
  const itemId = String(answer?.itemId ?? answer?.decisionId ?? '').trim();
  const choiceId = String(answer?.choiceId ?? '').trim().toUpperCase();
  const selectedItem = items.find((item) => item.itemId === itemId);
  if (!selectedItem || selectedItem.stage !== progress.stage || !answerKey.selectedItemIds.includes(itemId)) {
    throw new Error('A resposta não pertence à etapa atual da missão.');
  }
  const previousAnswer = progress.answers.find((entry) => entry.decisionId === itemId);
  if (previousAnswer) {
    if (previousAnswer.choiceId !== choiceId) throw new Error('A etapa já foi respondida com outra escolha.');
    return { answerKey, completed: progress.stage > 6, currentCredit: progress.credit, nextItem: null, idempotentReplay: true };
  }
  const points = selectedItem.scores[choiceId];
  const delta = selectedItem.creditDeltas[choiceId];
  if (!Number.isInteger(points) || !Number.isInteger(delta)) throw new Error('Escolha inválida para esta etapa.');
  const credit = Math.max(0, Math.min(120, progress.credit + delta));
  const answers = [...progress.answers, { decisionId: itemId, choiceId }];
  const nextStage = progress.stage + 1;
  let nextItem = null;
  const selectedItemIds = [...answerKey.selectedItemIds];
  if (nextStage <= 6) {
    const band = creditBand(credit);
    const candidates = items.filter((item) => item.stage === nextStage && item.pathCondition === band);
    const seen = new Set([...(answerKey.previouslySeenItemIds ?? []), ...selectedItemIds]);
    nextItem = shuffle(candidates.filter((item) => !seen.has(item.itemId)), random)[0]
      ?? shuffle(candidates, random)[0];
    if (!nextItem) throw new Error(`Nenhum caminho disponível para a etapa ${nextStage}.`);
    selectedItemIds.push(nextItem.itemId);
  }
  return {
    answerKey: {
      ...answerKey,
      selectedItemIds,
      progress: { stage: nextStage, credit, answers },
    },
    completed: nextStage > 6,
    currentCredit: credit,
    nextItem: nextItem ? publicItem(nextItem) : null,
    idempotentReplay: false,
  };
}

function selectedPrivateItems(answerKey) {
  const items = requireArray(answerKey?.items, 'Gabarito da atividade inválido.');
  const selectedIds = new Set(answerKey?.selectedItemIds ?? items.map((item) => item.itemId));
  return items.filter((item) => selectedIds.has(item.itemId));
}

function resultFromCorrectAnswers(correctAnswers, total, passingCorrectAnswers) {
  const score = Math.round((correctAnswers / total) * 100);
  return {
    score,
    correctAnswers,
    wrongAnswers: total - correctAnswers,
    passed: correctAnswers >= passingCorrectAnswers,
  };
}

function scorePerigoDoce(answerKey, answers) {
  const expected = selectedPrivateItems(answerKey);
  const submitted = answerMap(answers, 'questionId', 'optionId');
  if (expected.length !== 5 || submitted.size !== 5) {
    throw new Error('Responda as cinco questões antes de enviar.');
  }
  const correctAnswers = expected.filter(
    (item) => submitted.get(item.itemId) === item.correctOptionId,
  ).length;
  return {
    ...resultFromCorrectAnswers(correctAnswers, 5, 3),
    feedback: expected.map((item) => ({
      itemId: item.itemId,
      selectedOptionId: submitted.get(item.itemId),
      correctOptionId: item.correctOptionId,
      explanation: item.explanation,
      source: item.source,
    })),
  };
}

function scoreCustoVicio(answerKey, answers) {
  const expected = selectedPrivateItems(answerKey);
  const submitted = answerMap(answers, 'decisionId', 'optionId');
  if (expected.length !== 6 || submitted.size !== 6) {
    throw new Error('Analise as seis decisões antes de enviar.');
  }
  const reviewed = expected.map((item) => {
    const optionId = submitted.get(item.itemId);
    const points = item.scores[optionId];
    if (!Number.isInteger(points)) throw new Error(`Resposta inválida em ${item.itemId}.`);
    return {
      itemId: item.itemId,
      optionId,
      points,
      feedback: item.feedback?.[optionId],
      explanation: item.explanation,
    };
  });
  const totalPoints = reviewed.reduce((sum, item) => sum + item.points, 0);
  const score = Math.round((totalPoints / 18) * 100);
  return {
    score,
    totalPoints,
    maximumPoints: 18,
    correctAnswers: reviewed.filter((item) => item.points === 3).length,
    wrongAnswers: reviewed.filter((item) => item.points < 3).length,
    passed: totalPoints >= 11,
    feedback: reviewed,
  };
}

function creditBand(credit) {
  if (credit < 40) return 'CRITICAL';
  if (credit < 70) return 'ALERT';
  if (credit < 100) return 'STABLE';
  return 'RESERVE';
}

function ilusaoEnding(credit, quality) {
  if (credit < 30 || quality < 40) return 'ENDIVIDAMENTO';
  if (credit >= 80 && quality >= 70) return 'EQUILIBRIO';
  if (credit >= 50 && quality >= 60) return 'RECUPERACAO';
  return 'FRAGILIDADE';
}

function scoreIlusaoDinheiro(answerKey, answers) {
  const allItems = requireArray(answerKey?.items, 'Gabarito dos caminhos inválido.');
  const submitted = answerMap(answers, 'decisionId', 'choiceId');
  if (submitted.size !== 6) throw new Error('Tome as seis decisões antes de enviar.');
  let credit = 100;
  let qualityPoints = 0;
  const reviewed = [];
  const selectedIds = [];

  for (let stage = 1; stage <= 6; stage += 1) {
    const expectedCondition = stage === 1 ? null : creditBand(credit);
    const candidates = allItems.filter((item) =>
      item.stage === stage
      && (stage === 1 || item.pathCondition === expectedCondition));
    const selected = candidates.find((item) => submitted.has(item.itemId));
    if (!selected) throw new Error(`A resposta da etapa ${stage} não corresponde ao caminho de crédito.`);
    const choiceId = submitted.get(selected.itemId);
    const points = selected.scores[choiceId];
    const delta = selected.creditDeltas[choiceId];
    if (!Number.isInteger(points) || !Number.isInteger(delta)) {
      throw new Error(`Resposta inválida em ${selected.itemId}.`);
    }
    const creditBefore = credit;
    credit = Math.max(0, Math.min(120, credit + delta));
    qualityPoints += points;
    selectedIds.push(selected.itemId);
    reviewed.push({
      itemId: selected.itemId,
      choiceId,
      points,
      creditBefore,
      creditAfter: credit,
      explanation: selected.explanation,
    });
  }
  const quality = Math.round((qualityPoints / 18) * 100);
  const creditScore = Math.round((Math.min(credit, 100) / 100) * 100);
  const score = Math.round(quality * 0.7 + creditScore * 0.3);
  return {
    score,
    quality,
    creditScore,
    finalCredit: credit,
    ending: ilusaoEnding(credit, quality),
    correctAnswers: reviewed.filter((item) => item.points >= 2).length,
    wrongAnswers: reviewed.filter((item) => item.points < 2).length,
    passed: score >= 60,
    selectedItemIds: selectedIds,
    feedback: reviewed,
  };
}

function scoreEngenhariaDesejo(answerKey, answers) {
  const expected = selectedPrivateItems(answerKey);
  const normalizedAnswers = requireArray(answers, 'Respostas inválidas.').map((answer) => ({
    cardId: answer.cardId,
    optionId: answer.optionId
      ?? (answer.selectedClassification === 'REAL' ? 'A' : answer.selectedClassification === 'INVENTED' ? 'B' : ''),
  }));
  const submitted = answerMap(normalizedAnswers, 'cardId', 'optionId');
  if (expected.length !== 8 || submitted.size !== 8) {
    throw new Error('Classifique os oito cards antes de enviar.');
  }
  const correctAnswers = expected.filter(
    (item) => submitted.get(item.itemId) === item.correctOptionId,
  ).length;
  return {
    ...resultFromCorrectAnswers(correctAnswers, 8, 5),
    feedback: expected.map((item) => ({
      itemId: item.itemId,
      selectedOptionId: submitted.get(item.itemId),
      correctOptionId: item.correctOptionId,
      explanation: item.explanation,
      source: item.source,
    })),
  };
}

export function scoreActivitySession(session, answers) {
  switch (Number(session?.phaseNumber)) {
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

// Keep the historical knowledge base available only to the legacy AI helper.
export function getPerigoDoceDefinition(overrideDefinition = null) {
  return overrideDefinition ?? legacyManifest.activities['perigo-doce-quiz'];
}
