import { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  Cancel,
  CheckCircle,
  MonetizationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TrailLockedState from '../../../../components/trail/TrailLockedState';
import TrailPageShell from '../../../../components/trail/TrailPageShell';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  completePhaseActivity,
  registerPhaseAttempt,
} from '../../../../services/studentDataService';
import {
  getPhaseProgress,
  isActivityUnlocked,
  isPhaseCompleted,
  normalizeCurrentPhase,
} from '../../../../lib/trailProgress';
import { bancoDeQuestoes } from './questoes';

const PHASE_NUMBER = 1;
const MINIMUM_CORRECT_ANSWERS = 3;

export default function AtividadeQuiz() {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const [questoesSorteadas] = useState(() => {
    const embaralhadas = [...bancoDeQuestoes].sort(
      () => 0.5 - Math.random(),
    );
    return embaralhadas.slice(0, 5);
  });
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [respondido, setRespondido] = useState(false);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultadoBanco, setResultadoBanco] = useState(null);
  const [erroRecompensa, setErroRecompensa] = useState('');

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(
    trailProgress,
    PHASE_NUMBER,
  );
  const alreadyCompleted = isPhaseCompleted(
    PHASE_NUMBER,
    currentPhase,
    phaseProgress,
  );
  const activityUnlocked = isActivityUnlocked(
    PHASE_NUMBER,
    currentPhase,
    phaseProgress,
  );

  const handleResponder = (selectedIndex) => {
    if (respondido) return;

    setOpcaoSelecionada(selectedIndex);
    setRespondido(true);

    if (
      selectedIndex ===
      questoesSorteadas[perguntaAtual].respostaCorreta
    ) {
      setPontuacao((currentScore) => currentScore + 1);
    }
  };

  const finishGame = async () => {
    setJogoFinalizado(true);
    setIsSubmitting(true);
    setErroRecompensa('');

    const totalQuestions = questoesSorteadas.length;
    const score = Math.round((pontuacao / totalQuestions) * 100);
    const passed = pontuacao >= MINIMUM_CORRECT_ANSWERS;

    try {
      if (alreadyCompleted) {
        setResultadoBanco({
          reward: 0,
          capicoins: aluno?.capicoins ?? 0,
          streak: aluno?.streak_atual ?? 0,
          wasReview: true,
        });
        return;
      }

      if (passed) {
        const completion = await completePhaseActivity(PHASE_NUMBER, {
          score,
          correctAnswers: pontuacao,
          wrongAnswers: totalQuestions - pontuacao,
        });
        const synchronizedState = await refreshTrailState();

        setResultadoBanco({
          reward: completion.reward,
          capicoins: synchronizedState.profile?.capicoins ?? 0,
          streak: synchronizedState.profile?.streak_atual ?? 0,
          wasReview: false,
        });
      } else {
        await registerPhaseAttempt(PHASE_NUMBER, {
          score,
          correctAnswers: pontuacao,
          wrongAnswers: totalQuestions - pontuacao,
        });
        await refreshTrailState();
        setResultadoBanco({
          reward: 0,
          capicoins: aluno?.capicoins ?? 0,
          streak: aluno?.streak_atual ?? 0,
          wasReview: false,
        });
      }
    } catch (error) {
      console.error('Não foi possível salvar o resultado do quiz.', error);
      setErroRecompensa(
        error?.message ||
          'Não foi possível salvar o resultado. Tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (perguntaAtual + 1 < questoesSorteadas.length) {
      setPerguntaAtual((currentQuestion) => currentQuestion + 1);
      setOpcaoSelecionada(null);
      setRespondido(false);
      return;
    }

    finishGame();
  };

  if (!activityUnlocked && !trailLoading) {
    return (
      <TrailLockedState
        title="Quiz de Fixação bloqueado"
        message="Assista ao vídeo, abra os materiais e conclua o conteúdo da Fase 1 para liberar o quiz."
      />
    );
  }

  if (questoesSorteadas.length === 0) {
    return (
      <TrailPageShell>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-white">
          Carregando missão...
        </div>
      </TrailPageShell>
    );
  }

  const question = questoesSorteadas[perguntaAtual];
  const passed = pontuacao >= MINIMUM_CORRECT_ANSWERS;

  return (
    <TrailPageShell>
      <div className="w-full min-w-0 py-2 text-white md:py-4">
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-amber-400"
        >
          <ArrowBack sx={{ fontSize: 19 }} aria-hidden="true" />
          Abandonar missão
        </button>

        {!jogoFinalizado ? (
          <>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Questão {perguntaAtual + 1} de {questoesSorteadas.length}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold">
                Acertos:{' '}
                <span
                  className={
                    pontuacao > 0
                      ? 'text-green-400'
                      : 'text-slate-400'
                  }
                >
                  {pontuacao}
                </span>
              </span>
            </div>

            <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Fase 1 · Quiz de Fixação
              </p>
              <h1 className="text-lg font-bold leading-relaxed sm:text-2xl">
                {question.enunciado}
              </h1>
            </section>

            <div className="space-y-3">
              {question.alternativas.map((alternative, index) => {
                let buttonColor =
                  'border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-500/50';

                if (respondido) {
                  if (index === question.respostaCorreta) {
                    buttonColor =
                      'border-green-500 bg-green-900/40 text-green-300';
                  } else if (index === opcaoSelecionada) {
                    buttonColor =
                      'border-red-500 bg-red-900/40 text-red-300';
                  } else {
                    buttonColor =
                      'border-slate-800 bg-slate-900/50 text-slate-600 opacity-50';
                  }
                }

                return (
                  <button
                    key={alternative}
                    type="button"
                    onClick={() => handleResponder(index)}
                    disabled={respondido}
                    className={`w-full rounded-xl border-2 p-4 text-left text-sm transition-all sm:text-base ${buttonColor}`}
                  >
                    {alternative}
                  </button>
                );
              })}
            </div>

            {respondido && (
              <div className="mt-7">
                <div
                  className={`mb-5 rounded-xl border p-4 text-sm ${
                    opcaoSelecionada === question.respostaCorreta
                      ? 'border-green-900/50 bg-green-900/20 text-green-200'
                      : 'border-red-900/50 bg-red-900/20 text-red-200'
                  }`}
                >
                  <p className="mb-1 flex items-center gap-2 font-bold">
                    {opcaoSelecionada === question.respostaCorreta ? (
                      <>
                        <CheckCircle
                          sx={{ fontSize: 18 }}
                          aria-hidden="true"
                        />
                        Mandou bem!
                      </>
                    ) : (
                      <>
                        <Cancel
                          sx={{ fontSize: 18 }}
                          aria-hidden="true"
                        />
                        Errou, mas faz parte!
                      </>
                    )}
                  </p>
                  <p className="opacity-90">{question.justificativa}</p>
                </div>

                <button
                  type="button"
                  onClick={nextQuestion}
                  className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-black text-slate-950 transition-colors hover:bg-amber-400"
                >
                  {perguntaAtual + 1 === questoesSorteadas.length
                    ? 'Finalizar missão'
                    : 'Próxima questão'}
                </button>
              </div>
            )}
          </>
        ) : (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl sm:p-8">
            <h1 className="text-2xl font-black sm:text-3xl">
              {passed ? 'Missão concluída!' : 'Continue treinando!'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Você acertou {pontuacao} de {questoesSorteadas.length}{' '}
              questões.
            </p>

            <div className="my-7 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              {isSubmitting ? (
                <p className="font-bold text-amber-400">
                  Registrando no SQL Connect...
                </p>
              ) : passed ? (
                <>
                  <MonetizationOn
                    sx={{ fontSize: 50 }}
                    className="mx-auto text-amber-400"
                    aria-hidden="true"
                  />
                  <h2 className="mt-2 text-xl font-bold text-amber-400">
                    {resultadoBanco?.wasReview
                      ? 'Revisão concluída'
                      : 'Recompensa recebida'}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {resultadoBanco?.wasReview
                      ? 'As moedas não foram duplicadas porque esta fase já estava concluída.'
                      : `+${resultadoBanco?.reward ?? 0} CapiCoins. Saldo atual: ${resultadoBanco?.capicoins ?? 0}.`}
                  </p>
                  {!resultadoBanco?.wasReview && (
                    <p className="mt-2 text-sm font-bold text-orange-400">
                      Streak atual: {resultadoBanco?.streak ?? 0}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Cancel
                    sx={{ fontSize: 50 }}
                    className="mx-auto text-red-400"
                    aria-hidden="true"
                  />
                  <h2 className="mt-2 text-xl font-bold text-red-400">
                    Você precisa de 3 acertos
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    A tentativa foi registrada, mas não gerou moedas nem
                    liberou a próxima fase.
                  </p>
                </>
              )}
            </div>

            {erroRecompensa && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {erroRecompensa}
              </p>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                navigate(
                  passed
                    ? '/trilha/saude-consumo/custo-vicio/conteudo'
                    : '/trilha/saude-consumo/perigo-doce/conteudo',
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3.5 text-sm font-black text-slate-900 transition-colors hover:bg-white disabled:opacity-50"
            >
              {passed ? 'Continuar para a Fase 2' : 'Revisar conteúdo'}
              <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
            </button>
          </section>
        )}
      </div>
    </TrailPageShell>
  );
}
