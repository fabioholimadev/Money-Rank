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
    <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-violet-400/20 bg-violet-400/10 px-3.5 py-3">
      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-100">
        {message.answer}
      </p>
      {message.suggestion && (
        <div className="mt-3 border-t border-violet-300/10 pt-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-300">
            Possível ação pedagógica
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            {message.suggestion}
          </p>
        </div>
      )}
      {message.scope && (
        <p className="mt-3 text-[11px] leading-5 text-slate-500">
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
          className="fixed bottom-24 right-5 z-[60] inline-flex min-h-14 items-center gap-3 rounded-2xl bg-violet-400 px-4 py-3 font-black text-slate-950 shadow-xl shadow-violet-500/25 transition hover:scale-105 hover:bg-violet-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:bottom-5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/10">
            <AutoAwesome aria-hidden="true" sx={{ fontSize: 22 }} />
          </span>
          <span className="hidden sm:inline">Perguntar ao Capi Analista</span>
          <span className="sr-only sm:hidden">Abrir o Capi Analista</span>
          <span className="absolute -right-1 -top-1 flex h-3 w-3" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-200" />
          </span>
        </button>
      )}

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar o Capi Analista"
            onClick={closePanel}
            className="fixed inset-0 z-[59] cursor-default bg-black/50 md:hidden"
          />
          <section
            id="teacher-data-chat-dialog"
            role="dialog"
            aria-labelledby="teacher-data-chat-title"
            aria-describedby="teacher-data-chat-description"
            className="capi-analyst-panel fixed inset-x-0 bottom-0 z-[60] flex h-[75vh] w-full flex-col rounded-t-3xl border border-zinc-800 bg-zinc-900/95 shadow-2xl shadow-black/50 backdrop-blur-md md:bottom-5 md:left-auto md:right-5 md:h-[min(680px,calc(100vh-2.5rem))] md:w-[410px] md:rounded-3xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3.5 md:rounded-t-3xl">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300 ring-2 ring-violet-400/20">
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
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <Close aria-hidden="true" sx={{ fontSize: 20 }} />
              </button>
            </header>

            <p id="teacher-data-chat-description" className="shrink-0 border-b border-zinc-800 px-4 py-3 text-xs leading-5 text-slate-500">
              Respostas usam somente dados agregados do período selecionado, sem e-mail, UID ou comando livre de banco.
            </p>

            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4"
            >
              {messages.length === 0 && (
                <div className="rounded-2xl rounded-bl-sm border border-violet-400/20 bg-violet-400/10 p-4 text-sm leading-6 text-slate-200">
                  Olá! Posso resumir o período, comparar turmas e apontar atividades que merecem mais atenção. O que você quer analisar?
                </div>
              )}

              {messages.map((message, index) =>
                message.role === 'teacher' ? (
                  <div
                    key={`teacher-${index}-${message.text}`}
                    className="capi-analyst-message ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-amber-400 px-3.5 py-2.5 text-sm font-semibold leading-6 text-slate-950"
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
                <div role="status" className="capi-analyst-message flex items-center gap-2 text-sm text-slate-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />
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
                      className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-left text-xs font-semibold text-violet-200 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="shrink-0 border-t border-zinc-800 p-3 md:rounded-b-3xl">
              <label className="sr-only" htmlFor="teacher-data-question">
                Pergunta sobre os dados do período
              </label>
              <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 p-1.5 transition focus-within:border-violet-400/60">
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
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!periodId || question.trim().length < 5 || isSending}
                  aria-label="Enviar pergunta"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400 text-slate-950 transition hover:bg-violet-300 active:scale-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
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
