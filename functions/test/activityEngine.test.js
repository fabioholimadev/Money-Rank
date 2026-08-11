import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildStaticSession,
  scoreActivitySession,
} from '../src/activityEngine.js';

const fixedRandom = () => 0.25;

function creditBand(credit) {
  if (credit < 40) return 'CRITICAL';
  if (credit < 70) return 'ALERT';
  if (credit < 100) return 'STABLE';
  return 'RESERVE';
}

function buildIlusaoAnswers(answerKey, chooseScore = 3) {
  let credit = 100;
  const answers = [];
  for (let stage = 1; stage <= 6; stage += 1) {
    const item = answerKey.items.find((candidate) =>
      candidate.stage === stage
      && (stage === 1
        ? answerKey.selectedItemIds.includes(candidate.itemId)
        : candidate.pathCondition === creditBand(credit)));
    const optionId = Object.entries(item.scores)
      .find(([, score]) => score === chooseScore)?.[0]
      ?? Object.keys(item.scores)[0];
    credit = Math.max(0, Math.min(120, credit + item.creditDeltas[optionId]));
    answers.push({ decisionId: item.itemId, choiceId: optionId });
  }
  return answers;
}

test('quiz usa 2/2/1, não expõe segredo e aprova com três acertos', () => {
  const prepared = buildStaticSession(1, { random: fixedRandom });
  assert.equal(prepared.publicPayload.questions.length, 5);
  assert.deepEqual(
    Object.fromEntries([...Map.groupBy(
      prepared.publicPayload.questions,
      (question) => question.difficulty,
    )].map(([difficulty, questions]) => [difficulty, questions.length])),
    { EASY: 2, MEDIUM: 2, HARD: 1 },
  );
  assert.equal(JSON.stringify(prepared.publicPayload).match(/correct|score|delta|explanation/i), null);

  const selected = prepared.answerKey.items;
  const answers = selected.map((item, index) => ({
    questionId: item.itemId,
    optionId: index < 3 ? item.correctOptionId : item.correctOptionId === 'A' ? 'B' : 'A',
  }));
  const result = scoreActivitySession(
    { phaseNumber: 1, answerKey: prepared.answerKey },
    answers,
  );
  assert.equal(result.score, 60);
  assert.equal(result.correctAnswers, 3);
  assert.equal(result.passed, true);
  assert.equal(result.feedback.length, 5);
});

test('Custo sorteia seis decisões 2/2/2 e ignora pontuação do cliente', () => {
  const prepared = buildStaticSession(2, {
    variantId: 'rafael-vape',
    random: fixedRandom,
  });
  assert.equal(prepared.answerKey.items.length, 6);
  assert.deepEqual(
    Object.fromEntries([...Map.groupBy(
      prepared.answerKey.items,
      (item) => item.difficulty,
    )].map(([difficulty, items]) => [difficulty, items.length])),
    { EASY: 2, MEDIUM: 2, HARD: 2 },
  );
  const answers = prepared.answerKey.items.map((item) => ({
    decisionId: item.itemId,
    optionId: Object.entries(item.scores).find(([, score]) => score === 3)[0],
    points: 999,
  }));
  const result = scoreActivitySession(
    { phaseNumber: 2, answerKey: prepared.answerKey },
    answers,
  );
  assert.equal(result.totalPoints, 18);
  assert.equal(result.score, 100);
  assert.equal(result.passed, true);
});

test('Ilusão aplica nota 70/30, crédito limitado e final com precedência', () => {
  const prepared = buildStaticSession(3, { random: fixedRandom });
  const result = scoreActivitySession(
    { phaseNumber: 3, answerKey: prepared.answerKey },
    buildIlusaoAnswers(prepared.answerKey, 3),
  );
  assert.equal(result.quality, 100);
  assert.equal(result.finalCredit <= 120, true);
  assert.equal(result.score, Math.round(result.quality * 0.7 + result.creditScore * 0.3));
  assert.equal(result.ending, 'EQUILIBRIO');
  assert.equal(result.passed, true);
});

test('Engenharia sorteia oito temas, 2/4/2 e quatro V/quatro F', () => {
  const prepared = buildStaticSession(4, { random: fixedRandom });
  const items = prepared.answerKey.items;
  assert.equal(items.length, 8);
  assert.equal(new Set(items.map((item) => item.tags[1])).size, 8);
  assert.deepEqual(
    Object.fromEntries([...Map.groupBy(items, (item) => item.difficulty)]
      .map(([difficulty, values]) => [difficulty, values.length])),
    { EASY: 2, MEDIUM: 4, HARD: 2 },
  );
  assert.equal(items.filter((item) => item.correctOptionId === 'A').length, 4);
  assert.equal(items.filter((item) => item.correctOptionId === 'B').length, 4);
});

test('respostas duplicadas são rejeitadas', () => {
  const prepared = buildStaticSession(1, { random: fixedRandom });
  const first = prepared.answerKey.items[0];
  assert.throws(
    () => scoreActivitySession(
      { phaseNumber: 1, answerKey: prepared.answerKey },
      [
        { questionId: first.itemId, optionId: first.correctOptionId },
        { questionId: first.itemId, optionId: first.correctOptionId },
      ],
    ),
    /ausentes ou duplicadas/,
  );
});
