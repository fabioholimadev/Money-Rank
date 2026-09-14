import { useState, useRef, useEffect } from 'react';
import Close from '@mui/icons-material/Close';
import Send from '@mui/icons-material/Send';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
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
const QUESTION_MAX_LENGTH = 1_200;

function InlineMarkdown({ children }) {
  return String(children || '').split(/(\*\*[^*\n]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={`${part}-${index}`} className="font-black text-white">{part.slice(2, -2)}</strong>
      : part,
  );
}

function FormattedMessage({ content }) {
  return (
    <div className="space-y-2.5">
      {String(content || '').split('\n').map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return null;
        if (/^-{3,}$/.test(line)) return <hr key={`separator-${index}`} className="border-[#37464f]" />;

        const heading = line.match(/^#{1,6}\s+(.+)$/)?.[1];
        if (heading) return <p key={`heading-${index}`} className="pt-1 font-black text-white"><InlineMarkdown>{heading}</InlineMarkdown></p>;

        const listItem = line.match(/^(?:[-*]|•|\d+[.)])\s+(.+)$/)?.[1];
        if (listItem) return <p key={`item-${index}`} className="flex gap-2"><span className="font-black text-[#58cc02]">•</span><span><InlineMarkdown>{listItem}</InlineMarkdown></span></p>;

        return <p key={`paragraph-${index}`}><InlineMarkdown>{line}</InlineMarkdown></p>;
      })}
    </div>
  );
}

function modelLabel(model, grounded) {
  const normalized = String(model || '').trim();
  const readable = normalized
    ? normalized.split('-').map((part) => part === 'gemini' ? 'Gemini' : part === 'flash' ? 'Flash' : part).join(' ')
    : 'Gemini';
  return grounded ? `${readable} + Pesquisa Google` : readable;
}

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
          model: resposta.model,
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
      {/* ── BOTÃO FLUTUANTE (FAB) ────────────────────────────────────────── */}
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          aria-label="Abrir CapiMentor (assistente de IA)"
          className="group fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#49c0f8] bg-[#1f2d33] shadow-[0_4px_0_#1683b7] transition-all hover:-translate-y-0.5 active:translate-y-1 active:shadow-none md:bottom-6 md:right-6 cursor-pointer"
        >
          <img
            src={MENTOR_AVATAR}
            alt="CapiMentor"
            className="h-11 w-11 rounded-xl object-cover ring-2 ring-[#49c0f8]/50 transition-all group-hover:ring-[#58cc02]"
          />
          {/* Badge pulsante online */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#58cc02] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#1f2d33] bg-[#58cc02]" />
          </span>
        </button>
      )}

      {/* ── PAINEL DO CHAT (GLASSMORPHISM DARK NEON) ────────────────────── */}
      {aberto && (
        <>
          {/* Backdrop (apenas mobile) */}
          <div 
            className="fixed inset-0 z-50 bg-[#0d171b]/70 backdrop-blur-xs md:hidden"
            onClick={() => setAberto(false)}
          />
          
          <div
            className="capi-panel fixed inset-x-0 bottom-[4.5rem] z-[60] flex h-[min(75dvh,620px)] w-full flex-col rounded-t-3xl border-2 border-[#37464f] bg-[#1f2d33]/98 shadow-2xl backdrop-blur-xl md:bottom-6 md:left-auto md:right-6 md:h-[620px] md:w-[400px] md:rounded-3xl"
            role="dialog"
            aria-label="CapiMentor — Tutor de IA"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#37464f] px-4 py-3.5 md:rounded-t-3xl flex-shrink-0 bg-[#131f24]/50">
              <div className="flex items-center gap-3">
                <img
                  src={MENTOR_AVATAR}
                  alt="Avatar do CapiMentor"
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-[#49c0f8]/60 shadow-md"
                />
                <div>
                  <p className="flex items-center gap-1 text-sm font-black text-white">
                    CapiMentor
                    <AutoAwesome sx={{ fontSize: 14 }} className="text-amber-400 animate-spin-slow" />
                  </p>
                  <p className="text-[11px] font-bold text-[#58cc02]">
                    Online • Tutor Especialista
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="rounded-xl p-1.5 text-[#a5b7c2] transition-colors hover:bg-white/[0.08] hover:text-white cursor-pointer"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </header>

            {/* Mensagens */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin">
              {mensagens.map((m, i) => (
                <div
                  key={i}
                  className={`capi-msg flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'rounded-br-xs bg-[#58cc02] font-bold text-[#131f24]'
                        : 'rounded-bl-xs border border-[#37464f] bg-[#17262c] text-[#f1f7fb]'
                    }`}
                  >
                    <FormattedMessage content={m.content} />
                    {m.generatedBy && (
                      <p className={`mt-2 text-[10px] font-black uppercase tracking-wider ${
                        m.generatedBy === 'policy' ? 'text-amber-400' : 'text-[#58cc02]'
                      }`}>
                        {m.generatedBy === 'gemini-grounded'
                          ? modelLabel(m.model, true)
                          : m.generatedBy === 'gemini'
                            ? modelLabel(m.model, false)
                            : 'Diretriz de Segurança'}
                      </p>
                    )}
                    {m.sources?.length > 0 && (
                      <div className="mt-3 border-t border-[#37464f] pt-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                          Fontes Auditadas
                        </p>
                        <ul className="mt-1.5 space-y-1">
                          {m.sources.map((source) => (
                            <li key={`${source.url}-${source.title}`}>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-medium text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-300"
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
                        className="mt-2 overflow-hidden rounded-xl text-[10px]"
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
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-xs border border-[#37464f] bg-[#17262c] px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="capi-dot h-2 w-2 rounded-full bg-[#58cc02]"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Erro */}
            {erro && (
              <div className="capi-msg flex items-start gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
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
                    className="cursor-pointer rounded-2xl border-2 border-[#37464f] bg-[#17262c] px-3.5 py-2 text-left text-xs font-bold text-[#dbe7ed] transition-colors hover:border-[#49c0f8] hover:text-[#49c0f8]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={fimDaListaRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-[#37464f] bg-[#17262c] p-3 sm:rounded-b-3xl">
            <div className="flex items-end gap-2 rounded-2xl border-2 border-[#37464f] bg-[#131f24] p-2 transition-all focus-within:border-[#49c0f8]">
              <textarea
                ref={inputRef}
                rows={1}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value.slice(0, QUESTION_MAX_LENGTH))}
                maxLength={QUESTION_MAX_LENGTH}
                onKeyDown={aoTeclar}
                placeholder="Tire dúvidas sobre finanças e cidadania…"
                className="max-h-28 flex-1 resize-none bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder:text-[#78909c] focus:outline-none"
              />
              <button
                onClick={() => enviar()}
                disabled={carregando || !rascunho.trim()}
                aria-label="Enviar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#58cc02] text-[#131f24] font-black transition-all hover:bg-[#46a302] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#37464f] disabled:text-[#78909c] shadow-sm cursor-pointer"
              >
                <Send sx={{ fontSize: 18 }} />
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[10px] text-[#78909c] font-medium">
              {rascunho.length}/{QUESTION_MAX_LENGTH} • O CapiMentor é um tutor IA para estudos. Confirme decisões importantes.
            </p>
         </div>
        </div>
        </> 
      )}
    </>
  );
}
