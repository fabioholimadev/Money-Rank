import fetchApi from '../lib/api';

function normalizeError(response, payload, fallback) {
  if (response.ok) return null;
  const error = new Error(payload?.error || fallback);
  error.status = response.status;
  return error;
}

export async function startAuthoritativeActivitySession(phaseNumber, variantId = null) {
  const response = await fetchApi('/api/activity/sessions/start', {
    method: 'POST',
    body: { phaseNumber, variantId },
  });
  const payload = await response.json().catch(() => ({}));
  const error = normalizeError(response, payload, 'Não foi possível preparar a atividade segura.');
  if (error) throw error;
  if (!payload.sessionId) throw new Error('O Capi Bank não devolveu uma sessão válida.');
  return payload;
}

export async function submitAuthoritativeActivitySession(sessionId, answers) {
  const response = await fetchApi(`/api/activity/sessions/${encodeURIComponent(sessionId)}/submit`, {
    method: 'POST',
    body: { answers },
  });
  const payload = await response.json().catch(() => ({}));
  const error = normalizeError(response, payload, 'Não foi possível validar a atividade.');
  if (error) throw error;
  if (!payload.attemptId && payload.score === undefined) throw new Error('O Capi Bank não confirmou o resultado.');
  return payload;
}

export async function advanceAuthoritativeActivitySession(sessionId, itemId, choiceId) {
  const response = await fetchApi(`/api/activity/sessions/${encodeURIComponent(sessionId)}/step`, {
    method: 'POST',
    body: { itemId, choiceId },
  });
  const payload = await response.json().catch(() => ({}));
  const error = normalizeError(response, payload, 'Não foi possível avançar para a próxima etapa.');
  if (error) throw error;
  return payload;
}
