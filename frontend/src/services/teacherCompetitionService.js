import { fetchApiJson } from '../lib/api';
import { normalizeTeacherPeriods } from '../lib/teacherAnalyticsMapper';

function normalizeResponse(value) {
  const period = normalizeTeacherPeriods([value])[0];
  if (!period) throw new Error('O Capi Bank devolveu um período inválido.');
  return period;
}

async function invoke(action, input, fallback) {
  try {
    return normalizeResponse(await fetchApiJson(`/api/actions/${action}`, {
      method: 'POST',
      body: input,
    }));
  } catch (error) {
    throw new Error(error?.message || fallback, { cause: error });
  }
}

export function createTeacherCompetitionPeriod(input) {
  return invoke('teacher-period-create', input, 'Não foi possível criar o período.');
}

export function updateTeacherCompetitionPeriod(input) {
  return invoke('teacher-period-update', input, 'Não foi possível alterar o período.');
}

export function setTeacherCompetitionPeriodStatus(input) {
  return invoke('teacher-period-status', input, 'Não foi possível mudar o funcionamento do período.');
}
