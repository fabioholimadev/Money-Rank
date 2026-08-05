import { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  ExpandLess,
  ExpandMore,
  Insights,
  MonetizationOn,
  RestartAlt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TrailLockedState from '../../../../components/trail/TrailLockedState';
import TrailPageShell from '../../../../components/trail/TrailPageShell';
import { useAuth } from '../../../../contexts/AuthContext';
import { custoVicioCases } from '../../../../data/custoVicioCases';
import {
  buildCustoVicioCaseSession,
  calculateCustoVicioResult,
  CUSTO_VICIO_DECISION_COUNT,
} from '../../../../lib/custoVicioCase';
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
import { usePublishedActivityCatalog } from '../../../../hooks/usePublishedActivityCatalog';

const PHASE_NUMBER = 2;
const FALLBACK_ACTIVITY = Object.freeze({
  id: 'custo-vicio',
  phaseNumber: PHASE_NUMBER,
  cases: custoVicioCases,
});

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function createAttemptSeed() {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  return Date.now();
}

export default function AtividadeCaso() {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [caseSession, setCaseSession] = useState(null);
  const [activitySessionId, setActivitySessionId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [stage, setStage] = useState('selection');
  const [decisionIndex, setDecisionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  const [saveError, setSaveError] = useState('');
  const activityDefinition = usePublishedActivityCatalog(
    'custo-vicio',
    FALLBACK_ACTIVITY,
  );
  const availableCases = activityDefinition?.cases ?? custoVicioCases;

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(trailProgress, PHASE_NUMBER);
  const activityUnlocked = isActivityUnlocked(
    PHASE_NUMBER,
    currentPhase,
    phaseProgress,
  );
  const selectedCase = availableCases.find(
    (caseItem) => caseItem.id === selectedCaseId,
  );
  const currentDecision = caseSession?.decisions[decisionIndex] ?? null;
  const selectedOption = currentDecision?.options.find(
    (option) => option.id === selectedOptionId,
  );
  const caseResult =
    caseSession && answers.length === CUSTO_VICIO_DECISION_COUNT
      ? calculateCustoVicioResult(caseSession.id, answers, [caseSession])
      : null;

  const startCase = async () => {
    if (!selectedCase) return;

    setIsStarting(true);
    setSaveError('');
    try {
      const secureSession = await startAuthoritativeActivitySession(
        PHASE_NUMBER,
        selectedCase.id,
      );
      const sessionCase = secureSession.caseData ?? selectedCase;
      setActivitySessionId(secureSession.sessionId);
      setCaseSession(
        buildCustoVicioCaseSession(
          sessionCase.id,
          createAttemptSeed(),
          [sessionCase],
        ),
      );
      setStage('analysis');
      setDecisionIndex(0);
      setSelectedOptionId(null);
      setAnswers([]);
      setSavedResult(null);
    } catch (error) {
      setSaveError(
        error?.message || 'Não foi possível iniciar a análise segura.',
      );
    } finally {
      setIsStarting(false);
    }
  };

  const advanceDecision = () => {
    if (!currentDecision || !selectedOption) return;

    const nextAnswers = [
      ...answers,
      {
        decisionId: currentDecision.id,
        optionId: selectedOption.id,
      },
    ];

    setAnswers(nextAnswers);
    setSelectedOptionId(null);

    if (decisionIndex + 1 === caseSession.decisions.length) {
      setStage('summary');
      return;
    }

    setDecisionIndex((currentIndex) => currentIndex + 1);
  };

  const saveCompletion = async () => {
    if (!selectedCase || !caseResult || !activitySessionId) return;

    setIsSaving(true);
    setSaveError('');

    try {
      const completion = await submitAuthoritativeActivitySession(
        activitySessionId,
        answers.map(({ decisionId, optionId }) => ({
          decisionId,
          optionId,
        })),
      );
      const synchronizedState = await refreshTrailState();

      setSavedResult({
        ...completion,
        profile: synchronizedState.profile,
        wasReview: !completion.firstCompletion,
      });
      setStage('saved');
    } catch (error) {
      console.error('Não foi possível salvar o estudo de caso.', error);
      setSaveError(
        error?.message ||
          'Não foi possível salvar a atividade. Tente novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const restartActivity = () => {
    setSelectedCaseId(null);
    setCaseSession(null);
    setActivitySessionId(null);
    setStage('selection');
    setDecisionIndex(0);
    setSelectedOptionId(null);
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
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400" />
          <p className="font-bold">Carregando o estudo de caso...</p>
        </div>
      </TrailPageShell>
    );
  }

  if (!activityUnlocked) {
    return (
      <TrailLockedState
        title="Estudo de Caso bloqueado"
        message="Assista ao vídeo, consulte os materiais e conclua o conteúdo da Fase 2 para liberar os personagens."
      />
    );
  }

  return (
    <TrailPageShell>
      <div className="w-full min-w-0 py-2 text-white md:py-4">
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-amber-400"
        >
          <ArrowBack sx={{ fontSize: 19 }} aria-hidden="true" />
          Voltar ao mapa
        </button>

        {stage === 'selection' && (
          <>
            <header className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                Fase 2 · Estudo de Caso
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                O Custo do Vício
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
                Escolha um personagem e analise cinco decisões. Não há
                alternativa errada: leituras que conectam mais dimensões
                recebem de 1 a 3 pontos de análise. A ordem das respostas muda
                em cada tentativa.
              </p>
            </header>

            <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              <p className="font-black">Pontuação não altera a recompensa</p>
              <p className="mt-1 leading-relaxed text-cyan-100/80">
                Toda análise completa obtém de 60 a 100 pontos e conclui a
                fase. O Capi Bank registra separadamente 100 CapiCoins-base na
                primeira conclusão ou 20 na revisão e aplica o streak.
              </p>
            </div>

            <div className="space-y-3">
              {availableCases.map((caseItem) => {
                const expanded = selectedCaseId === caseItem.id;
                const detailsId = `case-details-${caseItem.id}`;

                return (
                  <article
                    key={caseItem.id}
                    className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                      expanded
                        ? 'border-amber-400/70 bg-slate-900'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={detailsId}
                      onClick={() =>
                        setSelectedCaseId(expanded ? null : caseItem.id)
                      }
                      className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xs font-black text-amber-400">
                        {caseItem.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-black text-white">
                          {caseItem.name}
                        </span>
                        <span className="mt-1 block text-xs font-bold text-slate-500">
                          {caseItem.course}
                        </span>
                        <span className="mt-2 block text-sm text-slate-300">
                          {caseItem.habit}
                        </span>
                      </span>
                      {expanded ? (
                        <ExpandLess
                          className="shrink-0 text-amber-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <ExpandMore
                          className="shrink-0 text-slate-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    {expanded && (
                      <div
                        id={detailsId}
                        className="border-t border-slate-800 px-4 pb-5 pt-4 sm:px-5"
                      >
                        <p className="text-sm leading-relaxed text-slate-400">
                          {caseItem.story}
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-950/70 p-3 text-xs text-slate-300">
                            <strong className="text-amber-400">Meta:</strong>{' '}
                            {caseItem.goal}
                          </div>
                          <div className="rounded-xl bg-slate-950/70 p-3 text-xs text-slate-300">
                            <strong className="text-cyan-400">
                              Simulação:
                            </strong>{' '}
                            {caseItem.simulatedBudget.cadenceLabel} ={' '}
                            {formatCurrency(
                              caseItem.simulatedBudget.monthlyAmount,
                            )}{' '}
                            por mês
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          {caseItem.simulatedBudget.disclaimer}
                        </p>
                        <button
                          type="button"
                          onClick={startCase}
                          disabled={isStarting}
                          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-400 sm:w-auto"
                        >
                          {isStarting
                            ? 'Abrindo análise segura...'
                            : `Começar análise de ${caseItem.name}`}
                          <ArrowForward
                            sx={{ fontSize: 18 }}
                            aria-hidden="true"
                          />
                        </button>
                        {saveError && (
                          <p
                            className="mt-3 text-sm font-bold text-red-300"
                            role="alert"
                          >
                            {saveError}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}

        {stage === 'analysis' && currentDecision && (
          <>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                  {caseSession.name} · Decisão {decisionIndex + 1} de{' '}
                  {caseSession.decisions.length}
                </p>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                  {currentDecision.moment}
                </h1>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300">
                {answers.reduce((sum, answer) => {
                  const decision = caseSession.decisions.find(
                    (item) => item.id === answer.decisionId,
                  );
                  return (
                    sum +
                    (decision?.options.find(
                      (item) => item.id === answer.optionId,
                    )?.points ?? 0)
                  );
                }, 0)}{' '}
                pontos de análise
              </span>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{
                  width: `${((decisionIndex + 1) / caseSession.decisions.length) * 100}%`,
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
                {currentDecision.options.map((option, optionIndex) => {
                  const selected = selectedOptionId === option.id;
                  const disabled = selectedOptionId !== null;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedOptionId(option.id)}
                      className={`w-full rounded-2xl border-2 p-4 text-left text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-amber-400 bg-amber-400/10 text-amber-100'
                          : disabled
                            ? 'border-slate-800 bg-slate-950/30 text-slate-600'
                            : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-amber-500/50'
                      }`}
                    >
                      <span className="mr-2 font-black text-amber-400">
                        {String.fromCharCode(65 + optionIndex)})
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {selectedOption && (
                <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-cyan-100">
                  <p className="flex flex-wrap items-center gap-2 font-black">
                    <Insights sx={{ fontSize: 20 }} aria-hidden="true" />
                    {selectedOption.insightLabel}
                    <span className="rounded-full bg-cyan-950/60 px-2.5 py-1 text-xs">
                      +{selectedOption.points}{' '}
                      {selectedOption.points === 1
                        ? 'ponto de análise'
                        : 'pontos de análise'}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-cyan-100/85">
                    {selectedOption.feedback}
                  </p>
                  <button
                    type="button"
                    onClick={advanceDecision}
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-amber-400"
                  >
                    {decisionIndex + 1 === caseSession.decisions.length
                      ? 'Ver análise final'
                      : 'Próxima decisão'}
                    <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {stage === 'summary' && caseResult && (
          <section className="rounded-3xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8">
            <div className="text-center">
              <Insights
                sx={{ fontSize: 52 }}
                className="mx-auto text-amber-400"
                aria-hidden="true"
              />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                {caseResult.characterName} · Análise concluída
              </p>
              <h1 className="mt-2 text-3xl font-black">
                {caseResult.insightProfile.label}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {caseResult.insightProfile.summary}
              </p>
            </div>

            <div className="my-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Pontuação da análise
                </p>
                <p className="mt-2 text-4xl font-black text-amber-400">
                  {caseResult.score}
                </p>
                <p className="mt-1 text-xs text-slate-500">de 100 pontos</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Decisões analisadas
                </p>
                <p className="mt-2 text-4xl font-black text-cyan-400">
                  {caseResult.answers.length}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  de {CUSTO_VICIO_DECISION_COUNT} decisões
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {caseResult.answers.map((answer) => (
                <div
                  key={answer.decisionId}
                  className="flex flex-col justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-black text-slate-200">
                      {answer.moment}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Princípio: {answer.principle}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    {answer.insightLabel} · +{answer.points}{' '}
                    {answer.points === 1 ? 'ponto' : 'pontos'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-400">
              <strong className="text-white">Importante:</strong> a pontuação
              mostra profundidade de análise; ela não multiplica CapiCoins.
              O Capi Bank protege a recompensa, o saldo e o streak ao salvar.
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
              onClick={saveCompletion}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-400 disabled:opacity-50"
            >
              {isSaving
                ? 'Guardando no Capi Bank...'
                : 'Concluir e registrar atividade'}
              <CheckCircle sx={{ fontSize: 19 }} aria-hidden="true" />
            </button>
          </section>
        )}

        {stage === 'saved' && savedResult && caseResult && (
          <section className="rounded-3xl border border-amber-500/30 bg-slate-900 p-7 text-center">
            <MonetizationOn
              sx={{ fontSize: 54 }}
              className="mx-auto text-amber-400"
              aria-hidden="true"
            />
            <h1 className="mt-3 text-2xl font-black">
              {savedResult.wasReview
                ? 'Revisão registrada!'
                : 'Fase 2 concluída!'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Análise de {caseResult.characterName}: {caseResult.score}/100.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {getRewardSuppressionMessage(
                savedResult.rewardSuppressionReason,
              ) ??
                `+${savedResult.reward} CapiCoins registrados. Saldo atual: ${savedResult.profile?.capicoins ?? 0}.`}
            </p>
            {!savedResult.rewardSuppressed && (
              <p className="mt-2 text-xs font-semibold text-slate-400">
                Base: {savedResult.baseReward} · Streak:{' '}
                {savedResult.multiplierPercent}% · Bônus: +
                {savedResult.streakBonus}
              </p>
            )}
            <p className="mt-2 text-sm font-bold text-orange-400">
              Streak atual: {savedResult.profile?.streak_atual ?? 0}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={restartActivity}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-black text-slate-200 hover:border-amber-400 hover:text-amber-300"
              >
                <RestartAlt sx={{ fontSize: 18 }} aria-hidden="true" />
                Analisar outro personagem
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate('/trilha/saude-consumo/ilusao-dinheiro/conteudo')
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-amber-400"
              >
                Continuar para a Fase 3
                <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
              </button>
            </div>
          </section>
        )}
      </div>
    </TrailPageShell>
  );
}
