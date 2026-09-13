import CheckCircle from '@mui/icons-material/CheckCircle';
import Lock from '@mui/icons-material/Lock';
import MenuBook from '@mui/icons-material/MenuBook';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { TRAIL_CATEGORIES } from '../../data/trailCategories';
import {
  getPhaseProgress,
  isActivityUnlocked,
  isPhaseCompleted,
  isPhaseUnlocked,
  normalizeCurrentPhase,
} from '../../lib/trailProgress';

function NavigationButton({
  active,
  disabled,
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-9 w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[0.7rem] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#49c0f8] ${
        active
          ? 'border-[#49c0f8]/50 bg-[#58cc02]/15 text-[#49c0f8]'
          : disabled
            ? 'cursor-not-allowed border-[#37464f]/70 bg-[#131f24]/20 text-[#536670]'
            : 'border-[#37464f] bg-[#131f24]/50 text-[#a5b7c2] hover:border-[#536670] hover:text-white'
      }`}
    >
      {icon}
      <span className="min-w-0 flex-1">{label}</span>
      {disabled && <Lock sx={{ fontSize: 13 }} aria-hidden="true" />}
    </button>
  );
}

function TrailNavigationList({
  modules,
  currentPhase,
  progressEntries,
  pathname,
  onNavigate,
}) {
  return (
    <ol className="space-y-3">
      {modules.map((module) => {
        const phaseProgress = getPhaseProgress(
          progressEntries,
          module.fase,
        );
        const phaseUnlocked =
          module.contentOnly ||
          isPhaseUnlocked(module.fase, currentPhase);
        const phaseCompleted = module.contentOnly
          ? currentPhase > 0
          : isPhaseCompleted(
              module.fase,
              currentPhase,
              phaseProgress,
            );
        const activityAllowed =
          !module.contentOnly &&
          isActivityUnlocked(
            module.fase,
            currentPhase,
            phaseProgress,
          );
        const contentPath = `${module.rota}/conteudo`;
        const activityPath = `${module.rota}/atividade`;

        return (
          <li
            key={module.id}
            className={`rounded-2xl border p-3 ${
              phaseUnlocked
                ? 'border-[#37464f] bg-[#17262c]/70'
                : 'border-[#2b3940] bg-[#131f24]/40 opacity-60'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-black text-white ${module.cor}`}
              >
                {module.fase}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#78909c]">
                  {module.etapaLabel || `Fase ${module.fase}`}
                </p>
                <p className="truncate text-xs font-black text-white">
                  {module.titulo}
                </p>
              </div>
              {phaseCompleted && (
                <CheckCircle
                  sx={{ fontSize: 17 }}
                  className="text-emerald-400"
                  aria-label="Concluída"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <NavigationButton
                active={pathname === contentPath}
                disabled={!phaseUnlocked}
                label={
                  module.contentOnly ? 'Introdução' : 'Conteúdo'
                }
                icon={<MenuBook sx={{ fontSize: 15 }} aria-hidden="true" />}
                onClick={() => onNavigate(contentPath)}
              />

              {!module.contentOnly && (
                <NavigationButton
                  active={pathname === activityPath}
                  disabled={!activityAllowed}
                  label={module.nomeAtividade}
                  icon={
                    <PlayArrow sx={{ fontSize: 15 }} aria-hidden="true" />
                  }
                  onClick={() => onNavigate(activityPath)}
                />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TrailPhaseSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { aluno, trailProgress } = useAuth();
  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);
  const modules = TRAIL_CATEGORIES[0]?.modulos ?? [];
  const navigationProps = {
    modules,
    currentPhase,
    progressEntries: trailProgress,
    pathname,
    onNavigate: navigate,
  };

  return (
    <>
      <details className="rounded-2xl border border-[#37464f] bg-[#17262c]/90 p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-black text-white">
          Navegação da trilha · Fase atual {currentPhase}
        </summary>
        <div className="mt-4">
          <TrailNavigationList {...navigationProps} />
        </div>
      </details>

      <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-[#37464f] bg-[#131f24]/90 p-4 shadow-xl shadow-black/20 lg:block">
        <p className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#49c0f8]">
          Saúde &amp; Consumo
        </p>
        <h2 className="mb-4 text-base font-black text-white">
          Sua jornada
        </h2>
        <TrailNavigationList {...navigationProps} />
      </aside>
    </>
  );
}
