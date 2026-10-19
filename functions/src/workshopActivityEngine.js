import {
  validateWorkshopQuestionBank,
  WORKSHOP_ACTIVITY_KEYS,
  WORKSHOP_QUESTION_BANK,
} from './workshopQuestionBank.js';

const DEFAULT_ROUND_SIZE = 6;
const MATCHING_ROUND_SIZE = 4;

function shuffled(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function rotateOptions(item, random) {
  const correct = item.options[item.correctIndex];
  const options = shuffled(item.options, random);
  return { options, correctIndex: options.indexOf(correct) };
}

export function buildWorkshopActivitySession(activityKey, {
  random = Math.random,
  seenItemIds = [],
} = {}) {
  validateWorkshopQuestionBank();
  const definition = WORKSHOP_ACTIVITY_KEYS[activityKey];
  const bank = WORKSHOP_QUESTION_BANK[activityKey];
  if (!definition || !bank) throw new Error('Atividade da oficina inválida.');
  const roundSize = activityKey === 'ligar-colunas'
    ? MATCHING_ROUND_SIZE
    : DEFAULT_ROUND_SIZE;
  const seen = new Set(seenItemIds);
  const unseen = bank.filter((item) => !seen.has(item.itemId));
  const pool = unseen.length >= roundSize ? unseen : bank;
  const selected = shuffled(pool, random).slice(0, roundSize);
  const prepared = activityKey === 'ligar-colunas'
    ? (() => {
      const rightColumn = shuffled(
        selected.map((item) => item.options[item.correctIndex]),
        random,
      );
      return selected.map((item) => ({
        item,
        options: rightColumn,
        correctIndex: rightColumn.indexOf(item.options[item.correctIndex]),
      }));
    })()
    : selected.map((item) => {
      const rotated = rotateOptions(item, random);
      return { item, ...rotated };
    });

  return {
    ...definition,
    activityKey,
    contentVersion: 'workshop-ciencia-delas-v1',
    publicPayload: {
      activityKey,
      roundSize,
      items: prepared.map(({ item, options }) => ({
        itemId: item.itemId,
        prompt: item.prompt,
        options,
      })),
    },
    answerKey: {
      activityKey,
      answers: prepared.map(({ item, correctIndex }) => ({
        itemId: item.itemId,
        correctIndex,
        explanation: item.explanation,
        sourceTitle: item.title,
        sourceUrl: item.url,
      })),
    },
  };
}

export function scoreWorkshopActivitySession(answerKey, submittedAnswers) {
  if (!Array.isArray(answerKey?.answers) || !Array.isArray(submittedAnswers)) {
    throw new Error('Respostas da oficina inválidas.');
  }
  const submitted = new Map(submittedAnswers.map((answer) => [
    String(answer?.itemId || ''),
    Number(answer?.answerIndex),
  ]));
  let correctAnswers = 0;
  const feedback = answerKey.answers.map((answer) => {
    const received = submitted.get(answer.itemId);
    const correct = Number.isInteger(received) && received === answer.correctIndex;
    if (correct) correctAnswers += 1;
    return {
      itemId: answer.itemId,
      correct,
      correctIndex: answer.correctIndex,
      explanation: answer.explanation,
      sourceTitle: answer.sourceTitle,
      sourceUrl: answer.sourceUrl,
    };
  });
  const total = answerKey.answers.length;
  return {
    score: Math.round((correctAnswers / total) * 100),
    correctAnswers,
    wrongAnswers: total - correctAnswers,
    passed: true,
    feedback,
  };
}
