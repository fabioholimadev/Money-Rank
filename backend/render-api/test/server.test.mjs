import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
process.env.NODE_ENV = 'test';
process.env.TEACHER_EMAILS = 'teacher@example.com';
const { app, allowedFrontendOrigins, isFrontendOriginAllowed, periodStateFromPeriods, shouldEnforceAppCheck } = await import('../server.mjs');
let server; let base;
test.before(async () => { server = http.createServer(app); await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`; });
test.after(() => server.close());
test('healthz is public', async () => { const response = await fetch(`${base}/healthz`); assert.equal(response.status, 200); });
test('protected endpoint requires both test auth and app check', async () => { const response = await fetch(`${base}/api/period`, { headers: { 'x-test-uid': 'u1' } }); assert.equal(response.status, 401); });
test('App Check can be disabled only outside production', () => {
  assert.equal(shouldEnforceAppCheck({ NODE_ENV: 'development', APP_CHECK_ENFORCEMENT: 'false' }), false);
  assert.equal(shouldEnforceAppCheck({ NODE_ENV: 'test', APP_CHECK_ENFORCEMENT: 'false' }), false);
  assert.equal(shouldEnforceAppCheck({ NODE_ENV: 'production', APP_CHECK_ENFORCEMENT: 'false' }), true);
  assert.equal(shouldEnforceAppCheck({ NODE_ENV: 'development' }), true);
});
test('local CORS accepts loopback aliases even when Vite selects another port', () => {
  const environment = { NODE_ENV: 'development', FRONTEND_ORIGIN: 'http://localhost:5173' };
  assert.equal(isFrontendOriginAllowed('http://localhost:5173', environment), true);
  assert.equal(isFrontendOriginAllowed('http://127.0.0.1:5174', environment), true);
  assert.equal(isFrontendOriginAllowed('http://[::1]:5175', environment), true);
  assert.equal(isFrontendOriginAllowed('http://evil.example', environment), false);
});
test('production CORS accepts only explicitly configured origins', () => {
  const origins = allowedFrontendOrigins({
    NODE_ENV: 'production',
    FRONTEND_ORIGIN: 'https://app.moneyrank.example, https://admin.moneyrank.example/',
  });
  assert.deepEqual([...origins], ['https://app.moneyrank.example', 'https://admin.moneyrank.example']);
  assert.equal(isFrontendOriginAllowed('http://localhost:5173', { NODE_ENV: 'production' }), false);
});
test('student cannot activate teacher test mode', async () => {
  const response = await fetch(`${base}/api/teacher/test-mode/start`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-test-uid': 'student-1',
      'x-test-email': 'student@example.com',
      'x-test-app-check': 'valid',
    },
    body: JSON.stringify({ durationMinutes: 60 }),
  });
  assert.equal(response.status, 403);
});
test('generic scheduled period becomes active for its complete configured window', () => {
  const periods = [{
    id: 'test-period',
    name: 'Teste antes da aula',
    status: 'SCHEDULED',
    startsAt: '2026-08-11T07:30:00-03:00',
    endsAt: '2026-08-11T08:10:00-03:00',
  }];
  assert.equal(
    periodStateFromPeriods(periods, new Date('2026-08-11T07:45:00-03:00')).state,
    'ACTIVE',
  );
  assert.equal(
    periodStateFromPeriods(periods, new Date('2026-08-11T07:20:00-03:00')).state,
    'BEFORE',
  );
});
test('period boundaries are authoritative and ignore stale class schedules', () => {
  const periods = [{
    id: 'pilot-period',
    name: 'Piloto',
    status: 'SCHEDULED',
    startsAt: '2026-08-11T08:20:00-03:00',
    endsAt: '2026-08-11T12:05:00-03:00',
    schedule: [
      { state: 'ACTIVE', classId: '3DSB', start: '2026-08-11T08:20:00-03:00', end: '2026-08-11T10:00:00-03:00' },
      { state: 'GRACE', classId: '3DSB', start: '2026-08-11T10:00:00-03:00', end: '2026-08-11T10:05:00-03:00' },
      { state: 'PAUSED', classId: null, start: '2026-08-11T10:05:00-03:00', end: '2026-08-11T10:20:00-03:00' },
      { state: 'ACTIVE', classId: '3DSA', start: '2026-08-11T10:20:00-03:00', end: '2026-08-11T12:00:00-03:00' },
      { state: 'GRACE', classId: '3DSA', start: '2026-08-11T12:00:00-03:00', end: '2026-08-11T12:05:00-03:00' },
    ],
  }];
  assert.equal(periodStateFromPeriods(periods, new Date('2026-08-11T08:19:59-03:00')).state, 'BEFORE');
  assert.equal(periodStateFromPeriods(periods, new Date('2026-08-11T08:20:00-03:00')).state, 'ACTIVE');
  assert.equal(periodStateFromPeriods(periods, new Date('2026-08-11T10:10:00-03:00')).state, 'ACTIVE');
  assert.equal(periodStateFromPeriods(periods, new Date('2026-08-11T12:04:59-03:00')).state, 'ACTIVE');
  assert.equal(periodStateFromPeriods(periods, new Date('2026-08-11T12:05:00-03:00')).state, 'CLOSED');
});

test('explicit PAUSED blocks access and explicit ACTIVE is recognized inside the window', () => {
  const base = {
    id: 'manual-period',
    name: 'Manual',
    startsAt: '2026-08-11T08:20:00-03:00',
    endsAt: '2026-08-11T12:05:00-03:00',
  };
  assert.equal(
    periodStateFromPeriods([{ ...base, status: 'PAUSED' }], new Date('2026-08-11T09:00:00-03:00')).state,
    'PAUSED',
  );
  assert.equal(
    periodStateFromPeriods([{ ...base, status: 'ACTIVE' }], new Date('2026-08-11T09:00:00-03:00')).state,
    'ACTIVE',
  );
});
