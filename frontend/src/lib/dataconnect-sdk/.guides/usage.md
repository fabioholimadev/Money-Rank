# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertMyProfileWithAvatar, createLearningModuleVersionEditorial, createActivityDefinitionVersionEditorial, updateLearningModuleDraftEditorial, updateActivityDefinitionDraftEditorial, submitLearningModuleForReviewEditorial, submitActivityDefinitionForReviewEditorial, publishLearningModuleVersionEditorial, publishActivityDefinitionVersionEditorial, createResearchReviewEditorial } from '@money-rank/dataconnect';


// Operation UpsertMyProfileWithAvatar:  For variables, look at type UpsertMyProfileWithAvatarVars in ../index.d.ts
const { data } = await UpsertMyProfileWithAvatar(dataConnect, upsertMyProfileWithAvatarVars);

// Operation CreateLearningModuleVersionEditorial:  For variables, look at type CreateLearningModuleVersionEditorialVars in ../index.d.ts
const { data } = await CreateLearningModuleVersionEditorial(dataConnect, createLearningModuleVersionEditorialVars);

// Operation CreateActivityDefinitionVersionEditorial:  For variables, look at type CreateActivityDefinitionVersionEditorialVars in ../index.d.ts
const { data } = await CreateActivityDefinitionVersionEditorial(dataConnect, createActivityDefinitionVersionEditorialVars);

// Operation UpdateLearningModuleDraftEditorial:  For variables, look at type UpdateLearningModuleDraftEditorialVars in ../index.d.ts
const { data } = await UpdateLearningModuleDraftEditorial(dataConnect, updateLearningModuleDraftEditorialVars);

// Operation UpdateActivityDefinitionDraftEditorial:  For variables, look at type UpdateActivityDefinitionDraftEditorialVars in ../index.d.ts
const { data } = await UpdateActivityDefinitionDraftEditorial(dataConnect, updateActivityDefinitionDraftEditorialVars);

// Operation SubmitLearningModuleForReviewEditorial:  For variables, look at type SubmitLearningModuleForReviewEditorialVars in ../index.d.ts
const { data } = await SubmitLearningModuleForReviewEditorial(dataConnect, submitLearningModuleForReviewEditorialVars);

// Operation SubmitActivityDefinitionForReviewEditorial:  For variables, look at type SubmitActivityDefinitionForReviewEditorialVars in ../index.d.ts
const { data } = await SubmitActivityDefinitionForReviewEditorial(dataConnect, submitActivityDefinitionForReviewEditorialVars);

// Operation PublishLearningModuleVersionEditorial:  For variables, look at type PublishLearningModuleVersionEditorialVars in ../index.d.ts
const { data } = await PublishLearningModuleVersionEditorial(dataConnect, publishLearningModuleVersionEditorialVars);

// Operation PublishActivityDefinitionVersionEditorial:  For variables, look at type PublishActivityDefinitionVersionEditorialVars in ../index.d.ts
const { data } = await PublishActivityDefinitionVersionEditorial(dataConnect, publishActivityDefinitionVersionEditorialVars);

// Operation CreateResearchReviewEditorial:  For variables, look at type CreateResearchReviewEditorialVars in ../index.d.ts
const { data } = await CreateResearchReviewEditorial(dataConnect, createResearchReviewEditorialVars);


```