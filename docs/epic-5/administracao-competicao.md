# Task 5.5 — Administração da competição

## Resultado implementado

Implementação funcional registrada no commit `7440824`.

O professor autorizado agora administra o ciclo competitivo diretamente no
painel, sem depender do utilitário local e sem apagar o livro-caixa:

- cria um período como rascunho;
- altera nome, início e fim para reduzir ou ampliar uma janela válida;
- agenda, ativa, pausa, retoma e encerra;
- consulta períodos encerrados no seletor histórico;
- confirma explicitamente o encerramento definitivo.

`CLOSED` é imutável. Pausa e encerramento preservam tentativas, transações e
resultados. Um ciclo novo inicia outro recorte de ranking; ele não zera moedas
nem remove transações anteriores.

## Segurança e concorrência

As três callables exigem Firebase Auth, App Check fora do emulador e perfil
`TEACHER` completo. As operações `NO_ACCESS` repetem a verificação do professor
no Capi Bank. Edições recusam datas inválidas, sobreposição com outro período
aberto e alteração de um período encerrado.

Um campo interno anulável e único, `activeSlot`, protege a regra de no máximo
um período `ACTIVE`, inclusive sob chamadas concorrentes. A mutação também
consulta períodos ativos para cobrir dados locais anteriores a esse campo.

## Exportação e Chat de Dados

O painel exporta um CSV UTF-8 compatível com Excel, com seções de resumo,
turmas, fases e alunos. O arquivo usa o fuso `America/Fortaleza`, neutraliza
fórmulas iniciadas por `=`, `+`, `-` ou `@` e não inclui UID, e-mail, nome
completo, foto ou chaves internas. Nome preferido e turma são os únicos
identificadores dos alunos exportados.

O Capi Analista passou a abrir por um botão flutuante, como o CapiMentor. No
celular ele usa uma folha inferior; no desktop, um painel ancorado. Escape,
retorno de foco, rolagem automática e regiões ARIA foram preservados.

## Arquivos principais

- `dataconnect/schema/schema.gql`;
- `dataconnect/connector/mutations.gql`;
- `functions/src/competitionPeriod.js`;
- `functions/src/competitionPeriodRepository.js`;
- `functions/src/index.js`;
- `frontend/src/components/CompetitionPeriodManager.jsx`;
- `frontend/src/components/TeacherDataChat.jsx`;
- `frontend/src/services/teacherCompetitionService.js`;
- `frontend/src/lib/teacherSpreadsheetExport.js`;
- `frontend/src/pages/TeacherDashboard.jsx`.

## Validação automática

- compilação do Data Connect aprovada;
- 46 testes das Functions aprovados;
- lint das Functions e do frontend aprovado;
- build Vite aprovado;
- testes de período, painel, papel e exportação aprovados.

O build ainda alerta que o chunk principal ultrapassa 500 kB. A divisão de
código permanece para a preparação de deploy/redesign.

## Roteiro manual

1. Abra `/professor` com uma conta `TEACHER` completa.
2. Em **Gerenciar períodos**, crie um rascunho futuro que não sobreponha a
   janela atual.
3. Altere o nome e amplie o fim; feche e reabra o gerenciador para confirmar.
4. Agende o rascunho. Tente ativá-lo fora da janela ou enquanto outro período
   estiver ativo e confirme a recusa.
5. No período vigente, pause e confirme que novas recompensas deixam de entrar
   no ranking. Retome e confirme o funcionamento.
6. Use **Exportar planilha** e abra o CSV no Excel/LibreOffice. Confira resumo,
   turmas, fases e alunos, sem e-mail ou UID.
7. Abra e feche o Capi Analista no computador e no celular; teste uma sugestão,
   Enter, Shift+Enter e Escape.
8. Encerre apenas um período descartável de teste, usando a confirmação forte,
   e confirme que ele continua consultável e não pode ser retomado.

Não use o período oficial do piloto para o teste de encerramento.
