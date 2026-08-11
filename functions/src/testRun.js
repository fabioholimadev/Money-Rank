export const TEST_ACCESS_POLICY = 'TEACHER_OWNER_ONLY';
export const DEFAULT_TEST_DURATION_MINUTES = 60;
export const MIN_TEST_DURATION_MINUTES = 5;
export const MAX_TEST_DURATION_MINUTES = 120;

export function normalizeTestDuration(value) {
  const duration = value === undefined || value === null || value === ''
    ? DEFAULT_TEST_DURATION_MINUTES
    : Number(value);
  if (
    !Number.isInteger(duration)
    || duration < MIN_TEST_DURATION_MINUTES
    || duration > MAX_TEST_DURATION_MINUTES
  ) {
    throw new Error(
      `A duração do teste deve estar entre ${MIN_TEST_DURATION_MINUTES} e ${MAX_TEST_DURATION_MINUTES} minutos.`,
    );
  }
  return duration;
}

export function normalizeTestRun(value) {
  if (!value?.id) return null;
  const endsAt = new Date(value.endsAt);
  return {
    ...value,
    durationMinutes: Number(value.durationMinutes) || 0,
    sessionCount: Number(value.sessionCount) || 0,
    attemptCount: Number(value.attemptCount) || 0,
    active: value.status === 'ACTIVE' && endsAt.getTime() > Date.now(),
    accessPolicy: TEST_ACCESS_POLICY,
  };
}
