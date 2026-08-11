import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const schemaUrl = new URL('../../dataconnect/schema/schema.gql', import.meta.url);
const queriesUrl = new URL('../../dataconnect/connector/queries.gql', import.meta.url);
const mutationsUrl = new URL('../../dataconnect/connector/mutations.gql', import.meta.url);

const [schema, queries, mutations] = await Promise.all([
  readFile(schemaUrl, 'utf8'),
  readFile(queriesUrl, 'utf8'),
  readFile(mutationsUrl, 'utf8'),
]);

function operation(source, name, nextName) {
  const start = source.indexOf(name);
  assert.notEqual(start, -1, `${name} deve existir.`);
  const end = nextName ? source.indexOf(nextName, start + name.length) : source.length;
  return source.slice(start, end === -1 ? source.length : end);
}

test('slot único e prazo no servidor impedem duas execuções de teste ativas', () => {
  const testRun = operation(schema, 'type TestRun', 'type TestRunAudit');
  assert.match(testRun, /activeSlot:[\s\S]*@unique/);
  assert.match(testRun, /endsAt: Timestamp!/);

  const activate = operation(mutations, 'mutation ActivateTeacherTestRun', 'mutation EndTeacherTestRun');
  assert.match(activate, /ON CONFLICT \(active_slot\) DO NOTHING/);
  assert.match(activate, /teacher\.role = 'TEACHER'/);
  assert.match(activate, /CURRENT_TIMESTAMP \+ \(\$2 \* INTERVAL '1 minute'\)/);
});

test('tentativa de teste grava somente sessão, tentativa e auditoria isoladas', () => {
  const record = operation(mutations, 'mutation RecordTestActivityAttempt', 'mutation UpdateAuthoritativeActivitySessionState');
  assert.match(record, /session\.is_test = TRUE/);
  assert.match(record, /session\.test_run_id = \$3::uuid/);
  assert.match(record, /reward_amount,[\s\S]*0,/);
  assert.match(record, /INSERT INTO test_run_audit/);
  assert.doesNotMatch(record, /UPDATE student_progress/);
  assert.doesNotMatch(record, /UPDATE users/);
  assert.doesNotMatch(record, /INSERT INTO capi_coin_transactions/);
});

test('limpeza é limitada ao test_run_id encerrado e preserva a auditoria', () => {
  const clean = operation(mutations, 'mutation CleanTeacherTestRun', 'mutation CreateTestActivitySession');
  assert.match(clean, /run\.created_by_uid = \$2/);
  assert.match(clean, /run\.status IN \('ENDED', 'EXPIRED'\)/);
  assert.match(clean, /attempt\.test_run_id = authorized_run\.id[\s\S]*attempt\.is_test = TRUE/);
  assert.match(clean, /session\.test_run_id = authorized_run\.id[\s\S]*session\.is_test = TRUE/);
  assert.doesNotMatch(clean, /DELETE FROM test_run_audit/);
});

test('agregações oficiais excluem explicitamente dados de teste', () => {
  for (const queryName of [
    'GetCompetitionRankings',
    'GetTeacherDashboard',
    'GetCompetitionAbuseSignals',
    'GetPilotExportRows',
  ]) {
    const start = queries.indexOf(`query ${queryName}`);
    assert.notEqual(start, -1, `${queryName} deve existir.`);
    const next = queries.indexOf('\nquery ', start + 7);
    const source = queries.slice(start, next === -1 ? queries.length : next);
    assert.match(source, /is_test = FALSE/, `${queryName} deve excluir registros de teste.`);
  }
});
