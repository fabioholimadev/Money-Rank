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

const askStudentMentorCallable = httpsCallable(functions, 'askStudentMentor', {
  timeout: 50_000,
  limitedUseAppCheckTokens: true,
});

export async function askStudentMentor(question) {
  try {
    await ensureFirebaseAppCheck();
  } catch {
    if (!useFunctionsEmulator) {
      throw new Error('A verificação segura do CapiMentor falhou.');
    }
  }

  try {
    const result = await askStudentMentorCallable({ question });
    const answer = String(result.data?.answer || '').trim();
    if (!answer) throw new Error('O CapiMentor devolveu uma resposta vazia.');
    return {
      answer,
      sources: Array.isArray(result.data?.sources)
        ? result.data.sources.slice(0, 5)
        : [],
      searchSuggestionsHtml:
        typeof result.data?.searchSuggestionsHtml === 'string'
          ? result.data.searchSuggestionsHtml
          : '',
    };
  } catch (error) {
    const code = String(error?.code || '').toLowerCase();
    if (
      code.includes('unavailable') ||
      code.includes('deadline-exceeded') ||
      code.includes('internal')
    ) {
      throw new Error(
        import.meta.env.DEV
          ? 'O CapiMentor local não está ativo. Inicie os emuladores e tente novamente.'
          : 'O CapiMentor está temporariamente indisponível.',
        { cause: error },
      );
    }
    throw new Error(
      String(error?.message || '').replace(/^Firebase:\s*/i, '') ||
        'Não foi possível conversar com o CapiMentor agora.',
      { cause: error },
    );
  }
}
