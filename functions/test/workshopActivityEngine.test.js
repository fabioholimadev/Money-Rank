import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORKSHOP_QUESTION_BANK,
  validateWorkshopQuestionBank,
} from '../src/workshopQuestionBank.js';
import {
  buildWorkshopActivitySession,
  scoreWorkshopActivitySession,
} from '../src/workshopActivityEngine.js';

test('banco da oficina possui 96 itens com fontes oficiais', () => {
  assert.equal(validateWorkshopQuestionBank(), true);
  assert.equal(Object.values(WORKSHOP_QUESTION_BANK).flat().length, 96);
});

test('rodadas individuais entregam seis itens sem expor gabarito', () => {
  const session = buildWorkshopActivitySession('quiz', { random: () => 0.42 });
  assert.equal(session.publicPayload.items.length, 6);
  assert.equal('correctIndex' in session.publicPayload.items[0], false);
  assert.equal(session.answerKey.answers.length, 6);
});

test('ligar colunas entrega quatro pares com uma coluna de respostas compartilhada', () => {
  const session = buildWorkshopActivitySession('ligar-colunas', { random: () => 0.42 });
  const { items } = session.publicPayload;

  assert.equal(items.length, 4);
  assert.equal(items.every((item) => item.options.length === 4), true);
  assert.equal(items.every((item) => JSON.stringify(item.options) === JSON.stringify(items[0].options)), true);
  assert.deepEqual(
    [...session.answerKey.answers.map((answer) => answer.correctIndex)].sort(),
    [0, 1, 2, 3],
  );
  assert.equal(items.some((item) => 'correctIndex' in item), false);
});

test('prioriza itens ainda não vistos e calcula pontos de zero a cem', () => {
  const seen = WORKSHOP_QUESTION_BANK.quiz.slice(0, 18).map((item) => item.itemId);
  const session = buildWorkshopActivitySession('quiz', { random: () => 0, seenItemIds: seen });
  assert.equal(session.publicPayload.items.every((item) => !seen.includes(item.itemId)), true);
  const answers = session.answerKey.answers.map((item, index) => ({
    itemId: item.itemId,
    answerIndex: index < 3 ? item.correctIndex : (item.correctIndex + 1) % 4,
  }));
  const result = scoreWorkshopActivitySession(session.answerKey, answers);
  assert.equal(result.score, 50);
  assert.equal(result.correctAnswers, 3);
  assert.equal(result.wrongAnswers, 3);
});
