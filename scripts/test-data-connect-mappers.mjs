import assert from 'node:assert/strict';
import {
  fromDataConnectAvatar,
  fromDataConnectClass,
  mapDataConnectUser,
  toDataConnectAvatar,
  toDataConnectClass,
} from '../frontend/src/lib/profileDataMapper.js';

assert.equal(toDataConnectClass('3º DSA'), 'THIRD_DSA');
assert.equal(toDataConnectClass('3º DSB'), 'THIRD_DSB');
assert.equal(toDataConnectClass('Turma inexistente'), null);
assert.equal(fromDataConnectClass('THIRD_DSA'), '3º DSA');
assert.equal(fromDataConnectClass('THIRD_DSB'), '3º DSB');
assert.equal(fromDataConnectClass('UNKNOWN'), '');

assert.equal(toDataConnectAvatar('capi-cientista'), 'CAPI_CIENTISTA');
assert.equal(toDataConnectAvatar('capi-engenheira'), 'CAPI_ENGENHEIRA');
assert.equal(toDataConnectAvatar('avatar-inexistente'), null);
assert.equal(fromDataConnectAvatar('CAPI_MEDICA'), 'capi-medica');
assert.equal(fromDataConnectAvatar('UNKNOWN'), null);

const mappedProfile = mapDataConnectUser({
  uid: 'firebase-uid',
  email: 'aluno@example.com',
  preferredName: 'Ana',
  classGroup: 'THIRD_DSB',
  role: 'STUDENT',
  avatarId: 'CAPI_PROGRAMADORA',
  avatarUrl: null,
  profileCompleted: true,
  capiCoins: 120,
  currentPhase: 4,
  currentStreak: 3,
  lastStreakDate: '2026-07-27',
  createdAt: '2026-07-27T12:00:00.000Z',
  updatedAt: '2026-07-27T13:00:00.000Z',
});

assert.deepEqual(mappedProfile, {
  id: 'firebase-uid',
  nome: 'Ana',
  email: 'aluno@example.com',
  turma: '3º DSB',
  avatar_id: 'capi-programadora',
  avatar_url: null,
  profile_complete: true,
  capicoins: 120,
  fase_atual: 4,
  streak_atual: 3,
  ultimo_streak_em: '2026-07-27',
  is_admin: false,
  created_at: '2026-07-27T12:00:00.000Z',
  updated_at: '2026-07-27T13:00:00.000Z',
});

assert.equal(mapDataConnectUser(null), null);

console.log('Mapeamentos do SQL Connect validados com sucesso.');
