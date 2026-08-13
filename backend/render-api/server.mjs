import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getAppCheck } from 'firebase-admin/app-check';
import { getDataConnect } from 'firebase-admin/data-connect';
import ExcelJS from 'exceljs';
import { canAccessActivity } from '../../functions/src/activityAccess.js';

const config = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  dataConnect: {
    location: process.env.SQL_CONNECT_LOCATION || 'southamerica-east1',
    serviceId: process.env.SQL_CONNECT_SERVICE || 'money-rank-service',
    connector: process.env.SQL_CONNECT_CONNECTOR || 'money-rank-connector',
  },
};

if (!getApps().length) {
  const credential = config.projectId && config.clientEmail && config.privateKey
    ? cert({ projectId: config.projectId, clientEmail: config.clientEmail, privateKey: config.privateKey })
    : undefined;
  initializeApp({
    ...(credential ? { credential } : {}),
    ...(config.storageBucket ? { storageBucket: config.storageBucket } : {}),
  });
}

const dataConnect = getDataConnect(config.dataConnect);
const app = express();
const frontendOrigin = String(process.env.FRONTEND_ORIGIN || '').trim();
const teacherEmails = new Set(String(process.env.TEACHER_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean));
const isTest = process.env.NODE_ENV === 'test';
const TIME_ZONE = 'America/Fortaleza';
const UNLIMITED_ACTIVITY_SESSION_END = '9999-12-31T23:59:59.999Z';
const runtimeDiagnostics = {
  sql: { lastSuccessAt: null, lastFailure: null },
  activityGenerator: null,
  mentor: null,
  analyst: null,
};

function geminiApiKey() {
  return String(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
}

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '9mb' }));
app.use(cors({ origin: (origin, callback) => {
  if (!origin || origin === frontendOrigin || (isTest && origin === 'http://localhost:5173')) return callback(null, true);
  return callback(new Error('cors_origin_denied'));
} }));
app.use((req, res, next) => { req.requestId = crypto.randomUUID(); res.setHeader('X-Request-Id', req.requestId); next(); });
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => console.log(JSON.stringify({
    event: 'request',
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    status: res.statusCode,
    durationMs: Date.now() - startedAt,
    uid: req.auth?.uid ?? null,
  })));
  next();
});

async function authenticate(req, res, next) {
  if (isTest && req.headers['x-test-uid']) { req.auth = { uid: String(req.headers['x-test-uid']), email: String(req.headers['x-test-email'] || 'test@example.com'), email_verified: true }; return next(); }
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'missing_id_token', requestId: req.requestId });
  try { req.auth = await getAuth().verifyIdToken(token); if (!req.auth.email_verified) return res.status(403).json({ error: 'email_not_verified', requestId: req.requestId }); return next(); } catch { return res.status(401).json({ error: 'invalid_id_token', requestId: req.requestId }); }
}

async function verifyAppCheck(req, res, next) {
  if (isTest && req.headers['x-test-app-check'] === 'valid') return next();
  const token = String(req.headers['x-firebase-appcheck'] || '');
  if (!token) return res.status(401).json({ error: 'missing_app_check', requestId: req.requestId });
  try { await getAppCheck().verifyToken(token); return next(); } catch { return res.status(401).json({ error: 'invalid_app_check', requestId: req.requestId }); }
}

function requireTeacher(req, res, next) {
  if (!teacherEmails.has(String(req.auth?.email || '').trim().toLowerCase())) return res.status(403).json({ error: 'teacher_required', requestId: req.requestId });
  return next();
}

const uidRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  keyGenerator: (req) => req.auth?.uid || ipKeyGenerator(req.ip),
});

function protectedRoute(...handlers) { return [authenticate, verifyAppCheck, uidRateLimiter, ...handlers]; }
function sanitizedError(error) {
  return {
    name: String(error?.name || 'Error').slice(0, 80),
    message: String(error?.message || 'unknown_error').replace(/[\r\n]+/g, ' ').slice(0, 320),
    at: new Date().toISOString(),
  };
}
async function sqlOperation(name, variables, options) {
  try {
    const response = await dataConnect.executeQuery(name, variables, options);
    if (response?.errors?.length) throw new Error(response.errors[0]?.message || 'sql_connect_error');
    runtimeDiagnostics.sql.lastSuccessAt = new Date().toISOString();
    return response;
  } catch (error) {
    runtimeDiagnostics.sql.lastFailure = { operation: name, ...sanitizedError(error) };
    throw error;
  }
}
async function sqlMutation(name, variables, options) {
  try {
    const response = await dataConnect.executeMutation(name, variables, options);
    if (response?.errors?.length) throw new Error(response.errors[0]?.message || 'sql_connect_error');
    runtimeDiagnostics.sql.lastSuccessAt = new Date().toISOString();
    return response;
  } catch (error) {
    runtimeDiagnostics.sql.lastFailure = { operation: name, ...sanitizedError(error) };
    throw error;
  }
}
function unwrap(response) { if (response?.errors?.length) throw new Error(response.errors[0]?.message || 'sql_connect_error'); return response?.data || {}; }

function localClock(now, timeZone = TIME_ZONE) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

function validPeriodWindow(period) {
  const startsAt = Date.parse(period?.startsAt);
  const endsAt = Date.parse(period?.endsAt);
  return Number.isFinite(startsAt) && Number.isFinite(endsAt) && startsAt < endsAt
    ? { startsAt, endsAt }
    : null;
}

export function periodStateFromPeriods(periods, now = new Date()) {
  const nowMs = now.getTime();
  const candidates = (Array.isArray(periods) ? periods : []).flatMap((period) => {
    const range = validPeriodWindow(period);
    const status = String(period?.status || '').toUpperCase();
    return range && ['SCHEDULED', 'ACTIVE', 'PAUSED'].includes(status)
      ? [{ ...period, ...range, status }]
      : [];
  }).sort((left, right) => left.startsAt - right.startsAt);
  const period = candidates.find((candidate) =>
    candidate.startsAt <= nowMs && nowMs < candidate.endsAt);
  const nextPeriod = candidates.find((candidate) => candidate.startsAt > nowMs);
  if (!period) {
    return {
      state: nextPeriod ? 'BEFORE' : 'CLOSED',
      reason: nextPeriod ? 'next_period_not_started' : 'no_open_period',
      serverTime: now.toISOString(),
      timezone: TIME_ZONE,
      classId: null,
      hm: localClock(now),
      selectedPeriodId: nextPeriod?.id || null,
      selectedPeriodName: nextPeriod?.name || null,
      periodId: nextPeriod?.id || null,
      periodKey: nextPeriod?.periodKey || null,
      startsAt: nextPeriod?.startsAt ? new Date(nextPeriod.startsAt).toISOString() : null,
      endsAt: nextPeriod?.endsAt ? new Date(nextPeriod.endsAt).toISOString() : null,
      nextPeriod: nextPeriod ? {
        id: nextPeriod.id,
        name: nextPeriod.name,
        startsAt: new Date(nextPeriod.startsAt).toISOString(),
        endsAt: new Date(nextPeriod.endsAt).toISOString(),
        status: nextPeriod.status,
      } : null,
    };
  }
  const base = {
    serverTime: now.toISOString(),
    timezone: TIME_ZONE,
    selectedPeriodId: period.id,
    selectedPeriodName: period.name,
    periodId: period.id,
    periodKey: period.periodKey || null,
    name: period.name,
    timeZone: period.timeZone || TIME_ZONE,
    startsAt: new Date(period.startsAt).toISOString(),
    endsAt: new Date(period.endsAt).toISOString(),
    hm: localClock(now, period.timeZone || 'America/Fortaleza'),
  };
  if (period.status === 'PAUSED') {
    return { ...base, state: 'PAUSED', reason: 'period_paused_by_teacher', classId: null, nextPeriod: null };
  }
  return {
    ...base,
    state: 'ACTIVE',
    reason: period.status === 'SCHEDULED'
      ? 'scheduled_window_open'
      : 'manually_active_window_open',
    classId: null,
    nextPeriod: null,
  };
}

async function resolveRuntimePeriod(uid, now = new Date()) {
  const data = unwrap(await sqlOperation(
    'ListVisibleCompetitionPeriods',
    {},
    dataConnectAuth(uid),
  ));
  const periods = data.competitionPeriods || [];
  return { periods, current: periodStateFromPeriods(periods, now) };
}

async function resolveActiveTestRun(uid) {
  await sqlMutation('ExpireTestRuns', {});
  return unwrap(await sqlOperation('GetActiveTestRunForUser', { userUid: uid })).testRun || null;
}

async function getTeacherTestRun(uid) {
  await sqlMutation('ExpireTestRuns', {});
  return unwrap(await sqlOperation('GetTeacherTestRun', { actorUid: uid })).testRun || null;
}

function allowedPeriodActions(period, periods, now = new Date()) {
  const status = String(period?.status || '');
  if (status === 'CLOSED') return [];
  const nowMs = now.getTime();
  const startsAt = Date.parse(period?.startsAt);
  const endsAt = Date.parse(period?.endsAt);
  const insideWindow = Number.isFinite(startsAt) && Number.isFinite(endsAt)
    && startsAt <= nowMs && nowMs < endsAt;
  const anotherActive = periods.some((item) => item.id !== period.id && item.status === 'ACTIVE');
  const actions = [];
  if (status === 'DRAFT' || status === 'SCHEDULED') {
    if (nowMs < endsAt) actions.push(status === 'DRAFT' ? 'SCHEDULED' : 'DRAFT');
  }
  if (['DRAFT', 'SCHEDULED', 'PAUSED'].includes(status) && insideWindow && !anotherActive) actions.push('ACTIVE');
  if (status === 'ACTIVE' || (status === 'SCHEDULED' && insideWindow)) actions.push('PAUSED');
  actions.push('CLOSED');
  return [...new Set(actions)];
}

function secureRandom() {
  return crypto.randomInt(0, 2 ** 32) / (2 ** 32);
}

function dataConnectAuth(identity) {
  const claims = typeof identity === 'string'
    ? { sub: identity, email_verified: true }
    : {
      sub: identity.uid,
      email: identity.email,
      email_verified: identity.email_verified === true,
    };
  return { impersonate: { authClaims: claims } };
}

function databaseClass(classId) {
  return classId === '3DSA' ? 'THIRD_DSA' : classId === '3DSB' ? 'THIRD_DSB' : null;
}

function publicClass(classGroup) {
  return classGroup === 'THIRD_DSA' ? '3DSA' : classGroup === 'THIRD_DSB' ? '3DSB' : null;
}

const DATABASE_AVATARS = new Set([
  'CAPI_CIENTISTA',
  'CAPI_PROFESSORA',
  'CAPI_PROGRAMADORA',
  'CAPI_ECONOMISTA',
  'CAPI_MEDICA',
  'CAPI_ENGENHEIRA',
]);

function isTeacherEmail(email) {
  return teacherEmails.has(String(email || '').trim().toLowerCase());
}

async function ensureTeacherRole(authClaims) {
  if (!isTeacherEmail(authClaims?.email)) return null;
  const data = unwrap(await sqlMutation('SetUserRoleByEmail', {
    email: String(authClaims.email).trim().toLowerCase(),
    role: 'TEACHER',
  }));
  return data.updatedUser || null;
}

async function getMyProfile(authClaims) {
  let profile = unwrap(await sqlOperation(
    'GetMyProfile',
    {},
    dataConnectAuth(authClaims.uid),
  )).user || null;
  if (profile && isTeacherEmail(authClaims.email) && profile.role !== 'TEACHER') {
    await ensureTeacherRole(authClaims);
    profile = unwrap(await sqlOperation(
      'GetMyProfile',
      {},
      dataConnectAuth(authClaims.uid),
    )).user || null;
  }
  return profile;
}

async function ensurePilotClass(uid, current) {
  const targetClass = databaseClass(current.classId);
  if (targetClass) {
    await sqlMutation('BindPilotClass', { studentUid: uid, classGroup: targetClass });
  }
  const binding = unwrap(await sqlOperation('GetPilotClassBinding', { studentUid: uid })).user;
  if (!binding) throw new Error('student_profile_required');
  return { ...binding, classId: publicClass(binding.classGroup) };
}

function validUuid(value) {
  return /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

async function resolveOfficialPeriodId(uid, requestedPeriodId = '') {
  if (requestedPeriodId) {
    if (!validUuid(requestedPeriodId)) throw new Error('invalid_period_id');
    return requestedPeriodId;
  }
  const { current } = await resolveRuntimePeriod(uid);
  if (current.state !== 'ACTIVE' || !current.selectedPeriodId) {
    throw new Error('no_official_period_for_ranking');
  }
  return current.selectedPeriodId;
}

app.get('/healthz', (req, res) => res.json({ ok: true, service: 'money-rank-api', requestId: req.requestId }));
app.get('/readyz', async (req, res, next) => {
  try {
    const data = unwrap(await sqlOperation('GetPedagogicalBankStatus', {}));
    const counts = Object.fromEntries((data.counts || []).map((row) => [
      row.activityId,
      Number(row.activeItems || 0),
    ]));
    const activeItems = Object.values(counts).reduce((total, count) => total + count, 0);
    return res.status(activeItems === 140 ? 200 : 503).json({
      ok: activeItems === 140,
      service: 'money-rank-api',
      database: 'sql-connect',
      geminiConfigured: Boolean(geminiApiKey()),
      activeItems,
      counts,
      build: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || 'unknown',
      requestId: req.requestId,
    });
  } catch (error) { return next(error); }
});

app.get('/api/me/profile', ...protectedRoute(), async (req, res, next) => {
  try {
    return res.json({ profile: await getMyProfile(req.auth) });
  } catch (error) { return next(error); }
});

app.put('/api/me/profile', ...protectedRoute(), async (req, res, next) => {
  try {
    const preferredName = String(req.body?.preferredName || '').trim().replace(/\s+/g, ' ');
    const classGroup = String(req.body?.classGroup || '');
    const avatarId = req.body?.avatarId ? String(req.body.avatarId) : null;
    const avatarUrl = req.body?.avatarUrl ? String(req.body.avatarUrl).trim() : null;
    if (preferredName.length < 2 || preferredName.length > 40) {
      return res.status(400).json({ error: 'invalid_preferred_name', requestId: req.requestId });
    }
    if (!['THIRD_DSA', 'THIRD_DSB'].includes(classGroup)) {
      return res.status(400).json({ error: 'invalid_class_group', requestId: req.requestId });
    }
    let operation = 'UpsertMyProfileWithoutSyncedPhoto';
    const variables = { preferredName, classGroup };
    if (avatarId) {
      if (!DATABASE_AVATARS.has(avatarId)) {
        return res.status(400).json({ error: 'invalid_avatar', requestId: req.requestId });
      }
      operation = 'UpsertMyProfileWithAvatar';
      variables.avatarId = avatarId;
    } else if (avatarUrl) {
      let parsedUrl;
      try { parsedUrl = new URL(avatarUrl); } catch { parsedUrl = null; }
      if (parsedUrl?.protocol !== 'https:') {
        return res.status(400).json({ error: 'invalid_avatar_url', requestId: req.requestId });
      }
      operation = 'UpsertMyProfileWithPhoto';
      variables.avatarUrl = avatarUrl;
    }
    await sqlMutation(operation, variables, dataConnectAuth(req.auth));
    await ensureTeacherRole(req.auth);
    return res.json({ profile: await getMyProfile(req.auth) });
  } catch (error) { return next(error); }
});

app.get('/api/me/progress', ...protectedRoute(), async (req, res, next) => {
  try {
    const data = unwrap(await sqlOperation('ListMyProgress', {}, dataConnectAuth(req.auth.uid)));
    return res.json({ progress: data.studentProgressEntries || [] });
  } catch (error) { return next(error); }
});

app.get('/api/me/transactions', ...protectedRoute(), async (req, res, next) => {
  try {
    const offset = Math.max(0, Number.parseInt(req.query.offset, 10) || 0);
    const data = unwrap(await sqlOperation(
      'ListMyCapiCoinTransactions',
      { offset },
      dataConnectAuth(req.auth.uid),
    ));
    return res.json({ transactions: data.capiCoinTransactions || [] });
  } catch (error) { return next(error); }
});

app.post('/api/me/trail/initialize', ...protectedRoute(), async (req, res, next) => {
  try {
    const data = unwrap(await sqlMutation('InitializeMyTrail', {}, dataConnectAuth(req.auth.uid)));
    return res.json({ saved: Number(data.affectedRows || 0) > 0 });
  } catch (error) { return next(error); }
});

app.post('/api/me/trail/introduction/complete', ...protectedRoute(), async (req, res, next) => {
  try {
    const completion = unwrap(await sqlMutation('CompleteMyIntroduction', {}, dataConnectAuth(req.auth.uid)));
    const transaction = unwrap(await sqlOperation(
      'GetMyCapiCoinTransactionBySource',
      { sourceId: 'introduction-0' },
      dataConnectAuth(req.auth.uid),
    )).capiCoinTransactions?.[0] || null;
    return res.json({ saved: Number(completion.affectedRows || 0) === 1, transaction });
  } catch (error) { return next(error); }
});

app.post('/api/me/trail/content/complete', ...protectedRoute(), async (req, res, next) => {
  try {
    const phaseNumber = Number(req.body?.phaseNumber);
    if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) {
      return res.status(400).json({ error: 'invalid_phase', requestId: req.requestId });
    }
    const completion = unwrap(await sqlMutation(
      'CompleteMyCurrentPhaseContent',
      { phaseNumber },
      dataConnectAuth(req.auth.uid),
    ));
    const saved = Number(completion.affectedRows || 0) === 1;
    const transaction = saved
      ? unwrap(await sqlOperation(
        'GetMyCapiCoinTransactionBySource',
        { sourceId: `phase-${phaseNumber}-content` },
        dataConnectAuth(req.auth.uid),
      )).capiCoinTransactions?.[0] || null
      : null;
    return res.json({ saved, transaction });
  } catch (error) { return next(error); }
});
app.get('/api/period', ...protectedRoute(), async (req, res, next) => {
  try {
    const [{ current, periods }, testGrant] = await Promise.all([
      resolveRuntimePeriod(req.auth.uid),
      resolveActiveTestRun(req.auth.uid),
    ]);
    const binding = await ensurePilotClass(req.auth.uid, current);
    const access = canAccessActivity({
      user: { uid: req.auth.uid, classId: binding.classId },
      currentPeriod: current,
      testGrant,
      operation: 'START',
    });
    return res.json({
      serverTime: current.serverTime,
      timezone: TIME_ZONE,
      state: current.state,
      reason: access.reason,
      selectedPeriodId: current.selectedPeriodId,
      selectedPeriodName: current.selectedPeriodName,
      startsAt: current.startsAt,
      endsAt: current.endsAt,
      canStartActivity: access.allowed,
      canSubmitActivity: access.allowed,
      nextPeriod: current.nextPeriod,
      testMode: testGrant ? {
        active: true,
        testRunId: testGrant.id,
        endsAt: testGrant.endsAt,
        accessPolicy: 'TEACHER_OWNER_ONLY',
      } : { active: false },
      periodId: current.periodId,
      periodKey: current.periodKey,
      current,
      classId: binding.classId,
      periods,
    });
  } catch (error) { return next(error); }
});

app.post('/api/activity/sessions/start', ...protectedRoute(), async (req, res, next) => {
  try {
    const [{ current }, testGrant] = await Promise.all([
      resolveRuntimePeriod(req.auth.uid),
      resolveActiveTestRun(req.auth.uid),
    ]);
    const binding = await ensurePilotClass(req.auth.uid, current);
    const access = canAccessActivity({ user: { uid: req.auth.uid, classId: binding.classId }, currentPeriod: current, testGrant, operation: 'START' });
    if (!access.allowed) return res.status(409).json({ error: 'activity_access_blocked', reason: access.reason, current, testMode: Boolean(testGrant), requestId: req.requestId });
    const phaseNumber = Number(req.body?.phaseNumber); if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) return res.status(400).json({ error: 'invalid_phase' });
    const module = await import('../../functions/src/activityEngine.js');
    const activityId = module.ACTIVITY_IDS_BY_PHASE[phaseNumber];
    let prepared;
    if (phaseNumber === 1) {
      const perigoDoce = await import('../../functions/src/perigoDoceSession.js');
      prepared = await perigoDoce.buildAiPerigoDoceSession({
        apiKey: geminiApiKey(),
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        onDiagnostic: (diagnostic) => {
          runtimeDiagnostics.activityGenerator = {
            ...diagnostic,
            requestId: req.requestId,
            at: new Date().toISOString(),
          };
        },
      });
    } else {
      const [bankData, seenData] = await Promise.all([
        sqlOperation('ListActivePedagogicalItemsForActivity', { activityId }).then(unwrap),
        sqlOperation('ListStudentSeenPedagogicalItemIds', { studentUid: req.auth.uid, activityId }).then(unwrap),
      ]);
      prepared = module.buildStaticSession(phaseNumber, {
        variantId: req.body?.variantId || null,
        random: secureRandom,
        seenItemIds: (seenData.seenItems || []).map((item) => item.itemId),
        definition: { items: bankData.pedagogicalItems || [] },
      });
    }
    const sessionId = crypto.randomUUID();
    const expiresAt = access.source === 'TEST_RUN'
      ? testGrant.endsAt
      : UNLIMITED_ACTIVITY_SESSION_END;
    const answerKey = { ...prepared.answerKey, runtime: { competitionPeriodId: access.periodId, testRunId: access.testRunId, accessSource: access.source } };
    if (access.source === 'TEST_RUN') {
      await sqlMutation('CreateTestActivitySession', { sessionId, testRunId: access.testRunId, actorUid: req.auth.uid, activityId: prepared.activityId, phaseNumber, variantId: prepared.variantId, contentVersion: prepared.contentVersion, publicPayload: prepared.publicPayload, answerKey, expiresAt });
    } else {
      await sqlMutation('CreateAuthoritativeActivitySession', { sessionId, studentUid: req.auth.uid, activityId: prepared.activityId, phaseNumber, variantId: prepared.variantId, contentVersion: prepared.contentVersion, publicPayload: prepared.publicPayload, answerKey, expiresAt });
    }
    res.status(201).json({ sessionId, phaseNumber, activityId: prepared.activityId, contentVersion: prepared.contentVersion, expiresAt: access.source === 'TEST_RUN' ? expiresAt : null, testMode: access.source === 'TEST_RUN', testRunId: access.testRunId, ...prepared.publicPayload });
  } catch (error) { next(error); }
});

app.post('/api/activity/sessions/:sessionId/step', ...protectedRoute(), async (req, res, next) => {
  try {
    // Esta consulta contem o gabarito e e declarada como NO_ACCESS no
    // Data Connect. Ela precisa usar a credencial administrativa da API;
    // impersonar o aluno aqui faz o conector recusar a operacao.
    const data = unwrap(await sqlOperation(
      'GetAuthoritativeActivitySession',
      { sessionId: req.params.sessionId },
    ));
    const session = data.activitySession;
    if (!session || session.userUid !== req.auth.uid || Number(session.phaseNumber) !== 3) return res.status(404).json({ error: 'session_not_found' });
    const [{ current }, testGrant] = await Promise.all([resolveRuntimePeriod(req.auth.uid), resolveActiveTestRun(req.auth.uid)]);
    const binding = await ensurePilotClass(req.auth.uid, current);
    const access = canAccessActivity({ user: { uid: req.auth.uid, classId: binding.classId }, currentPeriod: current, testGrant, session: { classId: binding.classId, isTest: session.isTest, testRunId: session.testRunId, competitionPeriodId: session.answerKey?.runtime?.competitionPeriodId }, operation: 'SUBMIT' });
    if (!access.allowed) return res.status(409).json({ error: 'activity_access_blocked', reason: access.reason, current, requestId: req.requestId });
    const engine = await import('../../functions/src/activityEngine.js');
    const advanced = engine.advanceIlusaoDinheiroSession(session.answerKey, req.body, secureRandom);
    const publicPayload = {
      mission: {
        ...(session.publicPayload?.mission || {}),
        currentStage: advanced.completed ? 7 : advanced.answerKey.progress.stage,
        currentCredit: advanced.currentCredit,
        currentItem: advanced.nextItem,
      },
    };
    await sqlMutation('UpdateAuthoritativeActivitySessionState', {
      sessionId: session.id,
      studentUid: req.auth.uid,
      answerKey: advanced.answerKey,
      publicPayload,
    });
    return res.json({
      completed: advanced.completed,
      currentCredit: advanced.currentCredit,
      nextItem: advanced.nextItem,
      answers: advanced.answerKey.progress.answers,
      idempotentReplay: advanced.idempotentReplay,
    });
  } catch (error) { return next(error); }
});

app.post('/api/activity/sessions/:sessionId/submit', ...protectedRoute(), async (req, res, next) => {
  try {
    const [sessionData, priorResultData] = await Promise.all([
      sqlOperation('GetAuthoritativeActivitySession', { sessionId: req.params.sessionId }).then(unwrap),
      sqlOperation('GetAuthoritativeActivityResult', { sessionId: req.params.sessionId }).then(unwrap),
    ]);
    const session = sessionData.activitySession; if (!session || session.userUid !== req.auth.uid) return res.status(404).json({ error: 'session_not_found' });
    const priorResult = priorResultData.activityAttempts?.[0];
    if (priorResult) return res.json({ ...priorResult, idempotentReplay: true });
    const [{ current }, testGrant] = await Promise.all([
      resolveRuntimePeriod(req.auth.uid),
      resolveActiveTestRun(req.auth.uid),
    ]);
    const binding = await ensurePilotClass(req.auth.uid, current);
    const access = canAccessActivity({
      user: { uid: req.auth.uid, classId: binding.classId },
      currentPeriod: current,
      testGrant,
      session: {
        classId: binding.classId,
        isTest: session.isTest,
        testRunId: session.testRunId,
        competitionPeriodId: session.answerKey?.runtime?.competitionPeriodId,
      },
      operation: 'SUBMIT',
    });
    if (!access.allowed) return res.status(409).json({ error: 'activity_access_blocked', reason: access.reason, current, classId: binding.classId, requestId: req.requestId });
    const engine = await import('../../functions/src/activityEngine.js');
    const submittedAnswers = Number(session.phaseNumber) === 3 && !Array.isArray(req.body?.answers)
      ? session.answerKey?.progress?.answers
      : req.body?.answers;
    const result = engine.scoreActivitySession({ phaseNumber: session.phaseNumber, answerKey: session.answerKey }, submittedAnswers);
    if (access.source === 'TEST_RUN') {
      await sqlMutation('RecordTestActivityAttempt', { attemptId: session.id, sessionId: session.id, testRunId: access.testRunId, actorUid: req.auth.uid, activityId: session.activityId, phaseNumber: session.phaseNumber, score: result.score, correctAnswers: result.correctAnswers, wrongAnswers: result.wrongAnswers, passed: result.passed });
    } else {
      await sqlMutation(result.passed ? 'CompleteMyCurrentPhase' : 'RegisterMyCurrentPhaseAttempt', { attemptId: session.id, sessionId: session.id, studentUid: req.auth.uid, activityId: session.activityId, phaseNumber: session.phaseNumber, score: result.score, correctAnswers: result.correctAnswers, wrongAnswers: result.wrongAnswers });
      await sqlMutation('MarkAuthoritativeActivitySessionSubmitted', { sessionId: session.id, studentUid: req.auth.uid });
    }
    const savedData = unwrap(await sqlOperation(
      'GetAuthoritativeActivityResult',
      { sessionId: session.id },
    ));
    return res.json({ ...savedData.activityAttempts?.[0], ...result, testMode: access.source === 'TEST_RUN', testRunId: access.testRunId, officialRewardGranted: access.source !== 'TEST_RUN' && Number(savedData.activityAttempts?.[0]?.rewardAmount || 0) > 0, idempotentReplay: false });
  } catch (error) { next(error); }
});

const teacherActions = new Set([
  'teacher-studio-load',
  'teacher-studio-create-draft',
  'teacher-studio-save-draft',
  'teacher-studio-submit-review',
  'teacher-studio-publish',
  'teacher-studio-create-research',
  'teacher-studio-review-research',
  'teacher-studio-upload-asset',
  'teacher-period-create',
  'teacher-period-update',
  'teacher-period-status',
  'teacher-data-chat',
]);

app.post('/api/actions/:action', ...protectedRoute(), async (req, res, next) => {
  try {
    const action = String(req.params.action || '');
    if (teacherActions.has(action) && !teacherEmails.has(String(req.auth.email || '').trim().toLowerCase())) {
      return res.status(403).json({ error: 'teacher_required', requestId: req.requestId });
    }
    const payload = req.body || {};
    const uid = req.auth.uid;

    if (teacherActions.has(action)) {
      await ensureTeacherRole(req.auth);
    }

    if (action === 'published-learning-content' || action === 'published-activity-catalog') {
      const studio = await import('../../functions/src/teacherStudio.js');
      const repository = await import('../../functions/src/editorialRepository.js');
      if (action === 'published-learning-content') {
        const moduleKey = studio.normalizeEditorialKey(payload.moduleKey);
        const version = await repository.getPublishedLearningModule(moduleKey);
        if (!version) return res.status(404).json({ error: 'published_content_not_found' });
        return res.json({ moduleKey: version.moduleKey, phaseNumber: Number(version.phaseNumber), version: Number(version.version), title: version.title, payload: version.payload, publishedAt: version.publishedAt });
      }
      const activityKey = studio.normalizeEditorialKey(payload.activityKey);
      const version = await repository.getPublishedActivityDefinition(activityKey);
      if (!version) return res.status(404).json({ error: 'published_activity_not_found' });
      return res.json({ activityKey: version.activityKey, phaseNumber: Number(version.phaseNumber), version: Number(version.version), payload: Number(version.phaseNumber) === 1 ? null : version.payload, publishedAt: version.publishedAt });
    }

    if (action === 'student-mentor') {
      const [{ getStudentMentorContext }, mentor] = await Promise.all([
        import('../../functions/src/activityRepository.js'),
        import('../../functions/src/studentMentor.js'),
      ]);
      const question = mentor.normalizeMentorQuestion(payload.question);
      if (question.length < 4) return res.status(400).json({ error: 'mentor_question_too_short' });
      const context = await getStudentMentorContext(uid);
      const answer = await mentor.answerStudentMentor({
        question,
        rawContext: context,
        apiKey: geminiApiKey(),
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        requestId: req.requestId,
        onDiagnostic: (diagnostic) => { runtimeDiagnostics.mentor = { ...diagnostic, at: new Date().toISOString() }; },
      });
      if (!answer) return res.status(403).json({ error: 'student_profile_required' });
      return res.json({ ...answer, limitations: 'O tutor pode errar e não substitui o professor nem fontes oficiais.' });
    }

    if (action === 'teacher-data-chat') {
      const [{ getTeacherDashboardForChat }, chat] = await Promise.all([
        import('../../functions/src/activityRepository.js'),
        import('../../functions/src/teacherDataChat.js'),
      ]);
      const periodId = String(payload.periodId || '');
      const question = chat.normalizeTeacherQuestion(payload.question);
      if (question.length < 5) return res.status(400).json({ error: 'teacher_question_too_short' });
      const context = await getTeacherDashboardForChat(uid, periodId);
      const answer = await chat.buildTeacherChatResponse({
        question,
        rawContext: context,
        apiKey: geminiApiKey(),
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        requestId: req.requestId,
        onDiagnostic: (diagnostic) => { runtimeDiagnostics.analyst = { ...diagnostic, at: new Date().toISOString() }; },
      });
      return res.json({ ...answer, periodId, scope: 'Dados agregados do período selecionado', limitations: 'A análise não consulta e-mail, UID, respostas individuais ou dados fora do período.' });
    }

    if (action.startsWith('teacher-studio-')) {
      const [studio, repository, storage] = await Promise.all([
        import('../../functions/src/teacherStudio.js'),
        import('../../functions/src/editorialRepository.js'),
        import('../../functions/src/teacherStudioStorage.js'),
      ]);
      if (action === 'teacher-studio-load') {
        const data = await repository.listEditorialStudioData();
        return res.json({ ...studio.buildTeacherStudioPayload(data), teacher: { authorized: true } });
      }
      if (action === 'teacher-studio-create-draft') {
        const version = await repository.createEditorialDraft({ type: studio.normalizeEditorialType(payload.type), key: studio.normalizeEditorialKey(payload.key), actorUid: uid });
        return res.json({ versionId: version.id, version: Number(version.version) });
      }
      if (action === 'teacher-studio-save-draft') {
        const version = await repository.updateEditorialDraft({ ...studio.normalizeDraftInput(payload), actorUid: uid });
        return res.json({ versionId: version.id, status: version.status, updatedAt: version.updatedAt });
      }
      if (action === 'teacher-studio-submit-review') {
        const version = await repository.submitEditorialForReview({ type: studio.normalizeEditorialType(payload.type), versionId: studio.normalizeVersionId(payload.versionId), actorUid: uid });
        return res.json({ versionId: version.id, status: version.status });
      }
      if (action === 'teacher-studio-publish') {
        const version = await repository.publishEditorialVersion({ type: studio.normalizeEditorialType(payload.type), versionId: studio.normalizeVersionId(payload.versionId), actorUid: uid });
        return res.json({ versionId: version.id, status: version.status, publishedAt: version.publishedAt });
      }
      if (action === 'teacher-studio-create-research') {
        const reviewId = await repository.createResearchReview({ ...studio.normalizeResearchInput(payload), actorUid: uid });
        return res.json({ reviewId, status: 'PENDING_TEACHER_REVIEW' });
      }
      if (action === 'teacher-studio-review-research') {
        return res.json(await repository.reviewResearch({ ...studio.normalizeResearchReviewInput(payload), actorUid: uid }));
      }
      if (action === 'teacher-studio-upload-asset') {
        let uploaded;
        try {
          const entityType = studio.normalizeEditorialType(payload.type);
          const entityId = studio.normalizeVersionId(payload.versionId);
          uploaded = await storage.uploadTeacherStudioFile({ actorUid: uid, entityType, entityId, fileName: payload.fileName, mimeType: payload.mimeType, base64: payload.base64 });
          const asset = await repository.createContentAssetMetadata({ ...uploaded, actorUid: uid });
          return res.json({ asset });
        } catch (error) {
          if (uploaded?.storagePath) await storage.deleteTeacherStudioFile(uploaded.storagePath).catch(() => {});
          throw error;
        }
      }
    }

    if (action.startsWith('teacher-period-')) {
      const [periods, repository] = await Promise.all([
        import('../../functions/src/competitionPeriod.js'),
        import('../../functions/src/competitionPeriodRepository.js'),
      ]);
      if (action === 'teacher-period-create') return res.json(await repository.createCompetitionPeriodAsTeacher({ ...periods.normalizeCompetitionPeriodCreateInput(payload), actorUid: uid }));
      if (action === 'teacher-period-update') return res.json(await repository.updateCompetitionPeriodAsTeacher({ ...periods.normalizeCompetitionPeriodUpdateInput(payload), actorUid: uid }));
      if (action === 'teacher-period-status') return res.json(await repository.setCompetitionPeriodStatusAsTeacher({ ...periods.normalizeCompetitionPeriodStatusInput(payload), actorUid: uid }));
    }

    return res.status(404).json({ error: 'unknown_action' });
  } catch (error) { return next(error); }
});

app.get('/api/ranking', ...protectedRoute(), async (req, res, next) => {
  try {
    const periodId = await resolveOfficialPeriodId(req.auth.uid, String(req.query.periodId || ''));
    const data = unwrap(await sqlOperation('GetCompetitionRankings', { periodId, studentLimit: 100 }, dataConnectAuth(req.auth.uid)));
    const classId = String(req.query.classId || 'TODAS').toUpperCase();
    const individualRanking = (data.individualRanking || []).filter((row) =>
      classId === 'TODAS' || publicClass(row.classGroup) === classId);
    return res.json({ periodId, classId, individualRanking, classRanking: data.classRanking || [] });
  } catch (error) { return next(error); }
});

app.get('/api/teacher/periods', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const now = new Date();
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 50);
    const data = unwrap(await sqlOperation(
      'ListTeacherCompetitionPeriods',
      { limit },
      dataConnectAuth(req.auth.uid),
    ));
    const periods = data.periods || [];
    const recognized = periodStateFromPeriods(periods, now);
    return res.json({
      serverTime: now.toISOString(),
      timezone: TIME_ZONE,
      recognizedPeriod: recognized,
      periods: periods.map((period) => ({
        ...period,
        allowedActions: allowedPeriodActions(period, periods, now),
        recognizedByApi: period.id === recognized.selectedPeriodId,
      })),
    });
  } catch (error) { return next(error); }
});

app.get('/api/teacher/test-mode', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    return res.json({
      accessPolicy: 'TEACHER_OWNER_ONLY',
      testRun: await getTeacherTestRun(req.auth.uid),
      serverTime: new Date().toISOString(),
      timezone: TIME_ZONE,
    });
  } catch (error) { return next(error); }
});

app.post('/api/teacher/test-mode/start', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const test = await import('../../functions/src/testRun.js');
    const durationMinutes = test.normalizeTestDuration(req.body?.durationMinutes);
    const testRunId = crypto.randomUUID();
    const data = unwrap(await sqlMutation('ActivateTeacherTestRun', { testRunId, durationMinutes, actorUid: req.auth.uid }));
    if (Number(data.affectedRows || 0) !== 1) return res.status(409).json({ error: 'test_mode_already_active', requestId: req.requestId });
    return res.status(201).json({ testRun: await getTeacherTestRun(req.auth.uid), accessPolicy: test.TEST_ACCESS_POLICY });
  } catch (error) { return next(error); }
});

app.post('/api/teacher/test-mode/end', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const current = await getTeacherTestRun(req.auth.uid);
    if (!current?.id || current.status !== 'ACTIVE') return res.status(409).json({ error: 'test_mode_not_active', requestId: req.requestId });
    const data = unwrap(await sqlMutation('EndTeacherTestRun', { testRunId: current.id, actorUid: req.auth.uid }));
    if (Number(data.affectedRows || 0) !== 1) return res.status(409).json({ error: 'test_mode_end_refused', requestId: req.requestId });
    return res.json({ testRun: await getTeacherTestRun(req.auth.uid) });
  } catch (error) { return next(error); }
});

app.delete('/api/teacher/test-mode/data', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const current = await getTeacherTestRun(req.auth.uid);
    if (!current?.id || !['ENDED', 'EXPIRED'].includes(current.status)) return res.status(409).json({ error: 'end_test_mode_before_cleanup', requestId: req.requestId });
    const data = unwrap(await sqlMutation('CleanTeacherTestRun', { testRunId: current.id, actorUid: req.auth.uid }));
    if (Number(data.affectedRows || 0) !== 1) return res.status(409).json({ error: 'test_mode_cleanup_refused', requestId: req.requestId });
    return res.json({ testRun: await getTeacherTestRun(req.auth.uid), cleaned: true });
  } catch (error) { return next(error); }
});

app.get('/api/teacher/diagnostics', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const now = new Date();
    const [bank, periodState] = await Promise.all([
      sqlOperation('GetPedagogicalBankStatus', {}).then(unwrap),
      resolveRuntimePeriod(req.auth.uid),
    ]);
    const counts = Object.fromEntries((bank.counts || []).map((row) => [row.activityId, Number(row.activeItems || 0)]));
    return res.json({
      serverTime: now.toISOString(),
      timezone: TIME_ZONE,
      database: {
        accessible: true,
        activeItems: Object.values(counts).reduce((total, value) => total + value, 0),
        counts,
        recognizedPeriod: periodState.current,
        lastSuccessAt: runtimeDiagnostics.sql.lastSuccessAt,
        lastFailure: runtimeDiagnostics.sql.lastFailure,
      },
      gemini: {
        keyRecognized: Boolean(geminiApiKey()),
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        activityGenerator: runtimeDiagnostics.activityGenerator,
        mentor: runtimeDiagnostics.mentor,
        analyst: runtimeDiagnostics.analyst,
      },
      render: {
        apiCommit: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || 'unknown',
        serviceId: process.env.RENDER_SERVICE_ID || 'unknown',
        frontendOrigin,
        apiUrl: process.env.RENDER_EXTERNAL_URL || 'https://money-rank-wb1h.onrender.com',
        nodeVersion: process.version,
        buildVersion: process.env.npm_package_version || '1.0.0',
      },
      requestId: req.requestId,
    });
  } catch (error) { return next(error); }
});

app.post('/api/teacher/diagnostics/gemini-probe', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const mentor = await import('../../functions/src/studentMentor.js');
    const answer = await mentor.answerStudentMentor({
      question: 'O que é IPI?',
      rawContext: { profile: { role: 'STUDENT', profileCompleted: true, currentPhase: 0 }, progress: [] },
      apiKey: geminiApiKey(),
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      requestId: req.requestId,
      onDiagnostic: (diagnostic) => { runtimeDiagnostics.mentor = { ...diagnostic, at: new Date().toISOString() }; },
    });
    return res.json(answer);
  } catch (error) { return next(error); }
});

app.get('/api/teacher/dashboard', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const periodId = String(req.query.periodId || '').trim();
    if (!validUuid(periodId)) {
      return res.status(400).json({ error: 'invalid_period_id', requestId: req.requestId });
    }
    const data = unwrap(await sqlOperation(
      'GetTeacherDashboard',
      { periodId, studentLimit: 100 },
      dataConnectAuth(req.auth.uid),
    ));
    return res.json(data);
  } catch (error) { return next(error); }
});

app.get('/api/export.xlsx', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    await ensureTeacherRole(req.auth);
    const periodId = await resolveOfficialPeriodId(req.auth.uid, String(req.query.periodId || ''));
    const [dashboard, exportRows] = await Promise.all([
      sqlOperation('GetTeacherDashboard', { periodId, studentLimit: 100 }, dataConnectAuth(req.auth.uid)).then(unwrap),
      sqlOperation('GetPilotExportRows', { periodId }).then(unwrap),
    ]);
    const classId = String(req.query.classId || 'TODAS').toUpperCase();
    if (!['TODAS', '3DSA', '3DSB'].includes(classId)) return res.status(400).json({ error: 'invalid_class_filter' });
    const pseudonymize = (uid) => crypto.createHash('sha256').update(String(uid)).digest('hex').slice(0, 16);
    const normalizeRow = (row) => {
      const normalized = { ...row };
      if (normalized.studentUid) {
        normalized.studentId = pseudonymize(normalized.studentUid);
        delete normalized.studentUid;
      }
      if (normalized.classGroup && !normalized.classId) normalized.classId = publicClass(normalized.classGroup);
      delete normalized.classGroup;
      if (normalized.details && typeof normalized.details === 'object') normalized.details = JSON.stringify(normalized.details);
      return Object.fromEntries(Object.entries(normalized).filter(([key]) => !/answer|correct|weight|delta/i.test(key)));
    };
    const filterRows = (rows) => (rows || []).map(normalizeRow).filter((row) =>
      classId === 'TODAS' || !row.classId || row.classId === classId);
    const sheets = [
      ['Resumo', [{ periodId, classFilter: classId, ...(dashboard.summary || {}) }]],
      ['Alunos', filterRows(dashboard.studentMetrics)],
      ['Tentativas', filterRows(exportRows.attempts)],
      ['Atividades', filterRows(dashboard.phaseMetrics)],
      ['Transações', filterRows(exportRows.transactions)],
      ['Auditoria', filterRows(exportRows.audit)],
    ];
    const wb = new ExcelJS.Workbook();
    wb.creator = 'Money Rank';
    wb.created = new Date();
    for (const [name, rows] of sheets) {
      const ws = wb.addWorksheet(name);
      const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
      ws.addRow(keys.length ? keys : ['sem_dados']);
      rows.forEach((row) => ws.addRow(keys.map((key) => row[key] ?? null)));
      ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      ws.views = [{ state: 'frozen', ySplit: 1 }];
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(ws.rowCount, 1), column: Math.max(keys.length, 1) } };
      ws.columns.forEach((column) => { column.width = Math.min(Math.max(column.header?.length || 12, 12), 40); });
    }
    const buffer = await wb.xlsx.writeBuffer();
    return res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .attachment(`money-rank-${classId.toLowerCase()}.xlsx`)
      .send(Buffer.from(buffer));
  } catch (error) { return next(error); }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const rawMessage = String(error?.message || 'internal_error');
  let status = Number(error?.status) || 500;
  let code = error?.code || 'internal_error';
  let message = 'O servidor não conseguiu concluir a operação.';
  if (rawMessage === 'cors_origin_denied') { status = 403; code = rawMessage; message = 'Origem não autorizada.'; }
  else if (rawMessage === 'invalid_period_id') { status = 400; code = rawMessage; message = 'Selecione um período válido.'; }
  else if (rawMessage === 'no_official_period_for_ranking') { status = 409; code = rawMessage; message = 'Não existe período oficial ativo para o ranking.'; }
  else if (error?.name === 'MentorUnavailableError') { status = 503; code = 'mentor_unavailable'; message = error.message; }
  else if (error?.name === 'PerigoDoceUnavailableError') { status = 503; code = 'activity_generation_unavailable'; message = error.message; }
  else if (rawMessage.startsWith('O ') || rawMessage.startsWith('A ') || rawMessage.startsWith('Um ')) { status = 409; code = 'operation_refused'; message = rawMessage; }
  console.error(JSON.stringify({ event: 'request_error', requestId: req.requestId, status, code, ...sanitizedError(error) }));
  return res.status(status).json({ error: code, message, diagnosticCode: req.requestId, requestId: req.requestId });
});

const port = Number(process.env.PORT || 8080);
if (process.env.NODE_ENV !== 'test') app.listen(port, '0.0.0.0', () => console.log(JSON.stringify({ event: 'listening', port })));
export { app };
