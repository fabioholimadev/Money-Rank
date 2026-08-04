import { listVisibleCompetitionPeriods } from '@money-rank/dataconnect';
import { QueryFetchPolicy } from 'firebase/data-connect';
import {
  dataConnect,
  isDataConnectEnabled,
} from '../lib/dataConnectClient';
import {
  normalizeCompetitionPeriod,
  selectCurrentCompetitionPeriod,
} from '../lib/competitionPeriod';

function requireDataConnect() {
  if (!isDataConnectEnabled) {
    throw new Error(
      'O Capi Bank está temporariamente indisponível. Tente novamente em instantes.',
    );
  }
}

export async function fetchVisibleCompetitionPeriods() {
  requireDataConnect();

  const result = await listVisibleCompetitionPeriods(dataConnect, {
    fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
  });

  return (result.data.competitionPeriods ?? [])
    .map(normalizeCompetitionPeriod)
    .filter(Boolean);
}

export async function fetchCurrentCompetitionPeriod(
  currentTime = new Date(),
) {
  const periods = await fetchVisibleCompetitionPeriods();
  return selectCurrentCompetitionPeriod(periods, currentTime);
}
