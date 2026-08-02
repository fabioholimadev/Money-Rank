# Épico 5 - Dashboard analítico do professor

## Objetivo

Permitir que professores acompanhem alunos e turmas, identifiquem dificuldades
e conversem com uma IA baseada em dados autorizados do Capi Bank.

## Estado

Planejado. O ranking visual ja existe, mas ainda consulta Supabase e não deve
ser considerado migrado.

| Task | Como será feita | Estado |
| --- | --- | --- |
| 5.1 | Criar rotas protegidas para `role = TEACHER` | Planejada |
| 5.2 | Criar métricas e gráficos a partir do SQL Connect | Planejada |
| 5.3 | Implementar Chat de Dados com consultas autorizadas | Planejada |

## Task 5.1 - Acesso do professor

- persistir o papel no Capi Bank;
- validar permissão no servidor, não apenas esconder elementos;
- separar layout de aluno e professor;
- testar acesso anonimo, aluno, professor e sessão expirada.

## Task 5.2 - Metricas e rankings

- migrar ranking individual e por turma do Supabase;
- definir semana no fuso `America/Fortaleza`;
- somar transações competitivas positivas do período;
- mostrar progresso, tentativas, dificuldade e participação;
- evitar comparacoes humilhantes ou exposicao indevida de alunos;
- criar índices e paginacao para apróximadamente 100 alunos.

O limite de pontos/repeticoes ainda será definido com o professor. Não fixar
um teto arbitrario no frontend.

## Task 5.3 - Chat de Dados

1. professor faz uma pergunta sobre uma turma autorizada;
2. servidor transforma a pergunta em uma operacao segura e predefinida;
3. dados sao agregados antes de chegar a IA sempre que possivel;
4. IA responde com período, escopo e limitacoes visiveis;
5. nenhuma SQL ou GraphQL arbitraria gerada pela IA e executada diretamente.

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

## Registro de mudanças

Ao iniciar cada Task, substituir o planejamento pelo resultado real, registrar
arquivos, consultas, testes, decisões de privacidade e hash do commit.
