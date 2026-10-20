# Handoff técnico — oficina Ciência Delas

**Projeto:** Money Rank  
**Data do registro:** 20 de outubro de 2026
**Branch autoritativa:** `feat/oficina-ciencia-delas-redesign`  
**Base original:** `origin/new/redesign-sistemico` (`e6d7e44`)  
**Destino de hospedagem:** Render + Firebase  
**Estado:** implementação local concluída, pronta para publicação e ensaio

## 1. Regra de continuidade

Use somente `feat/oficina-ciencia-delas-redesign` para continuar este trabalho.
Não mescle a antiga `feat/oficina-ciencia-delas`: ela foi criada sobre uma
versão antiga do sistema e pode reintroduzir código incompatível.

Em outra máquina:

```powershell
git clone https://github.com/fabioholimadev/Money-Rank.git
Set-Location .\Money-Rank
git fetch origin
git switch --track origin/feat/oficina-ciencia-delas-redesign
git status --short --branch
git log -12 --oneline
```

Se a branch local já existir:

```powershell
git switch feat/oficina-ciencia-delas-redesign
git pull --ff-only
```

## 2. Decisões que não devem ser revertidas

- O fluxo regular e a oficina são categorias independentes.
- Aluno vinculado a uma equipe da oficina acessa somente a trilha e o ranking
  da oficina.
- A oficina não exige conteúdo ou vídeo antes das atividades.
- As quatro atividades podem ser repetidas livremente durante o período.
- Toda rodada válida concluída pontua; a nota de 0 a 100 vira a mesma quantidade
  de CapiCoins.
- Uma nova rodada usa uma nova sessão e pontua novamente. Reenviar a mesma
  sessão não pode duplicar recompensa.
- Ranking individual soma CapiCoins por participante; ranking de equipe soma
  os CapiCoins dos integrantes. Nesta oficina não há normalização pelo tamanho
  da equipe.
- O professor controla a janela competitiva pelo período: rascunho, ativo,
  pausado e encerrado.
- O modo de teste do professor usa dados reais do banco pedagógico, mas marca
  `is_test` e `test_run_id`; ele não altera saldo, progresso nem rankings.
- As experiências de IA foram removidas do fluxo ativo. Não reintroduzir
  CapiMentor, Chat de Dados, Gemini, `GEMINI_API_KEY` ou `GEMINI_MODEL` nesta
  entrega.
- Migração para Python e integração com Power BI são evoluções posteriores,
  fora do escopo da oficina atual.

## 3. O que foi implementado

### 3.1 Equipes e ingresso

- Evento de oficina ligado a um período competitivo.
- Criação de equipes pelo professor.
- Código numérico aleatório de oito dígitos.
- QR Code que abre o cadastro com o código preenchido.
- Cadastro com nome completo, turma livre, nome preferido, equipe e avatar.
- Matrícula exclusiva por participante/evento.
- Nome completo fica restrito ao acompanhamento do professor; rankings usam o
  nome preferido.
- Leitor de QR Code incorporado ao cadastro, aberto somente por ação do aluno,
  com câmera traseira preferencial e digitação manual como contingência.
- O Blueprint do Render permite câmera apenas na origem do próprio frontend e
  continua bloqueando geolocalização e microfone.
- O destino completo do QR Code é preservado depois do login Google, incluindo
  o código da equipe na URL.
- Equipes vazias podem ser apagadas pelo professor após confirmação. Equipes
  com participantes permanecem protegidas para preservar respostas e ranking.

### 3.2 Trilha competitiva

Rotas do aluno:

- `/trilha/oficina`;
- `/trilha/oficina/atividades/:activityKey`;
- `/ranking/oficina`.

As quatro atividades aparecem em progressão visual semelhante à trilha
regular, mas sem bloqueio entre elas:

1. Verdadeiro ou falso;
2. Ligar colunas;
3. Completar frases;
4. Quiz Ciência Delas.

Cada rodada apresenta um desafio por vez, mostra progresso e usa transições.
Em **Ligar colunas**, a rodada usa quatro elementos em cada lado e desenha
linhas SVG entre as associações selecionadas.

O banco inicial possui 96 itens curados e distribuídos entre os quatro
formatos. O conteúdo atual é uma base para revisão pedagógica posterior com o
professor, sem alterar a infraestrutura da oficina.

### 3.3 Professor

O painel foi separado em duas categorias:

- **Regular**: dados das turmas regulares;
- **Criação de times para oficina**: equipes, participantes, rodadas,
  CapiCoins e diagnóstico exclusivo da oficina.

O professor pode:

- selecionar um período;
- criar a oficina e as equipes;
- apagar equipes vazias após uma confirmação explícita;
- copiar códigos e exibir QR Codes;
- ativar ou pausar rapidamente o período;
- acompanhar ranking de equipes e participantes;
- consultar média, acertos, erros e dificuldade por atividade;
- abrir a visão de aluno em modo de teste;
- exportar um CSV exclusivo da oficina.

O CSV da oficina usa separador `;`, BOM UTF-8 para Excel e protege células que
começam por `=`, `+`, `-` ou `@`. Ele inclui resumo, ranking das equipes,
ranking individual, atividades e participantes, sem exportar UID, e-mail,
chaves internas ou URL de avatar.

### 3.4 Retirada da IA

Foram removidos do fluxo ativo:

- componentes `CapiMentor` e `TeacherDataChat`;
- serviços do mentor, Chat de Dados e atividade antiga baseada em IA;
- endpoints, diagnósticos e exports correspondentes;
- dependência `@google/genai`;
- variáveis Gemini dos exemplos, do validador e do `render.yaml`;
- testes e scripts exclusivos das experiências removidas.

Documentos históricos podem citar IA como parte do passado do projeto. Eles
não devem ser interpretados como configuração vigente.

## 4. Arquitetura e arquivos principais

### Frontend

- `frontend/src/pages/Trilha/WorkshopTrail.jsx`: hub competitivo.
- `frontend/src/pages/Trilha/WorkshopActivity.jsx`: fluxo de rodada, uma
  questão por vez.
- `frontend/src/components/workshop/WorkshopMatchingRound.jsx`: associação
  4 x 4 com linhas.
- `frontend/src/pages/WorkshopRanking.jsx`: rankings da oficina.
- `frontend/src/components/WorkshopTeamManager.jsx`: criação de evento,
  equipes, exclusão protegida, códigos e QR Codes.
- `frontend/src/components/WorkshopQrScanner.jsx`: leitor de QR Code pela
  câmera com fallback para digitação.
- `frontend/src/lib/workshopQrCode.js`: validação do código lido e preservação
  do destino completo durante o login.
- `frontend/src/components/WorkshopTeacherDashboard.jsx`: dados exclusivos da
  oficina e exportação CSV.
- `frontend/src/pages/TeacherStudentPreview.jsx`: visão segura do aluno.
- `frontend/src/lib/teacherSpreadsheetExport.js`: CSV regular e da oficina.
- `frontend/src/services/workshopService.js`: contexto, entrada e ranking.
- `frontend/src/services/workshopActivityService.js`: sessões e resultados.
- `frontend/src/services/teacherWorkshopService.js`: operações do professor.

### Backend e banco

- `backend/render-api/server.mjs`: rotas HTTP e autorização.
- `backend/render-api/workshop.mjs`: validação de equipes e oficina.
- `functions/src/workshopQuestionBank.js`: banco das questões.
- `functions/src/workshopActivityEngine.js`: sorteio, correção e pontuação.
- `dataconnect/schema/schema.gql`: equipes, matrículas e dados relacionados.
- `dataconnect/connector/queries.gql`: contexto, rankings e painéis.
- `dataconnect/connector/mutations.gql`: evento, equipes, matrículas, sessões
  e resultados idempotentes.

### Documentos

- `docs/oficina/PLANO_TRABALHO_OFICINA_CIENCIA_DELAS_2026-10-18.md`:
  arquitetura e requisitos completos.
- `docs/oficina/FLUXO_DA_OFICINA_CIENCIA_DELAS.md`: roteiro operacional dos
  100 minutos.
- `docs/oficina/BASE_PEDAGOGICA_E_FONTES_CIENCIA_DELAS.md`: conteúdo, fatos e
  fontes oficiais usados no banco.
- `docs/deploy/GUIA_HOSPEDAGEM_RENDER_FIREBASE_2026-08-11.md`: publicação.
- `docs/deploy/checklist-producao.md`: validação antes da oficina.

## 5. Como executar em outra máquina

Requisitos:

- Node.js 22;
- npm;
- acesso ao projeto Firebase para login Google;
- Java 21 ou superior somente se usar Functions/Storage Emulator. O fluxo
  padrão com Data Connect não exige Java.

Instalação:

```powershell
npm --prefix .\functions ci
npm --prefix .\backend\render-api ci
npm --prefix .\frontend ci

Copy-Item .\frontend\.env.example .\frontend\.env.local
Copy-Item .\backend\render-api\.env.example .\backend\render-api\.env.local
```

Nunca copie `.env.local` entre máquinas pelo Git e nunca versione segredos.

Execução em três terminais, todos na raiz do projeto:

```powershell
# Terminal 1 — Capi Bank / Data Connect, porta 9399
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

```powershell
# Terminal 2 — API, porta 8080
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-api.ps1
```

```powershell
# Terminal 3 — frontend, normalmente porta 5173
npm --prefix .\frontend run dev
```

Se o banco local estiver vazio:

```powershell
$env:FIREBASE_DATA_CONNECT_EMULATOR_HOST="127.0.0.1:9399"
npm --prefix .\backend\render-api run bank:import
```

Verificação:

```powershell
Invoke-RestMethod http://localhost:8080/healthz
Invoke-WebRequest http://localhost:8080/readyz
```

O manual completo fica em `docs/COMO_RODAR_LOCALMENTE.md`.

## 6. Testes recomendados

Para uma alteração ampla:

```powershell
npm --prefix .\functions run lint
npm --prefix .\functions test
npm --prefix .\backend\render-api test
npm --prefix .\frontend run test:teacher-export
npm --prefix .\frontend run test:workshop-qr
npm --prefix .\frontend run lint
npm --prefix .\frontend run build
powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
git diff --check
```

Na validação de 20/10/2026 passaram:

- 58 testes de Functions;
- 17 testes da API;
- teste dedicado da leitura e do redirecionamento do QR Code;
- teste de exportação CSV regular e da oficina;
- lint e build do frontend;
- geração/compilação do Data Connect;
- consulta integrada local com equipe, participante, tentativa e pontuação;
- build de produção `build:render`;
- validação de `render.yaml` pelo esquema público atual do Render.

O build emite apenas avisos conhecidos de chunk grande e importação mista do
Firebase App Check; não são falhas de compilação.

## 7. Render

O `render.yaml` define:

- `money-rank-api`: Web Service Docker;
- `money-rank-web`: Static Site React/Vite.

A branch não está fixada no YAML. No Blueprint do Render, selecione
`feat/oficina-ciencia-delas-redesign`; os serviços do mesmo repositório
acompanham a branch do Blueprint.

Variáveis manuais da API:

- `FRONTEND_ORIGIN`;
- `FIREBASE_CLIENT_EMAIL`;
- `FIREBASE_PRIVATE_KEY`.

Variáveis manuais do frontend:

- `VITE_API_URL`;
- `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`.

As demais constantes estão declaradas no Blueprint. Não configure variáveis
de IA. Se `GEMINI_API_KEY`, `GEMINI_MODEL` ou equivalentes existirem em um
serviço antigo, remova-as pelo painel do Render. O Render fornece `PORT`; não
crie essa variável manualmente.

Ordem recomendada:

1. enviar a branch ao GitHub;
2. publicar as operações novas com
   `npx -y firebase-tools@latest deploy --only dataconnect --project money-rank`;
3. selecionar/sincronizar a branch no Blueprint;
4. preencher os valores `sync: false` sem expô-los;
5. publicar `money-rank-api`;
6. testar `/healthz` e `/readyz`;
7. publicar `money-rank-web`;
8. atualizar `FRONTEND_ORIGIN` com a URL real e validar Auth/App Check;
9. testar câmera, digitação e exclusão de uma equipe vazia em produção.

## 8. Histórico dos commits da oficina

- `4470afc` — plano inicial da oficina;
- `17eaa42` — decisão de pontuação recorrente;
- `3863b45` — retirada das experiências ativas de IA;
- `6167ed6` — equipes, cadastro e trilha da oficina;
- `a2dbf13` — atividades, rankings e modo de teste;
- `ebe19e8` — documentos pedagógicos e fluxo operacional;
- `67169cf` — progressão visual, animações e ligar colunas 4 x 4;
- `b5aebab` — separação do painel Regular/Oficina por período;
- `d117c07` — exportação CSV da oficina;
- `0ba6a30` — preparação e documentação do Render.

## 9. Pendências reais

- Revisar todas as questões e explicações com o professor responsável.
- Fazer ensaio completo com várias contas e aparelhos antes da oficina.
- Confirmar que as equipes terão o mesmo tamanho ou definir nova regra de
  normalização.
- Configurar domínios autorizados do Firebase Auth e App Check para as URLs do
  Render.
- Executar o deploy real e o smoke de produção.
- Opcional depois da oficina: troca de equipe pelo professor com auditoria,
  Python para análise e integração com Power BI.

## 10. Cuidados para a próxima IA

- Inspecione o Git e o código; não confie em documentos históricos antigos.
- Não altere dados de produção, faça deploy ou apague equipes sem autorização
  explícita.
- Nunca exponha valores de `.env`, conta de serviço, tokens ou chaves.
- Use `apply_patch` para edições manuais e preserve mudanças do usuário.
- Se alterar schema ou operações `.gql`, regenere o SDK e execute o teste do
  Data Connect.
- Se alterar pontuação, teste idempotência e repetição em conjunto.
- Se alterar o CSV, mantenha BOM UTF-8, separador `;`, proteção contra fórmula
  e minimização de dados pessoais.

