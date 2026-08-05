import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildTeacherStudioStoragePath,
  MAX_TEACHER_STUDIO_FILE_BYTES,
  deleteTeacherStudioFile,
  normalizeTeacherStudioFile,
  uploadTeacherStudioFile,
} from '../src/teacherStudioStorage.js';

const ENTITY_ID = '123e4567-e89b-42d3-a456-426614174000';
const UPLOAD_ID = '123e4567-e89b-42d3-a456-426614174001';
const DOWNLOAD_TOKEN = '123e4567-e89b-42d3-a456-426614174002';

const FORMATS = [
  ['Aula.pdf', 'application/pdf', Buffer.from('%PDF-1.7\nconteudo')],
  [
    'Aula.ppt',
    'application/vnd.ms-powerpoint',
    Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 1]),
  ],
  [
    'Aula.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from('ppt/slides/slide1.xml')]),
  ],
  [
    'Aula.doc',
    'application/msword',
    Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 1]),
  ],
  [
    'Aula.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from('word/document.xml')]),
  ],
];

function inputFor(fileName, mimeType, content) {
  return {
    actorUid: 'teacher_01',
    entityType: 'LEARNING_MODULE',
    entityId: ENTITY_ID,
    fileName,
    mimeType,
    base64: content.toString('base64'),
  };
}

test('aceita somente os cinco formatos editoriais com assinatura coerente', () => {
  for (const [fileName, mimeType, content] of FORMATS) {
    const normalized = normalizeTeacherStudioFile(
      inputFor(fileName, mimeType, content),
    );
    assert.equal(normalized.sizeBytes, content.length);
    assert.match(normalized.sha256, /^[0-9a-f]{64}$/);
    assert.ok(Buffer.isBuffer(normalized.content));
  }
});

test('normaliza nome e monta caminho sem segmentos controlados pelo cliente', () => {
  const normalized = normalizeTeacherStudioFile(inputFor(
    'Orçamento Familiar 2026.PDF',
    'application/pdf',
    Buffer.from('%PDF-1.7\nconteudo'),
  ));
  assert.equal(normalized.safeFileName, 'orcamento-familiar-2026.pdf');
  assert.equal(
    buildTeacherStudioStoragePath(normalized, UPLOAD_ID),
    `teacher-studio/learning-module/${ENTITY_ID}/${normalized.sha256.slice(0, 16)}-${UPLOAD_ID}-orcamento-familiar-2026.pdf`,
  );
  assert.throws(
    () => normalizeTeacherStudioFile({
      ...inputFor('Aula.pdf', 'application/pdf', Buffer.from('%PDF-1.7')),
      fileName: '../Aula.pdf',
    }),
    /Nome do arquivo inválido/,
  );
});

test('rejeita extensão, MIME, Base64 e assinatura incompatíveis', () => {
  assert.throws(
    () => normalizeTeacherStudioFile(inputFor(
      'Aula.exe',
      'application/octet-stream',
      Buffer.from('MZ'),
    )),
    /Formato não permitido/,
  );
  assert.throws(
    () => normalizeTeacherStudioFile(inputFor(
      'Aula.pdf',
      'application/msword',
      Buffer.from('%PDF-1.7'),
    )),
    /tipo MIME/,
  );
  assert.throws(
    () => normalizeTeacherStudioFile({
      ...inputFor('Aula.pdf', 'application/pdf', Buffer.from('%PDF-1.7')),
      base64: '%%%%',
    }),
    /Base64/,
  );
  assert.throws(
    () => normalizeTeacherStudioFile(inputFor(
      'Aula.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.from('ppt/slides')]),
    )),
    /conteúdo não corresponde/,
  );
});

test('rejeita Base64 acima do limite antes de alocar o arquivo', () => {
  const oversizedBase64 = 'A'.repeat(
    4 * Math.ceil(MAX_TEACHER_STUDIO_FILE_BYTES / 3) + 4,
  );
  assert.throws(
    () => normalizeTeacherStudioFile({
      ...inputFor('Aula.pdf', 'application/pdf', Buffer.from('%PDF-1.7')),
      base64: oversizedBase64,
    }),
    /acima do limite/,
  );
});

test('upload administrativo salva bytes e retorna somente metadados', async () => {
  const calls = [];
  const bucket = {
    name: 'money-rank.firebasestorage.app',
    file(storagePath) {
      return {
        async save(content, options) {
          calls.push({ storagePath, content, options });
        },
      };
    },
  };
  const metadata = await uploadTeacherStudioFile(
    inputFor('Aula.pdf', 'application/pdf', Buffer.from('%PDF-1.7\nconteudo')),
    { bucket, uploadId: UPLOAD_ID, downloadToken: DOWNLOAD_TOKEN },
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0].content.toString(), '%PDF-1.7\nconteudo');
  assert.equal(calls[0].options.resumable, false);
  assert.equal(calls[0].options.metadata.contentType, 'application/pdf');
  assert.equal(
    calls[0].options.metadata.metadata.firebaseStorageDownloadTokens,
    DOWNLOAD_TOKEN,
  );
  assert.equal(metadata.storagePath, calls[0].storagePath);
  assert.match(metadata.url, /^https:\/\/firebasestorage\.googleapis\.com\//);
  assert.equal(metadata.base64, undefined);
  assert.equal(metadata.content, undefined);
});

test('compensa upload somente dentro do diretório editorial', async () => {
  const calls = [];
  const bucket = {
    file(storagePath) {
      return {
        async delete(options) {
          calls.push({ storagePath, options });
        },
      };
    },
  };

  await deleteTeacherStudioFile(
    `teacher-studio/learning-module/${ENTITY_ID}/arquivo.pdf`,
    { bucket },
  );

  assert.deepEqual(calls, [{
    storagePath: `teacher-studio/learning-module/${ENTITY_ID}/arquivo.pdf`,
    options: { ignoreNotFound: true },
  }]);
  await assert.rejects(
    deleteTeacherStudioFile('outro-diretorio/arquivo.pdf', { bucket }),
    /Caminho de arquivo editorial inválido/,
  );
});
