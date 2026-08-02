import {
  getPerigoDoceKnowledgeForPrompt,
  perigoDoceKnowledge,
} from '../data/perigoDoceKnowledge.js';

export const PERIGO_DOCE_QUESTION_COUNT = 5;
export const PERIGO_DOCE_OPTION_IDS = Object.freeze(['A', 'B', 'C', 'D']);
export const PERIGO_DOCE_DIFFICULTIES = Object.freeze([
  'facil',
  'media',
  'desafiadora',
]);

const knowledgeById = new Map(
  perigoDoceKnowledge.map((fact) => [fact.id, fact]),
);

function createSeededRandom(seed) {
  let state = Number(seed) >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(values, random) {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [
      shuffled[targetIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function assertTextLength(value, field, minimum, maximum) {
  const normalized = normalizeText(value);

  if (normalized.length < minimum || normalized.length > maximum) {
    throw new Error(`Campo inválido na questão gerada: ${field}.`);
  }

  return normalized;
}

export function validateGeneratedQuestion(question, position = 0) {
  if (!question || typeof question !== 'object') {
    throw new Error(`Questão ${position + 1} não possui um objeto válido.`);
  }

  const difficulty = normalizeText(question.difficulty);
  if (!PERIGO_DOCE_DIFFICULTIES.includes(difficulty)) {
    throw new Error(`Dificuldade inválida na questão ${position + 1}.`);
  }

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    throw new Error(`A questão ${position + 1} deve ter quatro alternativas.`);
  }

  const options = question.options.map((option, optionIndex) => {
    const id = normalizeText(option?.id).toUpperCase();
    if (id !== PERIGO_DOCE_OPTION_IDS[optionIndex]) {
      throw new Error(
        `A alternativa ${optionIndex + 1} da questão ${position + 1} possui um identificador inválido.`,
      );
    }

    return {
      id,
      text: assertTextLength(
        option?.text,
        `alternativa ${id}`,
        8,
        260,
      ),
    };
  });

  const uniqueOptions = new Set(
    options.map((option) => option.text.toLocaleLowerCase('pt-BR')),
  );
  if (uniqueOptions.size !== options.length) {
    throw new Error(`A questão ${position + 1} contém alternativas repetidas.`);
  }

  const correctOptionId = normalizeText(
    question.correctOptionId,
  ).toUpperCase();
  if (!PERIGO_DOCE_OPTION_IDS.includes(correctOptionId)) {
    throw new Error(`Resposta correta inválida na questão ${position + 1}.`);
  }

  const sourceFactIds = Array.isArray(question.sourceFactIds)
    ? [...new Set(question.sourceFactIds.map(normalizeText).filter(Boolean))]
    : [];
  if (
    sourceFactIds.length < 1 ||
    sourceFactIds.length > 2 ||
    sourceFactIds.some((factId) => !knowledgeById.has(factId))
  ) {
    throw new Error(`Fonte inválida na questão ${position + 1}.`);
  }

  return {
    id:
      assertTextLength(question.id, 'id', 3, 100) ||
      `perigo-doce-${position + 1}`,
    difficulty,
    prompt: assertTextLength(
      question.prompt,
      'enunciado',
      20,
      420,
    ),
    options,
    correctOptionId,
    explanation: assertTextLength(
      question.explanation,
      'justificativa',
      20,
      500,
    ),
    sourceFactIds,
  };
}

export function validateGeneratedQuestionSet(payload) {
  if (
    !payload ||
    !Array.isArray(payload.questions) ||
    payload.questions.length !== PERIGO_DOCE_QUESTION_COUNT
  ) {
    throw new Error(
      `A atividade precisa de ${PERIGO_DOCE_QUESTION_COUNT} questões.`,
    );
  }

  const questions = payload.questions.map(validateGeneratedQuestion);
  const uniquePrompts = new Set(
    questions.map((question) =>
      question.prompt.toLocaleLowerCase('pt-BR'),
    ),
  );

  if (uniquePrompts.size !== questions.length) {
    throw new Error('A IA retornou enunciados repetidos.');
  }

  return questions;
}

export function toQuizQuestion(question) {
  const correctOptionIndex = question.options.findIndex(
    (option) => option.id === question.correctOptionId,
  );

  return {
    id: question.id,
    nivel: question.difficulty,
    enunciado: question.prompt,
    alternativas: question.options.map(
      (option) => `${option.id}) ${option.text}`,
    ),
    respostaCorreta: correctOptionIndex,
    justificativa: question.explanation,
    sourceFactIds: question.sourceFactIds,
  };
}

export function buildFallbackQuestions(seed = 1) {
  const random = createSeededRandom(seed);
  const selectedFacts = shuffleWithRandom(perigoDoceKnowledge, random).slice(
    0,
    PERIGO_DOCE_QUESTION_COUNT,
  );

  return selectedFacts.map((fact, questionIndex) => {
    const options = shuffleWithRandom(
      [
        { text: fact.claim, isCorrect: true },
        ...fact.misconceptions.map((text) => ({
          text,
          isCorrect: false,
        })),
      ],
      random,
    ).map((option, optionIndex) => ({
      ...option,
      id: PERIGO_DOCE_OPTION_IDS[optionIndex],
    }));
    const correctOption = options.find((option) => option.isCorrect);

    return toQuizQuestion(
      validateGeneratedQuestion(
        {
          id: `fallback-${fact.id}-${questionIndex + 1}`,
          difficulty: fact.difficulty,
          prompt: `Com base no material validado sobre ${fact.topic.toLocaleLowerCase('pt-BR')}, qual afirmação está correta?`,
          options: options.map(({ id, text }) => ({ id, text })),
          correctOptionId: correctOption.id,
          explanation: `${fact.explanation} Fonte: ${fact.source.publisher}.`,
          sourceFactIds: [fact.id],
        },
        questionIndex,
      ),
    );
  });
}

function normalizeNonNegativeInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : 0;
}

function normalizeRecentProgress(progressEntries) {
  if (!Array.isArray(progressEntries)) {
    return [];
  }

  return [...progressEntries]
    .filter((entry) => Number.isInteger(Number(entry?.phaseNumber)))
    .sort((left, right) => {
      const leftDate = Date.parse(left?.updatedAt || '') || 0;
      const rightDate = Date.parse(right?.updatedAt || '') || 0;
      return rightDate - leftDate;
    })
    .slice(0, 3)
    .map((entry) => ({
      phase: normalizeNonNegativeInteger(entry.phaseNumber),
      status: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(
        entry.status,
      )
        ? entry.status
        : 'NOT_STARTED',
    }));
}

export function buildPerigoDocePromptContext(studentState = {}) {
  return {
    student: {
      currentPhase: normalizeNonNegativeInteger(studentState.currentPhase),
      capiCoins: normalizeNonNegativeInteger(studentState.capiCoins),
      streak: normalizeNonNegativeInteger(studentState.streak),
      recentProgress: normalizeRecentProgress(studentState.progressEntries),
      lastLearningEvent:
        'O aluno concluiu os conteúdos da Fase 1 sobre consumo de açúcar, informação ao consumidor e decisões financeiras.',
    },
    activity: {
      phase: 1,
      title: 'O Perigo Doce',
      questionCount: PERIGO_DOCE_QUESTION_COUNT,
      language: 'pt-BR',
      audience:
        'Alunos do 3º ano de cursos técnicos, com conhecimento básico ou intermediário de educação financeira.',
    },
    knowledgeBase: getPerigoDoceKnowledgeForPrompt(),
  };
}
