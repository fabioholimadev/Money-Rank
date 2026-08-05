import assert from 'node:assert/strict';
import {
  buildTeacherDashboardCsvExport,
  escapeTeacherCsvCell,
  formatTeacherExportDate,
  TEACHER_EXPORT_MIME_TYPE,
} from '../frontend/src/lib/teacherSpreadsheetExport.js';

assert.equal(escapeTeacherCsvCell('=2+2'), "'=2+2");
assert.equal(escapeTeacherCsvCell('  +cmd'), "'  +cmd");
assert.equal(escapeTeacherCsvCell('-10'), "'-10");
assert.equal(escapeTeacherCsvCell(-10), '-10');
assert.equal(escapeTeacherCsvCell('@SUM(A1:A2)'), "'@SUM(A1:A2)");
assert.equal(escapeTeacherCsvCell('texto;com\nquebra'), '"texto;com\nquebra"');
assert.equal(escapeTeacherCsvCell('Professor "A"'), '"Professor ""A"""');

assert.equal(
  formatTeacherExportDate('2026-08-08T15:30:00.000Z'),
  '2026-08-08 12:30:00',
);
assert.equal(formatTeacherExportDate('data inválida'), '');
assert.equal(formatTeacherExportDate(null), '');

const exported = buildTeacherDashboardCsvExport({
  period: {
    name: '=HYPERLINK("https://example.test";"Piloto")',
    status: 'ACTIVE',
    startsAt: '2026-08-06T12:00:00.000Z',
    endsAt: '2026-08-13T12:00:00.000Z',
  },
  generatedAt: '2026-08-08T15:30:00.000Z',
  dashboard: {
    summary: {
      totalStudents: 100,
      participatingStudents: 75,
      participationRate: 75,
      totalPoints: 12500,
      totalAttempts: 240,
      approvedAttempts: 180,
      approvalRate: 75,
      averageScore: 76.5,
      completedTrailStudents: 12,
    },
    classes: [{
      className: '3º DSA',
      registeredStudents: 50,
      participatingStudents: 40,
      participationRate: 80,
      totalPoints: 7000,
      totalAttempts: 130,
      averageScore: 82,
      progressPercent: 64,
    }],
    phases: [{
      phaseNumber: 1,
      title: 'O Perigo Doce',
      studentsReached: 80,
      studentsCompleted: 70,
      totalAttempts: 100,
      approvedAttempts: 60,
      approvalRate: 60,
      averageScore: 72,
      correctAnswers: 300,
      wrongAnswers: 200,
      difficultyRate: 40,
    }],
    students: [{
      key: 'internal-key-that-must-not-leak',
      preferredName: '+Ana Silva',
      className: '3º DSB',
      currentPhase: 3,
      capiCoins: 460,
      completedSteps: 3,
      progressPercent: 60,
      totalAttempts: 8,
      averageScore: 76.5,
      wrongAnswers: 9,
      totalPoints: 280,
      lastActivityAt: '2026-08-08T15:30:00.000Z',
      participated: true,
      uid: 'private-uid-that-must-not-leak',
      email: 'private-email-that-must-not-leak@example.test',
      fullName: 'private-full-name-that-must-not-leak',
      photoUrl: 'https://private-photo.test/student.jpg',
    }],
  },
});

assert.equal(exported.mimeType, TEACHER_EXPORT_MIME_TYPE);
assert.equal(exported.fileName, 'money-rank-hyperlink-https-example-test-piloto.csv');
assert.equal(exported.content.charCodeAt(0), 0xfeff);
assert.ok(exported.content.includes('\r\n'));
assert.ok(exported.content.includes("' +Ana Silva".replace(' ', '')));
assert.ok(exported.content.includes('2026-08-08 12:30:00'));
assert.ok(exported.content.includes(';12500;'));
assert.ok(exported.content.includes(';76,5;'));
assert.equal(exported.content.includes('internal-key-that-must-not-leak'), false);
assert.equal(exported.content.includes('private-uid-that-must-not-leak'), false);
assert.equal(exported.content.includes('private-email-that-must-not-leak'), false);
assert.equal(exported.content.includes('private-full-name-that-must-not-leak'), false);
assert.equal(exported.content.includes('private-photo.test'), false);

assert.throws(
  () => buildTeacherDashboardCsvExport({ period: {}, dashboard: null }),
  /Dados do painel indisponíveis/,
);

console.log(
  'Exportação CSV do professor validada: Excel UTF-8, injeção, datas, números e minimização de dados.',
);
