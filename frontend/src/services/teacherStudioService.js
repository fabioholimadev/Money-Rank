import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { firebaseApp } from '../lib/firebaseConfig';
import { ensureFirebaseAppCheck } from '../lib/firebaseAppCheck';

const functions = getFunctions(firebaseApp, 'southamerica-east1');
const useFunctionsEmulator =
  import.meta.env.DEV &&
  (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true' ||
    import.meta.env.VITE_USE_DATA_CONNECT_EMULATOR === 'true');

if (useFunctionsEmulator) {
  const key = Symbol.for('money-rank:functions-emulator-connected');
  if (!globalThis[key]) {
    connectFunctionsEmulator(
      functions,
      import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || '127.0.0.1',
      Number(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT) || 5001,
    );
    globalThis[key] = true;
  }
}

const callableOptions = { timeout: 65_000, limitedUseAppCheckTokens: true };
const callables = {
  load: httpsCallable(functions, 'getTeacherStudio', callableOptions),
  createDraft: httpsCallable(
    functions,
    'createTeacherStudioDraft',
    callableOptions,
  ),
  saveDraft: httpsCallable(
    functions,
    'saveTeacherStudioDraft',
    callableOptions,
  ),
  submitReview: httpsCallable(
    functions,
    'submitTeacherStudioReview',
    callableOptions,
  ),
  publish: httpsCallable(
    functions,
    'publishTeacherStudioVersion',
    callableOptions,
  ),
  createResearch: httpsCallable(
    functions,
    'createTeacherResearchReview',
    callableOptions,
  ),
  reviewResearch: httpsCallable(
    functions,
    'reviewTeacherResearch',
    callableOptions,
  ),
  uploadAsset: httpsCallable(
    functions,
    'uploadTeacherStudioAsset',
    { ...callableOptions, timeout: 95_000 },
  ),
};

async function prepareRequest() {
  try {
    await ensureFirebaseAppCheck();
  } catch {
    if (!useFunctionsEmulator) {
      throw new Error('A verificação segura do Estúdio falhou.');
    }
  }
}

function normalizeError(error, fallback) {
  const message = String(error?.message || '').replace(/^Firebase:\s*/i, '');
  return new Error(message || fallback, { cause: error });
}

async function invoke(callable, payload, fallback) {
  await prepareRequest();
  try {
    const result = await callable(payload);
    return result.data;
  } catch (error) {
    throw normalizeError(error, fallback);
  }
}

export function fetchTeacherStudio() {
  return invoke(callables.load, {}, 'Não foi possível abrir o Estúdio.');
}

export function createStudioDraft(type, key) {
  return invoke(
    callables.createDraft,
    { type, key },
    'Não foi possível criar o rascunho.',
  );
}

export function saveStudioDraft(input) {
  return invoke(
    callables.saveDraft,
    input,
    'Não foi possível salvar o rascunho.',
  );
}

export function submitStudioReview(type, versionId) {
  return invoke(
    callables.submitReview,
    { type, versionId },
    'Não foi possível enviar para revisão.',
  );
}

export function publishStudioVersion(type, versionId) {
  return invoke(
    callables.publish,
    { type, versionId },
    'Não foi possível publicar a versão.',
  );
}

export function createStudioResearch(input) {
  return invoke(
    callables.createResearch,
    input,
    'Não foi possível adicionar a pesquisa.',
  );
}

export function reviewStudioResearch(reviewId, status, reviewNotes) {
  return invoke(
    callables.reviewResearch,
    { reviewId, status, reviewNotes },
    'Não foi possível revisar a pesquisa.',
  );
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
  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Selecione um arquivo válido.');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('O arquivo deve ter no máximo 8 MiB.');
  }
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = EDITORIAL_FILE_MIME_TYPES[extension];
  if (!mimeType) {
    throw new Error('Use um arquivo PDF, PPT, PPTX, DOC ou DOCX.');
  }
  const dataUrl = await readFileAsDataUrl(file);
  const encoded = dataUrl.slice(dataUrl.indexOf(',') + 1);
  if (!dataUrl.startsWith('data:') || !encoded) {
    throw new Error('Não foi possível preparar o arquivo para envio.');
  }
  const result = await invoke(
    callables.uploadAsset,
    {
      type,
      versionId,
      fileName: file.name,
      mimeType,
      base64: `data:${mimeType};base64,${encoded}`,
    },
    'Não foi possível enviar o arquivo.',
  );
  return result.asset;
}
