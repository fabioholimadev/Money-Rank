# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `money-rank-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyProfile*](#getmyprofile)
  - [*GetEditorialSeedState*](#geteditorialseedstate)
  - [*ListEditorialStudioData*](#listeditorialstudiodata)
  - [*GetLearningModuleVersionForEditorial*](#getlearningmoduleversionforeditorial)
  - [*GetActivityDefinitionVersionForEditorial*](#getactivitydefinitionversionforeditorial)
  - [*GetPublishedLearningModuleForStudent*](#getpublishedlearningmoduleforstudent)
  - [*GetPublishedActivityDefinitionForSession*](#getpublishedactivitydefinitionforsession)
  - [*ListMyProgress*](#listmyprogress)
  - [*ListMyCapiCoinTransactions*](#listmycapicointransactions)
  - [*GetMyCapiCoinTransactionBySource*](#getmycapicointransactionbysource)
  - [*GetMyActivityAttempt*](#getmyactivityattempt)
  - [*GetAuthoritativeActivitySession*](#getauthoritativeactivitysession)
  - [*GetAuthoritativeActivityResult*](#getauthoritativeactivityresult)
  - [*ListMyActivityAttempts*](#listmyactivityattempts)
  - [*GetEconomyConfig*](#geteconomyconfig)
  - [*ListVisibleCompetitionPeriods*](#listvisiblecompetitionperiods)
  - [*GetCompetitionRankings*](#getcompetitionrankings)
  - [*GetCompetitionAbuseSignals*](#getcompetitionabusesignals)
  - [*ListTeacherCompetitionPeriods*](#listteachercompetitionperiods)
  - [*GetTeacherDashboard*](#getteacherdashboard)
  - [*GetPedagogicalBankStatus*](#getpedagogicalbankstatus)
  - [*ListActivePedagogicalItemsForActivity*](#listactivepedagogicalitemsforactivity)
  - [*ListStudentSeenPedagogicalItemIds*](#liststudentseenpedagogicalitemids)
  - [*GetPilotClassBinding*](#getpilotclassbinding)
  - [*ResolveCompetitionPeriodByKey*](#resolvecompetitionperiodbykey)
  - [*GetPilotExportRows*](#getpilotexportrows)
  - [*GetLoadTestCleanupStatus*](#getloadtestcleanupstatus)
- [**Mutations**](#mutations)
  - [*UpsertMyProfileWithAvatar*](#upsertmyprofilewithavatar)
  - [*CreateLearningModuleVersionEditorial*](#createlearningmoduleversioneditorial)
  - [*CreateActivityDefinitionVersionEditorial*](#createactivitydefinitionversioneditorial)
  - [*UpsertLearningModuleSeed*](#upsertlearningmoduleseed)
  - [*UpsertActivityDefinitionSeed*](#upsertactivitydefinitionseed)
  - [*UpdateLearningModuleDraftEditorial*](#updatelearningmoduledrafteditorial)
  - [*UpdateActivityDefinitionDraftEditorial*](#updateactivitydefinitiondrafteditorial)
  - [*SubmitLearningModuleForReviewEditorial*](#submitlearningmoduleforrevieweditorial)
  - [*SubmitActivityDefinitionForReviewEditorial*](#submitactivitydefinitionforrevieweditorial)
  - [*PublishLearningModuleVersionEditorial*](#publishlearningmoduleversioneditorial)
  - [*PublishActivityDefinitionVersionEditorial*](#publishactivitydefinitionversioneditorial)
  - [*CreateResearchReviewEditorial*](#createresearchrevieweditorial)
  - [*ReviewResearchEditorial*](#reviewresearcheditorial)
  - [*CreateContentAssetEditorial*](#createcontentasseteditorial)
  - [*UpsertMyProfileWithPhoto*](#upsertmyprofilewithphoto)
  - [*UpsertMyProfileWithoutSyncedPhoto*](#upsertmyprofilewithoutsyncedphoto)
  - [*SetUserRoleByEmail*](#setuserrolebyemail)
  - [*UpsertStudentProgress*](#upsertstudentprogress)
  - [*ApplyCapiCoinTransaction*](#applycapicointransaction)
  - [*UpsertEconomyConfig*](#upserteconomyconfig)
  - [*CreateCompetitionPeriod*](#createcompetitionperiod)
  - [*UpdateCompetitionPeriodStatus*](#updatecompetitionperiodstatus)
  - [*CreateTeacherCompetitionPeriod*](#createteachercompetitionperiod)
  - [*UpdateTeacherCompetitionPeriod*](#updateteachercompetitionperiod)
  - [*SetTeacherCompetitionPeriodStatus*](#setteachercompetitionperiodstatus)
  - [*CreateAuthoritativeActivitySession*](#createauthoritativeactivitysession)
  - [*MarkAuthoritativeActivitySessionSubmitted*](#markauthoritativeactivitysessionsubmitted)
  - [*InitializeMyTrail*](#initializemytrail)
  - [*CompleteMyIntroduction*](#completemyintroduction)
  - [*CompleteMyCurrentPhaseContent*](#completemycurrentphasecontent)
  - [*RegisterMyCurrentPhaseAttempt*](#registermycurrentphaseattempt)
  - [*CompleteMyCurrentPhase*](#completemycurrentphase)
  - [*UpdateAuthoritativeActivitySessionState*](#updateauthoritativeactivitysessionstate)
  - [*ImportPedagogicalBank*](#importpedagogicalbank)
  - [*BindPilotClass*](#bindpilotclass)
  - [*UpsertPilotCompetitionPeriod*](#upsertpilotcompetitionperiod)
  - [*SeedLoadTestStudents*](#seedloadteststudents)
  - [*RecordLoadTestMetrics*](#recordloadtestmetrics)
  - [*CleanupMarkedLoadTestStudents*](#cleanupmarkedloadteststudents)
  - [*FinalizeLoadTestCleanup*](#finalizeloadtestcleanup)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `money-rank-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@money-rank/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@money-rank/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@money-rank/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `money-rank-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@money-rank/dataconnect';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@money-rank/dataconnect';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetEditorialSeedState
You can execute the `GetEditorialSeedState` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getEditorialSeedState(options?: ExecuteQueryOptions): QueryPromise<GetEditorialSeedStateData, undefined>;

interface GetEditorialSeedStateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetEditorialSeedStateData, undefined>;
}
export const getEditorialSeedStateRef: GetEditorialSeedStateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEditorialSeedState(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetEditorialSeedStateData, undefined>;

interface GetEditorialSeedStateRef {
  ...
  (dc: DataConnect): QueryRef<GetEditorialSeedStateData, undefined>;
}
export const getEditorialSeedStateRef: GetEditorialSeedStateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEditorialSeedStateRef:
```typescript
const name = getEditorialSeedStateRef.operationName;
console.log(name);
```

### Variables
The `GetEditorialSeedState` query has no variables.
### Return Type
Recall that executing the `GetEditorialSeedState` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEditorialSeedStateData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEditorialSeedStateData {
  learningModules: ({
    moduleKey: string;
  })[];
  activities: ({
    activityKey: string;
  })[];
}
```
### Using `GetEditorialSeedState`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEditorialSeedState } from '@money-rank/dataconnect';


// Call the `getEditorialSeedState()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEditorialSeedState();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEditorialSeedState(dataConnect);

console.log(data.learningModules);
console.log(data.activities);

// Or, you can use the `Promise` API.
getEditorialSeedState().then((response) => {
  const data = response.data;
  console.log(data.learningModules);
  console.log(data.activities);
});
```

### Using `GetEditorialSeedState`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEditorialSeedStateRef } from '@money-rank/dataconnect';


// Call the `getEditorialSeedStateRef()` function to get a reference to the query.
const ref = getEditorialSeedStateRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEditorialSeedStateRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.learningModules);
console.log(data.activities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModules);
  console.log(data.activities);
});
```

## ListEditorialStudioData
You can execute the `ListEditorialStudioData` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listEditorialStudioData(options?: ExecuteQueryOptions): QueryPromise<ListEditorialStudioDataData, undefined>;

interface ListEditorialStudioDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEditorialStudioDataData, undefined>;
}
export const listEditorialStudioDataRef: ListEditorialStudioDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEditorialStudioData(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEditorialStudioDataData, undefined>;

interface ListEditorialStudioDataRef {
  ...
  (dc: DataConnect): QueryRef<ListEditorialStudioDataData, undefined>;
}
export const listEditorialStudioDataRef: ListEditorialStudioDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEditorialStudioDataRef:
```typescript
const name = listEditorialStudioDataRef.operationName;
console.log(name);
```

### Variables
The `ListEditorialStudioData` query has no variables.
### Return Type
Recall that executing the `ListEditorialStudioData` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEditorialStudioDataData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListEditorialStudioData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEditorialStudioData } from '@money-rank/dataconnect';


// Call the `listEditorialStudioData()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEditorialStudioData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEditorialStudioData(dataConnect);

console.log(data.learningModules);
console.log(data.activities);
console.log(data.research);
console.log(data.assets);
console.log(data.audit);

// Or, you can use the `Promise` API.
listEditorialStudioData().then((response) => {
  const data = response.data;
  console.log(data.learningModules);
  console.log(data.activities);
  console.log(data.research);
  console.log(data.assets);
  console.log(data.audit);
});
```

### Using `ListEditorialStudioData`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEditorialStudioDataRef } from '@money-rank/dataconnect';


// Call the `listEditorialStudioDataRef()` function to get a reference to the query.
const ref = listEditorialStudioDataRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEditorialStudioDataRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.learningModules);
console.log(data.activities);
console.log(data.research);
console.log(data.assets);
console.log(data.audit);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModules);
  console.log(data.activities);
  console.log(data.research);
  console.log(data.assets);
  console.log(data.audit);
});
```

## GetLearningModuleVersionForEditorial
You can execute the `GetLearningModuleVersionForEditorial` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getLearningModuleVersionForEditorial(vars: GetLearningModuleVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;

interface GetLearningModuleVersionForEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLearningModuleVersionForEditorialVariables): QueryRef<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;
}
export const getLearningModuleVersionForEditorialRef: GetLearningModuleVersionForEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLearningModuleVersionForEditorial(dc: DataConnect, vars: GetLearningModuleVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;

interface GetLearningModuleVersionForEditorialRef {
  ...
  (dc: DataConnect, vars: GetLearningModuleVersionForEditorialVariables): QueryRef<GetLearningModuleVersionForEditorialData, GetLearningModuleVersionForEditorialVariables>;
}
export const getLearningModuleVersionForEditorialRef: GetLearningModuleVersionForEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLearningModuleVersionForEditorialRef:
```typescript
const name = getLearningModuleVersionForEditorialRef.operationName;
console.log(name);
```

### Variables
The `GetLearningModuleVersionForEditorial` query requires an argument of type `GetLearningModuleVersionForEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLearningModuleVersionForEditorialVariables {
  versionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetLearningModuleVersionForEditorial` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLearningModuleVersionForEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLearningModuleVersionForEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLearningModuleVersionForEditorial, GetLearningModuleVersionForEditorialVariables } from '@money-rank/dataconnect';

// The `GetLearningModuleVersionForEditorial` query requires an argument of type `GetLearningModuleVersionForEditorialVariables`:
const getLearningModuleVersionForEditorialVars: GetLearningModuleVersionForEditorialVariables = {
  versionId: ..., 
};

// Call the `getLearningModuleVersionForEditorial()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLearningModuleVersionForEditorial(getLearningModuleVersionForEditorialVars);
// Variables can be defined inline as well.
const { data } = await getLearningModuleVersionForEditorial({ versionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLearningModuleVersionForEditorial(dataConnect, getLearningModuleVersionForEditorialVars);

console.log(data.learningModuleVersion);

// Or, you can use the `Promise` API.
getLearningModuleVersionForEditorial(getLearningModuleVersionForEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersion);
});
```

### Using `GetLearningModuleVersionForEditorial`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLearningModuleVersionForEditorialRef, GetLearningModuleVersionForEditorialVariables } from '@money-rank/dataconnect';

// The `GetLearningModuleVersionForEditorial` query requires an argument of type `GetLearningModuleVersionForEditorialVariables`:
const getLearningModuleVersionForEditorialVars: GetLearningModuleVersionForEditorialVariables = {
  versionId: ..., 
};

// Call the `getLearningModuleVersionForEditorialRef()` function to get a reference to the query.
const ref = getLearningModuleVersionForEditorialRef(getLearningModuleVersionForEditorialVars);
// Variables can be defined inline as well.
const ref = getLearningModuleVersionForEditorialRef({ versionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLearningModuleVersionForEditorialRef(dataConnect, getLearningModuleVersionForEditorialVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.learningModuleVersion);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersion);
});
```

## GetActivityDefinitionVersionForEditorial
You can execute the `GetActivityDefinitionVersionForEditorial` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getActivityDefinitionVersionForEditorial(vars: GetActivityDefinitionVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;

interface GetActivityDefinitionVersionForEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivityDefinitionVersionForEditorialVariables): QueryRef<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;
}
export const getActivityDefinitionVersionForEditorialRef: GetActivityDefinitionVersionForEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActivityDefinitionVersionForEditorial(dc: DataConnect, vars: GetActivityDefinitionVersionForEditorialVariables, options?: ExecuteQueryOptions): QueryPromise<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;

interface GetActivityDefinitionVersionForEditorialRef {
  ...
  (dc: DataConnect, vars: GetActivityDefinitionVersionForEditorialVariables): QueryRef<GetActivityDefinitionVersionForEditorialData, GetActivityDefinitionVersionForEditorialVariables>;
}
export const getActivityDefinitionVersionForEditorialRef: GetActivityDefinitionVersionForEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActivityDefinitionVersionForEditorialRef:
```typescript
const name = getActivityDefinitionVersionForEditorialRef.operationName;
console.log(name);
```

### Variables
The `GetActivityDefinitionVersionForEditorial` query requires an argument of type `GetActivityDefinitionVersionForEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActivityDefinitionVersionForEditorialVariables {
  versionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetActivityDefinitionVersionForEditorial` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActivityDefinitionVersionForEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetActivityDefinitionVersionForEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActivityDefinitionVersionForEditorial, GetActivityDefinitionVersionForEditorialVariables } from '@money-rank/dataconnect';

// The `GetActivityDefinitionVersionForEditorial` query requires an argument of type `GetActivityDefinitionVersionForEditorialVariables`:
const getActivityDefinitionVersionForEditorialVars: GetActivityDefinitionVersionForEditorialVariables = {
  versionId: ..., 
};

// Call the `getActivityDefinitionVersionForEditorial()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActivityDefinitionVersionForEditorial(getActivityDefinitionVersionForEditorialVars);
// Variables can be defined inline as well.
const { data } = await getActivityDefinitionVersionForEditorial({ versionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActivityDefinitionVersionForEditorial(dataConnect, getActivityDefinitionVersionForEditorialVars);

console.log(data.activityDefinitionVersion);

// Or, you can use the `Promise` API.
getActivityDefinitionVersionForEditorial(getActivityDefinitionVersionForEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersion);
});
```

### Using `GetActivityDefinitionVersionForEditorial`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActivityDefinitionVersionForEditorialRef, GetActivityDefinitionVersionForEditorialVariables } from '@money-rank/dataconnect';

// The `GetActivityDefinitionVersionForEditorial` query requires an argument of type `GetActivityDefinitionVersionForEditorialVariables`:
const getActivityDefinitionVersionForEditorialVars: GetActivityDefinitionVersionForEditorialVariables = {
  versionId: ..., 
};

// Call the `getActivityDefinitionVersionForEditorialRef()` function to get a reference to the query.
const ref = getActivityDefinitionVersionForEditorialRef(getActivityDefinitionVersionForEditorialVars);
// Variables can be defined inline as well.
const ref = getActivityDefinitionVersionForEditorialRef({ versionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActivityDefinitionVersionForEditorialRef(dataConnect, getActivityDefinitionVersionForEditorialVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityDefinitionVersion);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersion);
});
```

## GetPublishedLearningModuleForStudent
You can execute the `GetPublishedLearningModuleForStudent` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getPublishedLearningModuleForStudent(vars: GetPublishedLearningModuleForStudentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;

interface GetPublishedLearningModuleForStudentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedLearningModuleForStudentVariables): QueryRef<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;
}
export const getPublishedLearningModuleForStudentRef: GetPublishedLearningModuleForStudentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublishedLearningModuleForStudent(dc: DataConnect, vars: GetPublishedLearningModuleForStudentVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;

interface GetPublishedLearningModuleForStudentRef {
  ...
  (dc: DataConnect, vars: GetPublishedLearningModuleForStudentVariables): QueryRef<GetPublishedLearningModuleForStudentData, GetPublishedLearningModuleForStudentVariables>;
}
export const getPublishedLearningModuleForStudentRef: GetPublishedLearningModuleForStudentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublishedLearningModuleForStudentRef:
```typescript
const name = getPublishedLearningModuleForStudentRef.operationName;
console.log(name);
```

### Variables
The `GetPublishedLearningModuleForStudent` query requires an argument of type `GetPublishedLearningModuleForStudentVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPublishedLearningModuleForStudentVariables {
  moduleKey: string;
}
```
### Return Type
Recall that executing the `GetPublishedLearningModuleForStudent` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublishedLearningModuleForStudentData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPublishedLearningModuleForStudent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublishedLearningModuleForStudent, GetPublishedLearningModuleForStudentVariables } from '@money-rank/dataconnect';

// The `GetPublishedLearningModuleForStudent` query requires an argument of type `GetPublishedLearningModuleForStudentVariables`:
const getPublishedLearningModuleForStudentVars: GetPublishedLearningModuleForStudentVariables = {
  moduleKey: ..., 
};

// Call the `getPublishedLearningModuleForStudent()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublishedLearningModuleForStudent(getPublishedLearningModuleForStudentVars);
// Variables can be defined inline as well.
const { data } = await getPublishedLearningModuleForStudent({ moduleKey: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublishedLearningModuleForStudent(dataConnect, getPublishedLearningModuleForStudentVars);

console.log(data.learningModuleVersions);

// Or, you can use the `Promise` API.
getPublishedLearningModuleForStudent(getPublishedLearningModuleForStudentVars).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersions);
});
```

### Using `GetPublishedLearningModuleForStudent`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublishedLearningModuleForStudentRef, GetPublishedLearningModuleForStudentVariables } from '@money-rank/dataconnect';

// The `GetPublishedLearningModuleForStudent` query requires an argument of type `GetPublishedLearningModuleForStudentVariables`:
const getPublishedLearningModuleForStudentVars: GetPublishedLearningModuleForStudentVariables = {
  moduleKey: ..., 
};

// Call the `getPublishedLearningModuleForStudentRef()` function to get a reference to the query.
const ref = getPublishedLearningModuleForStudentRef(getPublishedLearningModuleForStudentVars);
// Variables can be defined inline as well.
const ref = getPublishedLearningModuleForStudentRef({ moduleKey: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublishedLearningModuleForStudentRef(dataConnect, getPublishedLearningModuleForStudentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.learningModuleVersions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersions);
});
```

## GetPublishedActivityDefinitionForSession
You can execute the `GetPublishedActivityDefinitionForSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getPublishedActivityDefinitionForSession(vars: GetPublishedActivityDefinitionForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;

interface GetPublishedActivityDefinitionForSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedActivityDefinitionForSessionVariables): QueryRef<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;
}
export const getPublishedActivityDefinitionForSessionRef: GetPublishedActivityDefinitionForSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublishedActivityDefinitionForSession(dc: DataConnect, vars: GetPublishedActivityDefinitionForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;

interface GetPublishedActivityDefinitionForSessionRef {
  ...
  (dc: DataConnect, vars: GetPublishedActivityDefinitionForSessionVariables): QueryRef<GetPublishedActivityDefinitionForSessionData, GetPublishedActivityDefinitionForSessionVariables>;
}
export const getPublishedActivityDefinitionForSessionRef: GetPublishedActivityDefinitionForSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublishedActivityDefinitionForSessionRef:
```typescript
const name = getPublishedActivityDefinitionForSessionRef.operationName;
console.log(name);
```

### Variables
The `GetPublishedActivityDefinitionForSession` query requires an argument of type `GetPublishedActivityDefinitionForSessionVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPublishedActivityDefinitionForSessionVariables {
  activityKey: string;
}
```
### Return Type
Recall that executing the `GetPublishedActivityDefinitionForSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublishedActivityDefinitionForSessionData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPublishedActivityDefinitionForSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublishedActivityDefinitionForSession, GetPublishedActivityDefinitionForSessionVariables } from '@money-rank/dataconnect';

// The `GetPublishedActivityDefinitionForSession` query requires an argument of type `GetPublishedActivityDefinitionForSessionVariables`:
const getPublishedActivityDefinitionForSessionVars: GetPublishedActivityDefinitionForSessionVariables = {
  activityKey: ..., 
};

// Call the `getPublishedActivityDefinitionForSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublishedActivityDefinitionForSession(getPublishedActivityDefinitionForSessionVars);
// Variables can be defined inline as well.
const { data } = await getPublishedActivityDefinitionForSession({ activityKey: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublishedActivityDefinitionForSession(dataConnect, getPublishedActivityDefinitionForSessionVars);

console.log(data.activityDefinitionVersions);

// Or, you can use the `Promise` API.
getPublishedActivityDefinitionForSession(getPublishedActivityDefinitionForSessionVars).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersions);
});
```

### Using `GetPublishedActivityDefinitionForSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublishedActivityDefinitionForSessionRef, GetPublishedActivityDefinitionForSessionVariables } from '@money-rank/dataconnect';

// The `GetPublishedActivityDefinitionForSession` query requires an argument of type `GetPublishedActivityDefinitionForSessionVariables`:
const getPublishedActivityDefinitionForSessionVars: GetPublishedActivityDefinitionForSessionVariables = {
  activityKey: ..., 
};

// Call the `getPublishedActivityDefinitionForSessionRef()` function to get a reference to the query.
const ref = getPublishedActivityDefinitionForSessionRef(getPublishedActivityDefinitionForSessionVars);
// Variables can be defined inline as well.
const ref = getPublishedActivityDefinitionForSessionRef({ activityKey: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublishedActivityDefinitionForSessionRef(dataConnect, getPublishedActivityDefinitionForSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityDefinitionVersions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersions);
});
```

## ListMyProgress
You can execute the `ListMyProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyProgress(options?: ExecuteQueryOptions): QueryPromise<ListMyProgressData, undefined>;

interface ListMyProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyProgressData, undefined>;
}
export const listMyProgressRef: ListMyProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyProgress(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyProgressData, undefined>;

interface ListMyProgressRef {
  ...
  (dc: DataConnect): QueryRef<ListMyProgressData, undefined>;
}
export const listMyProgressRef: ListMyProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyProgressRef:
```typescript
const name = listMyProgressRef.operationName;
console.log(name);
```

### Variables
The `ListMyProgress` query has no variables.
### Return Type
Recall that executing the `ListMyProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyProgressData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyProgress } from '@money-rank/dataconnect';


// Call the `listMyProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyProgress();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyProgress(dataConnect);

console.log(data.studentProgressEntries);

// Or, you can use the `Promise` API.
listMyProgress().then((response) => {
  const data = response.data;
  console.log(data.studentProgressEntries);
});
```

### Using `ListMyProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyProgressRef } from '@money-rank/dataconnect';


// Call the `listMyProgressRef()` function to get a reference to the query.
const ref = listMyProgressRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyProgressRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.studentProgressEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.studentProgressEntries);
});
```

## ListMyCapiCoinTransactions
You can execute the `ListMyCapiCoinTransactions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyCapiCoinTransactions(vars?: ListMyCapiCoinTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;

interface ListMyCapiCoinTransactionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListMyCapiCoinTransactionsVariables): QueryRef<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;
}
export const listMyCapiCoinTransactionsRef: ListMyCapiCoinTransactionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyCapiCoinTransactions(dc: DataConnect, vars?: ListMyCapiCoinTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;

interface ListMyCapiCoinTransactionsRef {
  ...
  (dc: DataConnect, vars?: ListMyCapiCoinTransactionsVariables): QueryRef<ListMyCapiCoinTransactionsData, ListMyCapiCoinTransactionsVariables>;
}
export const listMyCapiCoinTransactionsRef: ListMyCapiCoinTransactionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyCapiCoinTransactionsRef:
```typescript
const name = listMyCapiCoinTransactionsRef.operationName;
console.log(name);
```

### Variables
The `ListMyCapiCoinTransactions` query has an optional argument of type `ListMyCapiCoinTransactionsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyCapiCoinTransactionsVariables {
  offset?: number | null;
}
```
### Return Type
Recall that executing the `ListMyCapiCoinTransactions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyCapiCoinTransactionsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyCapiCoinTransactions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyCapiCoinTransactions, ListMyCapiCoinTransactionsVariables } from '@money-rank/dataconnect';

// The `ListMyCapiCoinTransactions` query has an optional argument of type `ListMyCapiCoinTransactionsVariables`:
const listMyCapiCoinTransactionsVars: ListMyCapiCoinTransactionsVariables = {
  offset: ..., // optional
};

// Call the `listMyCapiCoinTransactions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyCapiCoinTransactions(listMyCapiCoinTransactionsVars);
// Variables can be defined inline as well.
const { data } = await listMyCapiCoinTransactions({ offset: ..., });
// Since all variables are optional for this query, you can omit the `ListMyCapiCoinTransactionsVariables` argument.
const { data } = await listMyCapiCoinTransactions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyCapiCoinTransactions(dataConnect, listMyCapiCoinTransactionsVars);

console.log(data.capiCoinTransactions);

// Or, you can use the `Promise` API.
listMyCapiCoinTransactions(listMyCapiCoinTransactionsVars).then((response) => {
  const data = response.data;
  console.log(data.capiCoinTransactions);
});
```

### Using `ListMyCapiCoinTransactions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyCapiCoinTransactionsRef, ListMyCapiCoinTransactionsVariables } from '@money-rank/dataconnect';

// The `ListMyCapiCoinTransactions` query has an optional argument of type `ListMyCapiCoinTransactionsVariables`:
const listMyCapiCoinTransactionsVars: ListMyCapiCoinTransactionsVariables = {
  offset: ..., // optional
};

// Call the `listMyCapiCoinTransactionsRef()` function to get a reference to the query.
const ref = listMyCapiCoinTransactionsRef(listMyCapiCoinTransactionsVars);
// Variables can be defined inline as well.
const ref = listMyCapiCoinTransactionsRef({ offset: ..., });
// Since all variables are optional for this query, you can omit the `ListMyCapiCoinTransactionsVariables` argument.
const ref = listMyCapiCoinTransactionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyCapiCoinTransactionsRef(dataConnect, listMyCapiCoinTransactionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.capiCoinTransactions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.capiCoinTransactions);
});
```

## GetMyCapiCoinTransactionBySource
You can execute the `GetMyCapiCoinTransactionBySource` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getMyCapiCoinTransactionBySource(vars: GetMyCapiCoinTransactionBySourceVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;

interface GetMyCapiCoinTransactionBySourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyCapiCoinTransactionBySourceVariables): QueryRef<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;
}
export const getMyCapiCoinTransactionBySourceRef: GetMyCapiCoinTransactionBySourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyCapiCoinTransactionBySource(dc: DataConnect, vars: GetMyCapiCoinTransactionBySourceVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;

interface GetMyCapiCoinTransactionBySourceRef {
  ...
  (dc: DataConnect, vars: GetMyCapiCoinTransactionBySourceVariables): QueryRef<GetMyCapiCoinTransactionBySourceData, GetMyCapiCoinTransactionBySourceVariables>;
}
export const getMyCapiCoinTransactionBySourceRef: GetMyCapiCoinTransactionBySourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyCapiCoinTransactionBySourceRef:
```typescript
const name = getMyCapiCoinTransactionBySourceRef.operationName;
console.log(name);
```

### Variables
The `GetMyCapiCoinTransactionBySource` query requires an argument of type `GetMyCapiCoinTransactionBySourceVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyCapiCoinTransactionBySourceVariables {
  sourceId: string;
}
```
### Return Type
Recall that executing the `GetMyCapiCoinTransactionBySource` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyCapiCoinTransactionBySourceData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyCapiCoinTransactionBySource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyCapiCoinTransactionBySource, GetMyCapiCoinTransactionBySourceVariables } from '@money-rank/dataconnect';

// The `GetMyCapiCoinTransactionBySource` query requires an argument of type `GetMyCapiCoinTransactionBySourceVariables`:
const getMyCapiCoinTransactionBySourceVars: GetMyCapiCoinTransactionBySourceVariables = {
  sourceId: ..., 
};

// Call the `getMyCapiCoinTransactionBySource()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyCapiCoinTransactionBySource(getMyCapiCoinTransactionBySourceVars);
// Variables can be defined inline as well.
const { data } = await getMyCapiCoinTransactionBySource({ sourceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyCapiCoinTransactionBySource(dataConnect, getMyCapiCoinTransactionBySourceVars);

console.log(data.capiCoinTransactions);

// Or, you can use the `Promise` API.
getMyCapiCoinTransactionBySource(getMyCapiCoinTransactionBySourceVars).then((response) => {
  const data = response.data;
  console.log(data.capiCoinTransactions);
});
```

### Using `GetMyCapiCoinTransactionBySource`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyCapiCoinTransactionBySourceRef, GetMyCapiCoinTransactionBySourceVariables } from '@money-rank/dataconnect';

// The `GetMyCapiCoinTransactionBySource` query requires an argument of type `GetMyCapiCoinTransactionBySourceVariables`:
const getMyCapiCoinTransactionBySourceVars: GetMyCapiCoinTransactionBySourceVariables = {
  sourceId: ..., 
};

// Call the `getMyCapiCoinTransactionBySourceRef()` function to get a reference to the query.
const ref = getMyCapiCoinTransactionBySourceRef(getMyCapiCoinTransactionBySourceVars);
// Variables can be defined inline as well.
const ref = getMyCapiCoinTransactionBySourceRef({ sourceId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyCapiCoinTransactionBySourceRef(dataConnect, getMyCapiCoinTransactionBySourceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.capiCoinTransactions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.capiCoinTransactions);
});
```

## GetMyActivityAttempt
You can execute the `GetMyActivityAttempt` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getMyActivityAttempt(vars: GetMyActivityAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;

interface GetMyActivityAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyActivityAttemptVariables): QueryRef<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;
}
export const getMyActivityAttemptRef: GetMyActivityAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyActivityAttempt(dc: DataConnect, vars: GetMyActivityAttemptVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;

interface GetMyActivityAttemptRef {
  ...
  (dc: DataConnect, vars: GetMyActivityAttemptVariables): QueryRef<GetMyActivityAttemptData, GetMyActivityAttemptVariables>;
}
export const getMyActivityAttemptRef: GetMyActivityAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyActivityAttemptRef:
```typescript
const name = getMyActivityAttemptRef.operationName;
console.log(name);
```

### Variables
The `GetMyActivityAttempt` query requires an argument of type `GetMyActivityAttemptVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyActivityAttemptVariables {
  attemptId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyActivityAttempt` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyActivityAttemptData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyActivityAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyActivityAttempt, GetMyActivityAttemptVariables } from '@money-rank/dataconnect';

// The `GetMyActivityAttempt` query requires an argument of type `GetMyActivityAttemptVariables`:
const getMyActivityAttemptVars: GetMyActivityAttemptVariables = {
  attemptId: ..., 
};

// Call the `getMyActivityAttempt()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyActivityAttempt(getMyActivityAttemptVars);
// Variables can be defined inline as well.
const { data } = await getMyActivityAttempt({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyActivityAttempt(dataConnect, getMyActivityAttemptVars);

console.log(data.activityAttempts);

// Or, you can use the `Promise` API.
getMyActivityAttempt(getMyActivityAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.activityAttempts);
});
```

### Using `GetMyActivityAttempt`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyActivityAttemptRef, GetMyActivityAttemptVariables } from '@money-rank/dataconnect';

// The `GetMyActivityAttempt` query requires an argument of type `GetMyActivityAttemptVariables`:
const getMyActivityAttemptVars: GetMyActivityAttemptVariables = {
  attemptId: ..., 
};

// Call the `getMyActivityAttemptRef()` function to get a reference to the query.
const ref = getMyActivityAttemptRef(getMyActivityAttemptVars);
// Variables can be defined inline as well.
const ref = getMyActivityAttemptRef({ attemptId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyActivityAttemptRef(dataConnect, getMyActivityAttemptVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityAttempts);
});
```

## GetAuthoritativeActivitySession
You can execute the `GetAuthoritativeActivitySession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getAuthoritativeActivitySession(vars: GetAuthoritativeActivitySessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;

interface GetAuthoritativeActivitySessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthoritativeActivitySessionVariables): QueryRef<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;
}
export const getAuthoritativeActivitySessionRef: GetAuthoritativeActivitySessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAuthoritativeActivitySession(dc: DataConnect, vars: GetAuthoritativeActivitySessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;

interface GetAuthoritativeActivitySessionRef {
  ...
  (dc: DataConnect, vars: GetAuthoritativeActivitySessionVariables): QueryRef<GetAuthoritativeActivitySessionData, GetAuthoritativeActivitySessionVariables>;
}
export const getAuthoritativeActivitySessionRef: GetAuthoritativeActivitySessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAuthoritativeActivitySessionRef:
```typescript
const name = getAuthoritativeActivitySessionRef.operationName;
console.log(name);
```

### Variables
The `GetAuthoritativeActivitySession` query requires an argument of type `GetAuthoritativeActivitySessionVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAuthoritativeActivitySessionVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAuthoritativeActivitySession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAuthoritativeActivitySessionData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAuthoritativeActivitySession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAuthoritativeActivitySession, GetAuthoritativeActivitySessionVariables } from '@money-rank/dataconnect';

// The `GetAuthoritativeActivitySession` query requires an argument of type `GetAuthoritativeActivitySessionVariables`:
const getAuthoritativeActivitySessionVars: GetAuthoritativeActivitySessionVariables = {
  sessionId: ..., 
};

// Call the `getAuthoritativeActivitySession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAuthoritativeActivitySession(getAuthoritativeActivitySessionVars);
// Variables can be defined inline as well.
const { data } = await getAuthoritativeActivitySession({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAuthoritativeActivitySession(dataConnect, getAuthoritativeActivitySessionVars);

console.log(data.activitySession);

// Or, you can use the `Promise` API.
getAuthoritativeActivitySession(getAuthoritativeActivitySessionVars).then((response) => {
  const data = response.data;
  console.log(data.activitySession);
});
```

### Using `GetAuthoritativeActivitySession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAuthoritativeActivitySessionRef, GetAuthoritativeActivitySessionVariables } from '@money-rank/dataconnect';

// The `GetAuthoritativeActivitySession` query requires an argument of type `GetAuthoritativeActivitySessionVariables`:
const getAuthoritativeActivitySessionVars: GetAuthoritativeActivitySessionVariables = {
  sessionId: ..., 
};

// Call the `getAuthoritativeActivitySessionRef()` function to get a reference to the query.
const ref = getAuthoritativeActivitySessionRef(getAuthoritativeActivitySessionVars);
// Variables can be defined inline as well.
const ref = getAuthoritativeActivitySessionRef({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAuthoritativeActivitySessionRef(dataConnect, getAuthoritativeActivitySessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activitySession);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activitySession);
});
```

## GetAuthoritativeActivityResult
You can execute the `GetAuthoritativeActivityResult` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getAuthoritativeActivityResult(vars: GetAuthoritativeActivityResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;

interface GetAuthoritativeActivityResultRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAuthoritativeActivityResultVariables): QueryRef<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;
}
export const getAuthoritativeActivityResultRef: GetAuthoritativeActivityResultRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAuthoritativeActivityResult(dc: DataConnect, vars: GetAuthoritativeActivityResultVariables, options?: ExecuteQueryOptions): QueryPromise<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;

interface GetAuthoritativeActivityResultRef {
  ...
  (dc: DataConnect, vars: GetAuthoritativeActivityResultVariables): QueryRef<GetAuthoritativeActivityResultData, GetAuthoritativeActivityResultVariables>;
}
export const getAuthoritativeActivityResultRef: GetAuthoritativeActivityResultRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAuthoritativeActivityResultRef:
```typescript
const name = getAuthoritativeActivityResultRef.operationName;
console.log(name);
```

### Variables
The `GetAuthoritativeActivityResult` query requires an argument of type `GetAuthoritativeActivityResultVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAuthoritativeActivityResultVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAuthoritativeActivityResult` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAuthoritativeActivityResultData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAuthoritativeActivityResult`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAuthoritativeActivityResult, GetAuthoritativeActivityResultVariables } from '@money-rank/dataconnect';

// The `GetAuthoritativeActivityResult` query requires an argument of type `GetAuthoritativeActivityResultVariables`:
const getAuthoritativeActivityResultVars: GetAuthoritativeActivityResultVariables = {
  sessionId: ..., 
};

// Call the `getAuthoritativeActivityResult()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAuthoritativeActivityResult(getAuthoritativeActivityResultVars);
// Variables can be defined inline as well.
const { data } = await getAuthoritativeActivityResult({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAuthoritativeActivityResult(dataConnect, getAuthoritativeActivityResultVars);

console.log(data.activityAttempts);

// Or, you can use the `Promise` API.
getAuthoritativeActivityResult(getAuthoritativeActivityResultVars).then((response) => {
  const data = response.data;
  console.log(data.activityAttempts);
});
```

### Using `GetAuthoritativeActivityResult`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAuthoritativeActivityResultRef, GetAuthoritativeActivityResultVariables } from '@money-rank/dataconnect';

// The `GetAuthoritativeActivityResult` query requires an argument of type `GetAuthoritativeActivityResultVariables`:
const getAuthoritativeActivityResultVars: GetAuthoritativeActivityResultVariables = {
  sessionId: ..., 
};

// Call the `getAuthoritativeActivityResultRef()` function to get a reference to the query.
const ref = getAuthoritativeActivityResultRef(getAuthoritativeActivityResultVars);
// Variables can be defined inline as well.
const ref = getAuthoritativeActivityResultRef({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAuthoritativeActivityResultRef(dataConnect, getAuthoritativeActivityResultVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityAttempts);
});
```

## ListMyActivityAttempts
You can execute the `ListMyActivityAttempts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMyActivityAttempts(vars: ListMyActivityAttemptsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;

interface ListMyActivityAttemptsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMyActivityAttemptsVariables): QueryRef<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;
}
export const listMyActivityAttemptsRef: ListMyActivityAttemptsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyActivityAttempts(dc: DataConnect, vars: ListMyActivityAttemptsVariables, options?: ExecuteQueryOptions): QueryPromise<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;

interface ListMyActivityAttemptsRef {
  ...
  (dc: DataConnect, vars: ListMyActivityAttemptsVariables): QueryRef<ListMyActivityAttemptsData, ListMyActivityAttemptsVariables>;
}
export const listMyActivityAttemptsRef: ListMyActivityAttemptsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyActivityAttemptsRef:
```typescript
const name = listMyActivityAttemptsRef.operationName;
console.log(name);
```

### Variables
The `ListMyActivityAttempts` query requires an argument of type `ListMyActivityAttemptsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMyActivityAttemptsVariables {
  phaseNumber: number;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `ListMyActivityAttempts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyActivityAttemptsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyActivityAttempts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyActivityAttempts, ListMyActivityAttemptsVariables } from '@money-rank/dataconnect';

// The `ListMyActivityAttempts` query requires an argument of type `ListMyActivityAttemptsVariables`:
const listMyActivityAttemptsVars: ListMyActivityAttemptsVariables = {
  phaseNumber: ..., 
  offset: ..., // optional
};

// Call the `listMyActivityAttempts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyActivityAttempts(listMyActivityAttemptsVars);
// Variables can be defined inline as well.
const { data } = await listMyActivityAttempts({ phaseNumber: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyActivityAttempts(dataConnect, listMyActivityAttemptsVars);

console.log(data.activityAttempts);

// Or, you can use the `Promise` API.
listMyActivityAttempts(listMyActivityAttemptsVars).then((response) => {
  const data = response.data;
  console.log(data.activityAttempts);
});
```

### Using `ListMyActivityAttempts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyActivityAttemptsRef, ListMyActivityAttemptsVariables } from '@money-rank/dataconnect';

// The `ListMyActivityAttempts` query requires an argument of type `ListMyActivityAttemptsVariables`:
const listMyActivityAttemptsVars: ListMyActivityAttemptsVariables = {
  phaseNumber: ..., 
  offset: ..., // optional
};

// Call the `listMyActivityAttemptsRef()` function to get a reference to the query.
const ref = listMyActivityAttemptsRef(listMyActivityAttemptsVars);
// Variables can be defined inline as well.
const ref = listMyActivityAttemptsRef({ phaseNumber: ..., offset: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyActivityAttemptsRef(dataConnect, listMyActivityAttemptsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.activityAttempts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.activityAttempts);
});
```

## GetEconomyConfig
You can execute the `GetEconomyConfig` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getEconomyConfig(options?: ExecuteQueryOptions): QueryPromise<GetEconomyConfigData, undefined>;

interface GetEconomyConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetEconomyConfigData, undefined>;
}
export const getEconomyConfigRef: GetEconomyConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEconomyConfig(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetEconomyConfigData, undefined>;

interface GetEconomyConfigRef {
  ...
  (dc: DataConnect): QueryRef<GetEconomyConfigData, undefined>;
}
export const getEconomyConfigRef: GetEconomyConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEconomyConfigRef:
```typescript
const name = getEconomyConfigRef.operationName;
console.log(name);
```

### Variables
The `GetEconomyConfig` query has no variables.
### Return Type
Recall that executing the `GetEconomyConfig` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEconomyConfigData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetEconomyConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEconomyConfig } from '@money-rank/dataconnect';


// Call the `getEconomyConfig()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEconomyConfig();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEconomyConfig(dataConnect);

console.log(data.economyConfig);

// Or, you can use the `Promise` API.
getEconomyConfig().then((response) => {
  const data = response.data;
  console.log(data.economyConfig);
});
```

### Using `GetEconomyConfig`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEconomyConfigRef } from '@money-rank/dataconnect';


// Call the `getEconomyConfigRef()` function to get a reference to the query.
const ref = getEconomyConfigRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEconomyConfigRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.economyConfig);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.economyConfig);
});
```

## ListVisibleCompetitionPeriods
You can execute the `ListVisibleCompetitionPeriods` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listVisibleCompetitionPeriods(options?: ExecuteQueryOptions): QueryPromise<ListVisibleCompetitionPeriodsData, undefined>;

interface ListVisibleCompetitionPeriodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVisibleCompetitionPeriodsData, undefined>;
}
export const listVisibleCompetitionPeriodsRef: ListVisibleCompetitionPeriodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVisibleCompetitionPeriods(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListVisibleCompetitionPeriodsData, undefined>;

interface ListVisibleCompetitionPeriodsRef {
  ...
  (dc: DataConnect): QueryRef<ListVisibleCompetitionPeriodsData, undefined>;
}
export const listVisibleCompetitionPeriodsRef: ListVisibleCompetitionPeriodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVisibleCompetitionPeriodsRef:
```typescript
const name = listVisibleCompetitionPeriodsRef.operationName;
console.log(name);
```

### Variables
The `ListVisibleCompetitionPeriods` query has no variables.
### Return Type
Recall that executing the `ListVisibleCompetitionPeriods` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVisibleCompetitionPeriodsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListVisibleCompetitionPeriods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVisibleCompetitionPeriods } from '@money-rank/dataconnect';


// Call the `listVisibleCompetitionPeriods()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVisibleCompetitionPeriods();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVisibleCompetitionPeriods(dataConnect);

console.log(data.competitionPeriods);

// Or, you can use the `Promise` API.
listVisibleCompetitionPeriods().then((response) => {
  const data = response.data;
  console.log(data.competitionPeriods);
});
```

### Using `ListVisibleCompetitionPeriods`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVisibleCompetitionPeriodsRef } from '@money-rank/dataconnect';


// Call the `listVisibleCompetitionPeriodsRef()` function to get a reference to the query.
const ref = listVisibleCompetitionPeriodsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVisibleCompetitionPeriodsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.competitionPeriods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.competitionPeriods);
});
```

## GetCompetitionRankings
You can execute the `GetCompetitionRankings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getCompetitionRankings(vars: GetCompetitionRankingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;

interface GetCompetitionRankingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompetitionRankingsVariables): QueryRef<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;
}
export const getCompetitionRankingsRef: GetCompetitionRankingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompetitionRankings(dc: DataConnect, vars: GetCompetitionRankingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;

interface GetCompetitionRankingsRef {
  ...
  (dc: DataConnect, vars: GetCompetitionRankingsVariables): QueryRef<GetCompetitionRankingsData, GetCompetitionRankingsVariables>;
}
export const getCompetitionRankingsRef: GetCompetitionRankingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompetitionRankingsRef:
```typescript
const name = getCompetitionRankingsRef.operationName;
console.log(name);
```

### Variables
The `GetCompetitionRankings` query requires an argument of type `GetCompetitionRankingsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompetitionRankingsVariables {
  periodId: UUIDString;
  studentLimit?: number | null;
}
```
### Return Type
Recall that executing the `GetCompetitionRankings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompetitionRankingsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCompetitionRankingsData {
  individualRanking?: unknown[] | null;
  classRanking?: unknown[] | null;
}
```
### Using `GetCompetitionRankings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompetitionRankings, GetCompetitionRankingsVariables } from '@money-rank/dataconnect';

// The `GetCompetitionRankings` query requires an argument of type `GetCompetitionRankingsVariables`:
const getCompetitionRankingsVars: GetCompetitionRankingsVariables = {
  periodId: ..., 
  studentLimit: ..., // optional
};

// Call the `getCompetitionRankings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompetitionRankings(getCompetitionRankingsVars);
// Variables can be defined inline as well.
const { data } = await getCompetitionRankings({ periodId: ..., studentLimit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompetitionRankings(dataConnect, getCompetitionRankingsVars);

console.log(data.individualRanking);
console.log(data.classRanking);

// Or, you can use the `Promise` API.
getCompetitionRankings(getCompetitionRankingsVars).then((response) => {
  const data = response.data;
  console.log(data.individualRanking);
  console.log(data.classRanking);
});
```

### Using `GetCompetitionRankings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompetitionRankingsRef, GetCompetitionRankingsVariables } from '@money-rank/dataconnect';

// The `GetCompetitionRankings` query requires an argument of type `GetCompetitionRankingsVariables`:
const getCompetitionRankingsVars: GetCompetitionRankingsVariables = {
  periodId: ..., 
  studentLimit: ..., // optional
};

// Call the `getCompetitionRankingsRef()` function to get a reference to the query.
const ref = getCompetitionRankingsRef(getCompetitionRankingsVars);
// Variables can be defined inline as well.
const ref = getCompetitionRankingsRef({ periodId: ..., studentLimit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompetitionRankingsRef(dataConnect, getCompetitionRankingsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.individualRanking);
console.log(data.classRanking);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.individualRanking);
  console.log(data.classRanking);
});
```

## GetCompetitionAbuseSignals
You can execute the `GetCompetitionAbuseSignals` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getCompetitionAbuseSignals(vars: GetCompetitionAbuseSignalsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;

interface GetCompetitionAbuseSignalsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompetitionAbuseSignalsVariables): QueryRef<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;
}
export const getCompetitionAbuseSignalsRef: GetCompetitionAbuseSignalsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompetitionAbuseSignals(dc: DataConnect, vars: GetCompetitionAbuseSignalsVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;

interface GetCompetitionAbuseSignalsRef {
  ...
  (dc: DataConnect, vars: GetCompetitionAbuseSignalsVariables): QueryRef<GetCompetitionAbuseSignalsData, GetCompetitionAbuseSignalsVariables>;
}
export const getCompetitionAbuseSignalsRef: GetCompetitionAbuseSignalsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompetitionAbuseSignalsRef:
```typescript
const name = getCompetitionAbuseSignalsRef.operationName;
console.log(name);
```

### Variables
The `GetCompetitionAbuseSignals` query requires an argument of type `GetCompetitionAbuseSignalsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompetitionAbuseSignalsVariables {
  periodId: UUIDString;
  minimumApprovedAttempts?: number | null;
}
```
### Return Type
Recall that executing the `GetCompetitionAbuseSignals` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompetitionAbuseSignalsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCompetitionAbuseSignalsData {
  signals?: unknown[] | null;
}
```
### Using `GetCompetitionAbuseSignals`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompetitionAbuseSignals, GetCompetitionAbuseSignalsVariables } from '@money-rank/dataconnect';

// The `GetCompetitionAbuseSignals` query requires an argument of type `GetCompetitionAbuseSignalsVariables`:
const getCompetitionAbuseSignalsVars: GetCompetitionAbuseSignalsVariables = {
  periodId: ..., 
  minimumApprovedAttempts: ..., // optional
};

// Call the `getCompetitionAbuseSignals()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompetitionAbuseSignals(getCompetitionAbuseSignalsVars);
// Variables can be defined inline as well.
const { data } = await getCompetitionAbuseSignals({ periodId: ..., minimumApprovedAttempts: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompetitionAbuseSignals(dataConnect, getCompetitionAbuseSignalsVars);

console.log(data.signals);

// Or, you can use the `Promise` API.
getCompetitionAbuseSignals(getCompetitionAbuseSignalsVars).then((response) => {
  const data = response.data;
  console.log(data.signals);
});
```

### Using `GetCompetitionAbuseSignals`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompetitionAbuseSignalsRef, GetCompetitionAbuseSignalsVariables } from '@money-rank/dataconnect';

// The `GetCompetitionAbuseSignals` query requires an argument of type `GetCompetitionAbuseSignalsVariables`:
const getCompetitionAbuseSignalsVars: GetCompetitionAbuseSignalsVariables = {
  periodId: ..., 
  minimumApprovedAttempts: ..., // optional
};

// Call the `getCompetitionAbuseSignalsRef()` function to get a reference to the query.
const ref = getCompetitionAbuseSignalsRef(getCompetitionAbuseSignalsVars);
// Variables can be defined inline as well.
const ref = getCompetitionAbuseSignalsRef({ periodId: ..., minimumApprovedAttempts: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompetitionAbuseSignalsRef(dataConnect, getCompetitionAbuseSignalsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.signals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.signals);
});
```

## ListTeacherCompetitionPeriods
You can execute the `ListTeacherCompetitionPeriods` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listTeacherCompetitionPeriods(vars?: ListTeacherCompetitionPeriodsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;

interface ListTeacherCompetitionPeriodsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListTeacherCompetitionPeriodsVariables): QueryRef<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;
}
export const listTeacherCompetitionPeriodsRef: ListTeacherCompetitionPeriodsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTeacherCompetitionPeriods(dc: DataConnect, vars?: ListTeacherCompetitionPeriodsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;

interface ListTeacherCompetitionPeriodsRef {
  ...
  (dc: DataConnect, vars?: ListTeacherCompetitionPeriodsVariables): QueryRef<ListTeacherCompetitionPeriodsData, ListTeacherCompetitionPeriodsVariables>;
}
export const listTeacherCompetitionPeriodsRef: ListTeacherCompetitionPeriodsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTeacherCompetitionPeriodsRef:
```typescript
const name = listTeacherCompetitionPeriodsRef.operationName;
console.log(name);
```

### Variables
The `ListTeacherCompetitionPeriods` query has an optional argument of type `ListTeacherCompetitionPeriodsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTeacherCompetitionPeriodsVariables {
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListTeacherCompetitionPeriods` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTeacherCompetitionPeriodsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTeacherCompetitionPeriodsData {
  periods?: unknown[] | null;
}
```
### Using `ListTeacherCompetitionPeriods`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTeacherCompetitionPeriods, ListTeacherCompetitionPeriodsVariables } from '@money-rank/dataconnect';

// The `ListTeacherCompetitionPeriods` query has an optional argument of type `ListTeacherCompetitionPeriodsVariables`:
const listTeacherCompetitionPeriodsVars: ListTeacherCompetitionPeriodsVariables = {
  limit: ..., // optional
};

// Call the `listTeacherCompetitionPeriods()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTeacherCompetitionPeriods(listTeacherCompetitionPeriodsVars);
// Variables can be defined inline as well.
const { data } = await listTeacherCompetitionPeriods({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListTeacherCompetitionPeriodsVariables` argument.
const { data } = await listTeacherCompetitionPeriods();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTeacherCompetitionPeriods(dataConnect, listTeacherCompetitionPeriodsVars);

console.log(data.periods);

// Or, you can use the `Promise` API.
listTeacherCompetitionPeriods(listTeacherCompetitionPeriodsVars).then((response) => {
  const data = response.data;
  console.log(data.periods);
});
```

### Using `ListTeacherCompetitionPeriods`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTeacherCompetitionPeriodsRef, ListTeacherCompetitionPeriodsVariables } from '@money-rank/dataconnect';

// The `ListTeacherCompetitionPeriods` query has an optional argument of type `ListTeacherCompetitionPeriodsVariables`:
const listTeacherCompetitionPeriodsVars: ListTeacherCompetitionPeriodsVariables = {
  limit: ..., // optional
};

// Call the `listTeacherCompetitionPeriodsRef()` function to get a reference to the query.
const ref = listTeacherCompetitionPeriodsRef(listTeacherCompetitionPeriodsVars);
// Variables can be defined inline as well.
const ref = listTeacherCompetitionPeriodsRef({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListTeacherCompetitionPeriodsVariables` argument.
const ref = listTeacherCompetitionPeriodsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTeacherCompetitionPeriodsRef(dataConnect, listTeacherCompetitionPeriodsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.periods);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.periods);
});
```

## GetTeacherDashboard
You can execute the `GetTeacherDashboard` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getTeacherDashboard(vars: GetTeacherDashboardVariables, options?: ExecuteQueryOptions): QueryPromise<GetTeacherDashboardData, GetTeacherDashboardVariables>;

interface GetTeacherDashboardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTeacherDashboardVariables): QueryRef<GetTeacherDashboardData, GetTeacherDashboardVariables>;
}
export const getTeacherDashboardRef: GetTeacherDashboardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTeacherDashboard(dc: DataConnect, vars: GetTeacherDashboardVariables, options?: ExecuteQueryOptions): QueryPromise<GetTeacherDashboardData, GetTeacherDashboardVariables>;

interface GetTeacherDashboardRef {
  ...
  (dc: DataConnect, vars: GetTeacherDashboardVariables): QueryRef<GetTeacherDashboardData, GetTeacherDashboardVariables>;
}
export const getTeacherDashboardRef: GetTeacherDashboardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTeacherDashboardRef:
```typescript
const name = getTeacherDashboardRef.operationName;
console.log(name);
```

### Variables
The `GetTeacherDashboard` query requires an argument of type `GetTeacherDashboardVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTeacherDashboardVariables {
  periodId: UUIDString;
  studentLimit?: number | null;
}
```
### Return Type
Recall that executing the `GetTeacherDashboard` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTeacherDashboardData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTeacherDashboardData {
  summary?: unknown | null;
  classMetrics?: unknown[] | null;
  phaseMetrics?: unknown[] | null;
  studentMetrics?: unknown[] | null;
}
```
### Using `GetTeacherDashboard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTeacherDashboard, GetTeacherDashboardVariables } from '@money-rank/dataconnect';

// The `GetTeacherDashboard` query requires an argument of type `GetTeacherDashboardVariables`:
const getTeacherDashboardVars: GetTeacherDashboardVariables = {
  periodId: ..., 
  studentLimit: ..., // optional
};

// Call the `getTeacherDashboard()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTeacherDashboard(getTeacherDashboardVars);
// Variables can be defined inline as well.
const { data } = await getTeacherDashboard({ periodId: ..., studentLimit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTeacherDashboard(dataConnect, getTeacherDashboardVars);

console.log(data.summary);
console.log(data.classMetrics);
console.log(data.phaseMetrics);
console.log(data.studentMetrics);

// Or, you can use the `Promise` API.
getTeacherDashboard(getTeacherDashboardVars).then((response) => {
  const data = response.data;
  console.log(data.summary);
  console.log(data.classMetrics);
  console.log(data.phaseMetrics);
  console.log(data.studentMetrics);
});
```

### Using `GetTeacherDashboard`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTeacherDashboardRef, GetTeacherDashboardVariables } from '@money-rank/dataconnect';

// The `GetTeacherDashboard` query requires an argument of type `GetTeacherDashboardVariables`:
const getTeacherDashboardVars: GetTeacherDashboardVariables = {
  periodId: ..., 
  studentLimit: ..., // optional
};

// Call the `getTeacherDashboardRef()` function to get a reference to the query.
const ref = getTeacherDashboardRef(getTeacherDashboardVars);
// Variables can be defined inline as well.
const ref = getTeacherDashboardRef({ periodId: ..., studentLimit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTeacherDashboardRef(dataConnect, getTeacherDashboardVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.summary);
console.log(data.classMetrics);
console.log(data.phaseMetrics);
console.log(data.studentMetrics);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.summary);
  console.log(data.classMetrics);
  console.log(data.phaseMetrics);
  console.log(data.studentMetrics);
});
```

## GetPedagogicalBankStatus
You can execute the `GetPedagogicalBankStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getPedagogicalBankStatus(options?: ExecuteQueryOptions): QueryPromise<GetPedagogicalBankStatusData, undefined>;

interface GetPedagogicalBankStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPedagogicalBankStatusData, undefined>;
}
export const getPedagogicalBankStatusRef: GetPedagogicalBankStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPedagogicalBankStatus(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetPedagogicalBankStatusData, undefined>;

interface GetPedagogicalBankStatusRef {
  ...
  (dc: DataConnect): QueryRef<GetPedagogicalBankStatusData, undefined>;
}
export const getPedagogicalBankStatusRef: GetPedagogicalBankStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPedagogicalBankStatusRef:
```typescript
const name = getPedagogicalBankStatusRef.operationName;
console.log(name);
```

### Variables
The `GetPedagogicalBankStatus` query has no variables.
### Return Type
Recall that executing the `GetPedagogicalBankStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPedagogicalBankStatusData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPedagogicalBankStatusData {
  latestLoad?: unknown | null;
  counts?: unknown[] | null;
  items?: unknown[] | null;
}
```
### Using `GetPedagogicalBankStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPedagogicalBankStatus } from '@money-rank/dataconnect';


// Call the `getPedagogicalBankStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPedagogicalBankStatus();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPedagogicalBankStatus(dataConnect);

console.log(data.latestLoad);
console.log(data.counts);
console.log(data.items);

// Or, you can use the `Promise` API.
getPedagogicalBankStatus().then((response) => {
  const data = response.data;
  console.log(data.latestLoad);
  console.log(data.counts);
  console.log(data.items);
});
```

### Using `GetPedagogicalBankStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPedagogicalBankStatusRef } from '@money-rank/dataconnect';


// Call the `getPedagogicalBankStatusRef()` function to get a reference to the query.
const ref = getPedagogicalBankStatusRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPedagogicalBankStatusRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.latestLoad);
console.log(data.counts);
console.log(data.items);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.latestLoad);
  console.log(data.counts);
  console.log(data.items);
});
```

## ListActivePedagogicalItemsForActivity
You can execute the `ListActivePedagogicalItemsForActivity` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listActivePedagogicalItemsForActivity(vars: ListActivePedagogicalItemsForActivityVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;

interface ListActivePedagogicalItemsForActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivePedagogicalItemsForActivityVariables): QueryRef<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;
}
export const listActivePedagogicalItemsForActivityRef: ListActivePedagogicalItemsForActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listActivePedagogicalItemsForActivity(dc: DataConnect, vars: ListActivePedagogicalItemsForActivityVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;

interface ListActivePedagogicalItemsForActivityRef {
  ...
  (dc: DataConnect, vars: ListActivePedagogicalItemsForActivityVariables): QueryRef<ListActivePedagogicalItemsForActivityData, ListActivePedagogicalItemsForActivityVariables>;
}
export const listActivePedagogicalItemsForActivityRef: ListActivePedagogicalItemsForActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listActivePedagogicalItemsForActivityRef:
```typescript
const name = listActivePedagogicalItemsForActivityRef.operationName;
console.log(name);
```

### Variables
The `ListActivePedagogicalItemsForActivity` query requires an argument of type `ListActivePedagogicalItemsForActivityVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListActivePedagogicalItemsForActivityVariables {
  activityId: string;
}
```
### Return Type
Recall that executing the `ListActivePedagogicalItemsForActivity` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListActivePedagogicalItemsForActivityData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListActivePedagogicalItemsForActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listActivePedagogicalItemsForActivity, ListActivePedagogicalItemsForActivityVariables } from '@money-rank/dataconnect';

// The `ListActivePedagogicalItemsForActivity` query requires an argument of type `ListActivePedagogicalItemsForActivityVariables`:
const listActivePedagogicalItemsForActivityVars: ListActivePedagogicalItemsForActivityVariables = {
  activityId: ..., 
};

// Call the `listActivePedagogicalItemsForActivity()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listActivePedagogicalItemsForActivity(listActivePedagogicalItemsForActivityVars);
// Variables can be defined inline as well.
const { data } = await listActivePedagogicalItemsForActivity({ activityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listActivePedagogicalItemsForActivity(dataConnect, listActivePedagogicalItemsForActivityVars);

console.log(data.pedagogicalItems);

// Or, you can use the `Promise` API.
listActivePedagogicalItemsForActivity(listActivePedagogicalItemsForActivityVars).then((response) => {
  const data = response.data;
  console.log(data.pedagogicalItems);
});
```

### Using `ListActivePedagogicalItemsForActivity`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listActivePedagogicalItemsForActivityRef, ListActivePedagogicalItemsForActivityVariables } from '@money-rank/dataconnect';

// The `ListActivePedagogicalItemsForActivity` query requires an argument of type `ListActivePedagogicalItemsForActivityVariables`:
const listActivePedagogicalItemsForActivityVars: ListActivePedagogicalItemsForActivityVariables = {
  activityId: ..., 
};

// Call the `listActivePedagogicalItemsForActivityRef()` function to get a reference to the query.
const ref = listActivePedagogicalItemsForActivityRef(listActivePedagogicalItemsForActivityVars);
// Variables can be defined inline as well.
const ref = listActivePedagogicalItemsForActivityRef({ activityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listActivePedagogicalItemsForActivityRef(dataConnect, listActivePedagogicalItemsForActivityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pedagogicalItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pedagogicalItems);
});
```

## ListStudentSeenPedagogicalItemIds
You can execute the `ListStudentSeenPedagogicalItemIds` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listStudentSeenPedagogicalItemIds(vars: ListStudentSeenPedagogicalItemIdsVariables, options?: ExecuteQueryOptions): QueryPromise<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;

interface ListStudentSeenPedagogicalItemIdsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStudentSeenPedagogicalItemIdsVariables): QueryRef<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;
}
export const listStudentSeenPedagogicalItemIdsRef: ListStudentSeenPedagogicalItemIdsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStudentSeenPedagogicalItemIds(dc: DataConnect, vars: ListStudentSeenPedagogicalItemIdsVariables, options?: ExecuteQueryOptions): QueryPromise<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;

interface ListStudentSeenPedagogicalItemIdsRef {
  ...
  (dc: DataConnect, vars: ListStudentSeenPedagogicalItemIdsVariables): QueryRef<ListStudentSeenPedagogicalItemIdsData, ListStudentSeenPedagogicalItemIdsVariables>;
}
export const listStudentSeenPedagogicalItemIdsRef: ListStudentSeenPedagogicalItemIdsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStudentSeenPedagogicalItemIdsRef:
```typescript
const name = listStudentSeenPedagogicalItemIdsRef.operationName;
console.log(name);
```

### Variables
The `ListStudentSeenPedagogicalItemIds` query requires an argument of type `ListStudentSeenPedagogicalItemIdsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListStudentSeenPedagogicalItemIdsVariables {
  studentUid: string;
  activityId: string;
}
```
### Return Type
Recall that executing the `ListStudentSeenPedagogicalItemIds` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStudentSeenPedagogicalItemIdsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListStudentSeenPedagogicalItemIdsData {
  seenItems?: unknown[] | null;
}
```
### Using `ListStudentSeenPedagogicalItemIds`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStudentSeenPedagogicalItemIds, ListStudentSeenPedagogicalItemIdsVariables } from '@money-rank/dataconnect';

// The `ListStudentSeenPedagogicalItemIds` query requires an argument of type `ListStudentSeenPedagogicalItemIdsVariables`:
const listStudentSeenPedagogicalItemIdsVars: ListStudentSeenPedagogicalItemIdsVariables = {
  studentUid: ..., 
  activityId: ..., 
};

// Call the `listStudentSeenPedagogicalItemIds()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStudentSeenPedagogicalItemIds(listStudentSeenPedagogicalItemIdsVars);
// Variables can be defined inline as well.
const { data } = await listStudentSeenPedagogicalItemIds({ studentUid: ..., activityId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStudentSeenPedagogicalItemIds(dataConnect, listStudentSeenPedagogicalItemIdsVars);

console.log(data.seenItems);

// Or, you can use the `Promise` API.
listStudentSeenPedagogicalItemIds(listStudentSeenPedagogicalItemIdsVars).then((response) => {
  const data = response.data;
  console.log(data.seenItems);
});
```

### Using `ListStudentSeenPedagogicalItemIds`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStudentSeenPedagogicalItemIdsRef, ListStudentSeenPedagogicalItemIdsVariables } from '@money-rank/dataconnect';

// The `ListStudentSeenPedagogicalItemIds` query requires an argument of type `ListStudentSeenPedagogicalItemIdsVariables`:
const listStudentSeenPedagogicalItemIdsVars: ListStudentSeenPedagogicalItemIdsVariables = {
  studentUid: ..., 
  activityId: ..., 
};

// Call the `listStudentSeenPedagogicalItemIdsRef()` function to get a reference to the query.
const ref = listStudentSeenPedagogicalItemIdsRef(listStudentSeenPedagogicalItemIdsVars);
// Variables can be defined inline as well.
const ref = listStudentSeenPedagogicalItemIdsRef({ studentUid: ..., activityId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStudentSeenPedagogicalItemIdsRef(dataConnect, listStudentSeenPedagogicalItemIdsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.seenItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.seenItems);
});
```

## GetPilotClassBinding
You can execute the `GetPilotClassBinding` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getPilotClassBinding(vars: GetPilotClassBindingVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotClassBindingData, GetPilotClassBindingVariables>;

interface GetPilotClassBindingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPilotClassBindingVariables): QueryRef<GetPilotClassBindingData, GetPilotClassBindingVariables>;
}
export const getPilotClassBindingRef: GetPilotClassBindingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPilotClassBinding(dc: DataConnect, vars: GetPilotClassBindingVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotClassBindingData, GetPilotClassBindingVariables>;

interface GetPilotClassBindingRef {
  ...
  (dc: DataConnect, vars: GetPilotClassBindingVariables): QueryRef<GetPilotClassBindingData, GetPilotClassBindingVariables>;
}
export const getPilotClassBindingRef: GetPilotClassBindingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPilotClassBindingRef:
```typescript
const name = getPilotClassBindingRef.operationName;
console.log(name);
```

### Variables
The `GetPilotClassBinding` query requires an argument of type `GetPilotClassBindingVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPilotClassBindingVariables {
  studentUid: string;
}
```
### Return Type
Recall that executing the `GetPilotClassBinding` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPilotClassBindingData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPilotClassBindingData {
  user?: {
    uid: string;
    role: UserRole;
    classGroup?: StudentClass | null;
    profileCompleted: boolean;
  } & User_Key;
}
```
### Using `GetPilotClassBinding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPilotClassBinding, GetPilotClassBindingVariables } from '@money-rank/dataconnect';

// The `GetPilotClassBinding` query requires an argument of type `GetPilotClassBindingVariables`:
const getPilotClassBindingVars: GetPilotClassBindingVariables = {
  studentUid: ..., 
};

// Call the `getPilotClassBinding()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPilotClassBinding(getPilotClassBindingVars);
// Variables can be defined inline as well.
const { data } = await getPilotClassBinding({ studentUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPilotClassBinding(dataConnect, getPilotClassBindingVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getPilotClassBinding(getPilotClassBindingVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetPilotClassBinding`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPilotClassBindingRef, GetPilotClassBindingVariables } from '@money-rank/dataconnect';

// The `GetPilotClassBinding` query requires an argument of type `GetPilotClassBindingVariables`:
const getPilotClassBindingVars: GetPilotClassBindingVariables = {
  studentUid: ..., 
};

// Call the `getPilotClassBindingRef()` function to get a reference to the query.
const ref = getPilotClassBindingRef(getPilotClassBindingVars);
// Variables can be defined inline as well.
const ref = getPilotClassBindingRef({ studentUid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPilotClassBindingRef(dataConnect, getPilotClassBindingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ResolveCompetitionPeriodByKey
You can execute the `ResolveCompetitionPeriodByKey` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
resolveCompetitionPeriodByKey(vars: ResolveCompetitionPeriodByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;

interface ResolveCompetitionPeriodByKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ResolveCompetitionPeriodByKeyVariables): QueryRef<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;
}
export const resolveCompetitionPeriodByKeyRef: ResolveCompetitionPeriodByKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
resolveCompetitionPeriodByKey(dc: DataConnect, vars: ResolveCompetitionPeriodByKeyVariables, options?: ExecuteQueryOptions): QueryPromise<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;

interface ResolveCompetitionPeriodByKeyRef {
  ...
  (dc: DataConnect, vars: ResolveCompetitionPeriodByKeyVariables): QueryRef<ResolveCompetitionPeriodByKeyData, ResolveCompetitionPeriodByKeyVariables>;
}
export const resolveCompetitionPeriodByKeyRef: ResolveCompetitionPeriodByKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the resolveCompetitionPeriodByKeyRef:
```typescript
const name = resolveCompetitionPeriodByKeyRef.operationName;
console.log(name);
```

### Variables
The `ResolveCompetitionPeriodByKey` query requires an argument of type `ResolveCompetitionPeriodByKeyVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ResolveCompetitionPeriodByKeyVariables {
  periodKey: string;
}
```
### Return Type
Recall that executing the `ResolveCompetitionPeriodByKey` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ResolveCompetitionPeriodByKeyData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ResolveCompetitionPeriodByKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, resolveCompetitionPeriodByKey, ResolveCompetitionPeriodByKeyVariables } from '@money-rank/dataconnect';

// The `ResolveCompetitionPeriodByKey` query requires an argument of type `ResolveCompetitionPeriodByKeyVariables`:
const resolveCompetitionPeriodByKeyVars: ResolveCompetitionPeriodByKeyVariables = {
  periodKey: ..., 
};

// Call the `resolveCompetitionPeriodByKey()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await resolveCompetitionPeriodByKey(resolveCompetitionPeriodByKeyVars);
// Variables can be defined inline as well.
const { data } = await resolveCompetitionPeriodByKey({ periodKey: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await resolveCompetitionPeriodByKey(dataConnect, resolveCompetitionPeriodByKeyVars);

console.log(data.competitionPeriod);

// Or, you can use the `Promise` API.
resolveCompetitionPeriodByKey(resolveCompetitionPeriodByKeyVars).then((response) => {
  const data = response.data;
  console.log(data.competitionPeriod);
});
```

### Using `ResolveCompetitionPeriodByKey`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, resolveCompetitionPeriodByKeyRef, ResolveCompetitionPeriodByKeyVariables } from '@money-rank/dataconnect';

// The `ResolveCompetitionPeriodByKey` query requires an argument of type `ResolveCompetitionPeriodByKeyVariables`:
const resolveCompetitionPeriodByKeyVars: ResolveCompetitionPeriodByKeyVariables = {
  periodKey: ..., 
};

// Call the `resolveCompetitionPeriodByKeyRef()` function to get a reference to the query.
const ref = resolveCompetitionPeriodByKeyRef(resolveCompetitionPeriodByKeyVars);
// Variables can be defined inline as well.
const ref = resolveCompetitionPeriodByKeyRef({ periodKey: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = resolveCompetitionPeriodByKeyRef(dataConnect, resolveCompetitionPeriodByKeyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.competitionPeriod);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.competitionPeriod);
});
```

## GetPilotExportRows
You can execute the `GetPilotExportRows` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getPilotExportRows(vars: GetPilotExportRowsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotExportRowsData, GetPilotExportRowsVariables>;

interface GetPilotExportRowsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPilotExportRowsVariables): QueryRef<GetPilotExportRowsData, GetPilotExportRowsVariables>;
}
export const getPilotExportRowsRef: GetPilotExportRowsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPilotExportRows(dc: DataConnect, vars: GetPilotExportRowsVariables, options?: ExecuteQueryOptions): QueryPromise<GetPilotExportRowsData, GetPilotExportRowsVariables>;

interface GetPilotExportRowsRef {
  ...
  (dc: DataConnect, vars: GetPilotExportRowsVariables): QueryRef<GetPilotExportRowsData, GetPilotExportRowsVariables>;
}
export const getPilotExportRowsRef: GetPilotExportRowsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPilotExportRowsRef:
```typescript
const name = getPilotExportRowsRef.operationName;
console.log(name);
```

### Variables
The `GetPilotExportRows` query requires an argument of type `GetPilotExportRowsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPilotExportRowsVariables {
  periodId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPilotExportRows` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPilotExportRowsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPilotExportRowsData {
  attempts?: unknown[] | null;
  transactions?: unknown[] | null;
  audit?: unknown[] | null;
}
```
### Using `GetPilotExportRows`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPilotExportRows, GetPilotExportRowsVariables } from '@money-rank/dataconnect';

// The `GetPilotExportRows` query requires an argument of type `GetPilotExportRowsVariables`:
const getPilotExportRowsVars: GetPilotExportRowsVariables = {
  periodId: ..., 
};

// Call the `getPilotExportRows()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPilotExportRows(getPilotExportRowsVars);
// Variables can be defined inline as well.
const { data } = await getPilotExportRows({ periodId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPilotExportRows(dataConnect, getPilotExportRowsVars);

console.log(data.attempts);
console.log(data.transactions);
console.log(data.audit);

// Or, you can use the `Promise` API.
getPilotExportRows(getPilotExportRowsVars).then((response) => {
  const data = response.data;
  console.log(data.attempts);
  console.log(data.transactions);
  console.log(data.audit);
});
```

### Using `GetPilotExportRows`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPilotExportRowsRef, GetPilotExportRowsVariables } from '@money-rank/dataconnect';

// The `GetPilotExportRows` query requires an argument of type `GetPilotExportRowsVariables`:
const getPilotExportRowsVars: GetPilotExportRowsVariables = {
  periodId: ..., 
};

// Call the `getPilotExportRowsRef()` function to get a reference to the query.
const ref = getPilotExportRowsRef(getPilotExportRowsVars);
// Variables can be defined inline as well.
const ref = getPilotExportRowsRef({ periodId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPilotExportRowsRef(dataConnect, getPilotExportRowsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.attempts);
console.log(data.transactions);
console.log(data.audit);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.attempts);
  console.log(data.transactions);
  console.log(data.audit);
});
```

## GetLoadTestCleanupStatus
You can execute the `GetLoadTestCleanupStatus` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getLoadTestCleanupStatus(vars: GetLoadTestCleanupStatusVariables, options?: ExecuteQueryOptions): QueryPromise<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;

interface GetLoadTestCleanupStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLoadTestCleanupStatusVariables): QueryRef<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;
}
export const getLoadTestCleanupStatusRef: GetLoadTestCleanupStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getLoadTestCleanupStatus(dc: DataConnect, vars: GetLoadTestCleanupStatusVariables, options?: ExecuteQueryOptions): QueryPromise<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;

interface GetLoadTestCleanupStatusRef {
  ...
  (dc: DataConnect, vars: GetLoadTestCleanupStatusVariables): QueryRef<GetLoadTestCleanupStatusData, GetLoadTestCleanupStatusVariables>;
}
export const getLoadTestCleanupStatusRef: GetLoadTestCleanupStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getLoadTestCleanupStatusRef:
```typescript
const name = getLoadTestCleanupStatusRef.operationName;
console.log(name);
```

### Variables
The `GetLoadTestCleanupStatus` query requires an argument of type `GetLoadTestCleanupStatusVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetLoadTestCleanupStatusVariables {
  runId: string;
}
```
### Return Type
Recall that executing the `GetLoadTestCleanupStatus` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetLoadTestCleanupStatusData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetLoadTestCleanupStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getLoadTestCleanupStatus, GetLoadTestCleanupStatusVariables } from '@money-rank/dataconnect';

// The `GetLoadTestCleanupStatus` query requires an argument of type `GetLoadTestCleanupStatusVariables`:
const getLoadTestCleanupStatusVars: GetLoadTestCleanupStatusVariables = {
  runId: ..., 
};

// Call the `getLoadTestCleanupStatus()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getLoadTestCleanupStatus(getLoadTestCleanupStatusVars);
// Variables can be defined inline as well.
const { data } = await getLoadTestCleanupStatus({ runId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getLoadTestCleanupStatus(dataConnect, getLoadTestCleanupStatusVars);

console.log(data.run);
console.log(data.remainingMarkedUsers);

// Or, you can use the `Promise` API.
getLoadTestCleanupStatus(getLoadTestCleanupStatusVars).then((response) => {
  const data = response.data;
  console.log(data.run);
  console.log(data.remainingMarkedUsers);
});
```

### Using `GetLoadTestCleanupStatus`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getLoadTestCleanupStatusRef, GetLoadTestCleanupStatusVariables } from '@money-rank/dataconnect';

// The `GetLoadTestCleanupStatus` query requires an argument of type `GetLoadTestCleanupStatusVariables`:
const getLoadTestCleanupStatusVars: GetLoadTestCleanupStatusVariables = {
  runId: ..., 
};

// Call the `getLoadTestCleanupStatusRef()` function to get a reference to the query.
const ref = getLoadTestCleanupStatusRef(getLoadTestCleanupStatusVars);
// Variables can be defined inline as well.
const ref = getLoadTestCleanupStatusRef({ runId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getLoadTestCleanupStatusRef(dataConnect, getLoadTestCleanupStatusVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.run);
console.log(data.remainingMarkedUsers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.run);
  console.log(data.remainingMarkedUsers);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `money-rank-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertMyProfileWithAvatar
You can execute the `UpsertMyProfileWithAvatar` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertMyProfileWithAvatar(vars: UpsertMyProfileWithAvatarVariables): MutationPromise<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;

interface UpsertMyProfileWithAvatarRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileWithAvatarVariables): MutationRef<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;
}
export const upsertMyProfileWithAvatarRef: UpsertMyProfileWithAvatarRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMyProfileWithAvatar(dc: DataConnect, vars: UpsertMyProfileWithAvatarVariables): MutationPromise<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;

interface UpsertMyProfileWithAvatarRef {
  ...
  (dc: DataConnect, vars: UpsertMyProfileWithAvatarVariables): MutationRef<UpsertMyProfileWithAvatarData, UpsertMyProfileWithAvatarVariables>;
}
export const upsertMyProfileWithAvatarRef: UpsertMyProfileWithAvatarRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMyProfileWithAvatarRef:
```typescript
const name = upsertMyProfileWithAvatarRef.operationName;
console.log(name);
```

### Variables
The `UpsertMyProfileWithAvatar` mutation requires an argument of type `UpsertMyProfileWithAvatarVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertMyProfileWithAvatarVariables {
  preferredName: string;
  classGroup: StudentClass;
  avatarId: ProfessionalAvatar;
}
```
### Return Type
Recall that executing the `UpsertMyProfileWithAvatar` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMyProfileWithAvatarData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMyProfileWithAvatarData {
  user_upsert: User_Key;
}
```
### Using `UpsertMyProfileWithAvatar`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileWithAvatar, UpsertMyProfileWithAvatarVariables } from '@money-rank/dataconnect';

// The `UpsertMyProfileWithAvatar` mutation requires an argument of type `UpsertMyProfileWithAvatarVariables`:
const upsertMyProfileWithAvatarVars: UpsertMyProfileWithAvatarVariables = {
  preferredName: ..., 
  classGroup: ..., 
  avatarId: ..., 
};

// Call the `upsertMyProfileWithAvatar()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMyProfileWithAvatar(upsertMyProfileWithAvatarVars);
// Variables can be defined inline as well.
const { data } = await upsertMyProfileWithAvatar({ preferredName: ..., classGroup: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMyProfileWithAvatar(dataConnect, upsertMyProfileWithAvatarVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertMyProfileWithAvatar(upsertMyProfileWithAvatarVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertMyProfileWithAvatar`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileWithAvatarRef, UpsertMyProfileWithAvatarVariables } from '@money-rank/dataconnect';

// The `UpsertMyProfileWithAvatar` mutation requires an argument of type `UpsertMyProfileWithAvatarVariables`:
const upsertMyProfileWithAvatarVars: UpsertMyProfileWithAvatarVariables = {
  preferredName: ..., 
  classGroup: ..., 
  avatarId: ..., 
};

// Call the `upsertMyProfileWithAvatarRef()` function to get a reference to the mutation.
const ref = upsertMyProfileWithAvatarRef(upsertMyProfileWithAvatarVars);
// Variables can be defined inline as well.
const ref = upsertMyProfileWithAvatarRef({ preferredName: ..., classGroup: ..., avatarId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMyProfileWithAvatarRef(dataConnect, upsertMyProfileWithAvatarVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateLearningModuleVersionEditorial
You can execute the `CreateLearningModuleVersionEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createLearningModuleVersionEditorial(vars: CreateLearningModuleVersionEditorialVariables): MutationPromise<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;

interface CreateLearningModuleVersionEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateLearningModuleVersionEditorialVariables): MutationRef<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;
}
export const createLearningModuleVersionEditorialRef: CreateLearningModuleVersionEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createLearningModuleVersionEditorial(dc: DataConnect, vars: CreateLearningModuleVersionEditorialVariables): MutationPromise<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;

interface CreateLearningModuleVersionEditorialRef {
  ...
  (dc: DataConnect, vars: CreateLearningModuleVersionEditorialVariables): MutationRef<CreateLearningModuleVersionEditorialData, CreateLearningModuleVersionEditorialVariables>;
}
export const createLearningModuleVersionEditorialRef: CreateLearningModuleVersionEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createLearningModuleVersionEditorialRef:
```typescript
const name = createLearningModuleVersionEditorialRef.operationName;
console.log(name);
```

### Variables
The `CreateLearningModuleVersionEditorial` mutation requires an argument of type `CreateLearningModuleVersionEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateLearningModuleVersionEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateLearningModuleVersionEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateLearningModuleVersionEditorialData {
  learningModuleVersion_insert: LearningModuleVersion_Key;
  editorialAuditLog_insert: EditorialAuditLog_Key;
}
```
### Using `CreateLearningModuleVersionEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createLearningModuleVersionEditorial, CreateLearningModuleVersionEditorialVariables } from '@money-rank/dataconnect';

// The `CreateLearningModuleVersionEditorial` mutation requires an argument of type `CreateLearningModuleVersionEditorialVariables`:
const createLearningModuleVersionEditorialVars: CreateLearningModuleVersionEditorialVariables = {
  versionId: ..., 
  moduleKey: ..., 
  phaseNumber: ..., 
  version: ..., 
  status: ..., 
  publicationKey: ..., // optional
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
  publishedByUid: ..., // optional
  publishedAt: ..., // optional
};

// Call the `createLearningModuleVersionEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createLearningModuleVersionEditorial(createLearningModuleVersionEditorialVars);
// Variables can be defined inline as well.
const { data } = await createLearningModuleVersionEditorial({ versionId: ..., moduleKey: ..., phaseNumber: ..., version: ..., status: ..., publicationKey: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., publishedByUid: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createLearningModuleVersionEditorial(dataConnect, createLearningModuleVersionEditorialVars);

console.log(data.learningModuleVersion_insert);
console.log(data.editorialAuditLog_insert);

// Or, you can use the `Promise` API.
createLearningModuleVersionEditorial(createLearningModuleVersionEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersion_insert);
  console.log(data.editorialAuditLog_insert);
});
```

### Using `CreateLearningModuleVersionEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createLearningModuleVersionEditorialRef, CreateLearningModuleVersionEditorialVariables } from '@money-rank/dataconnect';

// The `CreateLearningModuleVersionEditorial` mutation requires an argument of type `CreateLearningModuleVersionEditorialVariables`:
const createLearningModuleVersionEditorialVars: CreateLearningModuleVersionEditorialVariables = {
  versionId: ..., 
  moduleKey: ..., 
  phaseNumber: ..., 
  version: ..., 
  status: ..., 
  publicationKey: ..., // optional
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
  publishedByUid: ..., // optional
  publishedAt: ..., // optional
};

// Call the `createLearningModuleVersionEditorialRef()` function to get a reference to the mutation.
const ref = createLearningModuleVersionEditorialRef(createLearningModuleVersionEditorialVars);
// Variables can be defined inline as well.
const ref = createLearningModuleVersionEditorialRef({ versionId: ..., moduleKey: ..., phaseNumber: ..., version: ..., status: ..., publicationKey: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., publishedByUid: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createLearningModuleVersionEditorialRef(dataConnect, createLearningModuleVersionEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.learningModuleVersion_insert);
console.log(data.editorialAuditLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersion_insert);
  console.log(data.editorialAuditLog_insert);
});
```

## CreateActivityDefinitionVersionEditorial
You can execute the `CreateActivityDefinitionVersionEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createActivityDefinitionVersionEditorial(vars: CreateActivityDefinitionVersionEditorialVariables): MutationPromise<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;

interface CreateActivityDefinitionVersionEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateActivityDefinitionVersionEditorialVariables): MutationRef<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;
}
export const createActivityDefinitionVersionEditorialRef: CreateActivityDefinitionVersionEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createActivityDefinitionVersionEditorial(dc: DataConnect, vars: CreateActivityDefinitionVersionEditorialVariables): MutationPromise<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;

interface CreateActivityDefinitionVersionEditorialRef {
  ...
  (dc: DataConnect, vars: CreateActivityDefinitionVersionEditorialVariables): MutationRef<CreateActivityDefinitionVersionEditorialData, CreateActivityDefinitionVersionEditorialVariables>;
}
export const createActivityDefinitionVersionEditorialRef: CreateActivityDefinitionVersionEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createActivityDefinitionVersionEditorialRef:
```typescript
const name = createActivityDefinitionVersionEditorialRef.operationName;
console.log(name);
```

### Variables
The `CreateActivityDefinitionVersionEditorial` mutation requires an argument of type `CreateActivityDefinitionVersionEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateActivityDefinitionVersionEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateActivityDefinitionVersionEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateActivityDefinitionVersionEditorialData {
  activityDefinitionVersion_insert: ActivityDefinitionVersion_Key;
  editorialAuditLog_insert: EditorialAuditLog_Key;
}
```
### Using `CreateActivityDefinitionVersionEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createActivityDefinitionVersionEditorial, CreateActivityDefinitionVersionEditorialVariables } from '@money-rank/dataconnect';

// The `CreateActivityDefinitionVersionEditorial` mutation requires an argument of type `CreateActivityDefinitionVersionEditorialVariables`:
const createActivityDefinitionVersionEditorialVars: CreateActivityDefinitionVersionEditorialVariables = {
  versionId: ..., 
  activityKey: ..., 
  phaseNumber: ..., 
  version: ..., 
  status: ..., 
  publicationKey: ..., // optional
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
  publishedByUid: ..., // optional
  publishedAt: ..., // optional
};

// Call the `createActivityDefinitionVersionEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createActivityDefinitionVersionEditorial(createActivityDefinitionVersionEditorialVars);
// Variables can be defined inline as well.
const { data } = await createActivityDefinitionVersionEditorial({ versionId: ..., activityKey: ..., phaseNumber: ..., version: ..., status: ..., publicationKey: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., publishedByUid: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createActivityDefinitionVersionEditorial(dataConnect, createActivityDefinitionVersionEditorialVars);

console.log(data.activityDefinitionVersion_insert);
console.log(data.editorialAuditLog_insert);

// Or, you can use the `Promise` API.
createActivityDefinitionVersionEditorial(createActivityDefinitionVersionEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersion_insert);
  console.log(data.editorialAuditLog_insert);
});
```

### Using `CreateActivityDefinitionVersionEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createActivityDefinitionVersionEditorialRef, CreateActivityDefinitionVersionEditorialVariables } from '@money-rank/dataconnect';

// The `CreateActivityDefinitionVersionEditorial` mutation requires an argument of type `CreateActivityDefinitionVersionEditorialVariables`:
const createActivityDefinitionVersionEditorialVars: CreateActivityDefinitionVersionEditorialVariables = {
  versionId: ..., 
  activityKey: ..., 
  phaseNumber: ..., 
  version: ..., 
  status: ..., 
  publicationKey: ..., // optional
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
  publishedByUid: ..., // optional
  publishedAt: ..., // optional
};

// Call the `createActivityDefinitionVersionEditorialRef()` function to get a reference to the mutation.
const ref = createActivityDefinitionVersionEditorialRef(createActivityDefinitionVersionEditorialVars);
// Variables can be defined inline as well.
const ref = createActivityDefinitionVersionEditorialRef({ versionId: ..., activityKey: ..., phaseNumber: ..., version: ..., status: ..., publicationKey: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., publishedByUid: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createActivityDefinitionVersionEditorialRef(dataConnect, createActivityDefinitionVersionEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityDefinitionVersion_insert);
console.log(data.editorialAuditLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersion_insert);
  console.log(data.editorialAuditLog_insert);
});
```

## UpsertLearningModuleSeed
You can execute the `UpsertLearningModuleSeed` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertLearningModuleSeed(vars: UpsertLearningModuleSeedVariables): MutationPromise<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;

interface UpsertLearningModuleSeedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertLearningModuleSeedVariables): MutationRef<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;
}
export const upsertLearningModuleSeedRef: UpsertLearningModuleSeedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertLearningModuleSeed(dc: DataConnect, vars: UpsertLearningModuleSeedVariables): MutationPromise<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;

interface UpsertLearningModuleSeedRef {
  ...
  (dc: DataConnect, vars: UpsertLearningModuleSeedVariables): MutationRef<UpsertLearningModuleSeedData, UpsertLearningModuleSeedVariables>;
}
export const upsertLearningModuleSeedRef: UpsertLearningModuleSeedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertLearningModuleSeedRef:
```typescript
const name = upsertLearningModuleSeedRef.operationName;
console.log(name);
```

### Variables
The `UpsertLearningModuleSeed` mutation requires an argument of type `UpsertLearningModuleSeedVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertLearningModuleSeedVariables {
  versionId: UUIDString;
  auditId: UUIDString;
  moduleKey: string;
  phaseNumber: number;
  title: string;
  payload: unknown;
  publishedAt: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertLearningModuleSeed` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertLearningModuleSeedData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertLearningModuleSeedData {
  learningModuleVersion_upsert: LearningModuleVersion_Key;
  editorialAuditLog_upsert: EditorialAuditLog_Key;
}
```
### Using `UpsertLearningModuleSeed`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertLearningModuleSeed, UpsertLearningModuleSeedVariables } from '@money-rank/dataconnect';

// The `UpsertLearningModuleSeed` mutation requires an argument of type `UpsertLearningModuleSeedVariables`:
const upsertLearningModuleSeedVars: UpsertLearningModuleSeedVariables = {
  versionId: ..., 
  auditId: ..., 
  moduleKey: ..., 
  phaseNumber: ..., 
  title: ..., 
  payload: ..., 
  publishedAt: ..., 
};

// Call the `upsertLearningModuleSeed()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertLearningModuleSeed(upsertLearningModuleSeedVars);
// Variables can be defined inline as well.
const { data } = await upsertLearningModuleSeed({ versionId: ..., auditId: ..., moduleKey: ..., phaseNumber: ..., title: ..., payload: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertLearningModuleSeed(dataConnect, upsertLearningModuleSeedVars);

console.log(data.learningModuleVersion_upsert);
console.log(data.editorialAuditLog_upsert);

// Or, you can use the `Promise` API.
upsertLearningModuleSeed(upsertLearningModuleSeedVars).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersion_upsert);
  console.log(data.editorialAuditLog_upsert);
});
```

### Using `UpsertLearningModuleSeed`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertLearningModuleSeedRef, UpsertLearningModuleSeedVariables } from '@money-rank/dataconnect';

// The `UpsertLearningModuleSeed` mutation requires an argument of type `UpsertLearningModuleSeedVariables`:
const upsertLearningModuleSeedVars: UpsertLearningModuleSeedVariables = {
  versionId: ..., 
  auditId: ..., 
  moduleKey: ..., 
  phaseNumber: ..., 
  title: ..., 
  payload: ..., 
  publishedAt: ..., 
};

// Call the `upsertLearningModuleSeedRef()` function to get a reference to the mutation.
const ref = upsertLearningModuleSeedRef(upsertLearningModuleSeedVars);
// Variables can be defined inline as well.
const ref = upsertLearningModuleSeedRef({ versionId: ..., auditId: ..., moduleKey: ..., phaseNumber: ..., title: ..., payload: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertLearningModuleSeedRef(dataConnect, upsertLearningModuleSeedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.learningModuleVersion_upsert);
console.log(data.editorialAuditLog_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.learningModuleVersion_upsert);
  console.log(data.editorialAuditLog_upsert);
});
```

## UpsertActivityDefinitionSeed
You can execute the `UpsertActivityDefinitionSeed` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertActivityDefinitionSeed(vars: UpsertActivityDefinitionSeedVariables): MutationPromise<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;

interface UpsertActivityDefinitionSeedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityDefinitionSeedVariables): MutationRef<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;
}
export const upsertActivityDefinitionSeedRef: UpsertActivityDefinitionSeedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertActivityDefinitionSeed(dc: DataConnect, vars: UpsertActivityDefinitionSeedVariables): MutationPromise<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;

interface UpsertActivityDefinitionSeedRef {
  ...
  (dc: DataConnect, vars: UpsertActivityDefinitionSeedVariables): MutationRef<UpsertActivityDefinitionSeedData, UpsertActivityDefinitionSeedVariables>;
}
export const upsertActivityDefinitionSeedRef: UpsertActivityDefinitionSeedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertActivityDefinitionSeedRef:
```typescript
const name = upsertActivityDefinitionSeedRef.operationName;
console.log(name);
```

### Variables
The `UpsertActivityDefinitionSeed` mutation requires an argument of type `UpsertActivityDefinitionSeedVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertActivityDefinitionSeedVariables {
  versionId: UUIDString;
  auditId: UUIDString;
  activityKey: string;
  phaseNumber: number;
  title: string;
  payload: unknown;
  publishedAt: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertActivityDefinitionSeed` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertActivityDefinitionSeedData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertActivityDefinitionSeedData {
  activityDefinitionVersion_upsert: ActivityDefinitionVersion_Key;
  editorialAuditLog_upsert: EditorialAuditLog_Key;
}
```
### Using `UpsertActivityDefinitionSeed`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertActivityDefinitionSeed, UpsertActivityDefinitionSeedVariables } from '@money-rank/dataconnect';

// The `UpsertActivityDefinitionSeed` mutation requires an argument of type `UpsertActivityDefinitionSeedVariables`:
const upsertActivityDefinitionSeedVars: UpsertActivityDefinitionSeedVariables = {
  versionId: ..., 
  auditId: ..., 
  activityKey: ..., 
  phaseNumber: ..., 
  title: ..., 
  payload: ..., 
  publishedAt: ..., 
};

// Call the `upsertActivityDefinitionSeed()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertActivityDefinitionSeed(upsertActivityDefinitionSeedVars);
// Variables can be defined inline as well.
const { data } = await upsertActivityDefinitionSeed({ versionId: ..., auditId: ..., activityKey: ..., phaseNumber: ..., title: ..., payload: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertActivityDefinitionSeed(dataConnect, upsertActivityDefinitionSeedVars);

console.log(data.activityDefinitionVersion_upsert);
console.log(data.editorialAuditLog_upsert);

// Or, you can use the `Promise` API.
upsertActivityDefinitionSeed(upsertActivityDefinitionSeedVars).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersion_upsert);
  console.log(data.editorialAuditLog_upsert);
});
```

### Using `UpsertActivityDefinitionSeed`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertActivityDefinitionSeedRef, UpsertActivityDefinitionSeedVariables } from '@money-rank/dataconnect';

// The `UpsertActivityDefinitionSeed` mutation requires an argument of type `UpsertActivityDefinitionSeedVariables`:
const upsertActivityDefinitionSeedVars: UpsertActivityDefinitionSeedVariables = {
  versionId: ..., 
  auditId: ..., 
  activityKey: ..., 
  phaseNumber: ..., 
  title: ..., 
  payload: ..., 
  publishedAt: ..., 
};

// Call the `upsertActivityDefinitionSeedRef()` function to get a reference to the mutation.
const ref = upsertActivityDefinitionSeedRef(upsertActivityDefinitionSeedVars);
// Variables can be defined inline as well.
const ref = upsertActivityDefinitionSeedRef({ versionId: ..., auditId: ..., activityKey: ..., phaseNumber: ..., title: ..., payload: ..., publishedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertActivityDefinitionSeedRef(dataConnect, upsertActivityDefinitionSeedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityDefinitionVersion_upsert);
console.log(data.editorialAuditLog_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityDefinitionVersion_upsert);
  console.log(data.editorialAuditLog_upsert);
});
```

## UpdateLearningModuleDraftEditorial
You can execute the `UpdateLearningModuleDraftEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateLearningModuleDraftEditorial(vars: UpdateLearningModuleDraftEditorialVariables): MutationPromise<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;

interface UpdateLearningModuleDraftEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLearningModuleDraftEditorialVariables): MutationRef<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;
}
export const updateLearningModuleDraftEditorialRef: UpdateLearningModuleDraftEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLearningModuleDraftEditorial(dc: DataConnect, vars: UpdateLearningModuleDraftEditorialVariables): MutationPromise<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;

interface UpdateLearningModuleDraftEditorialRef {
  ...
  (dc: DataConnect, vars: UpdateLearningModuleDraftEditorialVariables): MutationRef<UpdateLearningModuleDraftEditorialData, UpdateLearningModuleDraftEditorialVariables>;
}
export const updateLearningModuleDraftEditorialRef: UpdateLearningModuleDraftEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLearningModuleDraftEditorialRef:
```typescript
const name = updateLearningModuleDraftEditorialRef.operationName;
console.log(name);
```

### Variables
The `UpdateLearningModuleDraftEditorial` mutation requires an argument of type `UpdateLearningModuleDraftEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLearningModuleDraftEditorialVariables {
  versionId: UUIDString;
  title: string;
  changeSummary: string;
  payload: unknown;
  actorUid: string;
}
```
### Return Type
Recall that executing the `UpdateLearningModuleDraftEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLearningModuleDraftEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLearningModuleDraftEditorialData {
  updatedCount?: number | null;
}
```
### Using `UpdateLearningModuleDraftEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLearningModuleDraftEditorial, UpdateLearningModuleDraftEditorialVariables } from '@money-rank/dataconnect';

// The `UpdateLearningModuleDraftEditorial` mutation requires an argument of type `UpdateLearningModuleDraftEditorialVariables`:
const updateLearningModuleDraftEditorialVars: UpdateLearningModuleDraftEditorialVariables = {
  versionId: ..., 
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
};

// Call the `updateLearningModuleDraftEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLearningModuleDraftEditorial(updateLearningModuleDraftEditorialVars);
// Variables can be defined inline as well.
const { data } = await updateLearningModuleDraftEditorial({ versionId: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLearningModuleDraftEditorial(dataConnect, updateLearningModuleDraftEditorialVars);

console.log(data.updatedCount);

// Or, you can use the `Promise` API.
updateLearningModuleDraftEditorial(updateLearningModuleDraftEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.updatedCount);
});
```

### Using `UpdateLearningModuleDraftEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLearningModuleDraftEditorialRef, UpdateLearningModuleDraftEditorialVariables } from '@money-rank/dataconnect';

// The `UpdateLearningModuleDraftEditorial` mutation requires an argument of type `UpdateLearningModuleDraftEditorialVariables`:
const updateLearningModuleDraftEditorialVars: UpdateLearningModuleDraftEditorialVariables = {
  versionId: ..., 
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
};

// Call the `updateLearningModuleDraftEditorialRef()` function to get a reference to the mutation.
const ref = updateLearningModuleDraftEditorialRef(updateLearningModuleDraftEditorialVars);
// Variables can be defined inline as well.
const ref = updateLearningModuleDraftEditorialRef({ versionId: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLearningModuleDraftEditorialRef(dataConnect, updateLearningModuleDraftEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.updatedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.updatedCount);
});
```

## UpdateActivityDefinitionDraftEditorial
You can execute the `UpdateActivityDefinitionDraftEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateActivityDefinitionDraftEditorial(vars: UpdateActivityDefinitionDraftEditorialVariables): MutationPromise<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;

interface UpdateActivityDefinitionDraftEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateActivityDefinitionDraftEditorialVariables): MutationRef<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;
}
export const updateActivityDefinitionDraftEditorialRef: UpdateActivityDefinitionDraftEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateActivityDefinitionDraftEditorial(dc: DataConnect, vars: UpdateActivityDefinitionDraftEditorialVariables): MutationPromise<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;

interface UpdateActivityDefinitionDraftEditorialRef {
  ...
  (dc: DataConnect, vars: UpdateActivityDefinitionDraftEditorialVariables): MutationRef<UpdateActivityDefinitionDraftEditorialData, UpdateActivityDefinitionDraftEditorialVariables>;
}
export const updateActivityDefinitionDraftEditorialRef: UpdateActivityDefinitionDraftEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateActivityDefinitionDraftEditorialRef:
```typescript
const name = updateActivityDefinitionDraftEditorialRef.operationName;
console.log(name);
```

### Variables
The `UpdateActivityDefinitionDraftEditorial` mutation requires an argument of type `UpdateActivityDefinitionDraftEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateActivityDefinitionDraftEditorialVariables {
  versionId: UUIDString;
  title: string;
  changeSummary: string;
  payload: unknown;
  actorUid: string;
}
```
### Return Type
Recall that executing the `UpdateActivityDefinitionDraftEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateActivityDefinitionDraftEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateActivityDefinitionDraftEditorialData {
  updatedCount?: number | null;
}
```
### Using `UpdateActivityDefinitionDraftEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateActivityDefinitionDraftEditorial, UpdateActivityDefinitionDraftEditorialVariables } from '@money-rank/dataconnect';

// The `UpdateActivityDefinitionDraftEditorial` mutation requires an argument of type `UpdateActivityDefinitionDraftEditorialVariables`:
const updateActivityDefinitionDraftEditorialVars: UpdateActivityDefinitionDraftEditorialVariables = {
  versionId: ..., 
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
};

// Call the `updateActivityDefinitionDraftEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateActivityDefinitionDraftEditorial(updateActivityDefinitionDraftEditorialVars);
// Variables can be defined inline as well.
const { data } = await updateActivityDefinitionDraftEditorial({ versionId: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateActivityDefinitionDraftEditorial(dataConnect, updateActivityDefinitionDraftEditorialVars);

console.log(data.updatedCount);

// Or, you can use the `Promise` API.
updateActivityDefinitionDraftEditorial(updateActivityDefinitionDraftEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.updatedCount);
});
```

### Using `UpdateActivityDefinitionDraftEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateActivityDefinitionDraftEditorialRef, UpdateActivityDefinitionDraftEditorialVariables } from '@money-rank/dataconnect';

// The `UpdateActivityDefinitionDraftEditorial` mutation requires an argument of type `UpdateActivityDefinitionDraftEditorialVariables`:
const updateActivityDefinitionDraftEditorialVars: UpdateActivityDefinitionDraftEditorialVariables = {
  versionId: ..., 
  title: ..., 
  changeSummary: ..., 
  payload: ..., 
  actorUid: ..., 
};

// Call the `updateActivityDefinitionDraftEditorialRef()` function to get a reference to the mutation.
const ref = updateActivityDefinitionDraftEditorialRef(updateActivityDefinitionDraftEditorialVars);
// Variables can be defined inline as well.
const ref = updateActivityDefinitionDraftEditorialRef({ versionId: ..., title: ..., changeSummary: ..., payload: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateActivityDefinitionDraftEditorialRef(dataConnect, updateActivityDefinitionDraftEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.updatedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.updatedCount);
});
```

## SubmitLearningModuleForReviewEditorial
You can execute the `SubmitLearningModuleForReviewEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
submitLearningModuleForReviewEditorial(vars: SubmitLearningModuleForReviewEditorialVariables): MutationPromise<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;

interface SubmitLearningModuleForReviewEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitLearningModuleForReviewEditorialVariables): MutationRef<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;
}
export const submitLearningModuleForReviewEditorialRef: SubmitLearningModuleForReviewEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
submitLearningModuleForReviewEditorial(dc: DataConnect, vars: SubmitLearningModuleForReviewEditorialVariables): MutationPromise<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;

interface SubmitLearningModuleForReviewEditorialRef {
  ...
  (dc: DataConnect, vars: SubmitLearningModuleForReviewEditorialVariables): MutationRef<SubmitLearningModuleForReviewEditorialData, SubmitLearningModuleForReviewEditorialVariables>;
}
export const submitLearningModuleForReviewEditorialRef: SubmitLearningModuleForReviewEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the submitLearningModuleForReviewEditorialRef:
```typescript
const name = submitLearningModuleForReviewEditorialRef.operationName;
console.log(name);
```

### Variables
The `SubmitLearningModuleForReviewEditorial` mutation requires an argument of type `SubmitLearningModuleForReviewEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SubmitLearningModuleForReviewEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}
```
### Return Type
Recall that executing the `SubmitLearningModuleForReviewEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SubmitLearningModuleForReviewEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SubmitLearningModuleForReviewEditorialData {
  submittedCount?: number | null;
}
```
### Using `SubmitLearningModuleForReviewEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, submitLearningModuleForReviewEditorial, SubmitLearningModuleForReviewEditorialVariables } from '@money-rank/dataconnect';

// The `SubmitLearningModuleForReviewEditorial` mutation requires an argument of type `SubmitLearningModuleForReviewEditorialVariables`:
const submitLearningModuleForReviewEditorialVars: SubmitLearningModuleForReviewEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `submitLearningModuleForReviewEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await submitLearningModuleForReviewEditorial(submitLearningModuleForReviewEditorialVars);
// Variables can be defined inline as well.
const { data } = await submitLearningModuleForReviewEditorial({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await submitLearningModuleForReviewEditorial(dataConnect, submitLearningModuleForReviewEditorialVars);

console.log(data.submittedCount);

// Or, you can use the `Promise` API.
submitLearningModuleForReviewEditorial(submitLearningModuleForReviewEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.submittedCount);
});
```

### Using `SubmitLearningModuleForReviewEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, submitLearningModuleForReviewEditorialRef, SubmitLearningModuleForReviewEditorialVariables } from '@money-rank/dataconnect';

// The `SubmitLearningModuleForReviewEditorial` mutation requires an argument of type `SubmitLearningModuleForReviewEditorialVariables`:
const submitLearningModuleForReviewEditorialVars: SubmitLearningModuleForReviewEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `submitLearningModuleForReviewEditorialRef()` function to get a reference to the mutation.
const ref = submitLearningModuleForReviewEditorialRef(submitLearningModuleForReviewEditorialVars);
// Variables can be defined inline as well.
const ref = submitLearningModuleForReviewEditorialRef({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = submitLearningModuleForReviewEditorialRef(dataConnect, submitLearningModuleForReviewEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.submittedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.submittedCount);
});
```

## SubmitActivityDefinitionForReviewEditorial
You can execute the `SubmitActivityDefinitionForReviewEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
submitActivityDefinitionForReviewEditorial(vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationPromise<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;

interface SubmitActivityDefinitionForReviewEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationRef<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;
}
export const submitActivityDefinitionForReviewEditorialRef: SubmitActivityDefinitionForReviewEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
submitActivityDefinitionForReviewEditorial(dc: DataConnect, vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationPromise<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;

interface SubmitActivityDefinitionForReviewEditorialRef {
  ...
  (dc: DataConnect, vars: SubmitActivityDefinitionForReviewEditorialVariables): MutationRef<SubmitActivityDefinitionForReviewEditorialData, SubmitActivityDefinitionForReviewEditorialVariables>;
}
export const submitActivityDefinitionForReviewEditorialRef: SubmitActivityDefinitionForReviewEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the submitActivityDefinitionForReviewEditorialRef:
```typescript
const name = submitActivityDefinitionForReviewEditorialRef.operationName;
console.log(name);
```

### Variables
The `SubmitActivityDefinitionForReviewEditorial` mutation requires an argument of type `SubmitActivityDefinitionForReviewEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SubmitActivityDefinitionForReviewEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}
```
### Return Type
Recall that executing the `SubmitActivityDefinitionForReviewEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SubmitActivityDefinitionForReviewEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SubmitActivityDefinitionForReviewEditorialData {
  submittedCount?: number | null;
}
```
### Using `SubmitActivityDefinitionForReviewEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, submitActivityDefinitionForReviewEditorial, SubmitActivityDefinitionForReviewEditorialVariables } from '@money-rank/dataconnect';

// The `SubmitActivityDefinitionForReviewEditorial` mutation requires an argument of type `SubmitActivityDefinitionForReviewEditorialVariables`:
const submitActivityDefinitionForReviewEditorialVars: SubmitActivityDefinitionForReviewEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `submitActivityDefinitionForReviewEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await submitActivityDefinitionForReviewEditorial(submitActivityDefinitionForReviewEditorialVars);
// Variables can be defined inline as well.
const { data } = await submitActivityDefinitionForReviewEditorial({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await submitActivityDefinitionForReviewEditorial(dataConnect, submitActivityDefinitionForReviewEditorialVars);

console.log(data.submittedCount);

// Or, you can use the `Promise` API.
submitActivityDefinitionForReviewEditorial(submitActivityDefinitionForReviewEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.submittedCount);
});
```

### Using `SubmitActivityDefinitionForReviewEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, submitActivityDefinitionForReviewEditorialRef, SubmitActivityDefinitionForReviewEditorialVariables } from '@money-rank/dataconnect';

// The `SubmitActivityDefinitionForReviewEditorial` mutation requires an argument of type `SubmitActivityDefinitionForReviewEditorialVariables`:
const submitActivityDefinitionForReviewEditorialVars: SubmitActivityDefinitionForReviewEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `submitActivityDefinitionForReviewEditorialRef()` function to get a reference to the mutation.
const ref = submitActivityDefinitionForReviewEditorialRef(submitActivityDefinitionForReviewEditorialVars);
// Variables can be defined inline as well.
const ref = submitActivityDefinitionForReviewEditorialRef({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = submitActivityDefinitionForReviewEditorialRef(dataConnect, submitActivityDefinitionForReviewEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.submittedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.submittedCount);
});
```

## PublishLearningModuleVersionEditorial
You can execute the `PublishLearningModuleVersionEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
publishLearningModuleVersionEditorial(vars: PublishLearningModuleVersionEditorialVariables): MutationPromise<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;

interface PublishLearningModuleVersionEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: PublishLearningModuleVersionEditorialVariables): MutationRef<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;
}
export const publishLearningModuleVersionEditorialRef: PublishLearningModuleVersionEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
publishLearningModuleVersionEditorial(dc: DataConnect, vars: PublishLearningModuleVersionEditorialVariables): MutationPromise<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;

interface PublishLearningModuleVersionEditorialRef {
  ...
  (dc: DataConnect, vars: PublishLearningModuleVersionEditorialVariables): MutationRef<PublishLearningModuleVersionEditorialData, PublishLearningModuleVersionEditorialVariables>;
}
export const publishLearningModuleVersionEditorialRef: PublishLearningModuleVersionEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the publishLearningModuleVersionEditorialRef:
```typescript
const name = publishLearningModuleVersionEditorialRef.operationName;
console.log(name);
```

### Variables
The `PublishLearningModuleVersionEditorial` mutation requires an argument of type `PublishLearningModuleVersionEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface PublishLearningModuleVersionEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}
```
### Return Type
Recall that executing the `PublishLearningModuleVersionEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `PublishLearningModuleVersionEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface PublishLearningModuleVersionEditorialData {
  publishedCount?: number | null;
}
```
### Using `PublishLearningModuleVersionEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, publishLearningModuleVersionEditorial, PublishLearningModuleVersionEditorialVariables } from '@money-rank/dataconnect';

// The `PublishLearningModuleVersionEditorial` mutation requires an argument of type `PublishLearningModuleVersionEditorialVariables`:
const publishLearningModuleVersionEditorialVars: PublishLearningModuleVersionEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `publishLearningModuleVersionEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await publishLearningModuleVersionEditorial(publishLearningModuleVersionEditorialVars);
// Variables can be defined inline as well.
const { data } = await publishLearningModuleVersionEditorial({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await publishLearningModuleVersionEditorial(dataConnect, publishLearningModuleVersionEditorialVars);

console.log(data.publishedCount);

// Or, you can use the `Promise` API.
publishLearningModuleVersionEditorial(publishLearningModuleVersionEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.publishedCount);
});
```

### Using `PublishLearningModuleVersionEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, publishLearningModuleVersionEditorialRef, PublishLearningModuleVersionEditorialVariables } from '@money-rank/dataconnect';

// The `PublishLearningModuleVersionEditorial` mutation requires an argument of type `PublishLearningModuleVersionEditorialVariables`:
const publishLearningModuleVersionEditorialVars: PublishLearningModuleVersionEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `publishLearningModuleVersionEditorialRef()` function to get a reference to the mutation.
const ref = publishLearningModuleVersionEditorialRef(publishLearningModuleVersionEditorialVars);
// Variables can be defined inline as well.
const ref = publishLearningModuleVersionEditorialRef({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = publishLearningModuleVersionEditorialRef(dataConnect, publishLearningModuleVersionEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.publishedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.publishedCount);
});
```

## PublishActivityDefinitionVersionEditorial
You can execute the `PublishActivityDefinitionVersionEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
publishActivityDefinitionVersionEditorial(vars: PublishActivityDefinitionVersionEditorialVariables): MutationPromise<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;

interface PublishActivityDefinitionVersionEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: PublishActivityDefinitionVersionEditorialVariables): MutationRef<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;
}
export const publishActivityDefinitionVersionEditorialRef: PublishActivityDefinitionVersionEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
publishActivityDefinitionVersionEditorial(dc: DataConnect, vars: PublishActivityDefinitionVersionEditorialVariables): MutationPromise<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;

interface PublishActivityDefinitionVersionEditorialRef {
  ...
  (dc: DataConnect, vars: PublishActivityDefinitionVersionEditorialVariables): MutationRef<PublishActivityDefinitionVersionEditorialData, PublishActivityDefinitionVersionEditorialVariables>;
}
export const publishActivityDefinitionVersionEditorialRef: PublishActivityDefinitionVersionEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the publishActivityDefinitionVersionEditorialRef:
```typescript
const name = publishActivityDefinitionVersionEditorialRef.operationName;
console.log(name);
```

### Variables
The `PublishActivityDefinitionVersionEditorial` mutation requires an argument of type `PublishActivityDefinitionVersionEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface PublishActivityDefinitionVersionEditorialVariables {
  versionId: UUIDString;
  actorUid: string;
}
```
### Return Type
Recall that executing the `PublishActivityDefinitionVersionEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `PublishActivityDefinitionVersionEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface PublishActivityDefinitionVersionEditorialData {
  publishedCount?: number | null;
}
```
### Using `PublishActivityDefinitionVersionEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, publishActivityDefinitionVersionEditorial, PublishActivityDefinitionVersionEditorialVariables } from '@money-rank/dataconnect';

// The `PublishActivityDefinitionVersionEditorial` mutation requires an argument of type `PublishActivityDefinitionVersionEditorialVariables`:
const publishActivityDefinitionVersionEditorialVars: PublishActivityDefinitionVersionEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `publishActivityDefinitionVersionEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await publishActivityDefinitionVersionEditorial(publishActivityDefinitionVersionEditorialVars);
// Variables can be defined inline as well.
const { data } = await publishActivityDefinitionVersionEditorial({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await publishActivityDefinitionVersionEditorial(dataConnect, publishActivityDefinitionVersionEditorialVars);

console.log(data.publishedCount);

// Or, you can use the `Promise` API.
publishActivityDefinitionVersionEditorial(publishActivityDefinitionVersionEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.publishedCount);
});
```

### Using `PublishActivityDefinitionVersionEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, publishActivityDefinitionVersionEditorialRef, PublishActivityDefinitionVersionEditorialVariables } from '@money-rank/dataconnect';

// The `PublishActivityDefinitionVersionEditorial` mutation requires an argument of type `PublishActivityDefinitionVersionEditorialVariables`:
const publishActivityDefinitionVersionEditorialVars: PublishActivityDefinitionVersionEditorialVariables = {
  versionId: ..., 
  actorUid: ..., 
};

// Call the `publishActivityDefinitionVersionEditorialRef()` function to get a reference to the mutation.
const ref = publishActivityDefinitionVersionEditorialRef(publishActivityDefinitionVersionEditorialVars);
// Variables can be defined inline as well.
const ref = publishActivityDefinitionVersionEditorialRef({ versionId: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = publishActivityDefinitionVersionEditorialRef(dataConnect, publishActivityDefinitionVersionEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.publishedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.publishedCount);
});
```

## CreateResearchReviewEditorial
You can execute the `CreateResearchReviewEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createResearchReviewEditorial(vars: CreateResearchReviewEditorialVariables): MutationPromise<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;

interface CreateResearchReviewEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateResearchReviewEditorialVariables): MutationRef<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;
}
export const createResearchReviewEditorialRef: CreateResearchReviewEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createResearchReviewEditorial(dc: DataConnect, vars: CreateResearchReviewEditorialVariables): MutationPromise<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;

interface CreateResearchReviewEditorialRef {
  ...
  (dc: DataConnect, vars: CreateResearchReviewEditorialVariables): MutationRef<CreateResearchReviewEditorialData, CreateResearchReviewEditorialVariables>;
}
export const createResearchReviewEditorialRef: CreateResearchReviewEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createResearchReviewEditorialRef:
```typescript
const name = createResearchReviewEditorialRef.operationName;
console.log(name);
```

### Variables
The `CreateResearchReviewEditorial` mutation requires an argument of type `CreateResearchReviewEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateResearchReviewEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateResearchReviewEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateResearchReviewEditorialData {
  researchReview_insert: ResearchReview_Key;
  editorialAuditLog_insert: EditorialAuditLog_Key;
}
```
### Using `CreateResearchReviewEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createResearchReviewEditorial, CreateResearchReviewEditorialVariables } from '@money-rank/dataconnect';

// The `CreateResearchReviewEditorial` mutation requires an argument of type `CreateResearchReviewEditorialVariables`:
const createResearchReviewEditorialVars: CreateResearchReviewEditorialVariables = {
  reviewId: ..., 
  activityKey: ..., 
  factKey: ..., 
  title: ..., 
  claim: ..., 
  sourceUrl: ..., 
  proposedBy: ..., 
  actorUid: ..., 
};

// Call the `createResearchReviewEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createResearchReviewEditorial(createResearchReviewEditorialVars);
// Variables can be defined inline as well.
const { data } = await createResearchReviewEditorial({ reviewId: ..., activityKey: ..., factKey: ..., title: ..., claim: ..., sourceUrl: ..., proposedBy: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createResearchReviewEditorial(dataConnect, createResearchReviewEditorialVars);

console.log(data.researchReview_insert);
console.log(data.editorialAuditLog_insert);

// Or, you can use the `Promise` API.
createResearchReviewEditorial(createResearchReviewEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.researchReview_insert);
  console.log(data.editorialAuditLog_insert);
});
```

### Using `CreateResearchReviewEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createResearchReviewEditorialRef, CreateResearchReviewEditorialVariables } from '@money-rank/dataconnect';

// The `CreateResearchReviewEditorial` mutation requires an argument of type `CreateResearchReviewEditorialVariables`:
const createResearchReviewEditorialVars: CreateResearchReviewEditorialVariables = {
  reviewId: ..., 
  activityKey: ..., 
  factKey: ..., 
  title: ..., 
  claim: ..., 
  sourceUrl: ..., 
  proposedBy: ..., 
  actorUid: ..., 
};

// Call the `createResearchReviewEditorialRef()` function to get a reference to the mutation.
const ref = createResearchReviewEditorialRef(createResearchReviewEditorialVars);
// Variables can be defined inline as well.
const ref = createResearchReviewEditorialRef({ reviewId: ..., activityKey: ..., factKey: ..., title: ..., claim: ..., sourceUrl: ..., proposedBy: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createResearchReviewEditorialRef(dataConnect, createResearchReviewEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.researchReview_insert);
console.log(data.editorialAuditLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.researchReview_insert);
  console.log(data.editorialAuditLog_insert);
});
```

## ReviewResearchEditorial
You can execute the `ReviewResearchEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
reviewResearchEditorial(vars: ReviewResearchEditorialVariables): MutationPromise<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;

interface ReviewResearchEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReviewResearchEditorialVariables): MutationRef<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;
}
export const reviewResearchEditorialRef: ReviewResearchEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reviewResearchEditorial(dc: DataConnect, vars: ReviewResearchEditorialVariables): MutationPromise<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;

interface ReviewResearchEditorialRef {
  ...
  (dc: DataConnect, vars: ReviewResearchEditorialVariables): MutationRef<ReviewResearchEditorialData, ReviewResearchEditorialVariables>;
}
export const reviewResearchEditorialRef: ReviewResearchEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reviewResearchEditorialRef:
```typescript
const name = reviewResearchEditorialRef.operationName;
console.log(name);
```

### Variables
The `ReviewResearchEditorial` mutation requires an argument of type `ReviewResearchEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReviewResearchEditorialVariables {
  reviewId: UUIDString;
  status: ResearchReviewStatus;
  reviewNotes?: string | null;
  actorUid: string;
}
```
### Return Type
Recall that executing the `ReviewResearchEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReviewResearchEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReviewResearchEditorialData {
  reviewedCount?: number | null;
}
```
### Using `ReviewResearchEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reviewResearchEditorial, ReviewResearchEditorialVariables } from '@money-rank/dataconnect';

// The `ReviewResearchEditorial` mutation requires an argument of type `ReviewResearchEditorialVariables`:
const reviewResearchEditorialVars: ReviewResearchEditorialVariables = {
  reviewId: ..., 
  status: ..., 
  reviewNotes: ..., // optional
  actorUid: ..., 
};

// Call the `reviewResearchEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reviewResearchEditorial(reviewResearchEditorialVars);
// Variables can be defined inline as well.
const { data } = await reviewResearchEditorial({ reviewId: ..., status: ..., reviewNotes: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reviewResearchEditorial(dataConnect, reviewResearchEditorialVars);

console.log(data.reviewedCount);

// Or, you can use the `Promise` API.
reviewResearchEditorial(reviewResearchEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.reviewedCount);
});
```

### Using `ReviewResearchEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reviewResearchEditorialRef, ReviewResearchEditorialVariables } from '@money-rank/dataconnect';

// The `ReviewResearchEditorial` mutation requires an argument of type `ReviewResearchEditorialVariables`:
const reviewResearchEditorialVars: ReviewResearchEditorialVariables = {
  reviewId: ..., 
  status: ..., 
  reviewNotes: ..., // optional
  actorUid: ..., 
};

// Call the `reviewResearchEditorialRef()` function to get a reference to the mutation.
const ref = reviewResearchEditorialRef(reviewResearchEditorialVars);
// Variables can be defined inline as well.
const ref = reviewResearchEditorialRef({ reviewId: ..., status: ..., reviewNotes: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reviewResearchEditorialRef(dataConnect, reviewResearchEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reviewedCount);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reviewedCount);
});
```

## CreateContentAssetEditorial
You can execute the `CreateContentAssetEditorial` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createContentAssetEditorial(vars: CreateContentAssetEditorialVariables): MutationPromise<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;

interface CreateContentAssetEditorialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateContentAssetEditorialVariables): MutationRef<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;
}
export const createContentAssetEditorialRef: CreateContentAssetEditorialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createContentAssetEditorial(dc: DataConnect, vars: CreateContentAssetEditorialVariables): MutationPromise<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;

interface CreateContentAssetEditorialRef {
  ...
  (dc: DataConnect, vars: CreateContentAssetEditorialVariables): MutationRef<CreateContentAssetEditorialData, CreateContentAssetEditorialVariables>;
}
export const createContentAssetEditorialRef: CreateContentAssetEditorialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createContentAssetEditorialRef:
```typescript
const name = createContentAssetEditorialRef.operationName;
console.log(name);
```

### Variables
The `CreateContentAssetEditorial` mutation requires an argument of type `CreateContentAssetEditorialVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateContentAssetEditorial` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateContentAssetEditorialData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateContentAssetEditorialData {
  createdAsset?: unknown | null;
}
```
### Using `CreateContentAssetEditorial`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createContentAssetEditorial, CreateContentAssetEditorialVariables } from '@money-rank/dataconnect';

// The `CreateContentAssetEditorial` mutation requires an argument of type `CreateContentAssetEditorialVariables`:
const createContentAssetEditorialVars: CreateContentAssetEditorialVariables = {
  assetId: ..., 
  entityType: ..., 
  entityId: ..., 
  assetType: ..., 
  displayName: ..., 
  url: ..., 
  storagePath: ..., 
  mimeType: ..., 
  sizeBytes: ..., 
  sha256: ..., 
  actorUid: ..., 
};

// Call the `createContentAssetEditorial()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createContentAssetEditorial(createContentAssetEditorialVars);
// Variables can be defined inline as well.
const { data } = await createContentAssetEditorial({ assetId: ..., entityType: ..., entityId: ..., assetType: ..., displayName: ..., url: ..., storagePath: ..., mimeType: ..., sizeBytes: ..., sha256: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createContentAssetEditorial(dataConnect, createContentAssetEditorialVars);

console.log(data.createdAsset);

// Or, you can use the `Promise` API.
createContentAssetEditorial(createContentAssetEditorialVars).then((response) => {
  const data = response.data;
  console.log(data.createdAsset);
});
```

### Using `CreateContentAssetEditorial`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createContentAssetEditorialRef, CreateContentAssetEditorialVariables } from '@money-rank/dataconnect';

// The `CreateContentAssetEditorial` mutation requires an argument of type `CreateContentAssetEditorialVariables`:
const createContentAssetEditorialVars: CreateContentAssetEditorialVariables = {
  assetId: ..., 
  entityType: ..., 
  entityId: ..., 
  assetType: ..., 
  displayName: ..., 
  url: ..., 
  storagePath: ..., 
  mimeType: ..., 
  sizeBytes: ..., 
  sha256: ..., 
  actorUid: ..., 
};

// Call the `createContentAssetEditorialRef()` function to get a reference to the mutation.
const ref = createContentAssetEditorialRef(createContentAssetEditorialVars);
// Variables can be defined inline as well.
const ref = createContentAssetEditorialRef({ assetId: ..., entityType: ..., entityId: ..., assetType: ..., displayName: ..., url: ..., storagePath: ..., mimeType: ..., sizeBytes: ..., sha256: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createContentAssetEditorialRef(dataConnect, createContentAssetEditorialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.createdAsset);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.createdAsset);
});
```

## UpsertMyProfileWithPhoto
You can execute the `UpsertMyProfileWithPhoto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertMyProfileWithPhoto(vars: UpsertMyProfileWithPhotoVariables): MutationPromise<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;

interface UpsertMyProfileWithPhotoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileWithPhotoVariables): MutationRef<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;
}
export const upsertMyProfileWithPhotoRef: UpsertMyProfileWithPhotoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMyProfileWithPhoto(dc: DataConnect, vars: UpsertMyProfileWithPhotoVariables): MutationPromise<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;

interface UpsertMyProfileWithPhotoRef {
  ...
  (dc: DataConnect, vars: UpsertMyProfileWithPhotoVariables): MutationRef<UpsertMyProfileWithPhotoData, UpsertMyProfileWithPhotoVariables>;
}
export const upsertMyProfileWithPhotoRef: UpsertMyProfileWithPhotoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMyProfileWithPhotoRef:
```typescript
const name = upsertMyProfileWithPhotoRef.operationName;
console.log(name);
```

### Variables
The `UpsertMyProfileWithPhoto` mutation requires an argument of type `UpsertMyProfileWithPhotoVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertMyProfileWithPhotoVariables {
  preferredName: string;
  classGroup: StudentClass;
  avatarUrl: string;
}
```
### Return Type
Recall that executing the `UpsertMyProfileWithPhoto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMyProfileWithPhotoData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMyProfileWithPhotoData {
  user_upsert: User_Key;
}
```
### Using `UpsertMyProfileWithPhoto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileWithPhoto, UpsertMyProfileWithPhotoVariables } from '@money-rank/dataconnect';

// The `UpsertMyProfileWithPhoto` mutation requires an argument of type `UpsertMyProfileWithPhotoVariables`:
const upsertMyProfileWithPhotoVars: UpsertMyProfileWithPhotoVariables = {
  preferredName: ..., 
  classGroup: ..., 
  avatarUrl: ..., 
};

// Call the `upsertMyProfileWithPhoto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMyProfileWithPhoto(upsertMyProfileWithPhotoVars);
// Variables can be defined inline as well.
const { data } = await upsertMyProfileWithPhoto({ preferredName: ..., classGroup: ..., avatarUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMyProfileWithPhoto(dataConnect, upsertMyProfileWithPhotoVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertMyProfileWithPhoto(upsertMyProfileWithPhotoVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertMyProfileWithPhoto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileWithPhotoRef, UpsertMyProfileWithPhotoVariables } from '@money-rank/dataconnect';

// The `UpsertMyProfileWithPhoto` mutation requires an argument of type `UpsertMyProfileWithPhotoVariables`:
const upsertMyProfileWithPhotoVars: UpsertMyProfileWithPhotoVariables = {
  preferredName: ..., 
  classGroup: ..., 
  avatarUrl: ..., 
};

// Call the `upsertMyProfileWithPhotoRef()` function to get a reference to the mutation.
const ref = upsertMyProfileWithPhotoRef(upsertMyProfileWithPhotoVars);
// Variables can be defined inline as well.
const ref = upsertMyProfileWithPhotoRef({ preferredName: ..., classGroup: ..., avatarUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMyProfileWithPhotoRef(dataConnect, upsertMyProfileWithPhotoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpsertMyProfileWithoutSyncedPhoto
You can execute the `UpsertMyProfileWithoutSyncedPhoto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertMyProfileWithoutSyncedPhoto(vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationPromise<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;

interface UpsertMyProfileWithoutSyncedPhotoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationRef<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;
}
export const upsertMyProfileWithoutSyncedPhotoRef: UpsertMyProfileWithoutSyncedPhotoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMyProfileWithoutSyncedPhoto(dc: DataConnect, vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationPromise<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;

interface UpsertMyProfileWithoutSyncedPhotoRef {
  ...
  (dc: DataConnect, vars: UpsertMyProfileWithoutSyncedPhotoVariables): MutationRef<UpsertMyProfileWithoutSyncedPhotoData, UpsertMyProfileWithoutSyncedPhotoVariables>;
}
export const upsertMyProfileWithoutSyncedPhotoRef: UpsertMyProfileWithoutSyncedPhotoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMyProfileWithoutSyncedPhotoRef:
```typescript
const name = upsertMyProfileWithoutSyncedPhotoRef.operationName;
console.log(name);
```

### Variables
The `UpsertMyProfileWithoutSyncedPhoto` mutation requires an argument of type `UpsertMyProfileWithoutSyncedPhotoVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertMyProfileWithoutSyncedPhotoVariables {
  preferredName: string;
  classGroup: StudentClass;
}
```
### Return Type
Recall that executing the `UpsertMyProfileWithoutSyncedPhoto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMyProfileWithoutSyncedPhotoData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMyProfileWithoutSyncedPhotoData {
  user_upsert: User_Key;
}
```
### Using `UpsertMyProfileWithoutSyncedPhoto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileWithoutSyncedPhoto, UpsertMyProfileWithoutSyncedPhotoVariables } from '@money-rank/dataconnect';

// The `UpsertMyProfileWithoutSyncedPhoto` mutation requires an argument of type `UpsertMyProfileWithoutSyncedPhotoVariables`:
const upsertMyProfileWithoutSyncedPhotoVars: UpsertMyProfileWithoutSyncedPhotoVariables = {
  preferredName: ..., 
  classGroup: ..., 
};

// Call the `upsertMyProfileWithoutSyncedPhoto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMyProfileWithoutSyncedPhoto(upsertMyProfileWithoutSyncedPhotoVars);
// Variables can be defined inline as well.
const { data } = await upsertMyProfileWithoutSyncedPhoto({ preferredName: ..., classGroup: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMyProfileWithoutSyncedPhoto(dataConnect, upsertMyProfileWithoutSyncedPhotoVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertMyProfileWithoutSyncedPhoto(upsertMyProfileWithoutSyncedPhotoVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertMyProfileWithoutSyncedPhoto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMyProfileWithoutSyncedPhotoRef, UpsertMyProfileWithoutSyncedPhotoVariables } from '@money-rank/dataconnect';

// The `UpsertMyProfileWithoutSyncedPhoto` mutation requires an argument of type `UpsertMyProfileWithoutSyncedPhotoVariables`:
const upsertMyProfileWithoutSyncedPhotoVars: UpsertMyProfileWithoutSyncedPhotoVariables = {
  preferredName: ..., 
  classGroup: ..., 
};

// Call the `upsertMyProfileWithoutSyncedPhotoRef()` function to get a reference to the mutation.
const ref = upsertMyProfileWithoutSyncedPhotoRef(upsertMyProfileWithoutSyncedPhotoVars);
// Variables can be defined inline as well.
const ref = upsertMyProfileWithoutSyncedPhotoRef({ preferredName: ..., classGroup: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMyProfileWithoutSyncedPhotoRef(dataConnect, upsertMyProfileWithoutSyncedPhotoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## SetUserRoleByEmail
You can execute the `SetUserRoleByEmail` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
setUserRoleByEmail(vars: SetUserRoleByEmailVariables): MutationPromise<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;

interface SetUserRoleByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetUserRoleByEmailVariables): MutationRef<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;
}
export const setUserRoleByEmailRef: SetUserRoleByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
setUserRoleByEmail(dc: DataConnect, vars: SetUserRoleByEmailVariables): MutationPromise<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;

interface SetUserRoleByEmailRef {
  ...
  (dc: DataConnect, vars: SetUserRoleByEmailVariables): MutationRef<SetUserRoleByEmailData, SetUserRoleByEmailVariables>;
}
export const setUserRoleByEmailRef: SetUserRoleByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the setUserRoleByEmailRef:
```typescript
const name = setUserRoleByEmailRef.operationName;
console.log(name);
```

### Variables
The `SetUserRoleByEmail` mutation requires an argument of type `SetUserRoleByEmailVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SetUserRoleByEmailVariables {
  email: string;
  role: UserRole;
}
```
### Return Type
Recall that executing the `SetUserRoleByEmail` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SetUserRoleByEmailData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SetUserRoleByEmailData {
  updatedUser?: unknown | null;
}
```
### Using `SetUserRoleByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, setUserRoleByEmail, SetUserRoleByEmailVariables } from '@money-rank/dataconnect';

// The `SetUserRoleByEmail` mutation requires an argument of type `SetUserRoleByEmailVariables`:
const setUserRoleByEmailVars: SetUserRoleByEmailVariables = {
  email: ..., 
  role: ..., 
};

// Call the `setUserRoleByEmail()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await setUserRoleByEmail(setUserRoleByEmailVars);
// Variables can be defined inline as well.
const { data } = await setUserRoleByEmail({ email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await setUserRoleByEmail(dataConnect, setUserRoleByEmailVars);

console.log(data.updatedUser);

// Or, you can use the `Promise` API.
setUserRoleByEmail(setUserRoleByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.updatedUser);
});
```

### Using `SetUserRoleByEmail`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, setUserRoleByEmailRef, SetUserRoleByEmailVariables } from '@money-rank/dataconnect';

// The `SetUserRoleByEmail` mutation requires an argument of type `SetUserRoleByEmailVariables`:
const setUserRoleByEmailVars: SetUserRoleByEmailVariables = {
  email: ..., 
  role: ..., 
};

// Call the `setUserRoleByEmailRef()` function to get a reference to the mutation.
const ref = setUserRoleByEmailRef(setUserRoleByEmailVars);
// Variables can be defined inline as well.
const ref = setUserRoleByEmailRef({ email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = setUserRoleByEmailRef(dataConnect, setUserRoleByEmailVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.updatedUser);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.updatedUser);
});
```

## UpsertStudentProgress
You can execute the `UpsertStudentProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertStudentProgress(vars: UpsertStudentProgressVariables): MutationPromise<UpsertStudentProgressData, UpsertStudentProgressVariables>;

interface UpsertStudentProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStudentProgressVariables): MutationRef<UpsertStudentProgressData, UpsertStudentProgressVariables>;
}
export const upsertStudentProgressRef: UpsertStudentProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertStudentProgress(dc: DataConnect, vars: UpsertStudentProgressVariables): MutationPromise<UpsertStudentProgressData, UpsertStudentProgressVariables>;

interface UpsertStudentProgressRef {
  ...
  (dc: DataConnect, vars: UpsertStudentProgressVariables): MutationRef<UpsertStudentProgressData, UpsertStudentProgressVariables>;
}
export const upsertStudentProgressRef: UpsertStudentProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertStudentProgressRef:
```typescript
const name = upsertStudentProgressRef.operationName;
console.log(name);
```

### Variables
The `UpsertStudentProgress` mutation requires an argument of type `UpsertStudentProgressVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertStudentProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertStudentProgressData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertStudentProgressData {
  studentProgress_upsert: StudentProgress_Key;
}
```
### Using `UpsertStudentProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertStudentProgress, UpsertStudentProgressVariables } from '@money-rank/dataconnect';

// The `UpsertStudentProgress` mutation requires an argument of type `UpsertStudentProgressVariables`:
const upsertStudentProgressVars: UpsertStudentProgressVariables = {
  studentUid: ..., 
  phaseNumber: ..., 
  status: ..., 
  score: ..., 
  attempts: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
  startedAt: ..., // optional
  completedAt: ..., // optional
};

// Call the `upsertStudentProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertStudentProgress(upsertStudentProgressVars);
// Variables can be defined inline as well.
const { data } = await upsertStudentProgress({ studentUid: ..., phaseNumber: ..., status: ..., score: ..., attempts: ..., correctAnswers: ..., wrongAnswers: ..., startedAt: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertStudentProgress(dataConnect, upsertStudentProgressVars);

console.log(data.studentProgress_upsert);

// Or, you can use the `Promise` API.
upsertStudentProgress(upsertStudentProgressVars).then((response) => {
  const data = response.data;
  console.log(data.studentProgress_upsert);
});
```

### Using `UpsertStudentProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertStudentProgressRef, UpsertStudentProgressVariables } from '@money-rank/dataconnect';

// The `UpsertStudentProgress` mutation requires an argument of type `UpsertStudentProgressVariables`:
const upsertStudentProgressVars: UpsertStudentProgressVariables = {
  studentUid: ..., 
  phaseNumber: ..., 
  status: ..., 
  score: ..., 
  attempts: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
  startedAt: ..., // optional
  completedAt: ..., // optional
};

// Call the `upsertStudentProgressRef()` function to get a reference to the mutation.
const ref = upsertStudentProgressRef(upsertStudentProgressVars);
// Variables can be defined inline as well.
const ref = upsertStudentProgressRef({ studentUid: ..., phaseNumber: ..., status: ..., score: ..., attempts: ..., correctAnswers: ..., wrongAnswers: ..., startedAt: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertStudentProgressRef(dataConnect, upsertStudentProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studentProgress_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studentProgress_upsert);
});
```

## ApplyCapiCoinTransaction
You can execute the `ApplyCapiCoinTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
applyCapiCoinTransaction(vars: ApplyCapiCoinTransactionVariables): MutationPromise<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;

interface ApplyCapiCoinTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApplyCapiCoinTransactionVariables): MutationRef<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;
}
export const applyCapiCoinTransactionRef: ApplyCapiCoinTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
applyCapiCoinTransaction(dc: DataConnect, vars: ApplyCapiCoinTransactionVariables): MutationPromise<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;

interface ApplyCapiCoinTransactionRef {
  ...
  (dc: DataConnect, vars: ApplyCapiCoinTransactionVariables): MutationRef<ApplyCapiCoinTransactionData, ApplyCapiCoinTransactionVariables>;
}
export const applyCapiCoinTransactionRef: ApplyCapiCoinTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the applyCapiCoinTransactionRef:
```typescript
const name = applyCapiCoinTransactionRef.operationName;
console.log(name);
```

### Variables
The `ApplyCapiCoinTransaction` mutation requires an argument of type `ApplyCapiCoinTransactionVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ApplyCapiCoinTransactionVariables {
  studentUid: string;
  amount: number;
  transactionType: CapiCoinTransactionType;
  reason: string;
  sourceId?: string | null;
}
```
### Return Type
Recall that executing the `ApplyCapiCoinTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ApplyCapiCoinTransactionData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ApplyCapiCoinTransactionData {
  user_update?: User_Key | null;
  capiCoinTransaction_insert: CapiCoinTransaction_Key;
}
```
### Using `ApplyCapiCoinTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, applyCapiCoinTransaction, ApplyCapiCoinTransactionVariables } from '@money-rank/dataconnect';

// The `ApplyCapiCoinTransaction` mutation requires an argument of type `ApplyCapiCoinTransactionVariables`:
const applyCapiCoinTransactionVars: ApplyCapiCoinTransactionVariables = {
  studentUid: ..., 
  amount: ..., 
  transactionType: ..., 
  reason: ..., 
  sourceId: ..., // optional
};

// Call the `applyCapiCoinTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await applyCapiCoinTransaction(applyCapiCoinTransactionVars);
// Variables can be defined inline as well.
const { data } = await applyCapiCoinTransaction({ studentUid: ..., amount: ..., transactionType: ..., reason: ..., sourceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await applyCapiCoinTransaction(dataConnect, applyCapiCoinTransactionVars);

console.log(data.user_update);
console.log(data.capiCoinTransaction_insert);

// Or, you can use the `Promise` API.
applyCapiCoinTransaction(applyCapiCoinTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
  console.log(data.capiCoinTransaction_insert);
});
```

### Using `ApplyCapiCoinTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, applyCapiCoinTransactionRef, ApplyCapiCoinTransactionVariables } from '@money-rank/dataconnect';

// The `ApplyCapiCoinTransaction` mutation requires an argument of type `ApplyCapiCoinTransactionVariables`:
const applyCapiCoinTransactionVars: ApplyCapiCoinTransactionVariables = {
  studentUid: ..., 
  amount: ..., 
  transactionType: ..., 
  reason: ..., 
  sourceId: ..., // optional
};

// Call the `applyCapiCoinTransactionRef()` function to get a reference to the mutation.
const ref = applyCapiCoinTransactionRef(applyCapiCoinTransactionVars);
// Variables can be defined inline as well.
const ref = applyCapiCoinTransactionRef({ studentUid: ..., amount: ..., transactionType: ..., reason: ..., sourceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = applyCapiCoinTransactionRef(dataConnect, applyCapiCoinTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);
console.log(data.capiCoinTransaction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
  console.log(data.capiCoinTransaction_insert);
});
```

## UpsertEconomyConfig
You can execute the `UpsertEconomyConfig` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertEconomyConfig(vars: UpsertEconomyConfigVariables): MutationPromise<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;

interface UpsertEconomyConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEconomyConfigVariables): MutationRef<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;
}
export const upsertEconomyConfigRef: UpsertEconomyConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertEconomyConfig(dc: DataConnect, vars: UpsertEconomyConfigVariables): MutationPromise<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;

interface UpsertEconomyConfigRef {
  ...
  (dc: DataConnect, vars: UpsertEconomyConfigVariables): MutationRef<UpsertEconomyConfigData, UpsertEconomyConfigVariables>;
}
export const upsertEconomyConfigRef: UpsertEconomyConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertEconomyConfigRef:
```typescript
const name = upsertEconomyConfigRef.operationName;
console.log(name);
```

### Variables
The `UpsertEconomyConfig` mutation requires an argument of type `UpsertEconomyConfigVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpsertEconomyConfig` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertEconomyConfigData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertEconomyConfigData {
  economyConfig_upsert: EconomyConfig_Key;
}
```
### Using `UpsertEconomyConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertEconomyConfig, UpsertEconomyConfigVariables } from '@money-rank/dataconnect';

// The `UpsertEconomyConfig` mutation requires an argument of type `UpsertEconomyConfigVariables`:
const upsertEconomyConfigVars: UpsertEconomyConfigVariables = {
  firstContentReward: ..., 
  firstActivityReward: ..., 
  repeatActivityReward: ..., 
  rewardedRepeatLimitPerDay: ..., // optional
  minimumRewardedAttemptIntervalSeconds: ..., 
  streakTier3Percent: ..., 
  streakTier5Percent: ..., 
  streakTier7Percent: ..., 
};

// Call the `upsertEconomyConfig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertEconomyConfig(upsertEconomyConfigVars);
// Variables can be defined inline as well.
const { data } = await upsertEconomyConfig({ firstContentReward: ..., firstActivityReward: ..., repeatActivityReward: ..., rewardedRepeatLimitPerDay: ..., minimumRewardedAttemptIntervalSeconds: ..., streakTier3Percent: ..., streakTier5Percent: ..., streakTier7Percent: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertEconomyConfig(dataConnect, upsertEconomyConfigVars);

console.log(data.economyConfig_upsert);

// Or, you can use the `Promise` API.
upsertEconomyConfig(upsertEconomyConfigVars).then((response) => {
  const data = response.data;
  console.log(data.economyConfig_upsert);
});
```

### Using `UpsertEconomyConfig`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertEconomyConfigRef, UpsertEconomyConfigVariables } from '@money-rank/dataconnect';

// The `UpsertEconomyConfig` mutation requires an argument of type `UpsertEconomyConfigVariables`:
const upsertEconomyConfigVars: UpsertEconomyConfigVariables = {
  firstContentReward: ..., 
  firstActivityReward: ..., 
  repeatActivityReward: ..., 
  rewardedRepeatLimitPerDay: ..., // optional
  minimumRewardedAttemptIntervalSeconds: ..., 
  streakTier3Percent: ..., 
  streakTier5Percent: ..., 
  streakTier7Percent: ..., 
};

// Call the `upsertEconomyConfigRef()` function to get a reference to the mutation.
const ref = upsertEconomyConfigRef(upsertEconomyConfigVars);
// Variables can be defined inline as well.
const ref = upsertEconomyConfigRef({ firstContentReward: ..., firstActivityReward: ..., repeatActivityReward: ..., rewardedRepeatLimitPerDay: ..., minimumRewardedAttemptIntervalSeconds: ..., streakTier3Percent: ..., streakTier5Percent: ..., streakTier7Percent: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertEconomyConfigRef(dataConnect, upsertEconomyConfigVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.economyConfig_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.economyConfig_upsert);
});
```

## CreateCompetitionPeriod
You can execute the `CreateCompetitionPeriod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createCompetitionPeriod(vars: CreateCompetitionPeriodVariables): MutationPromise<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;

interface CreateCompetitionPeriodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCompetitionPeriodVariables): MutationRef<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;
}
export const createCompetitionPeriodRef: CreateCompetitionPeriodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCompetitionPeriod(dc: DataConnect, vars: CreateCompetitionPeriodVariables): MutationPromise<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;

interface CreateCompetitionPeriodRef {
  ...
  (dc: DataConnect, vars: CreateCompetitionPeriodVariables): MutationRef<CreateCompetitionPeriodData, CreateCompetitionPeriodVariables>;
}
export const createCompetitionPeriodRef: CreateCompetitionPeriodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCompetitionPeriodRef:
```typescript
const name = createCompetitionPeriodRef.operationName;
console.log(name);
```

### Variables
The `CreateCompetitionPeriod` mutation requires an argument of type `CreateCompetitionPeriodVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCompetitionPeriodVariables {
  periodId: UUIDString;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  status: CompetitionPeriodStatus;
}
```
### Return Type
Recall that executing the `CreateCompetitionPeriod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCompetitionPeriodData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCompetitionPeriodData {
  createdPeriod?: unknown | null;
}
```
### Using `CreateCompetitionPeriod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCompetitionPeriod, CreateCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `CreateCompetitionPeriod` mutation requires an argument of type `CreateCompetitionPeriodVariables`:
const createCompetitionPeriodVars: CreateCompetitionPeriodVariables = {
  periodId: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  status: ..., 
};

// Call the `createCompetitionPeriod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCompetitionPeriod(createCompetitionPeriodVars);
// Variables can be defined inline as well.
const { data } = await createCompetitionPeriod({ periodId: ..., name: ..., startsAt: ..., endsAt: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCompetitionPeriod(dataConnect, createCompetitionPeriodVars);

console.log(data.createdPeriod);

// Or, you can use the `Promise` API.
createCompetitionPeriod(createCompetitionPeriodVars).then((response) => {
  const data = response.data;
  console.log(data.createdPeriod);
});
```

### Using `CreateCompetitionPeriod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCompetitionPeriodRef, CreateCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `CreateCompetitionPeriod` mutation requires an argument of type `CreateCompetitionPeriodVariables`:
const createCompetitionPeriodVars: CreateCompetitionPeriodVariables = {
  periodId: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  status: ..., 
};

// Call the `createCompetitionPeriodRef()` function to get a reference to the mutation.
const ref = createCompetitionPeriodRef(createCompetitionPeriodVars);
// Variables can be defined inline as well.
const ref = createCompetitionPeriodRef({ periodId: ..., name: ..., startsAt: ..., endsAt: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCompetitionPeriodRef(dataConnect, createCompetitionPeriodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.createdPeriod);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.createdPeriod);
});
```

## UpdateCompetitionPeriodStatus
You can execute the `UpdateCompetitionPeriodStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateCompetitionPeriodStatus(vars: UpdateCompetitionPeriodStatusVariables): MutationPromise<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;

interface UpdateCompetitionPeriodStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCompetitionPeriodStatusVariables): MutationRef<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;
}
export const updateCompetitionPeriodStatusRef: UpdateCompetitionPeriodStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCompetitionPeriodStatus(dc: DataConnect, vars: UpdateCompetitionPeriodStatusVariables): MutationPromise<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;

interface UpdateCompetitionPeriodStatusRef {
  ...
  (dc: DataConnect, vars: UpdateCompetitionPeriodStatusVariables): MutationRef<UpdateCompetitionPeriodStatusData, UpdateCompetitionPeriodStatusVariables>;
}
export const updateCompetitionPeriodStatusRef: UpdateCompetitionPeriodStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCompetitionPeriodStatusRef:
```typescript
const name = updateCompetitionPeriodStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateCompetitionPeriodStatus` mutation requires an argument of type `UpdateCompetitionPeriodStatusVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCompetitionPeriodStatusVariables {
  periodId: UUIDString;
  status: CompetitionPeriodStatus;
}
```
### Return Type
Recall that executing the `UpdateCompetitionPeriodStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCompetitionPeriodStatusData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCompetitionPeriodStatusData {
  updatedPeriod?: unknown | null;
}
```
### Using `UpdateCompetitionPeriodStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCompetitionPeriodStatus, UpdateCompetitionPeriodStatusVariables } from '@money-rank/dataconnect';

// The `UpdateCompetitionPeriodStatus` mutation requires an argument of type `UpdateCompetitionPeriodStatusVariables`:
const updateCompetitionPeriodStatusVars: UpdateCompetitionPeriodStatusVariables = {
  periodId: ..., 
  status: ..., 
};

// Call the `updateCompetitionPeriodStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCompetitionPeriodStatus(updateCompetitionPeriodStatusVars);
// Variables can be defined inline as well.
const { data } = await updateCompetitionPeriodStatus({ periodId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCompetitionPeriodStatus(dataConnect, updateCompetitionPeriodStatusVars);

console.log(data.updatedPeriod);

// Or, you can use the `Promise` API.
updateCompetitionPeriodStatus(updateCompetitionPeriodStatusVars).then((response) => {
  const data = response.data;
  console.log(data.updatedPeriod);
});
```

### Using `UpdateCompetitionPeriodStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCompetitionPeriodStatusRef, UpdateCompetitionPeriodStatusVariables } from '@money-rank/dataconnect';

// The `UpdateCompetitionPeriodStatus` mutation requires an argument of type `UpdateCompetitionPeriodStatusVariables`:
const updateCompetitionPeriodStatusVars: UpdateCompetitionPeriodStatusVariables = {
  periodId: ..., 
  status: ..., 
};

// Call the `updateCompetitionPeriodStatusRef()` function to get a reference to the mutation.
const ref = updateCompetitionPeriodStatusRef(updateCompetitionPeriodStatusVars);
// Variables can be defined inline as well.
const ref = updateCompetitionPeriodStatusRef({ periodId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCompetitionPeriodStatusRef(dataConnect, updateCompetitionPeriodStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.updatedPeriod);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.updatedPeriod);
});
```

## CreateTeacherCompetitionPeriod
You can execute the `CreateTeacherCompetitionPeriod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createTeacherCompetitionPeriod(vars: CreateTeacherCompetitionPeriodVariables): MutationPromise<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;

interface CreateTeacherCompetitionPeriodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTeacherCompetitionPeriodVariables): MutationRef<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;
}
export const createTeacherCompetitionPeriodRef: CreateTeacherCompetitionPeriodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTeacherCompetitionPeriod(dc: DataConnect, vars: CreateTeacherCompetitionPeriodVariables): MutationPromise<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;

interface CreateTeacherCompetitionPeriodRef {
  ...
  (dc: DataConnect, vars: CreateTeacherCompetitionPeriodVariables): MutationRef<CreateTeacherCompetitionPeriodData, CreateTeacherCompetitionPeriodVariables>;
}
export const createTeacherCompetitionPeriodRef: CreateTeacherCompetitionPeriodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTeacherCompetitionPeriodRef:
```typescript
const name = createTeacherCompetitionPeriodRef.operationName;
console.log(name);
```

### Variables
The `CreateTeacherCompetitionPeriod` mutation requires an argument of type `CreateTeacherCompetitionPeriodVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTeacherCompetitionPeriodVariables {
  periodId: UUIDString;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  status: CompetitionPeriodStatus;
  actorUid: string;
}
```
### Return Type
Recall that executing the `CreateTeacherCompetitionPeriod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTeacherCompetitionPeriodData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTeacherCompetitionPeriodData {
  createdPeriod?: unknown | null;
}
```
### Using `CreateTeacherCompetitionPeriod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTeacherCompetitionPeriod, CreateTeacherCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `CreateTeacherCompetitionPeriod` mutation requires an argument of type `CreateTeacherCompetitionPeriodVariables`:
const createTeacherCompetitionPeriodVars: CreateTeacherCompetitionPeriodVariables = {
  periodId: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  status: ..., 
  actorUid: ..., 
};

// Call the `createTeacherCompetitionPeriod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTeacherCompetitionPeriod(createTeacherCompetitionPeriodVars);
// Variables can be defined inline as well.
const { data } = await createTeacherCompetitionPeriod({ periodId: ..., name: ..., startsAt: ..., endsAt: ..., status: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTeacherCompetitionPeriod(dataConnect, createTeacherCompetitionPeriodVars);

console.log(data.createdPeriod);

// Or, you can use the `Promise` API.
createTeacherCompetitionPeriod(createTeacherCompetitionPeriodVars).then((response) => {
  const data = response.data;
  console.log(data.createdPeriod);
});
```

### Using `CreateTeacherCompetitionPeriod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTeacherCompetitionPeriodRef, CreateTeacherCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `CreateTeacherCompetitionPeriod` mutation requires an argument of type `CreateTeacherCompetitionPeriodVariables`:
const createTeacherCompetitionPeriodVars: CreateTeacherCompetitionPeriodVariables = {
  periodId: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  status: ..., 
  actorUid: ..., 
};

// Call the `createTeacherCompetitionPeriodRef()` function to get a reference to the mutation.
const ref = createTeacherCompetitionPeriodRef(createTeacherCompetitionPeriodVars);
// Variables can be defined inline as well.
const ref = createTeacherCompetitionPeriodRef({ periodId: ..., name: ..., startsAt: ..., endsAt: ..., status: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTeacherCompetitionPeriodRef(dataConnect, createTeacherCompetitionPeriodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.createdPeriod);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.createdPeriod);
});
```

## UpdateTeacherCompetitionPeriod
You can execute the `UpdateTeacherCompetitionPeriod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateTeacherCompetitionPeriod(vars: UpdateTeacherCompetitionPeriodVariables): MutationPromise<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;

interface UpdateTeacherCompetitionPeriodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTeacherCompetitionPeriodVariables): MutationRef<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;
}
export const updateTeacherCompetitionPeriodRef: UpdateTeacherCompetitionPeriodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTeacherCompetitionPeriod(dc: DataConnect, vars: UpdateTeacherCompetitionPeriodVariables): MutationPromise<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;

interface UpdateTeacherCompetitionPeriodRef {
  ...
  (dc: DataConnect, vars: UpdateTeacherCompetitionPeriodVariables): MutationRef<UpdateTeacherCompetitionPeriodData, UpdateTeacherCompetitionPeriodVariables>;
}
export const updateTeacherCompetitionPeriodRef: UpdateTeacherCompetitionPeriodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTeacherCompetitionPeriodRef:
```typescript
const name = updateTeacherCompetitionPeriodRef.operationName;
console.log(name);
```

### Variables
The `UpdateTeacherCompetitionPeriod` mutation requires an argument of type `UpdateTeacherCompetitionPeriodVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTeacherCompetitionPeriodVariables {
  periodId: UUIDString;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  actorUid: string;
}
```
### Return Type
Recall that executing the `UpdateTeacherCompetitionPeriod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTeacherCompetitionPeriodData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTeacherCompetitionPeriodData {
  updatedPeriod?: unknown | null;
}
```
### Using `UpdateTeacherCompetitionPeriod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTeacherCompetitionPeriod, UpdateTeacherCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `UpdateTeacherCompetitionPeriod` mutation requires an argument of type `UpdateTeacherCompetitionPeriodVariables`:
const updateTeacherCompetitionPeriodVars: UpdateTeacherCompetitionPeriodVariables = {
  periodId: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  actorUid: ..., 
};

// Call the `updateTeacherCompetitionPeriod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTeacherCompetitionPeriod(updateTeacherCompetitionPeriodVars);
// Variables can be defined inline as well.
const { data } = await updateTeacherCompetitionPeriod({ periodId: ..., name: ..., startsAt: ..., endsAt: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTeacherCompetitionPeriod(dataConnect, updateTeacherCompetitionPeriodVars);

console.log(data.updatedPeriod);

// Or, you can use the `Promise` API.
updateTeacherCompetitionPeriod(updateTeacherCompetitionPeriodVars).then((response) => {
  const data = response.data;
  console.log(data.updatedPeriod);
});
```

### Using `UpdateTeacherCompetitionPeriod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTeacherCompetitionPeriodRef, UpdateTeacherCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `UpdateTeacherCompetitionPeriod` mutation requires an argument of type `UpdateTeacherCompetitionPeriodVariables`:
const updateTeacherCompetitionPeriodVars: UpdateTeacherCompetitionPeriodVariables = {
  periodId: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  actorUid: ..., 
};

// Call the `updateTeacherCompetitionPeriodRef()` function to get a reference to the mutation.
const ref = updateTeacherCompetitionPeriodRef(updateTeacherCompetitionPeriodVars);
// Variables can be defined inline as well.
const ref = updateTeacherCompetitionPeriodRef({ periodId: ..., name: ..., startsAt: ..., endsAt: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTeacherCompetitionPeriodRef(dataConnect, updateTeacherCompetitionPeriodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.updatedPeriod);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.updatedPeriod);
});
```

## SetTeacherCompetitionPeriodStatus
You can execute the `SetTeacherCompetitionPeriodStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
setTeacherCompetitionPeriodStatus(vars: SetTeacherCompetitionPeriodStatusVariables): MutationPromise<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;

interface SetTeacherCompetitionPeriodStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SetTeacherCompetitionPeriodStatusVariables): MutationRef<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;
}
export const setTeacherCompetitionPeriodStatusRef: SetTeacherCompetitionPeriodStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
setTeacherCompetitionPeriodStatus(dc: DataConnect, vars: SetTeacherCompetitionPeriodStatusVariables): MutationPromise<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;

interface SetTeacherCompetitionPeriodStatusRef {
  ...
  (dc: DataConnect, vars: SetTeacherCompetitionPeriodStatusVariables): MutationRef<SetTeacherCompetitionPeriodStatusData, SetTeacherCompetitionPeriodStatusVariables>;
}
export const setTeacherCompetitionPeriodStatusRef: SetTeacherCompetitionPeriodStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the setTeacherCompetitionPeriodStatusRef:
```typescript
const name = setTeacherCompetitionPeriodStatusRef.operationName;
console.log(name);
```

### Variables
The `SetTeacherCompetitionPeriodStatus` mutation requires an argument of type `SetTeacherCompetitionPeriodStatusVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SetTeacherCompetitionPeriodStatusVariables {
  periodId: UUIDString;
  status: CompetitionPeriodStatus;
  actorUid: string;
}
```
### Return Type
Recall that executing the `SetTeacherCompetitionPeriodStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SetTeacherCompetitionPeriodStatusData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SetTeacherCompetitionPeriodStatusData {
  updatedPeriod?: unknown | null;
}
```
### Using `SetTeacherCompetitionPeriodStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, setTeacherCompetitionPeriodStatus, SetTeacherCompetitionPeriodStatusVariables } from '@money-rank/dataconnect';

// The `SetTeacherCompetitionPeriodStatus` mutation requires an argument of type `SetTeacherCompetitionPeriodStatusVariables`:
const setTeacherCompetitionPeriodStatusVars: SetTeacherCompetitionPeriodStatusVariables = {
  periodId: ..., 
  status: ..., 
  actorUid: ..., 
};

// Call the `setTeacherCompetitionPeriodStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await setTeacherCompetitionPeriodStatus(setTeacherCompetitionPeriodStatusVars);
// Variables can be defined inline as well.
const { data } = await setTeacherCompetitionPeriodStatus({ periodId: ..., status: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await setTeacherCompetitionPeriodStatus(dataConnect, setTeacherCompetitionPeriodStatusVars);

console.log(data.updatedPeriod);

// Or, you can use the `Promise` API.
setTeacherCompetitionPeriodStatus(setTeacherCompetitionPeriodStatusVars).then((response) => {
  const data = response.data;
  console.log(data.updatedPeriod);
});
```

### Using `SetTeacherCompetitionPeriodStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, setTeacherCompetitionPeriodStatusRef, SetTeacherCompetitionPeriodStatusVariables } from '@money-rank/dataconnect';

// The `SetTeacherCompetitionPeriodStatus` mutation requires an argument of type `SetTeacherCompetitionPeriodStatusVariables`:
const setTeacherCompetitionPeriodStatusVars: SetTeacherCompetitionPeriodStatusVariables = {
  periodId: ..., 
  status: ..., 
  actorUid: ..., 
};

// Call the `setTeacherCompetitionPeriodStatusRef()` function to get a reference to the mutation.
const ref = setTeacherCompetitionPeriodStatusRef(setTeacherCompetitionPeriodStatusVars);
// Variables can be defined inline as well.
const ref = setTeacherCompetitionPeriodStatusRef({ periodId: ..., status: ..., actorUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = setTeacherCompetitionPeriodStatusRef(dataConnect, setTeacherCompetitionPeriodStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.updatedPeriod);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.updatedPeriod);
});
```

## CreateAuthoritativeActivitySession
You can execute the `CreateAuthoritativeActivitySession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createAuthoritativeActivitySession(vars: CreateAuthoritativeActivitySessionVariables): MutationPromise<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;

interface CreateAuthoritativeActivitySessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuthoritativeActivitySessionVariables): MutationRef<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;
}
export const createAuthoritativeActivitySessionRef: CreateAuthoritativeActivitySessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAuthoritativeActivitySession(dc: DataConnect, vars: CreateAuthoritativeActivitySessionVariables): MutationPromise<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;

interface CreateAuthoritativeActivitySessionRef {
  ...
  (dc: DataConnect, vars: CreateAuthoritativeActivitySessionVariables): MutationRef<CreateAuthoritativeActivitySessionData, CreateAuthoritativeActivitySessionVariables>;
}
export const createAuthoritativeActivitySessionRef: CreateAuthoritativeActivitySessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAuthoritativeActivitySessionRef:
```typescript
const name = createAuthoritativeActivitySessionRef.operationName;
console.log(name);
```

### Variables
The `CreateAuthoritativeActivitySession` mutation requires an argument of type `CreateAuthoritativeActivitySessionVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateAuthoritativeActivitySession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAuthoritativeActivitySessionData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAuthoritativeActivitySessionData {
  activitySession_insert: ActivitySession_Key;
}
```
### Using `CreateAuthoritativeActivitySession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuthoritativeActivitySession, CreateAuthoritativeActivitySessionVariables } from '@money-rank/dataconnect';

// The `CreateAuthoritativeActivitySession` mutation requires an argument of type `CreateAuthoritativeActivitySessionVariables`:
const createAuthoritativeActivitySessionVars: CreateAuthoritativeActivitySessionVariables = {
  sessionId: ..., 
  studentUid: ..., 
  activityId: ..., 
  phaseNumber: ..., 
  variantId: ..., // optional
  contentVersion: ..., 
  publicPayload: ..., 
  answerKey: ..., 
  expiresAt: ..., 
};

// Call the `createAuthoritativeActivitySession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAuthoritativeActivitySession(createAuthoritativeActivitySessionVars);
// Variables can be defined inline as well.
const { data } = await createAuthoritativeActivitySession({ sessionId: ..., studentUid: ..., activityId: ..., phaseNumber: ..., variantId: ..., contentVersion: ..., publicPayload: ..., answerKey: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAuthoritativeActivitySession(dataConnect, createAuthoritativeActivitySessionVars);

console.log(data.activitySession_insert);

// Or, you can use the `Promise` API.
createAuthoritativeActivitySession(createAuthoritativeActivitySessionVars).then((response) => {
  const data = response.data;
  console.log(data.activitySession_insert);
});
```

### Using `CreateAuthoritativeActivitySession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAuthoritativeActivitySessionRef, CreateAuthoritativeActivitySessionVariables } from '@money-rank/dataconnect';

// The `CreateAuthoritativeActivitySession` mutation requires an argument of type `CreateAuthoritativeActivitySessionVariables`:
const createAuthoritativeActivitySessionVars: CreateAuthoritativeActivitySessionVariables = {
  sessionId: ..., 
  studentUid: ..., 
  activityId: ..., 
  phaseNumber: ..., 
  variantId: ..., // optional
  contentVersion: ..., 
  publicPayload: ..., 
  answerKey: ..., 
  expiresAt: ..., 
};

// Call the `createAuthoritativeActivitySessionRef()` function to get a reference to the mutation.
const ref = createAuthoritativeActivitySessionRef(createAuthoritativeActivitySessionVars);
// Variables can be defined inline as well.
const ref = createAuthoritativeActivitySessionRef({ sessionId: ..., studentUid: ..., activityId: ..., phaseNumber: ..., variantId: ..., contentVersion: ..., publicPayload: ..., answerKey: ..., expiresAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAuthoritativeActivitySessionRef(dataConnect, createAuthoritativeActivitySessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activitySession_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activitySession_insert);
});
```

## MarkAuthoritativeActivitySessionSubmitted
You can execute the `MarkAuthoritativeActivitySessionSubmitted` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
markAuthoritativeActivitySessionSubmitted(vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationPromise<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;

interface MarkAuthoritativeActivitySessionSubmittedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationRef<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;
}
export const markAuthoritativeActivitySessionSubmittedRef: MarkAuthoritativeActivitySessionSubmittedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markAuthoritativeActivitySessionSubmitted(dc: DataConnect, vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationPromise<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;

interface MarkAuthoritativeActivitySessionSubmittedRef {
  ...
  (dc: DataConnect, vars: MarkAuthoritativeActivitySessionSubmittedVariables): MutationRef<MarkAuthoritativeActivitySessionSubmittedData, MarkAuthoritativeActivitySessionSubmittedVariables>;
}
export const markAuthoritativeActivitySessionSubmittedRef: MarkAuthoritativeActivitySessionSubmittedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markAuthoritativeActivitySessionSubmittedRef:
```typescript
const name = markAuthoritativeActivitySessionSubmittedRef.operationName;
console.log(name);
```

### Variables
The `MarkAuthoritativeActivitySessionSubmitted` mutation requires an argument of type `MarkAuthoritativeActivitySessionSubmittedVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkAuthoritativeActivitySessionSubmittedVariables {
  sessionId: UUIDString;
  studentUid: string;
}
```
### Return Type
Recall that executing the `MarkAuthoritativeActivitySessionSubmitted` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkAuthoritativeActivitySessionSubmittedData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkAuthoritativeActivitySessionSubmittedData {
  affectedRows?: number | null;
}
```
### Using `MarkAuthoritativeActivitySessionSubmitted`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markAuthoritativeActivitySessionSubmitted, MarkAuthoritativeActivitySessionSubmittedVariables } from '@money-rank/dataconnect';

// The `MarkAuthoritativeActivitySessionSubmitted` mutation requires an argument of type `MarkAuthoritativeActivitySessionSubmittedVariables`:
const markAuthoritativeActivitySessionSubmittedVars: MarkAuthoritativeActivitySessionSubmittedVariables = {
  sessionId: ..., 
  studentUid: ..., 
};

// Call the `markAuthoritativeActivitySessionSubmitted()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markAuthoritativeActivitySessionSubmitted(markAuthoritativeActivitySessionSubmittedVars);
// Variables can be defined inline as well.
const { data } = await markAuthoritativeActivitySessionSubmitted({ sessionId: ..., studentUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markAuthoritativeActivitySessionSubmitted(dataConnect, markAuthoritativeActivitySessionSubmittedVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
markAuthoritativeActivitySessionSubmitted(markAuthoritativeActivitySessionSubmittedVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `MarkAuthoritativeActivitySessionSubmitted`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markAuthoritativeActivitySessionSubmittedRef, MarkAuthoritativeActivitySessionSubmittedVariables } from '@money-rank/dataconnect';

// The `MarkAuthoritativeActivitySessionSubmitted` mutation requires an argument of type `MarkAuthoritativeActivitySessionSubmittedVariables`:
const markAuthoritativeActivitySessionSubmittedVars: MarkAuthoritativeActivitySessionSubmittedVariables = {
  sessionId: ..., 
  studentUid: ..., 
};

// Call the `markAuthoritativeActivitySessionSubmittedRef()` function to get a reference to the mutation.
const ref = markAuthoritativeActivitySessionSubmittedRef(markAuthoritativeActivitySessionSubmittedVars);
// Variables can be defined inline as well.
const ref = markAuthoritativeActivitySessionSubmittedRef({ sessionId: ..., studentUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markAuthoritativeActivitySessionSubmittedRef(dataConnect, markAuthoritativeActivitySessionSubmittedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## InitializeMyTrail
You can execute the `InitializeMyTrail` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
initializeMyTrail(): MutationPromise<InitializeMyTrailData, undefined>;

interface InitializeMyTrailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<InitializeMyTrailData, undefined>;
}
export const initializeMyTrailRef: InitializeMyTrailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
initializeMyTrail(dc: DataConnect): MutationPromise<InitializeMyTrailData, undefined>;

interface InitializeMyTrailRef {
  ...
  (dc: DataConnect): MutationRef<InitializeMyTrailData, undefined>;
}
export const initializeMyTrailRef: InitializeMyTrailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the initializeMyTrailRef:
```typescript
const name = initializeMyTrailRef.operationName;
console.log(name);
```

### Variables
The `InitializeMyTrail` mutation has no variables.
### Return Type
Recall that executing the `InitializeMyTrail` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InitializeMyTrailData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InitializeMyTrailData {
  affectedRows?: number | null;
}
```
### Using `InitializeMyTrail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, initializeMyTrail } from '@money-rank/dataconnect';


// Call the `initializeMyTrail()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await initializeMyTrail();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await initializeMyTrail(dataConnect);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
initializeMyTrail().then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `InitializeMyTrail`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, initializeMyTrailRef } from '@money-rank/dataconnect';


// Call the `initializeMyTrailRef()` function to get a reference to the mutation.
const ref = initializeMyTrailRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = initializeMyTrailRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## CompleteMyIntroduction
You can execute the `CompleteMyIntroduction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
completeMyIntroduction(): MutationPromise<CompleteMyIntroductionData, undefined>;

interface CompleteMyIntroductionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CompleteMyIntroductionData, undefined>;
}
export const completeMyIntroductionRef: CompleteMyIntroductionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeMyIntroduction(dc: DataConnect): MutationPromise<CompleteMyIntroductionData, undefined>;

interface CompleteMyIntroductionRef {
  ...
  (dc: DataConnect): MutationRef<CompleteMyIntroductionData, undefined>;
}
export const completeMyIntroductionRef: CompleteMyIntroductionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeMyIntroductionRef:
```typescript
const name = completeMyIntroductionRef.operationName;
console.log(name);
```

### Variables
The `CompleteMyIntroduction` mutation has no variables.
### Return Type
Recall that executing the `CompleteMyIntroduction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteMyIntroductionData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteMyIntroductionData {
  affectedRows?: number | null;
}
```
### Using `CompleteMyIntroduction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeMyIntroduction } from '@money-rank/dataconnect';


// Call the `completeMyIntroduction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeMyIntroduction();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeMyIntroduction(dataConnect);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
completeMyIntroduction().then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `CompleteMyIntroduction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeMyIntroductionRef } from '@money-rank/dataconnect';


// Call the `completeMyIntroductionRef()` function to get a reference to the mutation.
const ref = completeMyIntroductionRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeMyIntroductionRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## CompleteMyCurrentPhaseContent
You can execute the `CompleteMyCurrentPhaseContent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
completeMyCurrentPhaseContent(vars: CompleteMyCurrentPhaseContentVariables): MutationPromise<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;

interface CompleteMyCurrentPhaseContentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteMyCurrentPhaseContentVariables): MutationRef<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;
}
export const completeMyCurrentPhaseContentRef: CompleteMyCurrentPhaseContentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeMyCurrentPhaseContent(dc: DataConnect, vars: CompleteMyCurrentPhaseContentVariables): MutationPromise<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;

interface CompleteMyCurrentPhaseContentRef {
  ...
  (dc: DataConnect, vars: CompleteMyCurrentPhaseContentVariables): MutationRef<CompleteMyCurrentPhaseContentData, CompleteMyCurrentPhaseContentVariables>;
}
export const completeMyCurrentPhaseContentRef: CompleteMyCurrentPhaseContentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeMyCurrentPhaseContentRef:
```typescript
const name = completeMyCurrentPhaseContentRef.operationName;
console.log(name);
```

### Variables
The `CompleteMyCurrentPhaseContent` mutation requires an argument of type `CompleteMyCurrentPhaseContentVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CompleteMyCurrentPhaseContentVariables {
  phaseNumber: number;
}
```
### Return Type
Recall that executing the `CompleteMyCurrentPhaseContent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteMyCurrentPhaseContentData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteMyCurrentPhaseContentData {
  affectedRows?: number | null;
}
```
### Using `CompleteMyCurrentPhaseContent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeMyCurrentPhaseContent, CompleteMyCurrentPhaseContentVariables } from '@money-rank/dataconnect';

// The `CompleteMyCurrentPhaseContent` mutation requires an argument of type `CompleteMyCurrentPhaseContentVariables`:
const completeMyCurrentPhaseContentVars: CompleteMyCurrentPhaseContentVariables = {
  phaseNumber: ..., 
};

// Call the `completeMyCurrentPhaseContent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeMyCurrentPhaseContent(completeMyCurrentPhaseContentVars);
// Variables can be defined inline as well.
const { data } = await completeMyCurrentPhaseContent({ phaseNumber: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeMyCurrentPhaseContent(dataConnect, completeMyCurrentPhaseContentVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
completeMyCurrentPhaseContent(completeMyCurrentPhaseContentVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `CompleteMyCurrentPhaseContent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeMyCurrentPhaseContentRef, CompleteMyCurrentPhaseContentVariables } from '@money-rank/dataconnect';

// The `CompleteMyCurrentPhaseContent` mutation requires an argument of type `CompleteMyCurrentPhaseContentVariables`:
const completeMyCurrentPhaseContentVars: CompleteMyCurrentPhaseContentVariables = {
  phaseNumber: ..., 
};

// Call the `completeMyCurrentPhaseContentRef()` function to get a reference to the mutation.
const ref = completeMyCurrentPhaseContentRef(completeMyCurrentPhaseContentVars);
// Variables can be defined inline as well.
const ref = completeMyCurrentPhaseContentRef({ phaseNumber: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeMyCurrentPhaseContentRef(dataConnect, completeMyCurrentPhaseContentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## RegisterMyCurrentPhaseAttempt
You can execute the `RegisterMyCurrentPhaseAttempt` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
registerMyCurrentPhaseAttempt(vars: RegisterMyCurrentPhaseAttemptVariables): MutationPromise<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;

interface RegisterMyCurrentPhaseAttemptRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterMyCurrentPhaseAttemptVariables): MutationRef<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;
}
export const registerMyCurrentPhaseAttemptRef: RegisterMyCurrentPhaseAttemptRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerMyCurrentPhaseAttempt(dc: DataConnect, vars: RegisterMyCurrentPhaseAttemptVariables): MutationPromise<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;

interface RegisterMyCurrentPhaseAttemptRef {
  ...
  (dc: DataConnect, vars: RegisterMyCurrentPhaseAttemptVariables): MutationRef<RegisterMyCurrentPhaseAttemptData, RegisterMyCurrentPhaseAttemptVariables>;
}
export const registerMyCurrentPhaseAttemptRef: RegisterMyCurrentPhaseAttemptRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerMyCurrentPhaseAttemptRef:
```typescript
const name = registerMyCurrentPhaseAttemptRef.operationName;
console.log(name);
```

### Variables
The `RegisterMyCurrentPhaseAttempt` mutation requires an argument of type `RegisterMyCurrentPhaseAttemptVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `RegisterMyCurrentPhaseAttempt` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterMyCurrentPhaseAttemptData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterMyCurrentPhaseAttemptData {
  affectedRows?: number | null;
}
```
### Using `RegisterMyCurrentPhaseAttempt`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerMyCurrentPhaseAttempt, RegisterMyCurrentPhaseAttemptVariables } from '@money-rank/dataconnect';

// The `RegisterMyCurrentPhaseAttempt` mutation requires an argument of type `RegisterMyCurrentPhaseAttemptVariables`:
const registerMyCurrentPhaseAttemptVars: RegisterMyCurrentPhaseAttemptVariables = {
  attemptId: ..., 
  sessionId: ..., 
  studentUid: ..., 
  activityId: ..., 
  phaseNumber: ..., 
  score: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
};

// Call the `registerMyCurrentPhaseAttempt()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerMyCurrentPhaseAttempt(registerMyCurrentPhaseAttemptVars);
// Variables can be defined inline as well.
const { data } = await registerMyCurrentPhaseAttempt({ attemptId: ..., sessionId: ..., studentUid: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerMyCurrentPhaseAttempt(dataConnect, registerMyCurrentPhaseAttemptVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
registerMyCurrentPhaseAttempt(registerMyCurrentPhaseAttemptVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `RegisterMyCurrentPhaseAttempt`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerMyCurrentPhaseAttemptRef, RegisterMyCurrentPhaseAttemptVariables } from '@money-rank/dataconnect';

// The `RegisterMyCurrentPhaseAttempt` mutation requires an argument of type `RegisterMyCurrentPhaseAttemptVariables`:
const registerMyCurrentPhaseAttemptVars: RegisterMyCurrentPhaseAttemptVariables = {
  attemptId: ..., 
  sessionId: ..., 
  studentUid: ..., 
  activityId: ..., 
  phaseNumber: ..., 
  score: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
};

// Call the `registerMyCurrentPhaseAttemptRef()` function to get a reference to the mutation.
const ref = registerMyCurrentPhaseAttemptRef(registerMyCurrentPhaseAttemptVars);
// Variables can be defined inline as well.
const ref = registerMyCurrentPhaseAttemptRef({ attemptId: ..., sessionId: ..., studentUid: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerMyCurrentPhaseAttemptRef(dataConnect, registerMyCurrentPhaseAttemptVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## CompleteMyCurrentPhase
You can execute the `CompleteMyCurrentPhase` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
completeMyCurrentPhase(vars: CompleteMyCurrentPhaseVariables): MutationPromise<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;

interface CompleteMyCurrentPhaseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteMyCurrentPhaseVariables): MutationRef<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;
}
export const completeMyCurrentPhaseRef: CompleteMyCurrentPhaseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
completeMyCurrentPhase(dc: DataConnect, vars: CompleteMyCurrentPhaseVariables): MutationPromise<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;

interface CompleteMyCurrentPhaseRef {
  ...
  (dc: DataConnect, vars: CompleteMyCurrentPhaseVariables): MutationRef<CompleteMyCurrentPhaseData, CompleteMyCurrentPhaseVariables>;
}
export const completeMyCurrentPhaseRef: CompleteMyCurrentPhaseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the completeMyCurrentPhaseRef:
```typescript
const name = completeMyCurrentPhaseRef.operationName;
console.log(name);
```

### Variables
The `CompleteMyCurrentPhase` mutation requires an argument of type `CompleteMyCurrentPhaseVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CompleteMyCurrentPhase` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CompleteMyCurrentPhaseData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CompleteMyCurrentPhaseData {
  affectedRows?: number | null;
}
```
### Using `CompleteMyCurrentPhase`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, completeMyCurrentPhase, CompleteMyCurrentPhaseVariables } from '@money-rank/dataconnect';

// The `CompleteMyCurrentPhase` mutation requires an argument of type `CompleteMyCurrentPhaseVariables`:
const completeMyCurrentPhaseVars: CompleteMyCurrentPhaseVariables = {
  attemptId: ..., 
  sessionId: ..., 
  studentUid: ..., 
  activityId: ..., 
  phaseNumber: ..., 
  score: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
};

// Call the `completeMyCurrentPhase()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await completeMyCurrentPhase(completeMyCurrentPhaseVars);
// Variables can be defined inline as well.
const { data } = await completeMyCurrentPhase({ attemptId: ..., sessionId: ..., studentUid: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await completeMyCurrentPhase(dataConnect, completeMyCurrentPhaseVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
completeMyCurrentPhase(completeMyCurrentPhaseVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `CompleteMyCurrentPhase`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, completeMyCurrentPhaseRef, CompleteMyCurrentPhaseVariables } from '@money-rank/dataconnect';

// The `CompleteMyCurrentPhase` mutation requires an argument of type `CompleteMyCurrentPhaseVariables`:
const completeMyCurrentPhaseVars: CompleteMyCurrentPhaseVariables = {
  attemptId: ..., 
  sessionId: ..., 
  studentUid: ..., 
  activityId: ..., 
  phaseNumber: ..., 
  score: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
};

// Call the `completeMyCurrentPhaseRef()` function to get a reference to the mutation.
const ref = completeMyCurrentPhaseRef(completeMyCurrentPhaseVars);
// Variables can be defined inline as well.
const ref = completeMyCurrentPhaseRef({ attemptId: ..., sessionId: ..., studentUid: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = completeMyCurrentPhaseRef(dataConnect, completeMyCurrentPhaseVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## UpdateAuthoritativeActivitySessionState
You can execute the `UpdateAuthoritativeActivitySessionState` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateAuthoritativeActivitySessionState(vars: UpdateAuthoritativeActivitySessionStateVariables): MutationPromise<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;

interface UpdateAuthoritativeActivitySessionStateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAuthoritativeActivitySessionStateVariables): MutationRef<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;
}
export const updateAuthoritativeActivitySessionStateRef: UpdateAuthoritativeActivitySessionStateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAuthoritativeActivitySessionState(dc: DataConnect, vars: UpdateAuthoritativeActivitySessionStateVariables): MutationPromise<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;

interface UpdateAuthoritativeActivitySessionStateRef {
  ...
  (dc: DataConnect, vars: UpdateAuthoritativeActivitySessionStateVariables): MutationRef<UpdateAuthoritativeActivitySessionStateData, UpdateAuthoritativeActivitySessionStateVariables>;
}
export const updateAuthoritativeActivitySessionStateRef: UpdateAuthoritativeActivitySessionStateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAuthoritativeActivitySessionStateRef:
```typescript
const name = updateAuthoritativeActivitySessionStateRef.operationName;
console.log(name);
```

### Variables
The `UpdateAuthoritativeActivitySessionState` mutation requires an argument of type `UpdateAuthoritativeActivitySessionStateVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAuthoritativeActivitySessionStateVariables {
  sessionId: UUIDString;
  studentUid: string;
  answerKey: unknown;
  publicPayload: unknown;
}
```
### Return Type
Recall that executing the `UpdateAuthoritativeActivitySessionState` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAuthoritativeActivitySessionStateData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAuthoritativeActivitySessionStateData {
  affectedRows?: number | null;
}
```
### Using `UpdateAuthoritativeActivitySessionState`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAuthoritativeActivitySessionState, UpdateAuthoritativeActivitySessionStateVariables } from '@money-rank/dataconnect';

// The `UpdateAuthoritativeActivitySessionState` mutation requires an argument of type `UpdateAuthoritativeActivitySessionStateVariables`:
const updateAuthoritativeActivitySessionStateVars: UpdateAuthoritativeActivitySessionStateVariables = {
  sessionId: ..., 
  studentUid: ..., 
  answerKey: ..., 
  publicPayload: ..., 
};

// Call the `updateAuthoritativeActivitySessionState()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAuthoritativeActivitySessionState(updateAuthoritativeActivitySessionStateVars);
// Variables can be defined inline as well.
const { data } = await updateAuthoritativeActivitySessionState({ sessionId: ..., studentUid: ..., answerKey: ..., publicPayload: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAuthoritativeActivitySessionState(dataConnect, updateAuthoritativeActivitySessionStateVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
updateAuthoritativeActivitySessionState(updateAuthoritativeActivitySessionStateVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `UpdateAuthoritativeActivitySessionState`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAuthoritativeActivitySessionStateRef, UpdateAuthoritativeActivitySessionStateVariables } from '@money-rank/dataconnect';

// The `UpdateAuthoritativeActivitySessionState` mutation requires an argument of type `UpdateAuthoritativeActivitySessionStateVariables`:
const updateAuthoritativeActivitySessionStateVars: UpdateAuthoritativeActivitySessionStateVariables = {
  sessionId: ..., 
  studentUid: ..., 
  answerKey: ..., 
  publicPayload: ..., 
};

// Call the `updateAuthoritativeActivitySessionStateRef()` function to get a reference to the mutation.
const ref = updateAuthoritativeActivitySessionStateRef(updateAuthoritativeActivitySessionStateVars);
// Variables can be defined inline as well.
const ref = updateAuthoritativeActivitySessionStateRef({ sessionId: ..., studentUid: ..., answerKey: ..., publicPayload: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAuthoritativeActivitySessionStateRef(dataConnect, updateAuthoritativeActivitySessionStateVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## ImportPedagogicalBank
You can execute the `ImportPedagogicalBank` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
importPedagogicalBank(vars: ImportPedagogicalBankVariables): MutationPromise<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;

interface ImportPedagogicalBankRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ImportPedagogicalBankVariables): MutationRef<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;
}
export const importPedagogicalBankRef: ImportPedagogicalBankRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
importPedagogicalBank(dc: DataConnect, vars: ImportPedagogicalBankVariables): MutationPromise<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;

interface ImportPedagogicalBankRef {
  ...
  (dc: DataConnect, vars: ImportPedagogicalBankVariables): MutationRef<ImportPedagogicalBankData, ImportPedagogicalBankVariables>;
}
export const importPedagogicalBankRef: ImportPedagogicalBankRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the importPedagogicalBankRef:
```typescript
const name = importPedagogicalBankRef.operationName;
console.log(name);
```

### Variables
The `ImportPedagogicalBank` mutation requires an argument of type `ImportPedagogicalBankVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ImportPedagogicalBankVariables {
  loadHash: string;
  loadVersion: string;
  sourceFile: string;
  itemCount: number;
  items: unknown;
}
```
### Return Type
Recall that executing the `ImportPedagogicalBank` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ImportPedagogicalBankData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ImportPedagogicalBankData {
  importedRows?: number | null;
}
```
### Using `ImportPedagogicalBank`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, importPedagogicalBank, ImportPedagogicalBankVariables } from '@money-rank/dataconnect';

// The `ImportPedagogicalBank` mutation requires an argument of type `ImportPedagogicalBankVariables`:
const importPedagogicalBankVars: ImportPedagogicalBankVariables = {
  loadHash: ..., 
  loadVersion: ..., 
  sourceFile: ..., 
  itemCount: ..., 
  items: ..., 
};

// Call the `importPedagogicalBank()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await importPedagogicalBank(importPedagogicalBankVars);
// Variables can be defined inline as well.
const { data } = await importPedagogicalBank({ loadHash: ..., loadVersion: ..., sourceFile: ..., itemCount: ..., items: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await importPedagogicalBank(dataConnect, importPedagogicalBankVars);

console.log(data.importedRows);

// Or, you can use the `Promise` API.
importPedagogicalBank(importPedagogicalBankVars).then((response) => {
  const data = response.data;
  console.log(data.importedRows);
});
```

### Using `ImportPedagogicalBank`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, importPedagogicalBankRef, ImportPedagogicalBankVariables } from '@money-rank/dataconnect';

// The `ImportPedagogicalBank` mutation requires an argument of type `ImportPedagogicalBankVariables`:
const importPedagogicalBankVars: ImportPedagogicalBankVariables = {
  loadHash: ..., 
  loadVersion: ..., 
  sourceFile: ..., 
  itemCount: ..., 
  items: ..., 
};

// Call the `importPedagogicalBankRef()` function to get a reference to the mutation.
const ref = importPedagogicalBankRef(importPedagogicalBankVars);
// Variables can be defined inline as well.
const ref = importPedagogicalBankRef({ loadHash: ..., loadVersion: ..., sourceFile: ..., itemCount: ..., items: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = importPedagogicalBankRef(dataConnect, importPedagogicalBankVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.importedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.importedRows);
});
```

## BindPilotClass
You can execute the `BindPilotClass` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
bindPilotClass(vars: BindPilotClassVariables): MutationPromise<BindPilotClassData, BindPilotClassVariables>;

interface BindPilotClassRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BindPilotClassVariables): MutationRef<BindPilotClassData, BindPilotClassVariables>;
}
export const bindPilotClassRef: BindPilotClassRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
bindPilotClass(dc: DataConnect, vars: BindPilotClassVariables): MutationPromise<BindPilotClassData, BindPilotClassVariables>;

interface BindPilotClassRef {
  ...
  (dc: DataConnect, vars: BindPilotClassVariables): MutationRef<BindPilotClassData, BindPilotClassVariables>;
}
export const bindPilotClassRef: BindPilotClassRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the bindPilotClassRef:
```typescript
const name = bindPilotClassRef.operationName;
console.log(name);
```

### Variables
The `BindPilotClass` mutation requires an argument of type `BindPilotClassVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BindPilotClassVariables {
  studentUid: string;
  classGroup: StudentClass;
}
```
### Return Type
Recall that executing the `BindPilotClass` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BindPilotClassData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BindPilotClassData {
  affectedRows?: number | null;
}
```
### Using `BindPilotClass`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, bindPilotClass, BindPilotClassVariables } from '@money-rank/dataconnect';

// The `BindPilotClass` mutation requires an argument of type `BindPilotClassVariables`:
const bindPilotClassVars: BindPilotClassVariables = {
  studentUid: ..., 
  classGroup: ..., 
};

// Call the `bindPilotClass()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await bindPilotClass(bindPilotClassVars);
// Variables can be defined inline as well.
const { data } = await bindPilotClass({ studentUid: ..., classGroup: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await bindPilotClass(dataConnect, bindPilotClassVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
bindPilotClass(bindPilotClassVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `BindPilotClass`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, bindPilotClassRef, BindPilotClassVariables } from '@money-rank/dataconnect';

// The `BindPilotClass` mutation requires an argument of type `BindPilotClassVariables`:
const bindPilotClassVars: BindPilotClassVariables = {
  studentUid: ..., 
  classGroup: ..., 
};

// Call the `bindPilotClassRef()` function to get a reference to the mutation.
const ref = bindPilotClassRef(bindPilotClassVars);
// Variables can be defined inline as well.
const ref = bindPilotClassRef({ studentUid: ..., classGroup: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = bindPilotClassRef(dataConnect, bindPilotClassVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## UpsertPilotCompetitionPeriod
You can execute the `UpsertPilotCompetitionPeriod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
upsertPilotCompetitionPeriod(vars: UpsertPilotCompetitionPeriodVariables): MutationPromise<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;

interface UpsertPilotCompetitionPeriodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPilotCompetitionPeriodVariables): MutationRef<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;
}
export const upsertPilotCompetitionPeriodRef: UpsertPilotCompetitionPeriodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertPilotCompetitionPeriod(dc: DataConnect, vars: UpsertPilotCompetitionPeriodVariables): MutationPromise<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;

interface UpsertPilotCompetitionPeriodRef {
  ...
  (dc: DataConnect, vars: UpsertPilotCompetitionPeriodVariables): MutationRef<UpsertPilotCompetitionPeriodData, UpsertPilotCompetitionPeriodVariables>;
}
export const upsertPilotCompetitionPeriodRef: UpsertPilotCompetitionPeriodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertPilotCompetitionPeriodRef:
```typescript
const name = upsertPilotCompetitionPeriodRef.operationName;
console.log(name);
```

### Variables
The `UpsertPilotCompetitionPeriod` mutation requires an argument of type `UpsertPilotCompetitionPeriodVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertPilotCompetitionPeriodVariables {
  periodId: UUIDString;
  periodKey: string;
  name: string;
  startsAt: TimestampString;
  endsAt: TimestampString;
  schedule: unknown;
}
```
### Return Type
Recall that executing the `UpsertPilotCompetitionPeriod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertPilotCompetitionPeriodData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertPilotCompetitionPeriodData {
  affectedRows?: number | null;
}
```
### Using `UpsertPilotCompetitionPeriod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertPilotCompetitionPeriod, UpsertPilotCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `UpsertPilotCompetitionPeriod` mutation requires an argument of type `UpsertPilotCompetitionPeriodVariables`:
const upsertPilotCompetitionPeriodVars: UpsertPilotCompetitionPeriodVariables = {
  periodId: ..., 
  periodKey: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  schedule: ..., 
};

// Call the `upsertPilotCompetitionPeriod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertPilotCompetitionPeriod(upsertPilotCompetitionPeriodVars);
// Variables can be defined inline as well.
const { data } = await upsertPilotCompetitionPeriod({ periodId: ..., periodKey: ..., name: ..., startsAt: ..., endsAt: ..., schedule: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertPilotCompetitionPeriod(dataConnect, upsertPilotCompetitionPeriodVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
upsertPilotCompetitionPeriod(upsertPilotCompetitionPeriodVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `UpsertPilotCompetitionPeriod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertPilotCompetitionPeriodRef, UpsertPilotCompetitionPeriodVariables } from '@money-rank/dataconnect';

// The `UpsertPilotCompetitionPeriod` mutation requires an argument of type `UpsertPilotCompetitionPeriodVariables`:
const upsertPilotCompetitionPeriodVars: UpsertPilotCompetitionPeriodVariables = {
  periodId: ..., 
  periodKey: ..., 
  name: ..., 
  startsAt: ..., 
  endsAt: ..., 
  schedule: ..., 
};

// Call the `upsertPilotCompetitionPeriodRef()` function to get a reference to the mutation.
const ref = upsertPilotCompetitionPeriodRef(upsertPilotCompetitionPeriodVars);
// Variables can be defined inline as well.
const ref = upsertPilotCompetitionPeriodRef({ periodId: ..., periodKey: ..., name: ..., startsAt: ..., endsAt: ..., schedule: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertPilotCompetitionPeriodRef(dataConnect, upsertPilotCompetitionPeriodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## SeedLoadTestStudents
You can execute the `SeedLoadTestStudents` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
seedLoadTestStudents(vars: SeedLoadTestStudentsVariables): MutationPromise<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;

interface SeedLoadTestStudentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SeedLoadTestStudentsVariables): MutationRef<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;
}
export const seedLoadTestStudentsRef: SeedLoadTestStudentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedLoadTestStudents(dc: DataConnect, vars: SeedLoadTestStudentsVariables): MutationPromise<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;

interface SeedLoadTestStudentsRef {
  ...
  (dc: DataConnect, vars: SeedLoadTestStudentsVariables): MutationRef<SeedLoadTestStudentsData, SeedLoadTestStudentsVariables>;
}
export const seedLoadTestStudentsRef: SeedLoadTestStudentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedLoadTestStudentsRef:
```typescript
const name = seedLoadTestStudentsRef.operationName;
console.log(name);
```

### Variables
The `SeedLoadTestStudents` mutation requires an argument of type `SeedLoadTestStudentsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SeedLoadTestStudentsVariables {
  runId: string;
  requestedUsers: number;
  users: unknown;
}
```
### Return Type
Recall that executing the `SeedLoadTestStudents` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedLoadTestStudentsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedLoadTestStudentsData {
  affectedRows?: number | null;
}
```
### Using `SeedLoadTestStudents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedLoadTestStudents, SeedLoadTestStudentsVariables } from '@money-rank/dataconnect';

// The `SeedLoadTestStudents` mutation requires an argument of type `SeedLoadTestStudentsVariables`:
const seedLoadTestStudentsVars: SeedLoadTestStudentsVariables = {
  runId: ..., 
  requestedUsers: ..., 
  users: ..., 
};

// Call the `seedLoadTestStudents()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedLoadTestStudents(seedLoadTestStudentsVars);
// Variables can be defined inline as well.
const { data } = await seedLoadTestStudents({ runId: ..., requestedUsers: ..., users: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedLoadTestStudents(dataConnect, seedLoadTestStudentsVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
seedLoadTestStudents(seedLoadTestStudentsVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `SeedLoadTestStudents`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedLoadTestStudentsRef, SeedLoadTestStudentsVariables } from '@money-rank/dataconnect';

// The `SeedLoadTestStudents` mutation requires an argument of type `SeedLoadTestStudentsVariables`:
const seedLoadTestStudentsVars: SeedLoadTestStudentsVariables = {
  runId: ..., 
  requestedUsers: ..., 
  users: ..., 
};

// Call the `seedLoadTestStudentsRef()` function to get a reference to the mutation.
const ref = seedLoadTestStudentsRef(seedLoadTestStudentsVars);
// Variables can be defined inline as well.
const ref = seedLoadTestStudentsRef({ runId: ..., requestedUsers: ..., users: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedLoadTestStudentsRef(dataConnect, seedLoadTestStudentsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## RecordLoadTestMetrics
You can execute the `RecordLoadTestMetrics` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
recordLoadTestMetrics(vars: RecordLoadTestMetricsVariables): MutationPromise<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;

interface RecordLoadTestMetricsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RecordLoadTestMetricsVariables): MutationRef<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;
}
export const recordLoadTestMetricsRef: RecordLoadTestMetricsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
recordLoadTestMetrics(dc: DataConnect, vars: RecordLoadTestMetricsVariables): MutationPromise<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;

interface RecordLoadTestMetricsRef {
  ...
  (dc: DataConnect, vars: RecordLoadTestMetricsVariables): MutationRef<RecordLoadTestMetricsData, RecordLoadTestMetricsVariables>;
}
export const recordLoadTestMetricsRef: RecordLoadTestMetricsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the recordLoadTestMetricsRef:
```typescript
const name = recordLoadTestMetricsRef.operationName;
console.log(name);
```

### Variables
The `RecordLoadTestMetrics` mutation requires an argument of type `RecordLoadTestMetricsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RecordLoadTestMetricsVariables {
  runId: string;
  status: string;
  metrics: unknown;
}
```
### Return Type
Recall that executing the `RecordLoadTestMetrics` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RecordLoadTestMetricsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RecordLoadTestMetricsData {
  affectedRows?: number | null;
}
```
### Using `RecordLoadTestMetrics`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, recordLoadTestMetrics, RecordLoadTestMetricsVariables } from '@money-rank/dataconnect';

// The `RecordLoadTestMetrics` mutation requires an argument of type `RecordLoadTestMetricsVariables`:
const recordLoadTestMetricsVars: RecordLoadTestMetricsVariables = {
  runId: ..., 
  status: ..., 
  metrics: ..., 
};

// Call the `recordLoadTestMetrics()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await recordLoadTestMetrics(recordLoadTestMetricsVars);
// Variables can be defined inline as well.
const { data } = await recordLoadTestMetrics({ runId: ..., status: ..., metrics: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await recordLoadTestMetrics(dataConnect, recordLoadTestMetricsVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
recordLoadTestMetrics(recordLoadTestMetricsVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `RecordLoadTestMetrics`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, recordLoadTestMetricsRef, RecordLoadTestMetricsVariables } from '@money-rank/dataconnect';

// The `RecordLoadTestMetrics` mutation requires an argument of type `RecordLoadTestMetricsVariables`:
const recordLoadTestMetricsVars: RecordLoadTestMetricsVariables = {
  runId: ..., 
  status: ..., 
  metrics: ..., 
};

// Call the `recordLoadTestMetricsRef()` function to get a reference to the mutation.
const ref = recordLoadTestMetricsRef(recordLoadTestMetricsVars);
// Variables can be defined inline as well.
const ref = recordLoadTestMetricsRef({ runId: ..., status: ..., metrics: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = recordLoadTestMetricsRef(dataConnect, recordLoadTestMetricsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## CleanupMarkedLoadTestStudents
You can execute the `CleanupMarkedLoadTestStudents` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
cleanupMarkedLoadTestStudents(vars: CleanupMarkedLoadTestStudentsVariables): MutationPromise<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;

interface CleanupMarkedLoadTestStudentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CleanupMarkedLoadTestStudentsVariables): MutationRef<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;
}
export const cleanupMarkedLoadTestStudentsRef: CleanupMarkedLoadTestStudentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cleanupMarkedLoadTestStudents(dc: DataConnect, vars: CleanupMarkedLoadTestStudentsVariables): MutationPromise<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;

interface CleanupMarkedLoadTestStudentsRef {
  ...
  (dc: DataConnect, vars: CleanupMarkedLoadTestStudentsVariables): MutationRef<CleanupMarkedLoadTestStudentsData, CleanupMarkedLoadTestStudentsVariables>;
}
export const cleanupMarkedLoadTestStudentsRef: CleanupMarkedLoadTestStudentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cleanupMarkedLoadTestStudentsRef:
```typescript
const name = cleanupMarkedLoadTestStudentsRef.operationName;
console.log(name);
```

### Variables
The `CleanupMarkedLoadTestStudents` mutation requires an argument of type `CleanupMarkedLoadTestStudentsVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CleanupMarkedLoadTestStudentsVariables {
  runId: string;
}
```
### Return Type
Recall that executing the `CleanupMarkedLoadTestStudents` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CleanupMarkedLoadTestStudentsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CleanupMarkedLoadTestStudentsData {
  affectedRows?: number | null;
}
```
### Using `CleanupMarkedLoadTestStudents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cleanupMarkedLoadTestStudents, CleanupMarkedLoadTestStudentsVariables } from '@money-rank/dataconnect';

// The `CleanupMarkedLoadTestStudents` mutation requires an argument of type `CleanupMarkedLoadTestStudentsVariables`:
const cleanupMarkedLoadTestStudentsVars: CleanupMarkedLoadTestStudentsVariables = {
  runId: ..., 
};

// Call the `cleanupMarkedLoadTestStudents()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cleanupMarkedLoadTestStudents(cleanupMarkedLoadTestStudentsVars);
// Variables can be defined inline as well.
const { data } = await cleanupMarkedLoadTestStudents({ runId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cleanupMarkedLoadTestStudents(dataConnect, cleanupMarkedLoadTestStudentsVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
cleanupMarkedLoadTestStudents(cleanupMarkedLoadTestStudentsVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `CleanupMarkedLoadTestStudents`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cleanupMarkedLoadTestStudentsRef, CleanupMarkedLoadTestStudentsVariables } from '@money-rank/dataconnect';

// The `CleanupMarkedLoadTestStudents` mutation requires an argument of type `CleanupMarkedLoadTestStudentsVariables`:
const cleanupMarkedLoadTestStudentsVars: CleanupMarkedLoadTestStudentsVariables = {
  runId: ..., 
};

// Call the `cleanupMarkedLoadTestStudentsRef()` function to get a reference to the mutation.
const ref = cleanupMarkedLoadTestStudentsRef(cleanupMarkedLoadTestStudentsVars);
// Variables can be defined inline as well.
const ref = cleanupMarkedLoadTestStudentsRef({ runId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cleanupMarkedLoadTestStudentsRef(dataConnect, cleanupMarkedLoadTestStudentsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

## FinalizeLoadTestCleanup
You can execute the `FinalizeLoadTestCleanup` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
finalizeLoadTestCleanup(vars: FinalizeLoadTestCleanupVariables): MutationPromise<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;

interface FinalizeLoadTestCleanupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: FinalizeLoadTestCleanupVariables): MutationRef<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;
}
export const finalizeLoadTestCleanupRef: FinalizeLoadTestCleanupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
finalizeLoadTestCleanup(dc: DataConnect, vars: FinalizeLoadTestCleanupVariables): MutationPromise<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;

interface FinalizeLoadTestCleanupRef {
  ...
  (dc: DataConnect, vars: FinalizeLoadTestCleanupVariables): MutationRef<FinalizeLoadTestCleanupData, FinalizeLoadTestCleanupVariables>;
}
export const finalizeLoadTestCleanupRef: FinalizeLoadTestCleanupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the finalizeLoadTestCleanupRef:
```typescript
const name = finalizeLoadTestCleanupRef.operationName;
console.log(name);
```

### Variables
The `FinalizeLoadTestCleanup` mutation requires an argument of type `FinalizeLoadTestCleanupVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface FinalizeLoadTestCleanupVariables {
  runId: string;
  deletedAuthUsers: number;
}
```
### Return Type
Recall that executing the `FinalizeLoadTestCleanup` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `FinalizeLoadTestCleanupData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface FinalizeLoadTestCleanupData {
  affectedRows?: number | null;
}
```
### Using `FinalizeLoadTestCleanup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, finalizeLoadTestCleanup, FinalizeLoadTestCleanupVariables } from '@money-rank/dataconnect';

// The `FinalizeLoadTestCleanup` mutation requires an argument of type `FinalizeLoadTestCleanupVariables`:
const finalizeLoadTestCleanupVars: FinalizeLoadTestCleanupVariables = {
  runId: ..., 
  deletedAuthUsers: ..., 
};

// Call the `finalizeLoadTestCleanup()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await finalizeLoadTestCleanup(finalizeLoadTestCleanupVars);
// Variables can be defined inline as well.
const { data } = await finalizeLoadTestCleanup({ runId: ..., deletedAuthUsers: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await finalizeLoadTestCleanup(dataConnect, finalizeLoadTestCleanupVars);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
finalizeLoadTestCleanup(finalizeLoadTestCleanupVars).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

### Using `FinalizeLoadTestCleanup`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, finalizeLoadTestCleanupRef, FinalizeLoadTestCleanupVariables } from '@money-rank/dataconnect';

// The `FinalizeLoadTestCleanup` mutation requires an argument of type `FinalizeLoadTestCleanupVariables`:
const finalizeLoadTestCleanupVars: FinalizeLoadTestCleanupVariables = {
  runId: ..., 
  deletedAuthUsers: ..., 
};

// Call the `finalizeLoadTestCleanupRef()` function to get a reference to the mutation.
const ref = finalizeLoadTestCleanupRef(finalizeLoadTestCleanupVars);
// Variables can be defined inline as well.
const ref = finalizeLoadTestCleanupRef({ runId: ..., deletedAuthUsers: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = finalizeLoadTestCleanupRef(dataConnect, finalizeLoadTestCleanupVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.affectedRows);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.affectedRows);
});
```

