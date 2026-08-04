import assert from 'node:assert/strict';
import {
  ENGENHARIA_DESEJO_ACTIVITY,
  ENGENHARIA_DESEJO_CONTENT_VERSION,
  engenhariaDesejoAdBank,
} from '../frontend/src/data/engenhariaDesejoAds.js';
import {
  buildEngenhariaDesejoSession,
  calculateEngenhariaDesejoResult,
  ENGENHARIA_DESEJO_CARD_COUNT,
  ENGENHARIA_DESEJO_CLASSIFICATIONS,
  toEngenhariaDesejoActivityResult,
  validateEngenhariaDesejoBank,
} from '../frontend/src/lib/engenhariaDesejoGame.js';

const bankSummary = validateEngenhariaDesejoBank();
assert.equal(bankSummary.total, 12);
assert.equal(bankSummary.realCount, 6);
assert.equal(bankSummary.inventedCount, 6);
assert.match(ENGENHARIA_DESEJO_CONTENT_VERSION, /^\d{4}-\d{2}-\d{2}$/);

for (const card of engenhariaDesejoAdBank) {
  assert.equal(card.review.pedagogical, 'pending_teacher_review');

  if (card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL) {
    assert.equal(card.review.technical, 'source_verified');
    assert.equal(card.evidence.accessedAt, ENGENHARIA_DESEJO_CONTENT_VERSION);
    assert.equal(new URL(card.evidence.url).protocol, 'https:');
  } else {
    assert.equal(card.review.technical, 'project_created');
    assert.equal(card.evidence, null);
    assert.match(card.location, /fictícia/i);
  }
}

const session = buildEngenhariaDesejoSession('auditoria-principal');
assert.equal(session.cards.length, ENGENHARIA_DESEJO_CARD_COUNT);
assert.equal(
  session.cards.filter(
    (card) => card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL,
  ).length,
  3,
);
assert.equal(
  session.cards.filter(
    (card) =>
      card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED,
  ).length,
  3,
);
assert.equal(new Set(session.cards.map((card) => card.id)).size, 6);

const perfectAnswers = session.cards.map((card) => ({
  cardId: card.id,
  selectedClassification: card.classification,
}));
const perfectResult = calculateEngenhariaDesejoResult(
  session,
  perfectAnswers,
);
assert.equal(perfectResult.score, 100);
assert.equal(perfectResult.correctAnswers, 6);
assert.equal(perfectResult.wrongAnswers, 0);
assert.equal(perfectResult.passed, true);
assert.equal(perfectResult.profile.title, 'Olhar de auditor');

const fourCorrectAnswers = session.cards.map((card, index) => ({
  cardId: card.id,
  selectedClassification:
    index < ENGENHARIA_DESEJO_ACTIVITY.passingCorrectAnswers
      ? card.classification
      : card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL
        ? ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED
        : ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL,
}));
const passingResult = calculateEngenhariaDesejoResult(
  session,
  fourCorrectAnswers,
);
assert.equal(passingResult.score, 67);
assert.equal(passingResult.correctAnswers, 4);
assert.equal(passingResult.wrongAnswers, 2);
assert.equal(passingResult.passed, true);
assert.deepEqual(toEngenhariaDesejoActivityResult(passingResult), {
  score: 67,
  correctAnswers: 4,
  wrongAnswers: 2,
});

const threeCorrectAnswers = session.cards.map((card, index) => ({
  cardId: card.id,
  selectedClassification:
    index < 3
      ? card.classification
      : card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL
        ? ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED
        : ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL,
}));
const failingResult = calculateEngenhariaDesejoResult(
  session,
  threeCorrectAnswers,
);
assert.equal(failingResult.score, 50);
assert.equal(failingResult.passed, false);

const firstCardSets = new Set();
const realAnswerPositions = new Set();
const inventedAnswerPositions = new Set();

for (let seed = 1; seed <= 50; seed += 1) {
  const randomizedSession = buildEngenhariaDesejoSession(seed);
  firstCardSets.add(randomizedSession.cards.map((card) => card.id).join(','));

  for (const card of randomizedSession.cards) {
    realAnswerPositions.add(
      card.responseOptions.findIndex(
        (option) =>
          option.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL,
      ),
    );
    inventedAnswerPositions.add(
      card.responseOptions.findIndex(
        (option) =>
          option.classification ===
          ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED,
      ),
    );
  }
}

assert.ok(firstCardSets.size > 20, 'As rodadas devem variar entre tentativas.');
assert.deepEqual([...realAnswerPositions].sort(), [0, 1]);
assert.deepEqual([...inventedAnswerPositions].sort(), [0, 1]);
assert.throws(
  () => calculateEngenhariaDesejoResult(session, []),
  /Responda todas as peças/,
);

console.log(
  'Engenharia do Desejo validada: 12 peças auditadas, rodadas 3/3, respostas embaralhadas e aprovação com 4 acertos.',
);
