const TEAM_CODE_PATTERN = /^\d{8}$/u;

export function normalizeWorkshopTeamCode(value) {
  const code = String(value ?? '').replace(/\D/gu, '');
  return TEAM_CODE_PATTERN.test(code) ? code : '';
}

export function extractWorkshopTeamCode(value) {
  const text = String(value ?? '').trim();
  if (TEAM_CODE_PATTERN.test(text)) return text;

  try {
    const url = new URL(text);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return normalizeWorkshopTeamCode(url.searchParams.get('equipe'));
  } catch {
    return '';
  }
}

export function locationWithSearch(location, fallback = '/') {
  if (!location?.pathname) return fallback;
  return `${location.pathname}${location.search || ''}${location.hash || ''}`;
}
