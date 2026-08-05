import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeCompetitionPeriodCreateInput,
  normalizeCompetitionPeriodStatusInput,
  normalizeCompetitionPeriodUpdateInput,
} from '../src/competitionPeriod.js';

const validWindow = {
  startsAt: '2026-08-05T12:00:00-03:00',
  endsAt: '2026-08-12T12:00:00-03:00',
};

test('novo período aceita somente DRAFT ou SCHEDULED', () => {
  for (const status of ['DRAFT', 'SCHEDULED']) {
    const input = normalizeCompetitionPeriodCreateInput({
      name: '  Piloto   DSA x DSB  ',
      status,
      ...validWindow,
    });
    assert.equal(input.name, 'Piloto DSA x DSB');
    assert.equal(input.status, status);
  }
  assert.throws(
    () => normalizeCompetitionPeriodCreateInput({
      name: 'Piloto DSA x DSB',
      status: 'ACTIVE',
      ...validWindow,
    }),
    /DRAFT ou SCHEDULED/,
  );
});

test('edição permite ampliar ou reduzir uma janela ainda válida', () => {
  const input = normalizeCompetitionPeriodUpdateInput({
    periodId: '11111111-1111-4111-8111-111111111111',
    name: 'Período ajustado',
    startsAt: '2026-08-04T12:00:00.000Z',
    endsAt: '2026-08-20T12:00:00.000Z',
  });
  assert.equal(input.startsAt, '2026-08-04T12:00:00.000Z');
  assert.equal(input.endsAt, '2026-08-20T12:00:00.000Z');

  assert.throws(
    () => normalizeCompetitionPeriodUpdateInput({
      ...input,
      startsAt: input.endsAt,
    }),
    /posterior ao início/,
  );
});

test('ações explícitas aceitam ativar, pausar e encerrar', () => {
  for (const status of ['ACTIVE', 'PAUSED', 'CLOSED']) {
    assert.equal(normalizeCompetitionPeriodStatusInput({
      periodId: '22222222-2222-4222-8222-222222222222',
      status: status.toLowerCase(),
    }).status, status);
  }
  assert.throws(
    () => normalizeCompetitionPeriodStatusInput({
      periodId: '22222222-2222-4222-8222-222222222222',
      status: 'DELETED',
    }),
    /status solicitado/,
  );
});

test('canonicaliza UUID compacto devolvido pelo Capi Bank', () => {
  const compactId = '33333333333343338333333333333333';
  const canonicalId = '33333333-3333-4333-8333-333333333333';
  assert.equal(normalizeCompetitionPeriodUpdateInput({
    periodId: compactId,
    name: 'Período compacto',
    ...validWindow,
  }).periodId, canonicalId);
  assert.equal(normalizeCompetitionPeriodStatusInput({
    periodId: compactId,
    status: 'CLOSED',
  }).periodId, canonicalId);
});
