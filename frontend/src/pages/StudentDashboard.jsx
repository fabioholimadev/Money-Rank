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
  HelpOutlined,
  Close
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { aluno, logout, loading } = useAuth();
  
  // Controle da tela flutuante (Modal)
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [stats, setStats] = useState({
    nome: '',
    capicoins: 0,
    fase_atual: 1,
    streak_atual: 0,
    avatar_url: null
  });

  useEffect(() => {
    if (aluno) {
      setStats({
        nome: aluno.nome || '',
        capicoins: aluno.capicoins || 0,
        fase_atual: aluno.fase_atual || 1,
        streak_atual: aluno.streak_atual || 0,
        avatar_url: aluno.avatar_url || null
      });
    }
  }, [aluno]);

  useEffect(() => {
    const fetchRealTimeStats = async () => {
      if (!aluno?.id) return;
      const { data, error } = await supabase
        .from('alunos')
        .select('nome, capicoins, fase_atual, streak_atual, avatar_url')
        .eq('id', aluno.id)
        .single();

      if (!error && data) {
        setStats(data);
      }
    };
    fetchRealTimeStats();
  }, [aluno?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/login');
  };

  if (loading || !aluno) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const statusCards = [
    { label: 'Saldo de CapiCoins', value: stats.capicoins, sub: 'Moeda oficial do Money Rank', icon: <MonetizationOn sx={{ fontSize: 28 }} />, color: 'text-amber-400' },
    { label: 'Fase Atual', value: stats.fase_atual, sub: 'Você está progredindo!', icon: <Map sx={{ fontSize: 28 }} />, color: 'text-amber-400' },
    { label: 'Dias Seguidos', value: stats.streak_atual, sub: 'Mantenha a sequência!', icon: <LocalFireDepartment sx={{ fontSize: 28 }} />, color: 'text-red-400' },
  ];

  const quickMenu = [
    { label: 'Explorar a Trilha', description: 'Avance nas missões e conquiste CapiCoins', icon: <Explore sx={{ fontSize: 32 }} />, route: '/trilha', accent: 'from-amber-400/20 to-amber-400/5 border-amber-400/30 hover:border-amber-400/60', iconColor: 'text-amber-400' },
    { label: 'Ver Ranking Global', description: 'Compare seu desempenho com a turma', icon: <EmojiEvents sx={{ fontSize: 32 }} />, route: '/ranking', accent: 'from-yellow-300/20 to-yellow-300/5 border-yellow-300/30 hover:border-yellow-300/60', iconColor: 'text-yellow-300' },
    { label: 'Meu Perfil', description: 'Veja suas conquistas e configurações', icon: <AccountCircle sx={{ fontSize: 32 }} />, route: '/perfil', accent: 'from-slate-400/20 to-slate-400/5 border-slate-400/30 hover:border-slate-400/60', iconColor: 'text-slate-300' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* ── Background Grid ──────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-4xl mx-auto px-5 py-8 flex flex-col gap-10">
        
        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">Painel do Aluno</span>
            <h1 className="text-3xl font-black tracking-tighter mt-0.5">MONEY<span className="text-amber-400">RANK</span></h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 text-sm font-semibold hover:border-red-500/50 hover:text-red-400 transition-all">
            <Logout sx={{ fontSize: 18 }} /> Sair
          </button>
        </header>

        {/* ── WELCOME BLOCK (Com Foto e Botão de Ajuda) ────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Foto do Aluno */}
            {stats.avatar_url ? (
              <img src={stats.avatar_url} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/50 shadow-lg shadow-amber-500/10" />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                <AccountCircle sx={{ fontSize: 40 }} className="text-slate-600" />
              </div>
            )}
            
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">
                Olá, {stats.nome} 👋
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Bem-vindo ao <span className="text-white font-semibold">laboratório prático de Educação Fiscal</span>.
                Complete missões, tome decisões e ajude sua turma a liderar o ranking!
              </p>
            </div>
          </div>

          {/* Botão Como Funciona */}
          <button 
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-2 px-4 py-3 shrink-0 rounded-xl bg-slate-800/50 border border-slate-700 text-amber-400 text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            <HelpOutlined sx={{ fontSize: 20 }} /> Como Funciona?
          </button>
        </section>

        {/* ── STATUS CARDS ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Sua Situação Atual</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statusCards.map((card) => (
              <div key={card.label} className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
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
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickMenu.map((item) => (
              <button key={item.route} onClick={() => navigate(item.route)} className={`bg-gradient-to-br ${item.accent} border rounded-3xl p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group`}>
                <span className={`${item.iconColor} mb-4 block`}>{item.icon}</span>
                <p className="text-white font-black text-base mb-1">{item.label}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ── MODAL COMO FUNCIONA ────────────────────────────────────────────── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl shadow-amber-500/10">
            
            <button 
              onClick={() => setShowHelpModal(false)} 
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
            >
              <Close />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
            <HelpOutlined sx={{ fontSize: 32, color: '#fbbf24' }} />
              <h2 className="text-2xl font-black text-white">Como Funciona?</h2>
            </div>
            
            <div className="space-y-5 text-slate-300 text-sm leading-relaxed">
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🪙</span>
                <div>
                  <strong className="text-amber-400 block mb-0.5">CapiCoins</strong>
                  É a moeda oficial do jogo. Você ganha resolvendo Quizzes, assistindo aulas e tomando boas decisões financeiras.
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🔥</span>
                <div>
                  <strong className="text-red-400 block mb-0.5">Dias Seguidos (Streak)</strong>
                  Entre no sistema todos os dias para aumentar seu Streak. Streaks altos multiplicam os CapiCoins que você ganha nas missões!
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-2xl">🏆</span>
                <div>
                  <strong className="text-yellow-300 block mb-0.5">Ranking & Equipes</strong>
                  Suas moedas somam pontos para você no ranking individual e para a sua Turma no ranking de equipes. Lidere o placar!
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-8 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-3 rounded-xl transition-colors"
            >
              Entendi, vamos jogar!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}