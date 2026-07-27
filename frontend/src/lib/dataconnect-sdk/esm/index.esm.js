import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const CapiCoinTransactionType = {
  ACTIVITY_REWARD: "ACTIVITY_REWARD",
  STREAK_BONUS: "STREAK_BONUS",
  PURCHASE: "PURCHASE",
  ADMIN_ADJUSTMENT: "ADMIN_ADJUSTMENT",
}

export const ProfessionalAvatar = {
  CAPI_CIENTISTA: "CAPI_CIENTISTA",
  CAPI_PROFESSORA: "CAPI_PROFESSORA",
  CAPI_PROGRAMADORA: "CAPI_PROGRAMADORA",
  CAPI_ECONOMISTA: "CAPI_ECONOMISTA",
  CAPI_MEDICA: "CAPI_MEDICA",
  CAPI_ENGENHEIRA: "CAPI_ENGENHEIRA",
}

export const ProgressStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
}

export const StudentClass = {
  THIRD_DSA: "THIRD_DSA",
  THIRD_DSB: "THIRD_DSB",
}

export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
}

export const connectorConfig = {
  connector: 'money-rank-connector',
  service: 'money-rank-service',
  location: 'southamerica-east1'
};
export const upsertMyProfileWithAvatarRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMyProfileWithAvatar', inputVars);
}
upsertMyProfileWithAvatarRef.operationName = 'UpsertMyProfileWithAvatar';

export function upsertMyProfileWithAvatar(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMyProfileWithAvatarRef(dcInstance, inputVars));
}

export const upsertMyProfileWithPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMyProfileWithPhoto', inputVars);
}
upsertMyProfileWithPhotoRef.operationName = 'UpsertMyProfileWithPhoto';

export function upsertMyProfileWithPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMyProfileWithPhotoRef(dcInstance, inputVars));
}

export const upsertMyProfileWithoutSyncedPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMyProfileWithoutSyncedPhoto', inputVars);
}
upsertMyProfileWithoutSyncedPhotoRef.operationName = 'UpsertMyProfileWithoutSyncedPhoto';

export function upsertMyProfileWithoutSyncedPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMyProfileWithoutSyncedPhotoRef(dcInstance, inputVars));
}

export const upsertStudentProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStudentProgress', inputVars);
}
upsertStudentProgressRef.operationName = 'UpsertStudentProgress';

export function upsertStudentProgress(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertStudentProgressRef(dcInstance, inputVars));
}

export const applyCapiCoinTransactionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ApplyCapiCoinTransaction', inputVars);
}
applyCapiCoinTransactionRef.operationName = 'ApplyCapiCoinTransaction';

export function applyCapiCoinTransaction(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(applyCapiCoinTransactionRef(dcInstance, inputVars));
}

export const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';

export function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyProgressRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyProgress');
}
listMyProgressRef.operationName = 'ListMyProgress';

export function listMyProgress(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyProgressRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyCapiCoinTransactionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyCapiCoinTransactions', inputVars);
}
listMyCapiCoinTransactionsRef.operationName = 'ListMyCapiCoinTransactions';

export function listMyCapiCoinTransactions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listMyCapiCoinTransactionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

