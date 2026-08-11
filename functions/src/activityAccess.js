const OFFICIAL_START_STATES = new Set(['ACTIVE']);
const OFFICIAL_SUBMIT_STATES = new Set(['ACTIVE', 'GRACE']);

function validTestGrant(testGrant, user, now) {
  if (!testGrant || !user?.uid) return false;
  const endsAt = Date.parse(testGrant.endsAt);
  return testGrant.status === 'ACTIVE'
    && testGrant.createdByUid === user.uid
    && Number.isFinite(endsAt)
    && now.getTime() < endsAt;
}

function officialClassAllowed(currentPeriod, session, user) {
  if (!currentPeriod?.classId) return true;
  return (session?.classId || user?.classId) === currentPeriod.classId;
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
  const officialStates = isSubmit
    ? OFFICIAL_SUBMIT_STATES
    : OFFICIAL_START_STATES;
  const officialStateAllowed = officialStates.has(currentPeriod?.state);
  const officialPeriodMatches = !isSubmit
    || session?.competitionPeriodId === currentPeriod?.selectedPeriodId;

  if (
    officialStateAllowed
    && officialClassAllowed(currentPeriod, session, user)
    && officialPeriodMatches
  ) {
    return {
      allowed: true,
      source: 'OFFICIAL_PERIOD',
      reason: isSubmit
        ? 'official_period_accepts_submission'
        : 'official_period_active',
      periodId: currentPeriod.selectedPeriodId,
      testRunId: null,
    };
  }

  if (validTestGrant(testGrant, user, now)) {
    const testSessionMatches = !isSubmit
      || (session?.isTest === true && session?.testRunId === testGrant.id);
    if (testSessionMatches) {
      return {
        allowed: true,
        source: 'TEST_RUN',
        reason: 'teacher_test_grant_active',
        periodId: null,
        testRunId: testGrant.id,
      };
    }
  }

  let reason = currentPeriod?.reason || 'no_active_period';
  if (currentPeriod?.state === 'PAUSED') reason = 'period_paused';
  if (isSubmit && session?.isTest) reason = 'test_run_expired_or_mismatched';
  if (isSubmit && session?.competitionPeriodId && !officialPeriodMatches) {
    reason = 'session_period_mismatch';
  }
  if (!officialClassAllowed(currentPeriod, session, user)) {
    reason = 'student_bound_to_other_class';
  }

  return {
    allowed: false,
    source: 'BLOCKED',
    reason,
    periodId: currentPeriod?.selectedPeriodId || null,
    testRunId: testGrant?.id || null,
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
