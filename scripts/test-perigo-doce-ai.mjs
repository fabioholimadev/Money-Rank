import assert from 'node:assert/strict';
import {
  KNOWLEDGE_REVIEW_STATUS,
  PERIGO_DOCE_KNOWLEDGE_VERSION,
  perigoDoceKnowledge,
} from '../frontend/src/data/perigoDoceKnowledge.js';
import {
  buildFallbackQuestions,
  buildPerigoDocePromptContext,
  PERIGO_DOCE_QUESTION_COUNT,
} from '../frontend/src/lib/perigoDoceQuiz.js';

assert.match(PERIGO_DOCE_KNOWLEDGE_VERSION, /^\d{4}-\d{2}-\d{2}$/);
assert.ok(
  perigoDoceKnowledge.length >= 8,
  'A fase deve ter fatos suficientes para variar as cinco questões.',
);

const factIds = new Set();
for (const fact of perigoDoceKnowledge) {
  assert.ok(!factIds.has(fact.id), `ID duplicado: ${fact.id}`);
  factIds.add(fact.id);

  assert.ok(fact.claim.length >= 40, `${fact.id}: afirmação muito curta.`);
  assert.equal(
    fact.misconceptions.length,
    3,
    `${fact.id}: devem existir três equívocos controlados.`,
  );
  assert.equal(fact.review.technical, KNOWLEDGE_REVIEW_STATUS.technical);
  assert.equal(
    fact.review.pedagogical,
    KNOWLEDGE_REVIEW_STATUS.pedagogical,
  );
  assert.equal(fact.source.accessedAt, PERIGO_DOCE_KNOWLEDGE_VERSION);
  assert.equal(new URL(fact.source.url).protocol, 'https:');
}

const firstFallback = buildFallbackQuestions(20260801);
const secondFallback = buildFallbackQuestions(20260802);

for (const questions of [firstFallback, secondFallback]) {
  assert.equal(questions.length, PERIGO_DOCE_QUESTION_COUNT);
  assert.equal(new Set(questions.map(({ id }) => id)).size, questions.length);

  for (const question of questions) {
    assert.equal(question.alternativas.length, 4);
    assert.ok(question.respostaCorreta >= 0);
    assert.ok(question.respostaCorreta <= 3);
    assert.equal(question.sourceFactIds.length, 1);
    assert.ok(factIds.has(question.sourceFactIds[0]));
    assert.match(question.justificativa, /Fonte:/);
  }
}

assert.notDeepEqual(
  firstFallback.map(({ sourceFactIds }) => sourceFactIds[0]),
  secondFallback.map(({ sourceFactIds }) => sourceFactIds[0]),
  'Sementes diferentes devem variar a seleção local.',
);

const promptContext = buildPerigoDocePromptContext({
  currentPhase: 1,
  capiCoins: 250,
  streak: 4,
  nome: 'Dado que não deve entrar no prompt',
  email: 'privado@example.com',
  uid: 'uid-privado',
  progressEntries: [
    {
      phaseNumber: 1,
      status: 'IN_PROGRESS',
      updatedAt: '2026-08-01T12:00:00.000Z',
    },
  ],
});
const serializedContext = JSON.stringify(promptContext);

assert.equal(promptContext.student.capiCoins, 250);
assert.equal(promptContext.student.streak, 4);
assert.equal(promptContext.student.recentProgress[0].status, 'IN_PROGRESS');
assert.ok(!serializedContext.includes('privado@example.com'));
assert.ok(!serializedContext.includes('uid-privado'));
assert.ok(!serializedContext.includes('Dado que não deve entrar no prompt'));
assert.equal(promptContext.knowledgeBase.length, perigoDoceKnowledge.length);

console.log(
  'Perigo Doce validado: fontes auditáveis, fallback variado e contexto sem dados pessoais.',
);
