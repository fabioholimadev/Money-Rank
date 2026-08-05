import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { ensureFirebaseAppCheck } from '../lib/firebaseAppCheck';
import { firebaseApp } from '../lib/firebaseConfig';
import { normalizeTeacherPeriods } from '../lib/teacherAnalyticsMapper';

const functions = getFunctions(firebaseApp, 'southamerica-east1');
const useFunctionsEmulator =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true' ||
    import.meta.env.VITE_USE_DATA_CONNECT_EMULATOR === 'true');

if (useFunctionsEmulator) {
  const connectionKey = Symbol.for('money-rank:functions-emulator-connected');
  if (!globalThis[connectionKey]) {
    connectFunctionsEmulator(
      functions,
      import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || '127.0.0.1',
      Number(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT) || 5001,
    );
    globalThis[connectionKey] = true;
  }
}

const options = { timeout: 65_000, limitedUseAppCheckTokens: true };
const callables = {
  create: httpsCallable(
    functions,
    'createTeacherCompetitionPeriod',
    options,
  ),
  update: httpsCallable(
    functions,
    'updateTeacherCompetitionPeriod',
    options,
  ),
  setStatus: httpsCallable(
    functions,
    'setTeacherCompetitionPeriodStatus',
    options,
  ),
};

async function prepareRequest() {
  try {
    await ensureFirebaseAppCheck();
  } catch {
    if (!useFunctionsEmulator) {
      throw new Error('A verificação segura do período falhou.');
    }
  }
}

function normalizeError(error, fallback) {
  const message = String(error?.message || '').replace(/^Firebase:\s*/i, '');
  return new Error(message || fallback, { cause: error });
}

function normalizeResponse(value) {
  const period = normalizeTeacherPeriods([value])[0];
  if (!period) throw new Error('O Capi Bank devolveu um período inválido.');
  return period;
}

async function invoke(callable, input, fallback) {
  await prepareRequest();
  try {
    const result = await callable(input);
    return normalizeResponse(result.data);
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

export function createTeacherCompetitionPeriod(input) {
  return invoke(
    callables.create,
    input,
    'Não foi possível criar o período.',
  );
}

export function updateTeacherCompetitionPeriod(input) {
  return invoke(
    callables.update,
    input,
    'Não foi possível alterar o período.',
  );
}

export function setTeacherCompetitionPeriodStatus(input) {
  return invoke(
    callables.setStatus,
    input,
    'Não foi possível mudar o funcionamento do período.',
  );
}
