import { getApps, initializeApp } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

if (getApps().length === 0) initializeApp();

const dataConnect = getDataConnect({
  location: 'southamerica-east1',
  serviceId: 'money-rank-service',
  connector: 'money-rank-connector',
});

function unwrapData(response) {
  if (response?.errors?.length) {
    throw new Error(response.errors[0]?.message || 'Falha no Capi Bank.');
  }
  return response?.data ?? {};
}

export async function createActivitySession(session) {
  const response = await dataConnect.executeMutation(
    'CreateAuthoritativeActivitySession',
    session,
  );
  return unwrapData(response);
}

export async function getActivitySession(sessionId) {
  const response = await dataConnect.executeQuery(
    'GetAuthoritativeActivitySession',
    { sessionId },
  );
  return unwrapData(response).activitySession ?? null;
}

export async function getActivityResult(sessionId) {
  const response = await dataConnect.executeQuery(
    'GetAuthoritativeActivityResult',
    { sessionId },
  );
  return unwrapData(response).activityAttempts?.[0] ?? null;
}

export async function getPedagogicalActivityBank(studentUid, activityId) {
  const [bankResponse, seenResponse] = await Promise.all([
    dataConnect.executeQuery(
      'ListActivePedagogicalItemsForActivity',
      { activityId },
    ),
    dataConnect.executeQuery(
      'ListStudentSeenPedagogicalItemIds',
      { studentUid, activityId },
    ),
  ]);
  const bankData = unwrapData(bankResponse);
  const seenData = unwrapData(seenResponse);
  return {
    items: bankData.pedagogicalItems ?? [],
    seenItemIds: (seenData.seenItems ?? []).map((item) => item.itemId),
  };
}

export async function getTeacherDashboardForChat(
  teacherUid,
  periodId,
) {
  const response = await dataConnect.executeQuery(
    'GetTeacherDashboard',
    { periodId, studentLimit: 1 },
    {
      impersonate: {
        authClaims: {
          sub: teacherUid,
          email_verified: true,
        },
      },
    },
  );
  return unwrapData(response);
}

export async function getStudentMentorContext(studentUid) {
  const options = {
    impersonate: {
      authClaims: {
        sub: studentUid,
        email_verified: true,
      },
    },
  };
  const [profileResponse, progressResponse] = await Promise.all([
    dataConnect.executeQuery('GetMyProfile', {}, options),
    dataConnect.executeQuery('ListMyProgress', {}, options),
  ]);
  const profileData = unwrapData(profileResponse);
  const progressData = unwrapData(progressResponse);
  return {
    profile: profileData.user ?? null,
    progress: progressData.studentProgressEntries ?? [],
  };
}

export async function markActivitySessionSubmitted(sessionId, studentUid) {
  const response = await dataConnect.executeMutation(
    'MarkAuthoritativeActivitySessionSubmitted',
    { sessionId, studentUid },
  );
  return unwrapData(response);
}

export async function persistActivityResult(session, result) {
  const variables = {
    attemptId: session.id,
    sessionId: session.id,
    studentUid: session.userUid,
    activityId: session.activityId,
    phaseNumber: session.phaseNumber,
    score: result.score,
    correctAnswers: result.correctAnswers,
    wrongAnswers: result.wrongAnswers,
  };
  const operation = result.passed
    ? 'CompleteMyCurrentPhase'
    : 'RegisterMyCurrentPhaseAttempt';

  const response = await dataConnect.executeMutation(operation, variables);
  unwrapData(response);

  const savedResult = await getActivityResult(session.id);
  if (!savedResult) return null;

  await markActivitySessionSubmitted(session.id, session.userUid);
  return savedResult;
}
