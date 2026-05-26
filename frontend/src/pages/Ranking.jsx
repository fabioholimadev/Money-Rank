import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaderboard, MonetizationOn, Groups, Person, AccountCircle } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

export default function Ranking() {
  const navigate = useNavigate();
  const [leaderboardInd, setLeaderboardInd] = useState([]);
  const [leaderboardTurmas, setLeaderboardTurmas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('individual');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        // Adicionamos avatar_url na busca
        const { data, error } = await supabase
          .from('alunos')
          .select('id, nome, fase_atual, capicoins, turma, avatar_url')
          .order('capicoins', { ascending: false });

        if (error) throw error;

        setLeaderboardInd(data || []);

        if (data) {
          const turmasMap = data.reduce((acc, aluno) => {
            const turmaNome = aluno.turma || 'Sem Turma';
            if (!acc[turmaNome]) {
              acc[turmaNome] = { turma: turmaNome, total_capicoins: 0, qtd_alunos: 0 };
            }
            acc[turmaNome].total_capicoins += (aluno.capicoins || 0);
            acc[turmaNome].qtd_alunos += 1;
            return acc;
          }, {});

          const turmasArr = Object.values(turmasMap).sort((a, b) => b.total_capicoins - a.total_capicoins);
          setLeaderboardTurmas(turmasArr);
        }
      } catch (err) {
        console.error('Erro ao buscar leaderboard:', err);
        setErrorMsg('Não foi possível conectar ao banco de dados.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-white text-sm tracking-widest uppercase">Carregando ranking...</p>
      </div>
    );
  }

  const listaAtiva = activeTab === 'individual' ? leaderboardInd : leaderboardTurmas;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-4xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3">
            <Leaderboard sx={{ fontSize: 40, color: '#fbbf24' }} /> RANKING GERAL
          </h1>
          <p className="text-slate-400">Os melhores jogadores e turmas do Money Rank</p>
        </div>

        {/* Abas */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
          <button onClick={() => setActiveTab('individual')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${ activeTab === 'individual' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800' }`}>
            <Person sx={{ fontSize: 18 }} /> Alunos
          </button>
          <button onClick={() => setActiveTab('turmas')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${ activeTab === 'turmas' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800' }`}>
            <Groups sx={{ fontSize: 18 }} /> Turmas
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="relative max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Tabela de Ranking */}
      <div className="relative max-w-4xl mx-auto">
        {listaAtiva.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-lg shadow-amber-500/5">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900/80 to-slate-900/60 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300 w-24">Posição</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">{activeTab === 'individual' ? 'Jogador' : 'Turma'}</th>
                  {activeTab === 'individual' && <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 w-32">Fase</th>}
                  {activeTab === 'turmas' && <th className="px-6 py-4 text-center text-sm font-bold text-slate-300 w-32">Alunos</th>}
                  <th className="px-6 py-4 text-right text-sm font-bold text-amber-400 w-40">CapiCoins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {listaAtiva.map((item, index) => {
                  let posicaoEstilo = index === 0 ? 'bg-amber-500/20 text-amber-400' : index === 1 ? 'bg-slate-500/20 text-slate-300' : index === 2 ? 'bg-orange-500/20 text-orange-400' : 'text-slate-400';

                  return (
                    <tr key={activeTab === 'individual' ? item.id : item.turma} className="border-b border-zinc-800 hover:bg-slate-900/40 transition-colors">
                      <td className={`px-6 py-4 font-bold text-lg ${posicaoEstilo}`}>
                        {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'} {index + 1}º
                      </td>
                      
                      {/* Avatar + Nome */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        {activeTab === 'individual' ? (
                          item.avatar_url ? (
                            <img src={item.avatar_url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-zinc-700 flex items-center justify-center">
                              <AccountCircle sx={{ fontSize: 28 }} className="text-slate-600" />
                            </div>
                          )
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-zinc-700 flex items-center justify-center">
                            <Groups sx={{ fontSize: 28 }} className="text-slate-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white text-lg">{activeTab === 'individual' ? item.nome : item.turma}</p>
                          {activeTab === 'individual' && item.turma && <p className="text-xs text-slate-500 font-bold tracking-wider uppercase mt-1">{item.turma}</p>}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center font-bold text-slate-300">
                        {activeTab === 'individual' ? (item.fase_atual || 1) : `${item.qtd_alunos} membros`}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 font-black text-amber-400 text-xl">
                          <MonetizationOn sx={{ fontSize: 24 }} />
                          {activeTab === 'individual' ? (item.capicoins || 0) : item.total_capicoins}
                        </div>
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
               {activeTab === 'individual' ? 'Nenhum jogador registrado ainda.' : 'Nenhuma turma registrada.'}
             </p>
           </div>
        )}
      </div>

      <div className="relative max-w-4xl mx-auto mt-10 flex justify-center">
        <button onClick={() => navigate('/student')} className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-3 px-12 rounded-2xl shadow-lg shadow-amber-400/20 active:translate-y-1 active:shadow-md transition-all">
          ← Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}