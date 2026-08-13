# Períodos, modo de teste e diagnósticos

## Decisão de acesso às atividades

O servidor decide o acesso; a interface apenas apresenta o resultado.

1. As atividades normais podem ser iniciadas e concluídas independentemente do estado ou da janela de um período competitivo.
2. Quando existe um período ativo, seu identificador é associado à atividade apenas para atribuição e análise competitiva; fora da janela, a atividade continua disponível sem essa associação.
3. O `TestRun` não libera nem bloqueia a trilha do aluno. Ele cria uma execução isolada para o professor testar as atividades sem alterar progresso, moedas ou ranking oficiais.
4. Uma sessão de teste só pode ser usada pelo mesmo professor que criou a concessão, dentro do prazo do servidor e com o mesmo `test_run_id`; qualquer outro caso é bloqueado com um motivo explícito.

As datas são gravadas como `timestamptz` e a exibição operacional usa `America/Fortaleza`. O início é inclusivo e o fim é exclusivo. O campo legado `schedule` não substitui a janela editada pelo professor.

## Isolamento do modo de teste

- A ativação padrão dura 60 minutos; o intervalo aceito é de 5 a 120 minutos.
- Um índice único em `active_slot` garante no máximo uma execução ativa.
- Sessões e tentativas recebem `is_test = true` e `test_run_id`.
- Tentativas de teste não atualizam `student_progress`, `users.capi_coins` nem `capi_coin_transactions`.
- Ranking, dashboard, exportação e sinais de anomalia filtram `is_test = false`.
- Encerrar revoga o acesso. Limpar apaga apenas sessões e tentativas do `test_run_id` encerrado; a trilha de auditoria é preservada.
- A política atual é `TEACHER_OWNER_ONLY`: somente o professor criador usa a concessão.

## Diagnóstico administrativo

O painel do professor expõe somente metadados operacionais sanitizados:

- disponibilidade do SQL Connect, contagem do banco pedagógico e última falha do processo;
- hora do servidor, fuso, período reconhecido e motivo do estado;
- reconhecimento da chave Gemini, modelo, última chamada, latência, uso comprovado da Pesquisa Google, quantidade de fontes e request ID;
- commit do frontend e da API Render e URL da API usada pelo frontend.

O botão de prova do Gemini executa a pergunta sintética `O que é IPI?`. Uma resposta só é aceita quando a Interactions API registra `google_search_call` e ao menos uma citação HTTPS segura. Falhas devolvem HTTP 503 e código de diagnóstico, sem resposta genérica fingindo sucesso.

## Verificação local

```powershell
cd functions
npm test
npm run lint

cd ..\backend\render-api
npm test

cd ..\..\frontend
npm run lint
npm run build

cd ..
npx -y firebase-tools@latest dataconnect:compile --project money-rank
npx -y firebase-tools@latest dataconnect:sql:diff --project money-rank
```
