# Task 3.11 — Rankings no Capi Bank

## Objetivo

Substituir a leitura do ranking pelo Supabase por uma agregação auditável do
Firebase SQL Connect. O primeiro piloto mostra somente o total geral do período
competitivo selecionado, sem subdivisão por semanas.

## Regra de pontuação

O ranking não usa `users.capi_coins`, porque esse campo representa a carteira
atual e pode diminuir quando o aluno gastar moedas. A pontuação competitiva é:

```text
SUM(capi_coin_transactions.amount)
WHERE competition_period_id = período atual
  AND amount > 0
```

Assim:

- cada ganho válido conta para o aluno e para sua turma;
- compras não diminuem pontos já conquistados;
- recompensas suprimidas não geram transação positiva e não pontuam;
- transações fora da janela não entram no período;
- o total da turma é a soma dos seus estudantes, sem teto definido nesta Task.

## Consulta e desempenho

`GetCompetitionRankings` devolve duas agregações:

1. ranking individual, limitado a 100 estudantes;
2. ranking das turmas `3º DSA` e `3º DSB`.

A consulta usa SQL nativo porque precisa de `SUM`, `FILTER` e
`DENSE_RANK()`. Empates recebem a mesma posição. O schema possui índice
composto em `(competition_period_id, user_uid)` para reduzir o custo da
agregação.

## Segurança e privacidade

- exige Firebase Auth com e-mail verificado;
- uma CTE confirma que o UID autenticado possui perfil completo;
- aceita somente período `SCHEDULED`, `ACTIVE` ou `PAUSED` ainda não encerrado;
- considera somente perfis `STUDENT` completos das duas turmas permitidas;
- não devolve UID nem e-mail;
- nomes, turma e avatar aparecem porque constituem a experiência coletiva
  explicitamente proposta pelo produto;
- linhas nativas do tipo `Any` passam por validação antes de chegar à UI.

## Interface

A tela mantém abas para alunos e turmas e agora apresenta:

- nome e intervalo do período no fuso `America/Fortaleza`;
- estado agendado, ativo ou pausado;
- pontos gerais do período, separados do saldo da carteira;
- participantes e estudantes registrados por turma;
- empates coerentes com a posição calculada pelo banco;
- estados de loading, erro, período ausente e pontuação vazia;
- avatares profissionais e fotos HTTPS validadas.

Nenhum texto de Supabase, PostgreSQL ou SQL Connect aparece para o aluno.

## Teste local

Com o Data Connect Emulator ativo, criar uma janela de homologação:

```powershell
cd "C:\Documentos\Programação\Money Rank\functions"
$env:DATA_CONNECT_EMULATOR_HOST="127.0.0.1:9399"
npm run local:competition -- create
```

O utilitário recusa qualquer host que não seja o emulador local. Para
encerrar a janela de teste:

```powershell
npm run local:competition -- close
```

Durante a janela:

1. abrir `/ranking` e conferir as duas abas;
2. concluir uma atividade aprovada;
3. atualizar o ranking e conferir o aumento individual e da turma;
4. confirmar que o saldo da carteira e os pontos podem ter conceitos
   diferentes;
5. repetir uma atividade depois do intervalo de 30 segundos e conferir a
   recompensa reduzida;
6. alternar entre alunos e turmas em tela pequena;
7. encerrar o período e confirmar o estado sem competição atual.

## Testes automatizados

```powershell
cd frontend
npm run test:rankings
npm run lint
npm run build

cd ..
npx -y firebase-tools@latest dataconnect:compile
npx -y firebase-tools@latest dataconnect:sdk:generate
```

Em 2026-08-04, o emulador aplicou o novo índice e executou uma agregação
autenticada com dois perfis e duas turmas, sem expor identificadores. A janela
temporária foi encerrada depois do teste.

## Pendências posteriores

- o dashboard do Épico 5 permitirá ao professor selecionar períodos
  encerrados e analisar métricas adicionais;
- a divisão interna por semanas foi adiada até a avaliação do primeiro piloto;
- a administração visual de criar, pausar e encerrar períodos pertence ao
  Épico 5;
- revisão visual ampla continua no pós-MVP.

