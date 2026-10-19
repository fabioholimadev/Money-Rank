# Continuidade do Money Rank — oficina Ciência Delas

Este arquivo é o ponto de entrada para outra IA ou outro desenvolvedor.
O estado detalhado está em
[`oficina/HANDOFF_OFICINA_CIENCIA_DELAS_2026-10-19.md`](oficina/HANDOFF_OFICINA_CIENCIA_DELAS_2026-10-19.md).

## Prompt recomendado

> Continue o desenvolvimento do Money Rank a partir da branch remota
> `feat/oficina-ciencia-delas-redesign`. Não use nem mescle a antiga
> `feat/oficina-ciencia-delas`, pois ela foi criada sobre uma versão obsoleta.
> Antes de editar, leia integralmente:
>
> 1. `docs/oficina/HANDOFF_OFICINA_CIENCIA_DELAS_2026-10-19.md`;
> 2. `docs/oficina/FLUXO_DA_OFICINA_CIENCIA_DELAS.md`;
> 3. `docs/oficina/BASE_PEDAGOGICA_E_FONTES_CIENCIA_DELAS.md`;
> 4. `docs/deploy/GUIA_HOSPEDAGEM_RENDER_FIREBASE_2026-08-11.md`;
> 5. `docs/COMO_RODAR_LOCALMENTE.md`.
>
> Confirme `git status --short --branch`, `git log -12 --oneline` e os remotos.
> Preserve o fluxo regular e a oficina como categorias separadas. Na oficina,
> toda rodada válida pontua novamente; o reenvio da mesma sessão não duplica
> pontos. Não reintroduza IA, Gemini ou variáveis de IA. Nunca leia, publique
> ou versione valores de `.env.local`. Execute testes proporcionais à mudança,
> faça commits semânticos pequenos e atualize o handoff quando houver uma
> decisão nova.

## Situação resumida

- Base original: `origin/new/redesign-sistemico` no commit `e6d7e44`.
- Branch de trabalho e deploy: `feat/oficina-ciencia-delas-redesign`.
- Oficina implementada com equipes, código de oito dígitos, QR Code, cadastro,
  quatro atividades, repetição pontuada, rankings e painel do professor.
- Painel do professor separado entre **Regular** e **Criação de times para
  oficina**, por período, com ativação/pausa e exportação CSV.
- Experiências e configurações ativas de IA foram retiradas.
- `render.yaml` define `money-rank-api` e `money-rank-web`; a branch é escolhida
  no Blueprint do Render e não está fixada no YAML.
- Falta executar o deploy real e o ensaio final com várias contas depois que
  o professor revisar o banco de questões.
