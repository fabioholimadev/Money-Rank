import crypto from 'node:crypto';

const AVATARS = new Set([
  'CAPI_CIENTISTA',
  'CAPI_PROFESSORA',
  'CAPI_PROGRAMADORA',
  'CAPI_ECONOMISTA',
  'CAPI_MEDICA',
  'CAPI_ENGENHEIRA',
]);

function compactText(value, maxLength) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

export function normalizeJoinCode(value) {
  const code = String(value || '').replace(/\D/g, '');
  if (!/^\d{8}$/.test(code)) throw new Error('invalid_workshop_join_code');
  return code;
}

export function createJoinCode(randomInt = crypto.randomInt) {
  return String(randomInt(0, 100_000_000)).padStart(8, '0');
}

export function normalizeWorkshopEventInput(value) {
  const name = compactText(value?.name, 100);
  const competitionPeriodId = String(value?.competitionPeriodId || '').trim();
  if (name.length < 3) throw new Error('invalid_workshop_name');
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(competitionPeriodId)) {
    throw new Error('invalid_period_id');
  }
  return { name, competitionPeriodId, trailKey: 'ciencia-delas' };
}

export function normalizeWorkshopTeamInput(value) {
  const name = compactText(value?.name, 60);
  if (name.length < 2) throw new Error('invalid_workshop_team_name');
  return { name };
}

export function normalizeWorkshopProfileInput(value) {
  const fullName = compactText(value?.fullName, 100);
  const preferredName = compactText(value?.preferredName, 40);
  const className = compactText(value?.className, 80);
  const joinCode = normalizeJoinCode(value?.joinCode);
  const avatarId = value?.avatarId ? String(value.avatarId) : null;
  const avatarUrl = value?.avatarUrl ? String(value.avatarUrl).trim() : null;

  if (fullName.length < 3) throw new Error('invalid_workshop_full_name');
  if (preferredName.length < 2) throw new Error('invalid_preferred_name');
  if (className.length < 1) throw new Error('invalid_workshop_class_name');
  if (avatarId && !AVATARS.has(avatarId)) throw new Error('invalid_avatar');
  if (!avatarId && !avatarUrl) throw new Error('workshop_avatar_required');
  if (avatarUrl) {
    let parsed;
    try { parsed = new URL(avatarUrl); } catch { parsed = null; }
    if (parsed?.protocol !== 'https:') throw new Error('invalid_avatar_url');
  }

  return {
    fullName,
    preferredName,
    className,
    joinCode,
    avatarId,
    avatarUrl: avatarId ? null : avatarUrl,
  };
}

export function isWorkshopCompetitionOpen(context, now = new Date()) {
  const startsAt = Date.parse(context?.startsAt);
  const endsAt = Date.parse(context?.endsAt);
  const periodStatus = String(context?.periodStatus || '').toUpperCase();
  return context?.eventStatus === 'ACTIVE'
    && ['SCHEDULED', 'ACTIVE'].includes(periodStatus)
    && Number.isFinite(startsAt)
    && Number.isFinite(endsAt)
    && startsAt <= now.getTime()
    && now.getTime() < endsAt;
}
