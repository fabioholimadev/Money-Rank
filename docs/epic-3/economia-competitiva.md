# Economia competitiva do Money Rank

## Objetivo

As atividades podem ser repetidas para sustentar a competição semanal entre
alunos e entre as turmas 3º DSA e 3º DSB. O saldo da carteira e a pontuação
semanal são conceitos separados: o ranking futuro somará os créditos positivos
do livro-caixa dentro da semana, mesmo que o aluno gaste moedas depois.

## Recompensas-base

| Evento | Primeira conclusão | Repetição |
| --- | ---: | ---: |
| Conteúdo da fase | 20 CapiCoins | 0 CapiCoins |
| Atividade aprovada | 100 CapiCoins | 20 CapiCoins |

O limite diário de repetições remuneradas fica nulo nesta versão. Isso
significa "sem limite definido" e permite escolher um teto mais alto depois,
sem alterar os componentes React ou as operações de atividade.

## Multiplicador de streak

| Streak | Multiplicador |
| --- | ---: |
| 1 a 2 dias | 1,00x |
| 3 a 4 dias | 1,10x |
| 5 a 6 dias | 1,20x |
| 7 dias ou mais | 1,30x |

O valor final usa `arredondar(recompensa-base × multiplicador)`. O streak
avança no máximo uma vez por dia e considera a data de
`America/Fortaleza`. Uma nova recompensa no mesmo dia mantém o streak; uma
recompensa no dia seguinte soma um; um intervalo maior reinicia em um.

## Integridade dos dados

Cada execução cria uma tentativa imutável identificada por UUID. O mesmo UUID
não pode creditar moedas duas vezes, mesmo que o navegador reenvie a
requisição. A tentativa, o progresso, o saldo, o streak e o lançamento no
livro-caixa são processados pelo PostgreSQL; o cliente não escolhe o valor da
recompensa.

Cada lançamento guarda a recompensa-base, o multiplicador, o bônus de streak,
a fase, a turma do aluno naquele momento e a segunda-feira de início da semana
competitiva. Esses dados alimentarão os rankings existentes na Task 3.11.
