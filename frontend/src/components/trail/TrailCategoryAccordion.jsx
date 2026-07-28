import ExpandMore from '@mui/icons-material/ExpandMore';
import TrailModuleCard from './TrailModuleCard';
import {
  getPhaseProgress,
  isActivityUnlocked,
  isPhaseCompleted,
  isPhaseUnlocked,
} from '../../lib/trailProgress';

function calculateCategoryProgress(
  modules,
  currentPhase,
  progressEntries,
) {
  const interactiveModules = modules.filter(
    ({ contentOnly }) => !contentOnly,
  );

  if (interactiveModules.length === 0) {
    return {
      completedModules: 0,
      percentage: 0,
      totalModules: 0,
    };
  }

  const completedModules = interactiveModules.filter((module) =>
    isPhaseCompleted(
      module.fase,
      currentPhase,
      getPhaseProgress(progressEntries, module.fase),
    ),
  ).length;

  return {
    completedModules,
    totalModules: interactiveModules.length,
    percentage: Math.round(
      (completedModules / interactiveModules.length) * 100,
    ),
  };
}

export default function TrailCategoryAccordion({
  category,
  currentPhase,
  progressEntries,
  isOpen,
  onToggle,
  onNavigate,
}) {
  const Icone = category.Icone;
  const { completedModules, percentage, totalModules } =
    calculateCategoryProgress(
      category.modulos,
      currentPhase,
      progressEntries,
    );
  const contentId = `trail-category-${category.id}`;
  const triggerId = `${contentId}-trigger`;
  const categoryCompleted =
    completedModules === totalModules && totalModules > 0;

  return (
    <section
      className={`
        overflow-hidden rounded-[2rem] border bg-slate-900/80
        shadow-2xl backdrop-blur ${category.corBorda}
        ${category.corSombra}
      `}
    >
      <button
        id={triggerId}
        type="button"
        aria-controls={contentId}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Recolher' : 'Abrir'} ${category.titulo}`}
        onClick={onToggle}
        className="
          w-full px-5 py-5 text-left transition-colors hover:bg-slate-800/60
          focus-visible:outline-2 focus-visible:outline-offset-[-4px]
          focus-visible:outline-amber-400 sm:px-7 sm:py-6
        "
      >
        <span className="flex items-start gap-4">
          <span
            className={`
              flex h-14 w-14 flex-shrink-0 items-center justify-center
              rounded-2xl bg-gradient-to-br ${category.cor}
              shadow-lg shadow-black/20
            `}
          >
            <Icone
              sx={{ fontSize: 28 }}
              className="text-white"
              aria-hidden="true"
            />
          </span>

          <span className="min-w-0 flex-1">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-400">
              {category.etiqueta}
            </span>
            <span
              role="heading"
              aria-level="2"
              className="mt-1 block text-xl font-black tracking-tight text-white sm:text-2xl"
            >
              {category.titulo}
            </span>
            <span className="mt-2 block max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              {category.descricao}
            </span>
          </span>

          <ExpandMore
            sx={{ fontSize: 28 }}
            aria-hidden="true"
            className={`
              mt-2 flex-shrink-0 text-slate-400 transition-transform
              duration-300 ${isOpen ? 'rotate-180 text-amber-400' : ''}
            `}
          />
        </span>

        <span className="mt-5 flex items-center gap-3">
          <span
            className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-label={`Progresso em ${category.titulo}`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={percentage}
          >
            <span
              className={`block h-full rounded-full bg-gradient-to-r ${category.cor} transition-all duration-700`}
              style={{ width: `${percentage}%` }}
            />
          </span>

          <span className="whitespace-nowrap text-xs font-semibold text-slate-400">
            {categoryCompleted
              ? 'Concluída'
              : `${completedModules}/${totalModules} fases`}
          </span>
        </span>

        <span className="mt-3 block text-right text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">
          {isOpen ? 'Recolher fases' : 'Abrir fases'}
        </span>
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          className="border-t border-slate-800/80 bg-slate-950/50 px-4 py-7 sm:px-8 sm:py-9"
        >
          <div className="relative mx-auto flex max-w-xl flex-col items-center">
            <div
              className="absolute bottom-8 left-1/2 top-8 z-0 w-0.5 -translate-x-1/2 bg-slate-800"
              aria-hidden="true"
            />

            <div className="relative z-10 flex w-full flex-col items-center gap-6">
              {category.modulos.map((modulo, index) => {
                const phaseProgress = getPhaseProgress(
                  progressEntries,
                  modulo.fase,
                );
                const liberado = modulo.contentOnly
                  ? currentPhase >= 0
                  : isPhaseUnlocked(modulo.fase, currentPhase);
                const concluido = modulo.contentOnly
                  ? currentPhase > 0
                  : isPhaseCompleted(
                      modulo.fase,
                      currentPhase,
                      phaseProgress,
                    );

                return (
                  <TrailModuleCard
                    key={modulo.id}
                    modulo={modulo}
                    indice={index}
                    liberado={liberado}
                    concluido={concluido}
                    atividadeLiberada={isActivityUnlocked(
                      modulo.fase,
                      currentPhase,
                      phaseProgress,
                    )}
                    onNavigate={onNavigate}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
