import {
  normalizeEditorialText,
  requireHttpsUrl,
} from './editorialValidation.js';

export const EDITORIAL_TYPES = Object.freeze({
  LEARNING_MODULE: 'LEARNING_MODULE',
  ACTIVITY_DEFINITION: 'ACTIVITY_DEFINITION',
});

const TYPE_VALUES = new Set(Object.values(EDITORIAL_TYPES));
const RESEARCH_STATUSES = new Set(['TEACHER_APPROVED', 'REJECTED']);
const PROPOSERS = new Set(['TEACHER', 'CODEX', 'GEMINI']);

export function normalizeEditorialType(value) {
  const type = String(value ?? '').trim().toUpperCase();
  if (!TYPE_VALUES.has(type)) throw new Error('Tipo editorial inválido.');
  return type;
}

export function normalizeEditorialKey(value) {
  const key = normalizeEditorialText(value, 'Identificador', 2, 96);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) {
    throw new Error('Identificador editorial inválido.');
  }
  return key;
}

export function normalizeVersionId(value) {
  const compact = String(value ?? '').trim().replaceAll('-', '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(compact)) {
    throw new Error('Versão editorial inválida.');
  }
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join('-');
}

export function normalizeDraftInput(value) {
  const input = value && typeof value === 'object' ? value : {};
  return {
    type: normalizeEditorialType(input.type),
    versionId: normalizeVersionId(input.versionId),
    title: normalizeEditorialText(input.title, 'Título', 3, 140),
    changeSummary: normalizeEditorialText(
      input.changeSummary,
      'Resumo da mudança',
      5,
      240,
    ),
    payload: input.payload,
  };
}

export function normalizeResearchInput(value) {
  const input = value && typeof value === 'object' ? value : {};
  const proposedBy = String(input.proposedBy ?? 'TEACHER')
    .trim()
    .toUpperCase();
  if (!PROPOSERS.has(proposedBy)) {
    throw new Error('Origem da pesquisa inválida.');
  }
  return {
    activityKey: normalizeEditorialKey(input.activityKey),
    factKey: normalizeEditorialKey(input.factKey),
    title: normalizeEditorialText(input.title, 'Título da fonte', 3, 180),
    claim: normalizeEditorialText(input.claim, 'Afirmação', 20, 1600),
    sourceUrl: requireHttpsUrl(input.sourceUrl, 'URL da fonte'),
    proposedBy,
  };
}

export function normalizeResearchReviewInput(value) {
  const input = value && typeof value === 'object' ? value : {};
  const status = String(input.status ?? '').trim().toUpperCase();
  if (!RESEARCH_STATUSES.has(status)) {
    throw new Error('Decisão de revisão inválida.');
  }
  return {
    reviewId: normalizeVersionId(input.reviewId),
    status,
    reviewNotes: input.reviewNotes
      ? normalizeEditorialText(input.reviewNotes, 'Observação', 3, 800)
      : null,
  };
}

function publicVersion(item, keyField) {
  return {
    id: item.id,
    key: item[keyField],
    phaseNumber: Number(item.phaseNumber),
    version: Number(item.version),
    status: item.status,
    title: item.title,
    changeSummary: item.changeSummary,
    payload: item.payload,
    publishedAt: item.publishedAt ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function buildTeacherStudioPayload(rawData) {
  return {
    learningModules: (rawData.learningModules ?? []).map((item) =>
      publicVersion(item, 'moduleKey')),
    activities: (rawData.activities ?? []).map((item) =>
      publicVersion(item, 'activityKey')),
    research: (rawData.research ?? []).map((item) => ({
      id: item.id,
      activityKey: item.activityKey,
      factKey: item.factKey,
      title: item.title,
      claim: item.claim,
      sourceUrl: item.sourceUrl,
      proposedBy: item.proposedBy,
      status: item.status,
      reviewNotes: item.reviewNotes,
      reviewedAt: item.reviewedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    assets: (rawData.assets ?? []).map((item) => ({
      id: item.id,
      entityType: item.entityType,
      entityId: item.entityId,
      assetType: item.assetType,
      displayName: item.displayName,
      url: item.url,
      mimeType: item.mimeType,
      sizeBytes: item.sizeBytes ? Number(item.sizeBytes) : null,
      sha256: item.sha256,
      createdAt: item.createdAt,
    })),
    audit: (rawData.audit ?? []).map((item) => ({
      id: item.id,
      entityType: item.entityType,
      entityId: item.entityId,
      entityKey: item.entityKey,
      version: Number(item.version),
      action: item.action,
      summary: item.summary,
      details: item.details,
      createdAt: item.createdAt,
    })),
  };
}
