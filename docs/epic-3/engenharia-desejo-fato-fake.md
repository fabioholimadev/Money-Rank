# Task 3.8 — A Engenharia do Desejo

## Objetivo pedagógico

A atividade treina o aluno para separar publicidade documentada de uma peça
inventada e reconhecer técnicas de persuasão usadas no mercado de apostas.
Ela não reproduz anúncios completos: apresenta descrições pedagógicas e abre a
fonte institucional somente depois do palpite.

## Mecânica implementada

- banco editorial com 12 peças: 6 reais e 6 inventadas;
- cada rodada sorteia 3 reais e 3 inventadas;
- ordem das peças e dos dois botões muda a cada tentativa;
- o aluno responde 6 peças e precisa de 4 acertos para aprovação;
- depois de cada resposta, a tela revela classificação, explicação e técnica;
- publicidade real mostra país, canal, período e link institucional;
- peça inventada informa a autoria do Money Rank e não recebe fonte falsa;
- reprovação é registrada sem recompensa;
- aprovação usa o Capi Bank para progresso, streak, livro-caixa e CapiCoins.

## Banco auditável

Versão editorial inicial: `2026-08-03`.

As peças reais foram adaptadas de decisões públicas da Advertising Standards
Authority (ASA), regulador de publicidade do Reino Unido:

| Caso | Canal/período | Tema pedagógico | Fonte |
| --- | --- | --- | --- |
| Paddy Power — Wonder Wheel | TV, My5 e All4; março/2022 | repetição diária e aposta acima da convivência | [Decisão ASA](https://www.asa.org.uk/rulings/ppb-counterparty-services-ltd-g22-1149460-ppb-counterparty-services-ltd.html) |
| PlayOJO — Hot or Cold | site, blog e TV; setembro/2021 | ilusão de controle | [Decisão ASA](https://www.asa.org.uk/rulings/skill-on-net-ltd-g22-1151443-skill-on-net-ltd.html) |
| BetVictor — jogadores do Barcelona | Facebook; janeiro/2023 | anúncio disfarçado de conversa | [Decisão ASA](https://www.asa.org.uk/rulings/bv-gaming-ltd-a23-1183713-bv-gaming-ltd.html) |
| Kwiff — Lewis Hamilton | X; julho/2024 | transferência de prestígio | [Decisão ASA](https://www.asa.org.uk/rulings/eaton-gate-gaming-ltd-a24-1252292-eaton-gate-gaming-ltd.html) |
| Freebetsdotcom — Mason Mount | Instagram; julho/2023 | uso de assunto esportivo em alta | [Decisão ASA](https://www.asa.org.uk/rulings/xlmedia-plc-g23-1205202-xlmedia-plc.html) |
| Sean Graham — vale promocional | impresso; março/2025 | condição essencial pouco visível | [Decisão ASA](https://www.asa.org.uk/rulings/sp-graham-retail-ltd.html) |

A contextualização brasileira usa a publicação do
[Ministério da Fazenda sobre publicidade de apostas](https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/julho/ministerio-da-fazenda-amplia-exigencias-de-publicidade-de-apostas-no-pais),
que aborda advertências, proteção de menores e a proibição de apresentar
apostas como investimento.

### Peças inventadas

As seis peças inventadas são exemplos autorais com a identificação genérica
**Marca fictícia criada para o Money Rank**. Elas exploram recuperação
automática da sorte, ranking de apostas entre escolas, seguro absoluto de
perdas, algoritmo do minuto da sorte, certificado por apostar diariamente e
cashback de perdas convertido em refeições.

Nenhuma é atribuída a uma empresa real. O motor exige `evidence: null` e o
status `project_created`, impedindo que uma invenção ganhe citação falsa.

## Papel da IA e revisão do professor

A IA pode ajudar Codex e professor a localizar candidatos, resumir documentos
e propor linguagem. Ela não participa da tentativa do aluno e não decide o
gabarito. A classificação vem do banco versionado e testado.

Fluxo editorial obrigatório:

1. localizar fonte institucional;
2. conferir manualmente a página e os dados do caso;
3. escrever uma descrição curta e adaptada;
4. marcar a checagem técnica como `source_verified`;
5. manter `pending_teacher_review` até a validação do professor;
6. publicar somente após aprovação de linguagem, dificuldade e adequação.

## Pontuação e persistência

| Acertos | Nota | Resultado |
| ---: | ---: | --- |
| 6 | 100 | aprovado |
| 5 | 83 | aprovado |
| 4 | 67 | aprovado |
| 3 | 50 | reprovado |
| 2 | 33 | reprovado |
| 1 | 17 | reprovado |
| 0 | 0 | reprovado |

O frontend envia somente nota, acertos e erros. O Capi Bank calcula 100
CapiCoins-base na primeira aprovação ou 20 na revisão, com streak e limite do
servidor. O navegador não escolhe a recompensa.

## Arquivos da Task

- `frontend/src/data/engenhariaDesejoAds.js` — banco, fontes e regras;
- `frontend/src/lib/engenhariaDesejoGame.js` — validação, sorteio e pontuação;
- `frontend/src/pages/Trilha/SaudeConsumo/EngenhariaDesejo/AtividadeFatoFake.jsx`
  — interface e persistência;
- `scripts/test-engenharia-desejo-game.mjs` — invariantes automatizadas;
- `frontend/package.json` — comando de teste;
- `frontend/src/data/healthConsumptionActivities.js` — protótipo removido.

Não houve alteração de schema nem regeneração do SDK. A atividade reutiliza as
operações tipadas de tentativa e conclusão por `phaseNumber` e `activityId`.

## Teste automatizado

```powershell
cd "C:\Documentos\Programação\Money Rank\frontend"
npm run test:engenharia-desejo
```

O teste confere 12 IDs únicos, integridade das fontes, ausência de fonte falsa,
rodadas 3/3, variação das peças, respostas em A e B, notas-limite e o objeto
enviado ao serviço de persistência.

## Roteiro de teste manual

1. Concluir o conteúdo da Fase 4 e abrir **Atividade**.
2. Confirmar a introdução com 6 peças e meta de 4 acertos.
3. Responder uma peça e verificar que a fonte só aparece depois.
4. Em uma peça real, abrir a decisão da ASA e conferir local e período.
5. Em uma inventada, confirmar que não existe link externo.
6. Terminar com 3 acertos: tentativa salva, sem CapiCoins.
7. Repetir com 4 ou mais: trilha concluída e recompensa no saldo.
8. Jogar outra rodada e confirmar variação de cards e botões.
9. Repetir uma aprovação: base de 20 em vez de 100 CapiCoins.
10. Conferir largura móvel e desktop, sem rolagem horizontal.

## Validação

O usuário concluiu o roteiro local e aprovou a experiência visual e funcional
em `2026-08-04`. Os testes automatizados, lint e build também foram aprovados.
A revisão pedagógica dos 12 cards pelo professor permanece obrigatória antes
do uso oficial com as turmas.

Commit funcional: `8e76b9e feat: implementa Engenharia do Desejo auditavel`.
