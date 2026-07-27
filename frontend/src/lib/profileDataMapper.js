const APP_CLASS_TO_DATABASE = new Map([
  ['3º DSA', 'THIRD_DSA'],
  ['3º DSB', 'THIRD_DSB'],
]);

const DATABASE_CLASS_TO_APP = new Map(
  [...APP_CLASS_TO_DATABASE].map(([appValue, databaseValue]) => [
    databaseValue,
    appValue,
  ]),
);

const APP_AVATAR_TO_DATABASE = new Map([
  ['capi-cientista', 'CAPI_CIENTISTA'],
  ['capi-professora', 'CAPI_PROFESSORA'],
  ['capi-programadora', 'CAPI_PROGRAMADORA'],
  ['capi-economista', 'CAPI_ECONOMISTA'],
  ['capi-medica', 'CAPI_MEDICA'],
  ['capi-engenheira', 'CAPI_ENGENHEIRA'],
]);

const DATABASE_AVATAR_TO_APP = new Map(
  [...APP_AVATAR_TO_DATABASE].map(([appValue, databaseValue]) => [
    databaseValue,
    appValue,
  ]),
);

export function toDataConnectClass(className) {
  return APP_CLASS_TO_DATABASE.get(className) ?? null;
}

export function fromDataConnectClass(classGroup) {
  return DATABASE_CLASS_TO_APP.get(classGroup) ?? '';
}

export function toDataConnectAvatar(avatarId) {
  return APP_AVATAR_TO_DATABASE.get(avatarId) ?? null;
}

export function fromDataConnectAvatar(avatarId) {
  return DATABASE_AVATAR_TO_APP.get(avatarId) ?? null;
}

/**
 * Mantém os nomes usados pelos componentes atuais enquanto isola os enums e
 * nomes de campos gerados pelo Firebase SQL Connect.
 */
export function mapDataConnectUser(databaseUser) {
  if (!databaseUser) {
    return null;
  }

  return {
    id: databaseUser.uid,
    nome: databaseUser.preferredName,
    email: databaseUser.email,
    turma: fromDataConnectClass(databaseUser.classGroup),
    avatar_id: fromDataConnectAvatar(databaseUser.avatarId),
    avatar_url: databaseUser.avatarUrl ?? null,
    profile_complete: databaseUser.profileCompleted === true,
    capicoins: databaseUser.capiCoins ?? 0,
    fase_atual: databaseUser.currentPhase ?? 1,
    streak_atual: databaseUser.currentStreak ?? 0,
    is_admin: databaseUser.role === 'TEACHER',
    created_at: databaseUser.createdAt ?? null,
    updated_at: databaseUser.updatedAt ?? null,
  };
}
