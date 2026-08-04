import assert from 'node:assert/strict';
import {
  USER_ROLES,
  canProfileAccessRole,
  getHomePathForProfile,
  getProfileRole,
} from '../frontend/src/lib/roleAccess.js';

const student = { role: 'STUDENT', is_admin: false };
const teacher = { role: 'TEACHER', is_admin: true };

assert.equal(getProfileRole(student), USER_ROLES.STUDENT);
assert.equal(getProfileRole(teacher), USER_ROLES.TEACHER);
assert.equal(getProfileRole({ role: 'UNKNOWN' }), USER_ROLES.STUDENT);
assert.equal(getHomePathForProfile(student), '/student');
assert.equal(getHomePathForProfile(teacher), '/professor');
assert.equal(canProfileAccessRole(student, USER_ROLES.STUDENT), true);
assert.equal(canProfileAccessRole(student, USER_ROLES.TEACHER), false);
assert.equal(canProfileAccessRole(teacher, USER_ROLES.TEACHER), true);
assert.equal(canProfileAccessRole(teacher, USER_ROLES.STUDENT), false);
assert.equal(canProfileAccessRole(teacher, null), true);

console.log(
  'Acesso por papel validado: aluno e professor possuem destinos isolados.',
);
