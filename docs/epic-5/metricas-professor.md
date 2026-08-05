# Task 5.2 - Métricas e gráficos do professor

## Objetivo

Transformar dados autorizados do Capi Bank em uma visão pedagógica das turmas
3º DSA e 3º DSB. O painel ajuda o professor a observar participação,
progresso e dificuldades sem depender do saldo exibido pelo frontend ou de
consultas ao Supabase legado.

## Escopo implementado

- seletor dos 20 períodos mais recentes, incluindo encerrados;
- resumo com alunos, participação, pontos, tentativas, nota média e conclusão;
- comparação DSA/DSB com participação e progresso;
- diagnóstico das quatro atividades por dificuldade e aprovação;
- tabela de até 100 alunos com filtro de turma e busca local por nome;
- saldo, pontos competitivos, progresso, tentativas, média e erros;
- atualização manual sempre consultando o servidor.

## Definição das métricas

| Métrica | Regra |
| --- | --- |
| Alunos cadastrados | Perfis `STUDENT` completos de 3º DSA ou 3º DSB |
| Participante | Aluno com tentativa ou crédito competitivo válido no período |
| Pontos competitivos | Soma somente transações positivas vinculadas ao `periodId` |
| Tentativas | `ActivityAttempt.createdAt` dentro do início e fim do período |
| Aprovação | Tentativas aprovadas divididas por todas as tentativas do período |
| Nota média | Média das notas das tentativas do período |
| Dificuldade | Respostas erradas divididas por corretas + erradas no período |
| Progresso geral | Etapas 0 a 4 concluídas, independentemente do período |
| Trilha concluída | Aluno com a Fase 4 marcada como `COMPLETED` |
| Saldo | Carteira atual do aluno; não é usado como pontuação do ranking |

Tentativas e pontos são históricos do período. Progresso e saldo são o
estado geral atual. Essa diferença aparece nos textos do painel para impedir
interpretação incorreta.

## Autorização e privacidade

`ListTeacherCompetitionPeriods` e cada uma das quatro agregações de
`GetTeacherDashboard` repetem uma CTE `authorized_teacher`. Ela exige:

1. token Google com e-mail verificado;
2. `auth.uid` correspondente ao perfil consultante;
3. papel `TEACHER` persistido no Capi Bank;
4. perfil completo.

A interface não recebe UID nem e-mail dos alunos. O nome preferido é exibido
porque o acompanhamento individual é uma necessidade pedagógica, mas somente
depois da verificação do professor no servidor. Nenhuma variável de cliente
informa qual usuário ou papel deve ser autorizado.

## Desempenho e capacidade

- consultas limitam a lista a 100 alunos, capacidade prevista para o piloto;
- seletor limita a 20 períodos;
- novo índice em `activity_attempts(created_at DESC, user_uid)` atende filtros
  por janela temporal;
- o livro-caixa já possui índice por período e aluno;
- cálculos são executados no PostgreSQL e o navegador recebe apenas agregados;
- o frontend valida todos os campos `Any` produzidos pelo SQL nativo.

O teste de aproximadamente 100 alunos simultâneos continua reservado para a
etapa de capacidade depois do deploy de homologação.

## Arquivos principais

- `dataconnect/connector/queries.gql`;
- `dataconnect/schema/schema.gql`;
- `frontend/src/lib/teacherAnalyticsMapper.js`;
- `frontend/src/services/teacherAnalyticsService.js`;
- `frontend/src/pages/TeacherDashboard.jsx`;
- `scripts/test-teacher-analytics.mjs`.

## Roteiro de teste manual

1. Inicie Capi Bank e Functions juntos:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
   ```

2. Em outro terminal:

   ```powershell
   cd frontend
   npm run dev
   ```

3. Entre com a conta `TEACHER` validada na Task 5.1.
4. Abra `/professor` e selecione o período desejado.
5. Confirme que nenhum texto técnico como SQL Connect, PostgreSQL ou SDK
   aparece na interface.
6. Confira os seis indicadores do resumo.
7. Compare DSA e DSB; uma turma sem dados deve mostrar zero, não erro.
8. Confira as quatro fases e a barra de dificuldade.
9. Busque um aluno pelo nome e alterne entre DSA, DSB e todas as turmas.
10. Pressione `Atualizar` e confirme que o painel continua no período escolhido.
11. Verifique a tabela em largura de celular usando rolagem horizontal.
12. Saia, entre como estudante e confirme que `/professor` permanece bloqueado.

## Testes automatizados

```powershell
cd frontend
npm run test:teacher-analytics
npm run test:role-access
npm run test:rankings
npm run lint
npm run build

cd ..\functions
npm test
npm run lint

cd ..
npx -y firebase-tools@latest dataconnect:compile --project money-rank
```

## Limitações conscientes

1. O painel não possui atualização em tempo real; o professor usa `Atualizar`.
2. A Task 5.5 acrescentou exportação CSV UTF-8 compatível com Excel, limitada
   aos dados já autorizados no painel e sem UID ou e-mail.
3. Ainda não existe detalhamento das respostas por questão, pois as
   tentativas atuais guardam totais de acertos e erros por atividade.
4. O Chat de Dados pertence à Task 5.3 e consumirá somente agregações
   autorizadas, nunca SQL produzida livremente pela IA.
