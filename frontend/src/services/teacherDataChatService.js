import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { ensureFirebaseAppCheck } from '../lib/firebaseAppCheck';
import { firebaseApp } from '../lib/firebaseConfig';

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

const askTeacherDataCallable = httpsCallable(functions, 'askTeacherData', {
  timeout: 65_000,
  limitedUseAppCheckTokens: true,
});

export async function askTeacherData({ periodId, question }) {
  try {
    await ensureFirebaseAppCheck();
  } catch {
    if (!useFunctionsEmulator) {
      throw new Error('A verificação segura do Capi Analista falhou.');
    }
  }

  try {
    const result = await askTeacherDataCallable({
      periodId,
      question,
    });
    if (!result.data?.answer || result.data?.periodId !== periodId) {
      throw new Error('O Capi Analista devolveu uma resposta inválida.');
    }
    return result.data;
  } catch (error) {
    const code = String(error?.code || '').toLowerCase();
    if (
      code.includes('unavailable') ||
      code.includes('deadline-exceeded') ||
      code.includes('internal')
    ) {
      throw new Error(
        import.meta.env.DEV
          ? 'O Capi Analista local não está ativo. Inicie os emuladores e tente novamente.'
          : 'O Capi Analista está temporariamente indisponível.',
        { cause: error },
      );
    }
    throw new Error(
      String(error?.message || '')
        .replace(/^Firebase:\s*/i, '') ||
        'Não foi possível analisar os dados agora.',
      { cause: error },
    );
  }
}
