# Organização dos bancos e possibilidades das atividades

## Objetivo deste documento

Este relatório registra de onde vem o conteúdo de cada atividade, quantas
possibilidades existem hoje, quais regras limitam a geração e o que ainda
precisa de validação pedagógica. Ele deve ser atualizado sempre que fatos,
personagens, decisões, publicidades, prompts ou critérios de pontuação forem
alterados.

## Visão geral

| Fase | Atividade | Fonte principal | IA durante o jogo | Tamanho atual |
| --- | --- | --- | --- | --- |
| 1 | O Perigo Doce | Banco científico de fatos e fontes | Sim, com fallback determinístico | 8 fatos; rodada de 5 questões |
| 2 | O Custo do Vício | Banco de estudos de caso | Não | 3 personagens; 5 decisões por personagem |
| 3 | A Ilusão do Dinheiro | Árvore de decisões | Não | 6 decisões; 3 caminhos em cada uma |
| 4 | A Engenharia do Desejo | Banco auditável de publicidades | Não | 6 peças reais e 6 inventadas; rodada de 6 |

A cópia autoritativa usada pelas Cloud Functions é gerada em
`functions/src/generated/activity-manifest.json`. Ela não deve ser editada
manualmente. Depois de mudar um banco do frontend, execute:

```powershell
node .\scripts\build-authoritative-activity-manifest.mjs
```

Isso mantém o gabarito e a pontuação fora do navegador. O aluno recebe apenas
os dados necessários para jogar; respostas, pesos e classificações permanecem
no servidor até a correção.

## Fase 1 - O Perigo Doce

### Banco e diretrizes

O arquivo `frontend/src/data/perigoDoceKnowledge.js` possui 8 fatos. Cada fato
contém identificador, tema, dificuldade, afirmação correta, explicação, 3
concepções equivocadas e uma fonte com URL e data de consulta.

O Gemini recebe esse banco e deve devolver exatamente 5 questões em JSON,
sempre com:

1. quatro alternativas identificadas por A, B, C e D;
2. uma única alternativa correta;
3. dificuldade `facil`, `media` ou `desafiadora`;
4. referência a um ou dois identificadores existentes no banco;
5. explicação baseada somente nos fatos fornecidos;
6. nenhuma informação pessoal, recompensa ou saldo do aluno.

Se não houver chave ou a chamada falhar, o servidor sorteia 5 dos 8 fatos e
monta uma questão segura por fato. Portanto a atividade não depende do Gemini
para continuar funcionando.

### Quantidade de possibilidades

- seleção e ordem de 5 entre 8 fatos: 6.720 sequências;
- ordem das 4 alternativas em 5 questões: `24^5 = 7.962.624` combinações;
- fallback completo: até 53.508.833.280 apresentações ordenadas;
- modo Gemini: quantidade textual aberta, mas sempre limitada pelo esquema de
  5 questões, 4 alternativas e pelos 8 fatos validados.

Essa contagem mede variações de apresentação; não significa que existam
bilhões de conceitos diferentes. O conhecimento pedagógico continua limitado
aos 8 fatos atuais.

## Fase 2 - O Custo do Vício

### Banco e diretrizes

O arquivo `frontend/src/data/custoVicioCases.js` possui três personagens:
Rafael, Beatriz e Diego. Cada história tem 5 decisões e cada decisão oferece 3
análises. Nenhuma opção é tratada como simplesmente errada: elas valem 1, 2
ou 3 pontos conforme a qualidade da análise. A posição visual das opções é
embaralhada e o valor nunca é mostrado antes da escolha.

### Quantidade de possibilidades

- por personagem: `3^5 = 243` caminhos de resposta;
- nos três personagens: 729 caminhos de resposta;
- ordem visual das opções por personagem: `6^5 = 7.776` apresentações.

O personagem é escolhido pelo aluno antes de a sessão autoritativa ser
aberta. Hoje os casos são fixos e não são inventados pela IA durante o jogo.

## Fase 3 - A Ilusão do Dinheiro

### Banco e diretrizes

O arquivo `frontend/src/data/ilusaoDinheiroPaths.js` define uma missão com
saldo simulado inicial de 600, meta de 420 e 6 decisões. Cada decisão possui 3
caminhos, que valem 0, 1 ou 2 pontos de análise e alteram o saldo da história.
As CapiCoins reais só são calculadas pelo servidor depois do resultado final;
o saldo narrativo não altera diretamente a carteira do aluno.

### Quantidade de possibilidades

- caminhos completos: `3^6 = 729`;
- ordens visuais das opções: `6^6 = 46.656`;
- desfechos narrativos atuais: 4 (`meta protegida`, `plano de recuperação`,
  `futuro comprometido` e `meta adiada`).

A história é fixa e auditável. Não há geração de novas decisões pela IA
durante a tentativa.

## Fase 4 - A Engenharia do Desejo

### Banco e diretrizes

O arquivo `frontend/src/data/engenhariaDesejoAds.js` contém 12 peças: 6 reais
com fonte HTTPS verificável e 6 inventadas pelo projeto sem fonte falsa. Cada
rodada sorteia 3 reais e 3 inventadas, embaralha os 6 cards e também alterna a
posição dos botões de resposta.

As 12 peças estão tecnicamente classificadas, mas continuam marcadas como
`pending_teacher_review`. Isso significa que o professor ainda precisa aprovar
a adequação pedagógica antes do piloto.

### Quantidade de possibilidades

- conjuntos sem ordem: `C(6,3) x C(6,3) = 400` rodadas;
- seleção com ordem dos 6 cards: 288.000 rodadas;
- incluindo a troca de posição dos dois botões em cada card: 18.432.000
  apresentações visuais;
- respostas possíveis em uma rodada fixa: `2^6 = 64`.

## O que a IA faz e o que não faz

Atualmente, somente O Perigo Doce usa IA em tempo de execução. Nas outras
atividades, IA/Codex pode apoiar pesquisa, redação e organização editorial,
mas o material entra no jogo apenas depois de ser registrado no banco em código
e revisado. A IA nunca é a prova de que uma publicidade ou afirmação é real.

## Limitações e próximas decisões

1. Os bancos ainda não possuem painel de autoria para o professor; ampliar o
   conteúdo exige alteração de código, regeneração do manifesto e deploy.
2. Grande variação visual não substitui variedade conceitual. A expansão mais
   importante é adicionar fatos, casos e peças revisadas.
3. As publicidades da Fase 4 precisam de validação pedagógica do professor.
4. As fontes devem ser rechecadas antes do piloto e sempre que uma URL ou regra
   pública mudar.
5. Uma futura ferramenta editorial deve versionar publicação, revisor, data e
   estado (`rascunho`, `aprovado`, `arquivado`) sem expor gabaritos ao frontend.

## Testes relacionados

```powershell
cd frontend
npm run test:perigo-doce-ai
npm run test:custo-vicio
npm run test:ilusao-dinheiro
npm run test:engenharia-desejo

cd ..\functions
npm test
```
