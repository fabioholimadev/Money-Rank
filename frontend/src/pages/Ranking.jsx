import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaderboard, MonetizationOn } from '@mui/icons-material';

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white text-lg">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3">
          <Leaderboard sx={{ fontSize: 40, color: '#fbbf24' }} />
          RANKING GERAL
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
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-lg shadow-amber-500/5">
            <table className="w-full">
              <thead className="bg-linear-to-r from-slate-900/80 to-slate-900/60 border-b border-zinc-800">
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
                  <th className="px-6 py-4 text-right text-sm font-bold text-amber-400">
                    CapiCoins
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {leaderboard.map((jogador, index) => {
                  let posicaoEstilo = '';
                  let medalhaColor = '';

                  if (index === 0) {
                    posicaoEstilo = 'bg-amber-500/20 text-amber-400';
                    medalhaColor = '#fbbf24';
                  } else if (index === 1) {
                    posicaoEstilo = 'bg-slate-500/20 text-slate-300';
                    medalhaColor = '#cbd5e1';
                  } else if (index === 2) {
                    posicaoEstilo = 'bg-orange-500/20 text-orange-400';
                    medalhaColor = '#ea580c';
                  } else {
                    posicaoEstilo = 'text-slate-400';
                  }

                  return (
                    <tr
                      key={jogador.id}
                      className="border-b border-zinc-800 hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Posição */}
                      <td className={`px-6 py-4 font-bold text-lg ${posicaoEstilo}`}>
                        {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'} {jogador.posicao}º
                      </td>

                      {/* Nome do Jogador */}
                      <td className="px-6 py-4 font-semibold text-white">
                        {jogador.nome}
                      </td>

                      {/* Fase Atual */}
                      <td className="px-6 py-4 text-center text-amber-400 font-bold">
                        {jogador.fase_atual || 1}
                      </td>

                      {/* CapiCoins */}
                      <td className="px-6 py-4 text-right font-bold text-amber-400 text-lg flex items-center justify-end gap-2">
                        <MonetizationOn sx={{ fontSize: 20 }} />
                        {jogador.capicoins || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-12 text-center shadow-lg shadow-amber-500/5">
            <p className="text-slate-400 text-lg">
              Nenhum jogador registrado ainda. Seja o primeiro!
            </p>
          </div>
        )}
      </div>

      {/* Botão Voltar */}
      <div className="max-w-4xl mx-auto mt-10 flex justify-center">
        <button
          onClick={() => navigate('/student')}
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-3 px-12 rounded-2xl shadow-lg shadow-amber-400/20 active:translate-y-1 active:shadow-md transition-all"
        >
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
