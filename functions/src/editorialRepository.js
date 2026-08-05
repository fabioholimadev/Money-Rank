import { randomUUID } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';
import seed from './generated/editorial-seed.json' with { type: 'json' };
import {
  validateActivityDefinitionPayload,
  validateEditorialPayload,
  validateLearningModulePayload,
  validatePedagogicalApproval,
} from './editorialValidation.js';

if (getApps().length === 0) initializeApp();

const dataConnect = getDataConnect({
  location: 'southamerica-east1',
  serviceId: 'money-rank-service',
  connector: 'money-rank-connector',
});

function unwrapData(response) {
  if (response?.errors?.length) {
    throw new Error(response.errors[0]?.message || 'Falha no Capi Bank.');
  }
  return response?.data ?? {};
}

async function executeQuery(name, variables = {}, options = undefined) {
  return unwrapData(await dataConnect.executeQuery(name, variables, options));
}

async function executeMutation(name, variables = {}) {
  return unwrapData(await dataConnect.executeMutation(name, variables));
}

export async function getEditorialActorProfile(uid) {
  const data = await executeQuery(
    'GetMyProfile',
    {},
    {
      impersonate: {
        authClaims: {
          sub: uid,
          email_verified: true,
        },
      },
    },
  );
  return data.user ?? null;
}

async function createSeedLearningModule(item) {
  const payload = validateLearningModulePayload(
    item.payload,
    item.moduleKey,
    item.phaseNumber,
  );
  const now = new Date().toISOString();
  await executeMutation('CreateLearningModuleVersionEditorial', {
    versionId: randomUUID(),
    moduleKey: item.moduleKey,
    phaseNumber: item.phaseNumber,
    version: 1,
    status: 'PUBLISHED',
    publicationKey: item.moduleKey,
    title: item.title,
    changeSummary: 'Versão estática inicial importada com segurança',
    payload,
    actorUid: 'system-seed',
    publishedByUid: 'system-seed',
    publishedAt: now,
  });
}

async function createSeedActivity(item) {
  const payload = validateActivityDefinitionPayload(
    item.payload,
    item.activityKey,
    item.phaseNumber,
  );
  const now = new Date().toISOString();
  await executeMutation('CreateActivityDefinitionVersionEditorial', {
    versionId: randomUUID(),
    activityKey: item.activityKey,
    phaseNumber: item.phaseNumber,
    version: 1,
    status: 'PUBLISHED',
    publicationKey: item.activityKey,
    title: item.title,
    changeSummary: 'Versão estática inicial importada com segurança',
    payload,
    actorUid: 'system-seed',
    publishedByUid: 'system-seed',
    publishedAt: now,
  });
}

export async function ensureEditorialSeed() {
  const current = await executeQuery('GetEditorialSeedState');
  const moduleKeys = new Set(
    (current.learningModules ?? []).map((item) => item.moduleKey),
  );
  const activityKeys = new Set(
    (current.activities ?? []).map((item) => item.activityKey),
  );

  for (const item of seed.learningModules) {
    if (moduleKeys.has(item.moduleKey)) continue;
    try {
      await createSeedLearningModule(item);
    } catch (error) {
      // Uma inicialização concorrente pode ter criado a mesma chave/versão.
      if (!/unique|duplicate|already exists/i.test(error?.message ?? '')) {
        throw error;
      }
    }
  }
  for (const item of seed.activityDefinitions) {
    if (activityKeys.has(item.activityKey)) continue;
    try {
      await createSeedActivity(item);
    } catch (error) {
      if (!/unique|duplicate|already exists/i.test(error?.message ?? '')) {
        throw error;
      }
    }
  }
}

export async function listEditorialStudioData() {
  await ensureEditorialSeed();
  return executeQuery('ListEditorialStudioData');
}

function entityCollection(data, type) {
  return type === 'LEARNING_MODULE'
    ? data.learningModules ?? []
    : data.activities ?? [];
}

function entityKey(item, type) {
  return type === 'LEARNING_MODULE' ? item.moduleKey : item.activityKey;
}

export async function createEditorialDraft({ type, key, actorUid }) {
  const data = await listEditorialStudioData();
  const versions = entityCollection(data, type)
    .filter((item) => entityKey(item, type) === key)
    .sort((left, right) => Number(right.version) - Number(left.version));
  const source = versions.find((item) => item.status === 'PUBLISHED') ?? versions[0];
  if (!source) throw new Error('Conteúdo editorial não encontrado.');

  const existingDraft = versions.find((item) =>
    ['DRAFT', 'IN_REVIEW'].includes(item.status));
  if (existingDraft) return existingDraft;

  const versionId = randomUUID();
  const version = Math.max(...versions.map((item) => Number(item.version)), 0) + 1;
  const variables = {
    versionId,
    phaseNumber: Number(source.phaseNumber),
    version,
    status: 'DRAFT',
    publicationKey: null,
    title: source.title,
    changeSummary: 'Nova versão em edição',
    payload: source.payload,
    actorUid,
    publishedByUid: null,
    publishedAt: null,
  };
  if (type === 'LEARNING_MODULE') {
    await executeMutation('CreateLearningModuleVersionEditorial', {
      ...variables,
      moduleKey: key,
    });
    const result = await executeQuery('GetLearningModuleVersionForEditorial', {
      versionId,
    });
    return result.learningModuleVersion;
  }
  await executeMutation('CreateActivityDefinitionVersionEditorial', {
    ...variables,
    activityKey: key,
  });
  const result = await executeQuery('GetActivityDefinitionVersionForEditorial', {
    versionId,
  });
  return result.activityDefinitionVersion;
}

async function getEditorialVersion(type, versionId) {
  const operation = type === 'LEARNING_MODULE'
    ? 'GetLearningModuleVersionForEditorial'
    : 'GetActivityDefinitionVersionForEditorial';
  const field = type === 'LEARNING_MODULE'
    ? 'learningModuleVersion'
    : 'activityDefinitionVersion';
  const data = await executeQuery(operation, { versionId });
  return data[field] ?? null;
}

export async function updateEditorialDraft({
  type,
  versionId,
  title,
  changeSummary,
  payload,
  actorUid,
}) {
  const current = await getEditorialVersion(type, versionId);
  if (!current || current.status !== 'DRAFT') {
    throw new Error('A versão não está disponível para edição.');
  }
  const key = entityKey(current, type);
  const validatedPayload = validateEditorialPayload(
    type,
    payload,
    key,
    current.phaseNumber,
  );
  const operation = type === 'LEARNING_MODULE'
    ? 'UpdateLearningModuleDraftEditorial'
    : 'UpdateActivityDefinitionDraftEditorial';
  const data = await executeMutation(operation, {
    versionId,
    title,
    changeSummary,
    payload: validatedPayload,
    actorUid,
  });
  if (Number(data.updatedCount) !== 1) {
    throw new Error('A versão foi alterada por outra sessão. Atualize o Estúdio.');
  }
  return getEditorialVersion(type, versionId);
}

export async function submitEditorialForReview({ type, versionId, actorUid }) {
  const operation = type === 'LEARNING_MODULE'
    ? 'SubmitLearningModuleForReviewEditorial'
    : 'SubmitActivityDefinitionForReviewEditorial';
  const data = await executeMutation(operation, { versionId, actorUid });
  if (Number(data.submittedCount) !== 1) {
    throw new Error('Somente um rascunho pode ser enviado para revisão.');
  }
  return getEditorialVersion(type, versionId);
}

export async function publishEditorialVersion({ type, versionId, actorUid }) {
  const current = await getEditorialVersion(type, versionId);
  if (!current || current.status !== 'IN_REVIEW') {
    throw new Error('Somente uma versão em revisão pode ser publicada.');
  }

  const key = entityKey(current, type);
  const validatedPayload = validateEditorialPayload(
    type,
    current.payload,
    key,
    current.phaseNumber,
  );
  const studioData = await executeQuery('ListEditorialStudioData');
  validatePedagogicalApproval(validatedPayload, {
    type,
    key,
    approvedResearchReviews: studioData.research ?? [],
  });

  const operation = type === 'LEARNING_MODULE'
    ? 'PublishLearningModuleVersionEditorial'
    : 'PublishActivityDefinitionVersionEditorial';
  const data = await executeMutation(operation, { versionId, actorUid });
  if (Number(data.publishedCount) !== 1) {
    throw new Error(
      'A publicação foi recusada. Confirme a revisão, as aprovações e o papel de professor.',
    );
  }
  return getEditorialVersion(type, versionId);
}

export async function getPublishedLearningModule(moduleKey) {
  await ensureEditorialSeed();
  const data = await executeQuery('GetPublishedLearningModuleForStudent', {
    moduleKey,
  });
  return data.learningModuleVersions?.[0] ?? null;
}

export async function getPublishedActivityDefinition(activityKey) {
  await ensureEditorialSeed();
  const data = await executeQuery('GetPublishedActivityDefinitionForSession', {
    activityKey,
  });
  return data.activityDefinitionVersions?.[0] ?? null;
}

export async function createResearchReview({
  activityKey,
  factKey,
  title,
  claim,
  sourceUrl,
  proposedBy,
  actorUid,
}) {
  const reviewId = randomUUID();
  await executeMutation('CreateResearchReviewEditorial', {
    reviewId,
    activityKey,
    factKey,
    title,
    claim,
    sourceUrl,
    proposedBy,
    actorUid,
  });
  return reviewId;
}

export async function reviewResearch({
  reviewId,
  status,
  reviewNotes,
  actorUid,
}) {
  const data = await executeMutation('ReviewResearchEditorial', {
    reviewId,
    status,
    reviewNotes,
    actorUid,
  });
  if (Number(data.reviewedCount) !== 1) {
    throw new Error('A pesquisa já foi revisada ou não existe.');
  }
  return { id: reviewId, status };
}

export async function createContentAssetMetadata({
  entityType,
  entityId,
  assetType,
  displayName,
  url,
  storagePath,
  mimeType,
  sizeBytes,
  sha256,
  actorUid,
}) {
  const data = await executeMutation('CreateContentAssetEditorial', {
    assetId: randomUUID(),
    entityType,
    entityId,
    assetType,
    displayName,
    url,
    storagePath,
    mimeType,
    sizeBytes,
    sha256,
    actorUid,
  });
  if (!data.createdAsset) {
    throw new Error(
      'O arquivo só pode ser associado a um rascunho por um professor autorizado.',
    );
  }
  return data.createdAsset;
}
