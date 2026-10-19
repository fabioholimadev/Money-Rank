import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const mutationsPath = new URL(
  '../../dataconnect/connector/mutations.gql',
  import.meta.url,
);
const queriesPath = new URL(
  '../../dataconnect/connector/queries.gql',
  import.meta.url,
);
const scriptPath = new URL(
  '../../backend/render-api/scripts/reset-production-data.mjs',
  import.meta.url,
);

function operation(source, kind, name) {
  return source.match(
    new RegExp(`${kind} ${name}[\\s\\S]*?(?=\\n${kind} |\\n# )`),
  )?.[0];
}

test('preflight conta o alcance sem devolver identidade dos usuários', async () => {
  const source = await readFile(queriesPath, 'utf8');
  const query = operation(source, 'query', 'AuditFreshStartState');
  assert.ok(query);
  assert.match(query, /"preservedTeacherUsers"/);
  assert.match(query, /"otherTeacherUsers"/);
  assert.match(query, /"activityAttempts"/);
  assert.doesNotMatch(query, /SELECT[\s\S]*firebase_uid/);
  assert.doesNotMatch(query, /AS "email"/);
});

test('reset preserva conteúdo e só executa se o professor existir', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const mutation = operation(source, 'mutation', 'ResetApplicationForFreshStart');
  assert.ok(mutation);
  assert.match(mutation, /EXISTS \(SELECT 1 FROM preserved_teacher\)/);
  assert.match(mutation, /LOWER\(email\) <> LOWER\(BTRIM\(\$1\)\)/);
  assert.match(mutation, /role = 'TEACHER'/);
  for (const table of [
    'student_progress',
    'activity_sessions',
    'activity_attempts',
    'capi_coin_transactions',
    'workshop_memberships',
    'workshop_teams',
    'workshop_events',
    'competition_periods',
    'users',
  ]) {
    assert.match(mutation, new RegExp(`DELETE FROM ${table}`));
  }
  for (const preservedTable of [
    'pedagogical_items',
    'pedagogical_bank_loads',
    'learning_module_versions',
    'activity_definition_versions',
    'economy_config',
  ]) {
    assert.doesNotMatch(mutation, new RegExp(`DELETE FROM ${preservedTable}`));
  }
});

test('script é dry-run por padrão e fixa o único professor preservado', async () => {
  const source = await readFile(scriptPath, 'utf8');
  assert.match(source, /fabiooliveiral2020@gmail\.com/);
  assert.match(source, /process\.argv\.includes\('--commit'\)/);
  assert.match(source, /CONFIRM_FRESH_START/);
  assert.match(source, /preserved_teacher_must_exist_exactly_once/);
  assert.match(source, /auth\.deleteUsers/);
});
