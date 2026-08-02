# Task 3.7 — A Ilusão do Dinheiro

## Objetivo

**A Ilusão do Dinheiro** substitui a pergunta estática da Fase 3 por uma
história ramificada com seis decisões. Cada escolha altera um caixa simulado,
produz uma consequência imediata e contribui para um dos quatro finais.

O aluno acompanha Alex, que possui 600 créditos simulados e deseja preservar
420 para a inscrição e os materiais de uma feira técnica.

## Decisões da jornada

1. oferta relâmpago e urgência artificial;
2. pressão do grupo e limite para lazer;
3. parcela pequena versus custo total;
4. teste gratuito com renovação automática;
5. despesa essencial imprevista;
6. venda adicional no momento de pagar a meta.

Cada decisão possui três caminhos de `0`, `1` ou `2` pontos de análise. A
ordem A/B/C é embaralhada em cada tentativa e não revela a pontuação interna.

## Saldo narrativo e carteira competitiva

Existem duas carteiras com finalidades diferentes:

- **caixa da história:** começa com 600 créditos, muda em cada escolha e pode
  terminar entre `-105` e `505`; não é persistido como dinheiro do aluno;
- **carteira real de CapiCoins:** pertence à economia competitiva e só é
  alterada pelo Capi Bank depois da validação do resultado.

Essa separação impede que valores fictícios da narrativa sejam usados para
inflar rankings.

## Nota, aprovação e finais

A nota é calculada por:

```text
nota = arredondar(pontos de análise / 12 × 100)
```

O aluno precisa de pelo menos `60` pontos para concluir a Fase 3.

| Final | Condição principal |
| --- | --- |
| Meta protegida | nota aprovada e saldo simulado suficiente para os 420 créditos |
| Plano de recuperação | nota aprovada, mas saldo abaixo da meta |
| Meta adiada | nota abaixo de 60 e saldo não negativo |
| Futuro comprometido | saldo simulado negativo |

Uma tentativa abaixo de 60 é registrada sem moedas e sem liberar a Fase 4.
Uma tentativa aprovada segue a economia geral:

- 100 CapiCoins-base na primeira conclusão;
- 20 CapiCoins-base em revisões remuneradas;
- multiplicador de streak aplicado pelo servidor;
- limite diário de repetições conforme a configuração da economia.

## Pesquisa e validação do professor

O banco em `frontend/src/data/ilusaoDinheiroPaths.js` foi organizado a partir
de fontes institucionais:

- Banco Central do Brasil e Ministério da Justiça: vídeo **Eu vou levar**;
- Banco Central do Brasil: relatório de letramento financeiro;
- Banco Central do Brasil: Caderno de Educação Financeira;
- SUSEP: planejamento, influência social, parcelas e custo total;
- CAIXA: pausa, comparação e consumo consciente.

Cada fato registra URL, data de acesso, objetivo de ensino e os status
`source_verified` e `pending_teacher_review`. Codex e Gemini podem sugerir
novos caminhos, mas nenhuma variação entra no jogo antes da revisão do
professor.

O Gemini não decide saldo, nota, final ou recompensa durante a tentativa. A
lógica determinística garante que a mesma escolha sempre tenha a mesma
consequência financeira.

## Persistência

Ao finalizar, o frontend envia somente o resultado agregado da tentativa:

- fase `3`;
- identificador `ilusao-dinheiro-caminhos-v1`;
- nota de `0` a `100`;
- quantidade de escolhas estratégicas e impulsivas.

O saldo narrativo não entra na carteira. Tentativas aprovadas usam a transação
atômica existente para registrar tentativa, progresso, CapiCoins, streak e
livro-caixa.

## Testes

```powershell
cd frontend
npm run test:ilusao-dinheiro
npm run lint
npm run build
```

Teste manual:

1. conclua o conteúdo da Fase 3 e abra **Caminhos de Decisão**;
2. confirme a separação entre caixa simulado e carteira real;
3. percorra as seis decisões e observe o saldo após cada escolha;
4. confira o final, a nota, a linha do tempo e a situação da meta;
5. faça um caminho abaixo de 60 e confirme que não há moedas nem liberação;
6. refaça com escolhas mais estratégicas e confirme 100 CapiCoins-base,
   streak e liberação da Fase 4;
7. explore outro caminho e confirme a revisão de 20 CapiCoins-base.
