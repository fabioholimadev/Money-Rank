export const USER_ROLES = Object.freeze({
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
});

export function getProfileRole(profile) {
  if (profile?.role === USER_ROLES.TEACHER || profile?.is_admin === true) {
    return USER_ROLES.TEACHER;
  }

  return USER_ROLES.STUDENT;
}

export function getHomePathForProfile(profile) {
  return getProfileRole(profile) === USER_ROLES.TEACHER
    ? '/professor'
    : '/student';
}

export function canProfileAccessRole(profile, requiredRole) {
  if (!requiredRole) return true;
  return getProfileRole(profile) === requiredRole;
}
