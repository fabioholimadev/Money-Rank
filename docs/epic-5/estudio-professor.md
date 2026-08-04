# Estúdio do Professor — especificação para implementação

## Objetivo

Dar ao professor controle editorial sobre conteúdos e atividades sem permitir
que um rascunho inválido afete uma tentativa valendo CapiCoins.

## Escopo

- editar vídeo do YouTube e metadados;
- publicar PDF, PPTX e DOCX pelo Firebase Storage ou URL HTTPS validada;
- editar slides, resumo e materiais extras;
- revisar fontes sugeridas por Codex/Gemini;
- acrescentar fatos e sugestões de questões ao Perigo Doce;
- editar personagens/decisões do Custo do Vício;
- editar caminhos/finais da Ilusão do Dinheiro;
- editar publicidades reais/fictícias da Engenharia do Desejo;
- visualizar prévia exatamente como aluno, sem progresso ou recompensa.

## Modelo de publicação

Estados: `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`. Apenas uma versão publicada
por módulo/atividade. Publicar deve ser transacional e preservar a versão
anterior para rollback.

Tabelas planejadas:

- `LearningModuleVersion`;
- `ActivityDefinitionVersion`;
- `ResearchReview`;
- `ContentAsset`;
- `EditorialAuditLog`.

Cada registro guarda autor, data, versão, status e resumo da mudança. Asset
guarda URL, tipo MIME, tamanho e hash; o arquivo fica no Storage.

## Autorização

- leitura do aluno: somente `PUBLISHED`;
- escrita: perfil `TEACHER` verificado no SQL Connect;
- upload: regras de Storage restritas a professor e tipos/tamanhos permitidos;
- publicação: Function autoritativa valida conteúdo e estrutura;
- IA nunca publica nem altera pontuação.

## Validação por atividade

- Perigo Doce: fonte HTTPS, alegação, explicação e equívocos; cinco questões;
- Custo do Vício: no mínimo três personagens, cinco decisões e pesos 1/2/3;
- Ilusão do Dinheiro: seis decisões e caminhos que não produzam saldo inválido;
- Engenharia do Desejo: ao menos três reais e três fictícias; real exige fonte;
- todos os IDs são imutáveis dentro da versão e não repetidos.

## Sequência de implementação

1. branch `feat/task-5-4-teacher-studio`;
2. schema, índices e operações autorizadas;
3. Storage e regras auditadas;
4. seed das versões estáticas atuais;
5. serviço e abas do painel;
6. editores por atividade;
7. prévia sem recompensa;
8. Functions carregando somente versão publicada;
9. testes de publicação, rollback, autorização e conteúdo inválido;
10. teste manual e commits.

Não substituir os arquivos estáticos antes do seed, validação e fallback estarem
prontos. Eles serão a referência de recuperação durante a migração.
