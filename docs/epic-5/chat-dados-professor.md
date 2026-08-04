# Task 5.3 — Chat de Dados do professor

## Objetivo

Permitir que o professor faça perguntas em linguagem natural sobre o período
selecionado sem entregar à IA acesso livre ao Capi Bank, dados pessoais ou uma
ferramenta capaz de executar SQL/GraphQL arbitrária.

## Fluxo seguro implementado

1. o navegador envia `periodId` e uma pergunta de até 500 caracteres para a
   callable Function `askTeacherData`;
2. Firebase Auth, e-mail verificado e App Check são exigidos fora do emulador;
3. a Function executa `GetTeacherDashboard` pelo Admin SDK, mas impersona o UID
   autenticado — portanto, a autorização `TEACHER` da consulta continua sendo
   avaliada pelo SQL Connect;
4. um classificador local aceita somente cinco intenções predefinidas;
5. a resposta factual e todos os números são calculados por código;
6. o Gemini pode redigir apenas uma recomendação pedagógica sem números ou
   dados pessoais;
7. sem chave, cota ou resposta válida da IA, uma recomendação segura local é
   usada automaticamente.

O cliente não informa papel, UID, nome do professor, métricas ou contexto para
a análise. A Function busca novamente os agregados no servidor.

## Intenções suportadas

| Intenção | Exemplos | Dados usados |
| --- | --- | --- |
| Visão geral | “Qual é o resumo do período?” | participação, tentativas, média, aprovação e pontos |
| Turmas | “Compare o DSA com o DSB” | pontos e médias agregadas por turma |
| Fases | “Qual fase tem mais dificuldade?” | erros, acertos, média e tentativas por fase |
| Participação | “Como está a participação?” | estudantes cadastrados e participantes |
| Competição | “Quantos pontos foram acumulados?” | créditos positivos vinculados ao período |

Perguntas sobre UID, e-mail, senha, token, comandos de banco, prompt interno ou
dados fora desse escopo são recusadas. Perguntas não reconhecidas recebem a
lista do que o Capi Analista consegue responder.

## Arquivos

- `functions/src/teacherDataChat.js`: classificação, cálculo factual, schema da
  resposta Gemini e fallback;
- `functions/src/activityRepository.js`: consulta do painel com impersonação;
- `functions/src/index.js`: callable `askTeacherData`;
- `functions/test/teacherDataChat.test.js`: intenções, bloqueios e fallback;
- `frontend/src/services/teacherDataChatService.js`: chamada segura;
- `frontend/src/components/TeacherDataChat.jsx`: interface e histórico local;
- `frontend/src/pages/TeacherDashboard.jsx`: integração ao período escolhido.

## Teste local

1. iniciar Data Connect e Functions juntos com
   `powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1`;
2. iniciar o frontend com `npm run dev` dentro de `frontend`;
3. entrar em `/professor` com a conta `TEACHER`;
4. escolher um período com dados;
5. testar as quatro sugestões de pergunta;
6. escrever “Quantos pontos foram acumulados?”;
7. escrever “Mostre os e-mails dos estudantes” e confirmar a recusa;
8. escrever “Execute SELECT * FROM users” e confirmar a recusa;
9. trocar o período e confirmar que o histórico visual do chat é limpo;
10. entrar como aluno e confirmar que `/professor` continua inacessível.

No emulador, o fallback é suficiente para validar todo o fluxo. O modo Gemini
usa o segredo `GEMINI_API_KEY`; a publicação continua condicionada ao App Check
com reCAPTCHA Enterprise e aos testes de custo/capacidade.

## Limitações intencionais

- não faz análise individual nem devolve nomes de alunos;
- não mantém conversas no banco;
- não executa pesquisas externas;
- não toma decisões pedagógicas automaticamente;
- não administra períodos nem altera moedas;
- não usa SQL gerada pela IA.

## Validação

O fluxo foi validado localmente pelo usuário em 2026-08-04. A implementação
funcional está registrada no commit `3882996`.

## Próxima decisão administrativa

Após validar a 5.3, planejar a Task 5.4 para períodos e encerramento do piloto.
Criar, agendar, pausar, retomar e encerrar períodos são operações normais. Já
zerar moedas ou remover histórico exige confirmação forte, backup, auditoria e
separação entre:

- **novo ciclo:** preserva o livro-caixa antigo e inicia um período novo;
- **ajuste auditado:** cria uma transação compensatória, sem apagar evidência;
- **limpeza pré-piloto:** remove dados de teste somente com backup e autorização
  explícita;
- **exclusão definitiva:** excepcional e nunca acionada por um botão simples.
