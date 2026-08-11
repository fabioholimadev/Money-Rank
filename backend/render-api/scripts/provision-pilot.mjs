import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnNpx } from './spawn-npx.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../../..');
const outputDirectory = path.join(repositoryRoot, 'outputs');
const shouldDeploy = process.argv.includes('--deploy');
const periodKey = 'piloto-money-rank-2026-08-11';
const schedule = [
  { state: 'ACTIVE', classId: '3DSB', start: '2026-08-11T08:20:00-03:00', end: '2026-08-11T10:00:00-03:00' },
  { state: 'GRACE', classId: '3DSB', start: '2026-08-11T10:00:00-03:00', end: '2026-08-11T10:05:00-03:00' },
  { state: 'PAUSED', classId: null, start: '2026-08-11T10:05:00-03:00', end: '2026-08-11T10:20:00-03:00' },
  { state: 'ACTIVE', classId: '3DSA', start: '2026-08-11T10:20:00-03:00', end: '2026-08-11T12:00:00-03:00' },
  { state: 'GRACE', classId: '3DSA', start: '2026-08-11T12:00:00-03:00', end: '2026-08-11T12:05:00-03:00' },
];

function deterministicUuid(value) {
  const hash = createHash('sha256').update(value).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

async function run(parameters) {
  return new Promise((resolve, reject) => {
    const child = spawnNpx(parameters, { cwd: repositoryRoot, env: process.env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Comando terminou com código ${code}.`)));
  });
}

async function runPedagogicalImport() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(scriptDirectory, 'pedagogical-bank.mjs'), '--commit'], {
      cwd: repositoryRoot,
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Importação terminou com código ${code}.`)));
  });
}

async function execute(operationFile, operationName, variables) {
  await fs.mkdir(outputDirectory, { recursive: true });
  const variablesFile = path.join(outputDirectory, `${operationName}.json`);
  await fs.writeFile(variablesFile, JSON.stringify(variables), 'utf8');
  await run([
    '-y', 'firebase-tools@latest', 'dataconnect:execute', operationFile, operationName,
    '--project', 'money-rank', '--service', 'money-rank-service',
    '--location', 'southamerica-east1', '--variables', `@${variablesFile}`,
  ]);
}

if (shouldDeploy) {
  if (process.env.CONFIRM_SQL_CONNECT_TRIAL !== 'YES') {
    throw new Error('Defina CONFIRM_SQL_CONNECT_TRIAL=YES para confirmar o consumo da única avaliação SQL Connect do projeto Spark.');
  }
  await run(['-y', 'firebase-tools@latest', 'deploy', '--only', 'dataconnect', '--project', 'money-rank']);
}

await execute('dataconnect/connector/mutations.gql', 'UpsertPilotCompetitionPeriod', {
  periodId: deterministicUuid(periodKey),
  periodKey,
  name: 'Piloto Money Rank — 11/08/2026',
  startsAt: '2026-08-11T08:20:00-03:00',
  endsAt: '2026-08-11T12:05:00-03:00',
  schedule,
});
await execute('dataconnect/connector/mutations.gql', 'UpsertEconomyConfig', {
  firstContentReward: 20,
  firstActivityReward: 100,
  repeatActivityReward: 20,
  rewardedRepeatLimitPerDay: null,
  minimumRewardedAttemptIntervalSeconds: 30,
  streakTier3Percent: 110,
  streakTier5Percent: 120,
  streakTier7Percent: 130,
});
await runPedagogicalImport();
await execute('dataconnect/connector/queries.gql', 'GetPedagogicalBankStatus', {});
console.log(JSON.stringify({ provisioned: true, periodKey, totalItems: 140 }, null, 2));
