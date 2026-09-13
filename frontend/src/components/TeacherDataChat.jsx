import { useEffect, useRef, useState } from 'react';
import {
  AutoAwesome,
  Close,
  ErrorOutlined,
  Send,
} from '@mui/icons-material';
import { askTeacherData } from '../services/teacherDataChatService';

const SUGGESTED_QUESTIONS = [
  'Qual é o resumo deste período?',
  'Compare o 3º DSA com o 3º DSB.',
  'Qual fase apresenta maior dificuldade?',
  'Como está a participação dos alunos?',
];

function AssistantMessage({ message }) {
  return (
    <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-[#49c0f8]/20 bg-[#49c0f8]/10 px-3.5 py-3">
      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
        Dado calculado no período selecionado
      </p>
      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-100">
        {message.answer}
      </p>
      {message.suggestion && (
        <div className="mt-3 border-t border-[#37464f] pt-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#7ed5fb]">
            Interpretação pedagógica
          </p>
          <p className="mt-1 text-sm leading-6 text-[#d8e2e7]">
            {message.suggestion}
          </p>
        </div>
      )}
      {message.aiStatus === 'unavailable' && (
        <p className="mt-3 text-[11px] font-bold text-[#79e72e]">
          A IA de interpretação está indisponível; os dados calculados acima continuam válidos.
          {message.diagnosticCode ? ` Código: ${message.diagnosticCode}.` : ''}
        </p>
      )}
      {message.scope && (
        <p className="mt-3 text-[11px] leading-5 text-[#78909b]">
          {message.scope}. {message.limitations}
        </p>
      )}
    </div>
  );
}

export default function TeacherDataChat({ periodId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 150);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const closePanel = () => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const sendQuestion = async (value) => {
    const normalizedQuestion = String(value || '').trim().replace(/\s+/g, ' ');
    if (!periodId || normalizedQuestion.length < 5 || isSending) return;

    setMessages((current) => [
      ...current,
      { role: 'teacher', text: normalizedQuestion },
    ]);
    setQuestion('');
    setErrorMessage('');
    setIsSending(true);

    try {
      const response = await askTeacherData({
        periodId,
        question: normalizedQuestion,
      });
      setMessages((current) => [
        ...current,
        { role: 'assistant', ...response },
      ]);
    } catch (error) {
      setErrorMessage(
        error?.message || 'Não foi possível consultar o Capi Analista.',
      );
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void sendQuestion(question);
  };

  return (
    <>
      <style>{`
        @keyframes capi-analyst-pop {
          0% { opacity: 0; transform: translateY(16px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes capi-analyst-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .capi-analyst-panel { animation: capi-analyst-pop 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
        .capi-analyst-message { animation: capi-analyst-fade 0.25s ease both; }
      `}</style>

      {!isOpen && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={!periodId}
          aria-haspopup="dialog"
          aria-controls="teacher-data-chat-dialog"
          className="fixed bottom-24 right-5 z-[60] inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#49c0f8] px-4 py-3 font-black text-[#13210f] shadow-[0_4px_0_#1683b7] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 md:bottom-5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#131f24]/10">
            <AutoAwesome aria-hidden="true" sx={{ fontSize: 22 }} />
          </span>
          <span className="hidden sm:inline">Perguntar ao Capi Analista</span>
          <span className="sr-only sm:hidden">Abrir o Capi Analista</span>
          <span className="absolute -right-1 -top-1 flex h-3 w-3" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58cc02] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#58cc02]" />
          </span>
        </button>
      )}

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar o Capi Analista"
            onClick={closePanel}
            className="fixed inset-0 z-50 cursor-default bg-[#0d171b]/70 md:hidden"
          />
          <section
            id="teacher-data-chat-dialog"
            role="dialog"
            aria-labelledby="teacher-data-chat-title"
            aria-describedby="teacher-data-chat-description"
            className="capi-analyst-panel fixed inset-x-0 bottom-[4.5rem] z-[60] flex h-[min(75dvh,680px)] w-full flex-col rounded-t-3xl border-2 border-[#37464f] bg-[#1f2d33]/98 shadow-2xl backdrop-blur-md md:bottom-5 md:left-auto md:right-5 md:h-[min(680px,calc(100vh-2.5rem))] md:w-[410px] md:rounded-3xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b-2 border-[#37464f] bg-[#17262c] px-4 py-3.5 md:rounded-t-3xl">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#49c0f8]/10 text-[#7ed5fb] ring-2 ring-[#49c0f8]/30">
                  <AutoAwesome aria-hidden="true" sx={{ fontSize: 21 }} />
                </span>
                <div className="min-w-0">
                  <h2 id="teacher-data-chat-title" className="truncate text-sm font-black text-white">
                    Capi Analista
                  </h2>
                  <p className="text-[11px] font-semibold text-emerald-400">
                    online • dados pedagógicos agregados
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Fechar"
                className="rounded-lg p-2 text-[#78909b] transition hover:bg-[#17262c] hover:text-white"
              >
                <Close aria-hidden="true" sx={{ fontSize: 20 }} />
              </button>
            </header>

            <p id="teacher-data-chat-description" className="shrink-0 border-b border-[#37464f] px-4 py-3 text-xs leading-5 text-[#78909b]">
              Respostas usam somente dados agregados do período selecionado, sem e-mail, UID ou comando livre de banco.
            </p>

            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4"
            >
              {messages.length === 0 && (
                <div className="rounded-2xl rounded-bl-sm border border-[#49c0f8]/20 bg-[#49c0f8]/10 p-4 text-sm leading-6 text-slate-200">
                  Olá! Posso resumir o período, comparar turmas e apontar atividades que merecem mais atenção. O que você quer analisar?
                </div>
              )}

              {messages.map((message, index) =>
                message.role === 'teacher' ? (
                  <div
                    key={`teacher-${index}-${message.text}`}
                    className="capi-analyst-message ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-[#58cc02] px-3.5 py-2.5 text-sm font-semibold leading-6 text-[#13210f]"
                  >
                    {message.text}
                  </div>
                ) : (
                  <div key={`assistant-${index}-${message.intent}`} className="capi-analyst-message">
                    <AssistantMessage message={message} />
                  </div>
                ),
              )}

              {isSending && (
                <div role="status" className="capi-analyst-message flex items-center gap-2 text-sm text-[#a5b7c2]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#58cc02]" />
                  Organizando os dados do período…
                </div>
              )}

              {errorMessage && (
                <div role="alert" className="capi-analyst-message flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                  <ErrorOutlined aria-hidden="true" className="mt-0.5 shrink-0" sx={{ fontSize: 16 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {messages.length === 0 && !isSending && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void sendQuestion(suggestion)}
                      disabled={!periodId || isSending}
                      className="rounded-2xl border-2 border-[#37464f] bg-[#17262c] px-3 py-2 text-left text-xs font-semibold text-[#dbe7ed] transition hover:border-[#49c0f8] hover:text-[#49c0f8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="shrink-0 border-t-2 border-[#37464f] bg-[#17262c] p-3 md:rounded-b-3xl">
              <label className="sr-only" htmlFor="teacher-data-question">
                Pergunta sobre os dados do período
              </label>
              <div className="flex items-end gap-2 rounded-2xl border border-[#53666f] bg-[#131f24]/60 p-1.5 transition focus-within:border-[#49c0f8]/60">
                <textarea
                  ref={inputRef}
                  id="teacher-data-question"
                  rows={1}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void sendQuestion(question);
                    }
                  }}
                  disabled={!periodId || isSending}
                  placeholder="Pergunte sobre turmas e atividades…"
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-white outline-none placeholder:text-[#78909b] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!periodId || question.trim().length < 5 || isSending}
                  aria-label="Enviar pergunta"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#58cc02] text-[#13210f] transition hover:bg-[#70e823] active:scale-90 disabled:cursor-not-allowed disabled:bg-[#37464f] disabled:text-[#78909b]"
                >
                  <Send aria-hidden="true" sx={{ fontSize: 18 }} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-600">
                {question.length}/500 • confira decisões importantes no painel.
              </p>
            </form>
          </section>
        </>
      )}
    </>
  );
}
