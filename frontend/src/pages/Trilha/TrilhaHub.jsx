import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailCategoryAccordion from '../../components/trail/TrailCategoryAccordion';
import { useAuth } from '../../contexts/AuthContext';
import { TRAIL_CATEGORIES } from '../../data/trailCategories';
import { normalizeCurrentPhase } from '../../lib/trailProgress';
import { PageHeader, Surface } from '../../components/ui/DesignSystem';

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
    <div className="space-y-8 py-2 text-[#f1f7fb] sm:py-4">
      {/* ── Background Glow ───────────────────────────────────────────── */}
      <Surface className="overflow-hidden bg-gradient-to-br from-[#1f2d33] to-[#183328] p-6 sm:p-8">
        <PageHeader
          eyebrow="Trilha de aprendizado"
          title="Fases & Desafios"
          description="Avance módulo a módulo para dominar cidadania, desmascarar fraudes e acumular CapiCoins auditados."
        />
      </Surface>

      <div className="mx-auto flex max-w-4xl flex-col gap-5 pb-8">
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
    </div>
  );
}
