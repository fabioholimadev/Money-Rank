import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ActivitySessionStatus {
  OPEN = "OPEN",
  SUBMITTED = "SUBMITTED",
  EXPIRED = "EXPIRED",
};

export enum CapiCoinTransactionType {
  CONTENT_REWARD = "CONTENT_REWARD",
  ACTIVITY_REWARD = "ACTIVITY_REWARD",
  STREAK_BONUS = "STREAK_BONUS",
  PURCHASE = "PURCHASE",
  ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT",
  ACTIVITY_REPEAT_REWARD = "ACTIVITY_REPEAT_REWARD",
};

export enum CompetitionPeriodStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
};

export enum ProfessionalAvatar {
  CAPI_CIENTISTA = "CAPI_CIENTISTA",
  CAPI_PROFESSORA = "CAPI_PROFESSORA",
  CAPI_PROGRAMADORA = "CAPI_PROGRAMADORA",
  CAPI_ECONOMISTA = "CAPI_ECONOMISTA",
  CAPI_MEDICA = "CAPI_MEDICA",
  CAPI_ENGENHEIRA = "CAPI_ENGENHEIRA",
};

export enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
};

export enum RewardSuppressionReason {
  NONE = "NONE",
  RATE_LIMIT = "RATE_LIMIT",
  DAILY_LIMIT = "DAILY_LIMIT",
};

export enum StudentClass {
  THIRD_DSA = "THIRD_DSA",
  THIRD_DSB = "THIRD_DSB",
};

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
};



export interface ActivityAttempt_Key {
  id: UUIDString;
  __typename?: 'ActivityAttempt_Key';
}

export interface ActivitySession_Key {
  id: UUIDString;
  __typename?: 'ActivitySession_Key';
}

export interface ApplyCapiCoinTransactionData {
  user_update?: User_Key | null;
  capiCoinTransaction_insert: CapiCoinTransaction_Key;
}

export interface ApplyCapiCoinTransactionVariables {
  studentUid: string;
  amount: number;
  transactionType: CapiCoinTransactionType;
  reason: string;
  sourceId?: string | null;
}

export interface CapiCoinTransaction_Key {
  id: UUIDString;
  __typename?: 'CapiCoinTransaction_Key';
}

export interface CompetitionPeriod_Key {
  id: UUIDString;
  __typename?: 'CompetitionPeriod_Key';
}

export interface CompleteMyCurrentPhaseContentData {
  affectedRows?: number | null;
}

export interface CompleteMyCurrentPhaseContentVariables {
  phaseNumber: number;
}

export interface CompleteMyCurrentPhaseData {
  affectedRows?: number | null;
}

export interface CompleteMyCurrentPhaseVariables {
  attemptId: UUIDString;
  sessionId: UUIDString;
  studentUid: string;
  activityId: string;
  phaseNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface CompleteMyIntroductionData {
  affectedRows?: number | null;
}

export interface CreateAuthoritativeActivitySessionData {
  activitySession_insert: ActivitySession_Key;
}

export interface CreateAuthoritativeActivitySessionVariables {
  sessionId: UUIDString;
  studentUid: string;
  activityId: string;
  phaseNumber: number;
  variantId?: string | null;
  contentVersion: string;
  publicPayload: unknown;
  answerKey: unknown;
  expiresAt: TimestampString;
}

export interface CreateCompetitionPeriodData {
  createdPeriod?: unknown | null;
}

export interface CreateCompetitionPeriodVariables {
  periodId: UUIDString;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  status: CompetitionPeriodStatus;
}

export interface EconomyConfig_Key {
  configKey: string;
  __typename?: 'EconomyConfig_Key';
}

export interface GetAuthoritativeActivityResultData {
  activityAttempts: ({
    id: UUIDString;
    activityId: string;
    phaseNumber: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    passed: boolean;
    firstCompletion: boolean;
    rewardBase: number;
    streakMultiplierPercent: number;
    streakBonus: number;
    rewardAmount: number;
    rewardLimitReached: boolean;
    rewardSuppressionReason: RewardSuppressionReason;
    createdAt: TimestampString;
    user: {
      capiCoins: number;
      currentStreak: number;
    };
  } & ActivityAttempt_Key)[];
}

export interface GetAuthoritativeActivityResultVariables {
  sessionId: UUIDString;
}

export interface GetAuthoritativeActivitySessionData {
  activitySession?: {
    id: UUIDString;
    userUid: string;
    activityId: string;
    phaseNumber: number;
    variantId?: string | null;
    contentVersion: string;
    publicPayload: unknown;
    answerKey: unknown;
    status: ActivitySessionStatus;
    expiresAt: TimestampString;
    submittedAt?: TimestampString | null;
    createdAt: TimestampString;
  } & ActivitySession_Key;
}

export interface GetAuthoritativeActivitySessionVariables {
  sessionId: UUIDString;
}

export interface GetCompetitionAbuseSignalsData {
  signals?: unknown[] | null;
}

export interface GetCompetitionAbuseSignalsVariables {
  periodId: UUIDString;
  minimumApprovedAttempts?: number | null;
}

export interface GetCompetitionRankingsData {
  individualRanking?: unknown[] | null;
  classRanking?: unknown[] | null;
}

export interface GetCompetitionRankingsVariables {
  periodId: UUIDString;
  studentLimit?: number | null;
}

export interface GetEconomyConfigData {
  economyConfig?: {
    configKey: string;
    firstContentReward: number;
    firstActivityReward: number;
    repeatActivityReward: number;
    rewardedRepeatLimitPerDay?: number | null;
    minimumRewardedAttemptIntervalSeconds: number;
    streakTier3Percent: number;
    streakTier5Percent: number;
    streakTier7Percent: number;
    updatedAt: TimestampString;
  } & EconomyConfig_Key;
}

export interface GetMyActivityAttemptData {
  activityAttempts: ({
    id: UUIDString;
    activityId: string;
    phaseNumber: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    passed: boolean;
    firstCompletion: boolean;
    rewardBase: number;
    streakMultiplierPercent: number;
    streakBonus: number;
    rewardAmount: number;
    rewardLimitReached: boolean;
    rewardSuppressionReason: RewardSuppressionReason;
    createdAt: TimestampString;
  } & ActivityAttempt_Key)[];
}

export interface GetMyActivityAttemptVariables {
  attemptId: UUIDString;
}

export interface GetMyCapiCoinTransactionBySourceData {
  capiCoinTransactions: ({
    id: UUIDString;
    amount: number;
    baseAmount: number;
    streakMultiplierPercent: number;
    streakBonus: number;
    transactionType: CapiCoinTransactionType;
    sourceId?: string | null;
    phaseNumber?: number | null;
    competitionPeriodId?: UUIDString | null;
    createdAt: TimestampString;
  } & CapiCoinTransaction_Key)[];
}

export interface GetMyCapiCoinTransactionBySourceVariables {
  sourceId: string;
}

export interface GetMyProfileData {
  user?: {
    uid: string;
    email: string;
    preferredName: string;
    classGroup?: StudentClass | null;
    role: UserRole;
    avatarId?: ProfessionalAvatar | null;
    avatarUrl?: string | null;
    profileCompleted: boolean;
    capiCoins: number;
    currentPhase: number;
    currentStreak: number;
    lastStreakDate?: DateString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key;
}

export interface InitializeMyTrailData {
  affectedRows?: number | null;
}

export interface ListMyActivityAttemptsData {
  activityAttempts: ({
    id: UUIDString;
    activityId: string;
    phaseNumber: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    passed: boolean;
    firstCompletion: boolean;
    rewardBase: number;
    streakMultiplierPercent: number;
    streakBonus: number;
    rewardAmount: number;
    rewardLimitReached: boolean;
    rewardSuppressionReason: RewardSuppressionReason;
    createdAt: TimestampString;
  } & ActivityAttempt_Key)[];
}

export interface ListMyActivityAttemptsVariables {
  phaseNumber: number;
  offset?: number | null;
}

export interface ListMyCapiCoinTransactionsData {
  capiCoinTransactions: ({
    id: UUIDString;
    attemptId?: UUIDString | null;
    amount: number;
    baseAmount: number;
    streakMultiplierPercent: number;
    streakBonus: number;
    transactionType: CapiCoinTransactionType;
    reason: string;
    sourceId?: string | null;
    phaseNumber?: number | null;
    classGroup?: StudentClass | null;
    competitionPeriodId?: UUIDString | null;
    competitionWeek?: DateString | null;
    createdAt: TimestampString;
  } & CapiCoinTransaction_Key)[];
}

export interface ListMyCapiCoinTransactionsVariables {
  offset?: number | null;
}

export interface ListMyProgressData {
  studentProgressEntries: ({
    phaseNumber: number;
    status: ProgressStatus;
    score: number;
    attempts: number;
    correctAnswers: number;
    wrongAnswers: number;
    startedAt?: TimestampString | null;
    completedAt?: TimestampString | null;
    updatedAt: TimestampString;
  })[];
}

export interface ListVisibleCompetitionPeriodsData {
  competitionPeriods: ({
    id: UUIDString;
    name: string;
    status: CompetitionPeriodStatus;
    startsAt: TimestampString;
    endsAt: TimestampString;
    pausedAt?: TimestampString | null;
    closedAt?: TimestampString | null;
    updatedAt: TimestampString;
  } & CompetitionPeriod_Key)[];
}

export interface MarkAuthoritativeActivitySessionSubmittedData {
  affectedRows?: number | null;
}

export interface MarkAuthoritativeActivitySessionSubmittedVariables {
  sessionId: UUIDString;
  studentUid: string;
}

export interface RegisterMyCurrentPhaseAttemptData {
  affectedRows?: number | null;
}

export interface RegisterMyCurrentPhaseAttemptVariables {
  attemptId: UUIDString;
  sessionId: UUIDString;
  studentUid: string;
  activityId: string;
  phaseNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface SetUserRoleByEmailData {
  updatedUser?: unknown | null;
}

export interface SetUserRoleByEmailVariables {
  email: string;
  role: UserRole;
}

export interface StudentProgress_Key {
  userUid: string;
  phaseNumber: number;
  __typename?: 'StudentProgress_Key';
}

export interface UpdateCompetitionPeriodStatusData {
  updatedPeriod?: unknown | null;
}

export interface UpdateCompetitionPeriodStatusVariables {
  periodId: UUIDString;
  status: CompetitionPeriodStatus;
}

export interface UpsertEconomyConfigData {
  economyConfig_upsert: EconomyConfig_Key;
}

export interface UpsertEconomyConfigVariables {
  firstContentReward: number;
  firstActivityReward: number;
  repeatActivityReward: number;
  rewardedRepeatLimitPerDay?: number | null;
  minimumRewardedAttemptIntervalSeconds: number;
  streakTier3Percent: number;
  streakTier5Percent: number;
  streakTier7Percent: number;
}

export interface UpsertMyProfileWithAvatarData {
  user_upsert: User_Key;
}

export interface UpsertMyProfileWithAvatarVariables {
  preferredName: string;
  classGroup: StudentClass;
  avatarId: ProfessionalAvatar;
}

export interface UpsertMyProfileWithPhotoData {
  user_upsert: User_Key;
}

export interface UpsertMyProfileWithPhotoVariables {
  preferredName: string;
  classGroup: StudentClass;
  avatarUrl: string;
}

export interface UpsertMyProfileWithoutSyncedPhotoData {
  user_upsert: User_Key;
}

export interface UpsertMyProfileWithoutSyncedPhotoVariables {
  preferredName: string;
  classGroup: StudentClass;
}

export interface UpsertStudentProgressData {
  studentProgress_upsert: StudentProgress_Key;
}

export interface UpsertStudentProgressVariables {
  studentUid: string;
  phaseNumber: number;
  status: ProgressStatus;
  score: number;
  attempts: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt?: TimestampString | null;
  completedAt?: TimestampString | null;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface UpsertMyProfileWithAvatarRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileWithAvatarVariables): MutationRef<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMyProfileWithAvatarVariables): MutationRef<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;
  operationName: string;
}
export const upsertMyProfileWithAvatarRef: UpsertMyProfileWithAvatarRef;

export function upsertMyProfileWithAvatar(vars: UpsertMyProfileWithAvatarVariables): MutationPromise<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;
export function upsertMyProfileWithAvatar(dc: DataConnect, vars: UpsertMyProfileWithAvatarVariables): MutationPromise<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;

interface UpsertMyProfileWithPhotoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileWithPhotoVariables): MutationRef<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMyProfileWithPhotoVariables): MutationRef<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;
  operationName: string;
}
export const upsertMyProfileWithPhotoRef: UpsertMyProfileWithPhotoRef;

export function upsertMyProfileWithPhoto(vars: UpsertMyProfileWithPhotoVariables): MutationPromise<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;
export function upsertMyProfileWithPhoto(dc: DataConnect, vars: UpsertMyProfileWithPhotoVariables): MutationPromise<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;

interface UpsertMyProfileWithoutSyncedPhotoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationRef<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationRef<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;
  operationName: string;
}
export const upsertMyProfileWithoutSyncedPhotoRef: UpsertMyProfileWithoutSyncedPhotoRef;

export function upsertMyProfileWithoutSyncedPhoto(vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationPromise<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;
export function upsertMyProfileWithoutSyncedPhoto(dc: DataConnect, vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationPromise<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;

interface SetUserRoleByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetUserRoleByEmailVariables): MutationRef<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SetUserRoleByEmailVariables): MutationRef<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;
  operationName: string;
}
export const setUserRoleByEmailRef: SetUserRoleByEmailRef;

export function setUserRoleByEmail(vars: SetUserRoleByEmailVariables): MutationPromise<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;
export function setUserRoleByEmail(dc: DataConnect, vars: SetUserRoleByEmailVariables): MutationPromise<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;

interface UpsertStudentProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStudentProgressVariables): MutationRef<UpsertStudentProgressData, UpsertStudentProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertStudentProgressVariables): MutationRef<UpsertStudentProgressData, UpsertStudentProgressVariables>;
  operationName: string;
}
export const upsertStudentProgressRef: UpsertStudentProgressRef;

export function upsertStudentProgress(vars: UpsertStudentProgressVariables): MutationPromise<UpsertStudentProgressData, UpsertStudentProgressVariables>;
export function upsertStudentProgress(dc: DataConnect, vars: UpsertStudentProgressVariables): MutationPromise<UpsertStudentProgressData, UpsertStudentProgressVariables>;

interface ApplyCapiCoinTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApplyCapiCoinTransactionVariables): MutationRef<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ApplyCapiCoinTransactionVariables): MutationRef<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;
  operationName: string;
}
export const applyCapiCoinTransactionRef: ApplyCapiCoinTransactionRef;

export function applyCapiCoinTransaction(vars: ApplyCapiCoinTransactionVariables): MutationPromise<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;
export function applyCapiCoinTransaction(dc: DataConnect, vars: ApplyCapiCoinTransactionVariables): MutationPromise<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;

interface UpsertEconomyConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEconomyConfigVariables): MutationRef<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertEconomyConfigVariables): MutationRef<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;
  operationName: string;
}
export const upsertEconomyConfigRef: UpsertEconomyConfigRef;

export function upsertEconomyConfig(vars: UpsertEconomyConfigVariables): MutationPromise<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;
export function upsertEconomyConfig(dc: DataConnect, vars: UpsertEconomyConfigVariables): MutationPromise<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;

interface CreateCompetitionPeriodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCompetitionPeriodVariables): MutationRef<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCompetitionPeriodVariables): MutationRef<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;
  operationName: string;
}
export const createCompetitionPeriodRef: CreateCompetitionPeriodRef;

export function createCompetitionPeriod(vars: CreateCompetitionPeriodVariables): MutationPromise<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;
export function createCompetitionPeriod(dc: DataConnect, vars: CreateCompetitionPeriodVariables): MutationPromise<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;

interface UpdateCompetitionPeriodStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCompetitionPeriodStatusVariables): MutationRef<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCompetitionPeriodStatusVariables): MutationRef<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;
  operationName: string;
}
export const updateCompetitionPeriodStatusRef: UpdateCompetitionPeriodStatusRef;

export function updateCompetitionPeriodStatus(vars: UpdateCompetitionPeriodStatusVariables): MutationPromise<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;
export function updateCompetitionPeriodStatus(dc: DataConnect, vars: UpdateCompetitionPeriodStatusVariables): MutationPromise<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;

interface CreateAuthoritativeActivitySessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuthoritativeActivitySessionVariables): MutationRef<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAuthoritativeActivitySessionVariables): MutationRef<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;
  operationName: string;
}
export const createAuthoritativeActivitySessionRef: CreateAuthoritativeActivitySessionRef;

export function createAuthoritativeActivitySession(vars: CreateAuthoritativeActivitySessionVariables): MutationPromise<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;
export function createAuthoritativeActivitySession(dc: DataConnect, vars: CreateAuthoritativeActivitySessionVariables): MutationPromise<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;

interface MarkAuthoritativeActivitySessionSubmittedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationRef<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationRef<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;
  operationName: string;
}
export const markAuthoritativeActivitySessionSubmittedRef: MarkAuthoritativeActivitySessionSubmittedRef;

export function markAuthoritativeActivitySessionSubmitted(vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationPromise<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;
export function markAuthoritativeActivitySessionSubmitted(dc: DataConnect, vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationPromise<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;

interface InitializeMyTrailRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<InitializeMyTrailData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<InitializeMyTrailData, undefined>;
  operationName: string;
}
export const initializeMyTrailRef: InitializeMyTrailRef;

export function initializeMyTrail(): MutationPromise<InitializeMyTrailData, undefined>;
export function initializeMyTrail(dc: DataConnect): MutationPromise<InitializeMyTrailData, undefined>;

interface CompleteMyIntroductionRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CompleteMyIntroductionData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CompleteMyIntroductionData, undefined>;
  operationName: string;
}
export const completeMyIntroductionRef: CompleteMyIntroductionRef;

export function completeMyIntroduction(): MutationPromise<CompleteMyIntroductionData, undefined>;
export function completeMyIntroduction(dc: DataConnect): MutationPromise<CompleteMyIntroductionData, undefined>;

interface CompleteMyCurrentPhaseContentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteMyCurrentPhaseContentVariables): MutationRef<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteMyCurrentPhaseContentVariables): MutationRef<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;
  operationName: string;
}
export const completeMyCurrentPhaseContentRef: CompleteMyCurrentPhaseContentRef;

export function completeMyCurrentPhaseContent(vars: CompleteMyCurrentPhaseContentVariables): MutationPromise<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;
export function completeMyCurrentPhaseContent(dc: DataConnect, vars: CompleteMyCurrentPhaseContentVariables): MutationPromise<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;

interface RegisterMyCurrentPhaseAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterMyCurrentPhaseAttemptVariables): MutationRef<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterMyCurrentPhaseAttemptVariables): MutationRef<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;
  operationName: string;
}
export const registerMyCurrentPhaseAttemptRef: RegisterMyCurrentPhaseAttemptRef;

export function registerMyCurrentPhaseAttempt(vars: RegisterMyCurrentPhaseAttemptVariables): MutationPromise<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;
export function registerMyCurrentPhaseAttempt(dc: DataConnect, vars: RegisterMyCurrentPhaseAttemptVariables): MutationPromise<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;

interface CompleteMyCurrentPhaseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteMyCurrentPhaseVariables): MutationRef<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteMyCurrentPhaseVariables): MutationRef<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;
  operationName: string;
}
export const completeMyCurrentPhaseRef: CompleteMyCurrentPhaseRef;

export function completeMyCurrentPhase(vars: CompleteMyCurrentPhaseVariables): MutationPromise<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;
export function completeMyCurrentPhase(dc: DataConnect, vars: CompleteMyCurrentPhaseVariables): MutationPromise<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface ListMyProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyProgressData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyProgressData, undefined>;
  operationName: string;
}
export const listMyProgressRef: ListMyProgressRef;

export function listMyProgress(options?: ExecuteQueryOptions): QueryPromise<ListMyProgressData, undefined>;
export function listMyProgress(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyProgressData, undefined>;

interface ListMyCapiCoinTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyCapiCoinTransactionsVariables): QueryRef<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListMyCapiCoinTransactionsVariables): QueryRef<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;
  operationName: string;
}
export const listMyCapiCoinTransactionsRef: ListMyCapiCoinTransactionsRef;

export function listMyCapiCoinTransactions(vars?: ListMyCapiCoinTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;
export function listMyCapiCoinTransactions(dc: DataConnect, vars?: ListMyCapiCoinTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;

interface GetMyCapiCoinTransactionBySourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyCapiCoinTransactionBySourceVariables): QueryRef<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyCapiCoinTransactionBySourceVariables): QueryRef<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;
  operationName: string;
}
export const getMyCapiCoinTransactionBySourceRef: GetMyCapiCoinTransactionBySourceRef;

export function getMyCapiCoinTransactionBySource(vars: GetMyCapiCoinTransactionBySourceVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;
export function getMyCapiCoinTransactionBySource(dc: DataConnect, vars: GetMyCapiCoinTransactionBySourceVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;

interface GetMyActivityAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyActivityAttemptVariables): QueryRef<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyActivityAttemptVariables): QueryRef<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;
  operationName: string;
}
export const getMyActivityAttemptRef: GetMyActivityAttemptRef;

export function getMyActivityAttempt(vars: GetMyActivityAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;
export function getMyActivityAttempt(dc: DataConnect, vars: GetMyActivityAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;

interface GetAuthoritativeActivitySessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthoritativeActivitySessionVariables): QueryRef<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAuthoritativeActivitySessionVariables): QueryRef<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;
  operationName: string;
}
export const getAuthoritativeActivitySessionRef: GetAuthoritativeActivitySessionRef;

export function getAuthoritativeActivitySession(vars: GetAuthoritativeActivitySessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;
export function getAuthoritativeActivitySession(dc: DataConnect, vars: GetAuthoritativeActivitySessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;

interface GetAuthoritativeActivityResultRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthoritativeActivityResultVariables): QueryRef<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAuthoritativeActivityResultVariables): QueryRef<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;
  operationName: string;
}
export const getAuthoritativeActivityResultRef: GetAuthoritativeActivityResultRef;

export function getAuthoritativeActivityResult(vars: GetAuthoritativeActivityResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;
export function getAuthoritativeActivityResult(dc: DataConnect, vars: GetAuthoritativeActivityResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;

interface ListMyActivityAttemptsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMyActivityAttemptsVariables): QueryRef<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMyActivityAttemptsVariables): QueryRef<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;
  operationName: string;
}
export const listMyActivityAttemptsRef: ListMyActivityAttemptsRef;

export function listMyActivityAttempts(vars: ListMyActivityAttemptsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;
export function listMyActivityAttempts(dc: DataConnect, vars: ListMyActivityAttemptsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;

interface GetEconomyConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetEconomyConfigData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetEconomyConfigData, undefined>;
  operationName: string;
}
export const getEconomyConfigRef: GetEconomyConfigRef;

export function getEconomyConfig(options?: ExecuteQueryOptions): QueryPromise<GetEconomyConfigData, undefined>;
export function getEconomyConfig(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetEconomyConfigData, undefined>;

interface ListVisibleCompetitionPeriodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVisibleCompetitionPeriodsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListVisibleCompetitionPeriodsData, undefined>;
  operationName: string;
}
export const listVisibleCompetitionPeriodsRef: ListVisibleCompetitionPeriodsRef;

export function listVisibleCompetitionPeriods(options?: ExecuteQueryOptions): QueryPromise<ListVisibleCompetitionPeriodsData, undefined>;
export function listVisibleCompetitionPeriods(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListVisibleCompetitionPeriodsData, undefined>;

interface GetCompetitionRankingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompetitionRankingsVariables): QueryRef<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompetitionRankingsVariables): QueryRef<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;
  operationName: string;
}
export const getCompetitionRankingsRef: GetCompetitionRankingsRef;

export function getCompetitionRankings(vars: GetCompetitionRankingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;
export function getCompetitionRankings(dc: DataConnect, vars: GetCompetitionRankingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;

interface GetCompetitionAbuseSignalsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompetitionAbuseSignalsVariables): QueryRef<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompetitionAbuseSignalsVariables): QueryRef<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;
  operationName: string;
}
export const getCompetitionAbuseSignalsRef: GetCompetitionAbuseSignalsRef;

export function getCompetitionAbuseSignals(vars: GetCompetitionAbuseSignalsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;
export function getCompetitionAbuseSignals(dc: DataConnect, vars: GetCompetitionAbuseSignalsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;

