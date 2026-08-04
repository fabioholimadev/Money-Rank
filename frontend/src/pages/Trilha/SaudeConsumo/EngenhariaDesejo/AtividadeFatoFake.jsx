import { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  Campaign,
  Cancel,
  CheckCircle,
  FactCheck,
  Link as LinkIcon,
  MonetizationOn,
  Replay,
  School,
  TravelExplore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TrailLockedState from '../../../../components/trail/TrailLockedState';
import TrailPageShell from '../../../../components/trail/TrailPageShell';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  ENGENHARIA_DESEJO_ACTIVITY,
  ENGENHARIA_DESEJO_CONTENT_VERSION,
  engenhariaDesejoAdBank,
} from '../../../../data/engenhariaDesejoAds';
import {
  buildEngenhariaDesejoSession,
  calculateEngenhariaDesejoResult,
  ENGENHARIA_DESEJO_CARD_COUNT,
  ENGENHARIA_DESEJO_CLASSIFICATIONS,
  evaluateEngenhariaDesejoChoice,
} from '../../../../lib/engenhariaDesejoGame';
import { getRewardSuppressionMessage } from '../../../../lib/competitiveEconomy';
import {
  getPhaseProgress,
  isActivityUnlocked,
  normalizeCurrentPhase,
} from '../../../../lib/trailProgress';
import {
  startAuthoritativeActivitySession,
  submitAuthoritativeActivitySession,
} from '../../../../services/activitySessionService';

const PHASE_NUMBER = 4;

function createAttemptSeed() {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  return Date.now();
}

function ClassificationBadge({ classification }) {
  const isReal = classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
        isReal
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300'
      }`}
    >
      {isReal ? (
        <FactCheck sx={{ fontSize: 15 }} aria-hidden="true" />
      ) : (
        <Campaign sx={{ fontSize: 15 }} aria-hidden="true" />
      )}
      {isReal ? 'Publicidade documentada' : 'Peça inventada'}
    </span>
  );
}

function SourcePanel({ card }) {
  if (card.classification === ENGENHARIA_DESEJO_CLASSIFICATIONS.INVENTED) {
    return (
      <div className="mt-4 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4">
        <p className="text-xs font-black uppercase tracking-widest text-fuchsia-300">
          Origem transparente
        </p>
        <p className="mt-2 text-sm leading-relaxed text-fuchsia-100/80">
          Peça criada pela equipe do Money Rank para esta atividade. Ela não
          possui marca real, veiculação externa ou fonte simulada.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-300">
        Evidência verificável
      </p>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold text-slate-500">Onde e quando</dt>
          <dd className="mt-1 text-slate-200">
            {card.location} · {card.observedAt}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-slate-500">Canal</dt>
          <dd className="mt-1 text-slate-200">{card.channel}</dd>
        </div>
      </dl>
      <a
        href={card.evidence.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-500/30 bg-slate-950/50 px-4 py-2 text-sm font-black text-emerald-300 hover:border-emerald-400 hover:text-emerald-200"
      >
        <LinkIcon sx={{ fontSize: 17 }} aria-hidden="true" />
        Conferir decisão da {card.evidence.institution}
      </a>
      <p className="mt-2 text-xs text-slate-500">
        {card.evidence.outcome} · fonte consultada em{' '}
        {card.evidence.accessedAt}
      </p>
    </div>
  );
}

export default function AtividadeFatoFake() {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const [session, setSession] = useState(() =>
    buildEngenhariaDesejoSession(createAttemptSeed()),
  );
  const [activitySessionId, setActivitySessionId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [stage, setStage] = useState('introduction');
  const [cardIndex, setCardIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  const [saveError, setSaveError] = useState('');

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(trailProgress, PHASE_NUMBER);
  const activityUnlocked = isActivityUnlocked(
    PHASE_NUMBER,
    currentPhase,
    phaseProgress,
  );
  const currentCard = session.cards[cardIndex] ?? null;
  const gameResult =
    answers.length === ENGENHARIA_DESEJO_CARD_COUNT
      ? calculateEngenhariaDesejoResult(session, answers)
      : null;

  const chooseClassification = (classification) => {
    if (!currentCard || currentAnswer) return;

    setCurrentAnswer(
      evaluateEngenhariaDesejoChoice(currentCard, classification),
    );
  };

  const advanceCard = () => {
    if (!currentAnswer) return;

    const nextAnswers = [...answers, currentAnswer];
    setAnswers(nextAnswers);
    setCurrentAnswer(null);

    if (cardIndex + 1 === session.cards.length) {
      setStage('summary');
      return;
    }

    setCardIndex((currentIndex) => currentIndex + 1);
  };

  const startInvestigation = async () => {
    setIsStarting(true);
    setSaveError('');
    try {
      const secureSession = await startAuthoritativeActivitySession(
        PHASE_NUMBER,
      );
      const selectedCards = secureSession.cardIds
        .map((cardId) =>
          engenhariaDesejoAdBank.find((card) => card.id === cardId),
        )
        .filter(Boolean);
      if (selectedCards.length !== ENGENHARIA_DESEJO_CARD_COUNT) {
        throw new Error('O banco seguro devolveu uma rodada incompleta.');
      }

      setActivitySessionId(secureSession.sessionId);
      setSession(
        buildEngenhariaDesejoSession(createAttemptSeed(), selectedCards),
      );
      setStage('challenge');
    } catch (error) {
      setSaveError(
        error?.message || 'Não foi possível iniciar a investigação segura.',
      );
    } finally {
      setIsStarting(false);
    }
  };

  const saveActivity = async () => {
    if (!gameResult || !activitySessionId) return;

    setIsSaving(true);
    setSaveError('');

    try {
      const completion = await submitAuthoritativeActivitySession(
        activitySessionId,
        answers.map(({ cardId, selectedClassification }) => ({
          cardId,
          selectedClassification,
        })),
      );
      const synchronizedState = await refreshTrailState();

      setSavedResult({
        ...completion,
        capiCoins: synchronizedState.profile?.capicoins ?? 0,
        streak: synchronizedState.profile?.streak_atual ?? 0,
        wasReview: completion.passed && !completion.firstCompletion,
      });

      setStage('saved');
    } catch (error) {
      console.error('Não foi possível salvar a investigação.', error);
      setSaveError(
        error?.message ||
          'Não foi possível salvar a investigação. Tente novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const restartActivity = () => {
    setSession(buildEngenhariaDesejoSession(createAttemptSeed()));
    setActivitySessionId(null);
    setStage('introduction');
    setCardIndex(0);
    setAnswers([]);
    setCurrentAnswer(null);
    setSavedResult(null);
    setSaveError('');
  };

  if (trailLoading) {
    return (
      <TrailPageShell>
        <div
          role="status"
          className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-white"
        >
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-fuchsia-400" />
          <p className="font-bold">Abrindo a central de investigação...</p>
        </div>
      </TrailPageShell>
    );
  }

  if (!activityUnlocked) {
    return (
      <TrailLockedState
        title="Engenharia do Desejo bloqueada"
        message="Assista ao vídeo, consulte os materiais e conclua o conteúdo da Fase 4 para liberar a investigação."
      />
    );
  }

  return (
    <TrailPageShell>
      <div className="w-full min-w-0 py-2 text-white md:py-4">
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-fuchsia-300"
        >
          <ArrowBack sx={{ fontSize: 19 }} aria-hidden="true" />
          Voltar ao mapa
        </button>

        {stage === 'introduction' && (
          <>
            <header className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-400">
                {ENGENHARIA_DESEJO_ACTIVITY.stepLabel} ·{' '}
                {ENGENHARIA_DESEJO_ACTIVITY.mechanicLabel}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {ENGENHARIA_DESEJO_ACTIVITY.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
                {ENGENHARIA_DESEJO_ACTIVITY.introduction}
              </p>
            </header>

            <section className="rounded-3xl border border-fuchsia-500/30 bg-slate-900 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-950 p-4">
                  <TravelExplore
                    className="text-fuchsia-400"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-2xl font-black">6 peças</p>
                  <p className="mt-1 text-xs text-slate-500">
                    3 reais e 3 inventadas
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4">
                  <FactCheck
                    className="text-emerald-400"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-2xl font-black">4 acertos</p>
                  <p className="mt-1 text-xs text-slate-500">
                    mínimo para concluir
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4">
                  <School className="text-amber-400" aria-hidden="true" />
                  <p className="mt-3 text-2xl font-black">Fonte aberta</p>
                  <p className="mt-1 text-xs text-slate-500">
                    evidência após o palpite
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100/85">
                <strong className="text-amber-200">Regra de auditoria:</strong>{' '}
                os botões trocam de posição, e as peças mudam em cada rodada.
                Nunca use apenas a posição da resposta como pista.
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-500">
                Banco editorial v{ENGENHARIA_DESEJO_CONTENT_VERSION}. As peças
                reais são descrições pedagógicas de decisões públicas; as
                inventadas são identificadas depois da resposta. Validação
                pedagógica do professor permanece obrigatória.
              </div>

              <button
                type="button"
                onClick={startInvestigation}
                disabled={isStarting}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-fuchsia-300"
              >
                {isStarting
                  ? 'Abrindo investigação segura...'
                  : 'Iniciar investigação'}
                <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
              </button>
              {saveError && (
                <p className="mt-3 text-sm font-bold text-red-300" role="alert">
                  {saveError}
                </p>
              )}
            </section>
          </>
        )}

        {stage === 'challenge' && currentCard && (
          <>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-400">
                  Peça {cardIndex + 1} de {session.cards.length}
                </p>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                  Isso realmente existiu?
                </h1>
              </div>
              <span className="w-fit rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-400">
                {answers.filter((answer) => answer.correct).length} acertos até
                agora
              </span>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-fuchsia-400 transition-all"
                style={{
                  width: `${((cardIndex + 1) / session.cards.length) * 100}%`,
                }}
              />
            </div>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Dossiê publicitário
                    </p>
                    <h2 className="mt-2 text-xl font-black text-white">
                      {currentCard.title}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                    {currentCard.channel}
                  </span>
                </div>
                <p className="mt-5 text-base leading-relaxed text-slate-300">
                  {currentCard.scenario}
                </p>
              </div>

              <h3 className="mt-6 font-black text-white">Seu parecer</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {currentCard.responseOptions.map((option, optionIndex) => {
                  const selected =
                    currentAnswer?.selectedClassification ===
                    option.classification;
                  const disabled = currentAnswer !== null;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        chooseClassification(option.classification)
                      }
                      className={`min-h-16 rounded-2xl border-2 p-4 text-left text-sm font-black transition-colors ${
                        selected
                          ? 'border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-100'
                          : disabled
                            ? 'border-slate-800 bg-slate-950/30 text-slate-600'
                            : 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-fuchsia-400/60'
                      }`}
                    >
                      <span className="mr-2 text-fuchsia-400">
                        {String.fromCharCode(65 + optionIndex)})
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {currentAnswer && (
                <div
                  aria-live="polite"
                  className={`mt-6 rounded-2xl border p-5 ${
                    currentAnswer.correct
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-amber-500/30 bg-amber-500/10'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p
                      className={`flex items-center gap-2 font-black ${
                        currentAnswer.correct
                          ? 'text-emerald-300'
                          : 'text-amber-300'
                      }`}
                    >
                      {currentAnswer.correct ? (
                        <CheckCircle sx={{ fontSize: 21 }} aria-hidden="true" />
                      ) : (
                        <Cancel sx={{ fontSize: 21 }} aria-hidden="true" />
                      )}
                      {currentAnswer.correct
                        ? 'Parecer correto!'
                        : 'Essa peça enganou seu radar.'}
                    </p>
                    <ClassificationBadge
                      classification={currentCard.classification}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {currentCard.explanation}
                  </p>
                  <div className="mt-4 rounded-xl bg-slate-950/50 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-fuchsia-300">
                      Técnica: {currentCard.tactic.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {currentCard.tactic.explanation}
                    </p>
                  </div>
                  <SourcePanel card={currentCard} />
                  <button
                    type="button"
                    onClick={advanceCard}
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-fuchsia-300"
                  >
                    {cardIndex + 1 === session.cards.length
                      ? 'Ver resultado da investigação'
                      : 'Analisar próxima peça'}
                    <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {stage === 'summary' && gameResult && (
          <section className="rounded-3xl border border-fuchsia-500/30 bg-slate-900 p-6 sm:p-8">
            <div className="text-center">
              <FactCheck
                sx={{ fontSize: 54 }}
                className="mx-auto text-fuchsia-400"
                aria-hidden="true"
              />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-fuchsia-400">
                Relatório da rodada
              </p>
              <h1 className="mt-2 text-3xl font-black">
                {gameResult.profile.title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                {gameResult.profile.description}
              </p>
            </div>

            <div className="my-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Nota
                </p>
                <p
                  className={`mt-2 text-4xl font-black ${
                    gameResult.passed ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {gameResult.score}
                </p>
                <p className="mt-1 text-xs text-slate-500">mínimo 60</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Acertos
                </p>
                <p className="mt-2 text-4xl font-black text-fuchsia-400">
                  {gameResult.correctAnswers}/6
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Situação
                </p>
                <p
                  className={`mt-3 text-xl font-black ${
                    gameResult.passed ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {gameResult.passed ? 'Missão concluída' : 'Nova rodada necessária'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {gameResult.answers.map((answer) => (
                <div
                  key={answer.cardId}
                  className="flex flex-col justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-black text-slate-200">
                      {answer.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {answer.classification ===
                      ENGENHARIA_DESEJO_CLASSIFICATIONS.REAL
                        ? answer.location
                        : 'Criação pedagógica do Money Rank'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${
                      answer.correct
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {answer.correct ? 'Parecer correto' : 'Revisar evidência'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-400">
              <strong className="text-white">Recompensa competitiva:</strong>{' '}
              com nota suficiente, o Capi Bank calcula 100 CapiCoins-base na
              primeira conclusão ou 20 na revisão, além do bônus de streak.
            </div>

            {saveError && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {saveError}
              </p>
            )}

            <button
              type="button"
              disabled={isSaving}
              onClick={saveActivity}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-fuchsia-300 disabled:opacity-50"
            >
              {isSaving
                ? 'Guardando no Capi Bank...'
                : gameResult.passed
                  ? 'Concluir e registrar investigação'
                  : 'Registrar tentativa'}
              <CheckCircle sx={{ fontSize: 19 }} aria-hidden="true" />
            </button>
          </section>
        )}

        {stage === 'saved' && savedResult && gameResult && (
          <section className="rounded-3xl border border-fuchsia-500/30 bg-slate-900 p-7 text-center">
            {gameResult.passed ? (
              <MonetizationOn
                sx={{ fontSize: 54 }}
                className="mx-auto text-amber-400"
                aria-hidden="true"
              />
            ) : (
              <Replay
                sx={{ fontSize: 54 }}
                className="mx-auto text-fuchsia-400"
                aria-hidden="true"
              />
            )}
            <h1 className="mt-3 text-2xl font-black">
              {gameResult.passed
                ? savedResult.wasReview
                  ? 'Revisão registrada!'
                  : 'Trilha Saúde e Consumo concluída!'
                : 'Tentativa registrada'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {gameResult.profile.title} · Nota {gameResult.score}/100 ·{' '}
              {gameResult.correctAnswers} pareceres corretos.
            </p>

            {gameResult.passed ? (
              <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                <p className="font-black text-amber-300">
                  {savedResult.rewardSuppressed
                    ? 'Revisão salva sem nova recompensa'
                    : `+${savedResult.reward} CapiCoins`}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {getRewardSuppressionMessage(
                    savedResult.rewardSuppressionReason,
                  ) ??
                    `Base ${savedResult.baseReward} · Streak ${savedResult.multiplierPercent}% · Bônus +${savedResult.streakBonus}`}
                </p>
                <p className="mt-2 text-sm font-bold text-orange-400">
                  Saldo real: {savedResult.capiCoins} CapiCoins · Streak:{' '}
                  {savedResult.streak}
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-5 text-sm leading-relaxed text-fuchsia-100/85">
                A tentativa ficou salva, mas não gerou CapiCoins. Uma nova
                rodada trará outra seleção de peças e trocará a posição das
                respostas.
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={restartActivity}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 hover:border-fuchsia-400 hover:text-fuchsia-300"
              >
                <Replay sx={{ fontSize: 18 }} aria-hidden="true" />
                Investigar nova rodada
              </button>
              <button
                type="button"
                onClick={() => navigate('/trilha')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-fuchsia-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-fuchsia-300"
              >
                Voltar ao mapa
                <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}
      </div>
    </TrailPageShell>
  );
}
