import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const queriesPath = new URL(
  '../../dataconnect/connector/queries.gql',
  import.meta.url,
);
const renderApiPath = new URL(
  '../../backend/render-api/server.mjs',
  import.meta.url,
);
const functionsPath = new URL('../src/index.js', import.meta.url);
const repositoryPath = new URL('../src/activityRepository.js', import.meta.url);
const rankingServicePath = new URL(
  '../../frontend/src/services/rankingDataService.js',
  import.meta.url,
);

function operation(source, kind, name) {
  const start = source.indexOf(`${kind} ${name}`);
  assert.notEqual(start, -1, `${name} deve existir.`);
  const next = source.indexOf(`\n${kind} `, start + name.length);
  return source.slice(start, next === -1 ? source.length : next);
}

test('ranking geral soma créditos sem exigir competição ativa', async () => {
  const [queries, renderApi, rankingService] = await Promise.all([
    readFile(queriesPath, 'utf8'),
    readFile(renderApiPath, 'utf8'),
    readFile(rankingServicePath, 'utf8'),
  ]);
  const rankingQuery = operation(queries, 'query', 'GetGlobalRankings');

  assert.match(rankingQuery, /transactions\.amount > 0/);
  assert.match(rankingQuery, /transactions\.is_test = FALSE/);
  assert.doesNotMatch(rankingQuery, /competition_period_id|target_period/);
  assert.match(
    renderApi,
    /sqlOperation\('GetGlobalRankings', \{ studentLimit: 100 \}/,
  );
  assert.doesNotMatch(renderApi, /resolveOfficialPeriodId/);
  assert.doesNotMatch(rankingService, /fetchCurrentCompetitionPeriod/);
});

test('Fase 1 usa os itens ativos do banco nos dois backends', async () => {
  const [renderApi, functions, repository] = await Promise.all([
    readFile(renderApiPath, 'utf8'),
    readFile(functionsPath, 'utf8'),
    readFile(repositoryPath, 'utf8'),
  ]);
  const renderStart = renderApi.slice(
    renderApi.indexOf("app.post('/api/activity/sessions/start'"),
    renderApi.indexOf("app.post('/api/activity/sessions/:sessionId/step'"),
  );
  const callableStart = functions.slice(
    functions.indexOf('export const startActivitySession'),
    functions.indexOf('export const submitActivitySession'),
  );

  assert.match(renderStart, /ListActivePedagogicalItemsForActivity/);
  assert.match(renderStart, /ListStudentSeenPedagogicalItemIds/);
  assert.match(renderStart, /buildStaticSession\(phaseNumber/);
  assert.doesNotMatch(renderStart, /buildAiPerigoDoceSession/);
  assert.match(callableStart, /getPedagogicalActivityBank/);
  assert.match(callableStart, /buildStaticSession\(phaseNumber/);
  assert.doesNotMatch(callableStart, /buildAiPerigoDoceSession/);
  assert.match(repository, /ListActivePedagogicalItemsForActivity/);
  assert.match(repository, /ListStudentSeenPedagogicalItemIds/);
});
