import { fetchApiJson } from '../lib/api';

function normalizeTestRun(value) {
  if (!value?.id) return null;
  return {
    ...value,
    durationMinutes: Number(value.durationMinutes) || 0,
    sessionCount: Number(value.sessionCount) || 0,
    attemptCount: Number(value.attemptCount) || 0,
    auditCount: Number(value.auditCount) || 0,
    active: value.status === 'ACTIVE' && Date.parse(value.endsAt) > Date.now(),
  };
}

export async function fetchTeacherTestMode() {
  const result = await fetchApiJson('/api/teacher/test-mode');
  return { ...result, testRun: normalizeTestRun(result.testRun) };
}

export async function activateTeacherTestMode(durationMinutes = 60) {
  const result = await fetchApiJson('/api/teacher/test-mode/start', {
    method: 'POST',
    body: { durationMinutes },
  });
  return normalizeTestRun(result.testRun);
}

export async function endTeacherTestMode() {
  const result = await fetchApiJson('/api/teacher/test-mode/end', { method: 'POST' });
  return normalizeTestRun(result.testRun);
}

export async function cleanTeacherTestModeData() {
  const result = await fetchApiJson('/api/teacher/test-mode/data', { method: 'DELETE' });
  return normalizeTestRun(result.testRun);
}
