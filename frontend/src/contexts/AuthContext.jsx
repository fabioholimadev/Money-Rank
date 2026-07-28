import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { isDataConnectEnabled } from '../lib/dataConnectClient';
import {
  fetchMyProgress,
  fetchMyStudentProfile,
  initializeLegacyTrail,
  syncStudentProfile,
} from '../services/studentDataService';

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

function createStudentSnapshot(
  firebaseUser,
  currentStudent = null,
  remoteProfile = null,
) {
  const matchingStudent =
    currentStudent?.id === firebaseUser.uid ? currentStudent : null;
  const storedProfile = readStoredProfile(firebaseUser.uid);
  const hasRemoteProfile = Boolean(remoteProfile);
  const remoteAvatarId = isValidAvatarId(remoteProfile?.avatar_id)
    ? remoteProfile.avatar_id
    : null;
  const remoteAvatarUrl = normalizeProfilePhotoUrl(
    remoteProfile?.avatar_url,
  );
  const storedLocalPhoto = storedProfile?.avatar_url?.startsWith('data:image/')
    ? storedProfile.avatar_url
    : null;

  const avatarId = hasRemoteProfile
    ? remoteAvatarId
    : storedProfile?.avatar_id || matchingStudent?.avatar_id || null;
  const avatarUrl = avatarId
    ? null
    : remoteAvatarUrl ||
      (hasRemoteProfile ? storedLocalPhoto : storedProfile?.avatar_url) ||
      matchingStudent?.avatar_url ||
      firebaseUser.photoURL ||
      null;

  return {
    ...matchingStudent,
    ...remoteProfile,
    id: firebaseUser.uid,
    nome:
      remoteProfile?.nome ||
      storedProfile?.nome ||
      matchingStudent?.nome ||
      firebaseUser.displayName ||
      'Estudante',
    email: firebaseUser.email || '',
    avatar_url: avatarUrl,
    avatar_id: avatarId,
    turma:
      remoteProfile?.turma ||
      storedProfile?.turma ||
      matchingStudent?.turma ||
      '',
    capicoins:
      remoteProfile?.capicoins ?? matchingStudent?.capicoins ?? 0,
    fase_atual:
      remoteProfile?.fase_atual ?? matchingStudent?.fase_atual ?? 0,
    streak_atual:
      remoteProfile?.streak_atual ?? matchingStudent?.streak_atual ?? 0,
    is_admin:
      remoteProfile?.is_admin ?? matchingStudent?.is_admin ?? false,
    created_at:
      remoteProfile?.created_at ||
      matchingStudent?.created_at ||
      firebaseUser.metadata.creationTime ||
      null,
    updated_at:
      remoteProfile?.updated_at || matchingStudent?.updated_at || null,
    profile_complete: hasRemoteProfile
      ? remoteProfile.profile_complete === true
      : (storedProfile?.profile_complete ??
        matchingStudent?.profile_complete ??
        false),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [profileSyncError, setProfileSyncError] = useState(null);
  const [trailProgress, setTrailProgress] = useState([]);
  const [trailLoading, setTrailLoading] = useState(false);
  const alunoRef = useRef(null);

  useEffect(() => {
    LEGACY_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
    let isObserverActive = true;
    let observerRevision = 0;

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        const currentRevision = ++observerRevision;
        setUser(firebaseUser);
        setAuthError(null);
        setProfileSyncError(null);

        if (!firebaseUser) {
          alunoRef.current = null;
          setAluno(null);
          setTrailProgress([]);
          setTrailLoading(false);
          setLoading(false);
          return;
        }

        const localSnapshot = createStudentSnapshot(
          firebaseUser,
          alunoRef.current,
        );
        alunoRef.current = localSnapshot;
        setAluno(localSnapshot);

        if (!isDataConnectEnabled) {
          setTrailProgress([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        setTrailLoading(true);

        async function loadRelationalProfile() {
          let remoteProfile = await fetchMyStudentProfile();
          let remoteProgress = [];

          // Migra automaticamente um perfil completo da Task 1.3.
          if (!remoteProfile && localSnapshot.profile_complete) {
            remoteProfile = await syncStudentProfile(localSnapshot);
          }

          if (remoteProfile) {
            remoteProgress = await fetchMyProgress();

            // Perfis anteriores à Task 3.2 começavam na Fase 1. Somente um
            // perfil sem histórico pode ser reiniciado no Passo 0.
            if (
              remoteProfile.fase_atual === 1 &&
              remoteProgress.length === 0
            ) {
              try {
                const initialized = await initializeLegacyTrail();
                if (initialized) {
                  [remoteProfile, remoteProgress] = await Promise.all([
                    fetchMyStudentProfile(),
                    fetchMyProgress(),
                  ]);
                }
              } catch (error) {
                // A aplicação continua utilizável enquanto o novo conector
                // ainda não foi implantado no ambiente remoto.
                console.warn(
                  'Não foi possível inicializar o Passo 0 no SQL Connect.',
                  error,
                );
              }
            }
          }

          if (
            !isObserverActive ||
            currentRevision !== observerRevision ||
            auth.currentUser?.uid !== firebaseUser.uid
          ) {
            return;
          }

          const synchronizedSnapshot = remoteProfile
            ? createStudentSnapshot(
                firebaseUser,
                localSnapshot,
                remoteProfile,
              )
            : localSnapshot;

          alunoRef.current = synchronizedSnapshot;
          setAluno(synchronizedSnapshot);
          setTrailProgress(remoteProgress);
        }

        loadRelationalProfile()
          .catch((error) => {
            if (
              !isObserverActive ||
              currentRevision !== observerRevision
            ) {
              return;
            }

            console.warn(
              'Não foi possível carregar o perfil no SQL Connect.',
              error,
            );
            setProfileSyncError(
              'O perfil relacional está temporariamente indisponível. Os dados locais foram mantidos.',
            );
            setTrailProgress([]);
          })
          .finally(() => {
            if (
              isObserverActive &&
              currentRevision === observerRevision
            ) {
              setLoading(false);
              setTrailLoading(false);
            }
          });
      },
      (error) => {
        observerRevision += 1;
        setUser(null);
        alunoRef.current = null;
        setAluno(null);
        setAuthError(error);
        setProfileSyncError(null);
        setTrailProgress([]);
        setTrailLoading(false);
        setLoading(false);
      },
    );

    return () => {
      isObserverActive = false;
      unsubscribe();
    };
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
      await updateProfile(firebaseUser, { displayName: nome });

      const localCandidate = {
        ...createStudentSnapshot(firebaseUser, alunoRef.current),
        nome,
        turma,
        avatar_id: avatarId,
        avatar_url: avatarUrl,
        profile_complete: true,
      };

      let remoteProfile = null;

      if (isDataConnectEnabled) {
        try {
          remoteProfile = await syncStudentProfile(localCandidate);
          setProfileSyncError(null);
        } catch (error) {
          console.warn(
            'Não foi possível salvar o perfil no SQL Connect.',
            error,
          );
          setProfileSyncError(
            'Não foi possível sincronizar o perfil com o banco de dados.',
          );
          throw new Error(
            'Não foi possível sincronizar o perfil. Confirme se o emulador SQL Connect está ativo e tente novamente.',
            { cause: error },
          );
        }
      }

      const completedProfile = {
        ...(remoteProfile
          ? createStudentSnapshot(
              firebaseUser,
              localCandidate,
              remoteProfile,
            )
          : localCandidate),
        nome,
        turma,
        avatar_id: avatarId,
        avatar_url: avatarUrl,
        profile_complete: true,
      };

      writeStoredProfile(firebaseUser.uid, completedProfile);
      alunoRef.current = completedProfile;
      setAluno(completedProfile);

      return completedProfile;
    },
    [],
  );

  const updateAluno = useCallback((data) => {
    setAluno((currentStudent) => {
      const updatedStudent = currentStudent
        ? { ...currentStudent, ...data }
        : currentStudent;
      alunoRef.current = updatedStudent;
      return updatedStudent;
    });
  }, []);

  const refreshTrailState = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || !isDataConnectEnabled) {
      return {
        profile: alunoRef.current,
        progress: [],
      };
    }

    setTrailLoading(true);

    try {
      const [remoteProfile, remoteProgress] = await Promise.all([
        fetchMyStudentProfile(),
        fetchMyProgress(),
      ]);
      const synchronizedSnapshot = remoteProfile
        ? createStudentSnapshot(
            firebaseUser,
            alunoRef.current,
            remoteProfile,
          )
        : alunoRef.current;

      alunoRef.current = synchronizedSnapshot;
      setAluno(synchronizedSnapshot);
      setTrailProgress(remoteProgress);
      setProfileSyncError(null);

      return {
        profile: synchronizedSnapshot,
        progress: remoteProgress,
      };
    } catch (error) {
      console.warn(
        'Não foi possível atualizar o progresso no SQL Connect.',
        error,
      );
      setProfileSyncError(
        'Não foi possível atualizar o progresso no banco de dados.',
      );
      throw error;
    } finally {
      setTrailLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      aluno,
      loading,
      authError,
      profileSyncError,
      trailProgress,
      trailLoading,
      dataConnectEnabled: isDataConnectEnabled,
      loginWithGoogle,
      logout,
      saveProfile,
      updateAluno,
      refreshTrailState,
    }),
    [
      user,
      aluno,
      loading,
      authError,
      profileSyncError,
      trailProgress,
      trailLoading,
      loginWithGoogle,
      logout,
      saveProfile,
      updateAluno,
      refreshTrailState,
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
