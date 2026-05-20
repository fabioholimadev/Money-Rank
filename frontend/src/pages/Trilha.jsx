import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  LockOpen,
  Map,
  CheckCircle,
  ArrowBack,
  MonetizationOn,
  AutoStories,
} from '@mui/icons-material';
import { supabase } from '../lib/supabaseClient';

// Importar componentes da biblioteca
import InfograficoLata from '../components/InfograficoLata';
import VideoPlayerEmbed from '../components/VideoPlayerEmbed';
import CaixaQuiz from '../components/CaixaQuiz';
import CardDecisao from '../components/CardDecisao';
import AnalisadorPropaganda from '../components/AnalisadorPropaganda';

/**
 * Trilha.jsx
 * Página principal do jogo - Mapa de Fases Gamificadas
 * Layout: 30% mapa (esquerda) + 70% área de ação (direita)
 */

// ══════════════════════════════════════════════════════════════════════════
// MOCK DAS FASES (Estaticamente Definidas)
// ══════════════════════════════════════════════════════════════════════════
const fasesMapa = [
  {
    id: 1,
    titulo: 'O Perigo Doce',
    subtitulo: 'Ultraprocessados e Energéticos',
    status: 'desbloqueado',
    tipo: 'infografico',
    descricao: 'Descubra quanto de imposto está escondido em uma lata de energético',
    icone: '⚡',
    conteudo: {
      composicao: [
        { label: 'Açúcar e Aditivos', percentual: 35 },
        { label: 'Impostos (ICMS + PIS)', percentual: 28 },
        { label: 'Custo de Produção', percentual: 22 },
        { label: 'Margem Comercial', percentual: 15 },
      ],
    },
  },
  {
    id: 2,
    titulo: 'O Custo do Vício',
    subtitulo: 'Cigarros, Álcool e Outras Drogas',
    status: 'bloqueado',
    tipo: 'decisao',
    descricao: 'Enfrente o dilema de consumo responsável',
    icone: '🚬',
    conteudo: {
      cenario: 'O Dilema do Sextou',
      descricao: 'Você e seus amigos estão planejando o fim de semana. Um colega propõe gastar toda sua mesada em uma festa com bebidas alcoólicas. Como você vai reagir?',
      opcaoA: 'Gastar tudo na festa',
      opcaoB: 'Poupar e investir',
      impactoA: -150,
      impactoB: 100,
    },
  },
  {
    id: 3,
    titulo: 'A Ilusão do Dinheiro',
    subtitulo: 'Apostas Online e Bets',
    status: 'bloqueado',
    tipo: 'analisador_propaganda',
    descricao: 'Identifique as pegadinhas na publicidade de apostas online',
    icone: '🎲',
    conteudo: {
      imagemUrl: 'https://via.placeholder.com/600x400?text=Propaganda+de+Apostas',
      titulo: 'Análise: Propaganda de Apostas Online',
      descricao: 'Encontre 3 técnicas de neuromarketing usadas nesta propaganda enganosa',
      hotspots: [
        {
          id: 1,
          x: 15,
          y: 20,
          label: 'Gatilho de Urgência',
          explicacao:
            'Frases como "Faltam 5 minutos" ou "Aproveite agora!" criam pressão psicológica para tomar decisões impulsivas sem pensar nas consequências.',
        },
        {
          id: 2,
          x: 85,
          y: 60,
          label: 'Letras Miúdas',
          explicacao:
            'Os termos e condições importantes estão em fonte diminuta no rodapé. Isso esconde as reais chances de ganho (muito baixas) e riscos.',
        },
        {
          id: 3,
          x: 50,
          y: 80,
          label: 'Celebridade/Influencer',
          explicacao:
            'Usar celebridades conhecidas cria confiança artificial. A pessoa famosa é paga para isso, não usa de verdade!',
        },
      ],
    },
  },
  {
    id: 4,
    titulo: 'A Engenharia do Desejo',
    subtitulo: 'Publicidade e Consumo Consciente',
    status: 'bloqueado',
    tipo: 'video',
    descricao: 'Assista uma aula sobre técnicas de marketing moderno',
    icone: '📺',
    conteudo: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      titulo: 'Como as Marcas Manipulam Você',
    },
  },
];

// ══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════
function Trilha() {
  const navigate = useNavigate();
  const [atividadeAtual, setAtividadeAtual] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [capicoinsGanhos, setCapicoinsGanhos] = useState(0);
  const [loading, setLoading] = useState(false);

  const parseAlunoFromStorage = () => {
    try {
      const raw = localStorage.getItem('aluno');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [aluno, setAluno] = useState(() => parseAlunoFromStorage());
  const alunoId = aluno?.id;

  // ─────────────────────────────────────────────────────────────────────────
  // MANIPULADOR DE CONCLUSÃO DE ATIVIDADE
  // ─────────────────────────────────────────────────────────────────────────
  const handleComplete = async (resultadoDaAtividade) => {
    setLoading(true);
    console.log('Atividade concluída:', resultadoDaAtividade);

    if (!alunoId) {
      setToastMessage('Usuário não autenticado. Faça login novamente.');
      setLoading(false);
      return;
    }

    const taskReward = 50;

    try {
      const { data, error } = await supabase.rpc('complete_task', {
        p_aluno_id: alunoId,
        p_task_reward: taskReward,
      });

      if (error) {
        throw error;
      }

      const result = Array.isArray(data) ? data[0] : data;
      if (!result) {
        throw new Error('Resposta inválida do servidor.');
      }

      if (result.already_done) {
        setToastMessage('Você já concluiu uma tarefa hoje. Volte amanhã para continuar o streak.');
      } else {
        const updatedAluno = {
          ...aluno,
          capicoins: result.new_capicoins,
          streak_atual: result.new_streak,
        };

        setAluno(updatedAluno);
        try {
          localStorage.setItem('aluno', JSON.stringify(updatedAluno));
        } catch {
          // Ignore localStorage write failures
        }

        setCapicoinsGanhos(result.reward ?? taskReward);
        setToastMessage(`✓ Atividade concluída! +${result.reward ?? taskReward} CapiCoins 🪙`);
      }

      setTimeout(() => {
        setToastMessage(null);
        setAtividadeAtual(null);
      }, 3000);
    } catch (erro) {
      console.error('Erro ao registrar atividade:', erro);
      setToastMessage('❌ Erro ao registrar atividade. Tente novamente.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDERIZADOR CONDICIONAL DE COMPONENTES
  // ─────────────────────────────────────────────────────────────────────────
  const renderComponente = () => {
    if (!atividadeAtual) return null;

    const { tipo, conteudo } = atividadeAtual;

    switch (tipo) {
      case 'infografico':
        return <InfograficoLata onComplete={handleComplete} />;

      case 'video':
        return <VideoPlayerEmbed url={conteudo.url} onComplete={handleComplete} />;

      case 'quiz':
        return (
          <CaixaQuiz
            pergunta={conteudo.pergunta}
            alternativas={conteudo.alternativas}
            respostaCorreta={conteudo.respostaCorreta}
            onComplete={handleComplete}
          />
        );

      case 'decisao':
        return (
          <CardDecisao
            cenario={conteudo.cenario}
            descricao={conteudo.descricao}
            opcaoA={conteudo.opcaoA}
            opcaoB={conteudo.opcaoB}
            impactoA={conteudo.impactoA}
            impactoB={conteudo.impactoB}
            onComplete={handleComplete}
          />
        );

      case 'analisador_propaganda':
        return (
          <AnalisadorPropaganda
            imagemUrl={conteudo.imagemUrl}
            titulo={conteudo.titulo}
            descricao={conteudo.descricao}
            hotspots={conteudo.hotspots}
            onComplete={handleComplete}
          />
        );

      default:
        return <div className="text-slate-400">Tipo de atividade desconhecido</div>;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* ════════════════════════════════
          HEADER/NAVBAR
         ════════════════════════════════ */}
      <header className="border-b border-zinc-800 bg-slate-950 sticky top-0 z-40 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowBack sx={{ fontSize: 20 }} />
            <span className="text-sm font-semibold">Voltar ao Painel</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
              <AutoStories className="text-amber-400" sx={{ fontSize: 18 }} />
              <span className="text-sm font-bold text-amber-400">Trilha do Aprendizado</span>
            </div>
          </div>

          <div className="text-sm text-slate-400">
            Fase {atividadeAtual ? atividadeAtual.id : '—'} de {fasesMapa.length}
          </div>
        </div>
      </header>

      {/* ════════════════════════════════
          CONTEÚDO PRINCIPAL (Grid 2 Colunas)
         ════════════════════════════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* ═══════════════════════════════════════════
              COLUNA ESQUERDA - MAPA DAS FASES (30%)
             ═══════════════════════════════════════════ */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-4">
              
              {/* HEADER DO MAPA */}
              <div className="flex items-center gap-2 mb-6">
                <Map className="text-amber-400" sx={{ fontSize: 24 }} />
                <h2 className="text-xl font-black text-white">Seu Mapa</h2>
              </div>

              {/* LISTA DE FASES */}
              <div className="space-y-3">
                {fasesMapa.map((fase) => {
                  const isDesbloqueado = fase.status === 'desbloqueado';
                  const isAtual = atividadeAtual?.id === fase.id;

                  return (
                    <button
                      key={fase.id}
                      onClick={() => isDesbloqueado && setAtividadeAtual(fase)}
                      disabled={!isDesbloqueado}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        isAtual
                          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/20'
                          : isDesbloqueado
                          ? 'border-zinc-700 bg-zinc-900/40 hover:border-amber-400/50 hover:bg-zinc-800/60 cursor-pointer'
                          : 'border-zinc-800 bg-zinc-900/20 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {/* ÍCONE + CONTEÚDO */}
                      <div className="flex items-start gap-3">
                        
                        {/* ÍCONE DE LOCK */}
                        <div className="flex-shrink-0 pt-1">
                          {isDesbloqueado ? (
                            <LockOpen className="text-amber-400" sx={{ fontSize: 20 }} />
                          ) : (
                            <Lock className="text-slate-500" sx={{ fontSize: 20 }} />
                          )}
                        </div>

                        {/* INFORMAÇÃO */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-black text-white">
                              {fase.icone}
                            </span>
                            <h3 className={`font-bold truncate ${
                              isDesbloqueado ? 'text-white' : 'text-slate-400'
                            }`}>
                              {fase.titulo}
                            </h3>
                          </div>
                          <p className={`text-xs truncate ${
                            isDesbloqueado ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {fase.subtitulo}
                          </p>

                          {/* STATUS */}
                          {isDesbloqueado && (
                            <div className="mt-2 flex items-center gap-1 text-amber-400 text-[10px] font-bold uppercase">
                              <CheckCircle sx={{ fontSize: 12 }} />
                              Pronta para jogar
                            </div>
                          )}
                        </div>

                        {/* INDICADOR DE SELEÇÃO */}
                        {isAtual && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* INFO BOX - PROGRESSO */}
              <div className="mt-8 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase">Progresso</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Fases Desbloqueadas</span>
                  <span className="text-sm font-black text-amber-400">
                    {fasesMapa.filter(f => f.status === 'desbloqueado').length} / {fasesMapa.length}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{
                      width: `${
                        (fasesMapa.filter(f => f.status === 'desbloqueado').length /
                          fasesMapa.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </aside>

          {/* ═══════════════════════════════════════════
              COLUNA DIREITA - ÁREA DE AÇÃO (70%)
             ═══════════════════════════════════════════ */}
          <section className="md:col-span-2">
            {atividadeAtual ? (
              <div className="animate-[fadeIn_0.4s_ease-in]">
                {renderComponente()}
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-6">
                <div className="text-6xl">🗺️</div>
                <div className="space-y-3 max-w-md">
                  <h3 className="text-2xl font-black text-white">
                    Selecione uma Missão
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed">
                    Clique em uma das fases no mapa lateral para começar sua jornada de educação
                    fiscal. Cada atividade concluída renderá +50 CapiCoins!
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-amber-400 text-sm font-semibold animate-pulse">
                  <span>👉 Comece pela Trilha 1</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ════════════════════════════════
          TOAST - Notificação de Sucesso
         ════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500/90 text-white px-6 py-3 rounded-2xl shadow-lg border border-green-400/50 flex items-center gap-3 animate-[slideIn_0.3s_ease-out] backdrop-blur-sm">
          <span className="text-lg">{toastMessage.startsWith('✓') ? '✓' : '❌'}</span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* LOADING OVERLAY (Opcional) */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
            <p className="text-slate-300 font-semibold">Registrando atividade...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trilha;
