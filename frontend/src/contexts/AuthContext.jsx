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
  updateProfile,
} from 'firebase/auth';
import {
  auth,
  authPersistenceReady,
  googleProvider,
} from '../lib/firebaseConfig';
import {
  isValidAvatarId,
  isValidClassName,
} from '../constants/profileOptions';

const AuthContext = createContext(null);

const LEGACY_SESSION_KEYS = ['token', 'refresh_token', 'aluno'];
const PROFILE_STORAGE_PREFIX = 'money-rank:student-profile:v1:';
const MAX_PROFILE_PHOTO_LENGTH = 400_000;

function normalizeText(value, maxLength) {
  return typeof value === 'string'
    ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
    : '';
}

function normalizeProfilePhotoUrl(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const photoUrl = value.trim();

  if (!photoUrl || photoUrl.length > MAX_PROFILE_PHOTO_LENGTH) {
    return null;
  }

  if (/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(photoUrl)) {
    return photoUrl;
  }

  if (photoUrl.length > 2_048) {
    return null;
  }

  try {
    const parsedUrl = new URL(photoUrl);
    return parsedUrl.protocol === 'https:' ? photoUrl : null;
  } catch {
    return null;
  }
}

function getProfileStorageKey(uid) {
  return `${PROFILE_STORAGE_PREFIX}${uid}`;
}

function readStoredProfile(uid) {
  try {
    const serializedProfile = localStorage.getItem(getProfileStorageKey(uid));
    if (!serializedProfile) return null;

    const parsedProfile = JSON.parse(serializedProfile);
    if (parsedProfile.uid !== uid) return null;

    const nome = normalizeText(parsedProfile.nome, 40);
    const turma = isValidClassName(parsedProfile.turma)
      ? parsedProfile.turma
      : '';
    const avatarId = isValidAvatarId(parsedProfile.avatar_id)
      ? parsedProfile.avatar_id
      : null;
    const avatarUrl = normalizeProfilePhotoUrl(parsedProfile.avatar_url);

    return {
      nome,
      turma,
      avatar_id: avatarId,
      avatar_url: avatarUrl,
      profile_complete:
        parsedProfile.profile_complete === true &&
        nome.length >= 2 &&
        Boolean(turma) &&
        Boolean(avatarId || avatarUrl),
    };
  } catch {
    return null;
  }
}

function writeStoredProfile(uid, profile) {
  try {
    localStorage.setItem(
      getProfileStorageKey(uid),
      JSON.stringify({
        uid,
        nome: profile.nome,
        turma: profile.turma,
        avatar_id: profile.avatar_id,
        avatar_url: profile.avatar_url,
        profile_complete: true,
      }),
    );
  } catch {
    throw new Error(
      'O navegador bloqueou o armazenamento local. Permita dados do site e tente novamente.',
    );
  }
}

/**
 * Converte o usuário do Firebase em um snapshot compatível com os componentes
 * atuais. Os dados relacionais definitivos serão conectados ao SQL Connect nas
 * Tasks 2.1 e 2.2.
 */
function createStudentSnapshot(firebaseUser, currentStudent = null) {
  const matchingStudent =
    currentStudent?.id === firebaseUser.uid ? currentStudent : null;
  const storedProfile = readStoredProfile(firebaseUser.uid);

  return {
    ...matchingStudent,
    id: firebaseUser.uid,
    nome:
      storedProfile?.nome ||
      matchingStudent?.nome ||
      firebaseUser.displayName ||
      'Estudante',
    email: firebaseUser.email || '',
    avatar_url:
      storedProfile?.avatar_url ||
      matchingStudent?.avatar_url ||
      firebaseUser.photoURL ||
      null,
    avatar_id:
      storedProfile?.avatar_id || matchingStudent?.avatar_id || null,
    turma: storedProfile?.turma || matchingStudent?.turma || '',
    capicoins: matchingStudent?.capicoins ?? 0,
    fase_atual: matchingStudent?.fase_atual ?? 1,
    streak_atual: matchingStudent?.streak_atual ?? 0,
    is_admin: matchingStudent?.is_admin ?? false,
    created_at:
      matchingStudent?.created_at ||
      firebaseUser.metadata.creationTime ||
      null,
    profile_complete:
      storedProfile?.profile_complete ??
      matchingStudent?.profile_complete ??
      false,
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
            : null,
        );
        setAuthError(null);
        setLoading(false);
      },
      (error) => {
        setUser(null);
        setAluno(null);
        setAuthError(error);
        setLoading(false);
      },
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

  const saveProfile = useCallback(
    async (profile) => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('Sua sessão expirou. Entre novamente para continuar.');
      }

      const nome = normalizeText(profile.nome, 40);
      const turma = isValidClassName(profile.turma) ? profile.turma : '';
      const avatarId = isValidAvatarId(profile.avatar_id)
        ? profile.avatar_id
        : null;
      const avatarUrl = avatarId
        ? null
        : normalizeProfilePhotoUrl(profile.avatar_url);

      if (nome.length < 2 || !turma || (!avatarId && !avatarUrl)) {
        throw new Error(
          'Informe o nome, selecione 3º DSA ou 3º DSB e escolha uma Capi ou foto.',
        );
      }

      // O Firebase Auth armazena somente os campos básicos da identidade.
      // Turma e avatar migram para o SQL Connect nas Tasks 2.1 e 2.2.
      await updateProfile(firebaseUser, { displayName: nome });

      const completedProfile = {
        ...createStudentSnapshot(firebaseUser, aluno),
        nome,
        turma,
        avatar_id: avatarId,
        avatar_url: avatarUrl,
        profile_complete: true,
      };

      writeStoredProfile(firebaseUser.uid, completedProfile);
      setAluno(completedProfile);

      return completedProfile;
    },
    [aluno],
  );

  const updateAluno = useCallback((data) => {
    setAluno((currentStudent) =>
      currentStudent ? { ...currentStudent, ...data } : currentStudent,
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
      saveProfile,
      updateAluno,
    }),
    [
      user,
      aluno,
      loading,
      authError,
      loginWithGoogle,
      logout,
      saveProfile,
      updateAluno,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
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
