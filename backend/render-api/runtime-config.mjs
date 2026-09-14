function unwrapMatchingQuotes(value) {
  const normalized = String(value ?? '').trim();
  if (normalized.length < 2) return normalized;
  const first = normalized[0];
  const last = normalized.at(-1);
  return (first === last && (first === '"' || first === "'"))
    ? normalized.slice(1, -1).trim()
    : normalized;
}

export function readEnvironmentValue(environment, key, fallback = '') {
  const value = unwrapMatchingQuotes(environment?.[key]);
  return value || fallback;
}

export function normalizePrivateKey(value) {
  return unwrapMatchingQuotes(value).replace(/\\n/g, '\n');
}

export function normalizeFrontendOrigins(value) {
  return unwrapMatchingQuotes(value)
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

export function buildRuntimeConfiguration(environment = process.env) {
  return {
    nodeEnvironment: readEnvironmentValue(environment, 'NODE_ENV', 'development'),
    port: Number(readEnvironmentValue(environment, 'PORT', '8080')),
    frontendOrigins: normalizeFrontendOrigins(environment.FRONTEND_ORIGIN),
    teacherEmails: readEnvironmentValue(environment, 'TEACHER_EMAILS')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
    firebase: {
      projectId: readEnvironmentValue(environment, 'FIREBASE_PROJECT_ID'),
      clientEmail: readEnvironmentValue(environment, 'FIREBASE_CLIENT_EMAIL'),
      privateKey: normalizePrivateKey(environment.FIREBASE_PRIVATE_KEY),
      storageBucket: readEnvironmentValue(environment, 'FIREBASE_STORAGE_BUCKET'),
    },
    gemini: {
      apiKey: readEnvironmentValue(environment, 'GEMINI_API_KEY'),
      model: readEnvironmentValue(environment, 'GEMINI_MODEL', 'gemini-3.6-flash'),
    },
    dataConnect: {
      location: readEnvironmentValue(environment, 'SQL_CONNECT_LOCATION', 'southamerica-east1'),
      serviceId: readEnvironmentValue(environment, 'SQL_CONNECT_SERVICE', 'money-rank-service'),
      connector: readEnvironmentValue(environment, 'SQL_CONNECT_CONNECTOR', 'money-rank-connector'),
    },
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpsOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.origin === value && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function auditRuntimeEnvironment(environment = process.env) {
  const configuration = buildRuntimeConfiguration(environment);
  const errors = [];
  const warnings = [];
  const production = configuration.nodeEnvironment === 'production';

  if (!Number.isInteger(configuration.port) || configuration.port < 1 || configuration.port > 65535) {
    errors.push('INVALID_PORT');
  }

  if (production) {
    if (configuration.frontendOrigins.length === 0) errors.push('MISSING_FRONTEND_ORIGIN');
    if (configuration.frontendOrigins.some((origin) => !isValidHttpsOrigin(origin))) {
      errors.push('INVALID_FRONTEND_ORIGIN');
    }
    if (!configuration.firebase.projectId) errors.push('MISSING_FIREBASE_PROJECT_ID');
    if (!isValidEmail(configuration.firebase.clientEmail)) errors.push('INVALID_FIREBASE_CLIENT_EMAIL');
    if (!configuration.firebase.privateKey.includes('BEGIN PRIVATE KEY')
      || !configuration.firebase.privateKey.includes('END PRIVATE KEY')) {
      errors.push('INVALID_FIREBASE_PRIVATE_KEY');
    }
    if (configuration.teacherEmails.length === 0
      || configuration.teacherEmails.some((email) => !isValidEmail(email))) {
      errors.push('INVALID_TEACHER_EMAILS');
    }
  }

  if (!configuration.firebase.storageBucket) warnings.push('MISSING_FIREBASE_STORAGE_BUCKET');
  if (!configuration.gemini.apiKey) {
    warnings.push('MISSING_GEMINI_API_KEY');
  } else if (/\s/.test(configuration.gemini.apiKey) || configuration.gemini.apiKey.length < 20) {
    warnings.push('MALFORMED_GEMINI_API_KEY');
  }
  if (!/^[a-z0-9][a-z0-9._-]+$/i.test(configuration.gemini.model)) {
    warnings.push('MALFORMED_GEMINI_MODEL');
  }

  return { configuration, errors, warnings, ok: errors.length === 0 };
}

export function assertRuntimeEnvironment(environment = process.env) {
  const audit = auditRuntimeEnvironment(environment);
  if (!audit.ok) {
    throw new Error(`invalid_runtime_environment:${audit.errors.join(',')}`);
  }
  return audit;
}
