const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const ActivitySessionStatus = {
  OPEN: "OPEN",
  SUBMITTED: "SUBMITTED",
  EXPIRED: "EXPIRED",
}
exports.ActivitySessionStatus = ActivitySessionStatus;

const CapiCoinTransactionType = {
  CONTENT_REWARD: "CONTENT_REWARD",
  ACTIVITY_REWARD: "ACTIVITY_REWARD",
  STREAK_BONUS: "STREAK_BONUS",
  PURCHASE: "PURCHASE",
  ADMIN_ADJUSTMENT: "ADMIN_ADJUSTMENT",
  ACTIVITY_REPEAT_REWARD: "ACTIVITY_REPEAT_REWARD",
}
exports.CapiCoinTransactionType = CapiCoinTransactionType;

const CompetitionPeriodStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  CLOSED: "CLOSED",
}
exports.CompetitionPeriodStatus = CompetitionPeriodStatus;

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

const RewardSuppressionReason = {
  NONE: "NONE",
  RATE_LIMIT: "RATE_LIMIT",
  DAILY_LIMIT: "DAILY_LIMIT",
}
exports.RewardSuppressionReason = RewardSuppressionReason;

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

const upsertEconomyConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEconomyConfig', inputVars);
}
upsertEconomyConfigRef.operationName = 'UpsertEconomyConfig';
exports.upsertEconomyConfigRef = upsertEconomyConfigRef;

exports.upsertEconomyConfig = function upsertEconomyConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertEconomyConfigRef(dcInstance, inputVars));
}
;

const createCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCompetitionPeriod', inputVars);
}
createCompetitionPeriodRef.operationName = 'CreateCompetitionPeriod';
exports.createCompetitionPeriodRef = createCompetitionPeriodRef;

exports.createCompetitionPeriod = function createCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCompetitionPeriodRef(dcInstance, inputVars));
}
;

const updateCompetitionPeriodStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCompetitionPeriodStatus', inputVars);
}
updateCompetitionPeriodStatusRef.operationName = 'UpdateCompetitionPeriodStatus';
exports.updateCompetitionPeriodStatusRef = updateCompetitionPeriodStatusRef;

exports.updateCompetitionPeriodStatus = function updateCompetitionPeriodStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCompetitionPeriodStatusRef(dcInstance, inputVars));
}
;

const createAuthoritativeActivitySessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuthoritativeActivitySession', inputVars);
}
createAuthoritativeActivitySessionRef.operationName = 'CreateAuthoritativeActivitySession';
exports.createAuthoritativeActivitySessionRef = createAuthoritativeActivitySessionRef;

exports.createAuthoritativeActivitySession = function createAuthoritativeActivitySession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuthoritativeActivitySessionRef(dcInstance, inputVars));
}
;

const markAuthoritativeActivitySessionSubmittedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAuthoritativeActivitySessionSubmitted', inputVars);
}
markAuthoritativeActivitySessionSubmittedRef.operationName = 'MarkAuthoritativeActivitySessionSubmitted';
exports.markAuthoritativeActivitySessionSubmittedRef = markAuthoritativeActivitySessionSubmittedRef;

exports.markAuthoritativeActivitySessionSubmitted = function markAuthoritativeActivitySessionSubmitted(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markAuthoritativeActivitySessionSubmittedRef(dcInstance, inputVars));
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

const getMyCapiCoinTransactionBySourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyCapiCoinTransactionBySource', inputVars);
}
getMyCapiCoinTransactionBySourceRef.operationName = 'GetMyCapiCoinTransactionBySource';
exports.getMyCapiCoinTransactionBySourceRef = getMyCapiCoinTransactionBySourceRef;

exports.getMyCapiCoinTransactionBySource = function getMyCapiCoinTransactionBySource(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyCapiCoinTransactionBySourceRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyActivityAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyActivityAttempt', inputVars);
}
getMyActivityAttemptRef.operationName = 'GetMyActivityAttempt';
exports.getMyActivityAttemptRef = getMyActivityAttemptRef;

exports.getMyActivityAttempt = function getMyActivityAttempt(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyActivityAttemptRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAuthoritativeActivitySessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthoritativeActivitySession', inputVars);
}
getAuthoritativeActivitySessionRef.operationName = 'GetAuthoritativeActivitySession';
exports.getAuthoritativeActivitySessionRef = getAuthoritativeActivitySessionRef;

exports.getAuthoritativeActivitySession = function getAuthoritativeActivitySession(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAuthoritativeActivitySessionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAuthoritativeActivityResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthoritativeActivityResult', inputVars);
}
getAuthoritativeActivityResultRef.operationName = 'GetAuthoritativeActivityResult';
exports.getAuthoritativeActivityResultRef = getAuthoritativeActivityResultRef;

exports.getAuthoritativeActivityResult = function getAuthoritativeActivityResult(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAuthoritativeActivityResultRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyActivityAttemptsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyActivityAttempts', inputVars);
}
listMyActivityAttemptsRef.operationName = 'ListMyActivityAttempts';
exports.listMyActivityAttemptsRef = listMyActivityAttemptsRef;

exports.listMyActivityAttempts = function listMyActivityAttempts(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMyActivityAttemptsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getEconomyConfigRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEconomyConfig');
}
getEconomyConfigRef.operationName = 'GetEconomyConfig';
exports.getEconomyConfigRef = getEconomyConfigRef;

exports.getEconomyConfig = function getEconomyConfig(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getEconomyConfigRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listVisibleCompetitionPeriodsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisibleCompetitionPeriods');
}
listVisibleCompetitionPeriodsRef.operationName = 'ListVisibleCompetitionPeriods';
exports.listVisibleCompetitionPeriodsRef = listVisibleCompetitionPeriodsRef;

exports.listVisibleCompetitionPeriods = function listVisibleCompetitionPeriods(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listVisibleCompetitionPeriodsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getCompetitionAbuseSignalsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompetitionAbuseSignals', inputVars);
}
getCompetitionAbuseSignalsRef.operationName = 'GetCompetitionAbuseSignals';
exports.getCompetitionAbuseSignalsRef = getCompetitionAbuseSignalsRef;

exports.getCompetitionAbuseSignals = function getCompetitionAbuseSignals(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompetitionAbuseSignalsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
