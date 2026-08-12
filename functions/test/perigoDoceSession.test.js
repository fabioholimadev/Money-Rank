import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { scoreActivitySession } from '../src/activityEngine.js';
import {
  buildAiPerigoDoceSession,
  buildFallbackPerigoDoceSession,
} from '../src/perigoDoceSession.js';

test('fallback da Fase 1 usa o mesmo contrato autoritativo do motor atual', () => {
  const prepared = buildFallbackPerigoDoceSession(() => 0.25);

  assert.equal(prepared.publicPayload.source, 'fallback');
  assert.equal(prepared.publicPayload.questions.length, 5);
  assert.equal(prepared.answerKey.items.length, 5);
  assert.equal(prepared.answerKey.selectedItemIds.length, 5);
  assert.equal(JSON.stringify(prepared.publicPayload).includes('correctOptionId'), false);

  const answers = prepared.answerKey.items.map((item) => ({
    questionId: item.itemId,
    optionId: item.correctOptionId,
  }));
  const result = scoreActivitySession(
    { phaseNumber: 1, answerKey: prepared.answerKey },
    answers,
  );

  assert.equal(result.score, 100);
  assert.equal(result.passed, true);
});

test('Fase 1 registra a causa quando a chave Gemini está ausente', async () => {
  const diagnostics = [];
  const prepared = await buildAiPerigoDoceSession({
    apiKey: '',
    model: 'gemini-3.6-flash',
    onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
  });

  assert.equal(prepared.publicPayload.source, 'fallback');
  assert.equal(diagnostics[0]?.reason, 'missing_api_key');
});

test('Gemini 3.6 não recebe parâmetros de amostragem descontinuados', async () => {
  const source = await readFile(
    new URL('../src/perigoDoceSession.js', import.meta.url),
    'utf8',
  );
  const generation = source.match(
    /ai\.models\.generateContent\([\s\S]*?\n\s*}\);/,
  )?.[0];
  assert.ok(generation);
  assert.doesNotMatch(generation, /temperature|topP|topK|candidateCount/);
});
