import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
process.env.NODE_ENV = 'test';
process.env.TEACHER_EMAILS = 'teacher@example.com';
const { app, periodStateFromPeriods } = await import('../server.mjs');
let server; let base;
test.before(async () => { server = http.createServer(app); await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`; });
test.after(() => server.close());
test('healthz is public', async () => { const response = await fetch(`${base}/healthz`); assert.equal(response.status, 200); });
test('protected endpoint requires both test auth and app check', async () => { const response = await fetch(`${base}/api/period`, { headers: { 'x-test-uid': 'u1' } }); assert.equal(response.status, 401); });
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
test('period with schedule preserves class windows, grace and pause', () => {
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
  assert.deepEqual(
    (({ state, classId }) => ({ state, classId }))(
      periodStateFromPeriods(periods, new Date('2026-08-11T09:00:00-03:00')),
    ),
    { state: 'ACTIVE', classId: '3DSB' },
  );
  assert.equal(
    periodStateFromPeriods(periods, new Date('2026-08-11T10:10:00-03:00')).state,
    'PAUSED',
  );
  assert.equal(
    periodStateFromPeriods(periods, new Date('2026-08-11T12:02:00-03:00')).state,
    'GRACE',
  );
});
