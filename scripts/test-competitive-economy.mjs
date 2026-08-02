import assert from 'node:assert/strict';
import {
  DEFAULT_ECONOMY_RULES,
  calculateCapiCoinReward,
  canRewardAnotherRepeat,
  getStreakMultiplierPercent,
  normalizeAttemptReward,
} from '../frontend/src/lib/competitiveEconomy.js';

assert.equal(getStreakMultiplierPercent(1), 100);
assert.equal(getStreakMultiplierPercent(2), 100);
assert.equal(getStreakMultiplierPercent(3), 110);
assert.equal(getStreakMultiplierPercent(5), 120);
assert.equal(getStreakMultiplierPercent(7), 130);
assert.equal(getStreakMultiplierPercent(30), 130);

assert.deepEqual(
  calculateCapiCoinReward({ baseAmount: 20, streak: 1 }),
  {
    amount: 20,
    baseAmount: 20,
    multiplierPercent: 100,
    streakBonus: 0,
  },
);

assert.deepEqual(
  calculateCapiCoinReward({ baseAmount: 100, streak: 3 }),
  {
    amount: 110,
    baseAmount: 100,
    multiplierPercent: 110,
    streakBonus: 10,
  },
);

assert.deepEqual(
  calculateCapiCoinReward({ baseAmount: 20, streak: 7 }),
  {
    amount: 26,
    baseAmount: 20,
    multiplierPercent: 130,
    streakBonus: 6,
  },
);

assert.equal(
  canRewardAnotherRepeat({
    rewardedRepeatsToday: 999,
    rewardedRepeatLimitPerDay:
      DEFAULT_ECONOMY_RULES.rewardedRepeatLimitPerDay,
  }),
  true,
);
assert.equal(
  canRewardAnotherRepeat({
    rewardedRepeatsToday: 4,
    rewardedRepeatLimitPerDay: 5,
  }),
  true,
);
assert.equal(
  canRewardAnotherRepeat({
    rewardedRepeatsToday: 5,
    rewardedRepeatLimitPerDay: 5,
  }),
  false,
);

assert.deepEqual(
  normalizeAttemptReward({
    id: '8b0268ef-2e5b-4e16-8057-f9b2d419d02b',
    rewardAmount: 24,
    rewardBase: 20,
    streakMultiplierPercent: 120,
    streakBonus: 4,
    firstCompletion: false,
    rewardLimitReached: false,
  }),
  {
    attemptId: '8b0268ef-2e5b-4e16-8057-f9b2d419d02b',
    reward: 24,
    baseReward: 20,
    multiplierPercent: 120,
    streakBonus: 4,
    firstCompletion: false,
    rewardLimitReached: false,
  },
);

console.log('Economia competitiva validada com sucesso.');
