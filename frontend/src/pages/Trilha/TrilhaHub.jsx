import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailCategoryAccordion from '../../components/trail/TrailCategoryAccordion';
import { useAuth } from '../../contexts/AuthContext';
import { TRAIL_CATEGORIES } from '../../data/trailCategories';
import { normalizeCurrentPhase } from '../../lib/trailProgress';

export default function TrilhaHub() {
  const navigate = useNavigate();
  const { aluno, trailProgress } = useAuth();
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const currentPhase = normalizeCurrentPhase(aluno?.fase_atual);

  function toggleCategory(categoryId) {
    setOpenCategoryId((currentId) =>
      currentId === categoryId ? null : categoryId,
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:py-12">
      <header className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Jornada Money Rank
        </span>
        <h1 className="mt-2 text-3xl font-black tracking-tighter md:text-4xl">
          Trilhas de aprendizagem
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
          Escolha uma categoria para ver suas fases. Você pode abrir ou
          recolher cada trilha quando quiser.
        </p>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {TRAIL_CATEGORIES.map((category) => (
          <TrailCategoryAccordion
            key={category.id}
            category={category}
            currentPhase={currentPhase}
            progressEntries={trailProgress}
            isOpen={openCategoryId === category.id}
            onToggle={() => toggleCategory(category.id)}
            onNavigate={navigate}
          />
        ))}
      </div>
    </main>
  );
}
