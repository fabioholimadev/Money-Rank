import assert from 'node:assert/strict';
import test from 'node:test';
import { canAccessActivity } from '../src/activityAccess.js';

const user = { uid: 'teacher-1', classId: null };
const blockedPeriod = { state: 'CLOSED', reason: 'no_open_period', selectedPeriodId: null };

test('autoriza atividade sempre e apenas atribui período quando ele está ativo', () => {
  const result = canAccessActivity({
    user,
    currentPeriod: { state: 'ACTIVE', selectedPeriodId: 'period-1' },
    testGrant: null,
  });
  assert.deepEqual(result, {
    allowed: true,
    source: 'STANDARD_ACTIVITY',
    reason: 'activity_available',
    periodId: 'period-1',
    testRunId: null,
  });
});

test('período fechado ou pausado não bloqueia início nem submissão', () => {
  for (const state of ['CLOSED', 'PAUSED', 'BEFORE']) {
    const currentPeriod = {
      state,
      reason: 'period_not_available',
      selectedPeriodId: 'period-1',
    };
    const start = canAccessActivity({ user, currentPeriod, testGrant: null });
    const submit = canAccessActivity({
      user,
      currentPeriod,
      testGrant: null,
      session: { competitionPeriodId: 'old-period' },
      operation: 'SUBMIT',
    });
    assert.equal(start.allowed, true);
    assert.equal(start.periodId, null);
    assert.equal(submit.allowed, true);
    assert.equal(submit.reason, 'activity_submission_available');
  }
});

test('autoriza somente o professor dono de concessão de teste válida', () => {
  const testGrant = { id: 'test-1', createdByUid: user.uid, status: 'ACTIVE', endsAt: '2030-01-01T00:00:00Z' };
  assert.equal(canAccessActivity({ user, currentPeriod: blockedPeriod, testGrant, now: new Date('2029-01-01T00:00:00Z') }).source, 'TEST_RUN');
  assert.equal(canAccessActivity({ user: { uid: 'other' }, currentPeriod: blockedPeriod, testGrant, now: new Date('2029-01-01T00:00:00Z') }).source, 'STANDARD_ACTIVITY');
  assert.equal(canAccessActivity({ user, currentPeriod: blockedPeriod, testGrant, now: new Date('2030-01-01T00:00:00Z') }).source, 'STANDARD_ACTIVITY');
});

test('submissão de teste exige o mesmo test_run_id', () => {
  const testGrant = { id: 'test-1', createdByUid: user.uid, status: 'ACTIVE', endsAt: '2030-01-01T00:00:00Z' };
  const result = canAccessActivity({
    user,
    currentPeriod: blockedPeriod,
    testGrant,
    session: { isTest: true, testRunId: 'test-2' },
    operation: 'SUBMIT',
    now: new Date('2029-01-01T00:00:00Z'),
  });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'test_run_expired_or_mismatched');
});
