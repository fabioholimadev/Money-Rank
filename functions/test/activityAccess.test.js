import assert from 'node:assert/strict';
import test from 'node:test';
import { canAccessActivity } from '../src/activityAccess.js';

const user = { uid: 'teacher-1', classId: null };
const blockedPeriod = { state: 'CLOSED', reason: 'no_open_period', selectedPeriodId: null };

test('autoriza atividade por período oficial ativo', () => {
  const result = canAccessActivity({
    user,
    currentPeriod: { state: 'ACTIVE', selectedPeriodId: 'period-1' },
    testGrant: null,
  });
  assert.deepEqual(result, {
    allowed: true,
    source: 'OFFICIAL_PERIOD',
    reason: 'official_period_active',
    periodId: 'period-1',
    testRunId: null,
  });
});

test('autoriza somente o professor dono de concessão de teste válida', () => {
  const testGrant = { id: 'test-1', createdByUid: user.uid, status: 'ACTIVE', endsAt: '2030-01-01T00:00:00Z' };
  assert.equal(canAccessActivity({ user, currentPeriod: blockedPeriod, testGrant, now: new Date('2029-01-01T00:00:00Z') }).source, 'TEST_RUN');
  assert.equal(canAccessActivity({ user: { uid: 'other' }, currentPeriod: blockedPeriod, testGrant, now: new Date('2029-01-01T00:00:00Z') }).allowed, false);
  assert.equal(canAccessActivity({ user, currentPeriod: blockedPeriod, testGrant, now: new Date('2030-01-01T00:00:00Z') }).allowed, false);
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
