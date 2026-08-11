import { getToken as getAppCheckToken } from 'firebase/app-check';
import { auth } from './firebaseConfig';
import { ensureFirebaseAppCheck } from './firebaseAppCheck';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchApi(endpoint, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isForm = options.body instanceof FormData;

  if (!isForm && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let body = options.body;
  if (body && headers['Content-Type'] === 'application/json' && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (auth.currentUser) {
    headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
  }
  if (options.requireAppCheck !== false) {
    try {
      const appCheck = await ensureFirebaseAppCheck();
      const appCheckToken = await getAppCheckToken(appCheck, false);
      headers['X-Firebase-AppCheck'] = appCheckToken.token;
    } catch (error) {
      if (!import.meta.env.DEV) throw error;
    }
  }
  const res = await fetch(url, { ...options, headers, body });
  return res;
}

export default fetchApi;
