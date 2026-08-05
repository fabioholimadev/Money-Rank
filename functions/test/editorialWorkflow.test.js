import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const mutationsPath = new URL(
  '../../dataconnect/connector/mutations.gql',
  import.meta.url,
);

test('mutações de publicação exigem professor e estado IN_REVIEW', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const publications = source.match(
    /mutation Publish(?:LearningModule|ActivityDefinition)VersionEditorial[\s\S]*?(?=\nmutation |\n# )/g,
  );

  assert.equal(publications?.length, 2);
  for (const publication of publications) {
    assert.match(publication, /candidate\.status = 'IN_REVIEW'/);
    assert.match(publication, /AND EXISTS \(SELECT 1 FROM teacher\)/);
    assert.doesNotMatch(publication, /status IN \('DRAFT', 'IN_REVIEW'\)/);
    assert.ok(
      publication.indexOf('AND EXISTS (SELECT 1 FROM teacher)') <
        publication.indexOf('archived AS ('),
      'a autorização deve filtrar o alvo antes do arquivamento',
    );
    assert.match(publication, /selected\.status = 'IN_REVIEW'/);
    assert.match(publication, /COUNT\(\*\) FROM archived/);
  }
});

test('atividade valida aprovação pedagógica dentro da transação', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const activityPublication = source.match(
    /mutation PublishActivityDefinitionVersionEditorial[\s\S]*?(?=\nmutation |\n# )/,
  )?.[0];

  assert.match(activityPublication, /pedagogical'[\s\S]*teacher_approved/);
  assert.match(activityPublication, /approval\.status = 'TEACHER_APPROVED'/);
  assert.match(activityPublication, /approval\.fact_key = reviewed\.item->>'id'/);
  assert.match(activityPublication, /approval\.source_url = COALESCE/);
});

test('rascunhos deixam de ser editáveis depois do envio para revisão', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const updates = source.match(
    /mutation Update(?:LearningModule|ActivityDefinition)DraftEditorial[\s\S]*?(?=\nmutation |\n# )/g,
  );

  assert.equal(updates?.length, 2);
  for (const update of updates) {
    assert.match(update, /AND status = 'DRAFT'/);
    assert.doesNotMatch(update, /status IN \('DRAFT', 'IN_REVIEW'\)/);
  }
});

test('mutações com CTE de escrita usam o executor compatível', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const atomicMutations = source.match(
    /mutation (?:Update|Submit|Publish|Review)(?:LearningModule|ActivityDefinition|Research)[\s\S]*?(?=\nmutation |\n# )/g,
  );

  assert.equal(atomicMutations?.length, 7);
  for (const mutation of atomicMutations) {
    assert.match(mutation, /: _execute\(/);
    assert.doesNotMatch(mutation, /_executeReturningFirst/);
    assert.match(mutation, /INSERT INTO editorial_audit_log/);
  }
});

test('metadado de arquivo exige professor completo e versão DRAFT', async () => {
  const source = await readFile(mutationsPath, 'utf8');
  const assetMutation = source.match(
    /mutation CreateContentAssetEditorial[\s\S]*?(?=\nmutation |$)/,
  )?.[0];

  assert.ok(assetMutation, 'a mutação de ContentAsset deve existir');
  assert.match(assetMutation, /@auth\(level: NO_ACCESS\)/);
  assert.match(assetMutation, /teacher\.role = 'TEACHER'/);
  assert.match(assetMutation, /teacher\.profile_completed = TRUE/);
  assert.equal(
    assetMutation.match(/version\.status = 'DRAFT'/g)?.length,
    2,
    'módulos e atividades devem aceitar arquivos somente enquanto DRAFT',
  );
  assert.match(assetMutation, /storage_path/);
  assert.match(assetMutation, /sha256/);
});
