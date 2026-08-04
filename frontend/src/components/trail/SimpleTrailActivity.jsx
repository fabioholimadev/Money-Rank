import { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  Cancel,
  CheckCircle,
  MonetizationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  completePhaseActivity,
} from '../../services/studentDataService';
import {
  getPhaseProgress,
  isActivityUnlocked,
  normalizeCurrentPhase,
} from '../../lib/trailProgress';
import { getRewardSuppressionMessage } from '../../lib/competitiveEconomy';
import TrailLockedState from './TrailLockedState';
import TrailPageShell from './TrailPageShell';

export default function SimpleTrailActivity({ activity }) {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState('');

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(
    trailProgress,
    activity.phaseNumber,
  );
  const activityUnlocked = isActivityUnlocked(
    activity.phaseNumber,
    currentPhase,
    phaseProgress,
  );
  const selectedOption =
    selectedIndex === null ? null : activity.options[selectedIndex];

  const retry = () => {
    setWrongAnswers((currentValue) => currentValue + 1);
    setSelectedIndex(null);
  };

  const finishActivity = async () => {
    setIsSaving(true);
    setSaveError('');

    try {
      const completion = await completePhaseActivity(
        activity.phaseNumber,
        {
          score: 100,
          correctAnswers: 1,
          wrongAnswers,
        },
        activity.id,
      );
      const synchronizedState = await refreshTrailState();

      setResult({
        ...completion,
        profile: synchronizedState.profile,
        wasReview: !completion.firstCompletion,
      });
    } catch (error) {
      console.error('Não foi possível concluir a atividade.', error);
      setSaveError(
        error?.message ||
          'Não foi possível salvar a atividade. Tente novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!activityUnlocked && !trailLoading) {
    return (
      <TrailLockedState
        title={`${activity.mechanicLabel} bloqueado`}
        message="Conclua primeiro o vídeo e os materiais desta fase."
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

        {!result ? (
          <>
            <header className="mb-7">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                {activity.stepLabel} · {activity.mechanicLabel}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {activity.title}
              </h1>
              <p className="mt-3 text-sm text-slate-400">
                A primeira conclusão vale 100 CapiCoins-base. Revisões
                aprovadas valem 20, e o streak multiplica a recompensa.
              </p>
            </header>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
              <h2 className="text-lg font-black leading-relaxed sm:text-xl">
                {activity.prompt}
              </h2>

              <div className="mt-6 space-y-3">
                {activity.options.map((option, index) => {
                  const selected = selectedIndex === index;
                  const answered = selectedIndex !== null;
                  let color =
                    'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-amber-500/50';

                  if (answered && option.correct) {
                    color =
                      'border-emerald-500 bg-emerald-500/10 text-emerald-200';
                  } else if (answered && selected) {
                    color =
                      'border-red-500 bg-red-500/10 text-red-200';
                  } else if (answered) {
                    color =
                      'border-slate-800 bg-slate-950/30 text-slate-600';
                  }

                  return (
                    <button
                      key={option.label}
                      type="button"
                      disabled={answered}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full rounded-2xl border-2 p-4 text-left text-sm font-semibold transition-colors ${color}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {selectedOption && (
                <div
                  className={`mt-6 rounded-2xl border p-4 ${
                    selectedOption.correct
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-500/30 bg-red-500/10 text-red-200'
                  }`}
                >
                  <p className="flex items-center gap-2 font-black">
                    {selectedOption.correct ? (
                      <CheckCircle sx={{ fontSize: 19 }} aria-hidden="true" />
                    ) : (
                      <Cancel sx={{ fontSize: 19 }} aria-hidden="true" />
                    )}
                    {selectedOption.correct
                      ? 'Resposta correta!'
                      : 'Ainda não. Tente novamente.'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">
                    {activity.explanation}
                  </p>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={
                      selectedOption.correct ? finishActivity : retry
                    }
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
                  >
                    {isSaving
                      ? 'Salvando progresso...'
                      : selectedOption.correct
                        ? 'Concluir atividade'
                        : 'Tentar novamente'}
                    <ArrowForward
                      sx={{ fontSize: 18 }}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}

              {saveError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {saveError}
                </p>
              )}
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-amber-500/30 bg-slate-900 p-7 text-center">
            <MonetizationOn
              sx={{ fontSize: 54 }}
              className="mx-auto text-amber-400"
              aria-hidden="true"
            />
            <h1 className="mt-3 text-2xl font-black">
              {result.wasReview
                ? 'Revisão concluída!'
                : 'Fase concluída!'}
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              {getRewardSuppressionMessage(
                result.rewardSuppressionReason,
              ) ??
                `+${result.reward} CapiCoins registrados. Saldo atual: ${result.profile?.capicoins ?? 0}.`}
            </p>
            {!result.rewardSuppressed && (
              <p className="mt-2 text-xs font-semibold text-slate-400">
                Base: {result.baseReward} · Streak:{' '}
                {result.multiplierPercent}% · Bônus: +
                {result.streakBonus}
              </p>
            )}
            {!result.rewardSuppressed && (
              <p className="mt-2 text-sm font-bold text-orange-400">
                Streak atual: {result.profile?.streak_atual ?? 0}
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate(activity.nextPath)}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-amber-400"
            >
              {activity.nextLabel}
              <ArrowForward sx={{ fontSize: 18 }} aria-hidden="true" />
            </button>
          </section>
        )}
      </div>
    </TrailPageShell>
  );
}
