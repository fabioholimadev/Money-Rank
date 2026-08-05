import { createHash, randomUUID } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

if (getApps().length === 0) initializeApp();

export const MAX_TEACHER_STUDIO_FILE_BYTES = 8 * 1024 * 1024;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UID_PATTERN = /^[A-Za-z0-9:_-]{1,128}$/;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const ENTITY_TYPES = new Set(['LEARNING_MODULE', 'ACTIVITY_DEFINITION']);

const FILE_TYPES = Object.freeze({
  pdf: Object.freeze({
    assetType: 'DOCUMENT',
    mimeType: 'application/pdf',
    signature: 'pdf',
  }),
  ppt: Object.freeze({
    assetType: 'SLIDES',
    mimeType: 'application/vnd.ms-powerpoint',
    signature: 'ole',
  }),
  pptx: Object.freeze({
    assetType: 'SLIDES',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    signature: 'pptx',
  }),
  doc: Object.freeze({
    assetType: 'DOCUMENT',
    mimeType: 'application/msword',
    signature: 'ole',
  }),
  docx: Object.freeze({
    assetType: 'DOCUMENT',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    signature: 'docx',
  }),
});

function requireObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Arquivo do material inválido.');
  }
  return value;
}

function normalizeActorUid(value) {
  const actorUid = String(value ?? '').trim();
  if (!UID_PATTERN.test(actorUid)) {
    throw new Error('Professor responsável pelo arquivo inválido.');
  }
  return actorUid;
}

function normalizeEntityType(value) {
  const entityType = String(value ?? '').trim().toUpperCase();
  if (!ENTITY_TYPES.has(entityType)) {
    throw new Error('Tipo editorial do arquivo inválido.');
  }
  return entityType;
}

function normalizeEntityId(value) {
  const entityId = String(value ?? '').trim().toLowerCase();
  if (!UUID_PATTERN.test(entityId)) {
    throw new Error('Versão editorial do arquivo inválida.');
  }
  return entityId;
}

function normalizeFileName(value) {
  const displayName = String(value ?? '').trim();
  const hasControlCharacter = [...displayName].some((character) => {
    const codePoint = character.codePointAt(0);
    return codePoint <= 31 || codePoint === 127;
  });
  if (
    displayName.length < 3
    || displayName.length > 160
    || hasControlCharacter
    || displayName.includes('/')
    || displayName.includes('\\')
  ) {
    throw new Error('Nome do arquivo inválido.');
  }

  const extensionMatch = displayName.match(/\.([A-Za-z0-9]+)$/);
  const extension = extensionMatch?.[1].toLowerCase();
  const fileType = FILE_TYPES[extension];
  if (!fileType) {
    throw new Error('Formato não permitido. Use PDF, PPT, PPTX, DOC ou DOCX.');
  }

  const stem = displayName.slice(0, -(extension.length + 1))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') || 'material';

  return {
    displayName,
    extension,
    fileType,
    safeFileName: `${stem}.${extension}`,
  };
}

function splitDataUrl(value) {
  const base64 = String(value ?? '').trim();
  if (!base64.toLowerCase().startsWith('data:')) {
    return { declaredMimeType: null, encoded: base64 };
  }

  const match = base64.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) throw new Error('Conteúdo Base64 inválido.');
  return {
    declaredMimeType: match[1].toLowerCase(),
    encoded: match[2],
  };
}

function decodeBase64(value) {
  const { declaredMimeType, encoded } = splitDataUrl(value);
  const maximumEncodedLength = 4 * Math.ceil(
    MAX_TEACHER_STUDIO_FILE_BYTES / 3,
  );
  if (
    encoded.length === 0
    || encoded.length > maximumEncodedLength
    || encoded.length % 4 !== 0
    || !BASE64_PATTERN.test(encoded)
  ) {
    throw new Error('Conteúdo Base64 inválido ou acima do limite permitido.');
  }

  const content = Buffer.from(encoded, 'base64');
  if (
    content.length === 0
    || content.length > MAX_TEACHER_STUDIO_FILE_BYTES
    || content.toString('base64') !== encoded
  ) {
    throw new Error('Conteúdo Base64 inválido ou acima do limite permitido.');
  }
  return { content, declaredMimeType };
}

function hasPrefix(content, bytes) {
  return content.subarray(0, bytes.length).equals(Buffer.from(bytes));
}

function validateSignature(content, signature) {
  if (signature === 'pdf') {
    return content.subarray(0, 5).toString('ascii') === '%PDF-';
  }
  if (signature === 'ole') {
    return hasPrefix(content, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  }
  if (signature === 'docx' || signature === 'pptx') {
    const isZip = hasPrefix(content, [0x50, 0x4b, 0x03, 0x04])
      || hasPrefix(content, [0x50, 0x4b, 0x05, 0x06])
      || hasPrefix(content, [0x50, 0x4b, 0x07, 0x08]);
    const packageDirectory = signature === 'docx' ? 'word/' : 'ppt/';
    return isZip && content.includes(Buffer.from(packageDirectory));
  }
  return false;
}

function normalizeMimeType(value, fileType, declaredMimeType) {
  const mimeType = String(value ?? '').trim().toLowerCase();
  if (mimeType !== fileType.mimeType) {
    throw new Error('O tipo MIME não corresponde à extensão do arquivo.');
  }
  if (declaredMimeType && declaredMimeType !== mimeType) {
    throw new Error('O tipo MIME do Base64 não corresponde ao arquivo.');
  }
  return mimeType;
}

export function normalizeTeacherStudioFile(value) {
  const input = requireObject(value);
  const actorUid = normalizeActorUid(input.actorUid);
  const entityType = normalizeEntityType(input.entityType);
  const entityId = normalizeEntityId(input.entityId);
  const fileName = normalizeFileName(input.fileName);
  const { content, declaredMimeType } = decodeBase64(input.base64);
  const mimeType = normalizeMimeType(
    input.mimeType,
    fileName.fileType,
    declaredMimeType,
  );

  if (!validateSignature(content, fileName.fileType.signature)) {
    throw new Error('O conteúdo não corresponde ao formato informado.');
  }

  return {
    actorUid,
    entityType,
    entityId,
    assetType: fileName.fileType.assetType,
    displayName: fileName.displayName,
    safeFileName: fileName.safeFileName,
    mimeType,
    sizeBytes: content.length,
    sha256: createHash('sha256').update(content).digest('hex'),
    content,
  };
}

export function buildTeacherStudioStoragePath(file, uploadId = randomUUID()) {
  const safeUploadId = String(uploadId).trim().toLowerCase();
  if (!UUID_PATTERN.test(safeUploadId)) {
    throw new Error('Identificador do upload inválido.');
  }
  const entityDirectory = file.entityType.toLowerCase().replaceAll('_', '-');
  return [
    'teacher-studio',
    entityDirectory,
    file.entityId,
    `${file.sha256.slice(0, 16)}-${safeUploadId}-${file.safeFileName}`,
  ].join('/');
}

function buildDownloadUrl(bucketName, storagePath, downloadToken) {
  const origin = process.env.STORAGE_EMULATOR_HOST
    ? `http://${process.env.STORAGE_EMULATOR_HOST}`
    : 'https://firebasestorage.googleapis.com';
  return `${origin}/v0/b/${encodeURIComponent(bucketName)}`
    + `/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;
}

export async function uploadTeacherStudioFile(value, options = {}) {
  const normalized = normalizeTeacherStudioFile(value);
  const uploadId = options.uploadId ?? randomUUID();
  const downloadToken = options.downloadToken ?? randomUUID();
  if (!UUID_PATTERN.test(String(downloadToken))) {
    throw new Error('Token de download inválido.');
  }

  const storagePath = buildTeacherStudioStoragePath(normalized, uploadId);
  const bucket = options.bucket ?? getStorage().bucket(options.bucketName);
  const storageFile = bucket.file(storagePath);
  await storageFile.save(normalized.content, {
    resumable: false,
    metadata: {
      contentType: normalized.mimeType,
      cacheControl: 'private, max-age=0, no-transform',
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
        sha256: normalized.sha256,
        actorUid: normalized.actorUid,
        entityType: normalized.entityType,
        entityId: normalized.entityId,
      },
    },
  });

  return {
    entityType: normalized.entityType,
    entityId: normalized.entityId,
    assetType: normalized.assetType,
    displayName: normalized.displayName,
    url: buildDownloadUrl(bucket.name, storagePath, downloadToken),
    storagePath,
    mimeType: normalized.mimeType,
    sizeBytes: normalized.sizeBytes,
    sha256: normalized.sha256,
  };
}

export async function deleteTeacherStudioFile(storagePath, options = {}) {
  const normalizedPath = String(storagePath ?? '').trim();
  if (!normalizedPath.startsWith('teacher-studio/')) {
    throw new Error('Caminho de arquivo editorial inválido.');
  }
  const bucket = options.bucket ?? getStorage().bucket(options.bucketName);
  await bucket.file(normalizedPath).delete({ ignoreNotFound: true });
}
