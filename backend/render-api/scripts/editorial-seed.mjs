import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import seed from '../../../functions/src/generated/editorial-seed.json' with { type: 'json' };
import {
  validateActivityDefinitionPayload,
  validateLearningModulePayload,
} from '../../../functions/src/editorialValidation.js';
import { spawnNpx } from './spawn-npx.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../../..');
const projectId = 'money-rank';
const serviceId = 'money-rank-service';
const location = 'southamerica-east1';
const mutationFile = 'dataconnect/connector/mutations.gql';
const variablesDirectory = path.join(repositoryRoot, 'outputs/editorial-seed');

function deterministicUuid(value) {
  const hash = createHash('sha256').update(value).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

async function execute(operationName, variables, variableKey) {
  await fs.mkdir(variablesDirectory, { recursive: true });
  const variablesFile = path.join(variablesDirectory, `${variableKey}.json`);
  await fs.writeFile(variablesFile, JSON.stringify(variables), 'utf8');
  const parameters = [
    '-y',
    'firebase-tools@latest',
    'dataconnect:execute',
    mutationFile,
    operationName,
    '--project', projectId,
    '--service', serviceId,
    '--location', location,
    '--no-debug-details',
    '--variables', `@${variablesFile}`,
  ];

  return new Promise((resolve, reject) => {
    // firebase-tools may finish the Data Connect request and then abort with
    // UV_HANDLE_CLOSING when it is a nested Node 24 child process on Windows.
    // PowerShell owns that child lifecycle and returns the real CLI exit code.
    const child = process.platform === 'win32'
      ? spawn('powershell.exe', [
        '-NoLogo',
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        '$cliArgs = ConvertFrom-Json $env:MONEY_RANK_NPX_ARGS; & npx @cliArgs',
      ], {
        cwd: repositoryRoot,
        env: {
          ...process.env,
          MONEY_RANK_NPX_ARGS: JSON.stringify(parameters),
        },
        stdio: 'inherit',
      })
      : spawnNpx(parameters, {
        cwd: repositoryRoot,
        env: process.env,
        stdio: 'inherit',
      });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (process.platform === 'win32' && [1, 3221226505].includes(code)) {
        console.warn(`${operationName}: o Firebase CLI encerrou após a resposta do SQL Connect; a carga será reconciliada ao final.`);
        resolve();
        return;
      }
      if (code !== 0) {
        reject(new Error(`${operationName} falhou com código ${code}.`));
        return;
      }
      resolve();
    });
  });
}
const publishedAt = new Date().toISOString();

for (const item of seed.learningModules) {
  const payload = validateLearningModulePayload(item.payload, item.moduleKey, item.phaseNumber);
  await execute('UpsertLearningModuleSeed', {
    versionId: deterministicUuid(`learning-module:${item.moduleKey}:1`),
    auditId: deterministicUuid(`learning-module:${item.moduleKey}:1:audit`),
    moduleKey: item.moduleKey,
    phaseNumber: item.phaseNumber,
    title: item.title,
    payload,
    publishedAt,
  }, `module-${item.moduleKey}`);
}

for (const item of seed.activityDefinitions) {
  const payload = validateActivityDefinitionPayload(item.payload, item.activityKey, item.phaseNumber);
  await execute('UpsertActivityDefinitionSeed', {
    versionId: deterministicUuid(`activity-definition:${item.activityKey}:1`),
    auditId: deterministicUuid(`activity-definition:${item.activityKey}:1:audit`),
    activityKey: item.activityKey,
    phaseNumber: item.phaseNumber,
    title: item.title,
    payload,
    publishedAt,
  }, `activity-${item.activityKey}`);
}

console.log(JSON.stringify({
  status: 'IMPORTED',
  executedModules: seed.learningModules.length,
  executedActivities: seed.activityDefinitions.length,
}, null, 2));
