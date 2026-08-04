import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  normalizeTeacherClassMetrics,
  normalizeTeacherPeriods,
  normalizeTeacherPhaseMetrics,
  normalizeTeacherStudentMetrics,
  normalizeTeacherSummary,
} from '../frontend/src/lib/teacherAnalyticsMapper.js';

const periods = normalizeTeacherPeriods([
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Piloto DSA x DSB',
    status: 'ACTIVE',
    startsAt: '2026-08-06T12:00:00.000Z',
    endsAt: '2026-08-13T12:00:00.000Z',
    pausedAt: null,
    closedAt: null,
  },
  { id: 'invalido', name: '', status: 'UNKNOWN' },
]);
assert.equal(periods.length, 1);
assert.equal(periods[0].status, 'ACTIVE');

const summary = normalizeTeacherSummary({
  totalStudents: 100,
  participatingStudents: 75,
  totalPoints: 12500,
  totalAttempts: 240,
  approvedAttempts: 180,
  averageScore: 78,
  completedTrailStudents: 12,
});
assert.equal(summary.participationRate, 75);
assert.equal(summary.approvalRate, 75);
assert.equal(
  normalizeTeacherSummary({
    ...summary,
    participatingStudents: 101,
  }),
  null,
);

const classes = normalizeTeacherClassMetrics([
  {
    classGroup: 'THIRD_DSA',
    registeredStudents: 50,
    participatingStudents: 40,
    totalPoints: 7000,
    totalAttempts: 130,
    averageScore: 82,
    progressPercent: 64,
  },
  {
    classGroup: 'INVALID',
    registeredStudents: 50,
    participatingStudents: 20,
    totalPoints: 1,
    totalAttempts: 1,
    averageScore: 1,
    progressPercent: 1,
  },
]);
assert.equal(classes.length, 1);
assert.equal(classes[0].className, '3º DSA');
assert.equal(classes[0].participationRate, 80);

const phases = normalizeTeacherPhaseMetrics([
  {
    phaseNumber: 1,
    studentsReached: 80,
    studentsCompleted: 70,
    totalAttempts: 100,
    approvedAttempts: 60,
    averageScore: 72,
    correctAnswers: 300,
    wrongAnswers: 200,
  },
]);
assert.equal(phases[0].title, 'O Perigo Doce');
assert.equal(phases[0].approvalRate, 60);
assert.equal(phases[0].difficultyRate, 40);

const students = normalizeTeacherStudentMetrics([
  {
    preferredName: 'Ana Silva',
    classGroup: 'THIRD_DSB',
    currentPhase: 3,
    capiCoins: 460,
    completedSteps: 3,
    totalAttempts: 8,
    averageScore: 76,
    wrongAnswers: 9,
    totalPoints: 280,
    lastActivityAt: '2026-08-08T15:30:00.000Z',
  },
]);
assert.equal(students.length, 1);
assert.equal(students[0].className, '3º DSB');
assert.equal(students[0].progressPercent, 60);
assert.equal(students[0].participated, true);
assert.equal('email' in students[0], false);
assert.equal('uid' in students[0], false);

const querySource = await readFile(
  new URL('../dataconnect/connector/queries.gql', import.meta.url),
  'utf8',
);
const teacherSection = querySource.slice(
  querySource.indexOf('query ListTeacherCompetitionPeriods'),
);
assert.equal(
  (teacherSection.match(/teacher\.role = 'TEACHER'/g) || []).length,
  5,
  'A lista de períodos e as quatro agregações devem validar TEACHER.',
);
assert.equal(
  teacherSection.includes('student.email'),
  false,
  'O painel não deve consultar e-mail dos estudantes.',
);

console.log(
  'Painel do professor validado: períodos, agregados, fases e até 100 alunos sem e-mail ou UID.',
);
