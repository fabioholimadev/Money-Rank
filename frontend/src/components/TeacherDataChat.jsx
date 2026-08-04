import { useRef, useState } from 'react';
import { AutoAwesome, Send } from '@mui/icons-material';
import { askTeacherData } from '../services/teacherDataChatService';

const SUGGESTED_QUESTIONS = [
  'Qual é o resumo deste período?',
  'Compare o 3º DSA com o 3º DSB.',
  'Qual fase apresenta maior dificuldade?',
  'Como está a participação dos alunos?',
];

function AssistantMessage({ message }) {
  return (
    <div className="max-w-3xl rounded-2xl rounded-tl-sm border border-violet-400/20 bg-violet-400/10 p-4">
      <p className="text-sm leading-6 text-slate-100">{message.answer}</p>
      {message.suggestion && (
        <div className="mt-3 border-t border-violet-300/10 pt-3">
          <p className="text-xs font-black uppercase tracking-widest text-violet-300">
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
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

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
    <section className="mt-8 rounded-3xl border border-violet-400/20 bg-slate-900 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
          <AutoAwesome aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-300">
            Chat de Dados
          </p>
          <h2 className="mt-1 text-2xl font-black">Pergunte ao Capi Analista</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Ele responde somente com agregados do período selecionado. Nenhuma
            consulta livre, comando de banco ou dado pessoal é enviado à IA.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => void sendQuestion(suggestion)}
            disabled={!periodId || isSending}
            className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-violet-400/50 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-5 max-h-[420px] space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-4"
      >
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Escolha uma sugestão ou escreva uma pergunta sobre o período.
          </p>
        )}
        {messages.map((message, index) =>
          message.role === 'teacher' ? (
            <div
              key={`teacher-${index}-${message.text}`}
              className="ml-auto max-w-2xl rounded-2xl rounded-tr-sm bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950"
            >
              {message.text}
            </div>
          ) : (
            <AssistantMessage
              key={`assistant-${index}-${message.intent}`}
              message={message}
            />
          ),
        )}
        {isSending && (
          <div role="status" className="flex items-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />
            O Capi Analista está organizando os dados do período…
          </div>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-300">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="teacher-data-question">
          Pergunta sobre os dados do período
        </label>
        <input
          ref={inputRef}
          id="teacher-data-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
          disabled={!periodId || isSending}
          placeholder="Ex.: Em qual fase a turma precisa de mais apoio?"
          className="min-h-12 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-violet-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!periodId || question.trim().length < 5 || isSending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-400 px-5 text-sm font-black text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send sx={{ fontSize: 18 }} aria-hidden="true" />
          Perguntar
        </button>
      </form>
      <p className="mt-2 text-right text-xs text-slate-600">
        {question.length}/500 caracteres
      </p>
    </section>
  );
}
