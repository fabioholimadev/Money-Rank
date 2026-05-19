import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MonetizationOn,
  Map,
  LocalFireDepartment,
  Logout,
  Explore,
  EmojiEvents,
  AccountCircle,
} from '@mui/icons-material';

// ─── Logout via backend token (não usa Supabase diretamente no frontend) ───────
// O projeto usa autenticação via backend Express + JWT no localStorage.
// O "logout" consiste em apagar o token local e redirecionar para /login.
// Não há supabase.auth.signOut() disponível no frontend pois o cliente
// Supabase não é instanciado aqui — as chaves ficam apenas no backend.
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    const alunoData = localStorage.getItem('aluno');
    if (alunoData) {
      try {
        setAluno(JSON.parse(alunoData));
      } catch (err) {
        console.error('Erro ao parsear dados do aluno:', err);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (!aluno) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  // ── Status cards data ────────────────────────────────────────────────────────
  const statusCards = [
    {
      label: 'Saldo de CapiCoins',
      value: aluno.capicoins ?? 0,
      sub: 'Moeda oficial do Money Rank',
      icon: <MonetizationOn sx={{ fontSize: 28 }} />,
      color: 'text-amber-400',
    },
    {
      label: 'Fase Atual',
      value: aluno.fase_atual ?? 1,
      sub: 'Você está progredindo!',
      icon: <Map sx={{ fontSize: 28 }} />,
      color: 'text-amber-400',
    },
    {
      label: 'Dias Seguidos',
      value: aluno.streak_atual ?? 1,
      sub: 'Mantenha a sequência!',
      icon: <LocalFireDepartment sx={{ fontSize: 28 }} />,
      color: 'text-red-400',
    },
  ];

  // ── Quick access menu data ───────────────────────────────────────────────────
  const quickMenu = [
    {
      label: 'Explorar a Trilha',
      description: 'Avance nas missões e conquiste CapiCoins',
      icon: <Explore sx={{ fontSize: 32 }} />,
      route: '/trilha',
      accent: 'from-amber-400/20 to-amber-400/5 border-amber-400/30 hover:border-amber-400/60',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Ver Ranking Global',
      description: 'Compare seu desempenho com a turma',
      icon: <EmojiEvents sx={{ fontSize: 32 }} />,
      route: '/ranking',
      accent: 'from-yellow-300/20 to-yellow-300/5 border-yellow-300/30 hover:border-yellow-300/60',
      iconColor: 'text-yellow-300',
    },
    {
      label: 'Meu Perfil',
      description: 'Veja suas conquistas e configurações',
      icon: <AccountCircle sx={{ fontSize: 32 }} />,
      route: '/perfil',
      accent: 'from-slate-400/20 to-slate-400/5 border-slate-400/30 hover:border-slate-400/60',
      iconColor: 'text-slate-300',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ── Subtle grid background ──────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-5 py-8 flex flex-col gap-10">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
              Painel do Aluno
            </span>
            <h1 className="text-3xl font-black tracking-tighter mt-0.5">
              MONEY<span className="text-amber-400">RANK</span>
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 text-sm font-semibold hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <Logout sx={{ fontSize: 18 }} />
            Sair
          </button>
        </header>

        {/* ── WELCOME BLOCK ─────────────────────────────────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3">
            Olá, {aluno.nome} 👋
          </p>
          <p className="text-slate-300 text-base leading-relaxed max-w-xl">
            Bem-vindo ao <span className="text-white font-semibold">laboratório prático de Educação Fiscal</span>.
            Complete missões, tome decisões financeiras e ajude sua turma a liderar o ranking!
          </p>
        </section>

        {/* ── STATUS CARDS ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
            Sua Situação Atual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statusCards.map((card) => (
              <div
                key={card.label}
                className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-xs font-semibold">{card.label}</span>
                  <span className={card.color}>{card.icon}</span>
                </div>
                <p className={`text-4xl font-black ${card.color}`}>{card.value}</p>
                <p className="text-slate-500 text-xs mt-3">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK ACCESS MENU ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickMenu.map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`bg-gradient-to-br ${item.accent} border rounded-3xl p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group`}
              >
                <span className={`${item.iconColor} mb-4 block`}>{item.icon}</span>
                <p className="text-white font-black text-base mb-1">{item.label}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}