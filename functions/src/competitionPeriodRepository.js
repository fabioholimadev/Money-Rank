import { randomUUID } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

if (getApps().length === 0) initializeApp();

const dataConnect = getDataConnect({
  location: 'southamerica-east1',
  serviceId: 'money-rank-service',
  connector: 'money-rank-connector',
});

async function executeMutation(name, variables) {
  const response = await dataConnect.executeMutation(name, variables);
  if (response?.errors?.length) {
    throw new Error(response.errors[0]?.message || 'Falha no Capi Bank.');
  }
  return response?.data ?? {};
}

export async function createCompetitionPeriodAsTeacher({
  name,
  startsAt,
  endsAt,
  status,
  actorUid,
}) {
  const data = await executeMutation('CreateTeacherCompetitionPeriod', {
    periodId: randomUUID(),
    name,
    startsAt,
    endsAt,
    status,
    actorUid,
  });
  if (!data.createdPeriod) {
    throw new Error(
      'O período não foi criado. Confirme as datas e evite janelas sobrepostas.',
    );
  }
  return data.createdPeriod;
}

export async function updateCompetitionPeriodAsTeacher({
  periodId,
  name,
  startsAt,
  endsAt,
  actorUid,
}) {
  const data = await executeMutation('UpdateTeacherCompetitionPeriod', {
    periodId,
    name,
    startsAt,
    endsAt,
    actorUid,
  });
  if (!data.updatedPeriod) {
    throw new Error(
      'O período não foi alterado. Ele pode estar encerrado ou sobrepor outra janela.',
    );
  }
  return data.updatedPeriod;
}

export async function setCompetitionPeriodStatusAsTeacher({
  periodId,
  status,
  actorUid,
}) {
  const data = await executeMutation('SetTeacherCompetitionPeriodStatus', {
    periodId,
    status,
    actorUid,
  });
  if (!data.updatedPeriod) {
    throw new Error(
      'A transição foi recusada. Confirme a janela, o estado atual e se já existe um período ativo.',
    );
  }
  return data.updatedPeriod;
}
