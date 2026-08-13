import { useMemo, useState } from 'react';
import { ArrowBack, ArrowForward, CheckCircle, Replay } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  advanceAuthoritativeActivitySession,
  startAuthoritativeActivitySession,
  submitAuthoritativeActivitySession,
} from '../../services/activitySessionService';
import { getPhaseProgress, isActivityUnlocked, normalizeCurrentPhase } from '../../lib/trailProgress';
import TrailLockedState from './TrailLockedState';
import TrailPageShell from './TrailPageShell';

const CHARACTERS = Object.freeze([
  { id: 'lara-consumo-social', name: 'Lara', description: 'Consumo social, influência digital e orçamento.' },
  { id: 'miguel-apostas', name: 'Miguel', description: 'Apostas, perseguição de perdas, limites e apoio.' },
  { id: 'rafael-vape', name: 'Rafael', description: 'Custo recorrente, pressão social, dependência e apoio.' },
]);

function sessionItems(phaseNumber, session) {
  if (phaseNumber === 1) return session.questions || [];
  if (phaseNumber === 2) return session.caseData?.decisions || [];
  if (phaseNumber === 3) return session.mission?.currentItem ? [session.mission.currentItem] : [];
  return session.cards || [];
}

function answerFor(phaseNumber, item, optionId) {
  if (phaseNumber === 1) return { questionId: item.id, optionId };
  if (phaseNumber === 2) return { decisionId: item.id, optionId };
  if (phaseNumber === 3) return { decisionId: item.id, choiceId: optionId };
  return { cardId: item.id, optionId };
}

function errorWithDiagnostic(error, fallback) {
  const message = error?.message || fallback;
  const diagnosticCode = error?.payload?.diagnosticCode || error?.payload?.requestId;
  return diagnosticCode ? `${message} Código de diagnóstico: ${diagnosticCode}.` : message;
}

export default function AuthoritativeActivityRunner({ phaseNumber, title, accent = 'amber', testMode = false }) {
  const navigate = useNavigate();
  const { aluno, trailProgress, trailLoading, refreshTrailState } = useAuth();
  const [characterId, setCharacterId] = useState(null);
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentCredit, setCurrentCredit] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(trailProgress, phaseNumber);
  const unlocked = testMode || isActivityUnlocked(phaseNumber, currentPhase, phaseProgress);
  const currentItem = items[itemIndex] ?? null;
  const accentClasses = accent === 'cyan'
    ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
    : 'bg-amber-400 text-slate-950 hover:bg-amber-300';

  const feedback = useMemo(() => Array.isArray(result?.feedback) ? result.feedback : [], [result]);

  async function start() {
    if (phaseNumber === 2 && !characterId) return;
    setLoading(true);
    setError('');
    try {
      const nextSession = await startAuthoritativeActivitySession(phaseNumber, characterId);
      const nextItems = sessionItems(phaseNumber, nextSession);
      if (!nextSession.sessionId || nextItems.length === 0) throw new Error('A rodada segura veio vazia.');
      setSession(nextSession);
      setItems(nextItems);
      setItemIndex(0);
      setSelectedOptionId(null);
      setAnswers([]);
      setCurrentCredit(nextSession.mission?.initialCredit ?? 100);
      setResult(null);
    } catch (startError) {
      setError(errorWithDiagnostic(startError, 'Não foi possível iniciar a atividade.'));
    } finally {
      setLoading(false);
    }
  }

  async function finish(finalAnswers) {
    const completion = await submitAuthoritativeActivitySession(
      session.sessionId,
      phaseNumber === 3 ? undefined : finalAnswers,
    );
    if (!testMode) await refreshTrailState();
    setResult(completion);
  }

  async function advance() {
    if (!currentItem || !selectedOptionId || loading) return;
    setLoading(true);
    setError('');
    try {
      if (phaseNumber === 3) {
        const step = await advanceAuthoritativeActivitySession(
          session.sessionId,
          currentItem.id,
          selectedOptionId,
        );
        const nextAnswers = [...answers, answerFor(phaseNumber, currentItem, selectedOptionId)];
        setAnswers(nextAnswers);
        setCurrentCredit(step.currentCredit);
        setSelectedOptionId(null);
        if (step.completed) {
          await finish(nextAnswers);
        } else {
          setItems((current) => [...current, step.nextItem]);
          setItemIndex((current) => current + 1);
        }
        return;
      }

      const nextAnswers = [...answers, answerFor(phaseNumber, currentItem, selectedOptionId)];
      setAnswers(nextAnswers);
      setSelectedOptionId(null);
      if (itemIndex + 1 >= items.length) {
        await finish(nextAnswers);
      } else {
        setItemIndex((current) => current + 1);
      }
    } catch (advanceError) {
      setError(errorWithDiagnostic(advanceError, 'Não foi possível registrar a resposta.'));
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setSession(null);
    setItems([]);
    setItemIndex(0);
    setSelectedOptionId(null);
    setAnswers([]);
    setResult(null);
    setError('');
  }

  if (trailLoading) return <TrailPageShell><p className="p-8 text-center text-white">Carregando atividade...</p></TrailPageShell>;
  if (!unlocked) return <TrailLockedState title={`${title} bloqueada`} message={`Conclua o conteúdo da Fase ${phaseNumber} para liberar esta atividade.`} />;

  return (
    <TrailPageShell>
      <div className="w-full py-3 text-white">
        <button type="button" onClick={() => navigate(testMode ? '/professor' : '/trilha')} className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white">
          <ArrowBack sx={{ fontSize: 19 }} /> {testMode ? 'Voltar ao painel do professor' : 'Voltar ao mapa'}
        </button>
        <header className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Fase {phaseNumber} · {testMode ? 'teste isolado' : 'atividade autoritativa'}</p>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">As respostas, pesos e explicações permanecem no servidor até a submissão final.</p>
        </header>

        {!session && phaseNumber === 2 && (
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {CHARACTERS.map((character) => (
              <button key={character.id} type="button" onClick={() => setCharacterId(character.id)} className={`rounded-2xl border p-5 text-left ${characterId === character.id ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 bg-slate-900'}`}>
                <span className="text-lg font-black">{character.name}</span>
                <span className="mt-2 block text-sm text-slate-400">{character.description}</span>
              </button>
            ))}
          </div>
        )}

        {!session && (
          <button type="button" disabled={loading || (phaseNumber === 2 && !characterId)} onClick={start} className={`rounded-xl px-6 py-3 font-black disabled:opacity-50 ${accentClasses}`}>
            {loading ? 'Preparando...' : 'Iniciar atividade'}
          </button>
        )}

        {session && !result && currentItem && (
          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span>Etapa {itemIndex + 1}{phaseNumber === 3 ? ' de 6' : ` de ${items.length}`}</span>
              <span>{currentItem.difficulty}</span>
              {phaseNumber === 3 && <span>Crédito atual: {currentCredit}</span>}
            </div>
            <h2 className="text-xl font-black leading-relaxed">{currentItem.prompt || currentItem.question}</h2>
            <div className="mt-6 grid gap-3">
              {(currentItem.options || []).map((option) => (
                <button key={option.id} type="button" onClick={() => setSelectedOptionId(option.id)} className={`rounded-2xl border p-4 text-left text-sm font-semibold ${selectedOptionId === option.id ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 bg-slate-950 hover:border-slate-500'}`}>
                  <span className="mr-3 font-black">{option.id}</span>{option.label || option.text}
                </button>
              ))}
            </div>
            <button type="button" disabled={!selectedOptionId || loading} onClick={advance} className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-black disabled:opacity-50 ${accentClasses}`}>
              {loading ? 'Registrando...' : 'Confirmar e avançar'} <ArrowForward sx={{ fontSize: 19 }} />
            </button>
          </section>
        )}

        {result && (
          <section className="rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 sm:p-8">
            <CheckCircle className="text-emerald-400" sx={{ fontSize: 42 }} />
            <h2 className="mt-3 text-2xl font-black">{result.passed ? 'Atividade aprovada' : 'Atividade registrada'}</h2>
            {testMode && <p className="mt-2 text-sm font-black text-violet-300">Resultado de teste: nenhuma recompensa ou progressão oficial foi concedida.</p>}
            <p className="mt-2 text-4xl font-black text-emerald-300">{result.score}/100</p>
            {result.totalPoints !== undefined && <p className="mt-2 text-sm text-slate-300">{result.totalPoints}/18 pontos de decisão</p>}
            {result.finalCredit !== undefined && <p className="mt-2 text-sm text-slate-300">Crédito final: {result.finalCredit} · Final: {result.ending}</p>}
            <div className="mt-6 grid gap-3">
              {feedback.map((item) => (
                <div key={item.itemId} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm">
                  <p className="font-black">{item.itemId}</p>
                  {item.correctOptionId && <p className="mt-1 text-emerald-300">Resposta esperada: {item.correctOptionId}</p>}
                  {item.feedback && <p className="mt-2 text-slate-300">{item.feedback}</p>}
                  {item.explanation && <p className="mt-2 text-slate-400">{item.explanation}</p>}
                </div>
              ))}
            </div>
            <button type="button" onClick={restart} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 font-black hover:border-white">
              <Replay sx={{ fontSize: 19 }} /> Nova tentativa
            </button>
          </section>
        )}

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
      </div>
    </TrailPageShell>
  );
}
