import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  auth,
  authPersistenceReady,
  googleProvider,
} from '../lib/firebaseConfig';

const AuthContext = createContext(null);

const LEGACY_SESSION_KEYS = ['token', 'refresh_token', 'aluno'];

/**
 * Converte o usuário do Firebase em um snapshot compatível com os componentes
 * atuais. Os dados relacionais definitivos serão conectados ao SQL Connect nas
 * Tasks 2.1 e 2.2.
 */
function createStudentSnapshot(firebaseUser, currentStudent = null) {
  return {
    ...currentStudent,
    id: firebaseUser.uid,
    nome:
      currentStudent?.nome ||
      firebaseUser.displayName ||
      'Estudante',
    email: firebaseUser.email || '',
    avatar_url:
      currentStudent?.avatar_url ||
      firebaseUser.photoURL ||
      null,
    capicoins: currentStudent?.capicoins ?? 0,
    fase_atual: currentStudent?.fase_atual ?? 1,
    streak_atual: currentStudent?.streak_atual ?? 0,
    is_admin: currentStudent?.is_admin ?? false,
    profile_complete: currentStudent?.profile_complete ?? false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    LEGACY_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setAluno((currentStudent) =>
          firebaseUser
            ? createStudentSnapshot(firebaseUser, currentStudent)
            : null
        );
        setAuthError(null);
        setLoading(false);
      },
      (error) => {
        setUser(null);
        setAluno(null);
        setAuthError(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await authPersistenceReady;
    setAuthError(null);

    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  }, []);

  const logout = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
  }, []);

  const updateAluno = useCallback((data) => {
    setAluno((currentStudent) =>
      currentStudent
        ? { ...currentStudent, ...data }
        : currentStudent
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      aluno,
      loading,
      authError,
      loginWithGoogle,
      logout,
      updateAluno,
    }),
    [
      user,
      aluno,
      loading,
      authError,
      loginWithGoogle,
      logout,
      updateAluno,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// O hook compartilha o arquivo com o Provider para manter a API centralizada.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}

export default AuthProvider;
