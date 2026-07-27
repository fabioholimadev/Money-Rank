import Logout from '@mui/icons-material/Logout';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../contexts/AuthContext';

export default function CompleteProfile() {
  const { aluno, saveProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.from?.pathname || '/student';

  const handleSubmit = async (profile) => {
    await saveProfile(profile);
    navigate(destination, { replace: true });
  };

  const handleChangeAccount = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:py-12">
      <div className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 font-black text-slate-950 shadow-lg shadow-amber-400/20">
            MR
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            Primeiro acesso
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Complete seu perfil
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Só precisamos de três informações para personalizar sua jornada e
            conectar você à sua turma.
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <VerifiedUserOutlined
              className="mt-0.5 shrink-0 text-emerald-400"
              sx={{ fontSize: 21 }}
            />
            <div>
              <p className="text-sm font-bold text-emerald-300">
                Conta Google verificada
              </p>
              <p className="mt-1 break-all text-xs text-slate-500">
                {aluno?.email}
              </p>
            </div>
          </div>

          <ProfileForm
            initialProfile={aluno}
            onSubmit={handleSubmit}
            submitLabel="Concluir e começar"
          />
        </section>

        <button
          className="mx-auto mt-5 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleChangeAccount}
          type="button"
        >
          <Logout sx={{ fontSize: 16 }} />
          Entrar com outra conta
        </button>

        <p className="mx-auto mt-4 max-w-xl text-center text-[11px] leading-relaxed text-slate-600">
          Nesta etapa de migração, turma, Capi ou foto ficam neste dispositivo.
          A sincronização entre dispositivos será adicionada com o Firebase SQL
          Connect.
        </p>
      </div>
    </main>
  );
}
