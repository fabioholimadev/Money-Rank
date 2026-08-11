import { fetchApiJson } from '../lib/api';

async function invoke(action, payload, fallback) {
  try {
    return await fetchApiJson(`/api/actions/${action}`, {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    throw new Error(error?.message || fallback, { cause: error });
  }
}

export function fetchTeacherStudio() {
  return invoke('teacher-studio-load', {}, 'Não foi possível abrir o Estúdio.');
}

export function createStudioDraft(type, key) {
  return invoke('teacher-studio-create-draft', { type, key }, 'Não foi possível criar o rascunho.');
}

export function saveStudioDraft(input) {
  return invoke('teacher-studio-save-draft', input, 'Não foi possível salvar o rascunho.');
}

export function submitStudioReview(type, versionId) {
  return invoke('teacher-studio-submit-review', { type, versionId }, 'Não foi possível enviar para revisão.');
}

export function publishStudioVersion(type, versionId) {
  return invoke('teacher-studio-publish', { type, versionId }, 'Não foi possível publicar a versão.');
}

export function createStudioResearch(input) {
  return invoke('teacher-studio-create-research', input, 'Não foi possível adicionar a pesquisa.');
}

export function reviewStudioResearch(reviewId, status, reviewNotes) {
  return invoke('teacher-studio-review-research', { reviewId, status, reviewNotes }, 'Não foi possível revisar a pesquisa.');
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

const EDITORIAL_FILE_MIME_TYPES = Object.freeze({
  pdf: 'application/pdf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
});

export async function uploadStudioAsset(type, versionId, file) {
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecione um arquivo válido.');
  if (file.size > 8 * 1024 * 1024) throw new Error('O arquivo deve ter no máximo 8 MiB.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = EDITORIAL_FILE_MIME_TYPES[extension];
  if (!mimeType) throw new Error('Use um arquivo PDF, PPT, PPTX, DOC ou DOCX.');
  const dataUrl = await readFileAsDataUrl(file);
  const encoded = dataUrl.slice(dataUrl.indexOf(',') + 1);
  if (!dataUrl.startsWith('data:') || !encoded) throw new Error('Não foi possível preparar o arquivo para envio.');
  const result = await invoke('teacher-studio-upload-asset', {
    type,
    versionId,
    fileName: file.name,
    mimeType,
    base64: `data:${mimeType};base64,${encoded}`,
  }, 'Não foi possível enviar o arquivo.');
  return result.asset;
}
