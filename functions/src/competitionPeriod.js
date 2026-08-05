const INITIAL_STATUSES = new Set(['DRAFT', 'SCHEDULED']);
const MUTABLE_STATUSES = new Set([
  'DRAFT',
  'SCHEDULED',
  'ACTIVE',
  'PAUSED',
  'CLOSED',
]);

function normalizeUuid(value) {
  const compact = String(value ?? '').trim().replaceAll('-', '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(compact)) {
    throw new Error('O período informado é inválido.');
  }
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join('-');
}

function normalizeName(value) {
  const name = typeof value === 'string'
    ? value.trim().replace(/\s+/g, ' ')
    : '';
  if (name.length < 3 || name.length > 80) {
    throw new Error('O nome do período deve ter entre 3 e 80 caracteres.');
  }
  return name;
}

function normalizeTimestamp(value, field) {
  const input = typeof value === 'string' ? value.trim() : '';
  const timestamp = new Date(input);
  if (!input || !Number.isFinite(timestamp.getTime())) {
    throw new Error(`${field} precisa ser uma data e hora válida.`);
  }
  return timestamp.toISOString();
}

function normalizeWindow(data) {
  const startsAt = normalizeTimestamp(data?.startsAt, 'O início');
  const endsAt = normalizeTimestamp(data?.endsAt, 'O fim');
  if (Date.parse(startsAt) >= Date.parse(endsAt)) {
    throw new Error('O fim do período precisa ser posterior ao início.');
  }
  return { startsAt, endsAt };
}

export function normalizeCompetitionPeriodCreateInput(data) {
  const status = String(data?.status ?? 'DRAFT').trim().toUpperCase();
  if (!INITIAL_STATUSES.has(status)) {
    throw new Error('Um novo período deve iniciar como DRAFT ou SCHEDULED.');
  }
  return {
    name: normalizeName(data?.name),
    ...normalizeWindow(data),
    status,
  };
}

export function normalizeCompetitionPeriodUpdateInput(data) {
  return {
    periodId: normalizeUuid(data?.periodId),
    name: normalizeName(data?.name),
    ...normalizeWindow(data),
  };
}

export function normalizeCompetitionPeriodStatusInput(data) {
  const status = String(data?.status ?? '').trim().toUpperCase();
  if (!MUTABLE_STATUSES.has(status)) {
    throw new Error('O status solicitado para o período é inválido.');
  }
  return {
    periodId: normalizeUuid(data?.periodId),
    status,
  };
}

export const COMPETITION_PERIOD_INITIAL_STATUSES = Object.freeze(
  [...INITIAL_STATUSES],
);
