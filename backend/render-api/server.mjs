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
const PERIOD_ID = process.env.PERIOD_ID || 'piloto-money-rank-2026-08-11';
const PERIOD_DATE = process.env.PERIOD_DATE || '2026-08-11';
const PERIOD_WINDOWS = [
  { state: 'ACTIVE', classId: '3DSB', start: '08:20', end: '10:00' },
  { state: 'GRACE', classId: '3DSB', start: '10:00', end: '10:05' },
  { state: 'PAUSED', classId: null, start: '10:05', end: '10:20' },
  { state: 'ACTIVE', classId: '3DSA', start: '10:20', end: '12:00' },
  { state: 'GRACE', classId: '3DSA', start: '12:00', end: '12:05' },
  { state: 'CLOSED', classId: null, start: '12:05', end: '12:05' },
];

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
function sqlOperation(name, variables, options) { return dataConnect.executeQuery(name, variables, options); }
function sqlMutation(name, variables, options) { return dataConnect.executeMutation(name, variables, options); }
function unwrap(response) { if (response?.errors?.length) throw new Error(response.errors[0]?.message || 'sql_connect_error'); return response?.data || {}; }

function periodState(now = new Date()) {
  const hm = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Fortaleza', hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Fortaleza' }).format(now);
  if (day !== PERIOD_DATE) return { state: 'CLOSED', classId: null, hm };
  const minutes = Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3));
  return PERIOD_WINDOWS.find((window) => { const [sh, sm] = window.start.split(':').map(Number); const [eh, em] = window.end.split(':').map(Number); return minutes >= sh * 60 + sm && minutes < eh * 60 + em; }) || { state: minutes >= 725 ? 'CLOSED' : 'BEFORE', classId: null, hm };
}

function secureRandom() {
  return crypto.randomInt(0, 2 ** 32) / (2 ** 32);
}

function dataConnectAuth(uid) {
  return { impersonate: { authClaims: { sub: uid, email_verified: true } } };
}

function databaseClass(classId) {
  return classId === '3DSA' ? 'THIRD_DSA' : classId === '3DSB' ? 'THIRD_DSB' : null;
}

function publicClass(classGroup) {
  return classGroup === 'THIRD_DSA' ? '3DSA' : classGroup === 'THIRD_DSB' ? '3DSB' : null;
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

async function resolvePeriodUuid() {
  const period = unwrap(await sqlOperation('ResolveCompetitionPeriodByKey', { periodKey: PERIOD_ID })).competitionPeriod;
  if (!period?.id) throw new Error('pilot_period_not_provisioned');
  return period.id;
}

function graceAcceptsSession(current, session, binding) {
  if (current.state !== 'GRACE' || binding.classId !== current.classId) return false;
  const activeWindow = PERIOD_WINDOWS.find((window) =>
    window.state === 'ACTIVE' && window.classId === current.classId);
  if (!activeWindow) return false;
  const localStart = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Fortaleza',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(session.createdAt));
  return localStart.slice(0, 10) === PERIOD_DATE
    && localStart.slice(-5) < activeWindow.end;
}

app.get('/healthz', (req, res) => res.json({ ok: true, service: 'money-rank-api', requestId: req.requestId }));
app.get('/api/period', ...protectedRoute(), async (req, res, next) => {
  try {
    const current = periodState();
    if (current.state === 'PAUSED') return res.status(409).json({ error: 'period_paused', current });
    const [data, binding] = await Promise.all([
      sqlOperation('ListVisibleCompetitionPeriods', {}, dataConnectAuth(req.auth.uid)).then(unwrap),
      ensurePilotClass(req.auth.uid, current),
    ]);
    return res.json({
      periodId: PERIOD_ID,
      timezone: 'America/Fortaleza',
      windows: PERIOD_WINDOWS,
      current,
      classId: binding.classId,
      periods: data.competitionPeriods || [],
    });
  } catch (error) { return next(error); }
});

app.post('/api/activity/sessions/start', ...protectedRoute(), async (req, res, next) => {
  try {
    const current = periodState(); if (current.state !== 'ACTIVE') return res.status(409).json({ error: 'period_not_active', current });
    const binding = await ensurePilotClass(req.auth.uid, current);
    if (binding.classId !== current.classId) return res.status(409).json({ error: 'student_bound_to_other_class', classId: binding.classId, current });
    const phaseNumber = Number(req.body?.phaseNumber); if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) return res.status(400).json({ error: 'invalid_phase' });
    const module = await import('../../functions/src/activityEngine.js');
    const activityId = module.ACTIVITY_IDS_BY_PHASE[phaseNumber];
    const [bankData, seenData] = await Promise.all([
      sqlOperation('ListActivePedagogicalItemsForActivity', { activityId }).then(unwrap),
      sqlOperation('ListStudentSeenPedagogicalItemIds', { studentUid: req.auth.uid, activityId }).then(unwrap),
    ]);
    const prepared = module.buildStaticSession(phaseNumber, {
      variantId: req.body?.variantId || null,
      random: secureRandom,
      seenItemIds: (seenData.seenItems || []).map((item) => item.itemId),
      definition: { items: bankData.pedagogicalItems || [] },
    });
    const sessionId = crypto.randomUUID(); const expiresAt = new Date(Date.now() + 45 * 60_000).toISOString();
    await sqlMutation('CreateAuthoritativeActivitySession', { sessionId, studentUid: req.auth.uid, activityId: prepared.activityId, phaseNumber, variantId: prepared.variantId, contentVersion: prepared.contentVersion, publicPayload: prepared.publicPayload, answerKey: prepared.answerKey, expiresAt });
    res.status(201).json({ sessionId, phaseNumber, activityId: prepared.activityId, contentVersion: prepared.contentVersion, expiresAt, ...prepared.publicPayload });
  } catch (error) { next(error); }
});

app.post('/api/activity/sessions/:sessionId/step', ...protectedRoute(), async (req, res, next) => {
  try {
    const current = periodState();
    if (current.state !== 'ACTIVE') return res.status(409).json({ error: 'period_not_active', current });
    const binding = await ensurePilotClass(req.auth.uid, current);
    if (binding.classId !== current.classId) return res.status(409).json({ error: 'student_bound_to_other_class', classId: binding.classId, current });
    const data = unwrap(await sqlOperation('GetAuthoritativeActivitySession', { sessionId: req.params.sessionId }, dataConnectAuth(req.auth.uid)));
    const session = data.activitySession;
    if (!session || session.userUid !== req.auth.uid || Number(session.phaseNumber) !== 3) return res.status(404).json({ error: 'session_not_found' });
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
      sqlOperation('GetAuthoritativeActivitySession', { sessionId: req.params.sessionId }, dataConnectAuth(req.auth.uid)).then(unwrap),
      sqlOperation('GetAuthoritativeActivityResult', { sessionId: req.params.sessionId }, dataConnectAuth(req.auth.uid)).then(unwrap),
    ]);
    const session = sessionData.activitySession; if (!session || session.userUid !== req.auth.uid) return res.status(404).json({ error: 'session_not_found' });
    const priorResult = priorResultData.activityAttempts?.[0];
    if (priorResult) return res.json({ ...priorResult, idempotentReplay: true });
    const current = periodState();
    const binding = await ensurePilotClass(req.auth.uid, current);
    const canSubmit = current.state === 'ACTIVE'
      ? binding.classId === current.classId
      : graceAcceptsSession(current, session, binding);
    if (!canSubmit) return res.status(409).json({ error: 'period_not_accepting_submissions', current, classId: binding.classId });
    const engine = await import('../../functions/src/activityEngine.js');
    const submittedAnswers = Number(session.phaseNumber) === 3 && !Array.isArray(req.body?.answers)
      ? session.answerKey?.progress?.answers
      : req.body?.answers;
    const result = engine.scoreActivitySession({ phaseNumber: session.phaseNumber, answerKey: session.answerKey }, submittedAnswers);
    await sqlMutation(result.passed ? 'CompleteMyCurrentPhase' : 'RegisterMyCurrentPhaseAttempt', { attemptId: session.id, sessionId: session.id, studentUid: req.auth.uid, activityId: session.activityId, phaseNumber: session.phaseNumber, score: result.score, correctAnswers: result.correctAnswers, wrongAnswers: result.wrongAnswers });
    await sqlMutation('MarkAuthoritativeActivitySessionSubmitted', { sessionId: session.id, studentUid: req.auth.uid });
    const savedData = unwrap(await sqlOperation('GetAuthoritativeActivityResult', { sessionId: session.id }, dataConnectAuth(req.auth.uid)));
    return res.json({ ...savedData.activityAttempts?.[0], ...result, idempotentReplay: false });
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
      const answer = await mentor.answerStudentMentor({ question, rawContext: context, apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' });
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
      const answer = await chat.buildTeacherChatResponse({ question, rawContext: context, apiKey: process.env.GEMINI_API_KEY, model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' });
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
    const periodId = await resolvePeriodUuid();
    const data = unwrap(await sqlOperation('GetCompetitionRankings', { periodId, studentLimit: 100 }, dataConnectAuth(req.auth.uid)));
    const classId = String(req.query.classId || 'TODAS').toUpperCase();
    const individualRanking = (data.individualRanking || []).filter((row) =>
      classId === 'TODAS' || publicClass(row.classGroup) === classId);
    return res.json({ classId, individualRanking, classRanking: data.classRanking || [] });
  } catch (error) { return next(error); }
});

app.get('/api/export.xlsx', ...protectedRoute(requireTeacher), async (req, res, next) => {
  try {
    const periodId = await resolvePeriodUuid();
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
      ['Resumo', [{ periodKey: PERIOD_ID, classFilter: classId, ...(dashboard.summary || {}) }]],
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

app.use((error, req, res, next) => res.status(error.message === 'cors_origin_denied' ? 403 : 500).json({ error: error.message || 'internal_error', requestId: req.requestId }));

const port = Number(process.env.PORT || 8080);
if (process.env.NODE_ENV !== 'test') app.listen(port, '0.0.0.0', () => console.log(JSON.stringify({ event: 'listening', port })));
export { app };
