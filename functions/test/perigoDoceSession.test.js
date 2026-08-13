import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getPerigoDoceDefinition } from '../src/activityEngine.js';
import {
  buildAiPerigoDoceSession,
  parseGeneratedQuestions,
  PerigoDoceUnavailableError,
} from '../src/perigoDoceSession.js';

test('Fase 1 fica indisponível sem Gemini em vez de usar fallback', async () => {
  const diagnostics = [];
  await assert.rejects(() => buildAiPerigoDoceSession({
    apiKey: '',
    model: 'gemini-3.6-flash',
    onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
  }), (error) => error instanceof PerigoDoceUnavailableError
    && error.code === 'activity_generation_unavailable');

  assert.equal(diagnostics[0]?.source, 'unavailable');
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
