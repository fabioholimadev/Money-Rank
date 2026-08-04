import { useEffect, useState } from 'react';
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
  startAuthoritativeActivitySession,
  submitAuthoritativeActivitySession,
} from '../../../../services/activitySessionService';
import {
  getPhaseProgress,
  isActivityUnlocked,
  normalizeCurrentPhase,
} from '../../../../lib/trailProgress';
import { getRewardSuppressionMessage } from '../../../../lib/competitiveEconomy';

const PHASE_NUMBER = 1;

export default function AtividadeQuiz() {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const [questoesSorteadas, setQuestoesSorteadas] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionSource, setQuestionSource] = useState(null);
  const [questionLoadError, setQuestionLoadError] = useState('');
  const [activitySessionId, setActivitySessionId] = useState(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [answers, setAnswers] = useState([]);
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
  const activityUnlocked = isActivityUnlocked(
    PHASE_NUMBER,
    currentPhase,
    phaseProgress,
  );

  useEffect(() => {
    if (trailLoading || !activityUnlocked || jogoFinalizado) {
      return undefined;
    }

    let isActive = true;

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      setQuestionLoadError('');

      try {
        const result = await startAuthoritativeActivitySession(
          PHASE_NUMBER,
        );

        if (!isActive) return;

        setActivitySessionId(result.sessionId);
        setQuestoesSorteadas(
          result.questions.map((question) => ({
            id: question.id,
            nivel: question.difficulty,
            enunciado: question.prompt,
            alternativas: question.options.map(
              (option) => `${option.id}) ${option.text}`,
            ),
            optionIds: question.options.map((option) => option.id),
          })),
        );
        setQuestionSource(result.source);
      } catch (error) {
        if (!isActive) return;

        console.error('Não foi possível preparar o quiz.', error);
        setQuestionLoadError(
          'Não foi possível preparar as questões. Recarregue a página para tentar novamente.',
        );
      } finally {
        if (isActive) {
          setIsLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      isActive = false;
    };
  }, [
    activityUnlocked,
    jogoFinalizado,
    trailLoading,
  ]);

  const handleResponder = (selectedIndex) => {
    if (respondido) return;

    setOpcaoSelecionada(selectedIndex);
    setRespondido(true);
    const question = questoesSorteadas[perguntaAtual];
    setAnswers((currentAnswers) => [
      ...currentAnswers,
      {
        questionId: question.id,
        optionId: question.optionIds[selectedIndex],
      },
    ]);
  };

  const finishGame = async () => {
    setJogoFinalizado(true);
    setIsSubmitting(true);
    setErroRecompensa('');

    if (!activitySessionId) {
      setErroRecompensa('A sessão segura não foi encontrada.');
      setIsSubmitting(false);
      return;
    }

    try {
      const completion = await submitAuthoritativeActivitySession(
        activitySessionId,
        answers,
      );
      const synchronizedState = await refreshTrailState();

      setResultadoBanco({
        ...completion,
        capicoins: synchronizedState.profile?.capicoins ?? 0,
        streak: synchronizedState.profile?.streak_atual ?? 0,
        wasReview: completion.passed && !completion.firstCompletion,
      });
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

  if (isLoadingQuestions || trailLoading) {
    return (
      <TrailPageShell>
        <div
          role="status"
          className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-white"
        >
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400" />
          <p className="font-bold">Preparando sua missão...</p>
          <p className="mt-2 text-sm text-slate-400">
            Organizando cinco questões com a base científica da fase.
          </p>
        </div>
      </TrailPageShell>
    );
  }

  if (questionLoadError || questoesSorteadas.length === 0) {
    return (
      <TrailPageShell>
        <div className="rounded-3xl border border-red-500/30 bg-slate-900 p-8 text-center text-white">
          <Cancel
            sx={{ fontSize: 42 }}
            className="mx-auto text-red-400"
            aria-hidden="true"
          />
          <p role="alert" className="mt-3 font-bold text-red-300">
            {questionLoadError || 'Nenhuma questão foi preparada.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-400"
          >
            Tentar novamente
          </button>
        </div>
      </TrailPageShell>
    );
  }

  const question = questoesSorteadas[perguntaAtual];
  const passed = Boolean(resultadoBanco?.passed);

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
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Questão {perguntaAtual + 1} de{' '}
                  {questoesSorteadas.length}
                </span>
                <p
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${
                    questionSource === 'ai'
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {questionSource === 'ai'
                    ? 'Gerado pela IA com fontes validadas'
                    : 'Fallback seguro do servidor'}
                </p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold">
                Respondidas:{' '}
                <span className="text-amber-300">{answers.length}</span>
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
                  if (index === opcaoSelecionada) {
                    buttonColor =
                      'border-amber-500 bg-amber-900/30 text-amber-200';
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
                  className="mb-5 rounded-xl border border-cyan-900/50 bg-cyan-900/20 p-4 text-sm text-cyan-100"
                >
                  <p className="mb-1 flex items-center gap-2 font-bold">
                    <CheckCircle sx={{ fontSize: 18 }} aria-hidden="true" />
                    Resposta registrada
                  </p>
                  <p className="opacity-90">
                    O gabarito permanece protegido. O Capi Bank revelará sua
                    pontuação depois das cinco respostas.
                  </p>
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
              {isSubmitting
                ? 'Validando resultado...'
                : passed
                  ? 'Missão concluída!'
                  : 'Continue treinando!'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {resultadoBanco
                ? `Você acertou ${resultadoBanco.correctAnswers} de ${questoesSorteadas.length} questões.`
                : 'O Capi Bank está conferindo suas cinco respostas.'}
            </p>

            <div className="my-7 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              {isSubmitting ? (
                <p className="font-bold text-amber-400">
                  Guardando no Capi Bank...
                </p>
              ) : erroRecompensa ? (
                <>
                  <Cancel
                    sx={{ fontSize: 50 }}
                    className="mx-auto text-red-400"
                    aria-hidden="true"
                  />
                  <h2 className="mt-2 text-xl font-bold text-red-400">
                    Resultado ainda não confirmado
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Suas respostas continuam nesta tela. Tente enviar novamente
                    antes de sair.
                  </p>
                </>
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
                    {getRewardSuppressionMessage(
                      resultadoBanco?.rewardSuppressionReason,
                    ) ??
                      `+${resultadoBanco?.reward ?? 0} CapiCoins. Saldo atual: ${resultadoBanco?.capicoins ?? 0}.`}
                  </p>
                  {!resultadoBanco?.rewardSuppressed && (
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Base: {resultadoBanco?.baseReward ?? 0} · Streak:{' '}
                      {resultadoBanco?.multiplierPercent ?? 100}% ·
                      Bônus: +{resultadoBanco?.streakBonus ?? 0}
                    </p>
                  )}
                  {!resultadoBanco?.rewardSuppressed && (
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
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <p role="alert">{erroRecompensa}</p>
                <button
                  type="button"
                  onClick={finishGame}
                  className="mt-3 min-h-11 rounded-lg bg-red-400 px-4 py-2 font-black text-slate-950 transition-colors hover:bg-red-300"
                >
                  Tentar confirmar novamente
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting || Boolean(erroRecompensa)}
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
