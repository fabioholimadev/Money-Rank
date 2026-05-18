import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Ranking() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/game/leaderboard');
        const data = await response.json();

        if (!response.ok) {
          setErrorMsg(data.error || 'Erro ao buscar ranking.');
        } else {
          setLeaderboard(data.leaderboard || []);
        }
      } catch (err) {
        console.error('Erro ao buscar leaderboard:', err);
        setErrorMsg('Não foi possível conectar ao servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          🏆 RANKING GERAL
        </h1>
        <p className="text-slate-400">Os melhores jogadores do Money Rank</p>
      </div>

      {/* Erro */}
      {errorMsg && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Tabela de Ranking */}
      <div className="max-w-4xl mx-auto">
        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                    Posição
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                    Jogador
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">
                    Fase
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-green-400">
                    CapiCoins
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((jogador, index) => {
                  let posicaoEstilo = '';
                  let icone = '';

                  if (index === 0) {
                    posicaoEstilo = 'bg-yellow-500/20 text-yellow-400';
                    icone = '🥇';
                  } else if (index === 1) {
                    posicaoEstilo = 'bg-slate-500/20 text-slate-300';
                    icone = '🥈';
                  } else if (index === 2) {
                    posicaoEstilo = 'bg-orange-500/20 text-orange-400';
                    icone = '🥉';
                  } else {
                    posicaoEstilo = 'text-slate-400';
                    icone = '';
                  }

                  return (
                    <tr
                      key={jogador.id}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Posição */}
                      <td
                        className={`px-6 py-4 font-bold text-lg ${posicaoEstilo}`}
                      >
                        {icone} {jogador.posicao}º
                      </td>

                      {/* Nome do Jogador */}
                      <td className="px-6 py-4 font-semibold text-white">
                        {jogador.nome}
                      </td>

                      {/* Fase Atual */}
                      <td className="px-6 py-4 text-center text-blue-400 font-bold">
                        {jogador.fase_atual || 1}
                      </td>

                      {/* CapiCoins */}
                      <td className="px-6 py-4 text-right font-bold text-green-400 text-lg">
                        🪙 {jogador.capicoins || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">
              Nenhum jogador registrado ainda. Seja o primeiro! 🎮
            </p>
          </div>
        )}
      </div>

      {/* Botão Voltar */}
      <div className="max-w-4xl mx-auto mt-10 flex justify-center">
        <button
          onClick={() => navigate('/student')}
          className="bg-green-500 hover:bg-green-400 text-slate-900 font-extrabold py-3 px-12 rounded-xl shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none transition-all"
        >
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
