import { fetchApiJson } from '../lib/api';
import { mapDataConnectUser, toDataConnectAvatar } from '../lib/profileDataMapper';

export async function fetchMyWorkshopContext() {
  const result = await fetchApiJson('/api/workshop/context');
  return result.workshop || null;
}

export async function resolveWorkshopTeam(joinCode) {
  const code = String(joinCode || '').replace(/\D/g, '');
  if (code.length !== 8) throw new Error('Informe os oito dígitos do código da equipe.');
  const result = await fetchApiJson(`/api/workshop/team?code=${encodeURIComponent(code)}`);
  return result.team;
}

export async function joinWorkshopTeam(profile) {
  const avatarId = toDataConnectAvatar(profile.avatar_id);
  if (!avatarId) throw new Error('Escolha uma Capi para representar você.');
  const result = await fetchApiJson('/api/workshop/join', {
    method: 'POST',
    body: {
      fullName: profile.full_name,
      preferredName: profile.nome,
      className: profile.turma,
      joinCode: profile.team_code,
      avatarId,
    },
  });
  return {
    profile: mapDataConnectUser(result.profile),
    workshop: result.workshop || null,
  };
}

export async function fetchWorkshopRanking() {
  return fetchApiJson('/api/workshop/ranking');
}
