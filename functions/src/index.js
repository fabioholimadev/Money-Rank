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
import {
  buildTeacherStudioPayload,
  normalizeDraftInput,
  normalizeEditorialKey,
  normalizeEditorialType,
  normalizeResearchInput,
  normalizeResearchReviewInput,
  normalizeVersionId,
} from './teacherStudio.js';
import {
  createContentAssetMetadata,
  createEditorialDraft,
  createResearchReview,
  getEditorialActorProfile,
  getPublishedActivityDefinition,
  getPublishedLearningModule,
  listEditorialStudioData,
  publishEditorialVersion,
  reviewResearch,
  submitEditorialForReview,
  updateEditorialDraft,
} from './editorialRepository.js';
import { getActivityKeyForPhase } from './editorialValidation.js';
import {
  deleteTeacherStudioFile,
  uploadTeacherStudioFile,
} from './teacherStudioStorage.js';
import {
  normalizeCompetitionPeriodCreateInput,
  normalizeCompetitionPeriodStatusInput,
  normalizeCompetitionPeriodUpdateInput,
} from './competitionPeriod.js';
import {
  createCompetitionPeriodAsTeacher,
  setCompetitionPeriodStatusAsTeacher,
  updateCompetitionPeriodAsTeacher,
} from './competitionPeriodRepository.js';

const REGION = 'southamerica-east1';
const UNLIMITED_ACTIVITY_SESSION_END = '9999-12-31T23:59:59.999Z';
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

async function requireTeacher(request) {
  const uid = requireStudent(request);
  const profile = await getEditorialActorProfile(uid);
  if (!profile || profile.role !== 'TEACHER' || !profile.profileCompleted) {
    throw new HttpsError(
      'permission-denied',
      'Somente um professor autorizado pode usar o Estúdio.',
    );
  }
  return uid;
}

function editorialError(error, fallbackMessage) {
  if (error instanceof HttpsError) return error;
  const message = String(error?.message ?? '').trim();
  const isExpectedEditorialError =
    /inválid|precisa|deve|não pode|somente|excede|encontrad|alterad|recusad/i
      .test(message);
  return new HttpsError(
    isExpectedEditorialError ? 'failed-precondition' : 'internal',
    isExpectedEditorialError ? message : fallbackMessage,
  );
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

function publicSession(sessionId, phaseNumber, prepared) {
  return {
    sessionId,
    phaseNumber,
    activityId: prepared.activityId,
    contentVersion: prepared.contentVersion,
    expiresAt: null,
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
      const activityKey = getActivityKeyForPhase(phaseNumber);
      const publishedVersion = activityKey
        ? await getPublishedActivityDefinition(activityKey)
        : null;
      const editorialDefinition = publishedVersion
        ? {
            ...publishedVersion.payload,
            contentVersion: `studio-${publishedVersion.version}`,
          }
        : null;
      const prepared = phaseNumber === 1
        ? await buildAiPerigoDoceSession({
            apiKey: geminiApiKey.value(),
            model: geminiModel.value(),
            definition: editorialDefinition,
          })
        : buildStaticSession(phaseNumber, {
            variantId,
            definition: editorialDefinition,
          });
      const sessionId = randomUUID();
      const expiresAt = UNLIMITED_ACTIVITY_SESSION_END;

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

      return publicSession(sessionId, phaseNumber, prepared);
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

export const getTeacherStudio = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const data = await listEditorialStudioData();
      return {
        ...buildTeacherStudioPayload(data),
        teacher: { authorized: true },
      };
    } catch (error) {
      logger.error('Falha ao carregar o Estúdio do Professor.', {
        teacherUid,
        message: error?.message,
      });
      throw editorialError(error, 'Não foi possível abrir o Estúdio.');
    }
  },
);

export const createTeacherStudioDraft = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const type = normalizeEditorialType(request.data?.type);
      const key = normalizeEditorialKey(request.data?.key);
      const version = await createEditorialDraft({
        type,
        key,
        actorUid: teacherUid,
      });
      return { versionId: version.id, version: Number(version.version) };
    } catch (error) {
      throw editorialError(error, 'Não foi possível criar o rascunho.');
    }
  },
);

export const createTeacherCompetitionPeriod = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const input = normalizeCompetitionPeriodCreateInput(request.data);
      return await createCompetitionPeriodAsTeacher({
        ...input,
        actorUid: teacherUid,
      });
    } catch (error) {
      throw editorialError(error, 'Não foi possível criar o período.');
    }
  },
);

export const updateTeacherCompetitionPeriod = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const input = normalizeCompetitionPeriodUpdateInput(request.data);
      return await updateCompetitionPeriodAsTeacher({
        ...input,
        actorUid: teacherUid,
      });
    } catch (error) {
      throw editorialError(error, 'Não foi possível alterar o período.');
    }
  },
);

export const setTeacherCompetitionPeriodStatus = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const input = normalizeCompetitionPeriodStatusInput(request.data);
      return await setCompetitionPeriodStatusAsTeacher({
        ...input,
        actorUid: teacherUid,
      });
    } catch (error) {
      throw editorialError(error, 'Não foi possível mudar o período.');
    }
  },
);

export const saveTeacherStudioDraft = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const input = normalizeDraftInput(request.data);
      const version = await updateEditorialDraft({
        ...input,
        actorUid: teacherUid,
      });
      return {
        versionId: version.id,
        status: version.status,
        updatedAt: version.updatedAt,
      };
    } catch (error) {
      throw editorialError(error, 'Não foi possível salvar o rascunho.');
    }
  },
);

export const submitTeacherStudioReview = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const type = normalizeEditorialType(request.data?.type);
      const versionId = normalizeVersionId(request.data?.versionId);
      const version = await submitEditorialForReview({
        type,
        versionId,
        actorUid: teacherUid,
      });
      return { versionId: version.id, status: version.status };
    } catch (error) {
      throw editorialError(error, 'Não foi possível enviar para revisão.');
    }
  },
);

export const publishTeacherStudioVersion = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const type = normalizeEditorialType(request.data?.type);
      const versionId = normalizeVersionId(request.data?.versionId);
      const version = await publishEditorialVersion({
        type,
        versionId,
        actorUid: teacherUid,
      });
      return {
        versionId: version.id,
        status: version.status,
        publishedAt: version.publishedAt,
      };
    } catch (error) {
      logger.warn('Publicação editorial recusada.', {
        teacherUid,
        message: error?.message,
      });
      throw editorialError(error, 'Não foi possível publicar a versão.');
    }
  },
);

export const createTeacherResearchReview = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const input = normalizeResearchInput(request.data);
      const reviewId = await createResearchReview({
        ...input,
        actorUid: teacherUid,
      });
      return { reviewId, status: 'PENDING_TEACHER_REVIEW' };
    } catch (error) {
      throw editorialError(error, 'Não foi possível registrar a pesquisa.');
    }
  },
);

export const reviewTeacherResearch = onCall(
  callableOptions,
  async (request) => {
    const teacherUid = await requireTeacher(request);
    try {
      const input = normalizeResearchReviewInput(request.data);
      return await reviewResearch({ ...input, actorUid: teacherUid });
    } catch (error) {
      throw editorialError(error, 'Não foi possível revisar a pesquisa.');
    }
  },
);

export const uploadTeacherStudioAsset = onCall(
  {
    ...callableOptions,
    timeoutSeconds: 90,
    memory: '512MiB',
  },
  async (request) => {
    const teacherUid = await requireTeacher(request);
    let uploaded = null;
    try {
      const entityType = normalizeEditorialType(request.data?.type);
      const entityId = normalizeVersionId(request.data?.versionId);
      uploaded = await uploadTeacherStudioFile({
        actorUid: teacherUid,
        entityType,
        entityId,
        fileName: request.data?.fileName,
        mimeType: request.data?.mimeType,
        base64: request.data?.base64,
      });
      const asset = await createContentAssetMetadata({
        ...uploaded,
        actorUid: teacherUid,
      });
      return { asset };
    } catch (error) {
      if (uploaded?.storagePath) {
        try {
          await deleteTeacherStudioFile(uploaded.storagePath);
        } catch (cleanupError) {
          logger.error('Falha ao compensar upload editorial.', {
            storagePath: uploaded.storagePath,
            message: cleanupError?.message,
          });
        }
      }
      throw editorialError(error, 'Não foi possível enviar o arquivo.');
    }
  },
);

export const getPublishedLearningContent = onCall(
  callableOptions,
  async (request) => {
    requireStudent(request);
    try {
      const moduleKey = normalizeEditorialKey(request.data?.moduleKey);
      const version = await getPublishedLearningModule(moduleKey);
      if (!version) {
        throw new HttpsError('not-found', 'Conteúdo publicado não encontrado.');
      }
      return {
        moduleKey: version.moduleKey,
        phaseNumber: Number(version.phaseNumber),
        version: Number(version.version),
        title: version.title,
        payload: version.payload,
        publishedAt: version.publishedAt,
      };
    } catch (error) {
      throw editorialError(error, 'Não foi possível carregar o conteúdo.');
    }
  },
);

export const getPublishedActivityCatalog = onCall(
  callableOptions,
  async (request) => {
    requireStudent(request);
    try {
      const activityKey = normalizeEditorialKey(request.data?.activityKey);
      const version = await getPublishedActivityDefinition(activityKey);
      if (!version) {
        throw new HttpsError('not-found', 'Atividade publicada não encontrada.');
      }
      if (Number(version.phaseNumber) === 1) {
        return {
          activityKey,
          phaseNumber: 1,
          version: Number(version.version),
          payload: null,
        };
      }
      return {
        activityKey: version.activityKey,
        phaseNumber: Number(version.phaseNumber),
        version: Number(version.version),
        payload: version.payload,
        publishedAt: version.publishedAt,
      };
    } catch (error) {
      throw editorialError(error, 'Não foi possível carregar a atividade.');
    }
  },
);
