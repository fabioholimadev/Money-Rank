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
  initializeApp(credential ? { credential } : {});
}

const dataConnect = getDataConnect(config.dataConnect);
const app = express();
const frontendOrigin = String(process.env.FRONTEND_ORIGIN || '').trim();
const teacherEmails = new Set(String(process.env.TEACHER_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean));
const isTest = process.env.NODE_ENV === 'test';
const PERIOD_ID = process.env.PERIOD_ID || 'piloto-money-rank-2026-08-11';
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
app.use(express.json({ limit: '64kb' }));
app.use(cors({ origin: (origin, callback) => {
  if (!origin || origin === frontendOrigin || (isTest && origin === 'http://localhost:5173')) return callback(null, true);
  return callback(new Error('cors_origin_denied'));
} }));
app.use((req, res, next) => { req.requestId = crypto.randomUUID(); res.setHeader('X-Request-Id', req.requestId); next(); });
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, keyGenerator: (req) => req.auth?.uid || ipKeyGenerator(req.ip) }));

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

function protectedRoute(...handlers) { return [authenticate, verifyAppCheck, ...handlers]; }
function sqlOperation(name, variables, options) { return dataConnect.executeQuery(name, variables, options); }
function sqlMutation(name, variables, options) { return dataConnect.executeMutation(name, variables, options); }
function unwrap(response) { if (response?.errors?.length) throw new Error(response.errors[0]?.message || 'sql_connect_error'); return response?.data || {}; }

function periodState(now = new Date()) {
  const hm = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Fortaleza', hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Fortaleza' }).format(now);
  if (day !== '2026-08-11') return { state: 'CLOSED', classId: null, hm };
  const minutes = Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3));
  return PERIOD_WINDOWS.find((window) => { const [sh, sm] = window.start.split(':').map(Number); const [eh, em] = window.end.split(':').map(Number); return minutes >= sh * 60 + sm && minutes < eh * 60 + em; }) || { state: minutes >= 725 ? 'CLOSED' : 'BEFORE', classId: null, hm };
}

app.get('/healthz', (req, res) => res.json({ ok: true, service: 'money-rank-api', requestId: req.requestId }));
app.get('/api/period', ...protectedRoute(), async (req, res, next) => { try { const data = unwrap(await sqlOperation('ListVisibleCompetitionPeriods', {}, { impersonate: { authClaims: { sub: req.auth.uid, email_verified: true } } })); res.json({ periodId: PERIOD_ID, timezone: 'America/Fortaleza', windows: PERIOD_WINDOWS, current: periodState(), periods: data.competitionPeriods || [] }); } catch (error) { next(error); } });

app.post('/api/activity/sessions/start', ...protectedRoute(), async (req, res, next) => {
  try {
    const current = periodState(); if (current.state !== 'ACTIVE') return res.status(409).json({ error: 'period_not_active', current });
    const phaseNumber = Number(req.body?.phaseNumber); if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) return res.status(400).json({ error: 'invalid_phase' });
    const module = await import('../../functions/src/activityEngine.js');
    const prepared = module.buildStaticSession(phaseNumber, { variantId: req.body?.variantId || null });
    const sessionId = crypto.randomUUID(); const expiresAt = new Date(Date.now() + 45 * 60_000).toISOString();
    await sqlMutation('CreateAuthoritativeActivitySession', { sessionId, studentUid: req.auth.uid, activityId: prepared.activityId, phaseNumber, variantId: prepared.variantId, contentVersion: prepared.contentVersion, publicPayload: prepared.publicPayload, answerKey: prepared.answerKey, expiresAt });
    res.status(201).json({ sessionId, phaseNumber, activityId: prepared.activityId, contentVersion: prepared.contentVersion, expiresAt, ...prepared.publicPayload });
  } catch (error) { next(error); }
});

app.post('/api/activity/sessions/:sessionId/submit', ...protectedRoute(), async (req, res, next) => {
  try {
    const sessionData = unwrap(await sqlOperation('GetAuthoritativeActivitySession', { sessionId: req.params.sessionId }, { impersonate: { authClaims: { sub: req.auth.uid, email_verified: true } } }));
    const session = sessionData.activitySession; if (!session || session.userUid !== req.auth.uid) return res.status(404).json({ error: 'session_not_found' });
    const current = periodState(); if (current.state === 'PAUSED' || current.state === 'CLOSED') return res.status(409).json({ error: 'period_not_accepting_submissions' });
    const engine = await import('../../functions/src/activityEngine.js'); const result = engine.scoreActivitySession({ phaseNumber: session.phaseNumber, answerKey: session.answerKey }, req.body?.answers);
    const persisted = await sqlMutation(result.passed ? 'CompleteMyCurrentPhase' : 'RegisterMyCurrentPhaseAttempt', { attemptId: session.id, sessionId: session.id, studentUid: req.auth.uid, activityId: session.activityId, phaseNumber: session.phaseNumber, score: result.score, correctAnswers: result.correctAnswers, wrongAnswers: result.wrongAnswers });
    await sqlMutation('MarkAuthoritativeActivitySessionSubmitted', { sessionId: session.id, studentUid: req.auth.uid });
    res.json({ ...result, sql: Boolean(persisted) });
  } catch (error) { next(error); }
});

app.get('/api/ranking', ...protectedRoute(), async (req, res, next) => { try { const periodId = req.query.periodId || PERIOD_ID; const data = unwrap(await sqlOperation('GetCompetitionRankings', { periodId, studentLimit: 100 }, { impersonate: { authClaims: { sub: req.auth.uid, email_verified: true } } })); const classId = String(req.query.classId || 'TODAS'); res.json({ classId, individualRanking: data.individualRanking || [], classRanking: data.classRanking || [] }); } catch (error) { next(error); } });

app.get('/api/export.xlsx', ...protectedRoute(requireTeacher), async (req, res, next) => { try { const periodId = req.query.periodId || PERIOD_ID; const dashboard = unwrap(await sqlOperation('GetTeacherDashboard', { periodId, studentLimit: 100 }, { impersonate: { authClaims: { sub: req.auth.uid, email_verified: true } } })); const wb = new ExcelJS.Workbook(); for (const [name, rows] of [['Resumo', [dashboard.summary || {}]], ['Alunos', dashboard.students || []], ['Tentativas', dashboard.attempts || []], ['Atividades', dashboard.phaseMetrics || []], ['Transações', dashboard.transactions || []], ['Auditoria', dashboard.audit || []]]) { const ws = wb.addWorksheet(name); const data = rows.map((row) => Object.fromEntries(Object.entries(row).filter(([key]) => !/answer|correct|weight|delta/i.test(key)))); const keys = [...new Set(data.flatMap((row) => Object.keys(row)))]; ws.addRow(keys); data.forEach((row) => ws.addRow(keys.map((key) => row[key] ?? null))); ws.getRow(1).font = { bold: true }; ws.views = [{ state: 'frozen', ySplit: 1 }]; } const buffer = await wb.xlsx.writeBuffer(); res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').attachment('money-rank-export.xlsx').send(Buffer.from(buffer)); } catch (error) { next(error); } });

app.use((error, req, res, next) => res.status(error.message === 'cors_origin_denied' ? 403 : 500).json({ error: error.message || 'internal_error', requestId: req.requestId }));

const port = Number(process.env.PORT || 8080);
if (process.env.NODE_ENV !== 'test') app.listen(port, '0.0.0.0', () => console.log(JSON.stringify({ event: 'listening', port })));
export { app };
