import { fetchApiJson } from '../lib/api';

export async function fetchTeacherWorkshops() {
  const result = await fetchApiJson('/api/teacher/workshops');
  return result.workshops || [];
}

export async function createTeacherWorkshop(input) {
  const result = await fetchApiJson('/api/teacher/workshops', {
    method: 'POST',
    body: input,
  });
  return result.workshop;
}

export async function fetchWorkshopTeams(eventId) {
  const result = await fetchApiJson(`/api/teacher/workshops/${eventId}/teams`);
  return result.teams || [];
}

export async function createWorkshopTeam(eventId, name) {
  const result = await fetchApiJson(`/api/teacher/workshops/${eventId}/teams`, {
    method: 'POST',
    body: { name },
  });
  return result.team;
}
