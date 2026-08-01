import { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  ArticleOutlined,
  CheckCircle,
  DownloadOutlined,
  Launch,
  PlayCircleOutlined,
  Slideshow,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  completeIntroductionStep,
  completePhaseContent,
} from '../../services/studentDataService';
import {
  CONTENT_MATERIAL_TYPES,
  getContentMaterialSlots,
  hasCompletedContentVisits,
  isMaterialAvailable,
} from '../../lib/contentMaterialModel';
import {
  getPhaseProgress,
  normalizeCurrentPhase,
} from '../../lib/trailProgress';
import TrailLockedState from './TrailLockedState';
import TrailPageShell from './TrailPageShell';

const MATERIAL_ICONS = {
  [CONTENT_MATERIAL_TYPES.VIDEO]: PlayCircleOutlined,
  [CONTENT_MATERIAL_TYPES.SLIDES]: Slideshow,
  [CONTENT_MATERIAL_TYPES.SUMMARY]: ArticleOutlined,
};

function MaterialMetadata({ material }) {
  const metadata = [
    material.format,
    material.estimatedMinutes
      ? `${material.estimatedMinutes} min`
      : null,
    material.version ? `Versão ${material.version}` : null,
  ].filter(Boolean);

  if (metadata.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {metadata.map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-[11px] font-bold text-slate-400"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SourceLink({ material }) {
  if (!material.sourceUrl) {
    return null;
  }

  return (
    <a
      href={material.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-amber-400"
    >
      <Launch sx={{ fontSize: 15 }} aria-hidden="true" />
      Fonte: {material.sourceLabel || 'abrir material original'}
    </a>
  );
}

function VideoPanel({ material }) {
  return (
    <div>
      <header className="mb-5">
        <h2 className="text-lg font-black text-white sm:text-xl">
          {material.title}
        </h2>
        {material.description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {material.description}
          </p>
        )}
      </header>

      <MaterialMetadata material={material} />

      {material.embedUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-black">
          <iframe
            src={material.embedUrl}
            title={material.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <ExternalMaterialButton material={material} label="Assistir ao vídeo" />
      )}

      <SourceLink material={material} />
    </div>
  );
}

function ExternalMaterialButton({ material, label }) {
  const url = material.documentUrl || material.sourceUrl;

  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
    >
      <DownloadOutlined sx={{ fontSize: 20 }} aria-hidden="true" />
      {label}
    </a>
  );
}

function SlidesPanel({ material }) {
  return (
    <div>
      <header className="mb-5">
        <h2 className="text-lg font-black text-white sm:text-xl">
          {material.title}
        </h2>
        {material.description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {material.description}
          </p>
        )}
      </header>

      <MaterialMetadata material={material} />

      {material.embedUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800 bg-black md:aspect-video">
          <iframe
            src={material.embedUrl}
            title={material.title}
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <ExternalMaterialButton material={material} label="Abrir slides" />
      )}

      <SourceLink material={material} />
    </div>
  );
}

function SummaryPanel({ material }) {
  return (
    <div>
      <header className="mb-5">
        <h2 className="text-lg font-black text-white sm:text-xl">
          {material.title}
        </h2>
        {material.description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {material.description}
          </p>
        )}
      </header>

      <MaterialMetadata material={material} />

      {material.sections?.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {material.sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-sm font-black text-amber-400">
                {index + 1}
              </div>
              <h3 className="mb-2 font-black text-white">{section.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      )}

      {material.documentUrl && (
        <div className={material.sections?.length > 0 ? 'mt-5' : ''}>
          <ExternalMaterialButton
            material={material}
            label="Abrir resumo / documento"
          />
        </div>
      )}

      <SourceLink material={material} />
    </div>
  );
}

function PendingMaterialPanel({ material, label }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
        <ArticleOutlined sx={{ fontSize: 28 }} aria-hidden="true" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">
        Espaço reservado: {label}
      </p>
      <h2 className="mt-3 text-xl font-black text-white">{material.title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
        {material.description}
      </p>
      <p className="mt-5 rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-500">
        A ausência deste arquivo não bloqueia a fase quando outro material extra está disponível.
      </p>
    </div>
  );
}

function MaterialPanel({ slot }) {
  if (!isMaterialAvailable(slot.material)) {
    return <PendingMaterialPanel material={slot.material} label={slot.label} />;
  }

  switch (slot.id) {
    case CONTENT_MATERIAL_TYPES.VIDEO:
      return <VideoPanel material={slot.material} />;
    case CONTENT_MATERIAL_TYPES.SLIDES:
      return <SlidesPanel material={slot.material} />;
    case CONTENT_MATERIAL_TYPES.SUMMARY:
      return <SummaryPanel material={slot.material} />;
    default:
      return <PendingMaterialPanel material={slot.material} label={slot.label} />;
  }
}

export default function PhaseContentLayout({ content }) {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const tabs = getContentMaterialSlots(content).map((slot) => ({
    ...slot,
    Icon: MATERIAL_ICONS[slot.id] || ArticleOutlined,
  }));
  const [activeTab, setActiveTab] = useState(CONTENT_MATERIAL_TYPES.VIDEO);
  const [visitedMaterials, setVisitedMaterials] = useState(
    () => new Set([CONTENT_MATERIAL_TYPES.VIDEO]),
  );
  const [confirmed, setConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(
    trailProgress,
    content.phaseNumber,
  );
  const completionRequirementsMet = hasCompletedContentVisits(
    content,
    visitedMaterials,
  );
  const contentAlreadyCompleted =
    phaseProgress?.status === 'IN_PROGRESS' ||
    phaseProgress?.status === 'COMPLETED';
  const destination = content.activityPath || content.nextPath;
  const canContinue =
    completionRequirementsMet &&
    confirmed &&
    Boolean(destination) &&
    !isSaving &&
    !trailLoading;
  const activeSlot = tabs.find(({ id }) => id === activeTab) || tabs[0];
  const completionMessage = content.introduction
    ? completionRequirementsMet
      ? 'O vídeo introdutório foi acessado. Confirme para avançar.'
      : 'Acesse o vídeo introdutório para liberar a confirmação.'
    : completionRequirementsMet
      ? 'O vídeo e pelo menos um material extra foram acessados. Confirme para avançar.'
      : 'Acesse o vídeo e pelo menos um material extra publicado para liberar a confirmação.';

  const selectTab = (slot) => {
    setActiveTab(slot.id);

    if (!isMaterialAvailable(slot.material)) {
      return;
    }

    setVisitedMaterials((currentMaterials) => {
      const nextMaterials = new Set(currentMaterials);
      nextMaterials.add(slot.id);
      return nextMaterials;
    });
  };

  const saveAndContinue = async () => {
    setIsSaving(true);
    setSaveError('');

    try {
      if (content.introduction && currentPhase === 0) {
        await completeIntroductionStep();
      } else if (
        !content.introduction &&
        currentPhase === content.phaseNumber &&
        !contentAlreadyCompleted
      ) {
        const result = await completePhaseContent(content.phaseNumber);
        if (!result.saved) {
          throw new Error(
            'O conteúdo não pôde ser registrado na fase atual.',
          );
        }
      }

      await refreshTrailState();
      navigate(destination);
    } catch (error) {
      console.error('Não foi possível concluir o conteúdo.', error);
      setSaveError(
        error?.message ||
          'Não foi possível salvar o conteúdo. Tente novamente.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (content.phaseNumber > currentPhase) {
    return (
      <TrailLockedState
        title={`${content.stepLabel} bloqueada`}
        message="Conclua o Passo 0 e as fases anteriores para acessar este conteúdo."
      />
    );
  }

  return (
    <TrailPageShell>
      <div className="w-full min-w-0 overflow-x-hidden py-2 text-white md:py-4">
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mb-7 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-slate-400 transition-colors hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          <ArrowBack sx={{ fontSize: 19 }} aria-hidden="true" />
          Voltar ao mapa
        </button>

        <header className="mb-7">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-amber-400">
            Saúde &amp; Consumo · {content.stepLabel}
          </p>
          <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {content.description}
          </p>
        </header>

        {tabs.length > 1 && (
          <div
            role="tablist"
            aria-label={`Conteúdos de ${content.title}`}
            className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2"
          >
            {tabs.map((slot) => {
              const selected = activeTab === slot.id;
              const available = isMaterialAvailable(slot.material);
              const visited = visitedMaterials.has(slot.id);
              const Icon = slot.Icon;

              return (
                <button
                  key={slot.id}
                  id={`${content.id}-${slot.id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${content.id}-${slot.id}-panel`}
                  onClick={() => selectTab(slot)}
                  className={`relative flex min-h-14 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-black transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:px-3 sm:text-sm ${
                    selected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon sx={{ fontSize: 19 }} aria-hidden="true" />
                  <span>{slot.label}</span>
                  <span
                    title={available ? 'Material publicado' : 'Aguardando publicação'}
                    className={`absolute right-2 top-2 h-2 w-2 rounded-full ${
                      visited
                        ? 'bg-emerald-400'
                        : available
                          ? 'bg-sky-400'
                          : 'bg-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}

        <section
          id={`${content.id}-${activeSlot.id}-panel`}
          role="tabpanel"
          aria-labelledby={
            tabs.length > 1
              ? `${content.id}-${activeSlot.id}-tab`
              : undefined
          }
          className="mb-7 rounded-3xl border border-slate-800 bg-slate-900 p-3 shadow-2xl shadow-black/20 sm:p-6"
        >
          <MaterialPanel slot={activeSlot} />
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-slate-900/80 p-5 sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <CheckCircle
              sx={{ fontSize: 25 }}
              className={
                completionRequirementsMet
                  ? 'text-emerald-400'
                  : 'text-slate-600'
              }
              aria-hidden="true"
            />
            <div>
              <h2 className="font-black text-white">
                {content.introduction
                  ? 'Pronto para começar?'
                  : 'Conclua o conteúdo antes da atividade'}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
                {completionMessage}
              </p>
              <p className="mt-2 text-xs font-bold text-amber-400">
                {contentAlreadyCompleted
                  ? 'Revisão do conteúdo: 0 CapiCoins'
                  : 'Primeira conclusão: +20 CapiCoins'}
              </p>
            </div>
          </div>

          <label
            className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm transition-colors ${
              completionRequirementsMet
                ? 'cursor-pointer border-slate-700 bg-slate-950/60 text-slate-200'
                : 'cursor-not-allowed border-slate-800 bg-slate-950/30 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={confirmed}
              disabled={!completionRequirementsMet}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-amber-500"
            />
            <span>{content.completionLabel}</span>
          </label>

          <button
            type="button"
            disabled={!canContinue}
            onClick={saveAndContinue}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/15 transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:grayscale disabled:opacity-40 sm:text-base"
          >
            {isSaving ? 'Salvando progresso...' : content.continueLabel}
            <ArrowForward sx={{ fontSize: 20 }} aria-hidden="true" />
          </button>

          {saveError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {saveError}
            </p>
          )}
        </section>
      </div>
    </TrailPageShell>
  );
}
