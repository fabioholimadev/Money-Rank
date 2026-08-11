import { fetchApiJson } from '../lib/api';
import {
  normalizeTeacherClassMetrics,
  normalizeTeacherPeriods,
  normalizeTeacherPhaseMetrics,
  normalizeTeacherStudentMetrics,
  normalizeTeacherSummary,
} from '../lib/teacherAnalyticsMapper';

const PERIOD_LIMIT = 20;
const STUDENT_LIMIT = 100;

export async function fetchTeacherPeriods() {
  const result = await fetchApiJson(`/api/teacher/periods?limit=${PERIOD_LIMIT}`);
  return normalizeTeacherPeriods(result.periods);
}

export async function fetchTeacherDashboard(periodId) {
  if (typeof periodId !== 'string' || periodId.length < 10) {
    throw new Error('Selecione um período válido para analisar.');
  }

  const result = await fetchApiJson(
    `/api/teacher/dashboard?periodId=${encodeURIComponent(periodId)}&studentLimit=${STUDENT_LIMIT}`,
  );
  const summary = normalizeTeacherSummary(result.summary);

  if (!summary) {
    throw new Error(
      'O período não foi encontrado ou seu acesso de professor expirou.',
    );
  }

  return {
    summary,
    classes: normalizeTeacherClassMetrics(result.classMetrics),
    phases: normalizeTeacherPhaseMetrics(result.phaseMetrics),
    students: normalizeTeacherStudentMetrics(result.studentMetrics),
  };
}
