import { GoogleGenAI } from '@google/genai';
import { getPerigoDoceDefinition } from './activityEngine.js';

const OPTION_IDS = ['A', 'B', 'C', 'D'];
const DIFFICULTIES = ['facil', 'media', 'desafiadora'];

function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function requireText(value, field, minimum, maximum) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (text.length < minimum || text.length > maximum) {
    throw new Error(`Campo inválido na questão: ${field}.`);
  }
  return text;
}

function validateQuestions(payload, definition) {
  if (!Array.isArray(payload?.questions) || payload.questions.length !== 5) {
    throw new Error('A atividade precisa de cinco questões.');
  }

  const knowledgeIds = new Set(definition.knowledge.map((fact) => fact.id));
  const questionIds = new Set();

  return payload.questions.map((question, index) => {
    const id = requireText(question?.id, 'id', 3, 100);
    if (questionIds.has(id)) throw new Error('Questões duplicadas.');
    questionIds.add(id);

    if (!DIFFICULTIES.includes(question?.difficulty)) {
      throw new Error('Dificuldade de questão inválida.');
    }
    if (!Array.isArray(question?.options) || question.options.length !== 4) {
      throw new Error('Cada questão deve possuir quatro alternativas.');
    }

    const options = question.options.map((option, optionIndex) => {
      const optionId = String(option?.id ?? '').trim().toUpperCase();
      if (optionId !== OPTION_IDS[optionIndex]) {
        throw new Error('Identificador de alternativa inválido.');
      }
      return {
        id: optionId,
        text: requireText(option?.text, `alternativa ${optionId}`, 8, 260),
      };
    });
    const correctOptionId = String(
      question?.correctOptionId ?? '',
    ).toUpperCase();
    if (!OPTION_IDS.includes(correctOptionId)) {
      throw new Error('Gabarito de questão inválido.');
    }
    const sourceFactIds = [...new Set(
      Array.isArray(question?.sourceFactIds)
        ? question.sourceFactIds.map(String)
        : [],
    )];
    if (
      sourceFactIds.length < 1 ||
      sourceFactIds.length > 2 ||
      sourceFactIds.some((factId) => !knowledgeIds.has(factId))
    ) {
      throw new Error('Fonte de questão inválida.');
    }

    return {
      id: id || `perigo-doce-${index + 1}`,
      difficulty: question.difficulty,
      prompt: requireText(question?.prompt, 'enunciado', 20, 420),
      options,
      correctOptionId,
      explanation: requireText(
        question?.explanation,
        'explicação',
        20,
        500,
      ),
      sourceFactIds,
    };
  });
}

function splitQuestionPayload(questions, source, model = null) {
  return {
    publicPayload: {
      source,
      model,
      questions: questions.map((question) => ({
        id: question.id,
        difficulty: question.difficulty,
        prompt: question.prompt,
        options: question.options,
      })),
    },
    answerKey: {
      questions: questions.map(({
        id,
        correctOptionId,
        explanation,
        sourceFactIds,
      }) => ({
        id,
        correctOptionId,
        explanation,
        sourceFactIds,
      })),
    },
  };
}

export function buildFallbackPerigoDoceSession(random = Math.random) {
  const definition = getPerigoDoceDefinition();
  const facts = shuffle(definition.knowledge, random).slice(0, 5);
  const questions = facts.map((fact, questionIndex) => {
    const options = shuffle(
      [
        { text: fact.claim, correct: true },
        ...fact.misconceptions.map((text) => ({ text, correct: false })),
      ],
      random,
    ).map((option, optionIndex) => ({
      ...option,
      id: OPTION_IDS[optionIndex],
    }));
    return {
      id: `fallback-${fact.id}-${questionIndex + 1}`,
      difficulty: fact.difficulty,
      prompt: `Com base no material validado sobre ${fact.topic.toLocaleLowerCase('pt-BR')}, qual afirmação está correta?`,
      options: options.map(({ id, text }) => ({ id, text })),
      correctOptionId: options.find((option) => option.correct).id,
      explanation: `${fact.explanation} Fonte: ${fact.source.publisher}.`,
      sourceFactIds: [fact.id],
    };
  });

  return {
    activityId: 'perigo-doce-quiz',
    variantId: 'fallback',
    contentVersion: definition.contentVersion,
    ...splitQuestionPayload(questions, 'fallback'),
  };
}

const responseSchema = {
  type: 'object',
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        required: [
          'id',
          'difficulty',
          'prompt',
          'options',
          'correctOptionId',
          'explanation',
          'sourceFactIds',
        ],
        properties: {
          id: { type: 'string' },
          difficulty: { type: 'string', enum: DIFFICULTIES },
          prompt: { type: 'string' },
          options: {
            type: 'array',
            minItems: 4,
            maxItems: 4,
            items: {
              type: 'object',
              required: ['id', 'text'],
              properties: {
                id: { type: 'string', enum: OPTION_IDS },
                text: { type: 'string' },
              },
            },
          },
          correctOptionId: { type: 'string', enum: OPTION_IDS },
          explanation: { type: 'string' },
          sourceFactIds: {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: { type: 'string' },
          },
        },
      },
    },
  },
};

export async function buildAiPerigoDoceSession({ apiKey, model }) {
  if (!apiKey || apiKey === 'local-fallback') {
    return buildFallbackPerigoDoceSession();
  }

  const definition = getPerigoDoceDefinition();
  const ai = new GoogleGenAI({ apiKey });
  const prompt = [
    'Você é o Capi Tutor, tutor jovem e responsável de educação financeira para o 3º ano de escolas técnicas brasileiras.',
    'Gere exatamente cinco questões de múltipla escolha em português brasileiro.',
    'Use somente os fatos fornecidos. Não invente estatísticas ou fontes.',
    'Cada questão deve ter A, B, C e D, uma resposta correta e um ou dois sourceFactIds existentes.',
    'Não inclua dados pessoais, pontuação, streak ou recompensa.',
    JSON.stringify({ knowledgeBase: definition.knowledge }),
  ].join('\n\n');

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: responseSchema,
        temperature: 0.55,
        maxOutputTokens: 4096,
      },
    });
    const questions = validateQuestions(JSON.parse(response.text), definition);
    return {
      activityId: 'perigo-doce-quiz',
      variantId: 'ai',
      contentVersion: definition.contentVersion,
      ...splitQuestionPayload(questions, 'ai', model),
    };
  } catch {
    return buildFallbackPerigoDoceSession();
  }
}
