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
  PERIOD_CLOSE_ADJUSTMENT: "PERIOD_CLOSE_ADJUSTMENT",
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

const ContentAssetType = {
  VIDEO: "VIDEO",
  SLIDES: "SLIDES",
  DOCUMENT: "DOCUMENT",
  SUMMARY: "SUMMARY",
  EXTERNAL_LINK: "EXTERNAL_LINK",
}
exports.ContentAssetType = ContentAssetType;

const EditorialEntityType = {
  LEARNING_MODULE: "LEARNING_MODULE",
  ACTIVITY_DEFINITION: "ACTIVITY_DEFINITION",
  RESEARCH_REVIEW: "RESEARCH_REVIEW",
}
exports.EditorialEntityType = EditorialEntityType;

const EditorialStatus = {
  DRAFT: "DRAFT",
  IN_REVIEW: "IN_REVIEW",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
}
exports.EditorialStatus = EditorialStatus;

const PedagogicalDifficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
}
exports.PedagogicalDifficulty = PedagogicalDifficulty;

const PedagogicalItemType = {
  QUESTION: "QUESTION",
  DECISION: "DECISION",
  PATH: "PATH",
  CARD: "CARD",
}
exports.PedagogicalItemType = PedagogicalItemType;

const PedagogicalReviewStatus = {
  PILOT_UNREVIEWED: "PILOT_UNREVIEWED",
  TECHNICALLY_APPROVED: "TECHNICALLY_APPROVED",
  PEDAGOGICALLY_APPROVED: "PEDAGOGICALLY_APPROVED",
  FULLY_APPROVED: "FULLY_APPROVED",
}
exports.PedagogicalReviewStatus = PedagogicalReviewStatus;

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

const ResearchReviewStatus = {
  PENDING_TEACHER_REVIEW: "PENDING_TEACHER_REVIEW",
  TEACHER_APPROVED: "TEACHER_APPROVED",
  REJECTED: "REJECTED",
}
exports.ResearchReviewStatus = ResearchReviewStatus;

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

const createLearningModuleVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateLearningModuleVersionEditorial', inputVars);
}
createLearningModuleVersionEditorialRef.operationName = 'CreateLearningModuleVersionEditorial';
exports.createLearningModuleVersionEditorialRef = createLearningModuleVersionEditorialRef;

exports.createLearningModuleVersionEditorial = function createLearningModuleVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createLearningModuleVersionEditorialRef(dcInstance, inputVars));
}
;

const createActivityDefinitionVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateActivityDefinitionVersionEditorial', inputVars);
}
createActivityDefinitionVersionEditorialRef.operationName = 'CreateActivityDefinitionVersionEditorial';
exports.createActivityDefinitionVersionEditorialRef = createActivityDefinitionVersionEditorialRef;

exports.createActivityDefinitionVersionEditorial = function createActivityDefinitionVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createActivityDefinitionVersionEditorialRef(dcInstance, inputVars));
}
;

const upsertLearningModuleSeedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertLearningModuleSeed', inputVars);
}
upsertLearningModuleSeedRef.operationName = 'UpsertLearningModuleSeed';
exports.upsertLearningModuleSeedRef = upsertLearningModuleSeedRef;

exports.upsertLearningModuleSeed = function upsertLearningModuleSeed(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertLearningModuleSeedRef(dcInstance, inputVars));
}
;

const upsertActivityDefinitionSeedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertActivityDefinitionSeed', inputVars);
}
upsertActivityDefinitionSeedRef.operationName = 'UpsertActivityDefinitionSeed';
exports.upsertActivityDefinitionSeedRef = upsertActivityDefinitionSeedRef;

exports.upsertActivityDefinitionSeed = function upsertActivityDefinitionSeed(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertActivityDefinitionSeedRef(dcInstance, inputVars));
}
;

const updateLearningModuleDraftEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLearningModuleDraftEditorial', inputVars);
}
updateLearningModuleDraftEditorialRef.operationName = 'UpdateLearningModuleDraftEditorial';
exports.updateLearningModuleDraftEditorialRef = updateLearningModuleDraftEditorialRef;

exports.updateLearningModuleDraftEditorial = function updateLearningModuleDraftEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateLearningModuleDraftEditorialRef(dcInstance, inputVars));
}
;

const updateActivityDefinitionDraftEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateActivityDefinitionDraftEditorial', inputVars);
}
updateActivityDefinitionDraftEditorialRef.operationName = 'UpdateActivityDefinitionDraftEditorial';
exports.updateActivityDefinitionDraftEditorialRef = updateActivityDefinitionDraftEditorialRef;

exports.updateActivityDefinitionDraftEditorial = function updateActivityDefinitionDraftEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateActivityDefinitionDraftEditorialRef(dcInstance, inputVars));
}
;

const submitLearningModuleForReviewEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitLearningModuleForReviewEditorial', inputVars);
}
submitLearningModuleForReviewEditorialRef.operationName = 'SubmitLearningModuleForReviewEditorial';
exports.submitLearningModuleForReviewEditorialRef = submitLearningModuleForReviewEditorialRef;

exports.submitLearningModuleForReviewEditorial = function submitLearningModuleForReviewEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(submitLearningModuleForReviewEditorialRef(dcInstance, inputVars));
}
;

const submitActivityDefinitionForReviewEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SubmitActivityDefinitionForReviewEditorial', inputVars);
}
submitActivityDefinitionForReviewEditorialRef.operationName = 'SubmitActivityDefinitionForReviewEditorial';
exports.submitActivityDefinitionForReviewEditorialRef = submitActivityDefinitionForReviewEditorialRef;

exports.submitActivityDefinitionForReviewEditorial = function submitActivityDefinitionForReviewEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(submitActivityDefinitionForReviewEditorialRef(dcInstance, inputVars));
}
;

const publishLearningModuleVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PublishLearningModuleVersionEditorial', inputVars);
}
publishLearningModuleVersionEditorialRef.operationName = 'PublishLearningModuleVersionEditorial';
exports.publishLearningModuleVersionEditorialRef = publishLearningModuleVersionEditorialRef;

exports.publishLearningModuleVersionEditorial = function publishLearningModuleVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(publishLearningModuleVersionEditorialRef(dcInstance, inputVars));
}
;

const publishActivityDefinitionVersionEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'PublishActivityDefinitionVersionEditorial', inputVars);
}
publishActivityDefinitionVersionEditorialRef.operationName = 'PublishActivityDefinitionVersionEditorial';
exports.publishActivityDefinitionVersionEditorialRef = publishActivityDefinitionVersionEditorialRef;

exports.publishActivityDefinitionVersionEditorial = function publishActivityDefinitionVersionEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(publishActivityDefinitionVersionEditorialRef(dcInstance, inputVars));
}
;

const createResearchReviewEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateResearchReviewEditorial', inputVars);
}
createResearchReviewEditorialRef.operationName = 'CreateResearchReviewEditorial';
exports.createResearchReviewEditorialRef = createResearchReviewEditorialRef;

exports.createResearchReviewEditorial = function createResearchReviewEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createResearchReviewEditorialRef(dcInstance, inputVars));
}
;

const reviewResearchEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReviewResearchEditorial', inputVars);
}
reviewResearchEditorialRef.operationName = 'ReviewResearchEditorial';
exports.reviewResearchEditorialRef = reviewResearchEditorialRef;

exports.reviewResearchEditorial = function reviewResearchEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reviewResearchEditorialRef(dcInstance, inputVars));
}
;

const createContentAssetEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateContentAssetEditorial', inputVars);
}
createContentAssetEditorialRef.operationName = 'CreateContentAssetEditorial';
exports.createContentAssetEditorialRef = createContentAssetEditorialRef;

exports.createContentAssetEditorial = function createContentAssetEditorial(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createContentAssetEditorialRef(dcInstance, inputVars));
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

const setUserRoleByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SetUserRoleByEmail', inputVars);
}
setUserRoleByEmailRef.operationName = 'SetUserRoleByEmail';
exports.setUserRoleByEmailRef = setUserRoleByEmailRef;

exports.setUserRoleByEmail = function setUserRoleByEmail(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(setUserRoleByEmailRef(dcInstance, inputVars));
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

const createTeacherCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTeacherCompetitionPeriod', inputVars);
}
createTeacherCompetitionPeriodRef.operationName = 'CreateTeacherCompetitionPeriod';
exports.createTeacherCompetitionPeriodRef = createTeacherCompetitionPeriodRef;

exports.createTeacherCompetitionPeriod = function createTeacherCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTeacherCompetitionPeriodRef(dcInstance, inputVars));
}
;

const updateTeacherCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTeacherCompetitionPeriod', inputVars);
}
updateTeacherCompetitionPeriodRef.operationName = 'UpdateTeacherCompetitionPeriod';
exports.updateTeacherCompetitionPeriodRef = updateTeacherCompetitionPeriodRef;

exports.updateTeacherCompetitionPeriod = function updateTeacherCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateTeacherCompetitionPeriodRef(dcInstance, inputVars));
}
;

const setTeacherCompetitionPeriodStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SetTeacherCompetitionPeriodStatus', inputVars);
}
setTeacherCompetitionPeriodStatusRef.operationName = 'SetTeacherCompetitionPeriodStatus';
exports.setTeacherCompetitionPeriodStatusRef = setTeacherCompetitionPeriodStatusRef;

exports.setTeacherCompetitionPeriodStatus = function setTeacherCompetitionPeriodStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(setTeacherCompetitionPeriodStatusRef(dcInstance, inputVars));
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

const updateAuthoritativeActivitySessionStateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAuthoritativeActivitySessionState', inputVars);
}
updateAuthoritativeActivitySessionStateRef.operationName = 'UpdateAuthoritativeActivitySessionState';
exports.updateAuthoritativeActivitySessionStateRef = updateAuthoritativeActivitySessionStateRef;

exports.updateAuthoritativeActivitySessionState = function updateAuthoritativeActivitySessionState(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAuthoritativeActivitySessionStateRef(dcInstance, inputVars));
}
;

const importPedagogicalBankRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ImportPedagogicalBank', inputVars);
}
importPedagogicalBankRef.operationName = 'ImportPedagogicalBank';
exports.importPedagogicalBankRef = importPedagogicalBankRef;

exports.importPedagogicalBank = function importPedagogicalBank(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(importPedagogicalBankRef(dcInstance, inputVars));
}
;

const bindPilotClassRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BindPilotClass', inputVars);
}
bindPilotClassRef.operationName = 'BindPilotClass';
exports.bindPilotClassRef = bindPilotClassRef;

exports.bindPilotClass = function bindPilotClass(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(bindPilotClassRef(dcInstance, inputVars));
}
;

const upsertPilotCompetitionPeriodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPilotCompetitionPeriod', inputVars);
}
upsertPilotCompetitionPeriodRef.operationName = 'UpsertPilotCompetitionPeriod';
exports.upsertPilotCompetitionPeriodRef = upsertPilotCompetitionPeriodRef;

exports.upsertPilotCompetitionPeriod = function upsertPilotCompetitionPeriod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertPilotCompetitionPeriodRef(dcInstance, inputVars));
}
;

const seedLoadTestStudentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedLoadTestStudents', inputVars);
}
seedLoadTestStudentsRef.operationName = 'SeedLoadTestStudents';
exports.seedLoadTestStudentsRef = seedLoadTestStudentsRef;

exports.seedLoadTestStudents = function seedLoadTestStudents(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(seedLoadTestStudentsRef(dcInstance, inputVars));
}
;

const recordLoadTestMetricsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RecordLoadTestMetrics', inputVars);
}
recordLoadTestMetricsRef.operationName = 'RecordLoadTestMetrics';
exports.recordLoadTestMetricsRef = recordLoadTestMetricsRef;

exports.recordLoadTestMetrics = function recordLoadTestMetrics(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(recordLoadTestMetricsRef(dcInstance, inputVars));
}
;

const cleanupMarkedLoadTestStudentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CleanupMarkedLoadTestStudents', inputVars);
}
cleanupMarkedLoadTestStudentsRef.operationName = 'CleanupMarkedLoadTestStudents';
exports.cleanupMarkedLoadTestStudentsRef = cleanupMarkedLoadTestStudentsRef;

exports.cleanupMarkedLoadTestStudents = function cleanupMarkedLoadTestStudents(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(cleanupMarkedLoadTestStudentsRef(dcInstance, inputVars));
}
;

const finalizeLoadTestCleanupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'FinalizeLoadTestCleanup', inputVars);
}
finalizeLoadTestCleanupRef.operationName = 'FinalizeLoadTestCleanup';
exports.finalizeLoadTestCleanupRef = finalizeLoadTestCleanupRef;

exports.finalizeLoadTestCleanup = function finalizeLoadTestCleanup(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(finalizeLoadTestCleanupRef(dcInstance, inputVars));
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

const getEditorialSeedStateRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEditorialSeedState');
}
getEditorialSeedStateRef.operationName = 'GetEditorialSeedState';
exports.getEditorialSeedStateRef = getEditorialSeedStateRef;

exports.getEditorialSeedState = function getEditorialSeedState(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getEditorialSeedStateRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listEditorialStudioDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEditorialStudioData');
}
listEditorialStudioDataRef.operationName = 'ListEditorialStudioData';
exports.listEditorialStudioDataRef = listEditorialStudioDataRef;

exports.listEditorialStudioData = function listEditorialStudioData(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEditorialStudioDataRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getLearningModuleVersionForEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLearningModuleVersionForEditorial', inputVars);
}
getLearningModuleVersionForEditorialRef.operationName = 'GetLearningModuleVersionForEditorial';
exports.getLearningModuleVersionForEditorialRef = getLearningModuleVersionForEditorialRef;

exports.getLearningModuleVersionForEditorial = function getLearningModuleVersionForEditorial(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLearningModuleVersionForEditorialRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getActivityDefinitionVersionForEditorialRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivityDefinitionVersionForEditorial', inputVars);
}
getActivityDefinitionVersionForEditorialRef.operationName = 'GetActivityDefinitionVersionForEditorial';
exports.getActivityDefinitionVersionForEditorialRef = getActivityDefinitionVersionForEditorialRef;

exports.getActivityDefinitionVersionForEditorial = function getActivityDefinitionVersionForEditorial(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getActivityDefinitionVersionForEditorialRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPublishedLearningModuleForStudentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublishedLearningModuleForStudent', inputVars);
}
getPublishedLearningModuleForStudentRef.operationName = 'GetPublishedLearningModuleForStudent';
exports.getPublishedLearningModuleForStudentRef = getPublishedLearningModuleForStudentRef;

exports.getPublishedLearningModuleForStudent = function getPublishedLearningModuleForStudent(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublishedLearningModuleForStudentRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPublishedActivityDefinitionForSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublishedActivityDefinitionForSession', inputVars);
}
getPublishedActivityDefinitionForSessionRef.operationName = 'GetPublishedActivityDefinitionForSession';
exports.getPublishedActivityDefinitionForSessionRef = getPublishedActivityDefinitionForSessionRef;

exports.getPublishedActivityDefinitionForSession = function getPublishedActivityDefinitionForSession(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublishedActivityDefinitionForSessionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
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

const getCompetitionRankingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompetitionRankings', inputVars);
}
getCompetitionRankingsRef.operationName = 'GetCompetitionRankings';
exports.getCompetitionRankingsRef = getCompetitionRankingsRef;

exports.getCompetitionRankings = function getCompetitionRankings(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompetitionRankingsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
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

const listTeacherCompetitionPeriodsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeacherCompetitionPeriods', inputVars);
}
listTeacherCompetitionPeriodsRef.operationName = 'ListTeacherCompetitionPeriods';
exports.listTeacherCompetitionPeriodsRef = listTeacherCompetitionPeriodsRef;

exports.listTeacherCompetitionPeriods = function listTeacherCompetitionPeriods(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listTeacherCompetitionPeriodsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getTeacherDashboardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTeacherDashboard', inputVars);
}
getTeacherDashboardRef.operationName = 'GetTeacherDashboard';
exports.getTeacherDashboardRef = getTeacherDashboardRef;

exports.getTeacherDashboard = function getTeacherDashboard(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getTeacherDashboardRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPedagogicalBankStatusRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPedagogicalBankStatus');
}
getPedagogicalBankStatusRef.operationName = 'GetPedagogicalBankStatus';
exports.getPedagogicalBankStatusRef = getPedagogicalBankStatusRef;

exports.getPedagogicalBankStatus = function getPedagogicalBankStatus(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getPedagogicalBankStatusRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listActivePedagogicalItemsForActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListActivePedagogicalItemsForActivity', inputVars);
}
listActivePedagogicalItemsForActivityRef.operationName = 'ListActivePedagogicalItemsForActivity';
exports.listActivePedagogicalItemsForActivityRef = listActivePedagogicalItemsForActivityRef;

exports.listActivePedagogicalItemsForActivity = function listActivePedagogicalItemsForActivity(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listActivePedagogicalItemsForActivityRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listStudentSeenPedagogicalItemIdsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStudentSeenPedagogicalItemIds', inputVars);
}
listStudentSeenPedagogicalItemIdsRef.operationName = 'ListStudentSeenPedagogicalItemIds';
exports.listStudentSeenPedagogicalItemIdsRef = listStudentSeenPedagogicalItemIdsRef;

exports.listStudentSeenPedagogicalItemIds = function listStudentSeenPedagogicalItemIds(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listStudentSeenPedagogicalItemIdsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPilotClassBindingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPilotClassBinding', inputVars);
}
getPilotClassBindingRef.operationName = 'GetPilotClassBinding';
exports.getPilotClassBindingRef = getPilotClassBindingRef;

exports.getPilotClassBinding = function getPilotClassBinding(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPilotClassBindingRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const resolveCompetitionPeriodByKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ResolveCompetitionPeriodByKey', inputVars);
}
resolveCompetitionPeriodByKeyRef.operationName = 'ResolveCompetitionPeriodByKey';
exports.resolveCompetitionPeriodByKeyRef = resolveCompetitionPeriodByKeyRef;

exports.resolveCompetitionPeriodByKey = function resolveCompetitionPeriodByKey(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(resolveCompetitionPeriodByKeyRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPilotExportRowsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPilotExportRows', inputVars);
}
getPilotExportRowsRef.operationName = 'GetPilotExportRows';
exports.getPilotExportRowsRef = getPilotExportRowsRef;

exports.getPilotExportRows = function getPilotExportRows(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPilotExportRowsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getLoadTestCleanupStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLoadTestCleanupStatus', inputVars);
}
getLoadTestCleanupStatusRef.operationName = 'GetLoadTestCleanupStatus';
exports.getLoadTestCleanupStatusRef = getLoadTestCleanupStatusRef;

exports.getLoadTestCleanupStatus = function getLoadTestCleanupStatus(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getLoadTestCleanupStatusRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
