import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { firebaseApp } from '../lib/firebaseConfig';
import { ensureFirebaseAppCheck } from '../lib/firebaseAppCheck';

const REGION = 'southamerica-east1';
const functions = getFunctions(firebaseApp, REGION);
const useFunctionsEmulator =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true' ||
    import.meta.env.VITE_USE_DATA_CONNECT_EMULATOR === 'true');

if (useFunctionsEmulator) {
  const connectionKey = Symbol.for(
    'money-rank:functions-emulator-connected',
  );
  if (!globalThis[connectionKey]) {
    connectFunctionsEmulator(
      functions,
      import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || '127.0.0.1',
      Number(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT) || 5001,
    );
    globalThis[connectionKey] = true;
  }
}

const startSessionCallable = httpsCallable(
  functions,
  'startActivitySession',
  { timeout: 65_000, limitedUseAppCheckTokens: true },
);
const submitSessionCallable = httpsCallable(
  functions,
  'submitActivitySession',
  { timeout: 65_000, limitedUseAppCheckTokens: true },
);

function normalizeCallableError(error, fallback) {
  const code = String(error?.code || '').toLowerCase();
  const unavailableCodes = [
    'functions/deadline-exceeded',
    'functions/internal',
    'functions/unavailable',
  ];

  if (unavailableCodes.includes(code)) {
    return new Error(
      import.meta.env.DEV
        ? 'O serviço de atividades do Capi Bank não está ativo. Inicie os emuladores locais e tente novamente.'
        : 'O serviço de atividades do Capi Bank está temporariamente indisponível. Tente novamente em instantes.',
    );
  }

  const message = String(error?.message || '').replace(/^Firebase:\s*/i, '');
  return new Error(message || fallback);
}

async function prepareSecureRequest() {
  try {
    await ensureFirebaseAppCheck();
  } catch {
    if (!useFunctionsEmulator) {
      throw new Error(
        'A verificação segura da atividade não pôde ser iniciada.',
      );
    }
  }
}

export async function startAuthoritativeActivitySession(
  phaseNumber,
  variantId = null,
) {
  await prepareSecureRequest();

  try {
    const result = await startSessionCallable({ phaseNumber, variantId });
    if (!result.data?.sessionId) {
      throw new Error('O Capi Bank não devolveu uma sessão válida.');
    }
    return result.data;
  } catch (error) {
    throw normalizeCallableError(
      error,
      'Não foi possível preparar a atividade segura.',
    );
  }
}

export async function submitAuthoritativeActivitySession(
  sessionId,
  answers,
) {
  await prepareSecureRequest();

  try {
    const result = await submitSessionCallable({ sessionId, answers });
    if (!result.data?.attemptId) {
      throw new Error('O Capi Bank não confirmou o resultado.');
    }
    return result.data;
  } catch (error) {
    throw normalizeCallableError(
      error,
      'Não foi possível validar a atividade.',
    );
  }
}
