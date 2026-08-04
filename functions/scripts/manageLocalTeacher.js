import { getApps, initializeApp } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

const emulatorHost = String(
  process.env.DATA_CONNECT_EMULATOR_HOST || '',
).trim();
const allowedEmulatorHosts = new Set([
  '127.0.0.1:9399',
  'localhost:9399',
]);

if (!allowedEmulatorHosts.has(emulatorHost)) {
  throw new Error(
    'Operação recusada: este utilitário funciona somente no emulador local.',
  );
}

const command = String(process.argv[2] || '').toLowerCase();
const email = String(process.argv[3] || '').trim();
const rolesByCommand = {
  promote: 'TEACHER',
  demote: 'STUDENT',
};

if (!rolesByCommand[command] || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error(
    'Use: npm run local:teacher -- promote|demote professor@escola.com',
  );
}

if (getApps().length === 0) initializeApp({ projectId: 'money-rank' });

const dataConnect = getDataConnect({
  location: 'southamerica-east1',
  serviceId: 'money-rank-service',
  connector: 'money-rank-connector',
});
const response = await dataConnect.executeMutation('SetUserRoleByEmail', {
  email,
  role: rolesByCommand[command],
});
const updatedUser = response.data?.updatedUser;

if (!updatedUser) {
  throw new Error(
    'Perfil completo não encontrado. A conta precisa entrar e concluir o perfil antes da promoção.',
  );
}

console.log(
  command === 'promote'
    ? 'Acesso local de professor concedido.'
    : 'Acesso local alterado para estudante.',
);
