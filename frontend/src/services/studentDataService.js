import {
  completeMyCurrentPhase,
  completeMyCurrentPhaseContent,
  completeMyIntroduction,
  getMyActivityAttempt,
  getMyCapiCoinTransactionBySource,
  getMyProfile,
  initializeMyTrail,
  listMyCapiCoinTransactions,
  listMyProgress,
  registerMyCurrentPhaseAttempt,
  upsertMyProfileWithAvatar,
  upsertMyProfileWithPhoto,
  upsertMyProfileWithoutSyncedPhoto,
} from '@money-rank/dataconnect';
import {
  dataConnect,
  isDataConnectEnabled,
} from '../lib/dataConnectClient';
import { QueryFetchPolicy } from 'firebase/data-connect';
import {
  mapDataConnectUser,
  toDataConnectAvatar,
  toDataConnectClass,
} from '../lib/profileDataMapper';
import { normalizeAttemptReward } from '../lib/competitiveEconomy';

const MIN_PHASE = 1;
const MAX_PHASE = 4;

function requireDataConnect() {
  if (!isDataConnectEnabled) {
    throw new Error(
      'O Firebase SQL Connect está desativado. Ative-o no .env.local para salvar o progresso.',
    );
  }
}

function readAffectedRows(result) {
  const affectedRows = Number(result?.data?.affectedRows ?? 0);
  return Number.isInteger(affectedRows) && affectedRows > 0
    ? affectedRows
    : 0;
}

function normalizePhaseNumber(phaseNumber) {
  const normalizedPhase = Number(phaseNumber);

  if (
    !Number.isInteger(normalizedPhase) ||
    normalizedPhase < MIN_PHASE ||
    normalizedPhase > MAX_PHASE
  ) {
    throw new Error('A fase informada não existe na trilha atual.');
  }

  return normalizedPhase;
}

function normalizeActivityResult(result) {
  const score = Number(result?.score);
  const correctAnswers = Number(result?.correctAnswers);
  const wrongAnswers = Number(result?.wrongAnswers);

  if (
    !Number.isInteger(score) ||
    score < 0 ||
    score > 100 ||
    !Number.isInteger(correctAnswers) ||
    correctAnswers < 0 ||
    !Number.isInteger(wrongAnswers) ||
    wrongAnswers < 0
  ) {
    throw new Error('O resultado da atividade é inválido.');
  }

  return { score, correctAnswers, wrongAnswers };
}

function normalizeActivityId(activityId, phaseNumber) {
  const fallback = `phase-${phaseNumber}-activity`;
  const normalized = String(activityId || fallback).trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new Error('O identificador da atividade é inválido.');
  }

  return normalized;
}

function createAttemptId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error(
      'O navegador não oferece geração segura de identificadores.',
    );
  }

  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hexadecimal = [...bytes].map((byte) =>
    byte.toString(16).padStart(2, '0'),
  );

  return [
    hexadecimal.slice(0, 4).join(''),
    hexadecimal.slice(4, 6).join(''),
    hexadecimal.slice(6, 8).join(''),
    hexadecimal.slice(8, 10).join(''),
    hexadecimal.slice(10, 16).join(''),
  ].join('-');
}

async function fetchAttemptById(attemptId) {
  const result = await getMyActivityAttempt(
    dataConnect,
    { attemptId },
    { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
  );

  return result.data.activityAttempts[0] ?? null;
}

async function fetchTransactionBySource(sourceId) {
  const result = await getMyCapiCoinTransactionBySource(
    dataConnect,
    { sourceId },
    { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
  );

  return result.data.capiCoinTransactions[0] ?? null;
}

function isHttpsUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export async function fetchMyStudentProfile() {
  if (!isDataConnectEnabled) {
    return null;
  }

  const result = await getMyProfile(dataConnect, {
    fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
  });

  return mapDataConnectUser(result.data.user);
}

export async function syncStudentProfile(profile) {
  if (!isDataConnectEnabled) {
    return null;
  }

  const classGroup = toDataConnectClass(profile.turma);
  if (!classGroup) {
    throw new Error('A turma informada não existe no esquema do SQL Connect.');
  }

  const variables = {
    preferredName: profile.nome,
    classGroup,
  };
  const avatarId = toDataConnectAvatar(profile.avatar_id);

  if (profile.avatar_id && !avatarId) {
    throw new Error('A Capi escolhida não existe no esquema do SQL Connect.');
  }

  if (avatarId) {
    await upsertMyProfileWithAvatar(dataConnect, {
      ...variables,
      avatarId,
    });
  } else if (isHttpsUrl(profile.avatar_url)) {
    await upsertMyProfileWithPhoto(dataConnect, {
      ...variables,
      avatarUrl: profile.avatar_url,
    });
  } else {
    // Fotos locais em Base64 não devem ser gravadas no PostgreSQL.
    await upsertMyProfileWithoutSyncedPhoto(dataConnect, variables);
  }

  return fetchMyStudentProfile();
}

export async function fetchMyProgress() {
  if (!isDataConnectEnabled) {
    return [];
  }

  const result = await listMyProgress(dataConnect, {
    fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
  });

  return result.data.studentProgressEntries;
}

export async function fetchMyCapiCoinTransactions(offset = 0) {
  if (!isDataConnectEnabled) {
    return [];
  }

  const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0;
  const result = await listMyCapiCoinTransactions(
    dataConnect,
    { offset: safeOffset },
    { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
  );

  return result.data.capiCoinTransactions;
}

/**
 * Corrige somente perfis antigos que ainda estavam na Fase 1 sem qualquer
 * progresso. A operação do servidor impede que um aluno já iniciado seja
 * reiniciado.
 */
export async function initializeLegacyTrail() {
  requireDataConnect();
  const result = await initializeMyTrail(dataConnect);
  return readAffectedRows(result) > 0;
}

export async function completeIntroductionStep() {
  requireDataConnect();
  const result = await completeMyIntroduction(dataConnect);

  if (readAffectedRows(result) !== 1) {
    throw new Error(
      'O Passo 0 já foi concluído ou não é a etapa atual do aluno.',
    );
  }

  const transaction = await fetchTransactionBySource('introduction-0');

  return {
    reward: Number(transaction?.amount ?? 0),
    baseReward: Number(transaction?.baseAmount ?? 0),
    multiplierPercent: Number(
      transaction?.streakMultiplierPercent ?? 100,
    ),
    streakBonus: Number(transaction?.streakBonus ?? 0),
  };
}

export async function completePhaseContent(phaseNumber) {
  requireDataConnect();
  const normalizedPhase = normalizePhaseNumber(phaseNumber);
  const result = await completeMyCurrentPhaseContent(dataConnect, {
    phaseNumber: normalizedPhase,
  });

  const saved = readAffectedRows(result) === 1;
  const transaction = saved
    ? await fetchTransactionBySource(
        `phase-${normalizedPhase}-content`,
      )
    : null;

  return {
    saved,
    reward: Number(transaction?.amount ?? 0),
    baseReward: Number(transaction?.baseAmount ?? 0),
    multiplierPercent: Number(
      transaction?.streakMultiplierPercent ?? 100,
    ),
    streakBonus: Number(transaction?.streakBonus ?? 0),
  };
}

export async function registerPhaseAttempt(
  phaseNumber,
  activityResult,
  activityId,
) {
  requireDataConnect();
  const normalizedPhase = normalizePhaseNumber(phaseNumber);
  const normalizedResult = normalizeActivityResult(activityResult);

  if (normalizedResult.score >= 60) {
    throw new Error(
      'Uma tentativa aprovada deve ser registrada como conclusão.',
    );
  }

  const attemptId = createAttemptId();
  await registerMyCurrentPhaseAttempt(dataConnect, {
    attemptId,
    activityId: normalizeActivityId(activityId, normalizedPhase),
    phaseNumber: normalizedPhase,
    ...normalizedResult,
  });
  const attempt = await fetchAttemptById(attemptId);

  if (!attempt || attempt.passed) {
    throw new Error(
      'Não foi possível registrar a tentativa na fase atual.',
    );
  }

  return attempt;
}

export async function completePhaseActivity(
  phaseNumber,
  activityResult,
  activityId,
) {
  requireDataConnect();
  const normalizedPhase = normalizePhaseNumber(phaseNumber);
  const normalizedResult = normalizeActivityResult(activityResult);

  if (normalizedResult.score < 60 || normalizedResult.correctAnswers < 1) {
    throw new Error(
      'A pontuação mínima para concluir a atividade é 60%.',
    );
  }

  const attemptId = createAttemptId();
  await completeMyCurrentPhase(dataConnect, {
    attemptId,
    activityId: normalizeActivityId(activityId, normalizedPhase),
    phaseNumber: normalizedPhase,
    ...normalizedResult,
  });
  const attempt = await fetchAttemptById(attemptId);

  if (!attempt || !attempt.passed) {
    throw new Error(
      'A atividade está bloqueada ou o conteúdo ainda não foi concluído.',
    );
  }

  return normalizeAttemptReward(attempt);
}
