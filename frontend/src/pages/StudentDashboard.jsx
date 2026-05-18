import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    // Ler dados do aluno do localStorage
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

  if (!aluno) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter">
            MONEY<span className="text-green-400">RANK</span>
          </h1>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
        <p className="text-slate-400 mt-2">Bem-vindo, {aluno.nome}! 🎮</p>
      </div>

      {/* Cards Dashboard */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card: CapiCoins */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-green-500/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold text-sm">Saldo de CapiCoins</h3>
            <span className="text-3xl">🪙</span>
          </div>
          <p className="text-5xl font-black text-green-400">
            {aluno.capicoins || 0}
          </p>
          <p className="text-slate-500 text-xs mt-4">Moeda oficial do Money Rank</p>
        </div>

        {/* Card: Fase Atual */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-blue-500/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold text-sm">Fase Atual</h3>
            <span className="text-3xl">🗺️</span>
          </div>
          <p className="text-5xl font-black text-blue-400">
            {aluno.fase_atual || 1}
          </p>
          <p className="text-slate-500 text-xs mt-4">Você está progredindo! 🚀</p>
        </div>

        {/* Card: Streak */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-red-500/30 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-semibold text-sm">Dias Seguidos</h3>
            <span className="text-3xl">🔥</span>
          </div>
          <p className="text-5xl font-black text-red-400">
            {aluno.streak_atual || 1}
          </p>
          <p className="text-slate-500 text-xs mt-4">Mantenha a sequência!</p>
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="max-w-4xl mx-auto flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate('/trilha')}
          className="bg-green-500 hover:bg-green-400 text-slate-900 font-extrabold py-3 px-8 rounded-xl shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          🗺️ Ir para a Trilha
        </button>
        <button
          onClick={() => navigate('/ranking')}
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-extrabold py-3 px-8 rounded-xl shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          🏆 Ver Ranking
        </button>
      </div>
    </div>
  );
}