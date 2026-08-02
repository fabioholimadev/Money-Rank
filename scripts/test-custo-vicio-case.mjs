import assert from 'node:assert/strict';
import {
  CUSTO_VICIO_CONTENT_VERSION,
  CUSTO_VICIO_REVIEW_STATUS,
  custoVicioCases,
  custoVicioKnowledge,
} from '../frontend/src/data/custoVicioCases.js';
import {
  buildCustoVicioCaseSession,
  calculateCustoVicioResult,
  CUSTO_VICIO_DECISION_COUNT,
  toCustoVicioActivityResult,
  validateCustoVicioCaseBank,
} from '../frontend/src/lib/custoVicioCase.js';

assert.equal(validateCustoVicioCaseBank(), true);
assert.match(CUSTO_VICIO_CONTENT_VERSION, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(custoVicioCases.length, 3);

const factIds = new Set();
for (const fact of custoVicioKnowledge) {
  assert.ok(!factIds.has(fact.id), `Fato duplicado: ${fact.id}`);
  factIds.add(fact.id);
  assert.equal(fact.review.technical, CUSTO_VICIO_REVIEW_STATUS.technical);
  assert.equal(
    fact.review.pedagogical,
    CUSTO_VICIO_REVIEW_STATUS.pedagogical,
  );
  assert.equal(fact.source.accessedAt, CUSTO_VICIO_CONTENT_VERSION);
  assert.equal(new URL(fact.source.url).protocol, 'https:');
}

for (const caseItem of custoVicioCases) {
  assert.equal(caseItem.decisions.length, CUSTO_VICIO_DECISION_COUNT);
  assert.ok(caseItem.simulatedBudget.monthlyAmount > 0);
  assert.match(caseItem.simulatedBudget.disclaimer, /fictícios/i);

  const shallowAnswers = caseItem.decisions.map((decision) => ({
    decisionId: decision.id,
    optionId: decision.options.find((option) => option.points === 1).id,
  }));
  const systemicAnswers = caseItem.decisions.map((decision) => ({
    decisionId: decision.id,
    optionId: decision.options.find((option) => option.points === 3).id,
  }));
  const shallowResult = calculateCustoVicioResult(
    caseItem.id,
    shallowAnswers,
  );
  const systemicResult = calculateCustoVicioResult(
    caseItem.id,
    systemicAnswers,
  );

  assert.equal(shallowResult.score, 60);
  assert.equal(shallowResult.insightProfile.id, 'observador');
  assert.equal(systemicResult.score, 100);
  assert.equal(systemicResult.insightProfile.id, 'sistemico');
  assert.deepEqual(toCustoVicioActivityResult(systemicResult), {
    score: 100,
    correctAnswers: CUSTO_VICIO_DECISION_COUNT,
    wrongAnswers: 0,
  });
}

const systemicPositions = new Set();
for (let seed = 1; seed <= 30; seed += 1) {
  const session = buildCustoVicioCaseSession(custoVicioCases[0].id, seed);
  const firstDecision = session.decisions[0];

  assert.deepEqual(
    [...firstDecision.options.map(({ points }) => points)].sort(),
    [1, 2, 3],
  );
  systemicPositions.add(
    firstDecision.options.findIndex(({ points }) => points === 3),
  );
}
assert.equal(
  systemicPositions.size,
  3,
  'A leitura sistêmica deve aparecer nas três posições ao variar a semente.',
);

assert.throws(
  () => calculateCustoVicioResult(custoVicioCases[0].id, []),
  /Falta analisar/,
);
assert.throws(
  () => calculateCustoVicioResult('personagem-inexistente', []),
  /não existe/,
);

console.log(
  'O Custo do Vício validado: 3 personagens, 5 decisões, alternativas embaralhadas e pontuação de 60 a 100.',
);
