import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const mutationsPath = new URL(
  '../../dataconnect/connector/mutations.gql',
  import.meta.url,
);
const functionsPath = new URL('../src/index.js', import.meta.url);
const renderApiPath = new URL(
  '../../backend/render-api/server.mjs',
  import.meta.url,
);

function operation(source, name) {
  return source.match(
    new RegExp(`mutation ${name}\\([\\s\\S]*?(?=\\nmutation |\\n# )`),
  )?.[0];
}

test('sessões normais não expiram por prazo de execução', async () => {
  const [mutations, functions, renderApi] = await Promise.all([
    readFile(mutationsPath, 'utf8'),
    readFile(functionsPath, 'utf8'),
    readFile(renderApiPath, 'utf8'),
  ]);

  for (const name of [
    'RegisterMyCurrentPhaseAttempt',
    'CompleteMyCurrentPhase',
    'UpdateAuthoritativeActivitySessionState',
  ]) {
    assert.doesNotMatch(
      operation(mutations, name),
      /session\.expires_at > CURRENT_TIMESTAMP|AND expires_at > CURRENT_TIMESTAMP/,
    );
  }

  assert.match(functions, /UNLIMITED_ACTIVITY_SESSION_END/);
  assert.doesNotMatch(functions, /SESSION_DURATION_MILLISECONDS|deadline-exceeded/);
  assert.match(renderApi, /UNLIMITED_ACTIVITY_SESSION_END/);
  assert.match(renderApi, /access\.source === 'TEST_RUN'[\s\S]*testGrant\.endsAt/);
});

test('modo de teste continua limitado ao prazo administrativo', async () => {
  const mutations = await readFile(mutationsPath, 'utf8');
  assert.match(
    operation(mutations, 'RecordTestActivityAttempt'),
    /session\.expires_at > CURRENT_TIMESTAMP[\s\S]*run\.ends_at > CURRENT_TIMESTAMP/,
  );
});

test('consultas autoritativas usam a credencial administrativa da API', async () => {
  const renderApi = await readFile(renderApiPath, 'utf8');

  for (const operationName of [
    'GetAuthoritativeActivitySession',
    'GetAuthoritativeActivityResult',
  ]) {
    assert.match(
      renderApi,
      new RegExp(`sqlOperation\\(\\s*'${operationName}'`),
      `${operationName} precisa ser chamado pela API.`,
    );
    assert.doesNotMatch(
      renderApi,
      new RegExp(
        `sqlOperation\\(\\s*'${operationName}'\\s*,\\s*\\{[^}]*\\}\\s*,\\s*dataConnectAuth`,
      ),
    );
  }
});
