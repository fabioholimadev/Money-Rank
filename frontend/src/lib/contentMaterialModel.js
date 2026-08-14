export const CONTENT_MATERIAL_TYPES = Object.freeze({
  VIDEO: 'video',
  SLIDES: 'slides',
  SUMMARY: 'summary',
});

export const CONTENT_MATERIAL_STATUS = Object.freeze({
  AVAILABLE: 'available',
  PENDING: 'pending',
});

export const CONTENT_MATERIAL_SLOTS = Object.freeze([
  {
    id: CONTENT_MATERIAL_TYPES.VIDEO,
    label: 'Vídeo',
    longLabel: 'Vídeo em destaque',
  },
  {
    id: CONTENT_MATERIAL_TYPES.SLIDES,
    label: 'Slides',
    longLabel: 'Slides da aula',
  },
  {
    id: CONTENT_MATERIAL_TYPES.SUMMARY,
    label: 'Resumo',
    longLabel: 'Resumo / Documento',
  },
]);

export function isMaterialAvailable(material) {
  return material?.status === CONTENT_MATERIAL_STATUS.AVAILABLE;
}

export function getContentMaterialSlots(content) {
  const visibleSlots = content?.introduction
    ? CONTENT_MATERIAL_SLOTS.slice(0, 1)
    : CONTENT_MATERIAL_SLOTS;

  return visibleSlots.map((slot) => ({
    ...slot,
    material: content?.materialSlots?.[slot.id] ?? {
      status: CONTENT_MATERIAL_STATUS.PENDING,
      title: slot.longLabel,
      description: 'Este material ainda não foi publicado pelo professor.',
    },
  }));
}

export function getAvailableExtraMaterialIds(content) {
  return [
    CONTENT_MATERIAL_TYPES.SLIDES,
    CONTENT_MATERIAL_TYPES.SUMMARY,
  ].filter((materialId) =>
    isMaterialAvailable(content?.materialSlots?.[materialId]),
  );
}

export function hasCompletedContentVisits(content, visitedMaterialIds) {
  const visited =
    visitedMaterialIds instanceof Set
      ? visitedMaterialIds
      : new Set(visitedMaterialIds ?? []);

  if (!visited.has(CONTENT_MATERIAL_TYPES.VIDEO)) {
    return false;
  }

  if (content?.introduction) {
    return true;
  }

  const availableExtraMaterialIds = getAvailableExtraMaterialIds(content);
  if (availableExtraMaterialIds.length === 0) {
    return true;
  }

  return availableExtraMaterialIds.some((materialId) =>
    visited.has(materialId),
  );
}

export function validatePhaseContent(content) {
  const errors = [];

  if (!content?.id || typeof content.id !== 'string') {
    errors.push('O conteúdo precisa de um identificador.');
  }

  if (!Number.isInteger(content?.phaseNumber) || content.phaseNumber < 0) {
    errors.push('O número da fase precisa ser um inteiro positivo ou zero.');
  }

  const video = content?.materialSlots?.video;
  if (!isMaterialAvailable(video)) {
    errors.push('O vídeo é obrigatório.');
  } else if (!video.embedUrl && !video.sourceUrl) {
    errors.push('O vídeo precisa de uma URL de incorporação ou de origem.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
