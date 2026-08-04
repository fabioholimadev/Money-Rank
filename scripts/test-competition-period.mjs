import assert from 'node:assert/strict';
import {
  COMPETITION_PERIOD_STATUSES,
  getEffectiveCompetitionStatus,
  normalizeCompetitionPeriod,
  selectCurrentCompetitionPeriod,
} from '../frontend/src/lib/competitionPeriod.js';

const scheduledPeriod = {
  id: '5af94f1d-610f-4789-995a-7d3198a894ec',
  name: 'Piloto 3º DSA x 3º DSB',
  status: 'SCHEDULED',
  startsAt: '2026-08-06T11:00:00.000Z',
  endsAt: '2026-08-13T11:00:00.000Z',
  pausedAt: null,
  closedAt: null,
  updatedAt: '2026-08-04T12:00:00.000Z',
};

assert.equal(
  getEffectiveCompetitionStatus(
    scheduledPeriod,
    '2026-08-06T10:59:59.999Z',
  ),
  COMPETITION_PERIOD_STATUSES.SCHEDULED,
);
assert.equal(
  getEffectiveCompetitionStatus(
    scheduledPeriod,
    '2026-08-06T11:00:00.000Z',
  ),
  COMPETITION_PERIOD_STATUSES.ACTIVE,
);
assert.equal(
  getEffectiveCompetitionStatus(
    scheduledPeriod,
    '2026-08-13T11:00:00.000Z',
  ),
  COMPETITION_PERIOD_STATUSES.CLOSED,
);

const pausedPeriod = {
  ...scheduledPeriod,
  status: 'PAUSED',
  pausedAt: '2026-08-08T15:00:00.000Z',
};
assert.equal(
  getEffectiveCompetitionStatus(
    pausedPeriod,
    '2026-08-08T16:00:00.000Z',
  ),
  COMPETITION_PERIOD_STATUSES.PAUSED,
);

const activePeriod = {
  ...scheduledPeriod,
  id: '47c1618d-eb0d-40c7-a604-97321ad0bd21',
  name: 'Período ativo',
  status: 'ACTIVE',
};
assert.equal(
  selectCurrentCompetitionPeriod(
    [pausedPeriod, activePeriod],
    '2026-08-08T16:00:00.000Z',
  ).id,
  activePeriod.id,
);

assert.equal(
  normalizeCompetitionPeriod({
    ...scheduledPeriod,
    endsAt: scheduledPeriod.startsAt,
  }),
  null,
);
assert.equal(normalizeCompetitionPeriod(null), null);

console.log(
  'Períodos competitivos validados: agendamento, ativação automática, pausa, encerramento e seleção segura.',
);
