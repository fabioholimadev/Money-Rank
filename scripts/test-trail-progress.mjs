import assert from 'node:assert/strict';
import {
  getPhaseProgress,
  isActivityUnlocked,
  isPhaseCompleted,
  isPhaseUnlocked,
  normalizeCurrentPhase,
} from '../frontend/src/lib/trailProgress.js';

assert.equal(normalizeCurrentPhase(undefined), 0);
assert.equal(normalizeCurrentPhase(0), 0);
assert.equal(normalizeCurrentPhase('2'), 2);

assert.equal(isPhaseUnlocked(0, 0), true);
assert.equal(isPhaseUnlocked(1, 0), false);
assert.equal(isPhaseUnlocked(1, 1), true);

const progressEntries = [
  { phaseNumber: 0, status: 'COMPLETED' },
  { phaseNumber: 1, status: 'IN_PROGRESS' },
];

assert.deepEqual(getPhaseProgress(progressEntries, 1), {
  phaseNumber: 1,
  status: 'IN_PROGRESS',
});
assert.equal(getPhaseProgress(progressEntries, 2), null);

assert.equal(isActivityUnlocked(1, 1, null), false);
assert.equal(
  isActivityUnlocked(1, 1, {
    phaseNumber: 1,
    status: 'IN_PROGRESS',
  }),
  true,
);
assert.equal(
  isActivityUnlocked(1, 2, {
    phaseNumber: 1,
    status: 'COMPLETED',
  }),
  true,
);

assert.equal(isPhaseCompleted(1, 1, null), false);
assert.equal(isPhaseCompleted(1, 2, null), true);

console.log('Regras de progressão da trilha validadas com sucesso.');
