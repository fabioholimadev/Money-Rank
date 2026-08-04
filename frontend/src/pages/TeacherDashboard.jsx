import {
  AnalyticsOutlined,
  GroupsOutlined,
  Logout,
  SecurityOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NEXT_MODULES = [
  {
    Icon: GroupsOutlined,
    title: 'Participação das turmas',
    description:
      'A comparação autorizada entre 3º DSA e 3º DSB será entregue na Task 5.2.',
  },
  {
    Icon: AnalyticsOutlined,
    title: 'Dificuldades e progresso',
    description:
      'Tentativas, erros e avanço por fase serão agregados sem expor dados desnecessários.',
  },
];

export default function TeacherDashboard() {
  const { aluno, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-400">
              Money Rank · Área pedagógica
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Painel do Professor
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Olá, {aluno?.nome}. Seu acesso de professor foi confirmado pelo
              Capi Bank.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-bold text-slate-300 transition hover:border-red-400/60 hover:text-red-300"
          >
            <Logout sx={{ fontSize: 18 }} aria-hidden="true" />
            Sair
          </button>
        </header>

        <section className="mt-8 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <SecurityOutlined sx={{ fontSize: 28 }} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-black">Acesso protegido ativo</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Contas de estudante são redirecionadas para a área do aluno.
                O papel de professor vem do banco e não pode ser escolhido no
                navegador.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
            Próxima entrega · Task 5.2
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {NEXT_MODULES.map(({ Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <Icon className="text-amber-400" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
