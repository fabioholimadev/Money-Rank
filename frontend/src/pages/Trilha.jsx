import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Trilha() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFase, setSelectedFase] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const alunoData = localStorage.getItem('aluno');
    const token = localStorage.getItem('token');
    if (!alunoData || !token) {
      navigate('/login');
    } else {
      try {
        setAluno(JSON.parse(alunoData));
      } catch (err) {
        console.error('Erro ao parsear aluno:', err);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleCompleteFase = async () => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/api/game/complete-phase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Erro ao completar fase.');
        setIsLoading(false);
        return;
      }

      // Atualizar localStorage com os novos dados
      localStorage.setItem('aluno', JSON.stringify(data.aluno));
      setAluno(data.aluno);

      setSuccessMsg(data.message || 'Fase concluída com sucesso! 🎉');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      console.error('Erro ao completar fase:', err);
      setErrorMsg('Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!aluno) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  // Gerar 10 fases como exemplo
  const fases = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    numero: i + 1,
    titulo: `Fase ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tighter">
            TRILHA DE <span className="text-green-400">FASES</span>
          </h1>
          <div className="text-slate-400 text-sm">
            Fase Atual: <span className="text-green-400 font-bold">{aluno.fase_atual || 1}</span>
          </div>
        </div>
        <p className="text-slate-400 mt-3">
          Complete as missões de consumo e ganhe CapiCoins 🪙
        </p>
      </div>

      {/* Mapa Visual de Fases */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {fases.map((fase) => {
            const isConcluida = fase.numero < aluno.fase_atual;
            const isAtual = fase.numero === aluno.fase_atual;
            const isBloqueada = fase.numero > aluno.fase_atual;

            let estilo = '';
            if (isConcluida) {
              estilo =
                'bg-green-600 border-green-400 hover:bg-green-500 cursor-pointer shadow-lg shadow-green-500/50';
            } else if (isAtual) {
              estilo =
                'bg-blue-600 border-blue-400 hover:bg-blue-500 cursor-pointer shadow-lg shadow-blue-500/50 animate-pulse';
            } else {
              estilo =
                'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed shadow-none';
            }

            return (
              <button
                key={fase.id}
                onClick={() => {
                  if (isAtual) {
                    setSelectedFase(fase);
                    setShowModal(true);
                  }
                }}
                disabled={isBloqueada}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${estilo}`}
              >
                <span className="text-3xl mb-2">
                  {isConcluida ? '✅' : isAtual ? '⚡' : '🔒'}
                </span>
                <span className="font-bold text-sm">{fase.titulo}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 flex justify-center">
        <button
          onClick={() => navigate('/student')}
          className="bg-green-500 hover:bg-green-400 text-slate-900 font-extrabold py-3 px-12 rounded-xl shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none transition-all"
        >
          ← Voltar ao Dashboard
        </button>
      </div>

      {/* Modal de Fase */}
      {showModal && selectedFase && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-green-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-green-400 mb-2">
                {selectedFase.titulo}
              </h2>
              <p className="text-slate-400">⚡ Missão Ativa</p>
            </div>

            {/* Texto da Missão */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-6 text-center">
              <p className="text-slate-300 text-lg">
                Complete a missão de consumo e aprenda como funciona a educação financeira! 💰
              </p>
            </div>

            {/* Feedback */}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-300 rounded-xl text-sm font-semibold text-center">
                ✅ {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-xl text-sm font-semibold text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Botão de Conclusão */}
            <button
              onClick={handleCompleteFase}
              disabled={isLoading}
              className={`w-full bg-green-500 hover:bg-green-400 text-slate-900 text-lg font-extrabold py-3 rounded-xl shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none transition-all mb-3 ${
                isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processando...' : '🎯 Concluir Missão'}
            </button>

            {/* Botão Fechar */}
            <button
              onClick={() => setShowModal(false)}
              disabled={isLoading}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
