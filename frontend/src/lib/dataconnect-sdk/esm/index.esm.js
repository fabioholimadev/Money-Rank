import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const ActivitySessionStatus = {
  OPEN: "OPEN",
  SUBMITTED: "SUBMITTED",
  EXPIRED: "EXPIRED",
}

export const CapiCoinTransactionType = {
  CONTENT_REWARD: "CONTENT_REWARD",
  ACTIVITY_REWARD: "ACTIVITY_REWARD",
  STREAK_BONUS: "STREAK_BONUS",
  PURCHASE: "PURCHASE",
  ADMIN_ADJUSTMENT: "ADMIN_ADJUSTMENT",
  ACTIVITY_REPEAT_REWARD: "ACTIVITY_REPEAT_REWARD",
}

export const CompetitionPeriodStatus = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  CLOSED: "CLOSED",
}

export const ContentAssetType = {
  VIDEO: "VIDEO",
  SLIDES: "SLIDES",
  DOCUMENT: "DOCUMENT",
  SUMMARY: "SUMMARY",
  EXTERNAL_LINK: "EXTERNAL_LINK",
}

export const EditorialEntityType = {
  LEARNING_MODULE: "LEARNING_MODULE",
  ACTIVITY_DEFINITION: "ACTIVITY_DEFINITION",
  RESEARCH_REVIEW: "RESEARCH_REVIEW",
}

export const EditorialStatus = {
  DRAFT: "DRAFT",
  IN_REVIEW: "IN_REVIEW",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
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

export const ResearchReviewStatus = {
  PENDING_TEACHER_REVIEW: "PENDING_TEACHER_REVIEW",
  TEACHER_APPROVED: "TEACHER_APPROVED",
  REJECTED: "REJECTED",
}

export const RewardSuppressionReason = {
  NONE: "NONE",
  RATE_LIMIT: "RATE_LIMIT",
  DAILY_LIMIT: "DAILY_LIMIT",
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

export const createLearningModuleVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLearningModuleVersionEditorial', inputVars);
}
createLearningModuleVersionEditorialRef.operationName = 'CreateLearningModuleVersionEditorial';

export function createLearningModuleVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLearningModuleVersionEditorialRef(dcInstance, inputVars));
}

export const createActivityDefinitionVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateActivityDefinitionVersionEditorial', inputVars);
}
createActivityDefinitionVersionEditorialRef.operationName = 'CreateActivityDefinitionVersionEditorial';

export function createActivityDefinitionVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createActivityDefinitionVersionEditorialRef(dcInstance, inputVars));
}

export const updateLearningModuleDraftEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLearningModuleDraftEditorial', inputVars);
}
updateLearningModuleDraftEditorialRef.operationName = 'UpdateLearningModuleDraftEditorial';

export function updateLearningModuleDraftEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLearningModuleDraftEditorialRef(dcInstance, inputVars));
}

export const updateActivityDefinitionDraftEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateActivityDefinitionDraftEditorial', inputVars);
}
updateActivityDefinitionDraftEditorialRef.operationName = 'UpdateActivityDefinitionDraftEditorial';

export function updateActivityDefinitionDraftEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateActivityDefinitionDraftEditorialRef(dcInstance, inputVars));
}

export const submitLearningModuleForReviewEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitLearningModuleForReviewEditorial', inputVars);
}
submitLearningModuleForReviewEditorialRef.operationName = 'SubmitLearningModuleForReviewEditorial';

export function submitLearningModuleForReviewEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(submitLearningModuleForReviewEditorialRef(dcInstance, inputVars));
}

export const submitActivityDefinitionForReviewEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitActivityDefinitionForReviewEditorial', inputVars);
}
submitActivityDefinitionForReviewEditorialRef.operationName = 'SubmitActivityDefinitionForReviewEditorial';

export function submitActivityDefinitionForReviewEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(submitActivityDefinitionForReviewEditorialRef(dcInstance, inputVars));
}

export const publishLearningModuleVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PublishLearningModuleVersionEditorial', inputVars);
}
publishLearningModuleVersionEditorialRef.operationName = 'PublishLearningModuleVersionEditorial';

export function publishLearningModuleVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(publishLearningModuleVersionEditorialRef(dcInstance, inputVars));
}

export const publishActivityDefinitionVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PublishActivityDefinitionVersionEditorial', inputVars);
}
publishActivityDefinitionVersionEditorialRef.operationName = 'PublishActivityDefinitionVersionEditorial';

export function publishActivityDefinitionVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(publishActivityDefinitionVersionEditorialRef(dcInstance, inputVars));
}

export const createResearchReviewEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateResearchReviewEditorial', inputVars);
}
createResearchReviewEditorialRef.operationName = 'CreateResearchReviewEditorial';

export function createResearchReviewEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createResearchReviewEditorialRef(dcInstance, inputVars));
}

export const reviewResearchEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReviewResearchEditorial', inputVars);
}
reviewResearchEditorialRef.operationName = 'ReviewResearchEditorial';

export function reviewResearchEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reviewResearchEditorialRef(dcInstance, inputVars));
}

export const createContentAssetEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateContentAssetEditorial', inputVars);
}
createContentAssetEditorialRef.operationName = 'CreateContentAssetEditorial';

export function createContentAssetEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createContentAssetEditorialRef(dcInstance, inputVars));
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

export const setUserRoleByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SetUserRoleByEmail', inputVars);
}
setUserRoleByEmailRef.operationName = 'SetUserRoleByEmail';

export function setUserRoleByEmail(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(setUserRoleByEmailRef(dcInstance, inputVars));
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

export const upsertEconomyConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertEconomyConfig', inputVars);
}
upsertEconomyConfigRef.operationName = 'UpsertEconomyConfig';

export function upsertEconomyConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertEconomyConfigRef(dcInstance, inputVars));
}

export const createCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCompetitionPeriod', inputVars);
}
createCompetitionPeriodRef.operationName = 'CreateCompetitionPeriod';

export function createCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCompetitionPeriodRef(dcInstance, inputVars));
}

export const updateCompetitionPeriodStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCompetitionPeriodStatus', inputVars);
}
updateCompetitionPeriodStatusRef.operationName = 'UpdateCompetitionPeriodStatus';

export function updateCompetitionPeriodStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCompetitionPeriodStatusRef(dcInstance, inputVars));
}

export const createTeacherCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTeacherCompetitionPeriod', inputVars);
}
createTeacherCompetitionPeriodRef.operationName = 'CreateTeacherCompetitionPeriod';

export function createTeacherCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTeacherCompetitionPeriodRef(dcInstance, inputVars));
}

export const updateTeacherCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTeacherCompetitionPeriod', inputVars);
}
updateTeacherCompetitionPeriodRef.operationName = 'UpdateTeacherCompetitionPeriod';

export function updateTeacherCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateTeacherCompetitionPeriodRef(dcInstance, inputVars));
}

export const setTeacherCompetitionPeriodStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SetTeacherCompetitionPeriodStatus', inputVars);
}
setTeacherCompetitionPeriodStatusRef.operationName = 'SetTeacherCompetitionPeriodStatus';

export function setTeacherCompetitionPeriodStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(setTeacherCompetitionPeriodStatusRef(dcInstance, inputVars));
}

export const createAuthoritativeActivitySessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuthoritativeActivitySession', inputVars);
}
createAuthoritativeActivitySessionRef.operationName = 'CreateAuthoritativeActivitySession';

export function createAuthoritativeActivitySession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuthoritativeActivitySessionRef(dcInstance, inputVars));
}

export const markAuthoritativeActivitySessionSubmittedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAuthoritativeActivitySessionSubmitted', inputVars);
}
markAuthoritativeActivitySessionSubmittedRef.operationName = 'MarkAuthoritativeActivitySessionSubmitted';

export function markAuthoritativeActivitySessionSubmitted(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markAuthoritativeActivitySessionSubmittedRef(dcInstance, inputVars));
}

export const initializeMyTrailRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InitializeMyTrail');
}
initializeMyTrailRef.operationName = 'InitializeMyTrail';

export function initializeMyTrail(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(initializeMyTrailRef(dcInstance, inputVars));
}

export const completeMyIntroductionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteMyIntroduction');
}
completeMyIntroductionRef.operationName = 'CompleteMyIntroduction';

export function completeMyIntroduction(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(completeMyIntroductionRef(dcInstance, inputVars));
}

export const completeMyCurrentPhaseContentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteMyCurrentPhaseContent', inputVars);
}
completeMyCurrentPhaseContentRef.operationName = 'CompleteMyCurrentPhaseContent';

export function completeMyCurrentPhaseContent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeMyCurrentPhaseContentRef(dcInstance, inputVars));
}

export const registerMyCurrentPhaseAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterMyCurrentPhaseAttempt', inputVars);
}
registerMyCurrentPhaseAttemptRef.operationName = 'RegisterMyCurrentPhaseAttempt';

export function registerMyCurrentPhaseAttempt(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(registerMyCurrentPhaseAttemptRef(dcInstance, inputVars));
}

export const completeMyCurrentPhaseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CompleteMyCurrentPhase', inputVars);
}
completeMyCurrentPhaseRef.operationName = 'CompleteMyCurrentPhase';

export function completeMyCurrentPhase(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(completeMyCurrentPhaseRef(dcInstance, inputVars));
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

export const getEditorialSeedStateRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEditorialSeedState');
}
getEditorialSeedStateRef.operationName = 'GetEditorialSeedState';

export function getEditorialSeedState(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getEditorialSeedStateRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listEditorialStudioDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEditorialStudioData');
}
listEditorialStudioDataRef.operationName = 'ListEditorialStudioData';

export function listEditorialStudioData(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEditorialStudioDataRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getLearningModuleVersionForEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLearningModuleVersionForEditorial', inputVars);
}
getLearningModuleVersionForEditorialRef.operationName = 'GetLearningModuleVersionForEditorial';

export function getLearningModuleVersionForEditorial(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLearningModuleVersionForEditorialRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getActivityDefinitionVersionForEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivityDefinitionVersionForEditorial', inputVars);
}
getActivityDefinitionVersionForEditorialRef.operationName = 'GetActivityDefinitionVersionForEditorial';

export function getActivityDefinitionVersionForEditorial(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getActivityDefinitionVersionForEditorialRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getPublishedLearningModuleForStudentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublishedLearningModuleForStudent', inputVars);
}
getPublishedLearningModuleForStudentRef.operationName = 'GetPublishedLearningModuleForStudent';

export function getPublishedLearningModuleForStudent(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublishedLearningModuleForStudentRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getPublishedActivityDefinitionForSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublishedActivityDefinitionForSession', inputVars);
}
getPublishedActivityDefinitionForSessionRef.operationName = 'GetPublishedActivityDefinitionForSession';

export function getPublishedActivityDefinitionForSession(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublishedActivityDefinitionForSessionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
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

export const getMyCapiCoinTransactionBySourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyCapiCoinTransactionBySource', inputVars);
}
getMyCapiCoinTransactionBySourceRef.operationName = 'GetMyCapiCoinTransactionBySource';

export function getMyCapiCoinTransactionBySource(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyCapiCoinTransactionBySourceRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getMyActivityAttemptRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyActivityAttempt', inputVars);
}
getMyActivityAttemptRef.operationName = 'GetMyActivityAttempt';

export function getMyActivityAttempt(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyActivityAttemptRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getAuthoritativeActivitySessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthoritativeActivitySession', inputVars);
}
getAuthoritativeActivitySessionRef.operationName = 'GetAuthoritativeActivitySession';

export function getAuthoritativeActivitySession(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAuthoritativeActivitySessionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getAuthoritativeActivityResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAuthoritativeActivityResult', inputVars);
}
getAuthoritativeActivityResultRef.operationName = 'GetAuthoritativeActivityResult';

export function getAuthoritativeActivityResult(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAuthoritativeActivityResultRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listMyActivityAttemptsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyActivityAttempts', inputVars);
}
listMyActivityAttemptsRef.operationName = 'ListMyActivityAttempts';

export function listMyActivityAttempts(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMyActivityAttemptsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getEconomyConfigRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEconomyConfig');
}
getEconomyConfigRef.operationName = 'GetEconomyConfig';

export function getEconomyConfig(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getEconomyConfigRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listVisibleCompetitionPeriodsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVisibleCompetitionPeriods');
}
listVisibleCompetitionPeriodsRef.operationName = 'ListVisibleCompetitionPeriods';

export function listVisibleCompetitionPeriods(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listVisibleCompetitionPeriodsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getCompetitionRankingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompetitionRankings', inputVars);
}
getCompetitionRankingsRef.operationName = 'GetCompetitionRankings';

export function getCompetitionRankings(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompetitionRankingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getCompetitionAbuseSignalsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompetitionAbuseSignals', inputVars);
}
getCompetitionAbuseSignalsRef.operationName = 'GetCompetitionAbuseSignals';

export function getCompetitionAbuseSignals(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompetitionAbuseSignalsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const listTeacherCompetitionPeriodsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeacherCompetitionPeriods', inputVars);
}
listTeacherCompetitionPeriodsRef.operationName = 'ListTeacherCompetitionPeriods';

export function listTeacherCompetitionPeriods(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listTeacherCompetitionPeriodsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

export const getTeacherDashboardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTeacherDashboard', inputVars);
}
getTeacherDashboardRef.operationName = 'GetTeacherDashboard';

export function getTeacherDashboard(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getTeacherDashboardRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}

