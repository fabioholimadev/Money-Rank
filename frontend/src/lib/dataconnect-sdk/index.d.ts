import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum CapiCoinTransactionType {
  CONTENT_REWARD = "CONTENT_REWARD",
  ACTIVITY_REWARD = "ACTIVITY_REWARD",
  STREAK_BONUS = "STREAK_BONUS",
  PURCHASE = "PURCHASE",
  ADMIN_ADJUSTMENT = "ADMIN_ADJUSTMENT",
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

export enum StudentClass {
  THIRD_DSA = "THIRD_DSA",
  THIRD_DSB = "THIRD_DSB",
};

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
};



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
  phaseNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface CompleteMyIntroductionData {
  affectedRows?: number | null;
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

export interface ListMyCapiCoinTransactionsData {
  capiCoinTransactions: ({
    id: UUIDString;
    amount: number;
    transactionType: CapiCoinTransactionType;
    reason: string;
    sourceId?: string | null;
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

export interface RegisterMyCurrentPhaseAttemptData {
  affectedRows?: number | null;
}

export interface RegisterMyCurrentPhaseAttemptVariables {
  phaseNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface StudentProgress_Key {
  userUid: string;
  phaseNumber: number;
  __typename?: 'StudentProgress_Key';
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

