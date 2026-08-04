# Épico 5 - Dashboard analítico do professor

## Objetivo

Permitir que professores acompanhem alunos e turmas, identifiquem dificuldades
e conversem com uma IA baseada em dados autorizados do Capi Bank.

## Estado

Épico prioritário atual. O ranking do aluno já consulta o Capi Bank; este
Épico acrescentará autorização do professor, seleção administrativa de
períodos e análises pedagógicas.

| Task | Como será feita | Estado |
| --- | --- | --- |
| 5.1 | Criar rotas protegidas para `role = TEACHER` | Concluída (`99d8108`) |
| 5.2 | Criar métricas e gráficos a partir do SQL Connect | Concluída (`406f387`) |
| 5.3 | Implementar Chat de Dados com consultas autorizadas | Concluída (`3882996`) |
| 5.4 | Administrar períodos e encerramento auditado | Planejada para depois da 5.3 |

O caminho mínimo do MVP prioriza 5.1 e 5.2. Caso o tempo fique curto, o Chat
de Dados pode ser adiado sem impedir o piloto, desde que o professor tenha as
métricas e os rankings essenciais.

## Task 5.1 - Acesso do professor

- papel lido do perfil autenticado no Capi Bank;
- rotas de aluno e professor isoladas por `ProtectedRoute`;
- dashboard inicial do professor sem métricas fictícias;
- promoção local por operação `NO_ACCESS` e script restrito ao emulador;
- acesso anônimo validado manualmente e regras de aluno/professor cobertas
  pelo teste automatizado; o roteiro de promoção permanece disponível para
  testar uma conta real.

Detalhes e roteiro: [`acesso-professor.md`](acesso-professor.md).

## Task 5.2 - Metricas e rankings

- seletor de até 20 períodos no fuso `America/Fortaleza`;
- pontos derivados de transações positivas vinculadas ao período;
- tentativas, notas, erros e participação filtrados pela janela escolhida;
- progresso geral claramente separado das métricas do período;
- comparação entre DSA e DSB e diagnóstico das quatro fases;
- lista limitada a 100 alunos sem retorno de UID ou e-mail;
- autorização `TEACHER` repetida em cada agregação no servidor;
- novo índice temporal para tentativas.

Detalhes e roteiro: [`metricas-professor.md`](metricas-professor.md).

O limite de pontos/repeticoes ainda será definido com o professor. Não fixar
um teto arbitrario no frontend.

## Task 5.3 - Chat de Dados

1. professor faz uma pergunta sobre uma turma autorizada;
2. servidor transforma a pergunta em uma operacao segura e predefinida;
3. dados sao agregados antes de chegar a IA sempre que possivel;
4. IA responde com período, escopo e limitacoes visiveis;
5. nenhuma SQL ou GraphQL arbitraria gerada pela IA e executada diretamente.

A implementação usa a consulta agregada da Task 5.2 com impersonação do
professor, cinco intenções fechadas, cálculo factual determinístico e Gemini
limitado a uma recomendação pedagógica sem números. Detalhes e roteiro:
[`chat-dados-professor.md`](chat-dados-professor.md).

## Task 5.4 - Administração da competição

Planejada, mas não iniciada. Permitirá criar, agendar, pausar, retomar e
encerrar períodos. Novo ciclo, ajuste de saldo, limpeza pré-piloto e exclusão
definitiva serão ações distintas. Qualquer limpeza exigirá backup, confirmação
forte, autorização no servidor e registro de auditoria.

## Testes previstos

- autorização por papel e turma;
- filtros de data, turma e fase;
- consistencia entre gráficos, ranking e livro-caixa;
- consultas vazias, grandes e paginadas;
- isolamento entre turmas;
- perguntas ambíguas ou maliciosas no Chat de Dados;
- carga de apróximadamente 100 alunos durante sete dias.

## Critério de conclusao

Rotas, dados e IA devem aplicar autorização no servidor; rankings devem vir do
Capi Bank; e as métricas devem ser validadas pelo professor.

## Etapa posterior — revisão visual do produto

Após concluir o dashboard e os demais fluxos funcionais, executar uma Task
transversal de design system e padronização. Ela deve abranger Landing Page,
Home, trilhas, atividades, ranking, perfil e dashboard. A Home será reduzida e
passará a priorizar progresso, próxima atividade, dificuldades e erros recentes
calculados pelos dados consolidados deste Épico.

As atividades **A Ilusão do Dinheiro** e **A Engenharia do Desejo** são as
referências atuais de acabamento. As cores próprias de cada fase podem ser
preservadas, mas precisam obedecer a uma paleta, hierarquia e componentes
compartilhados.

Essa revisão não deve começar antes das métricas e permissões estarem estáveis,
para evitar redesenhar a Home e o ranking mais de uma vez.

## Registro de mudanças

Ao iniciar cada Task, substituir o planejamento pelo resultado real, registrar
arquivos, consultas, testes, decisões de privacidade e hash do commit.
