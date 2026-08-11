import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const mutationsPath = new URL(
  '../../dataconnect/connector/mutations.gql',
  import.meta.url,
);
const schemaPath = new URL(
  '../../dataconnect/schema/schema.gql',
  import.meta.url,
);
const indexPath = new URL('../src/index.js', import.meta.url);

function operation(source, name) {
  return source.match(
    new RegExp(`mutation ${name}[\\s\\S]*?(?=\\nmutation |\\n# )`),
  )?.[0];
}

test('slot único garante no máximo um período ACTIVE', async () => {
  const schema = await readFile(schemaPath, 'utf8');
  const mutations = await readFile(mutationsPath, 'utf8');
  assert.match(schema, /activeSlot: String[^\n]*@unique/);

  const statusMutation = operation(
    mutations,
    'SetTeacherCompetitionPeriodStatus',
  );
  assert.match(statusMutation, /active_slot = CASE/);
  assert.match(statusMutation, /THEN 'ACTIVE'/);
  assert.match(statusMutation, /active_period\.status = 'ACTIVE'/);
  assert.match(statusMutation, /period\.starts_at <= CURRENT_TIMESTAMP/);
});

test('criar, editar e mudar status repetem a autorização TEACHER no banco', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  for (const name of [
    'CreateTeacherCompetitionPeriod',
    'UpdateTeacherCompetitionPeriod',
    'SetTeacherCompetitionPeriodStatus',
  ]) {
    const mutation = operation(source, name);
    assert.ok(mutation, `${name} deve existir`);
    assert.match(mutation, /@auth\(level: NO_ACCESS\)/);
    assert.match(mutation, /teacher\.firebase_uid = \$[356]/);
    assert.match(mutation, /teacher\.role = 'TEACHER'/);
    assert.match(mutation, /teacher\.profile_completed = TRUE/);
    assert.doesNotMatch(mutation, /\bDELETE\b/);
  }
});

test('edição preserva encerrados e impede sobreposição', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const mutation = operation(source, 'UpdateTeacherCompetitionPeriod');
  assert.match(mutation, /period\.status <> 'CLOSED'/);
  assert.match(mutation, /existing\.id <> period\.id/);
  assert.match(mutation, /existing\.starts_at < \$4/);
  assert.match(mutation, /existing\.ends_at > \$3/);
  assert.doesNotMatch(mutation, /DELETE FROM competition_periods/);
});

test('encerramento compensa o saldo sem apagar o ledger', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const mutation = operation(source, 'SetTeacherCompetitionPeriodStatus');
  assert.match(mutation, /INSERT INTO capi_coin_transactions/);
  assert.match(mutation, /-student\.capi_coins/);
  assert.match(mutation, /'PERIOD_CLOSE_ADJUSTMENT'/);
  assert.match(mutation, /capi_coins = 0/);
  assert.doesNotMatch(mutation, /DELETE FROM capi_coin_transactions/);
});

test('callables exigem requireTeacher antes de chamar o repositório', async () => {
  const source = await readFile(indexPath, 'utf8');
  for (const name of [
    'createTeacherCompetitionPeriod',
    'updateTeacherCompetitionPeriod',
    'setTeacherCompetitionPeriodStatus',
  ]) {
    const callable = source.match(
      new RegExp(`export const ${name}[\\s\\S]*?(?=\\nexport const )`),
    )?.[0];
    assert.match(callable, /const teacherUid = await requireTeacher\(request\)/);
    assert.match(callable, /actorUid: teacherUid/);
  }
});
