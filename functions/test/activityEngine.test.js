import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildStaticSession,
  scoreActivitySession,
} from '../src/activityEngine.js';
import { buildFallbackPerigoDoceSession } from '../src/perigoDoceSession.js';

const fixedRandom = () => 0.25;

test('quiz não expõe gabarito e calcula cinco respostas no servidor', () => {
  const prepared = buildFallbackPerigoDoceSession(fixedRandom);
  assert.equal(
    prepared.publicPayload.questions.some(
      (question) => 'correctOptionId' in question,
    ),
    false,
  );
  assert.equal(
    prepared.publicPayload.questions.some(
      (question) =>
        'explanation' in question || 'sourceFactIds' in question,
    ),
    false,
  );

  const answers = prepared.answerKey.questions.map((question) => ({
    questionId: question.id,
    optionId: question.correctOptionId,
  }));
  assert.deepEqual(
    scoreActivitySession(
      { phaseNumber: 1, answerKey: prepared.answerKey },
      answers,
    ),
    {
      score: 100,
      correctAnswers: 5,
      wrongAnswers: 0,
      passed: true,
    },
  );
});

test('estudo de caso ignora pontuação inventada pelo cliente', () => {
  const prepared = buildStaticSession(2, {
    variantId: 'rafael-vape',
    random: fixedRandom,
  });
  const answers = prepared.answerKey.decisions.map((decision) => ({
    decisionId: decision.id,
    optionId: decision.options.find((option) => option.points === 1).id,
    points: 999,
  }));
  const result = scoreActivitySession(
    { phaseNumber: 2, answerKey: prepared.answerKey },
    answers,
  );
  assert.equal(result.score, 60);
  assert.equal(result.passed, true);
});

test('caminhos usam apenas IDs e valores canônicos', () => {
  const prepared = buildStaticSession(3, { random: fixedRandom });
  const answers = prepared.answerKey.decisions.map((decision) => ({
    decisionId: decision.id,
    choiceId: decision.choices.find(
      (choice) => choice.analysisPoints === 0,
    ).id,
    analysisPoints: 100,
  }));
  const result = scoreActivitySession(
    { phaseNumber: 3, answerKey: prepared.answerKey },
    answers,
  );
  assert.equal(result.score, 0);
  assert.equal(result.passed, false);
});

test('investigação recebe três cards reais e três inventados', () => {
  const prepared = buildStaticSession(4, { random: fixedRandom });
  assert.equal(prepared.publicPayload.cardIds.length, 6);
  assert.equal(
    prepared.answerKey.cards.filter((card) => card.classification === 'REAL')
      .length,
    3,
  );
  assert.equal(
    prepared.answerKey.cards.filter(
      (card) => card.classification === 'INVENTED',
    ).length,
    3,
  );
});

test('respostas duplicadas são rejeitadas', () => {
  const prepared = buildStaticSession(3, { random: fixedRandom });
  const first = prepared.answerKey.decisions[0];
  assert.throws(
    () =>
      scoreActivitySession(
        { phaseNumber: 3, answerKey: prepared.answerKey },
        [
          { decisionId: first.id, choiceId: first.choices[0].id },
          { decisionId: first.id, choiceId: first.choices[1].id },
        ],
      ),
    /ausentes ou duplicadas/,
  );
});
