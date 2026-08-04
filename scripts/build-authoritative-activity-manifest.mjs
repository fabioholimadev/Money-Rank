import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CUSTO_VICIO_CONTENT_VERSION,
  custoVicioCases,
} from '../frontend/src/data/custoVicioCases.js';
import {
  ENGENHARIA_DESEJO_ACTIVITY,
  ENGENHARIA_DESEJO_CONTENT_VERSION,
  engenhariaDesejoAdBank,
} from '../frontend/src/data/engenhariaDesejoAds.js';
import {
  ILUSAO_DINHEIRO_CONTENT_VERSION,
  ilusaoDinheiroMission,
} from '../frontend/src/data/ilusaoDinheiroPaths.js';
import {
  PERIGO_DOCE_KNOWLEDGE_VERSION,
  perigoDoceKnowledge,
} from '../frontend/src/data/perigoDoceKnowledge.js';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(
  scriptDirectory,
  '../functions/src/generated/activity-manifest.json',
);

const manifest = {
  schemaVersion: 1,
  generatedFrom: 'frontend/src/data',
  activities: {
    'perigo-doce-quiz': {
      phaseNumber: 1,
      contentVersion: PERIGO_DOCE_KNOWLEDGE_VERSION,
      passingScore: 60,
      questionCount: 5,
      knowledge: perigoDoceKnowledge.map((fact) => ({
        id: fact.id,
        topic: fact.topic,
        difficulty: fact.difficulty,
        claim: fact.claim,
        explanation: fact.explanation,
        misconceptions: fact.misconceptions,
        teachingAngle: fact.teachingAngle,
        source: fact.source,
      })),
    },
    'custo-vicio': {
      phaseNumber: 2,
      contentVersion: CUSTO_VICIO_CONTENT_VERSION,
      passingScore: 60,
      cases: custoVicioCases.map((caseItem) => ({
        id: caseItem.id,
        decisions: caseItem.decisions.map((decision) => ({
          id: decision.id,
          options: decision.options.map((option) => ({
            id: option.id,
            points: option.points,
          })),
        })),
      })),
    },
    [ilusaoDinheiroMission.id]: {
      phaseNumber: 3,
      contentVersion: ILUSAO_DINHEIRO_CONTENT_VERSION,
      passingScore: 60,
      decisions: ilusaoDinheiroMission.decisions.map((decision) => ({
        id: decision.id,
        choices: decision.choices.map((choice) => ({
          id: choice.id,
          analysisPoints: choice.analysisPoints,
          balanceDelta: choice.balanceDelta,
        })),
      })),
    },
    [ENGENHARIA_DESEJO_ACTIVITY.id]: {
      phaseNumber: 4,
      contentVersion: ENGENHARIA_DESEJO_CONTENT_VERSION,
      passingCorrectAnswers:
        ENGENHARIA_DESEJO_ACTIVITY.passingCorrectAnswers,
      cards: engenhariaDesejoAdBank.map((card) => ({
        id: card.id,
        classification: card.classification,
      })),
    },
  },
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(`Manifesto autoritativo gerado em ${outputPath}`);
