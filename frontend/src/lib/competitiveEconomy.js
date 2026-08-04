export const DEFAULT_ECONOMY_RULES = Object.freeze({
  firstContentReward: 20,
  firstActivityReward: 100,
  repeatActivityReward: 20,
  rewardedRepeatLimitPerDay: null,
  minimumRewardedAttemptIntervalSeconds: 30,
  streakTier3Percent: 110,
  streakTier5Percent: 120,
  streakTier7Percent: 130,
});

export const REWARD_SUPPRESSION_REASONS = Object.freeze({
  NONE: 'NONE',
  RATE_LIMIT: 'RATE_LIMIT',
  DAILY_LIMIT: 'DAILY_LIMIT',
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

export function canRewardAfterMinimumInterval({
  firstCompletion = false,
  lastRewardedAttemptAt = null,
  currentTime = new Date(),
  minimumIntervalSeconds =
    DEFAULT_ECONOMY_RULES.minimumRewardedAttemptIntervalSeconds,
}) {
  if (firstCompletion || !lastRewardedAttemptAt) {
    return true;
  }

  const lastRewardedAt = new Date(lastRewardedAttemptAt).getTime();
  const now = new Date(currentTime).getTime();
  const intervalMilliseconds =
    toNonNegativeInteger(minimumIntervalSeconds, 30) * 1_000;

  if (!Number.isFinite(lastRewardedAt) || !Number.isFinite(now)) {
    return false;
  }

  return now - lastRewardedAt >= intervalMilliseconds;
}

export function getRewardSuppressionMessage(reason) {
  if (reason === REWARD_SUPPRESSION_REASONS.RATE_LIMIT) {
    return 'Revisão registrada sem recompensa. Aguarde alguns segundos antes de concluir outra revisão remunerada.';
  }

  if (reason === REWARD_SUPPRESSION_REASONS.DAILY_LIMIT) {
    return 'Revisão registrada sem recompensa porque o limite diário configurado foi alcançado.';
  }

  return null;
}

export function normalizeAttemptReward(attempt) {
  const suppressionReason = Object.values(
    REWARD_SUPPRESSION_REASONS,
  ).includes(attempt?.rewardSuppressionReason)
    ? attempt.rewardSuppressionReason
    : attempt?.rewardLimitReached
      ? REWARD_SUPPRESSION_REASONS.DAILY_LIMIT
      : REWARD_SUPPRESSION_REASONS.NONE;

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
    rewardSuppressionReason: suppressionReason,
    rewardSuppressed:
      suppressionReason !== REWARD_SUPPRESSION_REASONS.NONE,
  };
}
