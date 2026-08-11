# Arquitetura gratuita: Render + Firebase Spark

> **Decisão vigente do piloto (2026-08-10):** o prompt operacional mais recente
> exige Firebase SQL Connect/PostgreSQL para o piloto. As seções históricas que
> recomendam migrar para Firestore permanecem como análise de custo, mas não
> substituem essa decisão sem nova autorização explícita.

## Decisao de custo

O Money Rank nao pode publicar a arquitetura atual inteira no Firebase sem
Blaze. Cloud Functions e Cloud Storage exigem Blaze. O SQL Connect funciona no
Spark apenas como teste de 90 dias e deixa de responder depois desse prazo.

Para buscar custo recorrente zero, o alvo passa a ser:

| Camada | Alvo gratuito | Observacao |
| --- | --- | --- |
| Frontend React/Vite | Render Static Site | HTTPS/CDN e sem processo servidor |
| Login Google | Firebase Authentication Spark | Limite muito acima dos 100 alunos |
| Banco definitivo | Firestore Standard Spark | Requer migracao do modelo SQL |
| Backend autoritativo | Render Web Service Free | Express + Firebase Admin |
| Arquivos editoriais | Links HTTPS externos | Upload fica desligado sem Storage |
| IA | Opcional com fallback local | Nunca bloquear atividade por falta de cota |

O arquivo `render.yaml` prepara somente o frontend. Ele nao deve ser promovido
como sistema funcional ate a API e o banco Firestore substituirem as callables
e o SQL Connect.

## Por que o SQL Connect foi descartado para producao gratuita

No plano Spark, o SQL Connect oferece no maximo 8.300 operacoes diarias e uma
instancia Cloud SQL de teste por 90 dias. Ao fim do periodo a instancia e
arquivada e, sem upgrade, pode ser apagada depois de mais 90 dias.

Para 100 estudantes, 8.300 operacoes equivalem a apenas 83 operacoes por aluno
por dia antes de reservar trafego para professor, ranking e administracao. A
cota talvez atendesse um piloto leve, mas a expiracao torna essa opcao
inadequada como banco definitivo.

## Por que Cloud Functions e Storage nao entram

- Cloud Functions nao podem ser implantadas no Spark.
- Cloud Storage for Firebase exige Blaze inclusive para o bucket padrao.
- O backend atual depende das Functions para pontuacao, CapiCoins, professor,
  publicacao editorial e chats.
- O upload editorial depende de Storage e nao pode ser salvo no disco do
  Render Free, porque esse disco e efemero.

Consequencia: nao basta trocar apenas o host do frontend. E necessario mover as
callables para HTTP e trocar a persistencia relacional por Firestore.

## Estado remoto auditado em 5 de agosto de 2026

- projeto Firebase ativo: `money-rank`;
- aplicativo Web `Money Rank Web` ativo;
- nenhum servico SQL Connect implantado;
- nenhuma base Firestore criada;
- `southamerica-east1` (Sao Paulo) esta disponivel para Firestore;
- a CLI nao informa o plano de faturamento nem o saldo de creditos;
- nenhum recurso pago ou banco foi criado durante esta auditoria.

Antes de criar o Firestore, confirmar explicitamente:

1. edicao **Standard**;
2. banco `(default)`;
3. regiao `southamerica-east1`;
4. modo inicial fechado, sem acesso direto do navegador;
5. protecao contra exclusao habilitada, se disponivel no Spark.

A localizacao do banco e uma escolha duradoura e nao deve ser criada por
suposicao.

## Capacidade estimada para 100 estudantes

### Firebase Authentication

O Spark suporta ate 3.000 usuarios ativos por dia para login social. Cem alunos
usariam cerca de 3,3% desse limite.

### Firestore Standard

A primeira base gratuita do projeto oferece diariamente:

- 50.000 leituras de documentos;
- 20.000 escritas;
- 20.000 exclusoes;
- 1 GiB armazenado;
- 10 GiB mensais de transferencia de saida.

Para 100 alunos, o teto teorico e 500 leituras e 200 escritas por aluno/dia.
Reservando 20% para professor, ranking e operacao, o orcamento de projeto deve
ser no maximo 400 leituras e 160 escritas por aluno/dia.

O desenho Firestore precisa evitar consultas que leem uma colecao inteira:

- ranking materializado em documentos pequenos por turma e periodo;
- painel do professor alimentado por agregados incrementais;
- perfil e progresso em documentos conhecidos pelo UID;
- transacao unica para tentativa, recompensa e saldo;
- conteudo publicado separado dos rascunhos editoriais;
- paginacao no historico e nenhuma escuta em tempo real desnecessaria.

Mapa inicial para a migracao (ainda sujeito aos testes de seguranca):

| Caminho | Finalidade |
| --- | --- |
| `users_private/{uid}` | perfil completo, papel e dados privados |
| `users_public/{uid}` | nome/avatar minimo usado no ranking |
| `users_private/{uid}/progress/{phase}` | progresso consolidado por fase |
| `activity_sessions/{sessionId}` | payload publico e gabarito protegido |
| `activity_attempts/{sessionId}` | resultado idempotente da sessao |
| `coin_transactions/{transactionId}` | livro-caixa imutavel e auditavel |
| `competition_periods/{periodId}` | janela, status e escopo competitivo |
| `ranking_snapshots/{periodClass}` | ranking materializado por periodo/turma |
| `editorial_versions/{versionId}` | rascunho, revisao e conteudo publicado |
| `research_reviews/{reviewId}` | fontes e aprovacao pedagogica |

Dados privados e dados exibidos no ranking devem ficar em documentos distintos;
as regras do Firestore nao escondem campos individuais dentro de um documento.
No primeiro backend, o navegador nao gravara diretamente: regras `deny all` e
Firebase Admin na API reduzem a superficie durante a migracao. Aberturas
seletivas ao SDK web so devem ocorrer depois de regras e testes dedicados.

Com esse desenho, 100 alunos ativos cabem nas cotas. Isso nao prova que 100
alunos simultaneos terao boa latencia: a API Render Free ainda e o gargalo.

### Render Free

O Static Site e adequado para o frontend. O Web Service gratuito possui 512 MB
de RAM, 0,1 CPU e uma unica instancia, hiberna apos 15 minutos sem trafego e
pode levar aproximadamente um minuto para acordar. Tambem nao possui SLA nem
escalonamento horizontal gratuito.

Para uma aula com 100 acessos simultaneos:

- abrir o sistema com antecedencia aquece a API, mas nao elimina o limite de
  CPU;
- endpoints precisam ser curtos, assincronos e sem processar arquivos;
- chamadas de IA precisam de timeout e fallback deterministico;
- rankings devem vir prontos, sem agregar 100 alunos a cada requisicao;
- um teste de carga real e bloqueante antes do piloto.

Conclusao: o plano gratuito e plausivel para 100 alunos cadastrados e uso
distribuido. Para 100 requisicoes simultaneas, ainda nao ha garantia; o Render
Free deve ser validado e e o componente com maior risco.

## Migracao em blocos

### Bloco 1 - infraestrutura sem publicar

- manter `render.yaml` com apenas o Static Site;
- manter Data Connect e Functions apenas como referencia/testes locais;
- criar contrato HTTP equivalente as callables;
- impedir que o frontend use localhost, SQL Connect ou Functions no build.

### Bloco 2 - Firestore

- criar o banco Standard somente apos confirmar regiao;
- modelar users, progress, sessions, attempts, transactions, periods,
  rankings, editorial versions e research reviews;
- criar indices e regras inicialmente fechadas;
- portar os repositorios com transacoes e testes de idempotencia;
- criar contadores de uso para acompanhar leituras/escritas diarias.

### Bloco 3 - API Render

- substituir `backend/` legado por Express moderno em ESM;
- reutilizar a logica testada de `functions/src`, sem os wrappers `onCall`;
- verificar Firebase ID Token em toda rota autenticada;
- verificar papel TEACHER no banco antes de operacoes administrativas;
- guardar credencial Firebase Admin e chave Gemini somente nos secrets do
  Render;
- limitar CORS ao dominio `onrender.com` definitivo e ao dominio personalizado;
- adicionar health check que nao consulta banco nem IA;
- aplicar limites por usuario e idempotency keys nas tentativas.

O `backend/` atual nao deve ser implantado: ele usa JWT e tabelas do Supabase,
aceita pontuacao enviada pelo cliente em fluxos antigos e nao possui as features
recentes do professor.

### Bloco 4 - frontend

- substituir `httpsCallable` por cliente HTTP com Firebase ID Token;
- substituir SDK SQL Connect por endpoints/leituras Firestore definidos;
- manter fallback local apenas em desenvolvimento, nunca silenciosamente em
  producao;
- configurar `VITE_API_URL` no Render;
- adicionar o dominio Render aos dominios autorizados do Firebase Auth;
- desativar upload e apresentar somente campo de link externo.

### Bloco 5 - carga e publicacao

- executar 100 logins e 100 inicios/submissoes concorrentes;
- medir p50, p95, erros, cold start, memoria e uso Firestore;
- reprovar se houver moedas duplicadas, tentativas perdidas ou estouro de cota;
- publicar primeiro para equipe/professor e depois para os alunos.

## Credito de USD 300 do Google Cloud

O credito de boas-vindas e destinado a novos clientes elegiveis, vale por 90
dias e nao e uma camada gratuita permanente. Vincular uma conta de faturamento
ao projeto Firebase transforma o projeto Spark em Blaze.

Portanto, o credito nao faz parte desta arquitetura sem Blaze. Ele pode servir
para um teste temporario futuro, mas cria uma data de expiracao e exige um plano
de desligamento ou pagamento.

Para verificar manualmente se existe credito ativo:

1. abrir Google Cloud Console com a mesma conta do Firebase;
2. acessar **Billing > Overview** e identificar a conta ligada ao projeto;
3. abrir **Billing > Credits** e conferir saldo, validade e produtos cobertos;
4. no Firebase, abrir **Usage and billing > Details & settings** e confirmar se
   o projeto mostra Spark ou Blaze.

Se `money-rank` estiver em Spark, ele nao esta consumindo o credito geral de USD
300 nesse projeto. Se aparecer Blaze, existe uma conta de faturamento vinculada,
mas ainda e necessario abrir a pagina de creditos para saber se ha saldo.

Nao ativar teste, Blaze ou cartao apenas para inspecionar elegibilidade.

## Criterio de custo zero

O sistema e considerado gratuito somente enquanto:

- Firebase permanecer Spark;
- Firestore ficar abaixo das cotas e for a unica base gratuita do projeto;
- Auth ficar abaixo dos limites diarios;
- Render nao tiver metodo de cobranca automatica para excedentes ou possuir
  limite de gasto zero;
- arquivos forem hospedados externamente por links;
- IA usar cota gratuita opcional e sempre possuir fallback;
- nenhum servico temporario for confundido com solucao permanente.

Ao atingir uma cota Spark, o servico correspondente pode parar ate o proximo
ciclo. Monitoramento e reducao de consumo sao requisitos funcionais, nao apenas
financeiros.
