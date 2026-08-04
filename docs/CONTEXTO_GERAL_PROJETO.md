# Contexto Geral e Handoff — Money Rank v2.0

> Documento vivo para transferência entre desenvolvedores e agentes Codex.
> Deve ser atualizado antes de cada commit de Task que altere código,
> arquitetura, regras de negócio, testes ou backlog.

## 1. Estado rápido da retomada

| Campo | Estado em 2026-08-04 |
| --- | --- |
| Repositório canônico nesta máquina | `C:\Documentos\Programação\Money Rank` |
| Repositório remoto | `https://github.com/fabioholimadev/Money-Rank.git` |
| Autor Git local | `fabioholimadev <fabio.holima.dev@gmail.com>` |
| Branch-base do trabalho atual | `feat/mvp-gamificacao-ia` |
| Branch para retomada | `feat/task-5-1-teacher-access` |
| Último commit funcional | `d92a311 fix: evita ambiente local parcial nas atividades` |
| Task atual | Épico 3 concluído; iniciar Task 5.1 |
| Estado da Task 3.7 | Concluída, testada e documentada |
| Estado da Task 3.8 | Concluída, testada e documentada |
| Próxima Task prevista | Task 5.1 — acesso e rotas do professor |

### Ação imediata para quem retomar

1. Confirmar o repositório correto:

   ```powershell
   git rev-parse --show-toplevel
   git status --short --branch
   ```

2. Trabalhar em `feat/task-5-1-teacher-access`, criada a partir de
   `feat/mvp-gamificacao-ia` depois do encerramento do Épico 3.
3. Preservar as alterações locais do usuário em `vite.config.js`.
4. Reconhecer que os diffs atuais do SDK são reais: incluem
   `ActivitySession` e operações administrativas `NO_ACCESS` da Task 3.10.
5. Ler `docs/epic-3/pontuacao-autoritativa.md` antes de alterar sessões,
   gabaritos, Functions ou recompensas.
6. Antes de alterar permissões, ler `docs/epic-5/README.md` e auditar o modelo
   atual de usuário, AuthContext e proteções do SQL Connect.

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
| `activity_sessions` | sessões temporárias, payload público e gabarito privado |
| `economy_config` | recompensas, streak e limite de repetições |
| `capi_coin_transactions` | livro-caixa auditável e dados da semana competitiva |

As operações do aluno usam `auth.uid` no servidor. O navegador não envia um
UID arbitrário para consultar outro aluno. As operações de conclusão usam SQL
atômico para atualizar tentativa, progresso, saldo, streak e livro-caixa sem
duplicar recompensa.

### Inteligência artificial e Functions

- a Task 3.10 moveu a geração do quiz da Fase 1 para Cloud Functions;
- o backend usa o SDK `@google/genai` e segredo `GEMINI_API_KEY`;
- modelo configurável por `GEMINI_MODEL`, com exemplo `gemini-3.6-flash`;
- respostas estruturadas são validadas antes de o payload público chegar ao
  React;
- sem chave ou em falha da IA, o servidor cria fallback determinístico;
- gabarito, nota, aprovação e recompensa não são confiados ao navegador;
- nome, e-mail, UID, turma e foto não entram no prompt do quiz.

App Check:

- proteção básica do Firebase AI Logic está `Enforced`;
- `security.auth-only=true` está ativo;
- desenvolvimento usa token debug registrado e ignorado pelo Git;
- as callables autoritativas exigem App Check e proteção contra replay fora
  do emulador; no emulador ambas ficam desativadas para teste local;
- produção ainda precisa de reCAPTCHA Enterprise;
- detalhes bloqueantes ficam em `docs/deploy/checklist-producao.md`.

### Backend legado — não confundir com a arquitetura final

O diretório `backend/` ainda usa Express e Supabase. O frontend também possui
`frontend/src/lib/supabase.js` porque o CapiMentor legado ainda depende desse
backend. A Task 3.11 removeu o Supabase de `frontend/src/pages/Ranking.jsx`.

Esse código legado **não representa a arquitetura final**, mas não deve ser
apagado fora de uma Task de migração do tutor. O ranking já usa o Capi Bank;
o CapiMentor deve ficar desabilitado no piloto se o Épico 4 continuar adiado.

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
| 3.8 | A Engenharia do Desejo com banco 6/6 e rodadas 3/3 | `8e76b9e` |
| 3.9 | Períodos competitivos e repetição segura sem teto diário | `eefaf10` |
| 3.10 | pontuação autoritativa, sessões privadas e Functions | `a099225` |

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

A atividade estática temporária foi substituída no commit `8e76b9e`. Estado
atual:

- banco versionado com seis publicidades reais e seis peças inventadas;
- rodada aleatória e equilibrada em três itens de cada tipo;
- botões REAL/INVENTED mudam entre as posições A e B;
- fonte, canal, local e período aparecem apenas depois da resposta;
- quatro acertos em seis concluem a fase;
- tentativa reprovada não paga recompensa;
- aprovação e repetição usam as operações atômicas existentes do Capi Bank;
- teste do motor: `npm run test:engenharia-desejo`;
- documentação: `docs/epic-3/engenharia-desejo-fato-fake.md`;
- validação manual aprovada em 2026-08-04;
- revisão pedagógica do professor ainda pendente.

Regras preservadas para evolução do banco:

- analisar publicidades absurdas de bets e consumo;
- pedir ao aluno para decidir se a publicidade existiu ou foi inventada;
- fornecer fonte e local da publicidade verdadeira;
- permitir que peças falsas sejam criadas para a mecânica;
- manter um banco auditável e revisado pelo professor;
- usar IA apenas para ajudar na pesquisa/organização, nunca para declarar uma
  peça verdadeira sem fonte.

### Fundação competitiva — Task 3.9 concluída

Branch: `feat/task-3-9-competition-rules`.

Decisões e implementação:

- limite diário remunerado continua `null`, permitindo competição livre;
- intervalo mínimo entre recompensas de revisão: 30 segundos;
- tentativa rápida continua auditada com `RATE_LIMIT`, sem moedas e sem streak;
- primeira conclusão nunca é bloqueada pelo intervalo;
- `CompetitionPeriod` possui `DRAFT`, `SCHEDULED`, `ACTIVE`, `PAUSED` e
  `CLOSED`;
- um agendamento conta automaticamente somente entre `startsAt` e `endsAt`;
- pausar interrompe a atribuição ao ranking, mas não interrompe CapiCoins,
  progresso ou tentativas;
- transações positivas dentro da janela recebem `competitionPeriodId`;
- administração e sinais de abuso usam `NO_ACCESS` e ficam reservados ao
  backend confiável do Épico 5;
- a limpeza de dados foi apenas planejada em
  `docs/deploy/limpeza-pre-lancamento.md`; nenhum dado real foi apagado.

Arquivos centrais: schema/operações em `dataconnect/`, SDK gerado, utilitários
`competitiveEconomy.js` e `competitionPeriod.js`, serviço
`competitionDataService.js` e mensagens das quatro atividades.

Validações concluídas: nove suítes de testes, ESLint, build, geração do
SDK e recarga/migração pelo emulador ativo. O build conserva o aviso conhecido
do bundle principal, agora com aproximadamente 940 kB minificado e 273 kB
gzip. O usuário aprovou o teste local em 2026-08-04 e o commit funcional é
`eefaf10`.

### Pontuação autoritativa — Task 3.10 validada

Branch: `feat/task-3-10-authoritative-scoring`.

Estado implementado, ainda sem commit:

- Cloud Functions Node.js 22 na região `southamerica-east1`;
- callables `startActivitySession` e `submitActivitySession`;
- Firebase Auth obrigatório e App Check/replay obrigatórios fora do emulador;
- sessões de 45 minutos, vinculadas ao aluno e encerradas após persistência;
- `ActivitySession.answerKey` e operações de recompensa protegidos por
  `NO_ACCESS`;
- ID da tentativa igual ao da sessão e relação única contra pagamento
  duplicado;
- motor autoritativo para as quatro fases;
- O Perigo Doce gerado no backend com Gemini e fallback seguro;
- frontend envia somente IDs das escolhas;
- manifesto canônico gerado por
  `scripts/build-authoritative-activity-manifest.mjs`;
- detalhes em `docs/epic-3/pontuacao-autoritativa.md`.

Validações automatizadas aprovadas em 2026-08-04: cinco testes das
Functions, lint do backend, nove suítes de regressão do frontend, lint, build,
geração do SDK e carregamento direto das duas exports. O primeiro teste do
emulador revelou peers ausentes do `firebase-admin`; `@firebase/app` e
`@firebase/app-compat` foram adicionados e o carregamento passou. O build
mantém o aviso conhecido do chunk principal, agora com aproximadamente 932 kB
minificado e 270 kB gzip. O `npm audit` das Functions informa sete achados
moderados transitivos, sem correção não destrutiva disponível.

O usuário autorizou a finalização em 2026-08-04. O commit funcional é
`a099225`, o registro documental é `cc0293e` e ambos já estão integrados na
branch-base por fast-forward.

### Rankings no Capi Bank — Task 3.11 concluída

Branch: `feat/task-3-11-sql-rankings`.

Estado implementado e validado:

- `Ranking.jsx` não importa mais Supabase;
- pontos são a soma dos créditos positivos associados ao período, não o
  saldo atual da carteira;
- ranking individual limitado a 100 perfis completos;
- ranking coletivo apenas para `3º DSA` e `3º DSB`;
- empates usam `DENSE_RANK()`;
- consulta não retorna UID nem e-mail;
- CTE autoriza somente um perfil autenticado e completo;
- linhas `Any` do SQL nativo são normalizadas e validadas no frontend;
- índice composto por período e aluno aplicado pelo emulador;
- utilitário administrativo recusa hosts fora do emulador local;
- documentação: `docs/epic-3/rankings-sql-connect.md`.

Commit funcional: `6860943`. Correção do ambiente local: `d92a311`.

Validações concluídas: `dataconnect:compile`, geração do SDK, teste puro dos
mapeadores, consulta autenticada real com dois alunos e duas turmas, dez
suítes de regressão do frontend, testes das Functions, ambos os linters e
build. O período temporário foi encerrado depois do teste. A retirada do
Supabase da página reduziu o chunk principal de aproximadamente 932 kB para
737 kB minificado, embora o aviso acima de 500 kB continue.

O inventário de conteúdo das quatro atividades, incluindo bancos, diretrizes
e quantidade de possibilidades, está em
`docs/epic-3/organizacao-bancos-atividades.md`.

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
npm run test:engenharia-desejo
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

1. Tasks 3.1 a 3.11 concluídas e testadas;
2. pendência pré-piloto: revisar e aprovar com o professor todas as bases
   pedagógicas, incluindo os
   12 cards da Engenharia do Desejo.

A divisão por semanas internas ao período foi adiada. O primeiro piloto deve
usar uma janela configurada de quinta a quinta e apresentar o total do período.
Depois dos sete dias, os resultados serão encerrados e preservados para análise
antes de definir a organização de ciclos futuros.

### Épico 5 — prioridade atual

- rotas protegidas para `role = TEACHER`;
- gráficos do SQL Connect;
- métricas de alunos e turmas;
- rankings individual e por turma;
- Chat de Dados como último item, adiável se o tempo do MVP ficar curto;
- autorização rigorosa para impedir acesso de aluno a dados coletivos.

### Épico 4 — adiado para pós-MVP ou handoff

- revisar o CapiMentor legado;
- remover dependência de Supabase/JWT legado;
- criar interface flutuante consistente;
- injetar fase, erros frequentes e saldo sem expor dados pessoais;
- proteger a IA com Auth e App Check;
- criar fallback e limites de custo.

O componente existente usa Google AI Studio e Supabase. Se não houver tempo
para migrá-lo, deve ficar desabilitado no piloto, não publicado parcialmente.

### Etapa transversal pós-Épico 5 — padronização visual

Depois da conclusão dos Épicos funcionais, executar uma revisão visual global
sem misturá-la às entregas de banco, IA e autorização. Escopo registrado:

- criar tokens de cor, tipografia, espaçamento, bordas e estados de interação;
- definir uma cor de identidade para cada seção/fase e aplicá-la com
  consistência, reduzindo cores concorrentes dentro da mesma tela;
- usar **A Ilusão do Dinheiro** e **A Engenharia do Desejo** como referências
  atuais de acabamento para as demais atividades;
- padronizar Landing Page, Home do aluno, atividades, ranking, perfil,
  navegação e estados de loading/erro/vazio;
- retirar informações redundantes ou excessivamente técnicas;
- reconstruir a Home de forma mais resumida, destacando próxima ação,
  progresso, saldo/streak e dados úteis das atividades;
- mostrar na Home dificuldades recentes, erros recorrentes e recomendações de
  revisão somente depois que o modelo de dados e as métricas estiverem prontos;
- validar contraste, responsividade, hierarquia visual e acessibilidade;
- evitar redesenhar componentes isoladamente antes de existir um sistema
  visual comum.

Essa etapa deve começar somente depois de Épico 5 e demais fluxos essenciais,
porque Home, ranking e dashboard dependerão das métricas e permissões finais.

A ordem completa, incluindo deploy, teste de 100 alunos e limpeza, está em
`docs/roadmap-mvp.md`.

### Deploy e capacidade

- escolher Firebase Hosting para a SPA ou outra hospedagem aprovada;
- configurar reCAPTCHA Enterprise no App Check;
- definir orçamento, cotas e monitoramento da IA;
- implantar SQL Connect de produção;
- testar aproximadamente 100 alunos durante sete dias;
- incluir cenário conservador de 100 sessões simultâneas;
- medir latência, erro, conexões, cotas, custo e idempotência;
- confirmar que não há perda ou duplicação de CapiCoins.
- executar a limpeza pré-lançamento somente com backup, alvo confirmado e
  autorização explícita; Firebase Auth exige limpeza separada do PostgreSQL.

Checklists: `docs/deploy/checklist-producao.md` e
`docs/deploy/limpeza-pre-lancamento.md`.

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
VITE_USE_FUNCTIONS_EMULATOR=false
VITE_FUNCTIONS_EMULATOR_HOST=127.0.0.1
VITE_FUNCTIONS_EMULATOR_PORT=5001
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

Em outro terminal, iniciar SQL Connect e Functions juntos:

```powershell
cd "C:\Documentos\Programação\Money Rank"
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

Não iniciar somente o SQL Connect para testar atividades: o frontend também
chama as Functions autoritativas na porta 5001. O script recusa o estado
parcial e cria somente configurações locais ignoradas pelo Git. Sem chave do
Gemini, O Perigo Doce usa o fallback científico do servidor.

No Windows, se a política de execução bloquear o processo do emulador:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dataconnect-docker.ps1
```

Esse último comando é apenas uma alternativa de diagnóstico para o processo
do PostgreSQL. Depois dele, as Functions ainda precisam ser iniciadas; para o
fluxo normal, preferir sempre `start-local-emulators.ps1`.

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

Historicamente os arquivos abaixo apareciam como modificados somente por
diferença LF/CRLF:

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

**Exceção da Task 3.9:** a mudança de schema/operações gerou diffs reais no
SDK para `CompetitionPeriod`, `competitionPeriodId`,
`rewardSuppressionReason` e
`minimumRewardedAttemptIntervalSeconds`. Esses arquivos devem entrar no commit
da Task 3.9. Os arquivos gerados sem diff real continuam excluídos.

**Exceção da Task 3.10:** `ActivitySession`, a relação única da tentativa
e as operações administrativas geraram novos diffs reais no SDK. Esses
arquivos entram no commit funcional; `vite.config.js` continua excluído.

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
- ranking do período usa livro-caixa;
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
