import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowBack,
  CheckCircle,
  EditNote,
  History,
  MenuBook,
  Preview,
  Publish,
  Refresh,
  Science,
  Save,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LearningModuleEditor from '../components/teacherStudio/LearningModuleEditor';
import ResearchReviewPanel from '../components/teacherStudio/ResearchReviewPanel';
import StructuredActivityEditor from '../components/teacherStudio/StructuredActivityEditor';
import {
  inputClassName,
  StudioField,
  textareaClassName,
} from '../components/teacherStudio/StudioFields';
import {
  createStudioDraft,
  fetchTeacherStudio,
  publishStudioVersion,
  saveStudioDraft,
  submitStudioReview,
  uploadStudioAsset,
} from '../services/teacherStudioService';

const TABS = [
  { id: 'LEARNING_MODULE', label: 'Conteúdos', Icon: MenuBook },
  { id: 'ACTIVITY_DEFINITION', label: 'Atividades', Icon: EditNote },
  { id: 'RESEARCH', label: 'Pesquisas', Icon: Science },
  { id: 'AUDIT', label: 'Histórico', Icon: History },
];

const STATUS_LABELS = {
  DRAFT: 'Rascunho',
  IN_REVIEW: 'Em revisão',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
};

const WORKFLOW_STEPS = [
  { status: 'DRAFT', label: '1. Rascunho', description: 'Edição e validação' },
  { status: 'IN_REVIEW', label: '2. Em revisão', description: 'Conteúdo bloqueado' },
  { status: 'PUBLISHED', label: '3. Publicado', description: 'Disponível aos alunos' },
];

function WorkflowStatus({ status }) {
  const currentIndex = WORKFLOW_STEPS.findIndex((step) => step.status === status);
  const archived = status === 'ARCHIVED';

  return (
    <section
      aria-label="Etapas da publicação"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {WORKFLOW_STEPS.map((step, index) => {
          const isCurrent = !archived && index === currentIndex;
          const isComplete = !archived && index < currentIndex;
          return (
            <div
              key={step.status}
              aria-current={isCurrent ? 'step' : undefined}
              className={`rounded-xl border px-4 py-3 ${
                isCurrent
                  ? 'border-amber-400 bg-amber-400/10'
                  : isComplete
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <p className={`text-sm font-black ${isCurrent ? 'text-amber-300' : isComplete ? 'text-emerald-300' : 'text-slate-500'}`}>
                {step.label}
              </p>
              <p className="mt-1 text-xs text-slate-500">{step.description}</p>
            </div>
          );
        })}
      </div>
      {archived && (
        <p className="mt-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
          Esta versão foi arquivada e permanece disponível somente para auditoria.
        </p>
      )}
      {status === 'IN_REVIEW' && (
        <p className="mt-3 text-sm text-slate-400">
          A versão enviada para revisão é somente leitura. Confira a prévia e publique quando estiver aprovada.
        </p>
      )}
    </section>
  );
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function externalVideoUrl(embedUrl) {
  const match = String(embedUrl ?? '').match(
    /^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]+)/i,
  );
  return match
    ? `https://www.youtube.com/watch?v=${match[1]}`
    : embedUrl;
}

function latestByKey(versions) {
  const grouped = new Map();
  for (const version of versions) {
    const current = grouped.get(version.key);
    const shouldReplace =
      !current ||
      (['DRAFT', 'IN_REVIEW'].includes(version.status) &&
        !['DRAFT', 'IN_REVIEW'].includes(current.status)) ||
      Number(version.version) > Number(current.version) &&
        version.status === current.status;
    if (shouldReplace) grouped.set(version.key, version);
  }
  return [...grouped.values()].sort(
    (left, right) => Number(left.phaseNumber) - Number(right.phaseNumber),
  );
}

function PreviewPanel({ type, payload, status }) {
  if (type === 'LEARNING_MODULE') {
    const materials = Object.entries(payload.materialSlots ?? {});
    const video = payload.materialSlots?.video;
    return (
      <section className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
        <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
          Prévia sem recompensa
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">{payload.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{payload.description}</p>
        <p className="mt-3 rounded-xl border border-cyan-500/20 bg-slate-950/50 px-4 py-3 text-xs leading-5 text-cyan-100/80">
          Esta é a prévia da versão {STATUS_LABELS[status]?.toLowerCase()}.
          Alunos continuam vendo a versão publicada até você concluir a publicação.
        </p>
        {video?.embedUrl && (
          <div className="mt-4">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-black">
              <iframe
                src={video.embedUrl}
                title={`Prévia: ${video.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-2 break-all text-xs text-slate-400">
              URL salva: {video.embedUrl}
            </p>
            <a
              href={externalVideoUrl(video.embedUrl)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-10 items-center rounded-xl border border-cyan-500/30 px-4 py-2 text-xs font-black text-cyan-200 hover:border-cyan-300"
            >
              Abrir vídeo em uma nova guia
            </a>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Se a nova guia funcionar e o quadro não, verifique a proteção
              contra rastreamento do Firefox. Se o YouTube informar que a
              reprodução em outros sites foi desativada, habilite incorporação
              nas configurações do vídeo.
            </p>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {materials.map(([key, material]) => (
            <article key={key} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-xs font-black uppercase text-amber-300">{key}</p>
              <p className="mt-1 text-sm font-bold text-white">{material.title}</p>
              <p className="mt-2 text-xs text-slate-500">{material.status}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }
  const count = payload.knowledge?.length ??
    payload.cases?.length ??
    payload.decisions?.length ??
    payload.cards?.length ?? 0;
  return (
    <section className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
        Prévia estrutural sem CapiCoins
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">{payload.title}</h2>
      <p className="mt-2 text-sm text-slate-300">
        A estrutura possui {count} itens principais. Nenhuma tentativa, progresso
        ou recompensa é criada nesta visualização.
      </p>
    </section>
  );
}

export default function TeacherStudio() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('LEARNING_MODULE');
  const [studio, setStudio] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyAction, setBusyAction] = useState('');
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const loadStudio = useCallback(async (preferredId = '') => {
    setIsLoading(true);
    try {
      const data = await fetchTeacherStudio();
      setStudio(data);
      const allVersions = [
        ...(data.learningModules ?? []),
        ...(data.activities ?? []),
      ];
      const preferred = allVersions.find((item) => item.id === preferredId);
      if (preferred) {
        setSelectedId(preferred.id);
        setDraft(deepClone(preferred));
      }
      setMessage('');
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchTeacherStudio()
      .then((data) => {
        if (!active) return;
        setStudio(data);
        const first = latestByKey(data.learningModules ?? [])[0] ?? null;
        setSelectedId(first?.id ?? '');
        setDraft(first ? deepClone(first) : null);
        setMessage('');
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const collection = useMemo(() => {
    if (!studio) return [];
    return tab === 'LEARNING_MODULE'
      ? studio.learningModules
      : tab === 'ACTIVITY_DEFINITION'
        ? studio.activities
        : [];
  }, [studio, tab]);
  const selectableVersions = useMemo(() => latestByKey(collection), [collection]);
  const selectedVersion = collection.find((item) => item.id === selectedId) ??
    selectableVersions[0] ?? null;
  const selectedKey = draft?.key ?? selectedVersion?.key ?? '';
  const selectedItem = selectableVersions.find((item) => item.key === selectedKey)
    ?? selectableVersions[0]
    ?? null;
  const versionsForSelectedItem = useMemo(
    () => collection
      .filter((item) => item.key === selectedKey)
      .sort((left, right) => Number(right.version) - Number(left.version)),
    [collection, selectedKey],
  );

  const perform = async (action, callback, successMessage) => {
    setBusyAction(action);
    setMessage('');
    try {
      const result = await callback();
      const reloaded = await loadStudio(result?.versionId ?? selectedId);
      if (reloaded) setMessage(successMessage);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const createDraft = () =>
    perform(
      'create',
      () => createStudioDraft(tab, selectedVersion.key),
      'Rascunho pronto para edição.',
    );

  const saveDraft = () =>
    perform(
      'save',
      () =>
        saveStudioDraft({
          type: tab,
          versionId: draft.id,
          title: draft.title,
          changeSummary: draft.changeSummary,
          payload: draft.payload,
        }),
      'Rascunho validado e salvo.',
    );

  const submitReview = () =>
    perform(
      'review',
      async () => {
        await saveStudioDraft({
          type: tab,
          versionId: draft.id,
          title: draft.title,
          changeSummary: draft.changeSummary,
          payload: draft.payload,
        });
        return submitStudioReview(tab, draft.id);
      },
      'Alterações salvas e versão enviada para revisão. Confira a prévia antes de publicar.',
    );

  const publishVersion = () => {
    const confirmed = window.confirm(
      'Publicar esta versão para todos os alunos? A versão anterior será arquivada e continuará no histórico.',
    );
    if (!confirmed) return;
    perform(
      'publish',
      () => publishStudioVersion(tab, draft.id),
      'Versão publicada. Os próximos acessos usarão este conteúdo.',
    );
  };

  const uploadAsset = async (slotKey, file) => {
    if (!draft || draft.status !== 'DRAFT') return;
    setBusyAction(`upload-${slotKey}`);
    setMessage('');
    try {
      const asset = await uploadStudioAsset(tab, draft.id, file);
      const currentSlot = draft.payload.materialSlots?.[slotKey] ?? {};
      const nextPayload = {
        ...draft.payload,
        materialSlots: {
          ...draft.payload.materialSlots,
          [slotKey]: {
            ...currentSlot,
            status: 'available',
            documentUrl: asset.url,
            format: asset.mimeType,
          },
        },
      };
      await saveStudioDraft({
        type: tab,
        versionId: draft.id,
        title: draft.title,
        changeSummary: draft.changeSummary,
        payload: nextPayload,
      });
      const reloaded = await loadStudio(draft.id);
      if (reloaded) {
        setMessage('Arquivo validado, armazenado e vinculado ao rascunho.');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const editable = draft?.status === 'DRAFT';

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-7 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/professor')}
              className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-300"
            >
              <ArrowBack sx={{ fontSize: 18 }} /> Voltar ao painel
            </button>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              Money Rank · Governança pedagógica
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Estúdio do Professor</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Edite em rascunho, confira a prévia e publique com auditoria. Uma
              prévia nunca altera progresso ou CapiCoins.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadStudio(selectedId)}
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-black text-slate-300 disabled:opacity-50"
          >
            <Refresh sx={{ fontSize: 18 }} /> Atualizar
          </button>
        </header>

        <nav className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2 lg:grid-cols-4">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                const nextCollection = id === 'LEARNING_MODULE'
                  ? studio?.learningModules ?? []
                  : id === 'ACTIVITY_DEFINITION'
                    ? studio?.activities ?? []
                    : [];
                const next = latestByKey(nextCollection)[0] ?? null;
                setSelectedId(next?.id ?? '');
                setDraft(next ? deepClone(next) : null);
                setShowPreview(false);
                setMessage('');
              }}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-black ${
                tab === id ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon sx={{ fontSize: 19 }} /> {label}
            </button>
          ))}
        </nav>

        {message && (
          !['LEARNING_MODULE', 'ACTIVITY_DEFINITION'].includes(tab)
          || !draft
        ) && (
          <p role="status" aria-live="polite" className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
            {message}
          </p>
        )}

        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-amber-400" />
          </div>
        )}

        {!isLoading && tab === 'RESEARCH' && (
          <div className="mt-6">
            <ResearchReviewPanel
              research={studio?.research ?? []}
              onRefresh={() => loadStudio()}
            />
          </div>
        )}

        {!isLoading && tab === 'AUDIT' && (
          <section className="mt-6 space-y-3">
            {(studio?.audit ?? []).map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black text-white">{item.entityKey} · v{item.version}</p>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-black text-amber-300">
                    {item.action}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.summary}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {new Date(item.createdAt).toLocaleString('pt-BR')}
                </p>
              </article>
            ))}
          </section>
        )}

        {!isLoading && ['LEARNING_MODULE', 'ACTIVITY_DEFINITION'].includes(tab) && draft && (
          <div className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-4 xl:sticky xl:top-4">
              <StudioField label="Item editorial">
                <select
                  className={inputClassName}
                  value={selectedItem?.id ?? ''}
                  onChange={(event) => {
                    const nextItem = selectableVersions.find(
                      (item) => item.id === event.target.value,
                    );
                    setSelectedId(nextItem?.id ?? '');
                    setDraft(nextItem ? deepClone(nextItem) : null);
                    setShowPreview(false);
                  }}
                >
                  {selectableVersions.map((item) => (
                    <option key={item.id} value={item.id}>
                      Fase {item.phaseNumber} · {item.title}
                    </option>
                  ))}
                </select>
              </StudioField>
              <div className="mt-4">
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">
                  Versões deste item
                </p>
                <div className="space-y-2" role="list" aria-label="Versões disponíveis">
                  {versionsForSelectedItem.map((item) => {
                    const selected = item.id === draft.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="listitem"
                        aria-current={selected ? 'true' : undefined}
                        onClick={() => {
                          setSelectedId(item.id);
                          setDraft(deepClone(item));
                          setShowPreview(false);
                          setMessage('');
                        }}
                        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                          selected
                            ? 'border-amber-400 bg-amber-400/10 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span className="font-black">v{item.version}</span>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : item.status === 'IN_REVIEW'
                              ? 'bg-cyan-500/10 text-cyan-300'
                              : item.status === 'DRAFT'
                                ? 'bg-amber-500/10 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                        }`}
                        >
                          {STATUS_LABELS[item.status]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Versão</p>
                <p className="mt-1 font-black">v{draft.version} · {STATUS_LABELS[draft.status]}</p>
              </div>
              {['PUBLISHED', 'ARCHIVED'].includes(draft.status) && (
                <button
                  type="button"
                  disabled={Boolean(busyAction)}
                  onClick={createDraft}
                  className="mt-4 min-h-11 w-full rounded-xl bg-amber-400 px-4 text-sm font-black text-slate-950 disabled:opacity-50"
                >
                  Criar nova versão
                </button>
              )}
            </aside>

            <section className="min-w-0 space-y-5">
              <WorkflowStatus status={draft.status} />

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  <StudioField label="Nome editorial">
                    <input
                      className={inputClassName}
                      value={draft.title}
                      disabled={!editable}
                      onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    />
                  </StudioField>
                  <StudioField label="Resumo da alteração">
                    <textarea
                      className={textareaClassName}
                      value={draft.changeSummary}
                      disabled={!editable}
                      onChange={(event) => setDraft({ ...draft, changeSummary: event.target.value })}
                    />
                  </StudioField>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {draft.status === 'DRAFT' && (
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={saveDraft}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-black text-slate-950 disabled:opacity-50"
                    >
                      <Save sx={{ fontSize: 18 }} /> Salvar e validar
                    </button>
                  )}
                  {draft.status === 'DRAFT' && (
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={submitReview}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-black text-slate-200 disabled:opacity-50"
                    >
                      <CheckCircle sx={{ fontSize: 18 }} /> Enviar para revisão
                    </button>
                  )}
                  {draft.status === 'IN_REVIEW' && (
                    <button
                      type="button"
                      disabled={Boolean(busyAction)}
                      onClick={publishVersion}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-black text-slate-950 disabled:opacity-50"
                    >
                      <Publish sx={{ fontSize: 18 }} /> Publicar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPreview((value) => !value)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-black text-slate-200"
                  >
                    <Preview sx={{ fontSize: 18 }} /> {showPreview ? 'Fechar prévia' : 'Ver prévia'}
                  </button>
                </div>
                {draft.status === 'DRAFT' && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    O botão <strong className="text-slate-300">Publicar</strong>{' '}
                    aparece depois que esta versão for salva e enviada para revisão.
                  </p>
                )}
                {message && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm font-bold text-cyan-100"
                  >
                    {message}
                  </p>
                )}
              </div>

              {showPreview && (
                <PreviewPanel
                  type={tab}
                  payload={draft.payload}
                  status={draft.status}
                />
              )}

              {tab === 'LEARNING_MODULE' ? (
                <LearningModuleEditor
                  payload={draft.payload}
                  disabled={!editable}
                  uploadingSlot={busyAction.startsWith('upload-')
                    ? busyAction.slice('upload-'.length)
                    : ''}
                  onChange={(payload) => setDraft({ ...draft, payload })}
                  onUpload={uploadAsset}
                />
              ) : (
                <StructuredActivityEditor
                  activityKey={draft.key}
                  payload={draft.payload}
                  disabled={!editable}
                  onChange={(payload) => setDraft({ ...draft, payload })}
                />
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
