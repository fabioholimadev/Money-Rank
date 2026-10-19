import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WorkshopMatchingRound from '../../components/workshop/WorkshopMatchingRound';
import { useAuth } from '../../contexts/AuthContext';
import {
  startWorkshopActivity,
  submitWorkshopActivity,
} from '../../services/workshopActivityService';

const LABELS = {
  'verdadeiro-falso': 'Verdadeiro ou falso',
  'ligar-colunas': 'Ligar colunas',
  'completar-frases': 'Completar frases',
  quiz: 'Quiz Ciência Delas',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function ChoiceIcon({ activityKey, option }) {
  if (activityKey !== 'verdadeiro-falso') return null;
  const truthy = String(option).toLocaleLowerCase('pt-BR').startsWith('verd');
  return truthy
    ? <CheckRounded className="text-[#79e72e]" sx={{ fontSize: 28 }} />
    : <CloseRounded className="text-[#ff7878]" sx={{ fontSize: 28 }} />;
}

export default function WorkshopActivity({ testMode = false }) {
  const { activityKey } = useParams();
  const { refreshTrailState } = useAuth();
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const title = LABELS[activityKey] || 'Atividade da oficina';
  const isMatching = activityKey === 'ligar-colunas';
  const currentItem = session?.items?.[currentIndex];
  const currentAnswered = Number.isInteger(answers[currentItem?.itemId]);
  const complete = useMemo(
    () => session?.items?.every((item) => Number.isInteger(answers[item.itemId])),
    [answers, session],
  );

  async function start() {
    setLoading(true);
    setError('');
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    setSession(null);
    try {
      setSession(await startWorkshopActivity(activityKey, { testMode }));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    startWorkshopActivity(activityKey, { testMode })
      .then((createdSession) => {
        if (mounted) {
          setSession(createdSession);
          setError('');
          setResult(null);
          setAnswers({});
          setCurrentIndex(0);
        }
      })
      .catch((cause) => {
        if (mounted) setError(cause.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [activityKey, testMode]);

  async function submit(event) {
    event.preventDefault();
    if (!complete || !session) return;
    setLoading(true);
    setError('');
    try {
      const saved = await submitWorkshopActivity(session.sessionId, session.items.map((item) => ({
        itemId: item.itemId,
        answerIndex: answers[item.itemId],
      })), { testMode });
      setResult(saved);
      if (!testMode) await refreshTrailState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(itemId, optionIndex) {
    setAnswers((current) => ({ ...current, [itemId]: optionIndex }));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-3 text-[#f1f7fb]">
      <header className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link className="inline-flex items-center gap-2 text-sm font-black text-[#8edcff]" to={testMode ? '/professor/visao-aluno' : '/trilha/oficina'}>
              <ArrowBackRounded /> Voltar à oficina
            </Link>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#58cc02]">
              {testMode ? 'Teste isolado do professor' : `Rodada com ${session?.items?.length || (isMatching ? 4 : 6)} desafios`}
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">{title}</h1>
          </div>
          {!result && session && !isMatching && (
            <div className="rounded-2xl border border-[#53666f] bg-[#17262c] px-4 py-3 text-center">
              <p className="text-2xl font-black text-[#79e72e]">{currentIndex + 1}/{session.items.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#78909b]">Questão atual</p>
            </div>
          )}
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#a5b7c2]">
          {testMode
            ? 'Esta experiência usa o banco real de questões, mas não altera saldo, ranking ou progresso oficial.'
            : 'Cada rodada concluída durante o período soma CapiCoins. Responda com atenção e avance no seu ritmo.'}
        </p>

        {!result && session && (
          <div className="mt-6 flex gap-2" aria-label="Progresso da rodada">
            {session.items.map((item, index) => {
              const answered = Number.isInteger(answers[item.itemId]);
              const active = isMatching ? answered : index === currentIndex;
              return (
                <span
                  aria-label={`Desafio ${index + 1}${answered ? ' respondido' : ''}`}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${active ? 'bg-[#58cc02]' : answered ? 'bg-[#49c0f8]' : 'bg-[#37464f]'}`}
                  key={item.itemId}
                />
              );
            })}
          </div>
        )}
      </header>

      {loading && !session && (
        <div className="flex min-h-48 items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#37464f] border-t-[#58cc02]" />
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-200">
          {error}
        </p>
      )}

      {session && !result && (
        <form className="space-y-5" onSubmit={submit}>
          {isMatching ? (
            <WorkshopMatchingRound
              answers={answers}
              disabled={loading}
              items={session.items}
              onChange={setAnswers}
            />
          ) : currentItem && (
            <section className="workshop-question-in overflow-hidden rounded-3xl border border-[#37464f] bg-[#1f2d33]" key={currentItem.itemId}>
              <div className="border-b border-[#37464f] bg-[#17262c] px-5 py-4 sm:px-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#49c0f8]">
                  Desafio {currentIndex + 1} de {session.items.length}
                </p>
              </div>
              <div className="p-5 sm:p-8">
                <h2 className="max-w-3xl text-xl font-black leading-8 text-white sm:text-2xl">
                  {currentItem.prompt}
                </h2>
                <div className={`mt-7 grid gap-3 ${activityKey === 'verdadeiro-falso' || activityKey === 'completar-frases' ? 'sm:grid-cols-2' : ''}`}>
                  {currentItem.options.map((option, optionIndex) => {
                    const selected = answers[currentItem.itemId] === optionIndex;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`group flex min-h-16 items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold leading-6 shadow-[0_4px_0_#0c1519] transition hover:-translate-y-0.5 ${selected ? 'border-[#58cc02] bg-[#58cc02]/10 text-white' : 'border-[#53666f] bg-[#17262c] text-[#d8e2e7] hover:border-[#8edcff]'}`}
                        disabled={loading}
                        key={`${currentItem.itemId}-${option}`}
                        onClick={() => chooseAnswer(currentItem.itemId, optionIndex)}
                        type="button"
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-black ${selected ? 'border-[#58cc02] bg-[#58cc02] text-[#13210f]' : 'border-[#53666f] bg-[#131f24] text-[#8edcff]'}`}>
                          <ChoiceIcon activityKey={activityKey} option={option} />
                          {activityKey !== 'verdadeiro-falso' && OPTION_LETTERS[optionIndex]}
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {!isMatching && (
              <button
                className="min-h-12 rounded-2xl border-2 border-[#53666f] px-5 font-black text-[#d8e2e7] transition hover:border-[#8edcff] disabled:cursor-not-allowed disabled:opacity-30"
                disabled={currentIndex === 0 || loading}
                onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                type="button"
              >
                Questão anterior
              </button>
            )}

            {!isMatching && currentIndex < session.items.length - 1 ? (
              <button
                className="mr-button-primary min-h-14 min-w-56 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!currentAnswered || loading}
                onClick={() => setCurrentIndex((index) => index + 1)}
                type="button"
              >
                Próximo desafio <ArrowForwardRounded />
              </button>
            ) : (
              <button
                className="mr-button-primary min-h-14 min-w-64 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!complete || loading}
                type="submit"
              >
                {loading ? 'Conferindo…' : 'Concluir rodada e pontuar'}
              </button>
            )}
          </div>
        </form>
      )}

      {result && (
        <section className="workshop-question-in space-y-5 rounded-3xl border border-[#58cc02]/40 bg-[#1f2d33] p-6 sm:p-8">
          <div className="text-center">
            <CheckCircleRounded className="text-[#58cc02]" sx={{ fontSize: 56 }} />
            <h2 className="mt-2 text-3xl font-black text-white">{result.score} pontos</h2>
            <p className="mt-2 inline-flex items-center gap-2 font-black text-[#ffc800]">
              <MonetizationOnRounded /> {testMode ? 'Sem CapiCoins no teste' : `+${result.rewardAmount} CapiCoins`}
            </p>
            <p className="mt-2 text-sm text-[#a5b7c2]">{result.correctAnswers} acertos e {result.wrongAnswers} erros.</p>
          </div>
          <div className="space-y-3">
            {result.feedback?.map((feedback, index) => (
              <article className={`rounded-xl border p-4 ${feedback.correct ? 'border-[#58cc02]/30 bg-[#58cc02]/5' : 'border-[#ff9600]/30 bg-[#ff9600]/5'}`} key={feedback.itemId}>
                <p className="text-xs font-black uppercase text-[#a5b7c2]">Desafio {index + 1} · {feedback.correct ? 'Acertou' : 'Revisar'}</p>
                <p className="mt-1 text-sm text-white">{feedback.explanation}</p>
                <a className="mt-2 inline-block text-xs font-bold text-[#8edcff] underline" href={feedback.sourceUrl} rel="noreferrer" target="_blank">Fonte: {feedback.sourceTitle}</a>
              </article>
            ))}
          </div>
          <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#49c0f8] font-black text-[#10252d]" onClick={() => void start()} type="button">
            <ReplayRounded /> Fazer nova rodada
          </button>
        </section>
      )}
    </div>
  );
}
