import assert from 'node:assert/strict';
import { HEALTH_CONSUMPTION_CONTENT } from '../frontend/src/data/healthConsumptionContent.js';
import {
  CONTENT_MATERIAL_TYPES,
  getAvailableExtraMaterialIds,
  getContentMaterialSlots,
  hasCompletedContentVisits,
  validatePhaseContent,
} from '../frontend/src/lib/contentMaterialModel.js';

const contents = Object.values(HEALTH_CONSUMPTION_CONTENT);
const introduction = HEALTH_CONSUMPTION_CONTENT.introducao;
const phases = contents.filter((content) => !content.introduction);

for (const content of contents) {
  const validation = validatePhaseContent(content);
  assert.equal(
    validation.valid,
    true,
    `${content.id}: ${validation.errors.join(' ')}`,
  );
}

assert.deepEqual(
  getContentMaterialSlots(introduction).map(({ id }) => id),
  [CONTENT_MATERIAL_TYPES.VIDEO],
  'O Passo 0 deve continuar exibindo somente o vídeo introdutório.',
);
assert.equal(
  hasCompletedContentVisits(introduction, [CONTENT_MATERIAL_TYPES.VIDEO]),
  true,
  'O vídeo deve ser suficiente para concluir o Passo 0.',
);

for (const phase of phases) {
  const slots = getContentMaterialSlots(phase);
  const availableExtraIds = getAvailableExtraMaterialIds(phase);

  assert.deepEqual(
    slots.map(({ id }) => id),
    [
      CONTENT_MATERIAL_TYPES.VIDEO,
      CONTENT_MATERIAL_TYPES.SLIDES,
      CONTENT_MATERIAL_TYPES.SUMMARY,
    ],
    `${phase.id} deve reservar os três espaços de materiais.`,
  );
  if (availableExtraIds.length > 0) {
    assert.equal(
      hasCompletedContentVisits(phase, [CONTENT_MATERIAL_TYPES.VIDEO]),
      false,
      `${phase.id} deve exigir um material extra quando ele está publicado.`,
    );
    assert.equal(
      hasCompletedContentVisits(phase, [
        CONTENT_MATERIAL_TYPES.VIDEO,
        availableExtraIds[0],
      ]),
      true,
      `${phase.id} deve aceitar vídeo mais um material extra publicado.`,
    );
  } else {
    assert.equal(
      hasCompletedContentVisits(phase, [CONTENT_MATERIAL_TYPES.VIDEO]),
      true,
      `${phase.id} deve aceitar somente o vídeo quando os extras estão pendentes.`,
    );
  }
}

console.log(
  'Modelo de materiais validado: vídeo obrigatório e extras exigidos somente quando publicados.',
);
