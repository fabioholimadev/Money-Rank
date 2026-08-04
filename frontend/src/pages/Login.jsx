import { useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getHomePathForProfile } from '../lib/roleAccess';

const AUTH_ERROR_MESSAGES = {
  'auth/cancelled-popup-request':
    'Já existe uma tentativa de login em andamento.',
  'auth/network-request-failed':
    'Não foi possível conectar ao Google. Verifique sua internet.',
  'auth/operation-not-allowed':
    'O login com Google ainda não foi habilitado no Firebase.',
  'auth/popup-blocked':
    'O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.',
  'auth/popup-closed-by-user':
    'A janela de login foi fechada antes da conclusão.',
  'auth/unauthorized-domain':
    'Este endereço não está autorizado no Firebase Authentication.',
};

function getAuthErrorMessage(error) {
  return (
    AUTH_ERROR_MESSAGES[error?.code] ||
    'Não foi possível entrar com o Google. Tente novamente.'
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.21c0-.72-.06-1.25-.2-1.8H12v3.4h5.37a4.6 4.6 0 0 1-1.99 3.02v2.2h3.22c1.88-1.73 2.75-4.29 2.75-6.82Z"
      />
      <path
        fill="#34A853"
        d="M12 21.7c2.7 0 4.96-.9 6.6-2.67l-3.22-2.2c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.6-4.12H3.08v2.27A9.97 9.97 0 0 0 12 21.7Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.67A6 6 0 0 1 6.08 12c0-.58.1-1.14.31-1.67V8.06H3.08A9.98 9.98 0 0 0 2 12c0 1.43.38 2.77 1.08 3.94l3.32-2.27Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.21c1.47 0 2.78.5 3.82 1.49l2.85-2.86A9.57 9.57 0 0 0 12 2.3a9.97 9.97 0 0 0-8.92 5.76l3.32 2.27A5.99 5.99 0 0 1 12 6.21Z"
      />
    </svg>
  );
}

export default function Login() {
  const { user, aluno, loading, loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const destination =
    location.state?.from?.pathname || getHomePathForProfile(aluno);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div
          aria-label="Verificando autenticação"
          className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"
          role="status"
        />
      </main>
    );
  }

  if (user) {
    return <Navigate to={destination} replace />;
  }

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await loginWithGoogle();
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 text-center shadow-2xl shadow-amber-500/10 backdrop-blur-sm sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-xl font-black text-slate-950 shadow-lg shadow-amber-400/20">
          MR
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
          Money Rank
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
          Aprenda. Jogue. Evolua.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Entre com sua conta Google institucional para continuar sua jornada
          de educação financeira.
        </p>

        {errorMessage && (
          <div
            className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left text-sm text-red-300"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <button
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-bold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          onClick={handleGoogleLogin}
          type="button"
        >
          {isSubmitting ? (
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900"
            />
          ) : (
            <GoogleIcon />
          )}
          {isSubmitting ? 'Conectando com o Google…' : 'Continuar com o Google'}
        </button>

        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          O Money Rank não armazena sua senha do Google.
        </p>

        <Link
          className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-amber-400"
          to="/"
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Voltar para o início
        </Link>
      </section>
    </main>
  );
}
