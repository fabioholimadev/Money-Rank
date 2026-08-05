import assert from 'node:assert/strict';
import test from 'node:test';
import seed from '../src/generated/editorial-seed.json' with { type: 'json' };
import {
  validateActivityDefinitionPayload,
  validateLearningModulePayload,
  validatePedagogicalApproval,
  normalizeVideoEmbedUrl,
} from '../src/editorialValidation.js';

const clone = (value) => structuredClone(value);

test('catálogo editorial inicial inteiro atende ao contrato de publicação', () => {
  for (const item of seed.learningModules) {
    assert.doesNotThrow(() => validateLearningModulePayload(
      item.payload,
      item.moduleKey,
      item.phaseNumber,
    ));
  }
  for (const item of seed.activityDefinitions) {
    assert.doesNotThrow(() => validateActivityDefinitionPayload(
      item.payload,
      item.activityKey,
      item.phaseNumber,
    ));
  }
});

test('módulo rejeita material publicado com URL insegura', () => {
  const item = clone(seed.learningModules.find(({ phaseNumber }) => phaseNumber === 1));
  item.payload.materialSlots.video.embedUrl = 'http://site-inseguro.test/video';
  assert.throws(
    () => validateLearningModulePayload(item.payload, item.moduleKey, 1),
    /HTTPS/,
  );
});

test('normaliza links comuns do YouTube para uma URL incorporável', () => {
  assert.equal(
    normalizeVideoEmbedUrl('https://www.youtube.com/watch?v=k6O554uP2Kc'),
    'https://www.youtube-nocookie.com/embed/k6O554uP2Kc',
  );
  assert.equal(
    normalizeVideoEmbedUrl('https://youtu.be/k6O554uP2Kc'),
    'https://www.youtube-nocookie.com/embed/k6O554uP2Kc',
  );
  assert.equal(
    normalizeVideoEmbedUrl('https://www.youtube.com/shorts/k6O554uP2Kc'),
    'https://www.youtube-nocookie.com/embed/k6O554uP2Kc',
  );
  assert.throws(
    () => normalizeVideoEmbedUrl('https://www.youtube.com/@canal'),
    /link de um vídeo/,
  );
});

test('Custo do Vício exige pesos 1, 2 e 3 em cada decisão', () => {
  const item = clone(seed.activityDefinitions.find(({ phaseNumber }) => phaseNumber === 2));
  item.payload.cases[0].decisions[0].options[0].points = 3;
  assert.throws(
    () => validateActivityDefinitionPayload(item.payload, item.activityKey, 2),
    /pesos 1, 2 e 3/,
  );
});

test('Engenharia do Desejo exige evidência HTTPS nas peças reais', () => {
  const item = clone(seed.activityDefinitions.find(({ phaseNumber }) => phaseNumber === 4));
  const realCard = item.payload.cards.find(({ classification }) => classification === 'REAL');
  realCard.evidence.url = '';
  assert.throws(
    () => validateActivityDefinitionPayload(item.payload, item.activityKey, 4),
    /URL da evidência/,
  );
});

test('identificador e fase de uma versão editorial são imutáveis', () => {
  const item = clone(seed.activityDefinitions[0]);
  item.payload.id = 'outra-atividade';
  assert.throws(
    () => validateActivityDefinitionPayload(
      item.payload,
      item.activityKey,
      item.phaseNumber,
    ),
    /não pode ser alterado/,
  );
});

function approvePayloadReviews(payload) {
  const approved = clone(payload);
  const visit = (value) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== 'object') return;
    if (value.review) value.review.pedagogical = 'teacher_approved';
    Object.values(value).forEach(visit);
  };
  visit(approved);
  return approved;
}

test('publicação rejeita marcador pedagógico ainda pendente', () => {
  const item = clone(seed.activityDefinitions.find(({ phaseNumber }) =>
    phaseNumber === 1));
  assert.throws(
    () => validatePedagogicalApproval(item.payload, {
      type: 'ACTIVITY_DEFINITION',
      key: item.activityKey,
      approvedResearchReviews: [],
    }),
    /ainda não possui aprovação pedagógica/,
  );
});

test('aprovação nominal no payload não substitui ResearchReview aprovado', () => {
  const item = clone(seed.activityDefinitions.find(({ phaseNumber }) =>
    phaseNumber === 1));
  const payload = approvePayloadReviews(item.payload);
  assert.throws(
    () => validatePedagogicalApproval(payload, {
      type: 'ACTIVITY_DEFINITION',
      key: item.activityKey,
      approvedResearchReviews: [],
    }),
    /vinculado a uma pesquisa aprovada/,
  );
});

test('fonte aprovada exige vínculo exato de atividade, fato, URL e claim', () => {
  const item = clone(seed.activityDefinitions.find(({ phaseNumber }) =>
    phaseNumber === 1));
  const payload = approvePayloadReviews(item.payload);
  const approvedResearchReviews = payload.knowledge.map((fact) => ({
    activityKey: item.activityKey,
    factKey: fact.id,
    sourceUrl: fact.source.url,
    claim: fact.claim,
    status: 'TEACHER_APPROVED',
    reviewedByUid: 'teacher-1',
    reviewedAt: '2026-08-04T12:00:00.000Z',
  }));

  assert.doesNotThrow(() => validatePedagogicalApproval(payload, {
    type: 'ACTIVITY_DEFINITION',
    key: item.activityKey,
    approvedResearchReviews,
  }));

  approvedResearchReviews[0].sourceUrl = 'https://example.com/outra-fonte';
  assert.throws(
    () => validatePedagogicalApproval(payload, {
      type: 'ACTIVITY_DEFINITION',
      key: item.activityKey,
      approvedResearchReviews,
    }),
    /vinculado a uma pesquisa aprovada/,
  );
});

test('conteúdo criado pelo projeto requer aval pedagógico sem fonte externa', () => {
  const payload = {
    nested: [{
      id: 'cenario-ficticio',
      review: {
        technical: 'project_created',
        pedagogical: 'teacher_approved',
      },
    }],
  };
  assert.doesNotThrow(() => validatePedagogicalApproval(payload, {
    type: 'ACTIVITY_DEFINITION',
    key: 'atividade',
  }));
});
