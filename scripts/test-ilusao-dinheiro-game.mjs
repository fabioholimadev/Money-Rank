import assert from 'node:assert/strict';
import {
  ILUSAO_DINHEIRO_CONTENT_VERSION,
  ILUSAO_DINHEIRO_REVIEW_STATUS,
  ilusaoDinheiroKnowledge,
  ilusaoDinheiroMission,
} from '../frontend/src/data/ilusaoDinheiroPaths.js';
import {
  buildIlusaoDinheiroSession,
  calculateIlusaoDinheiroResult,
  ILUSAO_DINHEIRO_DECISION_COUNT,
  ILUSAO_DINHEIRO_PASSING_SCORE,
  toIlusaoDinheiroActivityResult,
  validateIlusaoDinheiroMission,
} from '../frontend/src/lib/ilusaoDinheiroGame.js';

assert.equal(validateIlusaoDinheiroMission(), true);
assert.match(ILUSAO_DINHEIRO_CONTENT_VERSION, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(
  ilusaoDinheiroMission.decisions.length,
  ILUSAO_DINHEIRO_DECISION_COUNT,
);

const factIds = new Set();
for (const fact of ilusaoDinheiroKnowledge) {
  assert.ok(!factIds.has(fact.id), `Fato duplicado: ${fact.id}`);
  factIds.add(fact.id);
  assert.equal(fact.review.technical, ILUSAO_DINHEIRO_REVIEW_STATUS.technical);
  assert.equal(
    fact.review.pedagogical,
    ILUSAO_DINHEIRO_REVIEW_STATUS.pedagogical,
  );
  assert.equal(fact.source.accessedAt, ILUSAO_DINHEIRO_CONTENT_VERSION);
  assert.equal(new URL(fact.source.url).protocol, 'https:');
}

function answersByPoints(pointsByDecision) {
  return ilusaoDinheiroMission.decisions.map((decision, index) => ({
    decisionId: decision.id,
    choiceId: decision.choices.find(
      (choice) => choice.analysisPoints === pointsByDecision[index],
    ).id,
  }));
}

const bestResult = calculateIlusaoDinheiroResult(
  answersByPoints([2, 2, 2, 2, 2, 2]),
);
assert.equal(bestResult.score, 100);
assert.equal(bestResult.finalBalance, 505);
assert.equal(bestResult.ending.id, 'goal-achieved');
assert.equal(bestResult.passed, true);

const recoveryResult = calculateIlusaoDinheiroResult(
  answersByPoints([1, 1, 2, 2, 1, 1]),
);
assert.equal(recoveryResult.score, 67);
assert.equal(recoveryResult.finalBalance, 340);
assert.equal(recoveryResult.ending.id, 'recovery-plan');
assert.ok(recoveryResult.score >= ILUSAO_DINHEIRO_PASSING_SCORE);

const worstResult = calculateIlusaoDinheiroResult(
  answersByPoints([0, 0, 0, 0, 0, 0]),
);
assert.equal(worstResult.score, 0);
assert.equal(worstResult.finalBalance, -105);
assert.equal(worstResult.ending.id, 'overcommitted');
assert.equal(worstResult.passed, false);

assert.deepEqual(toIlusaoDinheiroActivityResult(recoveryResult), {
  score: 67,
  correctAnswers: 6,
  wrongAnswers: 0,
});
assert.deepEqual(toIlusaoDinheiroActivityResult(worstResult), {
  score: 0,
  correctAnswers: 0,
  wrongAnswers: 6,
});

const strategicPositions = new Set();
for (let seed = 1; seed <= 30; seed += 1) {
  const session = buildIlusaoDinheiroSession(seed);
  const firstDecision = session.decisions[0];
  strategicPositions.add(
    firstDecision.choices.findIndex(
      ({ analysisPoints }) => analysisPoints === 2,
    ),
  );
}
assert.equal(
  strategicPositions.size,
  3,
  'O caminho mais estratégico deve variar entre A, B e C.',
);

assert.throws(
  () => calculateIlusaoDinheiroResult([]),
  /Falta escolher/,
);

console.log(
  'A Ilusão do Dinheiro validada: 6 decisões, caminhos embaralhados, saldo narrativo e finais ramificados.',
);
