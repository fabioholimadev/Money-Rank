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
    [CONTENT_MATERIAL_TYPES.VIDEO],
    `${phase.id} deve exibir somente o vídeo durante a apresentação.`,
  );
  assert.deepEqual(availableExtraIds, [], `${phase.id} não deve expor materiais extras.`);
  assert.equal(
    hasCompletedContentVisits(phase, [CONTENT_MATERIAL_TYPES.VIDEO]),
    true,
    `${phase.id} deve aceitar somente o vídeo.`,
  );
}

console.log(
  'Modelo de materiais validado: somente o vídeo é exibido e obrigatório.',
);
