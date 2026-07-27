import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth';

/**
 * Configuração pública do aplicativo Web registrada no Firebase.
 *
 * Estes valores identificam o projeto para o SDK do navegador. A segurança
 * dos dados não depende de esconder esta configuração, mas das regras de
 * autorização, dos domínios permitidos e da validação dos tokens no backend.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCrj4bP4xkPgNm8ZS1aZeX8wW02JWgF5us',
  authDomain: 'money-rank.firebaseapp.com',
  projectId: 'money-rank',
  storageBucket: 'money-rank.firebasestorage.app',
  messagingSenderId: '1015598179922',
  appId: '1:1015598179922:web:aecb3c857923ae6ccfa18b',
};

// Evita inicializações duplicadas durante o Hot Module Replacement do Vite.
export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

// Mantém a sessão após recarregar ou reabrir o navegador.
export const authPersistenceReady = setPersistence(
  auth,
  browserLocalPersistence
);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default firebaseApp;
