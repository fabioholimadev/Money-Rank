# Épico 3 - Trilha, conteúdos e motor de atividades

## Objetivo

Construir uma trilha progressiva de educacao financeira com conteúdo revisado,
atividades repetiveis, recompensa competitiva e uso controlado de IA.

## Estado das Tasks

| Task | Resultado/planejamento | Estado | Commit |
| --- | --- | --- | --- |
| 3.1 | Categorias expansíveis em acordeao | Concluída | `795b6b7` |
| 3.2 | Passo 0, sidebar, bloqueios e progresso persistente | Concluída | `79cb9d0` |
| 3.3 | Modelo de video, slides e resumo | Concluída | `b29f130` |
| 3.4 | Repeticoes, livro-caixa e streak competitivo | Concluída | `ae1f74a` |
| 3.5 | O Perigo Doce com IA e fallback local | Concluída | `8ba9a35` |
| 3.6 | O Custo do Vicio com personagens | Concluída | `8b77215` |
| 3.7 | A Ilusão do Dinheiro com caminhos de decisão | Concluída | `5c8e1ce` |
| 3.8 | A Engenharia do Desejo com banco publicitário auditável | Concluída | `8e76b9e` |
| 3.9 | Períodos competitivos, repetição ilimitada e proteção anti-automação | Em validação | Pendente |
| 3.10 | Pontuação autoritativa e concorrência segura das atividades | Planejada | — |
| 3.11 | Rankings individual e por turma vinculados ao período | Planejada | — |

## Estrutura visual e progressão

- categorias da trilha abrem e fecham sem ocupar todo o painel;
- conteúdo e atividade possuem entradas separadas;
- a sidebar facilita a navegacao sem liberar fases futuras;
- fase inicial do aluno: `0`;
- Passo 0 apresenta introducao, sem quiz;
- o conteúdo da fase atual deve ser concluído antes da atividade;
- a próxima fase so abre depois da aprovação;
- toda checagem importante tambem e aplicada no Capi Bank.

O antigo requisito do Kiro definia desbloqueio linear sobre Supabase e fase
inicial 1. Ele foi preservado conceitualmente, mas substituido pelo modelo
atual: fase 0, Firebase Auth e SQL Connect, com protecao contra recompensa ou
avanco duplicado.

## Modelo de conteúdo

Cada fase reserva espaco para:

1. um video principal;
2. slides da aula;
3. resumo ou documento complementar.

O professor revisa e aprova as fontes. O modelo editorial completo esta em
[`modelo-materiais-professor.md`](modelo-materiais-professor.md).

## Economia competitiva

- primeiro consumo de conteúdo: 20 CapiCoins;
- revisão de conteúdo: 0;
- primeira aprovação de atividade: 100 CapiCoins-base;
- repeticao aprovada: 20 CapiCoins-base;
- streak multiplica recompensas segundo configuração do servidor;
- o cliente não determina recompensa;
- tentativas e transações sao auditaveis;
- ranking semanal deve somar ganhos validos, não o saldo restante.

Detalhes: [`economia-competitiva.md`](economia-competitiva.md).

A Task 3.9 adiciona períodos controláveis (`DRAFT`, `SCHEDULED`, `ACTIVE`,
`PAUSED`, `CLOSED`) sem interromper a economia fora da competição. O limite
diário permanece nulo; somente revisões automatizadas em intervalo inferior a
30 segundos deixam de pagar recompensa. Detalhes:
[`periodos-competitivos.md`](periodos-competitivos.md).

## Atividades

### Fase 1 - O Perigo Doce

Quiz de cinco questões, quatro alternativas e aprovação com tres acertos. O
Gemini recebe base auditavel e devolve JSON estruturado. Em indisponibilidade,
o fallback local mantem a atividade funcional.

Detalhes: [`perigo-doce-ia.md`](perigo-doce-ia.md).

### Fase 2 - O Custo do Vicio

Rafael, Beatriz e Diego aparecem em uma coluna, com histórias expansíveis.
Cada estudo analisa cinco decisões. Não ha alternativa simplesmente errada:
as opções recebem de um a tres pontos de analise e mudam de ordem.

Detalhes: [`custo-vicio-estudo-caso.md`](custo-vicio-estudo-caso.md).

### Fase 3 - A Ilusão do Dinheiro

Alex toma seis decisões ramificadas. A história separa créditos simulados das
CapiCoins reais. A implementação e o roteiro manual foram validados e
registrados em `5c8e1ce`.

Detalhes e roteiro: [`ilusao-dinheiro-caminhos.md`](ilusao-dinheiro-caminhos.md).

### Fase 4 - A Engenharia do Desejo

Implementação da Task 3.8 validada localmente:

O banco possui seis casos documentados e seis peças autorais. Cada rodada
sorteia três de cada tipo, embaralha cards e botões e exige quatro acertos em
seis análises. O gabarito é determinístico; IA auxilia a pesquisa editorial,
mas não decide a resposta durante o jogo.

Detalhes, fontes e roteiro: [`engenharia-desejo-fato-fake.md`](engenharia-desejo-fato-fake.md).

1. montar um banco de publicidades verdadeiras com fonte, data, local e prova;
2. criar peças falsas claramente marcadas na base interna;
3. embaralhar exemplos e pedir ao aluno para identificar fato ou fake;
4. revelar fonte apenas depois da resposta;
5. usar IA para pesquisa assistida e organização, nunca como prova de verdade;
6. exigir validação do professor antes de publicar a base;
7. registrar tentativa, aprovação, repeticao, streak e recompensa no Capi Bank.

## Regra de pesquisa e IA

Codex/Gemini podem levantar fontes e preparar o banco inicial. Toda afirmação
pedagogica, publicidade real e material externo precisa de fonte verificavel e
aprovação do professor. A IA não deve inventar citação nem receber dados
pessoais desnecessários do aluno.

## Testes obrigatórios

```powershell
cd frontend
npm run test:competitive-economy
npm run test:competition-period
npm run test:content-materials
npm run test:custo-vicio
npm run test:engenharia-desejo
npm run test:ilusao-dinheiro
npm run test:perigo-doce-ai
npm run test:trail-progress
npm run lint
npm run build
```

Cada atividade tambem exige teste manual de reprovação, aprovação, repeticao,
bloqueio da fase seguinte e alteracao correta das moedas.

## Registro de mudanças

Atualizar a tabela de Tasks e o documento detalhado da atividade antes de cada
commit. Mudancas em conteúdo, pontuação, streak, desbloqueio ou prompts tambem
devem atualizar o contexto geral.
