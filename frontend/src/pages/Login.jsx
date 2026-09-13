import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoadingState } from '../components/ui/DesignSystem';
import { useAuth } from '../contexts/AuthContext';
import { getHomePathForProfile } from '../lib/roleAccess';

const AUTH_ERROR_MESSAGES = {
  'auth/cancelled-popup-request': 'Já existe uma tentativa de login em andamento.',
  'auth/network-request-failed': 'Não foi possível conectar ao Google. Verifique sua internet.',
  'auth/operation-not-allowed': 'O login com Google ainda não foi habilitado no Firebase.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.',
  'auth/popup-closed-by-user': 'A janela de login foi fechada antes da conclusão.',
  'auth/unauthorized-domain': 'Este endereço não está autorizado no Firebase Authentication.',
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M21.35 12.21c0-.72-.06-1.25-.2-1.8H12v3.4h5.37a4.6 4.6 0 0 1-1.99 3.02v2.2h3.22c1.88-1.73 2.75-4.29 2.75-6.82Z" />
      <path fill="#34A853" d="M12 21.7c2.7 0 4.96-.9 6.6-2.67l-3.22-2.2c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.6-4.12H3.08v2.27A9.97 9.97 0 0 0 12 21.7Z" />
      <path fill="#FBBC05" d="M6.4 13.67A6 6 0 0 1 6.08 12c0-.58.1-1.14.31-1.67V8.06H3.08A9.98 9.98 0 0 0 2 12c0 1.43.38 2.77 1.08 3.94l3.32-2.27Z" />
      <path fill="#EA4335" d="M12 6.21c1.47 0 2.78.5 3.82 1.49l2.85-2.86A9.57 9.57 0 0 0 12 2.3a9.97 9.97 0 0 0-8.92 5.76l3.32 2.27A5.99 5.99 0 0 1 12 6.21Z" />
    </svg>
  );
}

export default function Login() {
  const { user, aluno, loading, loginWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const destination = location.state?.from?.pathname || getHomePathForProfile(aluno);

  if (loading) return <main className="min-h-screen bg-[#131f24]"><LoadingState label="Verificando sua conta..." /></main>;
  if (user) return <Navigate to={destination} replace />;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(AUTH_ERROR_MESSAGES[error?.code] || 'Não foi possível entrar com o Google. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#131f24] p-4 sm:p-7">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[1.5rem] border-2 border-[#37464f] bg-[#17262c] lg:grid-cols-[1.08fr_0.92fr] sm:min-h-[calc(100vh-3.5rem)]">
        <section className="relative hidden overflow-hidden border-r-2 border-[#37464f] bg-[#1f2d33] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-[#58cc02]/10 blur-3xl" aria-hidden="true" />
          <Link to="/" className="relative flex items-center gap-3 text-xl font-black text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#58cc02] text-sm text-[#13210f] shadow-[0_5px_0_#46a302]">MR</span>
            MONEY<span className="-ml-2 text-[#58cc02]">RANK</span>
          </Link>

          <div className="relative grid grid-cols-[180px_1fr] items-center gap-8">
            <img src="/avatars/capi-mentor.jpg" alt="Capi, mentora da Money Rank" className="aspect-square w-full rounded-[2rem] border-4 border-[#58cc02] object-cover shadow-[0_8px_0_#46a302]" />
            <div>
              <p className="mr-eyebrow">Sua jornada começa aqui</p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-white">Aprenda tomando decisões.</h1>
              <p className="mt-4 font-semibold leading-7 text-[#a5b7c2]">Trilhas curtas, desafios práticos e progresso visível para entender finanças e cidadania fiscal.</p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              [AutoStoriesRounded, 'Trilhas'],
              [CheckCircleRounded, 'Desafios'],
              [EmojiEventsRounded, 'Progresso'],
            ].map(([Icon, label]) => (
              <div key={label} className="rounded-2xl border-2 border-[#37464f] bg-[#17262c] p-4 text-center">
                <Icon className="text-[#58cc02]" />
                <p className="mt-2 text-xs font-black uppercase tracking-wide text-white">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div className="mb-9 flex items-center gap-3 lg:hidden">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#58cc02] text-sm font-black text-[#13210f] shadow-[0_4px_0_#46a302]">MR</span>
              <span className="text-xl font-black text-white">MONEY<span className="text-[#58cc02]">RANK</span></span>
            </div>
            <p className="mr-eyebrow">Bem-vindo de volta</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Continue sua evolução</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#a5b7c2]">Entre com sua conta Google institucional para acessar sua trilha ou acompanhar sua turma.</p>

            {errorMessage && <div className="mt-6 rounded-2xl border-2 border-[#ff4b4b] bg-[#ff4b4b]/10 p-4 text-sm font-bold text-[#ffb4b4]" role="alert">{errorMessage}</div>}

            <button type="button" disabled={isSubmitting} onClick={handleGoogleLogin} className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#37464f] bg-white px-5 font-black text-[#17262c] shadow-[0_5px_0_#9daeb6] transition active:translate-y-1 active:shadow-[0_1px_0_#9daeb6] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#a5b7c2] border-t-[#17262c]" /> : <GoogleIcon />}
              {isSubmitting ? 'Conectando...' : 'Continuar com o Google'}
            </button>

            <p className="mt-5 text-center text-xs font-semibold text-[#78909b]">Sua senha do Google nunca é recebida ou armazenada pela Money Rank.</p>
            <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-sm font-black text-[#49c0f8]">
              <ArrowBackRounded sx={{ fontSize: 18 }} /> Voltar para o início
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
