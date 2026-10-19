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

function numeric(value) {
  return Number(value) || 0;
}

export async function fetchWorkshopDashboard(eventId) {
  const result = await fetchApiJson(`/api/teacher/workshops/${eventId}/dashboard`);
  return {
    summary: result.summary ? Object.fromEntries(
      Object.entries(result.summary).map(([key, value]) => [key, numeric(value)]),
    ) : null,
    activities: (result.activityMetrics || []).map((item) => ({
      ...item,
      phaseNumber: numeric(item.phaseNumber),
      totalAttempts: numeric(item.totalAttempts),
      participants: numeric(item.participants),
      averageScore: numeric(item.averageScore),
      correctAnswers: numeric(item.correctAnswers),
      wrongAnswers: numeric(item.wrongAnswers),
    })),
    students: (result.studentMetrics || []).map((item) => ({
      ...item,
      totalAttempts: numeric(item.totalAttempts),
      averageScore: numeric(item.averageScore),
      correctAnswers: numeric(item.correctAnswers),
      wrongAnswers: numeric(item.wrongAnswers),
      totalPoints: numeric(item.totalPoints),
    })),
    individualRanking: (result.individualRanking || []).map((item) => ({
      ...item,
      capiCoins: numeric(item.capiCoins),
      position: numeric(item.position),
    })),
    teamRanking: (result.teamRanking || []).map((item) => ({
      ...item,
      memberCount: numeric(item.memberCount),
      capiCoins: numeric(item.capiCoins),
      position: numeric(item.position),
    })),
  };
}
