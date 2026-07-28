import { useState } from 'react';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
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
  getPhaseProgress,
  normalizeCurrentPhase,
} from '../../lib/trailProgress';
import TrailLockedState from './TrailLockedState';
import TrailPageShell from './TrailPageShell';

function VideoPanel({ video }) {
  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-black">
        <iframe
          src={video.embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>

      {video.sourceUrl && (
        <a
          href={video.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-amber-400"
        >
          <Launch sx={{ fontSize: 15 }} aria-hidden="true" />
          Fonte: {video.sourceLabel}
        </a>
      )}
    </div>
  );
}

function MaterialsPanel({ slides, materials, materialsTitle }) {
  if (slides) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800 bg-black md:aspect-video">
        <iframe
          src={slides.embedUrl}
          title={slides.title}
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-5 text-lg font-black text-white sm:text-xl">
        {materialsTitle}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {materials.map((material, index) => (
          <article
            key={material.title}
            className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-sm font-black text-amber-400">
              {index + 1}
            </div>
            <h3 className="mb-2 font-black text-white">{material.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {material.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function PhaseContentLayout({ content }) {
  const navigate = useNavigate();
  const {
    aluno,
    trailProgress,
    trailLoading,
    refreshTrailState,
  } = useAuth();
  const hasMaterials = Boolean(
    content.slides || content.materials?.length,
  );
  const tabs = [
    {
      id: 'video',
      label: 'Vídeos em Destaque',
      shortLabel: 'Vídeo',
      Icon: PlayCircleOutlined,
    },
    ...(hasMaterials
      ? [
          {
            id: 'materials',
            label: 'Slides da Aula / Materiais',
            shortLabel: 'Materiais',
            Icon: Slideshow,
          },
        ]
      : []),
  ];
  const [activeTab, setActiveTab] = useState('video');
  const [visitedTabs, setVisitedTabs] = useState(() => new Set(['video']));
  const [confirmed, setConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const phaseProgress = getPhaseProgress(
    trailProgress,
    content.phaseNumber,
  );
  const allTabsVisited = tabs.every(({ id }) => visitedTabs.has(id));
  const destination = content.activityPath || content.nextPath;
  const canContinue =
    allTabsVisited &&
    confirmed &&
    Boolean(destination) &&
    !isSaving &&
    !trailLoading;

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setVisitedTabs((currentTabs) => {
      const nextTabs = new Set(currentTabs);
      nextTabs.add(tabId);
      return nextTabs;
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
        phaseProgress?.status !== 'IN_PROGRESS' &&
        phaseProgress?.status !== 'COMPLETED'
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
            className="mb-6 flex gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2"
          >
            {tabs.map(({ id, label, shortLabel, Icon }) => {
              const selected = activeTab === id;

              return (
                <button
                  key={id}
                  id={`${content.id}-${id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${content.id}-${id}-panel`}
                  onClick={() => selectTab(id)}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:text-sm ${
                    selected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon sx={{ fontSize: 19 }} aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        <section
          id={`${content.id}-${activeTab}-panel`}
          role="tabpanel"
          aria-labelledby={
            tabs.length > 1
              ? `${content.id}-${activeTab}-tab`
              : undefined
          }
          className="mb-7 rounded-3xl border border-slate-800 bg-slate-900 p-3 shadow-2xl shadow-black/20 sm:p-6"
        >
          {activeTab === 'video' ? (
            <VideoPanel video={content.video} />
          ) : (
            <MaterialsPanel
              slides={content.slides}
              materials={content.materials}
              materialsTitle={content.materialsTitle}
            />
          )}
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-slate-900/80 p-5 sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <CheckCircle
              sx={{ fontSize: 25 }}
              className={allTabsVisited ? 'text-emerald-400' : 'text-slate-600'}
              aria-hidden="true"
            />
            <div>
              <h2 className="font-black text-white">
                {content.introduction
                  ? 'Pronto para começar?'
                  : 'Conclua o conteúdo antes da atividade'}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
                {allTabsVisited
                  ? 'Os conteúdos necessários foram abertos. Confirme a conclusão para avançar.'
                  : 'Abra também a aba de materiais para liberar a confirmação.'}
              </p>
              <p className="mt-2 text-xs font-bold text-amber-400">
                Primeira conclusão: +20 CapiCoins
              </p>
            </div>
          </div>

          <label
            className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm transition-colors ${
              allTabsVisited
                ? 'cursor-pointer border-slate-700 bg-slate-950/60 text-slate-200'
                : 'cursor-not-allowed border-slate-800 bg-slate-950/30 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={confirmed}
              disabled={!allTabsVisited}
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
