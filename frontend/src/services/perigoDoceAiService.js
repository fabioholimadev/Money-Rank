import { auth, authPersistenceReady, firebaseApp } from '../lib/firebaseConfig';
import {
  buildFallbackQuestions,
  buildPerigoDocePromptContext,
  PERIGO_DOCE_DIFFICULTIES,
  PERIGO_DOCE_OPTION_IDS,
  PERIGO_DOCE_QUESTION_COUNT,
  toQuizQuestion,
  validateGeneratedQuestionSet,
} from '../lib/perigoDoceQuiz';
import {
  ensureFirebaseAppCheck,
  isFirebaseAppCheckConfigured,
} from '../lib/firebaseAppCheck';

const DEFAULT_MODEL = 'gemini-3.6-flash';
const configuredModel = String(
  import.meta.env.VITE_FIREBASE_AI_MODEL || DEFAULT_MODEL,
).trim();

export const perigoDoceAiConfig = Object.freeze({
  enabled: import.meta.env.VITE_FIREBASE_AI_ENABLED === 'true',
  appCheckConfigured: isFirebaseAppCheckConfigured,
  model: configuredModel || DEFAULT_MODEL,
});

function buildResponseSchema(Schema) {
  const optionSchema = Schema.object({
    properties: {
      id: Schema.enumString({
        enum: [...PERIGO_DOCE_OPTION_IDS],
        description: 'Identificador da alternativa na ordem A, B, C e D.',
      }),
      text: Schema.string({
        description: 'Texto claro e autossuficiente da alternativa.',
      }),
    },
  });

  const questionSchema = Schema.object({
    properties: {
      id: Schema.string({
        description: 'Identificador curto e único da questão.',
      }),
      difficulty: Schema.enumString({
        enum: [...PERIGO_DOCE_DIFFICULTIES],
        description: 'Dificuldade pedagógica da questão.',
      }),
      prompt: Schema.string({
        description: 'Enunciado da questão em português brasileiro.',
      }),
      options: Schema.array({
        minItems: 4,
        maxItems: 4,
        items: optionSchema,
        description: 'Exatamente quatro alternativas na ordem A, B, C e D.',
      }),
      correctOptionId: Schema.enumString({
        enum: [...PERIGO_DOCE_OPTION_IDS],
        description: 'Identificador da única alternativa correta.',
      }),
      explanation: Schema.string({
        description:
          'Explicação educativa da resposta, sem inventar números ou fontes.',
      }),
      sourceFactIds: Schema.array({
        minItems: 1,
        maxItems: 2,
        items: Schema.string({}),
        description:
          'IDs exatos dos fatos da base que fundamentam a questão.',
      }),
    },
  });

  return Schema.object({
    properties: {
      questions: Schema.array({
        minItems: PERIGO_DOCE_QUESTION_COUNT,
        maxItems: PERIGO_DOCE_QUESTION_COUNT,
        items: questionSchema,
        description: `Exatamente ${PERIGO_DOCE_QUESTION_COUNT} questões diferentes.`,
      }),
    },
  });
}

const SYSTEM_INSTRUCTION = `
Você é o Capi Tutor, um tutor jovem, encorajador e responsável de educação
financeira para alunos do 3º ano de escolas técnicas brasileiras. Use linguagem
clara, respeitosa e com leve clima de game, sem infantilizar o estudante.

Regras obrigatórias:
1. Use estritamente os fatos presentes na base de conhecimento recebida.
2. Não use conhecimento externo, não crie estatísticas e não invente fontes.
3. Cada questão deve citar um ou dois IDs existentes em sourceFactIds.
4. Gere exatamente cinco questões diferentes, cada uma com quatro alternativas
   distintas (A, B, C e D) e uma única resposta correta.
5. Misture compreensão, aplicação em decisões de compra e análise econômica.
6. Não peça nem exponha nome, e-mail, UID ou qualquer dado pessoal do aluno.
7. Nunca determine pontuação, streak, aprovação ou recompensa em CapiCoins.
8. O saldo e o streak servem apenas para adaptar o tom motivacional; não altere
   a dificuldade para favorecer ou prejudicar o estudante.
9. Retorne somente o objeto definido pelo schema JSON.
`;

function createFallbackSeed(studentState) {
  const capiCoins = Number(studentState?.capiCoins) || 0;
  const streak = Number(studentState?.streak) || 0;
  return (Date.now() ^ (capiCoins * 31 + streak * 131)) >>> 0;
}

function fallbackResult(studentState, reason) {
  return {
    questions: buildFallbackQuestions(createFallbackSeed(studentState)),
    source: 'fallback',
    model: null,
    notice: reason,
  };
}

function buildGenerationPrompt(studentState) {
  const context = buildPerigoDocePromptContext(studentState);

  return [
    'Crie a avaliação da Fase 1 usando exclusivamente o contexto confiável abaixo.',
    'Distribua as cinco questões entre fatos diferentes sempre que possível.',
    'Não copie literalmente a mesma estrutura entre os enunciados.',
    JSON.stringify(context),
  ].join('\n\n');
}

function readJsonResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('A IA retornou um JSON que não pôde ser validado.');
  }
}

/**
 * Gera as questões com Firebase AI Logic. Qualquer indisponibilidade retorna
 * uma atividade local construída a partir da mesma base científica.
 */
export async function generatePerigoDoceQuestions(studentState = {}) {
  if (!perigoDoceAiConfig.enabled) {
    return fallbackResult(
      studentState,
      'A geração por IA está desativada neste ambiente. Foi usada a base local validada.',
    );
  }

  if (!perigoDoceAiConfig.appCheckConfigured) {
    return fallbackResult(
      studentState,
      'O App Check ainda não foi configurado. Foi usada a base local validada.',
    );
  }

  try {
    await authPersistenceReady;
    if (!auth.currentUser) {
      return fallbackResult(
        studentState,
        'A sessão não estava autenticada para acessar a IA. Foi usada a base local validada.',
      );
    }

    await ensureFirebaseAppCheck();

    const {
      getAI,
      getGenerativeModel,
      GoogleAIBackend,
      Schema,
    } = await import('firebase/ai');

    const ai = getAI(firebaseApp, {
      backend: new GoogleAIBackend(),
    });
    const model = getGenerativeModel(
      ai,
      {
        model: perigoDoceAiConfig.model,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: buildResponseSchema(Schema),
          maxOutputTokens: 4096,
        },
      },
      { timeout: 30000 },
    );
    const result = await model.generateContent(
      buildGenerationPrompt(studentState),
    );
    const payload = readJsonResponse(result.response.text());
    const questions = validateGeneratedQuestionSet(payload).map(
      toQuizQuestion,
    );

    return {
      questions,
      source: 'ai',
      model: perigoDoceAiConfig.model,
      notice:
        'Questões geradas com IA a partir da base científica da fase.',
    };
  } catch (error) {
    console.warn(
      'Firebase AI Logic indisponível; ativando contingência local.',
      error?.code || error?.name || 'unknown-error',
    );
    return fallbackResult(
      studentState,
      'A IA ficou indisponível ou retornou conteúdo inválido. Foi usada a base local validada.',
    );
  }
}
