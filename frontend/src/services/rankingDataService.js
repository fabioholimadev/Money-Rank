import { getCompetitionRankings } from '@money-rank/dataconnect';
import { QueryFetchPolicy } from 'firebase/data-connect';
import { dataConnect, isDataConnectEnabled } from '../lib/dataConnectClient';
import {
  normalizeClassRanking,
  normalizeIndividualRanking,
} from '../lib/rankingDataMapper';
import { fetchCurrentCompetitionPeriod } from './competitionDataService';

const STUDENT_RANKING_LIMIT = 100;

export async function fetchCompetitionRanking() {
  if (!isDataConnectEnabled) {
    throw new Error(
      'O Capi Bank está temporariamente indisponível. Tente novamente em instantes.',
    );
  }

  const period = await fetchCurrentCompetitionPeriod();
  if (!period) {
    return { period: null, individuals: [], classes: [] };
  }

  const result = await getCompetitionRankings(
    dataConnect,
    {
      periodId: period.id,
      studentLimit: STUDENT_RANKING_LIMIT,
    },
    { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
  );

  return {
    period,
    individuals: normalizeIndividualRanking(
      result.data.individualRanking,
    ),
    classes: normalizeClassRanking(result.data.classRanking),
  };
}

