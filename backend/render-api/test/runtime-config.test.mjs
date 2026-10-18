import test from 'node:test';
import assert from 'node:assert/strict';
import {
  auditRuntimeEnvironment,
  buildRuntimeConfiguration,
  normalizeFrontendOrigins,
  normalizePrivateKey,
} from '../runtime-config.mjs';

const validProductionEnvironment = {
  NODE_ENV: 'production',
  PORT: '10000',
  FRONTEND_ORIGIN: 'https://money-rank-web.onrender.com',
  TEACHER_EMAILS: 'teacher@example.com',
  FIREBASE_PROJECT_ID: 'money-rank',
  FIREBASE_CLIENT_EMAIL: 'firebase@example.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nsecret\\n-----END PRIVATE KEY-----',
  FIREBASE_STORAGE_BUCKET: 'money-rank.firebasestorage.app',
};

test('normalizes dashboard quotes, line breaks and trailing origin slashes', () => {
  assert.deepEqual(
    normalizeFrontendOrigins(' "https://app.example.com/, https://admin.example.com/" '),
    ['https://app.example.com', 'https://admin.example.com'],
  );
  assert.match(normalizePrivateKey('"-----BEGIN PRIVATE KEY-----\\nvalue\\n-----END PRIVATE KEY-----"'), /\nvalue\n/);
});

test('accepts the complete production environment without exposing values', () => {
  const audit = auditRuntimeEnvironment(validProductionEnvironment);
  assert.equal(audit.ok, true);
  assert.deepEqual(audit.errors, []);
  assert.deepEqual(audit.warnings, []);
});

test('rejects a production environment that would deploy broken', () => {
  const audit = auditRuntimeEnvironment({ NODE_ENV: 'production', PORT: 'invalid' });
  assert.equal(audit.ok, false);
  assert.deepEqual(audit.errors, [
    'INVALID_PORT',
    'MISSING_FRONTEND_ORIGIN',
    'MISSING_FIREBASE_PROJECT_ID',
    'INVALID_FIREBASE_CLIENT_EMAIL',
    'INVALID_FIREBASE_PRIVATE_KEY',
    'INVALID_TEACHER_EMAILS',
  ]);
  assert.ok(audit.warnings.includes('MISSING_FIREBASE_STORAGE_BUCKET'));
});
