import {
  getTeacherDashboard,
  listTeacherCompetitionPeriods,
} from '@money-rank/dataconnect';
import { QueryFetchPolicy } from 'firebase/data-connect';
import { dataConnect, isDataConnectEnabled } from '../lib/dataConnectClient';
import {
  normalizeTeacherClassMetrics,
  normalizeTeacherPeriods,
  normalizeTeacherPhaseMetrics,
  normalizeTeacherStudentMetrics,
  normalizeTeacherSummary,
} from '../lib/teacherAnalyticsMapper';

const PERIOD_LIMIT = 20;
const STUDENT_LIMIT = 100;

function requireCapiBank() {
  if (!isDataConnectEnabled) {
    throw new Error(
      'O Capi Bank está temporariamente indisponível. Tente novamente em instantes.',
    );
  }
}

export async function fetchTeacherPeriods() {
  requireCapiBank();
  const result = await listTeacherCompetitionPeriods(
    dataConnect,
    { limit: PERIOD_LIMIT },
    { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
  );

  return normalizeTeacherPeriods(result.data.periods);
}

export async function fetchTeacherDashboard(periodId) {
  requireCapiBank();

  if (typeof periodId !== 'string' || periodId.length < 10) {
    throw new Error('Selecione um período válido para analisar.');
  }

  const result = await getTeacherDashboard(
    dataConnect,
    { periodId, studentLimit: STUDENT_LIMIT },
    { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
  );
  const summary = normalizeTeacherSummary(result.data.summary);

  if (!summary) {
    throw new Error(
      'O período não foi encontrado ou seu acesso de professor expirou.',
    );
  }

  return {
    summary,
    classes: normalizeTeacherClassMetrics(result.data.classMetrics),
    phases: normalizeTeacherPhaseMetrics(result.data.phaseMetrics),
    students: normalizeTeacherStudentMetrics(result.data.studentMetrics),
  };
}
