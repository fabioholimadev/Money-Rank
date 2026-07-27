import {
  getMyProfile,
  listMyCapiCoinTransactions,
  listMyProgress,
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
