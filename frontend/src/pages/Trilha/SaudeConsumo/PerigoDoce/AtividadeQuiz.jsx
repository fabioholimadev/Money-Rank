import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, CheckCircle, Cancel, MonetizationOn } from '@mui/icons-material';
import { fetchApi } from "../../../../lib/api";
import { useAuth } from '../../../../contexts/AuthContext';
import { bancoDeQuestoes } from './questoes'; 

export default function AtividadeQuiz() {
  const navigate = useNavigate();
  
  // Estados do Jogo
  const [questoesSorteadas, setQuestoesSorteadas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultadoBanco, setResultadoBanco] = useState(null);
  const [erroRecompensa, setErroRecompensa] = useState(null);

  // ⚠️ COLE AQUI O ID DO QUIZ QUE O SQL GEROU LÁ NO SUPABASE
  const ATIVIDADE_QUIZ_ID = '90dad467-0e2c-4fb6-be94-744bc0ae67ac';
  const RECOMPENSA_QUIZ = 100;

  const { aluno, updateAluno } = useAuth();

  // Ao carregar a tela, sorteia 5 questões do banco
  useEffect(() => {
    const embaralhar = [...bancoDeQuestoes].sort(() => 0.5 - Math.random());
    setQuestoesSorteadas(embaralhar.slice(0, 5));
  }, []);

  const handleResponder = (indexSelecionado) => {
    if (respondido) return; 
    setOpcaoSelecionada(indexSelecionado);
    setRespondido(true);
    
    if (indexSelecionado === questoesSorteadas[perguntaAtual].respostaCorreta) {
      setPontuacao(pontuacao + 1);
    }
  };

  const proximaPergunta = () => {
    if (perguntaAtual + 1 < questoesSorteadas.length) {
      setPerguntaAtual(perguntaAtual + 1);
      setOpcaoSelecionada(null);
      setRespondido(false);
    } else {
      finalizarJogo();
    }
  };

  const finalizarJogo = async () => {
    setJogoFinalizado(true);
    setIsSubmitting(true);
    setErroRecompensa(null);

    try {
      const alunoId = aluno?.id;
      if (!alunoId) throw new Error('Usuário não autenticado');

      // Só ganha CapiCoins se acertar pelo menos 3 de 5
      if (pontuacao >= 3) {
        const response = await fetchApi('/api/activities/complete', {
          method: 'POST',
          body: {
            id_atividade: ATIVIDADE_QUIZ_ID,
            id_aluno: alunoId,
            recompensa: RECOMPENSA_QUIZ,
            tipo: 'atividade',
          },
        });

        const json = await response.json();
        if (!response.ok) {
          throw new Error(json?.error || 'Erro ao concluir a atividade');
        }

        const reward = json.reward ?? json.aluno?.recompensa ?? RECOMPENSA_QUIZ;
        const capicoins = json.capicoins_atuais ?? json.aluno?.capicoins;

        setResultadoBanco({ reward, capicoins });
        if (updateAluno && capicoins !== undefined) {
          updateAluno({ capicoins });
        }
      }
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      setErroRecompensa(error?.message ?? 'Erro ao salvar pontuação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questoesSorteadas.length === 0) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Carregando missão...</div>;

  const questao = questoesSorteadas[perguntaAtual];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        <button onClick={() => navigate('/trilha')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-8 font-bold transition-colors">
          <ArrowBack fontSize="small" /> Abandonar Missão
        </button>

        {!jogoFinalizado ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-sm">Questão {perguntaAtual + 1} de {questoesSorteadas.length}</span>
              <span className="bg-slate-800 px-4 py-1 rounded-full text-sm font-bold border border-slate-700">
                Acertos: <span className={pontuacao > 0 ? 'text-green-400' : 'text-slate-400'}>{pontuacao}</span>
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-6 shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{questao.enunciado}</h2>
            </div>

            <div className="flex flex-col gap-3">
              {questao.alternativas.map((alt, index) => {
                let corBotao = "bg-slate-900 border-slate-800 hover:border-amber-500/50 text-slate-300";
                
                if (respondido) {
                  if (index === questao.respostaCorreta) corBotao = "bg-green-900/40 border-green-500 text-green-300";
                  else if (index === opcaoSelecionada) corBotao = "bg-red-900/40 border-red-500 text-red-300";
                  else corBotao = "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleResponder(index)}
                    disabled={respondido}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${corBotao}`}
                  >
                    {alt}
                  </button>
                );
              })}
            </div>

            {respondido && (
              <div className="mt-8 animate-fade-in">
                <div className={`p-4 rounded-xl mb-6 border ${opcaoSelecionada === questao.respostaCorreta ? 'bg-green-900/20 border-green-900/50 text-green-200' : 'bg-red-900/20 border-red-900/50 text-red-200'}`}>
                  <p className="font-bold mb-1 flex items-center gap-2">
                    {opcaoSelecionada === questao.respostaCorreta ? <><CheckCircle fontSize="small" /> Mandou bem!</> : <><Cancel fontSize="small" /> Errou, mas faz parte!</>}
                  </p>
                  <p className="text-sm opacity-90">{questao.justificativa}</p>
                </div>
                
                <button onClick={proximaPergunta} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl transition-colors">
                  {perguntaAtual + 1 === questoesSorteadas.length ? 'Finalizar Missão' : 'Próxima Questão'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-black text-white mb-2">Missão Concluída!</h2>
            <p className="text-slate-400 mb-8">Você acertou {pontuacao} de {questoesSorteadas.length} questões.</p>
            
            {isSubmitting ? (
              <div className="text-amber-400 font-bold animate-pulse">Sincronizando com o Banco Central...</div>
            ) : (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8">
                {pontuacao >= 3 ? (
                  <>
                    <MonetizationOn sx={{ fontSize: 60, color: '#fbbf24', mb: 2 }} />
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Recompensa Recebida!</h3>
                    {erroRecompensa ? (
                      <p className="text-sm text-red-400">{erroRecompensa}</p>
                    ) : (
                      <p className="text-sm text-slate-400">Excelente! Seus <span className="text-amber-400 font-bold">+{resultadoBanco?.reward ?? 0} CapiCoins</span> já estão na sua conta.</p>
                    )}
                  </>
                ) : (
                  <>
                    <Cancel sx={{ fontSize: 60, color: '#ef4444', mb: 2 }} />
                    <h3 className="text-xl font-bold text-red-400 mb-2">Treine mais um pouco!</h3>
                    <p className="text-sm text-slate-400">Você precisa acertar pelo menos 3 questões para faturar CapiCoins.</p>
                  </>
                )}
              </div>
            )}

            <button onClick={() => navigate('/trilha')} className="w-full bg-slate-100 hover:bg-white text-slate-900 font-black py-4 rounded-xl transition-colors">
              Voltar a Trilha Principal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}