import { randomUUID } from 'node:crypto';
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
    'Operação recusada: configure DATA_CONNECT_EMULATOR_HOST para o emulador local na porta 9399.',
  );
}

if (getApps().length === 0) initializeApp({ projectId: 'money-rank' });

const dataConnect = getDataConnect({
  location: 'southamerica-east1',
  serviceId: 'money-rank-service',
  connector: 'money-rank-connector',
});
const command = process.argv[2] || 'status';

async function listVisiblePeriods() {
  const response = await dataConnect.executeQuery(
    'ListVisibleCompetitionPeriods',
    {},
  );
  return response.data?.competitionPeriods ?? [];
}

async function createPeriod() {
  const existingPeriods = await listVisiblePeriods();
  if (existingPeriods.length > 0) {
    console.log(
      `Período local já disponível: ${existingPeriods[0].name}.`,
    );
    return;
  }

  const now = Date.now();
  const startsAt = new Date(now - 5 * 60 * 1_000).toISOString();
  const endsAt = new Date(now + 7 * 24 * 60 * 60 * 1_000).toISOString();
  const response = await dataConnect.executeMutation(
    'CreateCompetitionPeriod',
    {
      periodId: randomUUID(),
      name: 'Homologação local DSA x DSB',
      startsAt,
      endsAt,
      status: 'SCHEDULED',
    },
  );

  if (!response.data?.createdPeriod) {
    throw new Error(
      'O período local não foi criado. Verifique se existe uma janela sobreposta.',
    );
  }

  console.log(
    `Período local criado até ${new Date(endsAt).toLocaleString('pt-BR')}.`,
  );
}

async function closePeriod() {
  const periods = await listVisiblePeriods();
  if (periods.length === 0) {
    console.log('Nenhum período local visível para encerrar.');
    return;
  }

  await dataConnect.executeMutation('UpdateCompetitionPeriodStatus', {
    periodId: periods[0].id,
    status: 'CLOSED',
  });
  console.log(`Período local encerrado: ${periods[0].name}.`);
}

switch (command) {
  case 'create':
    await createPeriod();
    break;
  case 'close':
    await closePeriod();
    break;
  case 'status': {
    const periods = await listVisiblePeriods();
    console.log(
      periods.length > 0
        ? `Período local disponível: ${periods[0].name}.`
        : 'Nenhum período local visível.',
    );
    break;
  }
  default:
    throw new Error('Use create, close ou status.');
}

