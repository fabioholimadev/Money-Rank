# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertMyProfileWithAvatar, upsertMyProfileWithPhoto, upsertMyProfileWithoutSyncedPhoto, upsertStudentProgress, applyCapiCoinTransaction, initializeMyTrail, completeMyIntroduction, completeMyCurrentPhaseContent, registerMyCurrentPhaseAttempt, completeMyCurrentPhase } from '@money-rank/dataconnect';


// Operation UpsertMyProfileWithAvatar:  For variables, look at type UpsertMyProfileWithAvatarVars in ../index.d.ts
const { data } = await UpsertMyProfileWithAvatar(dataConnect, upsertMyProfileWithAvatarVars);

// Operation UpsertMyProfileWithPhoto:  For variables, look at type UpsertMyProfileWithPhotoVars in ../index.d.ts
const { data } = await UpsertMyProfileWithPhoto(dataConnect, upsertMyProfileWithPhotoVars);

// Operation UpsertMyProfileWithoutSyncedPhoto:  For variables, look at type UpsertMyProfileWithoutSyncedPhotoVars in ../index.d.ts
const { data } = await UpsertMyProfileWithoutSyncedPhoto(dataConnect, upsertMyProfileWithoutSyncedPhotoVars);

// Operation UpsertStudentProgress:  For variables, look at type UpsertStudentProgressVars in ../index.d.ts
const { data } = await UpsertStudentProgress(dataConnect, upsertStudentProgressVars);

// Operation ApplyCapiCoinTransaction:  For variables, look at type ApplyCapiCoinTransactionVars in ../index.d.ts
const { data } = await ApplyCapiCoinTransaction(dataConnect, applyCapiCoinTransactionVars);

// Operation InitializeMyTrail: 
const { data } = await InitializeMyTrail(dataConnect);

// Operation CompleteMyIntroduction: 
const { data } = await CompleteMyIntroduction(dataConnect);

// Operation CompleteMyCurrentPhaseContent:  For variables, look at type CompleteMyCurrentPhaseContentVars in ../index.d.ts
const { data } = await CompleteMyCurrentPhaseContent(dataConnect, completeMyCurrentPhaseContentVars);

// Operation RegisterMyCurrentPhaseAttempt:  For variables, look at type RegisterMyCurrentPhaseAttemptVars in ../index.d.ts
const { data } = await RegisterMyCurrentPhaseAttempt(dataConnect, registerMyCurrentPhaseAttemptVars);

// Operation CompleteMyCurrentPhase:  For variables, look at type CompleteMyCurrentPhaseVars in ../index.d.ts
const { data } = await CompleteMyCurrentPhase(dataConnect, completeMyCurrentPhaseVars);


```