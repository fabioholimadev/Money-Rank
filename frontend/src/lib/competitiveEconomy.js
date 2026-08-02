export const DEFAULT_ECONOMY_RULES = Object.freeze({
  firstContentReward: 20,
  firstActivityReward: 100,
  repeatActivityReward: 20,
  rewardedRepeatLimitPerDay: null,
  streakTier3Percent: 110,
  streakTier5Percent: 120,
  streakTier7Percent: 130,
});

function toNonNegativeInteger(value, fallback = 0) {
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized >= 0
    ? normalized
    : fallback;
}

export function getStreakMultiplierPercent(
  streak,
  rules = DEFAULT_ECONOMY_RULES,
) {
  const normalizedStreak = toNonNegativeInteger(streak);

  if (normalizedStreak >= 7) {
    return toNonNegativeInteger(rules.streakTier7Percent, 130);
  }

  if (normalizedStreak >= 5) {
    return toNonNegativeInteger(rules.streakTier5Percent, 120);
  }

  if (normalizedStreak >= 3) {
    return toNonNegativeInteger(rules.streakTier3Percent, 110);
  }

  return 100;
}

export function calculateCapiCoinReward({
  baseAmount,
  streak,
  rules = DEFAULT_ECONOMY_RULES,
}) {
  const normalizedBase = toNonNegativeInteger(baseAmount);
  const multiplierPercent = getStreakMultiplierPercent(streak, rules);
  const amount = Math.round(
    (normalizedBase * multiplierPercent) / 100,
  );

  return {
    amount,
    baseAmount: normalizedBase,
    multiplierPercent,
    streakBonus: amount - normalizedBase,
  };
}

export function canRewardAnotherRepeat({
  rewardedRepeatsToday,
  rewardedRepeatLimitPerDay,
}) {
  if (rewardedRepeatLimitPerDay === null) {
    return true;
  }

  const normalizedLimit = toNonNegativeInteger(
    rewardedRepeatLimitPerDay,
  );
  const normalizedCount = toNonNegativeInteger(rewardedRepeatsToday);

  return normalizedCount < normalizedLimit;
}

export function normalizeAttemptReward(attempt) {
  return {
    attemptId: attempt?.id ?? null,
    reward: toNonNegativeInteger(attempt?.rewardAmount),
    baseReward: toNonNegativeInteger(attempt?.rewardBase),
    multiplierPercent: toNonNegativeInteger(
      attempt?.streakMultiplierPercent,
      100,
    ),
    streakBonus: toNonNegativeInteger(attempt?.streakBonus),
    firstCompletion: Boolean(attempt?.firstCompletion),
    rewardLimitReached: Boolean(attempt?.rewardLimitReached),
  };
}
