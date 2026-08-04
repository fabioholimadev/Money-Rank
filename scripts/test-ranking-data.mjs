import assert from 'node:assert/strict';
import {
  normalizeClassRanking,
  normalizeIndividualRanking,
} from '../frontend/src/lib/rankingDataMapper.js';

const individuals = normalizeIndividualRanking([
  {
    position: 1,
    preferredName: 'Ana Capi',
    classGroup: 'THIRD_DSA',
    avatarId: 'CAPI_PROGRAMADORA',
    avatarUrl: null,
    totalPoints: 340,
  },
  {
    position: '2',
    preferredName: 'Bruno Capi',
    classGroup: 'THIRD_DSB',
    avatarId: null,
    avatarUrl: 'https://example.com/avatar.webp',
    totalPoints: '220',
  },
  {
    position: 3,
    preferredName: 'Conta inválida',
    classGroup: 'OUTRA_TURMA',
    totalPoints: 100,
  },
]);

assert.equal(individuals.length, 2);
assert.equal(individuals[0].className, '3º DSA');
assert.equal(individuals[0].avatarId, 'capi-programadora');
assert.equal(individuals[1].totalPoints, 220);

const classes = normalizeClassRanking([
  {
    position: 1,
    classGroup: 'THIRD_DSA',
    registeredStudents: 48,
    participatingStudents: 45,
    totalPoints: 12340,
  },
  {
    position: 2,
    classGroup: 'THIRD_DSB',
    registeredStudents: 50,
    participatingStudents: 51,
    totalPoints: 12000,
  },
]);

assert.equal(classes.length, 1);
assert.equal(classes[0].className, '3º DSA');
assert.equal(classes[0].participatingStudents, 45);

console.log(
  'Rankings validados: mapeamento seguro, turmas permitidas, pontos e participantes.',
);

