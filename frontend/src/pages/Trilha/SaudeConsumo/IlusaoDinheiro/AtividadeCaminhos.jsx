import { useState } from 'react';
import {
  AccountBalanceWallet,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  MonetizationOn,
  Replay,
  Route,
  TrendingDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TrailLockedState from '../../../../components/trail/TrailLockedState';
import TrailPageShell from '../../../../components/trail/TrailPageShell';
import { useAuth } from '../../../../contexts/AuthContext';
import { ilusaoDinheiroMission } from '../../../../data/ilusaoDinheiroPaths';
import {
  buildIlusaoDinheiroSession,
  calculateIlusaoDinheiroResult,
  ILUSAO_DINHEIRO_DECISION_COUNT,
  toIlusaoDinheiroActivityResult,
} from '../../../../lib/ilusaoDinheiroGame';
import { getRewardSuppressionMessage } from '../../../../lib/competitiveEconomy';
import {
  getPhaseProgress,
  isActivityUnlocked,
  normalizeCurrentPhase,
} from '../../../../lib/trailProgress';
import {
  completePhaseActivity,
  registerPhaseAttempt,
} from '../../../../services/studentDataService';

const PHASE_NUMBER = 3;

function createAttemptSeed() {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  return Date.now();
}

function formatCredits(value) {
  return `${new Intl.NumberFormat('pt-BR').format(value)} créditos`;
}

function formatDelta(value) {
  if (value === 0) return 'sem alteração';
  return `${value > 0 ? '+' : ''}${value} créditos`;
}

export default function AtividadeCaminhos() {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const [session, setSession] = useState(() =>
    buildIlusaoDinheiroSession(createAttemptSeed()),
  );
  const [stage, setStage] = useState('introduction');
  const [decisionIndex, setDecisionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [answers, setAnswers] = useState([]);
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
  const currentDecision = session.decisions[decisionIndex] ?? null;
  const selectedChoice = currentDecision?.choices.find(
    (choice) => choice.id === selectedChoiceId,
  );
  const simulatedBalance = answers.reduce(
    (balance, answer) => balance + answer.balanceDelta,
    session.initialBalance,
  );
  const gameResult =
    answers.length === ILUSAO_DINHEIRO_DECISION_COUNT
      ? calculateIlusaoDinheiroResult(answers)
      : null;

  const startMission = () => {
    setStage('decision');
    setSaveError('');
  };

  const advanceDecision = () => {
    if (!currentDecision || !selectedChoice) return;

    const nextAnswers = [
      ...answers,
      {
        decisionId: currentDecision.id,
        choiceId: selectedChoice.id,
        balanceDelta: selectedChoice.balanceDelta,
      },
    ];

    setAnswers(nextAnswers);
    setSelectedChoiceId(null);

    if (decisionIndex + 1 === session.decisions.length) {
      setStage('preview');
      return;
    }

    setDecisionIndex((currentIndex) => currentIndex + 1);
  };

  const saveMission = async () => {
    if (!gameResult) return;

    setIsSaving(true);
    setSaveError('');

    try {
      const activityResult = toIlusaoDinheiroActivityResult(gameResult);

      if (gameResult.passed) {
        const completion = await completePhaseActivity(
          PHASE_NUMBER,
          activityResult,
          ilusaoDinheiroMission.id,
        );
        const synchronizedState = await refreshTrailState();

        setSavedResult({
          ...completion,
          capiCoins: synchronizedState.profile?.capicoins ?? 0,
          streak: synchronizedState.profile?.streak_atual ?? 0,
          wasReview: !completion.firstCompletion,
        });
      } else {
        await registerPhaseAttempt(
          PHASE_NUMBER,
          activityResult,
          ilusaoDinheiroMission.id,
        );
        const synchronizedState = await refreshTrailState();

        setSavedResult({
          reward: 0,
          capiCoins:
            synchronizedState.profile?.capicoins ?? aluno?.capicoins ?? 0,
          streak:
            synchronizedState.profile?.streak_atual ??
            aluno?.streak_atual ??
            0,
          wasReview: false,
        });
      }

      setStage('saved');
    } catch (error) {
      console.error('Não foi possível salvar os caminhos da missão.', error);
      setSaveError(
        error?.message ||
          'Não foi possível salvar a missão. Tente novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const restartMission = () => {
    setSession(buildIlusaoDinheiroSession(createAttemptSeed()));
    setStage('introduction');
    setDecisionIndex(0);
    setSelectedChoiceId(null);
    setAnswers([]);
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
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="font-bold">Preparando seus caminhos...</p>
        </div>
      </TrailPageShell>
    );
  }

  if (!activityUnlocked) {
    return (
      <TrailLockedState
        title="Caminhos de Decisão bloqueados"
        message="Assista ao vídeo, consulte os materiais e conclua o conteúdo da Fase 3 para liberar a missão."
      />
    );
  }

  return (
    <TrailPageShell>
      <div className="w-full min-w-0 py-2 text-white md:py-4">
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ArrowBack sx={{ fontSize: 19 }} aria-hidden="true" />
          Voltar ao mapa
        </button>

        {stage === 'introduction' && (
          <>
            <header className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                Fase 3 · Caminhos de Decisão
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {session.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
                {session.introduction}
              </p>
            </header>

            <section className="rounded-3xl border border-cyan-500/30 bg-slate-900 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Caixa da história
                  </p>
                  <p className="mt-2 text-2xl font-black text-cyan-400">
                    {formatCredits(session.initialBalance)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Meta de Alex
                  </p>
                  <p className="mt-2 text-2xl font-black text-amber-400">
                    {formatCredits(session.goalCost)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Sua carteira real
                  </p>
                  <p className="mt-2 text-2xl font-black text-emerald-400">
                    {aluno?.capicoins ?? 0} CapiCoins
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100/85">
                <strong className="text-amber-200">Duas carteiras:</strong>{' '}
                {session.disclaimer}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="font-black text-white">Sua missão</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Atravesse seis decisões. Cada escolha muda o caixa e a
                  história. Você precisa de pelo menos 60 pontos para concluir
                  a fase e receber a recompensa competitiva.
                </p>
              </div>

              <button
                type="button"
                onClick={startMission}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300"
              >
                Começar os caminhos
                <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
              </button>
            </section>
          </>
        )}

        {stage === 'decision' && currentDecision && (
          <>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                  {currentDecision.stepLabel}
                </p>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                  {currentDecision.title}
                </h1>
              </div>
              <div
                className={`rounded-2xl border px-4 py-3 text-left sm:text-right ${
                  simulatedBalance >= session.goalCost
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : simulatedBalance >= 0
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Caixa simulado
                </p>
                <p className="mt-1 text-lg font-black">
                  {formatCredits(simulatedBalance)}
                </p>
              </div>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{
                  width: `${((decisionIndex + 1) / session.decisions.length) * 100}%`,
                }}
              />
            </div>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <p className="text-base leading-relaxed text-slate-300">
                {currentDecision.narrative}
              </p>
              <h2 className="mt-5 text-xl font-black leading-relaxed">
                {currentDecision.question}
              </h2>

              <div className="mt-6 space-y-3">
                {currentDecision.choices.map((choice, choiceIndex) => {
                  const selected = selectedChoiceId === choice.id;
                  const disabled = selectedChoiceId !== null;

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedChoiceId(choice.id)}
                      className={`w-full rounded-2xl border-2 p-4 text-left text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100'
                          : disabled
                            ? 'border-slate-800 bg-slate-950/30 text-slate-600'
                            : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <span className="mr-2 font-black text-cyan-400">
                        {String.fromCharCode(65 + choiceIndex)})
                      </span>
                      {choice.label}
                    </button>
                  );
                })}
              </div>

              {selectedChoice && (
                <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-cyan-100">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 font-black">
                      <Route sx={{ fontSize: 20 }} aria-hidden="true" />
                      Consequência do caminho
                    </p>
                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold">
                      {formatDelta(selectedChoice.balanceDelta)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-cyan-100/85">
                    {selectedChoice.consequence}
                  </p>
                  <p className="mt-3 text-xs font-bold text-cyan-300">
                    Princípio observado: {selectedChoice.principle} · Saldo
                    após a escolha:{' '}
                    {formatCredits(
                      simulatedBalance + selectedChoice.balanceDelta,
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={advanceDecision}
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300"
                  >
                    {decisionIndex + 1 === session.decisions.length
                      ? 'Descobrir o final'
                      : 'Próxima decisão'}
                    <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {stage === 'preview' && gameResult && (
          <section className="rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 sm:p-8">
            <div className="text-center">
              {gameResult.finalBalance < 0 ? (
                <TrendingDown
                  sx={{ fontSize: 54 }}
                  className="mx-auto text-red-400"
                  aria-hidden="true"
                />
              ) : (
                <AccountBalanceWallet
                  sx={{ fontSize: 54 }}
                  className="mx-auto text-cyan-400"
                  aria-hidden="true"
                />
              )}
              <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                Seu final
              </p>
              <h1 className="mt-2 text-3xl font-black">
                {gameResult.ending.title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                {gameResult.ending.description}
              </p>
            </div>

            <div className="my-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Nota da jornada
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
                  Caixa final simulado
                </p>
                <p className="mt-2 text-3xl font-black text-cyan-400">
                  {formatCredits(gameResult.finalBalance)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Situação da meta
                </p>
                <p className="mt-2 text-xl font-black text-amber-400">
                  {gameResult.goalGap === 0
                    ? `Protegida +${gameResult.remainingAfterGoal}`
                    : `Faltam ${gameResult.goalGap}`}
                </p>
                <p className="mt-1 text-xs text-slate-500">créditos simulados</p>
              </div>
            </div>

            <div className="space-y-3">
              {gameResult.answers.map((answer) => (
                <div
                  key={answer.decisionId}
                  className="flex flex-col justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-black text-slate-200">
                      {answer.stepLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {answer.principle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${
                      answer.balanceDelta === 0
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {formatCredits(answer.balanceBefore)} →{' '}
                    {formatCredits(answer.balanceAfter)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-400">
              <strong className="text-white">Carteira competitiva:</strong>{' '}
              este caixa é narrativo. Se a nota for suficiente, o Capi Bank
              calculará 100 CapiCoins-base na primeira conclusão ou 20 na
              revisão, mais o streak.
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
              onClick={saveMission}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {isSaving
                ? 'Guardando no Capi Bank...'
                : gameResult.passed
                  ? 'Concluir e registrar jornada'
                  : 'Registrar tentativa'}
              <CheckCircle sx={{ fontSize: 19 }} aria-hidden="true" />
            </button>
          </section>
        )}

        {stage === 'saved' && savedResult && gameResult && (
          <section className="rounded-3xl border border-cyan-500/30 bg-slate-900 p-7 text-center">
            {gameResult.passed ? (
              <MonetizationOn
                sx={{ fontSize: 54 }}
                className="mx-auto text-amber-400"
                aria-hidden="true"
              />
            ) : (
              <Replay
                sx={{ fontSize: 54 }}
                className="mx-auto text-cyan-400"
                aria-hidden="true"
              />
            )}
            <h1 className="mt-3 text-2xl font-black">
              {gameResult.passed
                ? savedResult.wasReview
                  ? 'Revisão registrada!'
                  : 'Fase 3 concluída!'
                : 'Caminho registrado'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {gameResult.ending.title} · Nota {gameResult.score}/100 · Caixa
              final {formatCredits(gameResult.finalBalance)}.
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
              <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-sm leading-relaxed text-cyan-100/85">
                A tentativa ficou salva, mas não gerou CapiCoins nem liberou a
                próxima fase. Refazer com outras escolhas faz parte da missão.
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={restartMission}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
              >
                <Replay sx={{ fontSize: 18 }} aria-hidden="true" />
                {gameResult.passed
                  ? 'Explorar outro caminho'
                  : 'Tentar novamente'}
              </button>
              <button
                type="button"
                disabled={!gameResult.passed}
                onClick={() =>
                  navigate(
                    '/trilha/saude-consumo/engenharia-desejo/conteudo',
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar para a Fase 4
                <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}
      </div>
    </TrailPageShell>
  );
}
