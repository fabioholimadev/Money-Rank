import { useState } from 'react';
import {
  createStudioResearch,
  reviewStudioResearch,
} from '../../services/teacherStudioService';
import {
  inputClassName,
  StudioField,
  StudioSection,
  textareaClassName,
} from './StudioFields';

const EMPTY_FORM = {
  activityKey: 'perigo-doce-quiz',
  factKey: '',
  title: '',
  claim: '',
  sourceUrl: '',
  proposedBy: 'TEACHER',
};

export default function ResearchReviewPanel({ research, onRefresh }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');

  const submitResearch = async (event) => {
    event.preventDefault();
    setBusyId('new');
    setMessage('');
    try {
      await createStudioResearch(form);
      setForm(EMPTY_FORM);
      setMessage('Fonte adicionada à fila de validação.');
      await onRefresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyId('');
    }
  };

  const decide = async (reviewId, status) => {
    setBusyId(reviewId);
    setMessage('');
    try {
      await reviewStudioResearch(
        reviewId,
        status,
        status === 'TEACHER_APPROVED'
          ? 'Fonte conferida pelo professor no Estúdio.'
          : 'Fonte recusada pelo professor no Estúdio.',
      );
      await onRefresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-5">
      <StudioSection
        title="Adicionar fonte para validação"
        description="Codex, Gemini ou o professor podem sugerir. Somente a decisão do professor muda o status pedagógico."
      >
        <form className="space-y-4" onSubmit={submitResearch}>
          <div className="grid gap-4 md:grid-cols-3">
            <StudioField label="Atividade">
              <select
                className={inputClassName}
                value={form.activityKey}
                onChange={(event) =>
                  setForm({ ...form, activityKey: event.target.value })
                }
              >
                <option value="perigo-doce-quiz">O Perigo do Doce</option>
                <option value="custo-vicio">O Custo do Vício</option>
                <option value="ilusao-dinheiro-caminhos-v1">A Ilusão do Dinheiro</option>
                <option value="engenharia-desejo-fato-fake-v1">A Engenharia do Desejo</option>
              </select>
            </StudioField>
            <StudioField label="Identificador interno">
              <input
                className={inputClassName}
                value={form.factKey}
                placeholder="ex.: anvisa-rotulagem"
                onChange={(event) => setForm({ ...form, factKey: event.target.value })}
                required
              />
            </StudioField>
            <StudioField label="Origem da sugestão">
              <select
                className={inputClassName}
                value={form.proposedBy}
                onChange={(event) => setForm({ ...form, proposedBy: event.target.value })}
              >
                <option value="TEACHER">Professor</option>
                <option value="CODEX">Codex</option>
                <option value="GEMINI">Gemini</option>
              </select>
            </StudioField>
          </div>
          <StudioField label="Título da fonte">
            <input
              className={inputClassName}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </StudioField>
          <StudioField label="Afirmação que a fonte sustenta">
            <textarea
              className={textareaClassName}
              value={form.claim}
              onChange={(event) => setForm({ ...form, claim: event.target.value })}
              required
            />
          </StudioField>
          <StudioField label="URL HTTPS da fonte">
            <input
              type="url"
              className={inputClassName}
              value={form.sourceUrl}
              onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}
              required
            />
          </StudioField>
          <button
            type="submit"
            disabled={busyId === 'new'}
            className="min-h-11 rounded-xl bg-amber-400 px-5 text-sm font-black text-slate-950 disabled:opacity-50"
          >
            {busyId === 'new' ? 'Registrando...' : 'Adicionar à fila'}
          </button>
        </form>
      </StudioSection>

      {message && (
        <p className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
          {message}
        </p>
      )}

      <div className="space-y-3">
        {research.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  {item.activityKey} · {item.proposedBy}
                </p>
                <h3 className="mt-1 font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.claim}</p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-bold text-amber-300 underline"
                >
                  Conferir fonte original
                </a>
              </div>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-black text-slate-300">
                {item.status}
              </span>
            </div>
            {item.status === 'PENDING_TEACHER_REVIEW' && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => decide(item.id, 'TEACHER_APPROVED')}
                  className="min-h-10 rounded-xl bg-emerald-400 px-4 text-sm font-black text-slate-950 disabled:opacity-50"
                >
                  Aprovar fonte
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => decide(item.id, 'REJECTED')}
                  className="min-h-10 rounded-xl border border-red-500/40 px-4 text-sm font-black text-red-300 disabled:opacity-50"
                >
                  Rejeitar
                </button>
              </div>
            )}
          </article>
        ))}
        {research.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            Nenhuma pesquisa aguardando validação.
          </p>
        )}
      </div>
    </div>
  );
}
