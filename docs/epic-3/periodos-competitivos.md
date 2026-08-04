# Task 3.9 — Períodos competitivos e repetição segura

## Objetivo

Separar a economia permanente do aluno da janela em que os ganhos contam para
uma competição. CapiCoins, progresso e tentativas continuam funcionando fora
de uma competição; somente a atribuição ao ranking depende do período ativo.

## Decisões aprovadas

- `rewardedRepeatLimitPerDay` permanece `null`: não há teto diário de
  repetições remuneradas;
- a primeira aprovação paga 100 CapiCoins-base e a revisão paga 20;
- o streak continua multiplicando qualquer recompensa válida;
- revisões aprovadas com menos de 30 segundos desde a última recompensa são
  registradas, mas não pagam moedas nem alteram o streak;
- a primeira conclusão nunca é suprimida por esse intervalo;
- o intervalo é uma proteção contra automação, não um limite de
  participação.

O motivo da supressão fica auditável em `ActivityAttempt` como `NONE`,
`RATE_LIMIT` ou `DAILY_LIMIT`. O último valor preserva compatibilidade caso a
escola defina um teto no futuro.

## Ciclo de vida do período

| Estado | Comportamento |
| --- | --- |
| `DRAFT` | Configuração privada; não conta pontos. |
| `SCHEDULED` | Conta automaticamente quando o horário entra na janela. |
| `ACTIVE` | Conta dentro da janela e permite ativação operacional manual. |
| `PAUSED` | Suspende novas atribuições sem apagar o que já foi contabilizado. |
| `CLOSED` | Resultado encerrado e estado imutável. |

As janelas usam timestamps absolutos. A interface deve exibi-los no fuso da
escola, `America/Fortaleza`, enquanto o banco compara o relógio do servidor.
O intervalo é semiaberto: inclui `startsAt` e exclui `endsAt`.

Um novo período não pode sobrepor outro que ainda não esteja encerrado. As
operações de criação, transição de estado e monitoramento usam
`@auth(level: NO_ACCESS)`: o navegador do aluno não pode executá-las. O painel
administrativo será conectado por backend confiável no Épico 5.

## Atribuição no Capi Bank

Cada transação positiva pode guardar `competitionPeriodId`:

- período `SCHEDULED` ou `ACTIVE`, dentro da janela: recebe o ID;
- período em rascunho, pausado, encerrado ou fora da janela: recebe `null`;
- a recompensa ainda é creditada quando o ID é `null`;
- tentativas sem recompensa não criam transação.

Isso permite que a Task 3.11 some apenas lançamentos positivos associados ao
período escolhido, sem confundir carteira com pontuação competitiva.

## Monitoramento e próximos passos

A consulta administrativa `GetCompetitionAbuseSignals` agrupa aprovações por
aluno e hora para destacar rajadas suspeitas. Ela não pune automaticamente o
aluno nem impõe teto; serve para revisão operacional.

- Task 3.10: tornar resultado e pontuação de cada atividade totalmente
  autoritativos no servidor e reforçar concorrência/idempotência;
- Task 3.11: migrar os rankings individual e por turma para consultas por
  `competitionPeriodId`, mostrando inicialmente o total do período;
- Épico 5: criar controles de professor para preparar, ativar, pausar e
  encerrar a competição.

## Validação

```powershell
cd frontend
npm run test:competitive-economy
npm run test:competition-period
npm run lint
npm run build
```

O emulador deve aceitar a migração e regenerar o SDK com
`ListVisibleCompetitionPeriods`, os campos de auditoria e as operações
administrativas.
