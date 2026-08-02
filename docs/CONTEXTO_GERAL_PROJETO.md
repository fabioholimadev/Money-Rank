# Contexto Geral e Handoff — Money Rank v2.0

> Documento vivo para transferência entre desenvolvedores e agentes Codex.
> Deve ser atualizado antes de cada commit de Task que altere código,
> arquitetura, regras de negócio, testes ou backlog.

## 1. Estado rápido da retomada

| Campo | Estado em 2026-08-02 |
| --- | --- |
| Repositório canônico nesta máquina | `C:\Documentos\Programação\Money Rank` |
| Repositório remoto | `https://github.com/fabioholimadev/Money-Rank.git` |
| Autor Git local | `fabioholimadev <fabio.holima.dev@gmail.com>` |
| Branch-base do trabalho atual | `feat/mvp-gamificacao-ia` |
| Branch para retomada | `feat/mvp-gamificacao-ia` |
| Último commit funcional | `5c8e1ce feat: implementa caminhos de decisao da Ilusao do Dinheiro` |
| Task atual | Nenhuma Task em andamento |
| Estado da Task 3.7 | Concluída, testada e documentada |
| Próxima Task prevista | Task 3.8 — A Engenharia do Desejo |

### Ação imediata para quem retomar

1. Confirmar o repositório correto:

   ```powershell
   git rev-parse --show-toplevel
   git status --short --branch
   ```

2. Confirmar que `feat/mvp-gamificacao-ia` contém `597dfe3` e `5c8e1ce`.
3. Preservar as alterações locais do usuário em `vite.config.js`.
4. Tratar os apontamentos em `frontend/src/lib/dataconnect-sdk/` como falsos
   diffs enquanto `git diff --quiet` retornar `0`.
5. Antes de codificar, criar `feat/task-3-8-engenharia-desejo` a partir da
   branch-base.
6. Executar a Task 3.8 inteira, incluindo documentação e validação, sem
   alterar incidentalmente o backend Supabase legado.

> Atenção: o Codex pode detectar outro diretório com nome semelhante em
> `C:\Users\fabio\Documents\Programação\Money Rank`. O trabalho desta sequência
> foi feito no repositório localizado diretamente em `C:\Documentos`.

## 2. Ideia e objetivo do produto

O **Money Rank** é uma plataforma gamificada de letramento financeiro,
educação cidadã e educação fiscal voltada a escolas técnicas. O modelo de
produto é B2B2C: a escola e o professor organizam o uso, enquanto os alunos
consomem conteúdos, realizam atividades, acumulam CapiCoins e competem em
rankings.

O público inicial é formado exclusivamente pelas turmas:

- **3º DSA**;
- **3º DSB**.

Os pilares do produto são:

1. trilhas curtas de conteúdo e atividades;
2. aprendizagem por repetição;
3. competição individual e entre turmas;
4. pesquisa científica com fontes auditáveis;
5. IA controlada, com fallback e validação do professor;
6. dashboard do professor com métricas e chat com os dados;
7. tutor contextual para alunos.

A proposta competitiva discutida é que a turma com melhor desempenho semanal
possa receber uma recompensa pedagógica definida pela escola, como isenção de
prova. A regra final, o teto de repetições e os critérios formais ainda precisam
ser aprovados pelo professor e pela escola.

## 3. Regras de colaboração com Codex

O agente deve atuar como engenheiro de software sênior e parceiro de
programação. O usuário trabalha em nível básico/intermediário, portanto as
explicações devem ser claras e os comandos locais devem ser completos.

### Ciclo obrigatório por Task

1. **Compreensão:** confirmar objetivo, restrições e ambiguidades relevantes.
2. **Panorama:** explicar arquitetura, suposições e impacto.
3. **Branch:** criar uma branch isolada antes de alterar código.
4. **Implementação:** fornecer e aplicar código completo, componentizado e
   documentado.
5. **Testes automatizados:** executar testes da Task, regressão, lint e build.
6. **Teste local do usuário:** entregar roteiro reproduzível e aguardar
   confirmação.
7. **Commit semântico:** somente depois da confirmação do usuário.
8. **Merge:** usar fast-forward para incorporar na branch-base.
9. **Handoff:** atualizar este documento antes do commit e registrar próxima
   Task, branch, testes e pendências.

### Padrão Git usado

```powershell
git switch feat/mvp-gamificacao-ia
git switch -c feat/task-X-Y-nome-curto

# depois do teste aprovado
git add -- <arquivos-exatos-da-task>
git commit -m "feat: descrição semântica"
git switch feat/mvp-gamificacao-ia
git merge --ff-only feat/task-X-Y-nome-curto
```

Não executar `git reset --hard`, não descartar arquivos do usuário e não
fazer `push` ou deploy sem autorização explícita.

## 4. Arquitetura atual

### Frontend

- Vite 8;
- React 19;
- React Router;
- Tailwind CSS;
- Material UI Icons e Lucide React;
- Firebase Web SDK.

Camadas principais:

```text
frontend/src/
├── components/          # layout, proteção, trilha e componentes comuns
├── contexts/            # AuthContext e estado sincronizado do aluno
├── data/                # conteúdos, bases científicas e bancos das atividades
├── lib/                 # motores puros, mapeadores e clientes Firebase
├── pages/               # telas e rotas React
└── services/            # acesso ao SQL Connect e Firebase AI Logic
```

### Autenticação

- Firebase Auth;
- apenas Google OAuth;
- não existem formulários de senha na experiência atual;
- depois do primeiro login, o aluno completa nome preferido, turma e avatar;
- somente `3º DSA` e `3º DSB` são válidas;
- avatares do catálogo são capivaras profissionais;
- também existe opção de foto, ainda armazenada localmente quando está em
  Base64.

### Banco relacional

Firebase SQL Connect, também chamado Firebase Data Connect na CLI e no SDK:

```text
dataconnect/
├── schema/schema.gql
├── connector/queries.gql
├── connector/mutations.gql
├── connector/connector.yaml
└── dataconnect.yaml
```

Configuração atual:

- projeto Firebase: `money-rank`;
- serviço: `money-rank-service`;
- conector: `money-rank-connector`;
- região: `southamerica-east1`;
- banco: `money-rank-db`;
- instância prevista: `money-rank-sql`;
- SDK local: `@money-rank/dataconnect`;
- emulador: `127.0.0.1:9399`.

Tabelas principais:

| Tabela | Responsabilidade |
| --- | --- |
| `users` | perfil, turma, role, avatar, saldo, fase e streak |
| `student_progress` | estado consolidado de cada aluno por fase |
| `activity_attempts` | tentativas imutáveis e idempotentes |
| `economy_config` | recompensas, streak e limite de repetições |
| `capi_coin_transactions` | livro-caixa auditável e dados da semana competitiva |

As operações do aluno usam `auth.uid` no servidor. O navegador não envia um
UID arbitrário para consultar outro aluno. As operações de conclusão usam SQL
atômico para atualizar tentativa, progresso, saldo, streak e livro-caixa sem
duplicar recompensa.

### Inteligência artificial

- Firebase AI Logic com Gemini Developer API;
- modelo configurável por `VITE_FIREBASE_AI_MODEL`;
- valor local atual de exemplo: `gemini-3.6-flash`;
- respostas estruturadas e validadas antes de renderizar;
- fallback determinístico obrigatório;
- IA nunca decide diretamente CapiCoins, streak, aprovação ou progressão;
- dados pessoais como nome, e-mail, UID, turma e foto não entram no prompt do
  quiz da Fase 1.

App Check:

- proteção básica do Firebase AI Logic está `Enforced`;
- `security.auth-only=true` está ativo;
- desenvolvimento usa token debug registrado e ignorado pelo Git;
- replay protection continua desligada;
- produção ainda precisa de reCAPTCHA Enterprise;
- detalhes bloqueantes ficam em `docs/deploy/checklist-producao.md`.

### Backend legado — não confundir com a arquitetura final

O diretório `backend/` ainda usa Express e Supabase. O frontend também ainda
possui `frontend/src/lib/supabase.js`, e `frontend/src/pages/Ranking.jsx` lê o
ranking pelo Supabase.

Esse código é legado e **não representa a arquitetura final**, mas ainda não
deve ser apagado sem uma Task de migração porque o ranking depende dele. A
migração dos rankings individual e por turma para SQL Connect permanece
pendente.

## 5. Linguagem e padrões visuais

Termos de infraestrutura não devem aparecer para o aluno.

| Interno | Texto permitido na interface |
| --- | --- |
| Firebase SQL Connect / PostgreSQL | **Capi Bank** |
| conexão com emulador | preparando, carregando ou guardando progresso |
| pontos de insight | **pontos de análise** |
| erro relacional | mensagem simples de indisponibilidade do Capi Bank |

Regras de UI atuais:

- mobile-first;
- sem rolagem horizontal;
- trilhas em acordeão;
- barra lateral dentro das telas de conteýo e atividade;
- fases futuras bloqueadas pelo progresso persistido;
- Fase 0 é o ponto inicial de todo aluno;
- alternativas A/B/C devem ser embaralhadas quando a posição puder revelar a
  resposta;
- não mostrar detalhes de banco, SDK, emulador ou API ao estudante.

## 6. Conteúdos e validação pedagógica

Cada fase, exceto o Passo 0, reserva espaço para:

1. um vídeo obrigatório;
2. slides;
3. resumo ou documento.

O aluno precisa acessar o vídeo e pelo menos um material extra disponível para
liberar a atividade. O modelo que o professor deve preencher está em
`docs/epic-3/modelo-materiais-professor.md`.

Fluxo de pesquisa acordado:

1. Codex e Gemini pesquisam fontes primárias ou institucionais;
2. Codex organiza fatos, URL, data de acesso e objetivo pedagógico;
3. o status técnico fica `source_verified` depois da conferência;
4. o status pedagógico começa como `pending_teacher_review`;
5. o professor valida linguagem, dificuldade e adequação;
6. somente depois o status muda para `teacher_approved`.

O Gemini não deve pesquisar livremente durante a tentativa do aluno. Ele deve
receber uma base controlada e não pode inventar uma fonte.

## 7. Progressão e economia competitiva

### Progressão

```text
Passo 0 -> Fase 1 -> Fase 2 -> Fase 3 -> Fase 4
```

- `currentPhase = 0` é o padrão;
- conteýo concluído deixa a fase `IN_PROGRESS` e libera a atividade;
- atividade aprovada deixa a fase `COMPLETED` e libera a próxima;
- fases concluídas podem ser revisadas;
- uma tentativa reprovada é salva, mas não libera a próxima fase.

### Recompensas

| Evento | Primeira conclusão | Repetição |
| --- | ---: | ---: |
| Conteúdo | 20 CapiCoins | 0 |
| Atividade aprovada | 100 CapiCoins-base | 20 CapiCoins-base |

Streak:

| Dias | Multiplicador |
| --- | ---: |
| 1–2 | 1,00x |
| 3–4 | 1,10x |
| 5–6 | 1,20x |
| 7+ | 1,30x |

- fuso: `America/Fortaleza`;
- o streak avança no máximo uma vez por dia;
- mesmo dia mantém;
- dia seguinte soma um;
- intervalo maior reinicia em um;
- limite remunerado diário está `null`, ou seja, ainda não definido;
- o cliente nunca escolhe o valor da recompensa.

Os rankings devem somar créditos positivos do livro-caixa dentro da semana,
não apenas o saldo atual da carteira. Assim, gastar moedas não apaga pontos
já conquistados na competição.

## 8. Tasks concluídas

| Task | Resultado | Commit |
| --- | --- | --- |
| 1.1 | remoção dos fluxos frontend de e-mail/senha | `0bb8470` |
| 1.2 | Firebase Auth e login exclusivo com Google | `3b994ad` |
| 1.3 | completar perfil, turmas e avatares/foto | `9c9083e` |
| 2.1 | schema relacional inicial do SQL Connect | `d792b4a` |
| 2.2 | SDK Web gerado e integração no React | `5baccde` |
| 3.1 | categorias da trilha expansíveis | `795b6b7` |
| 3.2 | Passo 0, sidebar, bloqueios e progressão persistente | `79cb9d0` |
| 3.3 | modelo padronizado de vídeo, slides e resumo | `b29f130` |
| 3.4 | repetições, livro-caixa e streak competitivo | `ae1f74a` |
| 3.5 | O Perigo Doce com Firebase AI Logic e fallback | `8ba9a35` |
| 3.6 | O Custo do Vício com personagens e cinco análises | `8b77215` |
| 3.7 | A Ilusão do Dinheiro com seis decisões ramificadas | `5c8e1ce` |

### Observação sobre Task 1.1

A limpeza concluiu o fluxo de autenticação visível, mas não removeu todo o
backend Supabase legado. Não marcar a migração de dados e ranking como
concluída.

## 9. Estado das atividades do Épico 3

### Fase 1 — O Perigo Doce

- cinco questões;
- quatro alternativas;
- aprovação com três acertos;
- Gemini recebe somente base auditável;
- fallback local seguro;
- contexto sem dados pessoais;
- documentação: `docs/epic-3/perigo-doce-ia.md`.

### Fase 2 — O Custo do Vício

- personagens Rafael, Beatriz e Diego;
- histórias em três linhas expansíveis;
- cinco decisões por personagem;
- nenhuma alternativa é tratada como errada;
- profundidade de 1 a 3 pontos de análise;
- nota final de 60 a 100;
- alternativas embaralhadas;
- repetição permite analisar outro personagem;
- documentação: `docs/epic-3/custo-vicio-estudo-caso.md`.

### Fase 3 — A Ilusão do Dinheiro

Concluída e registrada em `5c8e1ce`. O estado detalhado permanece na seção
seguinte para auditoria da mecânica e dos testes.

### Fase 4 — A Engenharia do Desejo

Ainda usa uma atividade estática temporária. A versão planejada deve:

- analisar publicidades absurdas de bets e consumo;
- pedir ao aluno para decidir se a publicidade existiu ou foi inventada;
- fornecer fonte e local da publicidade verdadeira;
- permitir que peças falsas sejam criadas para a mecânica;
- manter um banco auditável e revisado pelo professor;
- usar IA apenas para ajudar na pesquisa/organização, nunca para declarar uma
  peça verdadeira sem fonte.

## 10. Task 3.7 concluída — A Ilusão do Dinheiro

### Branch e arquivos

Branch: `feat/task-3-7-ilusao-dinheiro`.

Arquivos da Task:

- `frontend/src/data/ilusaoDinheiroPaths.js`;
- `frontend/src/lib/ilusaoDinheiroGame.js`;
- `frontend/src/pages/Trilha/SaudeConsumo/IlusaoDinheiro/AtividadeCaminhos.jsx`;
- `scripts/test-ilusao-dinheiro-game.mjs`;
- `docs/epic-3/ilusao-dinheiro-caminhos.md`;
- `frontend/package.json`;
- `frontend/src/data/healthConsumptionActivities.js`;
- `README.md`;
- este documento.

### Mecânica implementada

- protagonista: Alex;
- caixa narrativo inicial: 600 créditos simulados;
- meta: 420 créditos para feira técnica;
- seis decisões;
- alternativas embaralhadas;
- saldo narrativo possível: `-105` a `505`;
- nota: `0` a `100`;
- aprovação: nota mínima `60`;
- finais: Meta protegida, Plano de recuperação, Meta adiada e Futuro
  comprometido;
- caixa da história é separado da carteira real;
- reprovação salva tentativa sem moedas;
- aprovação usa 100/20 CapiCoins-base e streak do Capi Bank.

### Testes automatizados já aprovados

```powershell
cd frontend
npm run test:competitive-economy
npm run test:content-materials
npm run test:custo-vicio
npm run test:dataconnect-mappers
npm run test:ilusao-dinheiro
npm run test:perigo-doce-ai
npm run test:trail-progress
npm run lint
npm run build
```

O build passa, mas avisa que o bundle principal está acima de 500 kB. No teste
de 2026-08-01, o bundle principal ficou em aproximadamente 912 kB minificado e
266 kB gzip. Isso ainda precisa de code splitting antes ou durante a preparação
para produção.

### Teste manual validado

O usuário autorizou a continuidade e o commit em 2026-08-02 após o roteiro de
validação local. Os caminhos de referência permanecem documentados abaixo.

Caminho de reprovação:

1. comprar imediatamente;
2. aceitar pacote completo do passeio;
3. aceitar parcelas sem calcular;
4. ativar teste sem ler;
5. usar crédito sem comparar;
6. comprar upgrade.

Esperado: nota `0`, saldo `-105`, final **Futuro comprometido**, sem moedas e
Fase 4 bloqueada.

Caminho de aprovação:

1. esperar 24 horas;
2. propor atividade gratuita;
3. adiar o acessório;
4. comparar recursos gratuitos;
5. usar reserva planejada;
6. ignorar upgrade.

Esperado: nota `100`, saldo `505`, final **Meta protegida**, recompensa e Fase
4 liberada.

Se a conta já concluiu a versão antiga da Fase 3, o banco considera a nova
execução uma revisão e paga 20 CapiCoins-base. Para testar 100, usar uma conta
nova ou reiniciar os dados locais do emulador de forma consciente.

### Commits relacionados

- `597dfe3` — organiza o repositório e a documentação dos Épicos;
- `5c8e1ce` — implementa os caminhos de decisão da Ilusão do Dinheiro.

## 11. Backlog restante

### Épico 3

1. Task 3.8 — Engenharia do Desejo;
2. definir teto alto de repetições remuneradas com o professor;
3. revisar e aprovar todas as bases pedagógicas;
4. migrar rankings individual e por turma para SQL Connect;
5. confirmar numeração final das Tasks 3.9–3.11 antes de codificar.

O arquivo `docs/epic-3/economia-competitiva.md` menciona a Task 3.11 para
rankings. A numeração intermediária ainda não foi formalmente fechada.

### Épico 4 — Tutoria inteligente

- revisar o CapiMentor legado;
- remover dependência de Supabase/JWT legado;
- criar interface flutuante consistente;
- injetar fase, erros frequentes e saldo sem expor dados pessoais;
- proteger a IA com Auth e App Check;
- criar fallback e limites de custo.

### Épico 5 — Dashboard do professor

- rotas protegidas para `role = TEACHER`;
- gráficos do SQL Connect;
- métricas de alunos e turmas;
- ranking semanal individual e por turma;
- chat com os dados;
- autorização rigorosa para impedir acesso de aluno a dados coletivos.

### Deploy e capacidade

- escolher Firebase Hosting para a SPA ou outra hospedagem aprovada;
- configurar reCAPTCHA Enterprise no App Check;
- definir orçamento, cotas e monitoramento da IA;
- implantar SQL Connect de produção;
- testar aproximadamente 100 alunos durante sete dias;
- incluir cenário conservador de 100 sessões simultâneas;
- medir latência, erro, conexões, cotas, custo e idempotência;
- confirmar que não há perda ou duplicação de CapiCoins.

Checklist completo: `docs/deploy/checklist-producao.md`.

## 12. Ambiente local

### Variáveis

Usar `frontend/.env.local` ou `frontend/.env.development.local`, sempre
ignorados pelo Git. Nunca registrar chaves ou token debug neste documento.

Variáveis públicas esperadas estão em `frontend/.env.example`:

```dotenv
VITE_DATA_CONNECT_ENABLED=false
VITE_USE_DATA_CONNECT_EMULATOR=false
VITE_DATA_CONNECT_EMULATOR_HOST=127.0.0.1
VITE_DATA_CONNECT_EMULATOR_PORT=9399
VITE_FIREBASE_AI_ENABLED=false
VITE_FIREBASE_AI_MODEL=gemini-3.6-flash
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=
VITE_FIREBASE_APPCHECK_DEBUG=false
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=
```

### Comandos principais

```powershell
cd "C:\Documentos\Programação\Money Rank\frontend"
npm install
npm run dev
```

Em outro terminal, iniciar SQL Connect:

```powershell
cd "C:\Documentos\Programação\Money Rank"
npx -y firebase-tools@latest emulators:start --only dataconnect
```

No Windows, se a política de execução bloquear o processo do emulador:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dataconnect-docker.ps1
```

Para compilar e validar o conector:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
```

Um `ECONNRESET` durante o encerramento do PostgreSQL emulado já foi observado
no Windows. Avaliar o código de saída e a mensagem final do script antes de
tratar o encerramento como falha de schema.

## 13. Arquivos que não podem ser tratados como mudança da Task atual

### `vite.config.js`

Possui alterações anteriores do usuário. Não restaurar, sobrescrever ou
incluir automaticamente nos commits das Tasks do Épico 3.

### SDK gerado do Data Connect

Os arquivos abaixo aparecem como modificados por diferença LF/CRLF, mas não
possuem diff de conteúdo:

```text
frontend/src/lib/dataconnect-sdk/.guides/usage.md
frontend/src/lib/dataconnect-sdk/README.md
frontend/src/lib/dataconnect-sdk/esm/index.esm.js
frontend/src/lib/dataconnect-sdk/index.cjs.js
frontend/src/lib/dataconnect-sdk/index.d.ts
```

Antes de qualquer commit, conferir:

```powershell
git diff --quiet -- frontend/src/lib/dataconnect-sdk
```

Saída `0` significa que não existe diff real de conteúdo. Não fazer stage.

## 14. Skills relevantes instaladas

As skills disponíveis no ambiente atual que mais ajudam neste projeto são:

- `firebase-basics` — CLI, projeto ativo e configuração Firebase;
- `firebase-auth-basics` — Google Auth e acesso seguro;
- `firebase-data-connect` — schema, operações e SDK SQL Connect;
- `firebase-ai-logic-basics` — Gemini, structured output e segurança;
- `firebase-remote-config-basics` — configuração de modelo e limites;
- `firebase-hosting-basics` — deploy futuro da SPA;
- `browser:control-in-app-browser` — teste visual local quando a sessão de
  navegador estiver disponível;
- `skill-creator` — criação das skills específicas sugeridas abaixo.

Sempre ler o `SKILL.md` completo antes de usar uma skill em uma nova Task.

## 15. Skills de projeto que podem ser criadas

Estas skills ainda **não existem**. São candidatas para reduzir erros quando
outro Codex assumir.

### `money-rank-task-workflow`

Automatizaria o ritual de:

- conferir branch e working tree;
- proteger `vite.config.js` e SDK com falso diff;
- atualizar este documento;
- executar a matriz de testes;
- preparar stage explícito e commit semântico;
- fazer merge fast-forward.

### `money-rank-activity-authoring`

Padronizaria uma nova atividade:

- banco de fatos auditáveis;
- status técnico e pedagógico;
- alternativas embaralhadas;
- motor puro separado da UI;
- teste Node do motor;
- separação entre pontuação narrativa e CapiCoins;
- documentação do professor.

### `money-rank-economy-guard`

Verificaria invariantes:

- cliente não escolhe recompensa;
- primeira conclusão 100 e revisão 20;
- conteúdo repetido vale zero;
- streak usa Fortaleza;
- tentativa é idempotente;
- ranking semanal usa livro-caixa;
- escolhas simuladas não inflam a carteira real.

### `money-rank-ai-safety`

Padronizaria:

- Firebase Auth + App Check;
- prompt sem dados pessoais;
- structured output;
- validação estrita;
- fallback local;
- fontes permitidas;
- professor como aprovador final;
- limite de custo e modelo via Remote Config.

### `money-rank-ux-language`

Auditora de linguagem e interface:

- proibir SQL Connect, PostgreSQL e emulador no frontend visível;
- exigir termo Capi Bank;
- verificar mobile e overflow;
- conferir botões, loading, erro e acessibilidade;
- verificar que a posição A/B/C não entrega pontuação.

### `money-rank-release-readiness`

Executaria o checklist de produção:

- lint, testes e build;
- code splitting;
- App Check e reCAPTCHA Enterprise;
- variáveis seguras;
- deploy e rollback;
- teste de 100 alunos por sete dias;
- relatório de capacidade e custo.

## 16. Organização do repositório e da documentação

Em 2026-08-02 foi concluída uma limpeza estrutural no commit `597dfe3`:

- removidas as configurações locais `.claude/`, `.kiro/` e `.vscode/`;
- removidos `dataconnect-debug.log` e `pglite-debug.log`, que são artefatos
  locais ignorados;
- removidos os assets sem uso `frontend/public/icons.svg`,
  `frontend/src/assets/react.svg` e `frontend/src/assets/vite.svg`;
- substituído o README genérico do Vite por um guia real do frontend;
- adicionadas regras no `.gitignore` para configurações locais de agentes e
  editores;
- criado `docs/README.md` como índice documental;
- criadas pastas `docs/epic-1` a `docs/epic-5`, cada uma com status,
  implementação concluída ou planejamento futuro;
- mantidos `README.md` da raiz, este contexto e `docs/deploy/` com papéis
  distintos.

O requisito útil da especificação antiga do Kiro, bloqueio linear e proteção
contra avanço duplicado, foi preservado em `docs/epic-3/README.md`, adaptado
para fase 0, Firebase Auth e Capi Bank. As referências antigas a Supabase e fase
inicial 1 não representam mais a arquitetura desejada.

A organização entrou em um commit `chore` separado do commit funcional da
Task 3.7. `vite.config.js` e falsos diffs do SDK foram excluídos do commit.

Validação executada em 2026-08-02:

- links locais aprovados em 15 arquivos Markdown;
- `git diff --check` aprovado;
- testes de economia, materiais, Custo do Vício, mapeadores, Ilusão do
  Dinheiro, Perigo Doce e progressão aprovados;
- `npm run lint` aprovado;
- `npm run build` aprovado;
- permanece o aviso conhecido do bundle principal de aproximadamente 912 kB
  minificado e 266 kB gzip.

### Estrutura documental obrigatória

```text
docs/
|-- README.md
|-- CONTEXTO_GERAL_PROJETO.md
|-- epic-1/README.md
|-- epic-2/README.md
|-- epic-3/README.md e documentos das atividades
|-- epic-4/README.md
|-- epic-5/README.md
`-- deploy/checklist-producao.md
```

Antes de cada commit, atualizar o README do Épico afetado. Nos Épicos
concluídos, registrar o que realmente foi implementado e o hash do commit. Nos
planejados, registrar como será feito; depois da implementação, substituir a
previsão pelo resultado verificado.

## 17. Regra de manutenção deste documento

Antes de cada commit de Task, atualizar obrigatoriamente:

1. data e tabela **Estado rápido da retomada**;
2. branch ativa e último commit;
3. tabela **Tasks concluídas**;
4. seção da atividade alterada;
5. testes executados e seus resultados;
6. dívidas técnicas descobertas;
7. arquivos que devem ou não entrar no commit;
8. próxima ação reproduzível;
9. qualquer nova decisão do professor ou do usuário.

Não inserir neste arquivo:

- tokens;
- chaves privadas;
- conteúdo de `.env.local`;
- e-mails de alunos;
- UIDs;
- dados reais de desempenho;
- credenciais de serviço.

Este documento resume o projeto. Para detalhes de uma área, consultar também:

- `README.md`;
- `docs/README.md`;
- `docs/epic-1/README.md` a `docs/epic-5/README.md`;
- documentos complementares em `docs/epic-3/`;
- `docs/deploy/checklist-producao.md`;
- `dataconnect/schema/schema.gql`;
- `dataconnect/connector/*.gql`;
- testes em `scripts/`.
