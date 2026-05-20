import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// ─── Inline SVG icon primitives (zero external deps) ─────────────────────────
const Icon = ({ children, size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block flex-shrink-0 ${className}`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

// Coin / CapiCoins
const IconCoin = ({ size, className }) => (
  <Icon size={size} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v2m0 8v2M9 9.5c0-1 1.5-1.5 3-1.5s3 .5 3 1.5-1.5 2-3 2-3 .5-3 1.5 1.5 1.5 3 1.5 3-.5 3-1.5" />
  </Icon>
);

// Map / phase
const IconMap = ({ size, className }) => (
  <Icon size={size} className={className}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </Icon>
);

// Flame / streak
const IconFlame = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </Icon>
);

// Logout
const IconLogout = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

// Compass / Explore
const IconCompass = ({ size, className }) => (
  <Icon size={size} className={className}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </Icon>
);

// Trophy / Ranking
const IconTrophy = ({ size, className }) => (
  <Icon size={size} className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </Icon>
);

// User / Profile
const IconUser = ({ size, className }) => (
  <Icon size={size} className={className}>
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </Icon>
);

// Help circle
const IconHelp = ({ size, className }) => (
  <Icon size={size} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </Icon>
);

// X / Close
const IconX = ({ size, className }) => (
  <Icon size={size} className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

// ─── Multiplier table data ─────────────────────────────────────────────────────
const MULTIPLIERS = [
  { days: 2, bonus: '+10%', label: '2 dias seguidos' },
  { days: 3, bonus: '+20%', label: '3 dias seguidos' },
  { days: 4, bonus: '+30%', label: '4 dias seguidos' },
  { days: 5, bonus: '+40%', label: '5 dias seguidos' },
  { days: 7, bonus: '+50%', label: '7 dias seguidos' },
];

// ─── Which multiplier tier is active for a given streak ───────────────────────
function getActiveMultiplier(streak) {
  const eligible = MULTIPLIERS.filter((m) => streak >= m.days);
  return eligible.length > 0 ? eligible[eligible.length - 1] : null;
}

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [aluno,     setAluno]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ── Fetch profile from Supabase, fall back to localStorage ──────────────────
  const fetchAluno = useCallback(async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? JSON.parse(localStorage.getItem('aluno') ?? 'null')?.id;

    if (!userId) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('alunos')
      .select('id, nome, email, turma, capicoins, streak_atual, avatar_url, fase_atual')
      .eq('id', userId)
      .single();

    if (error || !data) {
      const cached = localStorage.getItem('aluno');
      if (cached) {
        try { setAluno(JSON.parse(cached)); } catch (_) { navigate('/login'); }
      } else {
        navigate('/login');
      }
    } else {
      setAluno(data);
      localStorage.setItem('aluno', JSON.stringify(data));
    }

    setLoading(false);
  }, [navigate]);

  useEffect(() => { fetchAluno(); }, [fetchAluno]);

  // ── Close modal on Escape key ────────────────────────────────────────────────
  useEffect(() => {
    if (!showModal) return;
    const handler = (e) => { if (e.key === 'Escape') setShowModal(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showModal]);

  // ── Prevent body scroll when modal is open ───────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (loading || !aluno) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  const streak      = aluno.streak_atual ?? 0;
  const capicoins   = aluno.capicoins    ?? 0;
  const activeMulti = getActiveMultiplier(streak);

  const statusCards = [
    {
      label:  'CapiCoins',
      value:  capicoins.toLocaleString('pt-BR'),
      sub:    'Moeda oficial do Money Rank',
      icon:   <IconCoin size={24} />,
      color:  'text-amber-400',
      bg:     'from-amber-400/10 to-amber-400/0',
      border: 'border-amber-400/20',
    },
    {
      label:  'Fase Atual',
      value:  aluno.fase_atual ?? 1,
      sub:    'Continue progredindo!',
      icon:   <IconMap size={24} />,
      color:  'text-amber-400',
      bg:     'from-amber-400/10 to-amber-400/0',
      border: 'border-amber-400/20',
    },
    {
      label:  'Dias Seguidos 🔥',
      value:  streak,
      sub:    activeMulti ? `Bônus ativo: ${activeMulti.bonus} nas moedas!` : 'Complete uma atividade hoje!',
      icon:   <IconFlame size={24} />,
      color:  streak >= 3 ? 'text-orange-400' : 'text-red-400',
      bg:     streak >= 3 ? 'from-orange-400/10 to-orange-400/0' : 'from-red-400/10 to-red-400/0',
      border: streak >= 3 ? 'border-orange-400/20' : 'border-red-400/20',
    },
  ];

  const quickMenu = [
    {
      label:       'Explorar a Trilha',
      description: 'Avance nas missões e conquiste CapiCoins',
      icon:        <IconCompass size={28} />,
      route:       '/trilha',
      accent:      'from-amber-400/15 to-amber-400/0 border-amber-400/25 hover:border-amber-400/55',
      iconColor:   'text-amber-400',
    },
    {
      label:       'Ver Ranking Global',
      description: 'Compare seu desempenho com a turma',
      icon:        <IconTrophy size={28} />,
      route:       '/ranking',
      accent:      'from-yellow-300/15 to-yellow-300/0 border-yellow-300/25 hover:border-yellow-300/55',
      iconColor:   'text-yellow-300',
    },
    {
      label:       'Meu Perfil',
      description: 'Veja suas conquistas e configurações',
      icon:        <IconUser size={28} />,
      route:       '/perfil',
      accent:      'from-slate-400/15 to-slate-400/0 border-slate-400/25 hover:border-slate-400/55',
      iconColor:   'text-slate-300',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Background grid ──────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-5 py-8 flex flex-col gap-10">

        {/* ── HEADER ───────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            {aluno.avatar_url ? (
              <img
                src={aluno.avatar_url}
                alt={aluno.nome}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40 flex-shrink-0 shadow-lg shadow-amber-500/10"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <IconUser size={30} className="text-slate-500" />
              </div>
            )}

            {/* Name + brand */}
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
                Painel do Aluno
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter mt-0.5 truncate">
                MONEY<span className="text-amber-400">RANK</span>
              </h1>
            </div>
          </div>

          {/* Coin + streak pills — desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20">
              <IconCoin size={15} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-black">{capicoins.toLocaleString('pt-BR')}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              streak >= 3 ? 'bg-orange-400/10 border-orange-400/20' : 'bg-red-400/10 border-red-400/20'
            }`}>
              <span className="text-base leading-none">🔥</span>
              <span className={`text-sm font-black ${streak >= 3 ? 'text-orange-400' : 'text-red-400'}`}>
                {streak}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 text-sm font-semibold hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all flex-shrink-0"
          >
            <IconLogout size={17} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </header>

        {/* ── WELCOME BLOCK ────────────────────────────────────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3">
                Olá, {aluno.nome} 👋
              </p>
              <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                Bem-vindo ao{' '}
                <span className="text-white font-semibold">laboratório prático de Educação Fiscal</span>.
                Complete missões, tome decisões financeiras e ajude sua turma a liderar o ranking!
              </p>
              {/* Mobile coin/streak pills */}
              <div className="flex sm:hidden items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20">
                  <IconCoin size={15} className="text-amber-400" />
                  <span className="text-amber-400 text-sm font-black">{capicoins.toLocaleString('pt-BR')}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                  streak >= 3 ? 'bg-orange-400/10 border-orange-400/20' : 'bg-red-400/10 border-red-400/20'
                }`}>
                  <span className="text-sm leading-none">🔥</span>
                  <span className={`text-sm font-black ${streak >= 3 ? 'text-orange-400' : 'text-red-400'}`}>
                    {streak}
                  </span>
                </div>
              </div>
            </div>

            {/* "Como funciona" button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 self-start px-4 py-2.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 text-sm font-bold hover:bg-amber-400/20 hover:border-amber-400/50 transition-all flex-shrink-0"
            >
              <IconHelp size={17} />
              Como o jogo funciona?
            </button>
          </div>
        </section>

        {/* ── STATUS CARDS ──────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
            Sua Situação Atual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statusCards.map((card) => (
              <div
                key={card.label}
                className={`bg-gradient-to-br ${card.bg} border ${card.border} bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 hover:shadow-lg transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-xs font-semibold">{card.label}</span>
                  <span className={card.color}>{card.icon}</span>
                </div>
                <p className={`text-4xl font-black ${card.color}`}>{card.value}</p>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK ACCESS MENU ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickMenu.map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`bg-gradient-to-br ${item.accent} border rounded-3xl p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className={`${item.iconColor} mb-4 block`}>{item.icon}</span>
                <p className="text-white font-black text-base mb-1">{item.label}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── GAMIFICATION MODAL ──────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-xl bg-slate-900 border border-slate-700 rounded-t-[32px] sm:rounded-[32px] shadow-2xl shadow-amber-500/10 max-h-[92dvh] overflow-y-auto">

            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-4 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            {/* Modal header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 sm:pt-7 sm:px-8 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
                  Guia do Jogador
                </span>
                <h2 id="modal-title" className="text-2xl font-black mt-1">
                  Como o jogo funciona?
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 mt-1 flex-shrink-0 p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                aria-label="Fechar modal"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 sm:px-8 py-6 space-y-7">

              {/* ── Block 1: CapiCoins ─────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                    <IconCoin size={19} className="text-amber-400" />
                  </div>
                  <h3 className="font-black text-white text-lg">CapiCoins</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed pl-12">
                  Cada atividade concluída na Trilha te recompensa com{' '}
                  <span className="text-amber-400 font-semibold">CapiCoins</span> — a moeda oficial
                  do Money Rank. Quanto mais atividades você completar, mais moedas acumula e mais
                  alto você sobe no ranking da sua turma.
                </p>
              </div>

              <div className="border-t border-slate-800" />

              {/* ── Block 2: Streak ───────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-400/15 border border-orange-400/30 flex items-center justify-center flex-shrink-0">
                    <IconFlame size={19} className="text-orange-400" />
                  </div>
                  <h3 className="font-black text-white text-lg">Foguinho de Sequência 🔥</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed pl-12">
                  Ao concluir a{' '}
                  <span className="text-white font-semibold">primeira atividade do dia</span>, seu
                  Foguinho aumenta automaticamente em +1. Cada dia seguido eleva seu multiplicador
                  de recompensas.{' '}
                  <span className="text-red-400 font-semibold">
                    Se você pular um dia, o Foguinho volta a zero
                  </span>{' '}
                  — então mantenha a chama acesa!
                </p>
              </div>

              <div className="border-t border-slate-800" />

              {/* ── Block 3: Multiplier table ─────────────────────────────── */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-yellow-300/15 border border-yellow-300/30 flex items-center justify-center flex-shrink-0">
                    <IconTrophy size={19} className="text-yellow-300" />
                  </div>
                  <h3 className="font-black text-white text-lg">Multiplicadores de Recompensa</h3>
                </div>

                <div className="pl-12 space-y-2">
                  {MULTIPLIERS.map((m) => {
                    const isActive = streak >= m.days;
                    return (
                      <div
                        key={m.days}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 border transition-all ${
                          isActive
                            ? 'bg-amber-400/10 border-amber-400/30'
                            : 'bg-slate-950/50 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base">{isActive ? '🔥' : '○'}</span>
                          <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                            {m.label}
                          </span>
                        </div>
                        <span className={`text-sm font-black tabular-nums ${
                          isActive ? 'text-amber-400' : 'text-slate-600'
                        }`}>
                          {m.bonus} moedas
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Current status callout */}
                {activeMulti ? (
                  <div className="mt-4 pl-12">
                    <p className="text-xs text-amber-400 font-semibold">
                      ✓ Seu multiplicador atual:{' '}
                      <span className="text-amber-300">{activeMulti.bonus}</span> em todas as atividades!
                    </p>
                  </div>
                ) : streak > 0 ? (
                  <div className="mt-4 pl-12">
                    <p className="text-xs text-slate-400">
                      Falta{' '}
                      <span className="text-white font-semibold">
                        {2 - streak} dia{2 - streak > 1 ? 's' : ''}
                      </span>{' '}
                      para desbloquear seu primeiro bônus!
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 sm:px-8 pb-7 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-2xl bg-amber-400 py-3 text-sm font-black uppercase text-slate-950 hover:bg-amber-300 active:scale-[0.98] transition-all"
              >
                Entendi!
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}