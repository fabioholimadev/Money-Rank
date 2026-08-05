import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeDraftInput,
  normalizeVersionId,
} from '../src/teacherStudio.js';

const COMPACT_ID = 'f4d34e33350e497fad807e0bf1644848';
const CANONICAL_ID = 'f4d34e33-350e-497f-ad80-7e0bf1644848';

test('aceita UUID editorial compacto devolvido pelo Capi Bank', () => {
  assert.equal(normalizeVersionId(COMPACT_ID), CANONICAL_ID);
  assert.equal(normalizeVersionId(CANONICAL_ID), CANONICAL_ID);
});

test('normaliza o ID compacto antes de salvar um rascunho', () => {
  const input = normalizeDraftInput({
    type: 'LEARNING_MODULE',
    versionId: COMPACT_ID,
    title: 'Introdução atualizada',
    changeSummary: 'Atualiza o vídeo introdutório',
    payload: { id: 'introducao' },
  });

  assert.equal(input.versionId, CANONICAL_ID);
});

test('recusa identificador editorial fora do formato UUID', () => {
  assert.throws(() => normalizeVersionId('versao-2'), /inválida/);
});
