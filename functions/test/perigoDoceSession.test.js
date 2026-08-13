import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getPerigoDoceDefinition, scoreActivitySession } from '../src/activityEngine.js';
import {
  buildAiPerigoDoceSession,
  buildFallbackPerigoDoceSession,
  parseGeneratedQuestions,
} from '../src/perigoDoceSession.js';

test('fallback da Fase 1 usa conteúdo validado e o contrato autoritativo', () => {
  const prepared = buildFallbackPerigoDoceSession(() => 0.25);
  const answers = prepared.answerKey.items.map((item) => ({
    questionId: item.itemId,
    optionId: item.correctOptionId,
  }));
  const result = scoreActivitySession(
    { phaseNumber: 1, answerKey: prepared.answerKey },
    answers,
  );

  assert.equal(prepared.publicPayload.source, 'fallback');
  assert.equal(prepared.publicPayload.questions.length, 5);
  assert.equal(prepared.answerKey.items.length, 5);
  assert.equal(JSON.stringify(prepared.publicPayload).includes('correctOptionId'), false);
  assert.equal(prepared.answerKey.items[0].tags.includes('validated-fallback'), true);
  assert.equal(result.score, 100);
  assert.equal(result.passed, true);
});

test('Fase 1 registra fallback sem considerar o Gemini aprovado', async () => {
  const diagnostics = [];
  const prepared = await buildAiPerigoDoceSession({
    apiKey: '',
    model: 'gemini-3.6-flash',
    onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
  });

  assert.equal(prepared.publicPayload.source, 'fallback');
  assert.equal(diagnostics[0]?.ok, false);
  assert.equal(diagnostics[0]?.source, 'fallback');
  assert.equal(diagnostics[0]?.reason, 'missing_api_key');
});

test('parser aceita JSON cercado por bloco Markdown', () => {
  const definition = getPerigoDoceDefinition();
  const questions = definition.knowledge.slice(0, 5).map((fact, index) => ({
    id: `gemini-${fact.id}-${index + 1}`,
    difficulty: fact.difficulty,
    prompt: `Considerando o fato validado sobre ${fact.topic}, qual alternativa está correta?`,
    options: [fact.claim, ...fact.misconceptions].map((text, optionIndex) => ({
      id: ['A', 'B', 'C', 'D'][optionIndex],
      text,
    })),
    correctOptionId: 'A',
    explanation: fact.explanation,
    sourceFactIds: [fact.id],
  }));

  const parsed = parseGeneratedQuestions(`\`\`\`json\n${JSON.stringify({ questions })}\n\`\`\``);
  assert.equal(parsed.length, 5);
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
