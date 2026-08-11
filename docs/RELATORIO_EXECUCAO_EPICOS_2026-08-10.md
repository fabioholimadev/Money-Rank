# Relatório de execução — Money Rank

## Referência Git

- Remoto: `https://github.com/fabioholimadev/Money-Rank.git`
- Branch atual: `chore/firebase-deploy-prep`
- Commit-base remoto: `434e45b`
- Identidade local: `fabioholimadev <fabio.holima.dev@gmail.com>`
- Snapshot local anterior preservado em `local/canonical-scaffold`.

## Implementado nesta execução

- API Express separada para Render em `backend/render-api/`.
- Firebase ID Token e App Check obrigatórios em rotas protegidas.
- CORS restrito a `FRONTEND_ORIGIN`, limite de corpo, request ID, rate limit, Helmet e erros estruturados.
- `/healthz` público, sem dependência de banco.
- Rotas HTTP para iniciar/submeter atividade, período, ranking e exportação XLSX.
- API reutiliza `functions/src/activityEngine.js` e os repositórios Data Connect existentes; não duplica a pontuação.
- Frontend deixou de usar `httpsCallable` para as sessões e passou a enviar `Authorization` e `X-Firebase-AppCheck`.
- Docker multi-stage com usuário não-root e `render.yaml` com `money-rank-api` + `money-rank-web`.
- Variáveis documentadas em `backend/render-api/.env.example`; nenhum segredo foi adicionado ao Git.
- SQL Connect compilado com sucesso e SDK regenerado.

## Validações

- `npm test --prefix backend/render-api`: 2 testes aprovados.
- `npm run lint` no frontend: aprovado.
- `npm run build` no frontend: aprovado.
- `npx -y firebase-tools@latest dataconnect:compile --project money-rank`: aprovado, com avisos de operações públicas já existentes.
- Imagem Docker construída e `/healthz` respondeu 200 em container local.

## Conteúdo e período

A planilha de referência foi preservada em `docs/sources/banco-pedagogico-money-rank-preenchido.xlsx` (SHA-256 `AD50006032FEC0AA6CE469AE12222EA9E440CDEDC7F2BD8EC84ACB86F9B7E8C4`) e validada com 140 itens: Perigo Doce 30, Custo do Vício 54, Ilusão do Dinheiro 24 e Engenharia do Desejo 32. Slides/resumos das fases 3 e 4 permanecem placeholders.

O período oficial permanece em `America/Fortaleza`: DSB 08:20–10:00, grace 10:00–10:05, pausa 10:05–10:20, DSA 10:20–12:00, grace 12:00–12:05, fechamento 12:05.

## Bloqueios que exigem autenticação externa

- Não executei deploy Firebase/Render porque não há sessão autenticada nem secrets do Admin SDK/SQL Connect disponíveis no ambiente.
- Não executei teste real de 100 usuários com tokens Firebase/App Check nem limpeza de dados reais.
- O banco SQL Connect não foi provisionado nesta execução; a API usa os repositórios oficiais, mas a validação de produção depende do projeto `money-rank` autenticado.
- O Docker local foi validado; a URL `.onrender.com` só existirá após criação dos serviços.

## Próximos comandos após autenticação

```powershell
npx -y firebase-tools@latest use money-rank
npx -y firebase-tools@latest deploy --only dataconnect
git diff --check
Set-Location backend/render-api
npm ci
npm test
```

No Render, configurar `FRONTEND_ORIGIN`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `SQL_CONNECT_*` e `VITE_API_URL` no painel de secrets, sem enviar valores ao chat.
