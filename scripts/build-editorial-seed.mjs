import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEALTH_CONSUMPTION_CONTENT } from '../frontend/src/data/healthConsumptionContent.js';
import { perigoDoceKnowledge } from '../frontend/src/data/perigoDoceKnowledge.js';
import { custoVicioCases } from '../frontend/src/data/custoVicioCases.js';
import { ilusaoDinheiroMission } from '../frontend/src/data/ilusaoDinheiroPaths.js';
import {
  ENGENHARIA_DESEJO_ACTIVITY,
  engenhariaDesejoAdBank,
} from '../frontend/src/data/engenhariaDesejoAds.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(
  scriptDirectory,
  '../functions/src/generated/editorial-seed.json',
);

const learningModules = Object.values(HEALTH_CONSUMPTION_CONTENT).map(
  (content) => ({
    moduleKey: content.id,
    phaseNumber: content.phaseNumber,
    title: content.title,
    payload: content,
  }),
);

const activityDefinitions = [
  {
    activityKey: 'perigo-doce-quiz',
    phaseNumber: 1,
    title: 'O Perigo do Doce — Quiz de Fixação',
    payload: {
      id: 'perigo-doce-quiz',
      phaseNumber: 1,
      title: 'O Perigo do Doce',
      questionCount: 5,
      passingScore: 60,
      knowledge: perigoDoceKnowledge,
    },
  },
  {
    activityKey: 'custo-vicio',
    phaseNumber: 2,
    title: 'O Custo do Vício — Estudo de Caso',
    payload: {
      id: 'custo-vicio',
      phaseNumber: 2,
      title: 'O Custo do Vício',
      passingScore: 60,
      cases: custoVicioCases,
    },
  },
  {
    activityKey: ilusaoDinheiroMission.id,
    phaseNumber: 3,
    title: 'A Ilusão do Dinheiro — Caminhos de Decisão',
    payload: ilusaoDinheiroMission,
  },
  {
    activityKey: ENGENHARIA_DESEJO_ACTIVITY.id,
    phaseNumber: 4,
    title: 'A Engenharia do Desejo — Fato ou Fake',
    payload: {
      ...ENGENHARIA_DESEJO_ACTIVITY,
      cards: engenhariaDesejoAdBank,
    },
  },
];

const seed = {
  schemaVersion: 1,
  generatedFrom: 'frontend/src/data',
  learningModules,
  activityDefinitions,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');

console.log(`Seed editorial gerado em ${outputPath}`);
