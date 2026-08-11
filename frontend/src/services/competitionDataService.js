import { fetchApiJson } from '../lib/api';
import {
  normalizeCompetitionPeriod,
  selectCurrentCompetitionPeriod,
} from '../lib/competitionPeriod';

export async function fetchVisibleCompetitionPeriods() {
  const result = await fetchApiJson('/api/period');
  return (result.periods ?? [])
    .map(normalizeCompetitionPeriod)
    .filter(Boolean);
}

export async function fetchCurrentCompetitionPeriod(
  currentTime = new Date(),
) {
  const periods = await fetchVisibleCompetitionPeriods();
  return selectCurrentCompetitionPeriod(periods, currentTime);
}
