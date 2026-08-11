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
  PERIOD_CLOSE_ADJUSTMENT = "PERIOD_CLOSE_ADJUSTMENT",
};

export enum CompetitionPeriodStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
};

export enum ContentAssetType {
  VIDEO = "VIDEO",
  SLIDES = "SLIDES",
  DOCUMENT = "DOCUMENT",
  SUMMARY = "SUMMARY",
  EXTERNAL_LINK = "EXTERNAL_LINK",
};

export enum EditorialEntityType {
  LEARNING_MODULE = "LEARNING_MODULE",
  ACTIVITY_DEFINITION = "ACTIVITY_DEFINITION",
  RESEARCH_REVIEW = "RESEARCH_REVIEW",
};

export enum EditorialStatus {
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
};

export enum PedagogicalDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
};

export enum PedagogicalItemType {
  QUESTION = "QUESTION",
  DECISION = "DECISION",
  PATH = "PATH",
  CARD = "CARD",
};

export enum PedagogicalReviewStatus {
  PILOT_UNREVIEWED = "PILOT_UNREVIEWED",
  TECHNICALLY_APPROVED = "TECHNICALLY_APPROVED",
  PEDAGOGICALLY_APPROVED = "PEDAGOGICALLY_APPROVED",
  FULLY_APPROVED = "FULLY_APPROVED",
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

export enum ResearchReviewStatus {
  PENDING_TEACHER_REVIEW = "PENDING_TEACHER_REVIEW",
  TEACHER_APPROVED = "TEACHER_APPROVED",
  REJECTED = "REJECTED",
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



export interface ActivateTeacherTestRunData {
  affectedRows?: number | null;
}

export interface ActivateTeacherTestRunVariables {
  testRunId: UUIDString;
  durationMinutes: number;
  actorUid: string;
}

export interface ActivityAttempt_Key {
  id: UUIDString;
  __typename?: 'ActivityAttempt_Key';
}

export interface ActivityDefinitionVersion_Key {
  id: UUIDString;
  __typename?: 'ActivityDefinitionVersion_Key';
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

export interface BindPilotClassData {
  affectedRows?: number | null;
}

export interface BindPilotClassVariables {
  studentUid: string;
  classGroup: StudentClass;
}

export interface CapiCoinTransaction_Key {
  id: UUIDString;
  __typename?: 'CapiCoinTransaction_Key';
}

export interface CleanTeacherTestRunData {
  affectedRows?: number | null;
}

export interface CleanTeacherTestRunVariables {
  testRunId: UUIDString;
  actorUid: string;
}

export interface CleanupMarkedLoadTestStudentsData {
  affectedRows?: number | null;
}

export interface CleanupMarkedLoadTestStudentsVariables {
  runId: string;
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

export interface ContentAsset_Key {
  id: UUIDString;
  __typename?: 'ContentAsset_Key';
}

export interface CreateActivityDefinitionVersionEditorialData {
  activityDefinitionVersion_insert: ActivityDefinitionVersion_Key;
  editorialAuditLog_insert: EditorialAuditLog_Key;
}

export interface CreateActivityDefinitionVersionEditorialVariables {
  versionId: UUIDString;
  activityKey: string;
  phaseNumber: number;
  version: number;
  status: EditorialStatus;
  publicationKey?: string | null;
  title: string;
  changeSummary: string;
  payload: unknown;
  actorUid: string;
  publishedByUid?: string | null;
  publishedAt?: TimestampString | null;
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

export interface CreateContentAssetEditorialData {
  createdAsset?: unknown | null;
}

export interface CreateContentAssetEditorialVariables {
  assetId: UUIDString;
  entityType: EditorialEntityType;
  entityId: UUIDString;
  assetType: ContentAssetType;
  displayName: string;
  url: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: Int64String;
  sha256: string;
  actorUid: string;
}

export interface CreateLearningModuleVersionEditorialData {
  learningModuleVersion_insert: LearningModuleVersion_Key;
  editorialAuditLog_insert: EditorialAuditLog_Key;
}

export interface CreateLearningModuleVersionEditorialVariables {
  versionId: UUIDString;
  moduleKey: string;
  phaseNumber: number;
  version: number;
  status: EditorialStatus;
  publicationKey?: string | null;
  title: string;
  changeSummary: string;
  payload: unknown;
  actorUid: string;
  publishedByUid?: string | null;
  publishedAt?: TimestampString | null;
}

export interface CreateResearchReviewEditorialData {
  researchReview_insert: ResearchReview_Key;
  editorialAuditLog_insert: EditorialAuditLog_Key;
}

export interface CreateResearchReviewEditorialVariables {
  reviewId: UUIDString;
  activityKey: string;
  factKey: string;
  title: string;
  claim: string;
  sourceUrl: string;
  proposedBy: string;
  actorUid: string;
}

export interface CreateTeacherCompetitionPeriodData {
  createdPeriod?: unknown | null;
}

export interface CreateTeacherCompetitionPeriodVariables {
  periodId: UUIDString;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  status: CompetitionPeriodStatus;
  actorUid: string;
}

export interface CreateTestActivitySessionData {
  affectedRows?: number | null;
}

export interface CreateTestActivitySessionVariables {
  sessionId: UUIDString;
  testRunId: UUIDString;
  actorUid: string;
  activityId: string;
  phaseNumber: number;
  variantId?: string | null;
  contentVersion: string;
  publicPayload: unknown;
  answerKey: unknown;
  expiresAt: TimestampString;
}

export interface EconomyConfig_Key {
  configKey: string;
  __typename?: 'EconomyConfig_Key';
}

export interface EditorialAuditLog_Key {
  id: UUIDString;
  __typename?: 'EditorialAuditLog_Key';
}

export interface EndTeacherTestRunData {
  affectedRows?: number | null;
}

export interface EndTeacherTestRunVariables {
  testRunId: UUIDString;
  actorUid: string;
}

export interface ExpireTestRunsData {
  affectedRows?: number | null;
}

export interface FinalizeLoadTestCleanupData {
  affectedRows?: number | null;
}

export interface FinalizeLoadTestCleanupVariables {
  runId: string;
  deletedAuthUsers: number;
}

export interface GetActiveTestRunForUserData {
  testRun?: unknown | null;
}

export interface GetActiveTestRunForUserVariables {
  userUid: string;
}

export interface GetActivityDefinitionVersionForEditorialData {
  activityDefinitionVersion?: {
    id: UUIDString;
    activityKey: string;
    phaseNumber: number;
    version: number;
    status: EditorialStatus;
    title: string;
    changeSummary: string;
    payload: unknown;
    createdByUid: string;
    publishedByUid?: string | null;
    publishedAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & ActivityDefinitionVersion_Key;
}

export interface GetActivityDefinitionVersionForEditorialVariables {
  versionId: UUIDString;
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
    isTest: boolean;
    testRunId?: UUIDString | null;
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
    isTest: boolean;
    testRunId?: UUIDString | null;
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

export interface GetEditorialSeedStateData {
  learningModules: ({
    moduleKey: string;
  })[];
  activities: ({
    activityKey: string;
  })[];
}

export interface GetLearningModuleVersionForEditorialData {
  learningModuleVersion?: {
    id: UUIDString;
    moduleKey: string;
    phaseNumber: number;
    version: number;
    status: EditorialStatus;
    title: string;
    changeSummary: string;
    payload: unknown;
    createdByUid: string;
    publishedByUid?: string | null;
    publishedAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & LearningModuleVersion_Key;
}

export interface GetLearningModuleVersionForEditorialVariables {
  versionId: UUIDString;
}

export interface GetLoadTestCleanupStatusData {
  run?: {
    runId: string;
    status: string;
    requestedUsers: number;
    createdUsers: number;
    deletedDatabaseUsers: number;
    deletedAuthUsers: number;
    metrics?: unknown | null;
    startedAt: TimestampString;
    completedAt?: TimestampString | null;
    cleanedAt?: TimestampString | null;
  } & LoadTestRun_Key;
  remainingMarkedUsers?: unknown | null;
}

export interface GetLoadTestCleanupStatusVariables {
  runId: string;
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

export interface GetPedagogicalBankStatusData {
  latestLoad?: unknown | null;
  counts?: unknown[] | null;
  items?: unknown[] | null;
}

export interface GetPilotClassBindingData {
  user?: {
    uid: string;
    role: UserRole;
    classGroup?: StudentClass | null;
    profileCompleted: boolean;
    capiCoins: number;
    currentPhase: number;
    currentStreak: number;
  } & User_Key;
}

export interface GetPilotClassBindingVariables {
  studentUid: string;
}

export interface GetPilotExportRowsData {
  attempts?: unknown[] | null;
  transactions?: unknown[] | null;
  audit?: unknown[] | null;
}

export interface GetPilotExportRowsVariables {
  periodId: UUIDString;
}

export interface GetPublishedActivityDefinitionForSessionData {
  activityDefinitionVersions: ({
    id: UUIDString;
    activityKey: string;
    phaseNumber: number;
    version: number;
    title: string;
    payload: unknown;
    publishedAt?: TimestampString | null;
  } & ActivityDefinitionVersion_Key)[];
}

export interface GetPublishedActivityDefinitionForSessionVariables {
  activityKey: string;
}

export interface GetPublishedLearningModuleForStudentData {
  learningModuleVersions: ({
    id: UUIDString;
    moduleKey: string;
    phaseNumber: number;
    version: number;
    title: string;
    payload: unknown;
    publishedAt?: TimestampString | null;
  } & LearningModuleVersion_Key)[];
}

export interface GetPublishedLearningModuleForStudentVariables {
  moduleKey: string;
}

export interface GetTeacherDashboardData {
  summary?: unknown | null;
  classMetrics?: unknown[] | null;
  phaseMetrics?: unknown[] | null;
  studentMetrics?: unknown[] | null;
}

export interface GetTeacherDashboardVariables {
  periodId: UUIDString;
  studentLimit?: number | null;
}

export interface GetTeacherTestRunData {
  testRun?: unknown | null;
}

export interface GetTeacherTestRunVariables {
  actorUid: string;
}

export interface ImportPedagogicalBankData {
  importedRows?: number | null;
}

export interface ImportPedagogicalBankVariables {
  loadHash: string;
  loadVersion: string;
  sourceFile: string;
  itemCount: number;
  items: unknown;
}

export interface InitializeMyTrailData {
  affectedRows?: number | null;
}

export interface LearningModuleVersion_Key {
  id: UUIDString;
  __typename?: 'LearningModuleVersion_Key';
}

export interface ListActivePedagogicalItemsForActivityData {
  pedagogicalItems: ({
    activityId: string;
    version: string;
    itemId: string;
    phaseNumber: number;
    itemType: PedagogicalItemType;
    characterId?: string | null;
    difficulty: PedagogicalDifficulty;
    stage?: number | null;
    pathCondition?: string | null;
    publicPayload: unknown;
    secretPayload: unknown;
    sourceId: string;
    sourceUrl: string;
    tags: string[];
    active: boolean;
    reviewStatus: PedagogicalReviewStatus;
    origin: string;
    contentHash: string;
    loadHash: string;
  } & PedagogicalItem_Key)[];
}

export interface ListActivePedagogicalItemsForActivityVariables {
  activityId: string;
}

export interface ListEditorialStudioDataData {
  learningModules: ({
    id: UUIDString;
    moduleKey: string;
    phaseNumber: number;
    version: number;
    status: EditorialStatus;
    title: string;
    changeSummary: string;
    payload: unknown;
    createdByUid: string;
    publishedByUid?: string | null;
    publishedAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & LearningModuleVersion_Key)[];
  activities: ({
    id: UUIDString;
    activityKey: string;
    phaseNumber: number;
    version: number;
    status: EditorialStatus;
    title: string;
    changeSummary: string;
    payload: unknown;
    createdByUid: string;
    publishedByUid?: string | null;
    publishedAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & ActivityDefinitionVersion_Key)[];
  research: ({
    id: UUIDString;
    activityKey: string;
    factKey: string;
    title: string;
    claim: string;
    sourceUrl: string;
    proposedBy: string;
    status: ResearchReviewStatus;
    reviewNotes?: string | null;
    createdByUid: string;
    reviewedByUid?: string | null;
    reviewedAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & ResearchReview_Key)[];
  assets: ({
    id: UUIDString;
    entityType: EditorialEntityType;
    entityId: UUIDString;
    assetType: ContentAssetType;
    displayName: string;
    url: string;
    storagePath?: string | null;
    mimeType?: string | null;
    sizeBytes?: Int64String | null;
    sha256?: string | null;
    createdByUid: string;
    createdAt: TimestampString;
  } & ContentAsset_Key)[];
  audit: ({
    id: UUIDString;
    entityType: EditorialEntityType;
    entityId: UUIDString;
    entityKey: string;
    version: number;
    action: string;
    actorUid: string;
    summary: string;
    details?: unknown | null;
    createdAt: TimestampString;
  } & EditorialAuditLog_Key)[];
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

export interface ListStudentSeenPedagogicalItemIdsData {
  seenItems?: unknown[] | null;
}

export interface ListStudentSeenPedagogicalItemIdsVariables {
  studentUid: string;
  activityId: string;
}

export interface ListTeacherCompetitionPeriodsData {
  periods?: unknown[] | null;
}

export interface ListTeacherCompetitionPeriodsVariables {
  limit?: number | null;
}

export interface ListVisibleCompetitionPeriodsData {
  competitionPeriods: ({
    id: UUIDString;
    name: string;
    periodKey?: string | null;
    timeZone: string;
    schedule?: unknown | null;
    status: CompetitionPeriodStatus;
    startsAt: TimestampString;
    endsAt: TimestampString;
    pausedAt?: TimestampString | null;
    closedAt?: TimestampString | null;
    updatedAt: TimestampString;
  } & CompetitionPeriod_Key)[];
}

export interface LoadTestRun_Key {
  runId: string;
  __typename?: 'LoadTestRun_Key';
}

export interface MarkAuthoritativeActivitySessionSubmittedData {
  affectedRows?: number | null;
}

export interface MarkAuthoritativeActivitySessionSubmittedVariables {
  sessionId: UUIDString;
  studentUid: string;
}

export interface PedagogicalBankLoad_Key {
  loadHash: string;
  __typename?: 'PedagogicalBankLoad_Key';
}

export interface PedagogicalItem_Key {
  activityId: string;
  version: string;
  itemId: string;
  __typename?: 'PedagogicalItem_Key';
}

export interface PublishActivityDefinitionVersionEditorialData {
  publishedCount?: number | null;
}

export interface PublishActivityDefinitionVersionEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}

export interface PublishLearningModuleVersionEditorialData {
  publishedCount?: number | null;
}

export interface PublishLearningModuleVersionEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}

export interface RecordLoadTestMetricsData {
  affectedRows?: number | null;
}

export interface RecordLoadTestMetricsVariables {
  runId: string;
  status: string;
  metrics: unknown;
}

export interface RecordTestActivityAttemptData {
  affectedRows?: number | null;
}

export interface RecordTestActivityAttemptVariables {
  attemptId: UUIDString;
  sessionId: UUIDString;
  testRunId: UUIDString;
  actorUid: string;
  activityId: string;
  phaseNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  passed: boolean;
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

export interface ResearchReview_Key {
  id: UUIDString;
  __typename?: 'ResearchReview_Key';
}

export interface ResolveCompetitionPeriodByKeyData {
  competitionPeriod?: {
    id: UUIDString;
    periodKey?: string | null;
    name: string;
    timeZone: string;
    schedule?: unknown | null;
    status: CompetitionPeriodStatus;
    startsAt: TimestampString;
    endsAt: TimestampString;
  } & CompetitionPeriod_Key;
}

export interface ResolveCompetitionPeriodByKeyVariables {
  periodKey: string;
}

export interface ReviewResearchEditorialData {
  reviewedCount?: number | null;
}

export interface ReviewResearchEditorialVariables {
  reviewId: UUIDString;
  status: ResearchReviewStatus;
  reviewNotes?: string | null;
  actorUid: string;
}

export interface SeedLoadTestStudentsData {
  affectedRows?: number | null;
}

export interface SeedLoadTestStudentsVariables {
  runId: string;
  requestedUsers: number;
  users: unknown;
}

export interface SetTeacherCompetitionPeriodStatusData {
  updatedPeriod?: unknown | null;
  compensatedUsers?: number | null;
  zeroedUsers?: number | null;
}

export interface SetTeacherCompetitionPeriodStatusVariables {
  periodId: UUIDString;
  status: CompetitionPeriodStatus;
  actorUid: string;
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

export interface SubmitActivityDefinitionForReviewEditorialData {
  submittedCount?: number | null;
}

export interface SubmitActivityDefinitionForReviewEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}

export interface SubmitLearningModuleForReviewEditorialData {
  submittedCount?: number | null;
}

export interface SubmitLearningModuleForReviewEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}

export interface TestRunAudit_Key {
  id: UUIDString;
  __typename?: 'TestRunAudit_Key';
}

export interface TestRun_Key {
  id: UUIDString;
  __typename?: 'TestRun_Key';
}

export interface UpdateActivityDefinitionDraftEditorialData {
  updatedCount?: number | null;
}

export interface UpdateActivityDefinitionDraftEditorialVariables {
  versionId: UUIDString;
  title: string;
  changeSummary: string;
  payload: unknown;
  actorUid: string;
}

export interface UpdateAuthoritativeActivitySessionStateData {
  affectedRows?: number | null;
}

export interface UpdateAuthoritativeActivitySessionStateVariables {
  sessionId: UUIDString;
  studentUid: string;
  answerKey: unknown;
  publicPayload: unknown;
}

export interface UpdateCompetitionPeriodStatusData {
  updatedPeriod?: unknown | null;
}

export interface UpdateCompetitionPeriodStatusVariables {
  periodId: UUIDString;
  status: CompetitionPeriodStatus;
}

export interface UpdateLearningModuleDraftEditorialData {
  updatedCount?: number | null;
}

export interface UpdateLearningModuleDraftEditorialVariables {
  versionId: UUIDString;
  title: string;
  changeSummary: string;
  payload: unknown;
  actorUid: string;
}

export interface UpdateTeacherCompetitionPeriodData {
  updatedPeriod?: unknown | null;
}

export interface UpdateTeacherCompetitionPeriodVariables {
  periodId: UUIDString;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  actorUid: string;
}

export interface UpsertActivityDefinitionSeedData {
  activityDefinitionVersion_upsert: ActivityDefinitionVersion_Key;
  editorialAuditLog_upsert: EditorialAuditLog_Key;
}

export interface UpsertActivityDefinitionSeedVariables {
  versionId: UUIDString;
  auditId: UUIDString;
  activityKey: string;
  phaseNumber: number;
  title: string;
  payload: unknown;
  publishedAt: TimestampString;
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

export interface UpsertLearningModuleSeedData {
  learningModuleVersion_upsert: LearningModuleVersion_Key;
  editorialAuditLog_upsert: EditorialAuditLog_Key;
}

export interface UpsertLearningModuleSeedVariables {
  versionId: UUIDString;
  auditId: UUIDString;
  moduleKey: string;
  phaseNumber: number;
  title: string;
  payload: unknown;
  publishedAt: TimestampString;
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

export interface UpsertPilotCompetitionPeriodData {
  affectedRows?: number | null;
}

export interface UpsertPilotCompetitionPeriodVariables {
  periodId: UUIDString;
  periodKey: string;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  schedule: unknown;
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

interface CreateLearningModuleVersionEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLearningModuleVersionEditorialVariables): MutationRef<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateLearningModuleVersionEditorialVariables): MutationRef<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;
  operationName: string;
}
export const createLearningModuleVersionEditorialRef: CreateLearningModuleVersionEditorialRef;

export function createLearningModuleVersionEditorial(vars: CreateLearningModuleVersionEditorialVariables): MutationPromise<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;
export function createLearningModuleVersionEditorial(dc: DataConnect, vars: CreateLearningModuleVersionEditorialVariables): MutationPromise<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;

interface CreateActivityDefinitionVersionEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateActivityDefinitionVersionEditorialVariables): MutationRef<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateActivityDefinitionVersionEditorialVariables): MutationRef<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;
  operationName: string;
}
export const createActivityDefinitionVersionEditorialRef: CreateActivityDefinitionVersionEditorialRef;

export function createActivityDefinitionVersionEditorial(vars: CreateActivityDefinitionVersionEditorialVariables): MutationPromise<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;
export function createActivityDefinitionVersionEditorial(dc: DataConnect, vars: CreateActivityDefinitionVersionEditorialVariables): MutationPromise<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;

interface UpsertLearningModuleSeedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLearningModuleSeedVariables): MutationRef<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertLearningModuleSeedVariables): MutationRef<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;
  operationName: string;
}
export const upsertLearningModuleSeedRef: UpsertLearningModuleSeedRef;

export function upsertLearningModuleSeed(vars: UpsertLearningModuleSeedVariables): MutationPromise<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;
export function upsertLearningModuleSeed(dc: DataConnect, vars: UpsertLearningModuleSeedVariables): MutationPromise<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;

interface UpsertActivityDefinitionSeedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityDefinitionSeedVariables): MutationRef<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertActivityDefinitionSeedVariables): MutationRef<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;
  operationName: string;
}
export const upsertActivityDefinitionSeedRef: UpsertActivityDefinitionSeedRef;

export function upsertActivityDefinitionSeed(vars: UpsertActivityDefinitionSeedVariables): MutationPromise<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;
export function upsertActivityDefinitionSeed(dc: DataConnect, vars: UpsertActivityDefinitionSeedVariables): MutationPromise<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;

interface UpdateLearningModuleDraftEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLearningModuleDraftEditorialVariables): MutationRef<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLearningModuleDraftEditorialVariables): MutationRef<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;
  operationName: string;
}
export const updateLearningModuleDraftEditorialRef: UpdateLearningModuleDraftEditorialRef;

export function updateLearningModuleDraftEditorial(vars: UpdateLearningModuleDraftEditorialVariables): MutationPromise<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;
export function updateLearningModuleDraftEditorial(dc: DataConnect, vars: UpdateLearningModuleDraftEditorialVariables): MutationPromise<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;

interface UpdateActivityDefinitionDraftEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateActivityDefinitionDraftEditorialVariables): MutationRef<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateActivityDefinitionDraftEditorialVariables): MutationRef<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;
  operationName: string;
}
export const updateActivityDefinitionDraftEditorialRef: UpdateActivityDefinitionDraftEditorialRef;

export function updateActivityDefinitionDraftEditorial(vars: UpdateActivityDefinitionDraftEditorialVariables): MutationPromise<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;
export function updateActivityDefinitionDraftEditorial(dc: DataConnect, vars: UpdateActivityDefinitionDraftEditorialVariables): MutationPromise<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;

interface SubmitLearningModuleForReviewEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitLearningModuleForReviewEditorialVariables): MutationRef<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SubmitLearningModuleForReviewEditorialVariables): MutationRef<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;
  operationName: string;
}
export const submitLearningModuleForReviewEditorialRef: SubmitLearningModuleForReviewEditorialRef;

export function submitLearningModuleForReviewEditorial(vars: SubmitLearningModuleForReviewEditorialVariables): MutationPromise<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;
export function submitLearningModuleForReviewEditorial(dc: DataConnect, vars: SubmitLearningModuleForReviewEditorialVariables): MutationPromise<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;

interface SubmitActivityDefinitionForReviewEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationRef<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationRef<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;
  operationName: string;
}
export const submitActivityDefinitionForReviewEditorialRef: SubmitActivityDefinitionForReviewEditorialRef;

export function submitActivityDefinitionForReviewEditorial(vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationPromise<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;
export function submitActivityDefinitionForReviewEditorial(dc: DataConnect, vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationPromise<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;

interface PublishLearningModuleVersionEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: PublishLearningModuleVersionEditorialVariables): MutationRef<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: PublishLearningModuleVersionEditorialVariables): MutationRef<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;
  operationName: string;
}
export const publishLearningModuleVersionEditorialRef: PublishLearningModuleVersionEditorialRef;

export function publishLearningModuleVersionEditorial(vars: PublishLearningModuleVersionEditorialVariables): MutationPromise<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;
export function publishLearningModuleVersionEditorial(dc: DataConnect, vars: PublishLearningModuleVersionEditorialVariables): MutationPromise<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;

interface PublishActivityDefinitionVersionEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: PublishActivityDefinitionVersionEditorialVariables): MutationRef<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: PublishActivityDefinitionVersionEditorialVariables): MutationRef<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;
  operationName: string;
}
export const publishActivityDefinitionVersionEditorialRef: PublishActivityDefinitionVersionEditorialRef;

export function publishActivityDefinitionVersionEditorial(vars: PublishActivityDefinitionVersionEditorialVariables): MutationPromise<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;
export function publishActivityDefinitionVersionEditorial(dc: DataConnect, vars: PublishActivityDefinitionVersionEditorialVariables): MutationPromise<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;

interface CreateResearchReviewEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateResearchReviewEditorialVariables): MutationRef<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateResearchReviewEditorialVariables): MutationRef<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;
  operationName: string;
}
export const createResearchReviewEditorialRef: CreateResearchReviewEditorialRef;

export function createResearchReviewEditorial(vars: CreateResearchReviewEditorialVariables): MutationPromise<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;
export function createResearchReviewEditorial(dc: DataConnect, vars: CreateResearchReviewEditorialVariables): MutationPromise<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;

interface ReviewResearchEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReviewResearchEditorialVariables): MutationRef<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ReviewResearchEditorialVariables): MutationRef<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;
  operationName: string;
}
export const reviewResearchEditorialRef: ReviewResearchEditorialRef;

export function reviewResearchEditorial(vars: ReviewResearchEditorialVariables): MutationPromise<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;
export function reviewResearchEditorial(dc: DataConnect, vars: ReviewResearchEditorialVariables): MutationPromise<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;

interface CreateContentAssetEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContentAssetEditorialVariables): MutationRef<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateContentAssetEditorialVariables): MutationRef<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;
  operationName: string;
}
export const createContentAssetEditorialRef: CreateContentAssetEditorialRef;

export function createContentAssetEditorial(vars: CreateContentAssetEditorialVariables): MutationPromise<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;
export function createContentAssetEditorial(dc: DataConnect, vars: CreateContentAssetEditorialVariables): MutationPromise<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;

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

interface CreateTeacherCompetitionPeriodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeacherCompetitionPeriodVariables): MutationRef<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTeacherCompetitionPeriodVariables): MutationRef<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;
  operationName: string;
}
export const createTeacherCompetitionPeriodRef: CreateTeacherCompetitionPeriodRef;

export function createTeacherCompetitionPeriod(vars: CreateTeacherCompetitionPeriodVariables): MutationPromise<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;
export function createTeacherCompetitionPeriod(dc: DataConnect, vars: CreateTeacherCompetitionPeriodVariables): MutationPromise<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;

interface UpdateTeacherCompetitionPeriodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeacherCompetitionPeriodVariables): MutationRef<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTeacherCompetitionPeriodVariables): MutationRef<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;
  operationName: string;
}
export const updateTeacherCompetitionPeriodRef: UpdateTeacherCompetitionPeriodRef;

export function updateTeacherCompetitionPeriod(vars: UpdateTeacherCompetitionPeriodVariables): MutationPromise<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;
export function updateTeacherCompetitionPeriod(dc: DataConnect, vars: UpdateTeacherCompetitionPeriodVariables): MutationPromise<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;

interface SetTeacherCompetitionPeriodStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetTeacherCompetitionPeriodStatusVariables): MutationRef<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SetTeacherCompetitionPeriodStatusVariables): MutationRef<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;
  operationName: string;
}
export const setTeacherCompetitionPeriodStatusRef: SetTeacherCompetitionPeriodStatusRef;

export function setTeacherCompetitionPeriodStatus(vars: SetTeacherCompetitionPeriodStatusVariables): MutationPromise<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;
export function setTeacherCompetitionPeriodStatus(dc: DataConnect, vars: SetTeacherCompetitionPeriodStatusVariables): MutationPromise<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;

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

interface ExpireTestRunsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<ExpireTestRunsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<ExpireTestRunsData, undefined>;
  operationName: string;
}
export const expireTestRunsRef: ExpireTestRunsRef;

export function expireTestRuns(): MutationPromise<ExpireTestRunsData, undefined>;
export function expireTestRuns(dc: DataConnect): MutationPromise<ExpireTestRunsData, undefined>;

interface ActivateTeacherTestRunRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ActivateTeacherTestRunVariables): MutationRef<ActivateTeacherTestRunData, ActivateTeacherTestRunVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ActivateTeacherTestRunVariables): MutationRef<ActivateTeacherTestRunData, ActivateTeacherTestRunVariables>;
  operationName: string;
}
export const activateTeacherTestRunRef: ActivateTeacherTestRunRef;

export function activateTeacherTestRun(vars: ActivateTeacherTestRunVariables): MutationPromise<ActivateTeacherTestRunData, ActivateTeacherTestRunVariables>;
export function activateTeacherTestRun(dc: DataConnect, vars: ActivateTeacherTestRunVariables): MutationPromise<ActivateTeacherTestRunData, ActivateTeacherTestRunVariables>;

interface EndTeacherTestRunRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: EndTeacherTestRunVariables): MutationRef<EndTeacherTestRunData, EndTeacherTestRunVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: EndTeacherTestRunVariables): MutationRef<EndTeacherTestRunData, EndTeacherTestRunVariables>;
  operationName: string;
}
export const endTeacherTestRunRef: EndTeacherTestRunRef;

export function endTeacherTestRun(vars: EndTeacherTestRunVariables): MutationPromise<EndTeacherTestRunData, EndTeacherTestRunVariables>;
export function endTeacherTestRun(dc: DataConnect, vars: EndTeacherTestRunVariables): MutationPromise<EndTeacherTestRunData, EndTeacherTestRunVariables>;

interface CleanTeacherTestRunRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CleanTeacherTestRunVariables): MutationRef<CleanTeacherTestRunData, CleanTeacherTestRunVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CleanTeacherTestRunVariables): MutationRef<CleanTeacherTestRunData, CleanTeacherTestRunVariables>;
  operationName: string;
}
export const cleanTeacherTestRunRef: CleanTeacherTestRunRef;

export function cleanTeacherTestRun(vars: CleanTeacherTestRunVariables): MutationPromise<CleanTeacherTestRunData, CleanTeacherTestRunVariables>;
export function cleanTeacherTestRun(dc: DataConnect, vars: CleanTeacherTestRunVariables): MutationPromise<CleanTeacherTestRunData, CleanTeacherTestRunVariables>;

interface CreateTestActivitySessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTestActivitySessionVariables): MutationRef<CreateTestActivitySessionData, CreateTestActivitySessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTestActivitySessionVariables): MutationRef<CreateTestActivitySessionData, CreateTestActivitySessionVariables>;
  operationName: string;
}
export const createTestActivitySessionRef: CreateTestActivitySessionRef;

export function createTestActivitySession(vars: CreateTestActivitySessionVariables): MutationPromise<CreateTestActivitySessionData, CreateTestActivitySessionVariables>;
export function createTestActivitySession(dc: DataConnect, vars: CreateTestActivitySessionVariables): MutationPromise<CreateTestActivitySessionData, CreateTestActivitySessionVariables>;

interface RecordTestActivityAttemptRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordTestActivityAttemptVariables): MutationRef<RecordTestActivityAttemptData, RecordTestActivityAttemptVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordTestActivityAttemptVariables): MutationRef<RecordTestActivityAttemptData, RecordTestActivityAttemptVariables>;
  operationName: string;
}
export const recordTestActivityAttemptRef: RecordTestActivityAttemptRef;

export function recordTestActivityAttempt(vars: RecordTestActivityAttemptVariables): MutationPromise<RecordTestActivityAttemptData, RecordTestActivityAttemptVariables>;
export function recordTestActivityAttempt(dc: DataConnect, vars: RecordTestActivityAttemptVariables): MutationPromise<RecordTestActivityAttemptData, RecordTestActivityAttemptVariables>;

interface UpdateAuthoritativeActivitySessionStateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAuthoritativeActivitySessionStateVariables): MutationRef<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAuthoritativeActivitySessionStateVariables): MutationRef<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;
  operationName: string;
}
export const updateAuthoritativeActivitySessionStateRef: UpdateAuthoritativeActivitySessionStateRef;

export function updateAuthoritativeActivitySessionState(vars: UpdateAuthoritativeActivitySessionStateVariables): MutationPromise<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;
export function updateAuthoritativeActivitySessionState(dc: DataConnect, vars: UpdateAuthoritativeActivitySessionStateVariables): MutationPromise<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;

interface ImportPedagogicalBankRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ImportPedagogicalBankVariables): MutationRef<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ImportPedagogicalBankVariables): MutationRef<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;
  operationName: string;
}
export const importPedagogicalBankRef: ImportPedagogicalBankRef;

export function importPedagogicalBank(vars: ImportPedagogicalBankVariables): MutationPromise<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;
export function importPedagogicalBank(dc: DataConnect, vars: ImportPedagogicalBankVariables): MutationPromise<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;

interface BindPilotClassRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BindPilotClassVariables): MutationRef<BindPilotClassData, BindPilotClassVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BindPilotClassVariables): MutationRef<BindPilotClassData, BindPilotClassVariables>;
  operationName: string;
}
export const bindPilotClassRef: BindPilotClassRef;

export function bindPilotClass(vars: BindPilotClassVariables): MutationPromise<BindPilotClassData, BindPilotClassVariables>;
export function bindPilotClass(dc: DataConnect, vars: BindPilotClassVariables): MutationPromise<BindPilotClassData, BindPilotClassVariables>;

interface UpsertPilotCompetitionPeriodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPilotCompetitionPeriodVariables): MutationRef<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPilotCompetitionPeriodVariables): MutationRef<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;
  operationName: string;
}
export const upsertPilotCompetitionPeriodRef: UpsertPilotCompetitionPeriodRef;

export function upsertPilotCompetitionPeriod(vars: UpsertPilotCompetitionPeriodVariables): MutationPromise<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;
export function upsertPilotCompetitionPeriod(dc: DataConnect, vars: UpsertPilotCompetitionPeriodVariables): MutationPromise<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;

interface SeedLoadTestStudentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SeedLoadTestStudentsVariables): MutationRef<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SeedLoadTestStudentsVariables): MutationRef<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;
  operationName: string;
}
export const seedLoadTestStudentsRef: SeedLoadTestStudentsRef;

export function seedLoadTestStudents(vars: SeedLoadTestStudentsVariables): MutationPromise<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;
export function seedLoadTestStudents(dc: DataConnect, vars: SeedLoadTestStudentsVariables): MutationPromise<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;

interface RecordLoadTestMetricsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordLoadTestMetricsVariables): MutationRef<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RecordLoadTestMetricsVariables): MutationRef<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;
  operationName: string;
}
export const recordLoadTestMetricsRef: RecordLoadTestMetricsRef;

export function recordLoadTestMetrics(vars: RecordLoadTestMetricsVariables): MutationPromise<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;
export function recordLoadTestMetrics(dc: DataConnect, vars: RecordLoadTestMetricsVariables): MutationPromise<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;

interface CleanupMarkedLoadTestStudentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CleanupMarkedLoadTestStudentsVariables): MutationRef<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CleanupMarkedLoadTestStudentsVariables): MutationRef<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;
  operationName: string;
}
export const cleanupMarkedLoadTestStudentsRef: CleanupMarkedLoadTestStudentsRef;

export function cleanupMarkedLoadTestStudents(vars: CleanupMarkedLoadTestStudentsVariables): MutationPromise<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;
export function cleanupMarkedLoadTestStudents(dc: DataConnect, vars: CleanupMarkedLoadTestStudentsVariables): MutationPromise<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;

interface FinalizeLoadTestCleanupRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: FinalizeLoadTestCleanupVariables): MutationRef<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: FinalizeLoadTestCleanupVariables): MutationRef<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;
  operationName: string;
}
export const finalizeLoadTestCleanupRef: FinalizeLoadTestCleanupRef;

export function finalizeLoadTestCleanup(vars: FinalizeLoadTestCleanupVariables): MutationPromise<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;
export function finalizeLoadTestCleanup(dc: DataConnect, vars: FinalizeLoadTestCleanupVariables): MutationPromise<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;

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

interface GetEditorialSeedStateRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetEditorialSeedStateData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetEditorialSeedStateData, undefined>;
  operationName: string;
}
export const getEditorialSeedStateRef: GetEditorialSeedStateRef;

export function getEditorialSeedState(options?: ExecuteQueryOptions): QueryPromise<GetEditorialSeedStateData, undefined>;
export function getEditorialSeedState(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetEditorialSeedStateData, undefined>;

interface ListEditorialStudioDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEditorialStudioDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEditorialStudioDataData, undefined>;
  operationName: string;
}
export const listEditorialStudioDataRef: ListEditorialStudioDataRef;

export function listEditorialStudioData(options?: ExecuteQueryOptions): QueryPromise<ListEditorialStudioDataData, undefined>;
export function listEditorialStudioData(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEditorialStudioDataData, undefined>;

interface GetLearningModuleVersionForEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLearningModuleVersionForEditorialVariables): QueryRef<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLearningModuleVersionForEditorialVariables): QueryRef<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;
  operationName: string;
}
export const getLearningModuleVersionForEditorialRef: GetLearningModuleVersionForEditorialRef;

export function getLearningModuleVersionForEditorial(vars: GetLearningModuleVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;
export function getLearningModuleVersionForEditorial(dc: DataConnect, vars: GetLearningModuleVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;

interface GetActivityDefinitionVersionForEditorialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivityDefinitionVersionForEditorialVariables): QueryRef<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActivityDefinitionVersionForEditorialVariables): QueryRef<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;
  operationName: string;
}
export const getActivityDefinitionVersionForEditorialRef: GetActivityDefinitionVersionForEditorialRef;

export function getActivityDefinitionVersionForEditorial(vars: GetActivityDefinitionVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;
export function getActivityDefinitionVersionForEditorial(dc: DataConnect, vars: GetActivityDefinitionVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;

interface GetPublishedLearningModuleForStudentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedLearningModuleForStudentVariables): QueryRef<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPublishedLearningModuleForStudentVariables): QueryRef<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;
  operationName: string;
}
export const getPublishedLearningModuleForStudentRef: GetPublishedLearningModuleForStudentRef;

export function getPublishedLearningModuleForStudent(vars: GetPublishedLearningModuleForStudentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;
export function getPublishedLearningModuleForStudent(dc: DataConnect, vars: GetPublishedLearningModuleForStudentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;

interface GetPublishedActivityDefinitionForSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedActivityDefinitionForSessionVariables): QueryRef<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPublishedActivityDefinitionForSessionVariables): QueryRef<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;
  operationName: string;
}
export const getPublishedActivityDefinitionForSessionRef: GetPublishedActivityDefinitionForSessionRef;

export function getPublishedActivityDefinitionForSession(vars: GetPublishedActivityDefinitionForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;
export function getPublishedActivityDefinitionForSession(dc: DataConnect, vars: GetPublishedActivityDefinitionForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;

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

interface ListTeacherCompetitionPeriodsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListTeacherCompetitionPeriodsVariables): QueryRef<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListTeacherCompetitionPeriodsVariables): QueryRef<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;
  operationName: string;
}
export const listTeacherCompetitionPeriodsRef: ListTeacherCompetitionPeriodsRef;

export function listTeacherCompetitionPeriods(vars?: ListTeacherCompetitionPeriodsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;
export function listTeacherCompetitionPeriods(dc: DataConnect, vars?: ListTeacherCompetitionPeriodsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;

interface GetTeacherDashboardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTeacherDashboardVariables): QueryRef<GetTeacherDashboardData, GetTeacherDashboardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTeacherDashboardVariables): QueryRef<GetTeacherDashboardData, GetTeacherDashboardVariables>;
  operationName: string;
}
export const getTeacherDashboardRef: GetTeacherDashboardRef;

export function getTeacherDashboard(vars: GetTeacherDashboardVariables, options?: ExecuteQueryOptions): QueryPromise<GetTeacherDashboardData, GetTeacherDashboardVariables>;
export function getTeacherDashboard(dc: DataConnect, vars: GetTeacherDashboardVariables, options?: ExecuteQueryOptions): QueryPromise<GetTeacherDashboardData, GetTeacherDashboardVariables>;

interface GetPedagogicalBankStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPedagogicalBankStatusData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPedagogicalBankStatusData, undefined>;
  operationName: string;
}
export const getPedagogicalBankStatusRef: GetPedagogicalBankStatusRef;

export function getPedagogicalBankStatus(options?: ExecuteQueryOptions): QueryPromise<GetPedagogicalBankStatusData, undefined>;
export function getPedagogicalBankStatus(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetPedagogicalBankStatusData, undefined>;

interface ListActivePedagogicalItemsForActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivePedagogicalItemsForActivityVariables): QueryRef<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListActivePedagogicalItemsForActivityVariables): QueryRef<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;
  operationName: string;
}
export const listActivePedagogicalItemsForActivityRef: ListActivePedagogicalItemsForActivityRef;

export function listActivePedagogicalItemsForActivity(vars: ListActivePedagogicalItemsForActivityVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;
export function listActivePedagogicalItemsForActivity(dc: DataConnect, vars: ListActivePedagogicalItemsForActivityVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;

interface ListStudentSeenPedagogicalItemIdsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStudentSeenPedagogicalItemIdsVariables): QueryRef<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListStudentSeenPedagogicalItemIdsVariables): QueryRef<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;
  operationName: string;
}
export const listStudentSeenPedagogicalItemIdsRef: ListStudentSeenPedagogicalItemIdsRef;

export function listStudentSeenPedagogicalItemIds(vars: ListStudentSeenPedagogicalItemIdsVariables, options?: ExecuteQueryOptions): QueryPromise<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;
export function listStudentSeenPedagogicalItemIds(dc: DataConnect, vars: ListStudentSeenPedagogicalItemIdsVariables, options?: ExecuteQueryOptions): QueryPromise<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;

interface GetPilotClassBindingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPilotClassBindingVariables): QueryRef<GetPilotClassBindingData, GetPilotClassBindingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPilotClassBindingVariables): QueryRef<GetPilotClassBindingData, GetPilotClassBindingVariables>;
  operationName: string;
}
export const getPilotClassBindingRef: GetPilotClassBindingRef;

export function getPilotClassBinding(vars: GetPilotClassBindingVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotClassBindingData, GetPilotClassBindingVariables>;
export function getPilotClassBinding(dc: DataConnect, vars: GetPilotClassBindingVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotClassBindingData, GetPilotClassBindingVariables>;

interface ResolveCompetitionPeriodByKeyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResolveCompetitionPeriodByKeyVariables): QueryRef<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ResolveCompetitionPeriodByKeyVariables): QueryRef<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;
  operationName: string;
}
export const resolveCompetitionPeriodByKeyRef: ResolveCompetitionPeriodByKeyRef;

export function resolveCompetitionPeriodByKey(vars: ResolveCompetitionPeriodByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;
export function resolveCompetitionPeriodByKey(dc: DataConnect, vars: ResolveCompetitionPeriodByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;

interface GetActiveTestRunForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveTestRunForUserVariables): QueryRef<GetActiveTestRunForUserData, GetActiveTestRunForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveTestRunForUserVariables): QueryRef<GetActiveTestRunForUserData, GetActiveTestRunForUserVariables>;
  operationName: string;
}
export const getActiveTestRunForUserRef: GetActiveTestRunForUserRef;

export function getActiveTestRunForUser(vars: GetActiveTestRunForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveTestRunForUserData, GetActiveTestRunForUserVariables>;
export function getActiveTestRunForUser(dc: DataConnect, vars: GetActiveTestRunForUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetActiveTestRunForUserData, GetActiveTestRunForUserVariables>;

interface GetTeacherTestRunRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTeacherTestRunVariables): QueryRef<GetTeacherTestRunData, GetTeacherTestRunVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTeacherTestRunVariables): QueryRef<GetTeacherTestRunData, GetTeacherTestRunVariables>;
  operationName: string;
}
export const getTeacherTestRunRef: GetTeacherTestRunRef;

export function getTeacherTestRun(vars: GetTeacherTestRunVariables, options?: ExecuteQueryOptions): QueryPromise<GetTeacherTestRunData, GetTeacherTestRunVariables>;
export function getTeacherTestRun(dc: DataConnect, vars: GetTeacherTestRunVariables, options?: ExecuteQueryOptions): QueryPromise<GetTeacherTestRunData, GetTeacherTestRunVariables>;

interface GetPilotExportRowsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPilotExportRowsVariables): QueryRef<GetPilotExportRowsData, GetPilotExportRowsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPilotExportRowsVariables): QueryRef<GetPilotExportRowsData, GetPilotExportRowsVariables>;
  operationName: string;
}
export const getPilotExportRowsRef: GetPilotExportRowsRef;

export function getPilotExportRows(vars: GetPilotExportRowsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotExportRowsData, GetPilotExportRowsVariables>;
export function getPilotExportRows(dc: DataConnect, vars: GetPilotExportRowsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotExportRowsData, GetPilotExportRowsVariables>;

interface GetLoadTestCleanupStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLoadTestCleanupStatusVariables): QueryRef<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLoadTestCleanupStatusVariables): QueryRef<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;
  operationName: string;
}
export const getLoadTestCleanupStatusRef: GetLoadTestCleanupStatusRef;

export function getLoadTestCleanupStatus(vars: GetLoadTestCleanupStatusVariables, options?: ExecuteQueryOptions): QueryPromise<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;
export function getLoadTestCleanupStatus(dc: DataConnect, vars: GetLoadTestCleanupStatusVariables, options?: ExecuteQueryOptions): QueryPromise<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;

