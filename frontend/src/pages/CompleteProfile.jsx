import Logout from '@mui/icons-material/Logout';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../contexts/AuthContext';
import { getHomePathForProfile } from '../lib/roleAccess';
import BrandIdentity from '../components/BrandIdentity';

export default function CompleteProfile() {
  const { aluno, saveProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination =
    location.state?.from?.pathname || getHomePathForProfile(aluno);

  const handleSubmit = async (profile) => {
    await saveProfile(profile);
    navigate(destination, { replace: true });
  };

  const handleChangeAccount = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#131f24] px-4 py-8 text-[#F8F8F8] sm:py-12">
      <div className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-[#58cc02]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-[#58cc02]/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <BrandIdentity
            className="mb-5 justify-center"
            markClassName="h-14 w-14"
            nameClassName="text-2xl"
          />
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#58cc02]">
            Primeiro Acesso
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-white">
            Complete seu Perfil
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#a5b7c2]">
            Personalize sua identidade e conecte sua conta à sua turma para começar na Trilha.
          </p>
        </header>

        <section className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[#58cc02]/30 bg-[#58cc02]/10 p-4">
            <VerifiedUserOutlined
              className="mt-0.5 shrink-0 text-[#58cc02]"
              sx={{ fontSize: 22 }}
            />
            <div>
              <p className="text-sm font-black text-[#58cc02]">
                Conta Google Verificada
              </p>
              <p className="mt-0.5 break-all text-xs text-[#a5b7c2]">
                {aluno?.email}
              </p>
            </div>
          </div>

          <ProfileForm
            initialProfile={aluno}
            onSubmit={handleSubmit}
            submitLabel="Concluir e Começar"
          />
        </section>

        <div className="mt-6 text-center">
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-[#a5b7c2] transition hover:text-rose-400 hover:bg-[#1f2d33] focus:outline-none focus:ring-2 focus:ring-rose-400"
            onClick={handleChangeAccount}
            type="button"
          >
            <Logout sx={{ fontSize: 16 }} />
            Entrar com outra conta
          </button>
        </div>

        <p className="mx-auto mt-4 max-w-xl text-center text-[11px] leading-relaxed text-[#78909c]">
          Seu progresso e CapiCoins ficam sincronizados com o Capi Bank com integridade auditável.
        </p>
      </div>
    </main>
  );
}
