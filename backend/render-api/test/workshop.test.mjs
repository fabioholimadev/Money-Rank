import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createJoinCode,
  isWorkshopCompetitionOpen,
  normalizeJoinCode,
  normalizeWorkshopEventInput,
  normalizeWorkshopProfileInput,
  normalizeWorkshopTeamInput,
} from '../workshop.mjs';

test('gera e aceita código de equipe com exatamente oito dígitos', () => {
  assert.equal(createJoinCode(() => 42), '00000042');
  assert.equal(normalizeJoinCode('12 34-5678'), '12345678');
  assert.throws(() => normalizeJoinCode('1234567'), /invalid_workshop_join_code/);
});

test('pontuação da oficina abre somente dentro do período ativo', () => {
  const context = {
    eventStatus: 'ACTIVE',
    periodStatus: 'SCHEDULED',
    startsAt: '2026-10-18T10:00:00.000Z',
    endsAt: '2026-10-18T12:00:00.000Z',
  };
  assert.equal(isWorkshopCompetitionOpen(context, new Date('2026-10-18T11:00:00.000Z')), true);
  assert.equal(isWorkshopCompetitionOpen(context, new Date('2026-10-18T12:00:00.000Z')), false);
  assert.equal(isWorkshopCompetitionOpen({ ...context, periodStatus: 'PAUSED' }, new Date('2026-10-18T11:00:00.000Z')), false);
});

test('normaliza dados da oficina e mantém a trilha fixa', () => {
  assert.deepEqual(normalizeWorkshopEventInput({
    name: '  Ciência   Delas  ',
    competitionPeriodId: '123e4567-e89b-12d3-a456-426614174000',
  }), {
    name: 'Ciência Delas',
    competitionPeriodId: '123e4567-e89b-12d3-a456-426614174000',
    trailKey: 'ciencia-delas',
  });
  assert.deepEqual(normalizeWorkshopTeamInput({ name: '  Ada  Lovelace ' }), {
    name: 'Ada Lovelace',
  });
});

test('cadastro da oficina exige identidade, turma, equipe e avatar válidos', () => {
  assert.deepEqual(normalizeWorkshopProfileInput({
    fullName: '  Maria   da Silva ',
    preferredName: ' Mari ',
    className: ' Escola Técnica - 2º ano ',
    joinCode: '87654321',
    avatarId: 'CAPI_CIENTISTA',
  }), {
    fullName: 'Maria da Silva',
    preferredName: 'Mari',
    className: 'Escola Técnica - 2º ano',
    joinCode: '87654321',
    avatarId: 'CAPI_CIENTISTA',
    avatarUrl: null,
  });
  assert.throws(() => normalizeWorkshopProfileInput({
    fullName: 'A',
    preferredName: 'B',
    className: '',
    joinCode: '12345678',
  }));
});
