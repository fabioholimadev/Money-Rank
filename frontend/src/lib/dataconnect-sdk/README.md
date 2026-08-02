# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `money-rank-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyProfile*](#getmyprofile)
  - [*ListMyProgress*](#listmyprogress)
  - [*ListMyCapiCoinTransactions*](#listmycapicointransactions)
  - [*GetMyCapiCoinTransactionBySource*](#getmycapicointransactionbysource)
  - [*GetMyActivityAttempt*](#getmyactivityattempt)
  - [*ListMyActivityAttempts*](#listmyactivityattempts)
  - [*GetEconomyConfig*](#geteconomyconfig)
- [**Mutations**](#mutations)
  - [*UpsertMyProfileWithAvatar*](#upsertmyprofilewithavatar)
  - [*UpsertMyProfileWithPhoto*](#upsertmyprofilewithphoto)
  - [*UpsertMyProfileWithoutSyncedPhoto*](#upsertmyprofilewithoutsyncedphoto)
  - [*UpsertStudentProgress*](#upsertstudentprogress)
  - [*ApplyCapiCoinTransaction*](#applycapicointransaction)
  - [*UpsertEconomyConfig*](#upserteconomyconfig)
  - [*InitializeMyTrail*](#initializemytrail)
  - [*CompleteMyIntroduction*](#completemyintroduction)
  - [*CompleteMyCurrentPhaseContent*](#completemycurrentphasecontent)
  - [*RegisterMyCurrentPhaseAttempt*](#registermycurrentphaseattempt)
  - [*CompleteMyCurrentPhase*](#completemycurrentphase)

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
  streakTier3Percent: ..., 
  streakTier5Percent: ..., 
  streakTier7Percent: ..., 
};

// Call the `upsertEconomyConfig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertEconomyConfig(upsertEconomyConfigVars);
// Variables can be defined inline as well.
const { data } = await upsertEconomyConfig({ firstContentReward: ..., firstActivityReward: ..., repeatActivityReward: ..., rewardedRepeatLimitPerDay: ..., streakTier3Percent: ..., streakTier5Percent: ..., streakTier7Percent: ..., });

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
  streakTier3Percent: ..., 
  streakTier5Percent: ..., 
  streakTier7Percent: ..., 
};

// Call the `upsertEconomyConfigRef()` function to get a reference to the mutation.
const ref = upsertEconomyConfigRef(upsertEconomyConfigVars);
// Variables can be defined inline as well.
const ref = upsertEconomyConfigRef({ firstContentReward: ..., firstActivityReward: ..., repeatActivityReward: ..., rewardedRepeatLimitPerDay: ..., streakTier3Percent: ..., streakTier5Percent: ..., streakTier7Percent: ..., });

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
const { data } = await registerMyCurrentPhaseAttempt({ attemptId: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

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
  activityId: ..., 
  phaseNumber: ..., 
  score: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
};

// Call the `registerMyCurrentPhaseAttemptRef()` function to get a reference to the mutation.
const ref = registerMyCurrentPhaseAttemptRef(registerMyCurrentPhaseAttemptVars);
// Variables can be defined inline as well.
const ref = registerMyCurrentPhaseAttemptRef({ attemptId: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

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
const { data } = await completeMyCurrentPhase({ attemptId: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

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
  activityId: ..., 
  phaseNumber: ..., 
  score: ..., 
  correctAnswers: ..., 
  wrongAnswers: ..., 
};

// Call the `completeMyCurrentPhaseRef()` function to get a reference to the mutation.
const ref = completeMyCurrentPhaseRef(completeMyCurrentPhaseVars);
// Variables can be defined inline as well.
const ref = completeMyCurrentPhaseRef({ attemptId: ..., activityId: ..., phaseNumber: ..., score: ..., correctAnswers: ..., wrongAnswers: ..., });

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

