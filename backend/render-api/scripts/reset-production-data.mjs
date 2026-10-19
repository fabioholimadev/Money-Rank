import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDataConnect } from 'firebase-admin/data-connect';

const PRESERVED_TEACHER_EMAIL = 'fabiooliveiral2020@gmail.com';
const CONFIRMATION = 'APAGAR_DADOS_DO_MONEY_RANK';

function requiredEnvironment(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`missing_environment:${name}`);
  return value;
}

function normalizePrivateKey(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n');
}

async function listAllAuthUsers(auth) {
  const users = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return users;
}

function unwrap(response) {
  if (response?.errors?.length) {
    throw new Error(response.errors[0]?.message || 'data_connect_error');
  }
  return response?.data || {};
}

const projectId = requiredEnvironment('FIREBASE_PROJECT_ID');
const clientEmail = requiredEnvironment('FIREBASE_CLIENT_EMAIL');
const privateKey = normalizePrivateKey(requiredEnvironment('FIREBASE_PRIVATE_KEY'));
if (!privateKey.includes('BEGIN PRIVATE KEY')) throw new Error('invalid_private_key');

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
}

const auth = getAuth();
const dataConnect = getDataConnect({
  location: String(process.env.SQL_CONNECT_LOCATION || 'southamerica-east1').trim(),
  serviceId: String(process.env.SQL_CONNECT_SERVICE || 'money-rank-service').trim(),
  connector: String(process.env.SQL_CONNECT_CONNECTOR || 'money-rank-connector').trim(),
});

const authUsers = await listAllAuthUsers(auth);
const preservedAuthUsers = authUsers.filter(
  (user) => String(user.email || '').trim().toLowerCase() === PRESERVED_TEACHER_EMAIL,
);
const authUsersToDelete = authUsers.filter(
  (user) => String(user.email || '').trim().toLowerCase() !== PRESERVED_TEACHER_EMAIL,
);
const databaseAudit = unwrap(await dataConnect.executeQuery(
  'AuditFreshStartState',
  { preservedTeacherEmail: PRESERVED_TEACHER_EMAIL },
)).state;

console.log(JSON.stringify({
  mode: process.argv.includes('--commit') ? 'commit' : 'dry-run',
  projectId,
  preservedTeacherEmail: PRESERVED_TEACHER_EMAIL,
  auth: {
    totalUsers: authUsers.length,
    preservedUsers: preservedAuthUsers.length,
    usersToDelete: authUsersToDelete.length,
  },
  database: databaseAudit,
}, null, 2));

if (!process.argv.includes('--commit')) {
  console.log('Dry-run concluído. Nenhum dado foi alterado.');
  process.exit(0);
}

if (process.env.CONFIRM_FRESH_START !== CONFIRMATION) {
  throw new Error('fresh_start_confirmation_missing');
}
if (preservedAuthUsers.length !== 1 || Number(databaseAudit?.preservedTeacherUsers) !== 1) {
  throw new Error('preserved_teacher_must_exist_exactly_once');
}

const resetResult = unwrap(await dataConnect.executeMutation(
  'ResetApplicationForFreshStart',
  { preservedTeacherEmail: PRESERVED_TEACHER_EMAIL },
)).result;
if (!resetResult?.preservedTeacherEmail) throw new Error('database_reset_not_applied');

let deletedAuthUsers = 0;
for (let index = 0; index < authUsersToDelete.length; index += 1000) {
  const batch = authUsersToDelete.slice(index, index + 1000).map((user) => user.uid);
  const result = await auth.deleteUsers(batch);
  deletedAuthUsers += result.successCount;
  if (result.failureCount > 0) {
    throw new Error(`auth_cleanup_partial_failure:${result.failureCount}`);
  }
}

const finalAudit = unwrap(await dataConnect.executeQuery(
  'AuditFreshStartState',
  { preservedTeacherEmail: PRESERVED_TEACHER_EMAIL },
)).state;
console.log(JSON.stringify({
  completed: true,
  deletedAuthUsers,
  databaseReset: resetResult,
  finalDatabaseState: finalAudit,
}, null, 2));
