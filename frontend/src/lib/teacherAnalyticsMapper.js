import { fromDataConnectClass } from './profileDataMapper.js';

const PERIOD_STATUSES = new Set([
  'DRAFT',
  'SCHEDULED',
  'ACTIVE',
  'PAUSED',
  'CLOSED',
]);

export const PHASE_TITLES = Object.freeze({
  1: 'O Perigo Doce',
  2: 'O Custo do Vício',
  3: 'A Ilusão do Dinheiro',
  4: 'A Engenharia do Desejo',
});

function toInteger(value, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= minimum && number <= maximum
    ? number
    : null;
}

function toTimestamp(value, nullable = false) {
  if ((value === null || value === undefined) && nullable) return null;
  if (typeof value !== 'string') return null;
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
}

function toName(value, minimum = 2, maximum = 80) {
  if (typeof value !== 'string') return null;
  const name = value.trim().replace(/\s+/g, ' ');
  return name.length >= minimum && name.length <= maximum ? name : null;
}

function percentage(numerator, denominator) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function normalizeTeacherPeriods(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    const id = typeof row?.id === 'string' ? row.id : null;
    const name = toName(row?.name, 3, 80);
    const status = PERIOD_STATUSES.has(row?.status) ? row.status : null;
    const startsAt = toTimestamp(row?.startsAt);
    const endsAt = toTimestamp(row?.endsAt);

    if (!id || !name || !status || !startsAt || !endsAt) return [];

    return [{
      id,
      name,
      status,
      startsAt,
      endsAt,
      pausedAt: toTimestamp(row?.pausedAt, true),
      closedAt: toTimestamp(row?.closedAt, true),
    }];
  });
}

export function normalizeTeacherSummary(row) {
  if (!row || typeof row !== 'object') return null;

  const fields = [
    'totalStudents',
    'participatingStudents',
    'totalPoints',
    'totalAttempts',
    'approvedAttempts',
    'averageScore',
    'completedTrailStudents',
  ];
  const values = Object.fromEntries(
    fields.map((field) => [field, toInteger(row[field])]),
  );

  if (Object.values(values).some((value) => value === null)) return null;
  if (
    values.participatingStudents > values.totalStudents ||
    values.approvedAttempts > values.totalAttempts ||
    values.completedTrailStudents > values.totalStudents ||
    values.averageScore > 100
  ) {
    return null;
  }

  return {
    ...values,
    participationRate: percentage(
      values.participatingStudents,
      values.totalStudents,
    ),
    approvalRate: percentage(
      values.approvedAttempts,
      values.totalAttempts,
    ),
  };
}

export function normalizeTeacherClassMetrics(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    const className = fromDataConnectClass(row?.classGroup);
    const registeredStudents = toInteger(row?.registeredStudents, 0, 200);
    const participatingStudents = toInteger(
      row?.participatingStudents,
      0,
      200,
    );
    const totalPoints = toInteger(row?.totalPoints);
    const totalAttempts = toInteger(row?.totalAttempts);
    const averageScore = toInteger(row?.averageScore, 0, 100);
    const progressPercent = toInteger(row?.progressPercent, 0, 100);

    if (
      !className ||
      [
        registeredStudents,
        participatingStudents,
        totalPoints,
        totalAttempts,
        averageScore,
        progressPercent,
      ].some((value) => value === null) ||
      participatingStudents > registeredStudents
    ) {
      return [];
    }

    return [{
      className,
      registeredStudents,
      participatingStudents,
      participationRate: percentage(
        participatingStudents,
        registeredStudents,
      ),
      totalPoints,
      totalAttempts,
      averageScore,
      progressPercent,
    }];
  });
}

export function normalizeTeacherPhaseMetrics(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    const phaseNumber = toInteger(row?.phaseNumber, 1, 4);
    const studentsReached = toInteger(row?.studentsReached, 0, 200);
    const studentsCompleted = toInteger(row?.studentsCompleted, 0, 200);
    const totalAttempts = toInteger(row?.totalAttempts);
    const approvedAttempts = toInteger(row?.approvedAttempts);
    const averageScore = toInteger(row?.averageScore, 0, 100);
    const correctAnswers = toInteger(row?.correctAnswers);
    const wrongAnswers = toInteger(row?.wrongAnswers);

    if (
      phaseNumber === null ||
      [
        studentsReached,
        studentsCompleted,
        totalAttempts,
        approvedAttempts,
        averageScore,
        correctAnswers,
        wrongAnswers,
      ].some((value) => value === null) ||
      studentsCompleted > studentsReached ||
      approvedAttempts > totalAttempts
    ) {
      return [];
    }

    return [{
      phaseNumber,
      title: PHASE_TITLES[phaseNumber],
      studentsReached,
      studentsCompleted,
      totalAttempts,
      approvedAttempts,
      approvalRate: percentage(approvedAttempts, totalAttempts),
      averageScore,
      correctAnswers,
      wrongAnswers,
      difficultyRate: percentage(
        wrongAnswers,
        correctAnswers + wrongAnswers,
      ),
    }];
  });
}

export function normalizeTeacherStudentMetrics(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row, index) => {
    const preferredName = toName(row?.preferredName, 2, 40);
    const className = fromDataConnectClass(row?.classGroup);
    const currentPhase = toInteger(row?.currentPhase, 0, 4);
    const capiCoins = toInteger(row?.capiCoins);
    const completedSteps = toInteger(row?.completedSteps, 0, 5);
    const totalAttempts = toInteger(row?.totalAttempts);
    const averageScore = toInteger(row?.averageScore, 0, 100);
    const wrongAnswers = toInteger(row?.wrongAnswers);
    const totalPoints = toInteger(row?.totalPoints);
    const lastActivityAt = toTimestamp(row?.lastActivityAt, true);

    if (
      !preferredName ||
      !className ||
      [
        currentPhase,
        capiCoins,
        completedSteps,
        totalAttempts,
        averageScore,
        wrongAnswers,
        totalPoints,
      ].some((value) => value === null)
    ) {
      return [];
    }

    return [{
      key: `teacher-student-${index}-${className}-${preferredName}`,
      preferredName,
      className,
      currentPhase,
      capiCoins,
      completedSteps,
      progressPercent: completedSteps * 20,
      totalAttempts,
      averageScore,
      wrongAnswers,
      totalPoints,
      lastActivityAt,
      participated: totalAttempts > 0 || totalPoints > 0,
    }];
  });
}
