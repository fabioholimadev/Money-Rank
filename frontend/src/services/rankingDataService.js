import { fetchApiJson } from '../lib/api';
import {
  normalizeClassRanking,
  normalizeIndividualRanking,
} from '../lib/rankingDataMapper';

export async function fetchGlobalRanking() {
  const result = await fetchApiJson('/api/ranking?classId=TODAS');

  return {
    scope: result.scope ?? 'ALL_TIME',
    individuals: normalizeIndividualRanking(
      result.individualRanking,
    ),
    classes: normalizeClassRanking(result.classRanking),
  };
}
