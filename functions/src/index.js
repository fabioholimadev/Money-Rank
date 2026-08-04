import { randomUUID } from 'node:crypto';
import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import {
  buildStaticSession,
  getActivityDefinition,
  scoreActivitySession,
} from './activityEngine.js';
import {
  createActivitySession,
  getActivityResult,
  getActivitySession,
  getTeacherDashboardForChat,
  getStudentMentorContext,
  markActivitySessionSubmitted,
  persistActivityResult,
} from './activityRepository.js';
import { buildAiPerigoDoceSession } from './perigoDoceSession.js';
import {
  buildTeacherChatResponse,
  normalizeTeacherQuestion,
} from './teacherDataChat.js';
import {
  answerStudentMentor,
  normalizeMentorQuestion,
} from './studentMentor.js';

const REGION = 'southamerica-east1';
const SESSION_DURATION_MILLISECONDS = 45 * 60 * 1_000;
const isFunctionsEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
const geminiApiKey = defineSecret('GEMINI_API_KEY');
const geminiModel = defineString('GEMINI_MODEL', {
  default: 'gemini-3.6-flash',
});

const callableOptions = {
  region: REGION,
  enforceAppCheck: !isFunctionsEmulator,
  consumeAppCheckToken: !isFunctionsEmulator,
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 60,
};

function requireStudent(request) {
  if (!request.auth?.uid) {
    throw new HttpsError(
      'unauthenticated',
      'Entre com sua conta Google para continuar.',
    );
  }
  if (!request.auth.token?.email_verified) {
    throw new HttpsError(
      'permission-denied',
      'A conta Google precisa ter o e-mail verificado.',
    );
  }
  if (request.app?.alreadyConsumed) {
    throw new HttpsError(
      'aborted',
      'Esta solicitação segura já foi utilizada.',
    );
  }
  return request.auth.uid;
}

function normalizeUuid(value, message) {
  const uuid = String(value ?? '').trim();
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(uuid)) {
    throw new HttpsError('invalid-argument', message);
  }
  return uuid;
}

function normalizePhaseNumber(value) {
  const phaseNumber = Number(value);
  if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 4) {
    throw new HttpsError('invalid-argument', 'A fase informada não existe.');
  }
  return phaseNumber;
}

function normalizeVariantId(value) {
  if (value === null || value === undefined || value === '') return null;
  const variantId = String(value).trim();
  if (variantId.length < 1 || variantId.length > 128) {
    throw new HttpsError('invalid-argument', 'Personagem inválido.');
  }
  return variantId;
}

function publicSession(sessionId, phaseNumber, expiresAt, prepared) {
  return {
    sessionId,
    phaseNumber,
    activityId: prepared.activityId,
    contentVersion: prepared.contentVersion,
    expiresAt,
    ...prepared.publicPayload,
  };
}

function toClientResult(attempt) {
  if (!attempt) {
    throw new HttpsError(
      'failed-precondition',
      'A atividade não estava liberada ou a sessão expirou.',
    );
  }

  return {
    attemptId: attempt.id,
    score: Number(attempt.score),
    correctAnswers: Number(attempt.correctAnswers),
    wrongAnswers: Number(attempt.wrongAnswers),
    passed: Boolean(attempt.passed),
    firstCompletion: Boolean(attempt.firstCompletion),
    reward: Number(attempt.rewardAmount ?? 0),
    baseReward: Number(attempt.rewardBase ?? 0),
    multiplierPercent: Number(attempt.streakMultiplierPercent ?? 100),
    streakBonus: Number(attempt.streakBonus ?? 0),
    rewardLimitReached: Boolean(attempt.rewardLimitReached),
    rewardSuppressionReason: attempt.rewardSuppressionReason ?? 'NONE',
    rewardSuppressed:
      (attempt.rewardSuppressionReason ?? 'NONE') !== 'NONE',
    capiCoins: Number(attempt.user?.capiCoins ?? 0),
    streak: Number(attempt.user?.currentStreak ?? 0),
  };
}

export const startActivitySession = onCall(
  {
    ...callableOptions,
    secrets: [geminiApiKey],
  },
  async (request) => {
    const studentUid = requireStudent(request);
    const phaseNumber = normalizePhaseNumber(request.data?.phaseNumber);
    const variantId = normalizeVariantId(request.data?.variantId);

    try {
      getActivityDefinition(phaseNumber);
      const prepared = phaseNumber === 1
        ? await buildAiPerigoDoceSession({
            apiKey: geminiApiKey.value(),
            model: geminiModel.value(),
          })
        : buildStaticSession(phaseNumber, { variantId });
      const sessionId = randomUUID();
      const expiresAt = new Date(
        Date.now() + SESSION_DURATION_MILLISECONDS,
      ).toISOString();

      await createActivitySession({
        sessionId,
        studentUid,
        activityId: prepared.activityId,
        phaseNumber,
        variantId: prepared.variantId,
        contentVersion: prepared.contentVersion,
        publicPayload: prepared.publicPayload,
        answerKey: prepared.answerKey,
        expiresAt,
      });

      return publicSession(sessionId, phaseNumber, expiresAt, prepared);
    } catch (error) {
      logger.error('Falha ao preparar sessão autoritativa.', {
        phaseNumber,
        code: error?.code,
        message: error?.message,
      });
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        'failed-precondition',
        error?.message || 'Não foi possível preparar a atividade.',
      );
    }
  },
);

export const submitActivitySession = onCall(
  callableOptions,
  async (request) => {
    const studentUid = requireStudent(request);
    const sessionId = String(request.data?.sessionId ?? '').trim();
    const answers = request.data?.answers;

    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(sessionId)) {
      throw new HttpsError('invalid-argument', 'Sessão inválida.');
    }

    try {
      const session = await getActivitySession(sessionId);
      if (!session || session.userUid !== studentUid) {
        throw new HttpsError('not-found', 'Sessão não encontrada.');
      }

      const previousResult = await getActivityResult(sessionId);
      if (previousResult) {
        await markActivitySessionSubmitted(sessionId, studentUid);
        return toClientResult(previousResult);
      }

      if (session.status !== 'OPEN') {
        throw new HttpsError(
          'failed-precondition',
          'Esta sessão já foi encerrada.',
        );
      }
      if (Date.parse(session.expiresAt) <= Date.now()) {
        throw new HttpsError(
          'deadline-exceeded',
          'A sessão expirou. Inicie uma nova rodada.',
        );
      }

      const calculatedResult = scoreActivitySession(session, answers);
      const savedResult = await persistActivityResult(
        session,
        calculatedResult,
      );
      return toClientResult(savedResult);
    } catch (error) {
      logger.error('Falha ao concluir sessão autoritativa.', {
        sessionId,
        code: error?.code,
        message: error?.message,
      });
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        'failed-precondition',
        error?.message || 'Não foi possível concluir a atividade.',
      );
    }
  },
);

export const askTeacherData = onCall(
  {
    ...callableOptions,
    secrets: [geminiApiKey],
  },
  async (request) => {
    const teacherUid = requireStudent(request);
    const periodId = normalizeUuid(
      request.data?.periodId,
      'Selecione um período válido para a análise.',
    );
    const question = normalizeTeacherQuestion(request.data?.question);
    if (question.length < 5) {
      throw new HttpsError(
        'invalid-argument',
        'Escreva uma pergunta com pelo menos cinco caracteres.',
      );
    }

    try {
      const context = await getTeacherDashboardForChat(
        teacherUid,
        periodId,
      );
      if (!context?.summary) {
        throw new HttpsError(
          'permission-denied',
          'Somente um professor autorizado pode consultar estes dados.',
        );
      }

      const response = await buildTeacherChatResponse({
        question,
        rawContext: context,
        apiKey: geminiApiKey.value(),
        model: geminiModel.value(),
      });
      if (!response) {
        throw new HttpsError(
          'failed-precondition',
          'O período não possui dados válidos para esta análise.',
        );
      }

      return {
        ...response,
        periodId,
        scope: 'Dados agregados do período selecionado',
        limitations:
          'A análise não consulta e-mail, UID, respostas individuais ou dados fora do período.',
      };
    } catch (error) {
      logger.error('Falha no Chat de Dados do professor.', {
        periodId,
        code: error?.code,
        message: error?.message,
      });
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        'failed-precondition',
        'Não foi possível preparar a análise pedagógica agora.',
      );
    }
  },
);

export const askStudentMentor = onCall(
  {
    ...callableOptions,
    maxInstances: 5,
    timeoutSeconds: 45,
    secrets: [geminiApiKey],
  },
  async (request) => {
    const studentUid = requireStudent(request);
    const question = normalizeMentorQuestion(request.data?.question);
    if (question.length < 4) {
      throw new HttpsError(
        'invalid-argument',
        'Escreva uma pergunta um pouco mais detalhada.',
      );
    }

    try {
      const context = await getStudentMentorContext(studentUid);
      const response = await answerStudentMentor({
        question,
        rawContext: context,
        apiKey: geminiApiKey.value(),
        model: geminiModel.value(),
      });
      if (!response) {
        throw new HttpsError(
          'permission-denied',
          'O CapiMentor está disponível somente para alunos com perfil completo.',
        );
      }
      return {
        ...response,
        limitations:
          'O tutor pode errar e não substitui o professor nem fontes oficiais.',
      };
    } catch (error) {
      logger.error('Falha no CapiMentor.', {
        code: error?.code,
        message: error?.message,
      });
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        'failed-precondition',
        'O CapiMentor não conseguiu responder agora.',
      );
    }
  },
);
