import { fetchApiJson } from '../lib/api';

export async function askTeacherData({ periodId, question }) {
  const result = await fetchApiJson('/api/actions/teacher-data-chat', {
    method: 'POST',
    body: { periodId, question },
  });
  if (!result?.answer || result.periodId !== periodId) {
    throw new Error('O Capi Analista devolveu uma resposta inválida.');
  }
  return result;
}
