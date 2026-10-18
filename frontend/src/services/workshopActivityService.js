import { fetchApiJson } from '../lib/api';

export function startWorkshopActivity(activityKey) {
  return fetchApiJson(`/api/workshop/activities/${encodeURIComponent(activityKey)}/sessions`, {
    method: 'POST',
  });
}

export function submitWorkshopActivity(sessionId, answers) {
  return fetchApiJson(`/api/workshop/activities/sessions/${sessionId}/submit`, {
    method: 'POST',
    body: { answers },
  });
}
