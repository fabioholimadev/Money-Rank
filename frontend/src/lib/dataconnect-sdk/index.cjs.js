const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const CapiCoinTransactionType = {
  CONTENT_REWARD: "CONTENT_REWARD",
  ACTIVITY_REWARD: "ACTIVITY_REWARD",
  STREAK_BONUS: "STREAK_BONUS",
  PURCHASE: "PURCHASE",
  ADMIN_ADJUSTMENT: "ADMIN_ADJUSTMENT",
}
exports.CapiCoinTransactionType = CapiCoinTransactionType;

const ProfessionalAvatar = {
  CAPI_CIENTISTA: "CAPI_CIENTISTA",
  CAPI_PROFESSORA: "CAPI_PROFESSORA",
  CAPI_PROGRAMADORA: "CAPI_PROGRAMADORA",
  CAPI_ECONOMISTA: "CAPI_ECONOMISTA",
  CAPI_MEDICA: "CAPI_MEDICA",
  CAPI_ENGENHEIRA: "CAPI_ENGENHEIRA",
}
exports.ProfessionalAvatar = ProfessionalAvatar;

const ProgressStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
}
exports.ProgressStatus = ProgressStatus;

const StudentClass = {
  THIRD_DSA: "THIRD_DSA",
  THIRD_DSB: "THIRD_DSB",
}
exports.StudentClass = StudentClass;

const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
}
exports.UserRole = UserRole;

const connectorConfig = {
  connector: 'money-rank-connector',
  service: 'money-rank-service',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const upsertMyProfileWithAvatarRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMyProfileWithAvatar', inputVars);
}
upsertMyProfileWithAvatarRef.operationName = 'UpsertMyProfileWithAvatar';
exports.upsertMyProfileWithAvatarRef = upsertMyProfileWithAvatarRef;

exports.upsertMyProfileWithAvatar = function upsertMyProfileWithAvatar(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMyProfileWithAvatarRef(dcInstance, inputVars));
}
;

const upsertMyProfileWithPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMyProfileWithPhoto', inputVars);
}
upsertMyProfileWithPhotoRef.operationName = 'UpsertMyProfileWithPhoto';
exports.upsertMyProfileWithPhotoRef = upsertMyProfileWithPhotoRef;

exports.upsertMyProfileWithPhoto = function upsertMyProfileWithPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMyProfileWithPhotoRef(dcInstance, inputVars));
}
;

const upsertMyProfileWithoutSyncedPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMyProfileWithoutSyncedPhoto', inputVars);
}
upsertMyProfileWithoutSyncedPhotoRef.operationName = 'UpsertMyProfileWithoutSyncedPhoto';
exports.upsertMyProfileWithoutSyncedPhotoRef = upsertMyProfileWithoutSyncedPhotoRef;

exports.upsertMyProfileWithoutSyncedPhoto = function upsertMyProfileWithoutSyncedPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMyProfileWithoutSyncedPhotoRef(dcInstance, inputVars));
}
;

const upsertStudentProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStudentProgress', inputVars);
}
upsertStudentProgressRef.operationName = 'UpsertStudentProgress';
exports.upsertStudentProgressRef = upsertStudentProgressRef;

exports.upsertStudentProgress = function upsertStudentProgress(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertStudentProgressRef(dcInstance, inputVars));
}
;

const applyCapiCoinTransactionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ApplyCapiCoinTransaction', inputVars);
}
applyCapiCoinTransactionRef.operationName = 'ApplyCapiCoinTransaction';
exports.applyCapiCoinTransactionRef = applyCapiCoinTransactionRef;

exports.applyCapiCoinTransaction = function applyCapiCoinTransaction(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(applyCapiCoinTransactionRef(dcInstance, inputVars));
}
;

const initializeMyTrailRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InitializeMyTrail');
}
initializeMyTrailRef.operationName = 'InitializeMyTrail';
exports.initializeMyTrailRef = initializeMyTrailRef;

exports.initializeMyTrail = function initializeMyTrail(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(initializeMyTrailRef(dcInstance, inputVars));
}
;

const completeMyIntroductionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteMyIntroduction');
}
completeMyIntroductionRef.operationName = 'CompleteMyIntroduction';
exports.completeMyIntroductionRef = completeMyIntroductionRef;

exports.completeMyIntroduction = function completeMyIntroduction(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(completeMyIntroductionRef(dcInstance, inputVars));
}
;

const completeMyCurrentPhaseContentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteMyCurrentPhaseContent', inputVars);
}
completeMyCurrentPhaseContentRef.operationName = 'CompleteMyCurrentPhaseContent';
exports.completeMyCurrentPhaseContentRef = completeMyCurrentPhaseContentRef;

exports.completeMyCurrentPhaseContent = function completeMyCurrentPhaseContent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeMyCurrentPhaseContentRef(dcInstance, inputVars));
}
;

const registerMyCurrentPhaseAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterMyCurrentPhaseAttempt', inputVars);
}
registerMyCurrentPhaseAttemptRef.operationName = 'RegisterMyCurrentPhaseAttempt';
exports.registerMyCurrentPhaseAttemptRef = registerMyCurrentPhaseAttemptRef;

exports.registerMyCurrentPhaseAttempt = function registerMyCurrentPhaseAttempt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registerMyCurrentPhaseAttemptRef(dcInstance, inputVars));
}
;

const completeMyCurrentPhaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteMyCurrentPhase', inputVars);
}
completeMyCurrentPhaseRef.operationName = 'CompleteMyCurrentPhase';
exports.completeMyCurrentPhaseRef = completeMyCurrentPhaseRef;

exports.completeMyCurrentPhase = function completeMyCurrentPhase(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeMyCurrentPhaseRef(dcInstance, inputVars));
}
;

const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';
exports.getMyProfileRef = getMyProfileRef;

exports.getMyProfile = function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyProgressRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyProgress');
}
listMyProgressRef.operationName = 'ListMyProgress';
exports.listMyProgressRef = listMyProgressRef;

exports.listMyProgress = function listMyProgress(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyProgressRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyCapiCoinTransactionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyCapiCoinTransactions', inputVars);
}
listMyCapiCoinTransactionsRef.operationName = 'ListMyCapiCoinTransactions';
exports.listMyCapiCoinTransactionsRef = listMyCapiCoinTransactionsRef;

exports.listMyCapiCoinTransactions = function listMyCapiCoinTransactions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listMyCapiCoinTransactionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
