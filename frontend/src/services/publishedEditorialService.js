import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { firebaseApp } from '../lib/firebaseConfig';
import { ensureFirebaseAppCheck } from '../lib/firebaseAppCheck';

const functions = getFunctions(firebaseApp, 'southamerica-east1');
const useFunctionsEmulator =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true' ||
    import.meta.env.VITE_USE_DATA_CONNECT_EMULATOR === 'true');

if (useFunctionsEmulator) {
  const key = Symbol.for('money-rank:functions-emulator-connected');
  if (!globalThis[key]) {
    connectFunctionsEmulator(
      functions,
      import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || '127.0.0.1',
      Number(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT) || 5001,
    );
    globalThis[key] = true;
  }
}

const options = { timeout: 65_000, limitedUseAppCheckTokens: true };
const getContentCallable = httpsCallable(
  functions,
  'getPublishedLearningContent',
  options,
);
const getActivityCallable = httpsCallable(
  functions,
  'getPublishedActivityCatalog',
  options,
);

async function prepareRequest() {
  try {
    await ensureFirebaseAppCheck();
  } catch {
    if (!useFunctionsEmulator) throw new Error('Verificação segura indisponível.');
  }
}

export async function fetchPublishedLearningContent(moduleKey) {
  await prepareRequest();
  const result = await getContentCallable({ moduleKey });
  return result.data;
}

export async function fetchPublishedActivityCatalog(activityKey) {
  await prepareRequest();
  const result = await getActivityCallable({ activityKey });
  return result.data;
}
