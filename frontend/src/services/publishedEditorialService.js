import { fetchApiJson } from '../lib/api';

export function fetchPublishedLearningContent(moduleKey) {
  return fetchApiJson('/api/actions/published-learning-content', {
    method: 'POST',
    body: { moduleKey },
  });
}

export function fetchPublishedActivityCatalog(activityKey) {
  return fetchApiJson('/api/actions/published-activity-catalog', {
    method: 'POST',
    body: { activityKey },
  });
}
