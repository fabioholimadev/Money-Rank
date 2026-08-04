export const COMPETITION_PERIOD_STATUSES = Object.freeze({
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  CLOSED: 'CLOSED',
});

function toTimestamp(value) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function normalizeCompetitionPeriod(period) {
  if (!period || typeof period !== 'object') {
    return null;
  }

  const name = typeof period.name === 'string' ? period.name.trim() : '';
  const startsAt = toTimestamp(period.startsAt);
  const endsAt = toTimestamp(period.endsAt);
  const validStatus = Object.values(COMPETITION_PERIOD_STATUSES).includes(
    period.status,
  );

  if (
    !period.id ||
    name.length < 3 ||
    name.length > 80 ||
    !validStatus ||
    startsAt === null ||
    endsAt === null ||
    startsAt >= endsAt
  ) {
    return null;
  }

  return {
    id: period.id,
    name,
    status: period.status,
    startsAt: new Date(startsAt).toISOString(),
    endsAt: new Date(endsAt).toISOString(),
    pausedAt: period.pausedAt ?? null,
    closedAt: period.closedAt ?? null,
    updatedAt: period.updatedAt ?? null,
  };
}

export function getEffectiveCompetitionStatus(
  period,
  currentTime = new Date(),
) {
  const normalized = normalizeCompetitionPeriod(period);
  const now = toTimestamp(currentTime);

  if (!normalized || now === null) {
    return null;
  }

  if (
    normalized.status === COMPETITION_PERIOD_STATUSES.CLOSED ||
    now >= toTimestamp(normalized.endsAt)
  ) {
    return COMPETITION_PERIOD_STATUSES.CLOSED;
  }

  if (normalized.status === COMPETITION_PERIOD_STATUSES.DRAFT) {
    return COMPETITION_PERIOD_STATUSES.DRAFT;
  }

  if (normalized.status === COMPETITION_PERIOD_STATUSES.PAUSED) {
    return COMPETITION_PERIOD_STATUSES.PAUSED;
  }

  if (now < toTimestamp(normalized.startsAt)) {
    return COMPETITION_PERIOD_STATUSES.SCHEDULED;
  }

  return COMPETITION_PERIOD_STATUSES.ACTIVE;
}

export function selectCurrentCompetitionPeriod(
  periods,
  currentTime = new Date(),
) {
  if (!Array.isArray(periods)) {
    return null;
  }

  const priority = {
    [COMPETITION_PERIOD_STATUSES.ACTIVE]: 0,
    [COMPETITION_PERIOD_STATUSES.PAUSED]: 1,
    [COMPETITION_PERIOD_STATUSES.SCHEDULED]: 2,
    [COMPETITION_PERIOD_STATUSES.DRAFT]: 3,
    [COMPETITION_PERIOD_STATUSES.CLOSED]: 4,
  };

  return periods
    .map(normalizeCompetitionPeriod)
    .filter(Boolean)
    .map((period) => ({
      ...period,
      effectiveStatus: getEffectiveCompetitionStatus(period, currentTime),
    }))
    .filter(
      (period) =>
        period.effectiveStatus !== COMPETITION_PERIOD_STATUSES.CLOSED,
    )
    .sort((left, right) => {
      const statusDifference =
        priority[left.effectiveStatus] - priority[right.effectiveStatus];

      if (statusDifference !== 0) return statusDifference;
      return toTimestamp(left.startsAt) - toTimestamp(right.startsAt);
    })[0] ?? null;
}
