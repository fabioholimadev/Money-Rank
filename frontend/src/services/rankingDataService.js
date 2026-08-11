import { fetchApiJson } from '../lib/api';
import {
  normalizeClassRanking,
  normalizeIndividualRanking,
} from '../lib/rankingDataMapper';
import { fetchCurrentCompetitionPeriod } from './competitionDataService';

export async function fetchCompetitionRanking() {
  const period = await fetchCurrentCompetitionPeriod();
  if (!period) {
    return { period: null, individuals: [], classes: [] };
  }

  const result = await fetchApiJson('/api/ranking?classId=TODAS');

  return {
    period,
    individuals: normalizeIndividualRanking(
      result.individualRanking,
    ),
    classes: normalizeClassRanking(result.classRanking),
  };
}

