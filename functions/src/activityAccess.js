const ATTRIBUTABLE_PERIOD_STATES = new Set(['ACTIVE', 'GRACE']);

function validTestGrant(testGrant, user, now) {
  if (!testGrant || !user?.uid) return false;
  const endsAt = Date.parse(testGrant.endsAt);
  return testGrant.status === 'ACTIVE'
    && testGrant.createdByUid === user.uid
    && Number.isFinite(endsAt)
    && now.getTime() < endsAt;
}

export function canAccessActivity({
  user,
  currentPeriod,
  testGrant,
  session = null,
  operation = 'START',
  now = new Date(),
}) {
  const isSubmit = operation === 'SUBMIT';
  const validGrant = validTestGrant(testGrant, user, now);

  // Sessões de teste continuam isoladas para nunca conceder progresso ou
  // recompensa oficial por engano.
  if (session?.isTest === true) {
    if (validGrant && session.testRunId === testGrant.id) {
      return {
        allowed: true,
        source: 'TEST_RUN',
        reason: 'teacher_test_grant_active',
        periodId: null,
        testRunId: testGrant.id,
      };
    }
    return {
      allowed: false,
      source: 'BLOCKED',
      reason: 'test_run_expired_or_mismatched',
      periodId: null,
      testRunId: testGrant?.id || null,
    };
  }

  if (!isSubmit && validGrant) {
    return {
      allowed: true,
      source: 'TEST_RUN',
      reason: 'teacher_test_grant_active',
      periodId: null,
      testRunId: testGrant.id,
    };
  }

  const periodId = ATTRIBUTABLE_PERIOD_STATES.has(currentPeriod?.state)
    ? currentPeriod?.selectedPeriodId || null
    : null;
  return {
    allowed: true,
    source: 'STANDARD_ACTIVITY',
    reason: isSubmit
      ? 'activity_submission_available'
      : 'activity_available',
    periodId,
    testRunId: null,
  };
}

export function activityAccessSummary(input) {
  const start = canAccessActivity({ ...input, operation: 'START' });
  const submit = canAccessActivity({ ...input, operation: 'SUBMIT' });
  return {
    canStartActivity: start.allowed,
    canSubmitActivity: submit.allowed,
    accessSource: start.allowed ? start.source : submit.source,
    reason: start.allowed ? start.reason : submit.reason,
  };
}
