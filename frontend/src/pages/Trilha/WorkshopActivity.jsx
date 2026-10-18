import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export default function WorkshopActivity({ testMode = false }) {
  const { activityKey } = useParams();
  const { refreshTrailState } = useAuth();
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const title = LABELS[activityKey] || 'Atividade da oficina';
  const complete = useMemo(() => session?.items?.every((item) => Number.isInteger(answers[item.itemId])), [answers, session]);

  async function start() {
    setLoading(true); setError(''); setResult(null); setAnswers({});
    try { setSession(await startWorkshopActivity(activityKey, { testMode })); }
    catch (cause) { setError(cause.message); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let mounted = true;
    startWorkshopActivity(activityKey, { testMode })
      .then((createdSession) => {
        if (mounted) setSession(createdSession);
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
    setLoading(true); setError('');
    try {
      const saved = await submitWorkshopActivity(session.sessionId, session.items.map((item) => ({
        itemId: item.itemId,
        answerIndex: answers[item.itemId],
      })), { testMode });
      setResult(saved);
      if (!testMode) await refreshTrailState();
    } catch (cause) { setError(cause.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-3 text-[#f1f7fb]">
      <header className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-[#8edcff]" to={testMode ? '/professor/visao-aluno' : '/trilha/oficina'}><ArrowBackRounded /> Voltar à oficina</Link>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#58cc02]">{testMode ? 'Teste isolado do professor' : 'Rodada com 6 desafios'}</p>
        <h1 className="mt-2 text-3xl font-black text-white">{title}</h1>
        <p className="mt-2 text-sm text-[#a5b7c2]">{testMode ? 'Esta experiência usa o banco real de questões, mas não altera saldo, ranking ou progresso oficial.' : 'Sua nota de 0 a 100 vira CapiCoins. Toda nova rodada concluída durante o período pontua novamente.'}</p>
      </header>

      {loading && !session && <div className="flex min-h-48 items-center justify-center"><span className="h-10 w-10 animate-spin rounded-full border-4 border-[#37464f] border-t-[#58cc02]" /></div>}
      {error && <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-200">{error}</p>}

      {session && !result && (
        <form className="space-y-4" onSubmit={submit}>
          {session.items.map((item, itemIndex) => (
            <fieldset className="rounded-2xl border border-[#37464f] bg-[#1f2d33] p-5" disabled={loading} key={item.itemId}>
              <legend className="px-2 text-xs font-black text-[#49c0f8]">DESAFIO {itemIndex + 1}</legend>
              <p className="mb-4 font-bold leading-6 text-white">{item.prompt}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {item.options.map((option, optionIndex) => (
                  <label className={`cursor-pointer rounded-xl border p-3 text-sm font-semibold transition ${answers[item.itemId] === optionIndex ? 'border-[#58cc02] bg-[#58cc02]/10 text-white' : 'border-[#53666f] text-[#c6d3d9] hover:border-[#8edcff]'}`} key={`${item.itemId}-${option}`}>
                    <input className="sr-only" name={item.itemId} onChange={() => setAnswers((current) => ({ ...current, [item.itemId]: optionIndex }))} type="radio" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="min-h-14 w-full rounded-2xl bg-[#58cc02] text-base font-black text-[#13210f] shadow-[0_4px_0_#46a302] disabled:cursor-not-allowed disabled:opacity-40" disabled={!complete || loading} type="submit">{loading ? 'Conferindo…' : 'Concluir rodada e pontuar'}</button>
        </form>
      )}

      {result && (
        <section className="space-y-5 rounded-3xl border border-[#58cc02]/40 bg-[#1f2d33] p-6 sm:p-8">
          <div className="text-center">
            <CheckCircleRounded className="text-[#58cc02]" sx={{ fontSize: 56 }} />
            <h2 className="mt-2 text-3xl font-black text-white">{result.score} pontos</h2>
            <p className="mt-2 inline-flex items-center gap-2 font-black text-[#ffc800]"><MonetizationOnRounded /> {testMode ? 'Sem CapiCoins no teste' : `+${result.rewardAmount} CapiCoins`}</p>
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
          <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#49c0f8] font-black text-[#10252d]" onClick={() => void start()} type="button"><ReplayRounded /> Fazer nova rodada</button>
        </section>
      )}
    </div>
  );
}
