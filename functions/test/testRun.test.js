import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeTestDuration } from '../src/testRun.js';

test('modo de teste usa 60 minutos por padrão e impõe expiração curta', () => {
  assert.equal(normalizeTestDuration(), 60);
  assert.equal(normalizeTestDuration(5), 5);
  assert.equal(normalizeTestDuration(120), 120);
  assert.throws(() => normalizeTestDuration(4), /entre 5 e 120/);
  assert.throws(() => normalizeTestDuration(121), /entre 5 e 120/);
});
