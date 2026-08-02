import { firebaseApp } from './firebaseConfig';

const appCheckInstanceKey = Symbol.for('money-rank.firebase-app-check');
const siteKey = String(
  import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY || '',
).trim();
const debugEnabled =
  import.meta.env.DEV &&
  import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG === 'true';
const configuredDebugToken = String(
  import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || '',
).trim();

export const firebaseAppCheckMode = debugEnabled
  ? 'debug'
  : siteKey.length > 0
    ? 'recaptcha-enterprise'
    : 'disabled';

export const isFirebaseAppCheckConfigured =
  firebaseAppCheckMode !== 'disabled';

/**
 * Inicializa o App Check com token debug apenas no Vite DEV ou com reCAPTCHA
 * Enterprise nos demais ambientes. O Symbol global evita uma segunda
 * ativação durante o HMR do Vite.
 */
export async function ensureFirebaseAppCheck() {
  if (!isFirebaseAppCheckConfigured) {
    throw new Error(
      'O Firebase App Check ainda não foi configurado neste ambiente.',
    );
  }

  if (firebaseAppCheckMode === 'debug') {
    globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN =
      configuredDebugToken || true;
  }

  const {
    CustomProvider,
    getToken,
    initializeAppCheck,
    ReCaptchaEnterpriseProvider,
  } = await import('firebase/app-check');

  if (!globalThis[appCheckInstanceKey]) {
    const provider =
      firebaseAppCheckMode === 'debug'
        ? new CustomProvider({
            getToken: async () => {
              throw new Error(
                'O provedor local só pode ser usado com um token de depuração do App Check.',
              );
            },
          })
        : new ReCaptchaEnterpriseProvider(siteKey);

    globalThis[appCheckInstanceKey] = initializeAppCheck(firebaseApp, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
  }

  const appCheck = globalThis[appCheckInstanceKey];
  await getToken(appCheck);
  return appCheck;
}
