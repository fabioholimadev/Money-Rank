# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertMyProfileWithAvatar, upsertMyProfileWithPhoto, upsertMyProfileWithoutSyncedPhoto, upsertStudentProgress, applyCapiCoinTransaction, upsertEconomyConfig, createCompetitionPeriod, updateCompetitionPeriodStatus, createAuthoritativeActivitySession, markAuthoritativeActivitySessionSubmitted } from '@money-rank/dataconnect';


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

// Operation UpsertEconomyConfig:  For variables, look at type UpsertEconomyConfigVars in ../index.d.ts
const { data } = await UpsertEconomyConfig(dataConnect, upsertEconomyConfigVars);

// Operation CreateCompetitionPeriod:  For variables, look at type CreateCompetitionPeriodVars in ../index.d.ts
const { data } = await CreateCompetitionPeriod(dataConnect, createCompetitionPeriodVars);

// Operation UpdateCompetitionPeriodStatus:  For variables, look at type UpdateCompetitionPeriodStatusVars in ../index.d.ts
const { data } = await UpdateCompetitionPeriodStatus(dataConnect, updateCompetitionPeriodStatusVars);

// Operation CreateAuthoritativeActivitySession:  For variables, look at type CreateAuthoritativeActivitySessionVars in ../index.d.ts
const { data } = await CreateAuthoritativeActivitySession(dataConnect, createAuthoritativeActivitySessionVars);

// Operation MarkAuthoritativeActivitySessionSubmitted:  For variables, look at type MarkAuthoritativeActivitySessionSubmittedVars in ../index.d.ts
const { data } = await MarkAuthoritativeActivitySessionSubmitted(dataConnect, markAuthoritativeActivitySessionSubmittedVars);


```