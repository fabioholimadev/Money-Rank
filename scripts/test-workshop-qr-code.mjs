import assert from 'node:assert/strict';
import {
  extractWorkshopTeamCode,
  locationWithSearch,
  normalizeWorkshopTeamCode,
} from '../frontend/src/lib/workshopQrCode.js';

assert.equal(normalizeWorkshopTeamCode('12 34-5678'), '12345678');
assert.equal(normalizeWorkshopTeamCode('1234567'), '');
assert.equal(normalizeWorkshopTeamCode('123456789'), '');
assert.equal(extractWorkshopTeamCode('87654321'), '87654321');
assert.equal(
  extractWorkshopTeamCode('https://money-rank-web.onrender.com/completar-perfil?equipe=20106540'),
  '20106540',
);
assert.equal(
  extractWorkshopTeamCode('http://localhost:5173/completar-perfil?equipe=12345678#cadastro'),
  '12345678',
);
assert.equal(extractWorkshopTeamCode('https://example.com/?codigo=12345678'), '');
assert.equal(extractWorkshopTeamCode('javascript:alert(1)?equipe=12345678'), '');
assert.equal(extractWorkshopTeamCode('QR aleatório 12345678'), '');

assert.equal(
  locationWithSearch({
    pathname: '/completar-perfil',
    search: '?equipe=20106540',
    hash: '#cadastro',
  }, '/student'),
  '/completar-perfil?equipe=20106540#cadastro',
);
assert.equal(locationWithSearch(null, '/student'), '/student');

console.log('QR Code da oficina validado: leitura segura e preservação do código após login.');
