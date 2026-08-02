# Task 3.6 — O Custo do Vício

## Objetivo pedagógico

**O Custo do Vício** é um estudo de caso com três personagens fictícios. O
aluno escolhe uma história e analisa cinco decisões. Todas as alternativas
representam uma leitura possível; nenhuma recebe o rótulo de errada.

Os personagens aparecem em uma lista de três linhas expansíveis. Ao abrir uma
linha, o aluno consulta a história, a meta e os valores simulados antes de
começar. A ordem das alternativas A, B e C é embaralhada em cada tentativa;
uma letra nunca representa uma pontuação fixa.

A diferença está na profundidade:

- **1 ponto de análise — leitura inicial:** reconhece parte do contexto imediato;
- **2 pontos de análise — leitura financeira:** inclui recorrência, orçamento ou meta;
- **3 pontos de análise — leitura sistêmica:** conecta dinheiro, tempo, saúde, contexto
  social, custos coletivos ou rede de apoio.

Cada personagem possui cinco decisões. O motor converte os 5 a 15 pontos de
insight em uma nota de 60 a 100. Portanto, toda sequência completa conclui a
atividade, mas a devolutiva mostra onde a análise pode ser ampliada.

## Personagens da versão 2026-08-01

| Personagem | Contexto | Meta | Valor mensal simulado |
| --- | --- | --- | ---: |
| Rafael | Uso recorrente de vape nos intervalos | Teclado para estudo e trabalho | R$ 144 |
| Beatriz | Gastos de fim de semana associados ao álcool | Certificação profissional | R$ 192 |
| Diego | Gasto frequente com produtos de tabaco | Caixa de ferramentas | R$ 180 |

Todos os preços, frequências, nomes e histórias são fictícios e aparecem
como simulação na interface. Eles servem para cálculo e não representam
pesquisa de preços ou relato de uma pessoa real.

## Pesquisa e validação

Codex organiza a pesquisa inicial em fontes institucionais. O professor não
precisa produzir o banco do zero, mas continua sendo o responsável por validar
linguagem, adequação à turma e objetivos da aula.

A base usada nesta versão está em
`frontend/src/data/custoVicioCases.js` e registra, junto de cada fato:

- instituição publicadora;
- título e endereço da fonte;
- data de acesso;
- finalidade pedagógica;
- status técnico `source_verified`;
- status pedagógico `pending_teacher_review`.

Fontes institucionais desta versão:

- INCA: dados sobre dispositivos eletrônicos para fumar;
- INCA: custos atribuíveis ao tabagismo;
- Ministério da Justiça e Segurança Pública: impactos do álcool;
- Ministério da Justiça e Segurança Pública: fatores de risco e proteção;
- Ministério da Saúde: saúde de adolescentes e jovens.

Os endereços completos ficam no arquivo da base para permitir auditoria e
atualização. Após a revisão, o professor pode solicitar a troca do status
pedagógico para `teacher_approved`.

## Papel da IA e da lógica controlada

Esta atividade usa um **motor determinístico**, e não uma geração ao vivo do
Gemini. Essa escolha garante que:

1. todas as alternativas exibidas já estejam ligadas a fontes auditáveis;
2. a mesma profundidade sempre produza a mesma pontuação;
3. a IA nunca decida aprovação, moedas ou streak;
4. a atividade continue funcionando sem rede ou cota de IA;
5. o professor aprove o conteúdo antes de ele chegar ao aluno.

Codex e Gemini podem ajudar a propor novos personagens e variações para o
banco. Essas sugestões devem entrar primeiro com revisão pendente e nunca são
publicadas diretamente durante a tentativa do aluno.

## Persistência e competição

A nota pedagógica não altera a quantidade de moedas. Ao concluir as cinco
decisões, o frontend envia ao Firebase SQL Connect:

- fase `2`;
- nota entre `60` e `100`;
- `5` decisões válidas;
- `0` respostas erradas;
- identificador do personagem analisado.

O SQL Connect executa uma transação atômica e é a única autoridade para:

- criar a tentativa imutável;
- atualizar o melhor resultado e o número de tentativas;
- liberar a Fase 3 na primeira conclusão;
- pagar 100 CapiCoins-base na primeira conclusão;
- pagar 20 CapiCoins-base nas revisões remuneradas;
- aplicar o multiplicador de streak;
- atualizar saldo e livro-caixa sem duplicação.

O aluno pode escolher **Analisar outro personagem** depois de salvar. A nova
execução é registrada como revisão e segue os limites configurados na
economia competitiva.

## Testes

Validação automatizada do banco e da pontuação:

```powershell
cd frontend
npm run test:custo-vicio
npm run lint
npm run build
```

Teste manual:

1. Inicie o banco local e o Vite no ambiente de desenvolvimento.
2. Entre com Google e use um aluno que tenha concluído o conteúdo da Fase 2.
3. Abra **O Custo do Vício → Atividade**.
4. Confirme a presença de Rafael, Beatriz e Diego.
5. Escolha um personagem e responda às cinco decisões.
6. Verifique que nenhuma alternativa aparece em vermelho ou como errada e que
   a ordem A/B/C muda ao iniciar uma nova tentativa.
7. Confirme a devolutiva de 60 a 100 pontos e salve.
8. Verifique no resultado a recompensa-base, multiplicador, bônus, saldo e
   streak retornados pelo SQL Connect.
9. Confirme que a Fase 3 foi liberada.
10. Clique em **Analisar outro personagem**, conclua novamente e confirme que a
    tentativa foi registrada como revisão de 20 CapiCoins-base.
