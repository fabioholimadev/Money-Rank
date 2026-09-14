const requiredFlags = Object.freeze({
  VITE_DATA_CONNECT_ENABLED: 'false',
  VITE_USE_DATA_CONNECT_EMULATOR: 'false',
  VITE_FIREBASE_AI_ENABLED: 'false',
  VITE_FIREBASE_APPCHECK_DEBUG: 'false',
});

const errors = [];
const apiUrl = String(process.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const appCheckSiteKey = String(process.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY || '').trim();
const debugToken = String(process.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || '').trim();

try {
  const parsed = new URL(apiUrl);
  if (parsed.protocol !== 'https:' || parsed.origin !== apiUrl) errors.push('INVALID_VITE_API_URL');
} catch {
  errors.push('INVALID_VITE_API_URL');
}

if (!appCheckSiteKey) {
  errors.push('MISSING_VITE_RECAPTCHA_ENTERPRISE_SITE_KEY');
} else if (appCheckSiteKey.length < 20 || /\s/.test(appCheckSiteKey)) {
  errors.push('MALFORMED_VITE_RECAPTCHA_ENTERPRISE_SITE_KEY');
}
if (!String(process.env.VITE_BUILD_COMMIT || '').trim()) errors.push('MISSING_VITE_BUILD_COMMIT');
if (debugToken) errors.push('PRODUCTION_APPCHECK_DEBUG_TOKEN_FORBIDDEN');

for (const [key, expected] of Object.entries(requiredFlags)) {
  if (String(process.env[key] || '').trim().toLowerCase() !== expected) {
    errors.push(`INVALID_${key}`);
  }
}

for (const key of ['VITE_GEMINI_API_KEY', 'VITE_FIREBASE_PRIVATE_KEY', 'VITE_FIREBASE_CLIENT_EMAIL']) {
  if (String(process.env[key] || '').trim()) errors.push(`FORBIDDEN_${key}`);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ event: 'production_environment_invalid', errors }));
  process.exit(1);
}

console.log(JSON.stringify({
  event: 'production_environment_valid',
  apiOrigin: new URL(apiUrl).origin,
  appCheckConfigured: true,
}));
