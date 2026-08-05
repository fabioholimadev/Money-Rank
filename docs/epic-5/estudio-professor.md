# Task 5.4 — Estúdio do Professor

## Resultado implementado

O Estúdio permite que uma conta `TEACHER` administre conteúdo pedagógico sem
editar arquivos do frontend e sem deixar um rascunho afetar tentativas valendo
CapiCoins. A rota protegida é `/professor/estudio`.

As versões seguem o fluxo:

```text
DRAFT -> IN_REVIEW -> PUBLISHED -> ARCHIVED
```

Somente uma versão de cada módulo ou atividade permanece publicada. Ao
publicar outra, a anterior é arquivada e continua registrada para auditoria e
recuperação.

## O que o professor consegue editar

- vídeo e materiais complementares por URL HTTPS;
- PDF, PPT/PPTX e DOC/DOCX enviados ao Firebase Storage, até 8 MiB;
- título, descrição, slides e resumo das cinco etapas da trilha;
- fatos, fontes e equívocos do Perigo Doce;
- personagens, histórias, cinco decisões e pesos 1/2/3 do Custo do Vício;
- saldo inicial, seis decisões, escolhas e consequências da Ilusão do Dinheiro;
- publicidades reais/fictícias e evidências da Engenharia do Desejo;
- pesquisas propostas, com aprovação ou rejeição e observação;
- histórico editorial e prévia sem progresso ou recompensa.

## Arquitetura e segurança

- tabelas `LearningModuleVersion`, `ActivityDefinitionVersion`, `ContentAsset`,
  `ResearchReview` e `EditorialAuditLog` no Capi Bank;
- operações editoriais SQL Connect marcadas `NO_ACCESS` e acessadas apenas por
  Cloud Functions;
- a Function verifica `role = TEACHER` antes de ler rascunhos ou escrever;
- o Capi Bank repete a verificação de professor e de perfil completo;
- somente `DRAFT` aceita edição e arquivo; `IN_REVIEW` fica somente leitura;
- somente `IN_REVIEW` pode ser publicado, arquivando a versão anterior na
  mesma operação;
- alunos recebem apenas registros `PUBLISHED` por callables autenticadas;
- o motor autoritativo usa a definição publicada para calcular respostas;
- IDs, fase e pesos estruturais são validados no servidor;
- fontes reais e materiais publicados exigem HTTPS;
- o JSON completo é limitado a 250 KB;
- a IA pode propor pesquisa, mas não publica automaticamente;
- `source_verified` exige uma revisão de pesquisa aprovada e vinculada
  exatamente à atividade, fato, URL e alegação;
- upload valida extensão, MIME, assinatura binária, Base64, tamanho e SHA-256;
- falha ao registrar o metadado remove o binário enviado como compensação;
- `storage.rules` aplica negação por padrão; o navegador não grava arquivos;
- o catálogo estático atual é importado como versão 1 e permanece fallback.

O backend usa uma consulta leve para verificar o seed, evitando carregar todos
os payloads editoriais toda vez que um aluno inicia uma atividade.

## Arquivos principais

- `dataconnect/schema/schema.gql`;
- `dataconnect/connector/queries.gql`;
- `dataconnect/connector/mutations.gql`;
- `functions/src/editorialRepository.js`;
- `functions/src/editorialValidation.js`;
- `functions/src/teacherStudio.js`;
- `functions/src/teacherStudioStorage.js`;
- `functions/src/generated/editorial-seed.json`;
- `functions/test/editorialValidation.test.js`;
- `functions/test/editorialWorkflow.test.js`;
- `functions/test/teacherStudioStorage.test.js`;
- `frontend/src/pages/TeacherStudio.jsx`;
- `frontend/src/components/teacherStudio/`;
- `frontend/src/services/teacherStudioService.js`;
- `frontend/src/services/publishedEditorialService.js`;
- `storage.rules`;
- `firebase.json`;
- `scripts/build-editorial-seed.mjs`.

## Validação automática executada

- compilação e geração do SDK Data Connect: aprovadas;
- smoke test editorial anterior: 5 módulos, 4 atividades e leituras publicadas;
- 38 testes das Functions: aprovados;
- smoke de salvamento do rascunho v2 da Introdução: aprovado, com
  preservação do estado `DRAFT` e do conteúdo existente;
- lint das Functions: aprovado;
- lint do frontend: aprovado;
- build Vite: aprovado;
- validação determinística de 5 módulos e 4 atividades: aprovada.

O build integrado da área do professor informa que o chunk principal possui
aproximadamente 837 KB.
Isso não bloqueia o Estúdio, mas deve ser resolvido com divisão de código
antes do teste de carga/deploy final.

O emulador de Storage ainda não foi executado neste computador: a Firebase CLI
exige Java e o executável não está instalado ou disponível no `PATH`. Os testes
unitários das regras de entrada, upload e compensação passaram, mas o smoke de
Storage permanece parte obrigatória do roteiro manual.

## Roteiro de teste local

1. Na raiz do repositório, inicie os emuladores:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

2. Em outro terminal, inicie o frontend:

```powershell
Set-Location .\frontend
npm run dev
```

3. Entre com a conta promovida a professor e abra `/professor`.
4. Clique em **Estúdio** e confirme as abas Conteúdos, Atividades, Pesquisas e
   Auditoria.
5. Em Conteúdos, crie um rascunho de uma fase, altere apenas o título ou uma
   URL HTTPS, salve e confirme que a versão publicada não mudou.
   Links comuns do YouTube (`watch`, `youtu.be`, `shorts` ou `live`) devem ser
   convertidos para `youtube-nocookie.com/embed/`. Abra **Ver prévia** e
   confirme o vídeo antes de publicar. Use o link de nova guia para distinguir
   bloqueio do iframe no navegador de incorporação desativada pelo proprietário.
6. Ainda em `DRAFT`, envie um PDF, PPT/PPTX ou DOC/DOCX menor que 8 MiB. Confirme
   que o link do documento foi preenchido e que o material abre corretamente.
7. Tente enviar um tipo não permitido e um arquivo maior que 8 MiB; ambos devem
   ser recusados sem apagar o rascunho.
8. Envie o rascunho para revisão. Confirme que campos e upload ficam somente
   leitura, que a mensagem confirma salvamento + revisão e que ainda não é
   possível editar essa versão.
9. Publique e reabra a fase como aluno para confirmar o novo conteúdo.
10. Crie outro rascunho da mesma fase, publique e confirme na Auditoria que a
   versão anterior foi arquivada.
11. Em Atividades, crie um rascunho do Perigo Doce. Tente remover fatos até ficar
   abaixo de cinco: o servidor deve rejeitar.
12. No Custo do Vício, mantenha cinco decisões e os pesos 1, 2 e 3. Troque os
   textos, publique, abra a atividade como aluno e confirme os novos dados.
13. Em Engenharia do Desejo, confirme manualmente a aprovação pedagógica dos
    cards criados pelo projeto; para uma fonte real, aprove antes a pesquisa
    correspondente. A publicação deve falhar enquanto houver pendência.
14. Confirme que a prévia do Estúdio não altera moedas, streak ou progresso.
15. Em Pesquisas, registre uma fonte HTTPS, aprove/rejeite e confira a Auditoria.
16. Saia da conta de professor, entre como aluno e tente abrir
    `/professor/estudio`: o acesso deve ser negado/redirecionado.
17. Como aluno, confirme que um rascunho não publicado nunca aparece.

Para evitar interferência no restante do teste, use alterações claramente
identificáveis e mantenha uma versão publicada válida ao terminar.

## Registro de commit

O Estúdio e a conclusão funcional da área do professor foram registrados no
commit `7440824 feat: conclui area do professor`.
