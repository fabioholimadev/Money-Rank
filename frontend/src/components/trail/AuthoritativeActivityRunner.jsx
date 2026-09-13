import { useMemo, useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Replay from '@mui/icons-material/Replay';
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

export default function AuthoritativeActivityRunner({ phaseNumber, title, testMode = false }) {
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

  if (trailLoading) return <TrailPageShell><div className="p-12 text-center text-[#a5b7c2] font-bold"><div className="w-8 h-8 rounded-full border-4 border-[#58cc02] border-t-transparent animate-spin mx-auto mb-3" />Carregando atividade...</div></TrailPageShell>;
  if (!unlocked) return <TrailLockedState title={`${title} bloqueada`} message={`Conclua o conteúdo da Fase ${phaseNumber} para liberar esta atividade.`} />;

  return (
    <TrailPageShell>
      <div className="w-full py-3 text-[#F8F8F8]">
        <button
          type="button"
          onClick={() => navigate(testMode ? '/professor' : '/trilha')}
          className="mb-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#a5b7c2] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowBack sx={{ fontSize: 18 }} /> {testMode ? 'Voltar ao painel do professor' : 'Voltar ao mapa'}
        </button>

        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#58cc02]">
            Fase {phaseNumber} · {testMode ? 'Ambiente de Teste' : 'Atividade Avaliativa'}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">{title}</h1>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[#a5b7c2]">
            Suas decisões e respostas são auditadas pelo Capi Bank para pontuação segura.
          </p>
        </header>

        {!session && phaseNumber === 2 && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {CHARACTERS.map((character) => (
              <button
                key={character.id}
                type="button"
                onClick={() => setCharacterId(character.id)}
                className={`rounded-3xl border p-6 text-left transition-all cursor-pointer ${
                  characterId === character.id
                    ? 'border-[#58cc02] bg-[#58cc02]/10 ring-2 ring-[#58cc02]/30 shadow-lg'
                    : 'border-[#37464f] bg-[#17262c] hover:border-[#536670]'
                }`}
              >
                <span className="text-xl font-black text-white">{character.name}</span>
                <span className="mt-2 block text-xs sm:text-sm text-[#a5b7c2]">{character.description}</span>
              </button>
            ))}
          </div>
        )}

        {!session && (
          <button
            type="button"
            disabled={loading || (phaseNumber === 2 && !characterId)}
            onClick={start}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] px-8 py-4 text-sm font-black text-[#131f24] shadow-[0_4px_0_#46a302] transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Preparando...' : 'Iniciar Atividade'}
          </button>
        )}

        {session && !result && currentItem && (
          <section className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6 sm:p-9 shadow-2xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-[#a5b7c2]">
              <span className="px-3 py-1 rounded-full bg-[#17262c] border border-[#37464f]">
                Etapa {itemIndex + 1}{phaseNumber === 3 ? ' de 6' : ` de ${items.length}`}
              </span>
              <span className="text-[#58cc02] font-bold">{currentItem.difficulty}</span>
              {phaseNumber === 3 && (
                <span className="text-amber-400 font-bold">Crédito Atual: {currentCredit}</span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black leading-relaxed text-white">
              {currentItem.prompt || currentItem.question}
            </h2>

            <div className="mt-8 grid gap-3.5">
              {(currentItem.options || []).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`rounded-2xl border p-4 sm:p-5 text-left text-sm font-bold transition-all cursor-pointer ${
                    selectedOptionId === option.id
                      ? 'border-[#58cc02] bg-[#58cc02]/10 text-white ring-2 ring-[#58cc02]/30 shadow-md'
                      : 'border-[#37464f] bg-[#17262c] hover:border-[#536670] text-[#f1f7fb]'
                  }`}
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[#1f2d33] border border-[#37464f] text-xs font-black text-[#58cc02]">
                    {option.id}
                  </span>
                  {option.label || option.text}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!selectedOptionId || loading}
              onClick={advance}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] px-8 py-4 text-sm font-black text-[#131f24] shadow-[0_4px_0_#46a302] transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Registrando...' : 'Confirmar e Avançar'} <ArrowForward sx={{ fontSize: 18 }} />
            </button>
          </section>
        )}

        {result && (
          <section className="rounded-3xl border border-[#58cc02]/30 bg-[#1f2d33] p-6 sm:p-9 shadow-2xl">
            <CheckCircle className="text-[#58cc02]" sx={{ fontSize: 48 }} />
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">
              {result.passed ? 'Atividade Aprovada!' : 'Atividade Registrada'}
            </h2>
            {testMode && (
              <p className="mt-2 text-sm font-black text-[#49c0f8]">
                Resultado de teste: nenhuma recompensa ou progressão oficial foi concedida.
              </p>
            )}
            <p className="mt-3 text-5xl font-black text-[#58cc02] tracking-tight">{result.score}/100</p>
            {result.totalPoints !== undefined && (
              <p className="mt-2 text-sm font-bold text-[#dbe7ed]">
                {result.totalPoints}/18 pontos de decisão
              </p>
            )}
            {result.finalCredit !== undefined && (
              <p className="mt-2 text-sm font-bold text-[#dbe7ed]">
                Crédito final: {result.finalCredit} · Final: {result.ending}
              </p>
            )}

            <div className="mt-8 grid gap-3.5">
              {feedback.map((item) => (
                <div
                  key={item.itemId}
                  className="rounded-2xl border border-[#37464f] bg-[#17262c] p-5 text-sm"
                >
                  <p className="font-black text-white">{item.itemId}</p>
                  {item.correctOptionId && (
                    <p className="mt-1 text-xs font-bold text-[#58cc02]">
                      Resposta esperada: {item.correctOptionId}
                    </p>
                  )}
                  {item.feedback && <p className="mt-2 text-xs sm:text-sm text-[#dbe7ed]">{item.feedback}</p>}
                  {item.explanation && (
                    <p className="mt-2 text-xs text-[#a5b7c2] leading-relaxed">{item.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={restart}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl border-2 border-[#37464f] bg-[#17262c] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_0_#0d171b] transition-all hover:border-[#49c0f8] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              <Replay sx={{ fontSize: 18 }} /> Nova Tentativa
            </button>
          </section>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300"
          >
            {error}
          </p>
        )}
      </div>
    </TrailPageShell>
  );
}
