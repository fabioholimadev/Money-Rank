import { useState } from 'react';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import Launch from '@mui/icons-material/Launch';
import PlayCircleOutlined from '@mui/icons-material/PlayCircleOutlined';
import Slideshow from '@mui/icons-material/Slideshow';
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
          className="rounded-full border border-[#536670] bg-[#131f24]/70 px-3 py-1 text-[11px] font-bold text-[#a5b7c2]"
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
      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#a5b7c2] transition-colors hover:text-[#49c0f8]"
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
          <p className="mt-2 text-sm leading-relaxed text-[#a5b7c2]">
            {material.description}
          </p>
        )}
      </header>

      <MaterialMetadata material={material} />

      {material.embedUrl ? (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#37464f] bg-black">
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
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#58cc02] px-5 py-3 text-sm font-black text-[#131f24] transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49c0f8]"
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
          <p className="mt-2 text-sm leading-relaxed text-[#a5b7c2]">
            {material.description}
          </p>
        )}
      </header>

      <MaterialMetadata material={material} />

      {material.embedUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#37464f] bg-black md:aspect-video">
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
          <p className="mt-2 text-sm leading-relaxed text-[#a5b7c2]">
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
              className="rounded-2xl border border-[#37464f] bg-[#131f24]/70 p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#58cc02]/15 text-sm font-black text-[#49c0f8]">
                {index + 1}
              </div>
              <h3 className="mb-2 font-black text-white">{section.title}</h3>
              <p className="text-sm leading-relaxed text-[#a5b7c2]">
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
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#536670] bg-[#131f24]/40 px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f2d33] text-[#a5b7c2]">
        <ArticleOutlined sx={{ fontSize: 28 }} aria-hidden="true" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#49c0f8]">
        Espaço reservado: {label}
      </p>
      <h2 className="mt-3 text-xl font-black text-white">{material.title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#a5b7c2]">
        {material.description}
      </p>
      <p className="mt-5 rounded-full border border-[#536670] px-4 py-2 text-xs font-bold text-[#78909c]">
        Materiais ainda não publicados não bloqueiam a conclusão da fase.
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

export default function PhaseContentLayout({ content: fallbackContent }) {
  const navigate = useNavigate();
  const content = fallbackContent;
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
  const completionMessage = completionRequirementsMet
    ? 'O vídeo foi acessado. Confirme para avançar.'
    : 'Acesse o vídeo para liberar a confirmação.';
  const completionLabel = content.introduction
    ? content.completionLabel
    : 'Assisti ao vídeo desta fase';

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
          className="mb-7 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#a5b7c2] transition-colors hover:text-[#49c0f8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49c0f8]"
        >
          <ArrowBack sx={{ fontSize: 19 }} aria-hidden="true" />
          Voltar ao mapa
        </button>

        <header className="mb-7">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#49c0f8]">
            Saúde &amp; Consumo · {content.stepLabel}
          </p>
          <h1 className="bg-gradient-to-r from-[#58cc02] via-[#49c0f8] to-[#58cc02] bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#a5b7c2] sm:text-base">
            {content.description}
          </p>
        </header>

        {tabs.length > 1 && (
          <div
            role="tablist"
            aria-label={`Conteúdos de ${content.title}`}
            className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-[#37464f] bg-[#17262c] p-2"
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
                  className={`relative flex min-h-14 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-black transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49c0f8] sm:px-3 sm:text-sm ${
                    selected
                      ? 'bg-[#58cc02] text-[#131f24] shadow-lg shadow-[#58cc02]/20'
                      : 'text-[#a5b7c2] hover:bg-[#1f2d33] hover:text-white'
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
          className="mb-7 rounded-3xl border border-[#37464f] bg-[#17262c] p-3 shadow-2xl shadow-black/20 sm:p-6"
        >
          <MaterialPanel slot={activeSlot} />
        </section>

        <section className="rounded-3xl border border-[#49c0f8]/20 bg-[#17262c]/80 p-5 sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <CheckCircle
              sx={{ fontSize: 25 }}
              className={
                completionRequirementsMet
                  ? 'text-emerald-400'
                  : 'text-[#78909c]'
              }
              aria-hidden="true"
            />
            <div>
              <h2 className="font-black text-white">
                {content.introduction
                  ? 'Pronto para começar?'
                  : 'Conclua o conteúdo antes da atividade'}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-[#a5b7c2] sm:text-sm">
                {completionMessage}
              </p>
              <p className="mt-2 text-xs font-bold text-[#49c0f8]">
                {contentAlreadyCompleted
                  ? 'Revisão do conteúdo: 0 CapiCoins'
                  : 'Primeira conclusão: 20 CapiCoins-base + streak'}
              </p>
            </div>
          </div>

          <label
            className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm transition-colors ${
              completionRequirementsMet
                ? 'cursor-pointer border-[#536670] bg-[#131f24]/60 text-[#f1f7fb]'
                : 'cursor-not-allowed border-[#37464f] bg-[#131f24]/30 text-[#78909c]'
            }`}
          >
            <input
              type="checkbox"
              checked={confirmed}
              disabled={!completionRequirementsMet}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#58cc02]"
            />
            <span>{completionLabel}</span>
          </label>

          <button
            type="button"
            disabled={!canContinue}
            onClick={saveAndContinue}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#58cc02] to-[#49c0f8] px-5 py-3 text-sm font-black text-[#131f24] shadow-lg shadow-[#58cc02]/15 transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49c0f8] disabled:cursor-not-allowed disabled:grayscale disabled:opacity-40 sm:text-base"
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
