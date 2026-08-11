import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { spawnNpx } from './spawn-npx.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../../..');
const outputDirectory = path.join(repositoryRoot, 'outputs');
const mode = process.argv.includes('--cleanup')
  ? 'cleanup'
  : process.argv.includes('--full') ? 'full' : 'smoke';
const userCount = mode === 'full' ? 100 : 10;
const runId = process.env.LOAD_TEST_RUN_ID || `load-${new Date().toISOString().replaceAll(/[:.]/g, '-')}`;
const apiUrl = String(process.env.API_URL || '').replace(/\/$/, '');
const projectId = process.env.FIREBASE_PROJECT_ID;
const apiKey = process.env.FIREBASE_WEB_API_KEY;
const appId = process.env.FIREBASE_WEB_APP_ID;
const debugToken = process.env.APPCHECK_DEBUG_TOKEN;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Mantém a execução completa abaixo da cota diária aproximada do Spark:
// cinco fluxos por usuário em 15 minutos, além do provisionamento e limpeza.
const fullFlowIntervalMs = 180_000;

function requireEnvironment(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Variáveis obrigatórias ausentes: ${missing.join(', ')}.`);
}

async function runFirebaseCli(parameters) {
  return new Promise((resolve, reject) => {
    const child = spawnNpx(['-y', 'firebase-tools@latest', ...parameters], {
      cwd: repositoryRoot,
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Firebase CLI terminou com código ${code}.`)));
  });
}

async function executeOperation(file, operation, variables) {
  await fs.mkdir(outputDirectory, { recursive: true });
  const variablesFile = path.join(outputDirectory, `${operation}-${runId}.json`);
  await fs.writeFile(variablesFile, JSON.stringify(variables), 'utf8');
  await runFirebaseCli([
    'dataconnect:execute', file, operation,
    '--project', 'money-rank',
    '--service', 'money-rank-service',
    '--location', 'southamerica-east1',
    '--variables', `@${variablesFile}`,
  ]);
}

function initializeAdmin() {
  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return getAuth();
}

async function exchangeCustomToken(customToken) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.idToken) throw new Error(payload?.error?.message || 'Falha ao trocar Custom Token.');
  return payload.idToken;
}

async function exchangeDebugToken() {
  const response = await fetch(`https://firebaseappcheck.googleapis.com/v1/projects/${projectId}/apps/${encodeURIComponent(appId)}:exchangeDebugToken?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ debugToken }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.token) throw new Error(payload?.error?.message || 'Falha ao trocar App Check Debug Token.');
  return payload.token;
}

async function apiRequest(endpoint, idToken, appCheckToken, options = {}) {
  const startedAt = performance.now();
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'X-Firebase-AppCheck': appCheckToken,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const durationMs = performance.now() - startedAt;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(payload.error || `HTTP ${response.status}`), { durationMs, status: response.status });
  return { payload, durationMs };
}

function percentile(values, percentileValue) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * percentileValue) - 1)];
}

async function createSyntheticUsers(auth) {
  const users = [];
  for (let index = 0; index < userCount; index += 1) {
    const uid = `loadtest-${runId}-${String(index + 1).padStart(3, '0')}`.slice(0, 128);
    const email = `${uid}@loadtest.money-rank.invalid`;
    try {
      await auth.createUser({ uid, email, emailVerified: true, displayName: `Load Test ${index + 1}` });
    } catch (error) {
      if (error.code !== 'auth/uid-already-exists') throw error;
    }
    await auth.setCustomUserClaims(uid, { is_test: true, test_run_id: runId, origin: 'LOAD_TEST' });
    users.push({ uid, email, preferredName: `Load Test ${index + 1}` });
  }
  await executeOperation('dataconnect/connector/mutations.gql', 'SeedLoadTestStudents', {
    runId,
    requestedUsers: userCount,
    users: users.map((user) => ({ firebase_uid: user.uid, email: user.email, preferred_name: user.preferredName })),
  });
  return users;
}

async function runUserFlow(auth, user, appCheckToken, metrics, durationMs, rampDelayMs) {
  await new Promise((resolve) => setTimeout(resolve, rampDelayMs));
  const customToken = await auth.createCustomToken(user.uid, { is_test: true, test_run_id: runId, origin: 'LOAD_TEST', email_verified: true });
  const idToken = await exchangeCustomToken(customToken);
  const endAt = Date.now() + durationMs;
  do {
    const cycleStartedAt = Date.now();
    try {
      const measuredRequest = async (...args) => {
        metrics.requests += 1;
        try {
          const response = await apiRequest(...args);
          metrics.durations.push(response.durationMs);
          return response;
        } catch (error) {
          metrics.errors += 1;
          throw error;
        }
      };
      const period = await measuredRequest('/api/period', idToken, appCheckToken);
      if (period.payload?.current?.state !== 'ACTIVE') {
        if (mode === 'full') {
          metrics.errors += 1;
          throw Object.assign(new Error('full_load_requires_active_period'), { status: 409 });
        }
        return;
      }
      const started = await measuredRequest('/api/activity/sessions/start', idToken, appCheckToken, {
        method: 'POST',
        body: JSON.stringify({ phaseNumber: 1 }),
      });
      const answers = (started.payload.questions || []).map((question) => ({ questionId: question.id, optionId: question.options[0].id }));
      await measuredRequest(`/api/activity/sessions/${started.payload.sessionId}/submit`, idToken, appCheckToken, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
    } catch (error) {
      metrics.errorSamples.push({ uid: user.uid, status: error.status ?? null, message: error.message });
    }
    const remainingCycleMs = fullFlowIntervalMs - (Date.now() - cycleStartedAt);
    if (mode === 'full' && Date.now() < endAt && remainingCycleMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingCycleMs));
    }
  } while (mode === 'full' && Date.now() < endAt);
}

async function cleanup(auth) {
  await executeOperation('dataconnect/connector/mutations.gql', 'CleanupMarkedLoadTestStudents', { runId });
  let nextPageToken;
  let deletedAuthUsers = 0;
  do {
    const page = await auth.listUsers(1000, nextPageToken);
    const marked = page.users.filter((user) =>
      user.uid.startsWith('loadtest-')
      && user.customClaims?.is_test === true
      && user.customClaims?.origin === 'LOAD_TEST');
    for (let index = 0; index < marked.length; index += 1000) {
      const result = await auth.deleteUsers(marked.slice(index, index + 1000).map((user) => user.uid));
      deletedAuthUsers += result.successCount;
      if (result.failureCount) throw new Error(`Falha ao excluir ${result.failureCount} usuários marcados do Auth.`);
    }
    nextPageToken = page.pageToken;
  } while (nextPageToken);
  await executeOperation('dataconnect/connector/mutations.gql', 'FinalizeLoadTestCleanup', { runId, deletedAuthUsers });
  await executeOperation('dataconnect/connector/queries.gql', 'GetLoadTestCleanupStatus', { runId });
  console.log(JSON.stringify({ runId, deletedAuthUsers, debugTokenRevocationRequired: true }, null, 2));
}

requireEnvironment(['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']);
const auth = initializeAdmin();

if (mode === 'cleanup') {
  await cleanup(auth);
} else {
  requireEnvironment(['API_URL', 'FIREBASE_WEB_API_KEY', 'FIREBASE_WEB_APP_ID', 'APPCHECK_DEBUG_TOKEN']);
  if (mode === 'full' && process.env.ALLOW_FULL_LOAD_TEST !== 'YES') {
    throw new Error('Defina ALLOW_FULL_LOAD_TEST=YES para confirmar o único teste completo de 100 usuários.');
  }
  const users = await createSyntheticUsers(auth);
  const appCheckToken = await exchangeDebugToken();
  const metrics = { runId, mode, users: userCount, requests: 0, errors: 0, durations: [], errorSamples: [] };
  const durationMs = mode === 'full' ? 15 * 60_000 : 0;
  await Promise.all(users.map((user, index) => runUserFlow(
    auth,
    user,
    appCheckToken,
    metrics,
    durationMs,
    mode === 'full' ? Math.round((index / Math.max(userCount - 1, 1)) * 30_000) : 0,
  )));
  const result = {
    runId,
    mode,
    users: userCount,
    requests: metrics.requests,
    errors: metrics.errors,
    errorRate: metrics.requests ? metrics.errors / metrics.requests : 1,
    p95Ms: Math.round(percentile(metrics.durations, 0.95)),
    passed: metrics.requests > 0 && metrics.errors / metrics.requests < 0.01 && percentile(metrics.durations, 0.95) < 2000,
    errorSamples: metrics.errorSamples.slice(0, 20),
  };
  await executeOperation('dataconnect/connector/mutations.gql', 'RecordLoadTestMetrics', {
    runId,
    status: result.passed ? 'PASSED' : 'FAILED',
    metrics: result,
  });
  await fs.writeFile(path.join(outputDirectory, `load-test-${runId}.json`), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
