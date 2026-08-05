import {
  ensureEditorialSeed,
  getPublishedActivityDefinition,
  getPublishedLearningModule,
  listEditorialStudioData,
} from '../functions/src/editorialRepository.js';

await ensureEditorialSeed();

const studio = await listEditorialStudioData();
if (studio.learningModules?.length !== 5) {
  throw new Error(`Esperados 5 módulos; recebidos ${studio.learningModules?.length ?? 0}.`);
}
if (studio.activities?.length !== 4) {
  throw new Error(`Esperadas 4 atividades; recebidas ${studio.activities?.length ?? 0}.`);
}

const learningModule = await getPublishedLearningModule('perigo-doce');
const activity = await getPublishedActivityDefinition('perigo-doce-quiz');
if (!learningModule?.version || !activity?.version) {
  throw new Error('O catálogo inicial não está publicado corretamente.');
}

console.log('Smoke editorial aprovado: 5 módulos, 4 atividades e leitura publicada.');
