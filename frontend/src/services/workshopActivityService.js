import { fetchApiJson } from '../lib/api';

function workshopActivityBasePath(testMode) {
  return testMode
    ? '/api/teacher/test-mode/workshop/activities'
    : '/api/workshop/activities';
}

export function startWorkshopActivity(activityKey, { testMode = false } = {}) {
  return fetchApiJson(`${workshopActivityBasePath(testMode)}/${encodeURIComponent(activityKey)}/sessions`, {
    method: 'POST',
  });
}

export function submitWorkshopActivity(sessionId, answers, { testMode = false } = {}) {
  return fetchApiJson(`${workshopActivityBasePath(testMode)}/sessions/${sessionId}/submit`, {
    method: 'POST',
    body: { answers },
  });
}
