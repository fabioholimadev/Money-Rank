import { useState, useRef, useEffect } from 'react';
import {
  Close,
  Send,
  AutoAwesome,
  ErrorOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { askStudentMentor } from '../services/mentorService';

/**
 * CapiMentor — Tutor de IA flutuante do Money Rank.
 *
 * - Aparece como um botão flutuante (FAB) no canto inferior direito.
 * - Só é renderizado quando há um aluno logado (segurança + UX).
 * - Conversa com uma callable Function protegida por Firebase Auth e App Check.
 * - A chave da IA fica EXCLUSIVAMENTE no backend. Aqui nunca trafega segredo.
 *
 * Monte-o UMA vez, de forma global (ver App.jsx), para que o histórico
 * da conversa não se perca ao trocar de rota.
 */

const SUGESTOES = [
  'Como impostos e cidadania se conectam?',
  'Por que aposta não é investimento?',
  'Como saúde e consumo afetam a sociedade?',
];

const MENTOR_AVATAR = '/avatars/capi-mentor.jpg';

export default function CapiMentor() {
  const { aluno } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [rascunho, setRascunho] = useState('');
  const [mensagens, setMensagens] = useState([
    {
      role: 'assistant',
      content:
        'Oi! Eu sou o CapiMentor 🦫 Posso ajudar com educação financeira e fiscal, cidadania, saúde, consumo, direitos e políticas públicas. Quando a pesquisa online estiver ativa, também mostro as fontes usadas. Qual tema você quer explorar?',
    },
  ]);

  const fimDaListaRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, carregando]);

  // Foca o input ao abrir
  useEffect(() => {
    if (aberto) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [aberto]);

  // Não renderiza nada se o aluno não estiver logado
  if (!aluno) return null;

  const enviar = async (textoOverride) => {
    const texto = (textoOverride ?? rascunho).trim();
    if (!texto || carregando) return;

    setErro(null);
    setRascunho('');

    // Otimista: adiciona a mensagem do aluno na hora
    const novaConversa = [...mensagens, { role: 'user', content: texto }];
    setMensagens(novaConversa);
    setCarregando(true);

    try {
      const resposta = await askStudentMentor(texto);

      setMensagens((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: resposta.answer,
          sources: resposta.sources,
          searchSuggestionsHtml: resposta.searchSuggestionsHtml,
          generatedBy: resposta.generatedBy,
        },
      ]);
    } catch (e) {
      console.error('[CapiMentor] erro:', e);
      const code = e?.payload?.diagnosticCode;
      setErro(`${e.message || 'Falha na conexão com o mentor.'}${code ? ` Código de diagnóstico: ${code}.` : ''}`);
    } finally {
      setCarregando(false);
    }
  };

  const aoTeclar = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <>
      {/* Keyframes locais — componente autossuficiente, sem depender do index.css */}
      <style>{`
        @keyframes capi-pop {
          0% { opacity: 0; transform: translateY(16px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes capi-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes capi-blink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
        .capi-panel { animation: capi-pop 0.22s cubic-bezier(0.16,1,0.3,1); }
        .capi-msg { animation: capi-fade 0.25s ease both; }
        .capi-dot { animation: capi-blink 1.2s infinite ease-in-out; }
      `}</style>

      {/* ── BOTÃO FLUTUANTE (FAB) ───────────────────────────────────────── */}
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          aria-label="Abrir o CapiMentor"
          className="fixed bottom-24 md:bottom-5 right-5 z-[60] flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 font-black text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 hover:bg-amber-300 active:scale-95"
        >
          <img
            src={MENTOR_AVATAR}
            alt=""
            className="h-8 w-8 rounded-xl object-cover ring-2 ring-slate-950/20"
          />
          <span className="hidden sm:inline">Falar com o CapiMentor</span>
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-200" />
          </span>
        </button>
      )}

      {/* ── PAINEL DO CHAT ──────────────────────────────────────────────── */}
      {aberto && (
        <>
          {/* Backdrop (apenas mobile) */}
          <div 
            className="fixed inset-0 z-[59] bg-black/50 md:hidden"
            onClick={() => setAberto(false)}
          />
          
          <div
            className="capi-panel fixed inset-x-0 bottom-0 z-[60] flex flex-col w-full h-[70vh] md:h-[600px] md:w-[380px] md:bottom-5 md:right-5 md:left-auto md:rounded-3xl rounded-t-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-2xl shadow-black/50"
            role="dialog"
            aria-label="CapiMentor — Tutor de IA"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-zinc-800 px-3 md:px-4 py-3 md:py-3.5 md:rounded-t-3xl flex-shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={MENTOR_AVATAR}
                  alt="Avatar do CapiMentor"
                  className="h-10 w-10 rounded-2xl object-cover ring-2 ring-amber-400/30"
                />
                <div>
                  <p className="flex items-center gap-1 text-xs md:text-sm font-black text-white">
                    CapiMentor
                    <AutoAwesome sx={{ fontSize: 12 }} className="text-amber-400" />
                  </p>
                  <p className="text-[10px] md:text-[11px] font-semibold text-emerald-400">
                    online • tutor de finanças
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </header>

            {/* Mensagens */}
            <div className="flex-1 space-y-2 md:space-y-3 overflow-y-auto px-3 md:px-4 py-3 md:py-4">
              {mensagens.map((m, i) => (
                <div
                  key={i}
                  className={`capi-msg flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 md:px-3.5 py-2 md:py-2.5 text-xs md:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-amber-400 font-medium text-slate-950'
                        : 'rounded-bl-md border border-zinc-800 bg-slate-950/60 text-slate-200'
                    }`}
                  >
                    {m.content}
                    {m.generatedBy && (
                      <p className={`mt-2 text-[10px] font-bold ${
                        m.generatedBy === 'policy' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {m.generatedBy === 'gemini-grounded'
                          ? 'Gemini + Pesquisa Google'
                          : m.generatedBy === 'gemini'
                            ? 'Gemini'
                            : 'Orientação de segurança'}
                      </p>
                    )}
                    {m.sources?.length > 0 && (
                      <div className="mt-3 border-t border-slate-700/70 pt-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                          Fontes para conferir
                        </p>
                        <ul className="mt-1.5 space-y-1">
                          {m.sources.map((source) => (
                            <li key={`${source.url}-${source.title}`}>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-200"
                              >
                                {source.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {m.searchSuggestionsHtml && (
                      <div
                        className="mt-2 overflow-hidden rounded-lg text-[10px]"
                        dangerouslySetInnerHTML={{
                          __html: m.searchSuggestionsHtml,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Indicador "digitando" */}
              {carregando && (
              <div className="capi-msg flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-800 bg-slate-950/60 px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="capi-dot h-1.5 w-1.5 rounded-full bg-amber-400"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div className="capi-msg flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                <ErrorOutlined sx={{ fontSize: 16 }} className="mt-0.5 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {/* Sugestões — só na conversa "limpa" */}
            {mensagens.length === 1 && !carregando && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGESTOES.map((s) => (
                  <button
                    key={s}
                    onClick={() => enviar(s)}
                    className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={fimDaListaRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800 p-3 sm:rounded-b-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-950/60 p-1.5 focus-within:border-amber-400/50 transition-colors">
              <textarea
                ref={inputRef}
                rows={1}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value.slice(0, 500))}
                onKeyDown={aoTeclar}
                placeholder="Pergunte sobre impostos, dinheiro…"
                className="max-h-28 flex-1 resize-none bg-transparent px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                onClick={() => enviar()}
                disabled={carregando || !rascunho.trim()}
                aria-label="Enviar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 transition-all hover:bg-amber-300 active:scale-90 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
              >
                <Send sx={{ fontSize: 18 }} />
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[10px] text-slate-600">
              O CapiMentor pode errar. Confira com o professor ou uma fonte oficial.
            </p>
         </div>
        </div>
        </> 
      )}
    </>
  );
}
