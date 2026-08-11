# Guia de hospedagem — piloto Money Rank

Este guia publica a arquitetura confirmada do piloto:

- frontend React/Vite no Render Static Site `money-rank-web`;
- API Node/Express em Docker no Render Web Service `money-rank-api`;
- Firebase Authentication, App Check, Storage e SQL Connect/PostgreSQL;
- projeto Firebase `money-rank`;
- branch `chore/firebase-deploy-prep`.

Não copie chaves privadas para comandos, documentação, Git, variáveis `VITE_*`
ou conversas. Cadastre segredos somente nos painéis protegidos ou no ambiente
local temporário usado para a operação.

## 1. Publicar os commits no GitHub

O Render só consegue puxar commits existentes no remoto. Confirme o branch e
publique-o:

```powershell
git switch chore/firebase-deploy-prep
git status --short --branch
git push origin chore/firebase-deploy-prep
```

Depois do push, use o hash exibido por `git rev-parse HEAD` como referência de
deploy e rollback.

## 2. Entender a avaliação do SQL Connect no Spark

O SQL Connect no Spark permite uma única avaliação do Cloud SQL por projeto,
com duração de 90 dias e limite aproximado de 8.300 operações por dia. Depois
do período, a instância é arquivada se o projeto não migrar para Blaze. Excluir
a instância encerra a avaliação daquele projeto.

Referências oficiais:

- https://firebase.google.com/docs/sql-connect/pricing?hl=pt-BR
- https://firebase.google.com/docs/sql-connect/quickstart

O script exige uma confirmação explícita para não consumir essa avaliação por
engano.

## 3. Provisionar SQL Connect, período, economia e os 140 itens

No repositório:

```powershell
npx -y firebase-tools@latest login:list
npx -y firebase-tools@latest use money-rank
npm --prefix backend/render-api ci
npm --prefix backend/render-api run bank:validate
$env:CONFIRM_SQL_CONNECT_TRIAL='YES'
npm --prefix backend/render-api run pilot:provision
Remove-Item Env:CONFIRM_SQL_CONNECT_TRIAL
```

O último comando executa, nesta ordem:

1. deploy do schema e das operações SQL Connect;
2. criação idempotente do período `piloto-money-rank-2026-08-11`;
3. configuração da economia 20/100/20, cooldown de 30 segundos e repetição sem
   limite diário;
4. importação transacional dos 140 itens;
5. consulta de reconciliação por atividade e hash.

O importador aborta antes de escrever se qualquer linha for inválida. A carga
usa a chave `activity_id + version + item_id`, calcula SHA-256 e informa
inseridos, atualizados, ignorados e rejeitados. Repetir o comando não duplica
itens.

Para consultar novamente a carga:

```powershell
npx -y firebase-tools@latest dataconnect:execute dataconnect/connector/queries.gql GetPedagogicalBankStatus --project money-rank --service money-rank-service --location southamerica-east1 --variables '{}'
```

As contagens obrigatórias são:

| Atividade | Itens ativos |
|---|---:|
| Perigo Doce | 30 |
| Custo do Vício | 54 |
| Ilusão do Dinheiro | 24 |
| Engenharia do Desejo | 32 |
| Total | 140 |

## 4. Configurar Authentication e App Check

No Firebase Console do projeto `money-rank`:

1. Em **Authentication > Sign-in method**, habilite Google.
2. Em **Authentication > Settings > Authorized domains**, adicione o domínio
   efetivo `money-rank-web.onrender.com`, sem protocolo ou caminho.
3. Em **App Check**, registre o aplicativo Web existente com reCAPTCHA
   Enterprise.
4. Copie apenas a chave pública do site para
   `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` no Render.
5. Conceda à conta de serviço usada pela API a permissão necessária para
   verificar tokens App Check.
6. Para o teste de carga, registre temporariamente um Debug Token. Revogue-o
   imediatamente após o teste e nunca o coloque no Git.

Referências:

- https://firebase.google.com/docs/app-check/web/custom-resource
- https://firebase.google.com/docs/app-check/custom-resource-backend
- https://firebase.google.com/docs/app-check/web/debug-provider

## 5. Criar a conta de serviço da API

Crie uma conta de serviço dedicada para o Render com o mínimo de permissões
necessárias para:

- validar Firebase ID Tokens;
- validar App Check Tokens;
- executar operações administrativas SQL Connect;
- acessar somente o bucket editorial usado pelo projeto;
- administrar usuários apenas durante a janela controlada de teste de carga.

Guarde `client_email` e `private_key` no painel de secrets do Render. Não salve
o arquivo JSON no workspace.

## 6. Criar os serviços no Render

1. No Render, selecione **New > Blueprint**.
2. Conecte `fabioholimadev/Money-Rank`.
3. Selecione o branch `chore/firebase-deploy-prep`.
4. O Render lerá `render.yaml` e criará:
   - `money-rank-api`, Web Service Docker;
   - `money-rank-web`, Static Site.
5. Mantenha `autoDeploy` desligado para o piloto.

### Variáveis da API

Cadastre no `money-rank-api`:

| Chave | Valor/origem |
|---|---|
| `FRONTEND_ORIGIN` | `https://money-rank-web.onrender.com` |
| `FIREBASE_PROJECT_ID` | `money-rank` |
| `FIREBASE_CLIENT_EMAIL` | secret da conta de serviço |
| `FIREBASE_PRIVATE_KEY` | secret da conta de serviço, com quebras de linha preservadas |
| `FIREBASE_STORAGE_BUCKET` | `money-rank.firebasestorage.app` |
| `TEACHER_EMAILS` | `fabiooliveiral2020@gmail.com,profciensyllas@gmail.com` |
| `SQL_CONNECT_LOCATION` | `southamerica-east1` |
| `SQL_CONNECT_SERVICE` | `money-rank-service` |
| `SQL_CONNECT_CONNECTOR` | `money-rank-connector` |
| `PERIOD_ID` | `piloto-money-rank-2026-08-11` |
| `PERIOD_DATE` | `2026-08-11` |
| `GEMINI_API_KEY` | secret, se mentor/analista forem usados |
| `GEMINI_MODEL` | `gemini-3.6-flash` |

### Variáveis do frontend

Cadastre no `money-rank-web`:

| Chave | Valor |
|---|---|
| `VITE_API_URL` | URL pública efetiva do `money-rank-api` |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | chave pública do App Check |
| `VITE_DATA_CONNECT_ENABLED` | `false` |
| `VITE_FIREBASE_APPCHECK_DEBUG` | `false` |

Não crie `VITE_FIREBASE_PRIVATE_KEY`, `VITE_GEMINI_API_KEY` ou qualquer outra
variável de segredo no frontend.

## 7. Publicar e validar

Publique primeiro a API e depois o frontend. Validações mínimas:

```powershell
Invoke-RestMethod https://money-rank-api.onrender.com/healthz
```

O resultado deve conter `ok: true`. Depois:

1. abra o frontend;
2. entre com professor e confirme e-mail verificado;
3. confirme que uma chamada sem ID Token recebe 401;
4. confirme que App Check inválido recebe 401;
5. confirme que uma origem diferente do frontend recebe 403;
6. confirme as turmas DSB/DSA e a rejeição durante a pausa;
7. conclua uma tentativa de cada atividade;
8. repita uma submissão e confirme que não houve recompensa duplicada;
9. baixe o XLSX em `/api/export.xlsx?classId=TODAS` e abra as seis abas;
10. repita com `3DSA` e `3DSB`.

## 8. Teste de carga e limpeza

Configure os valores abaixo somente no terminal seguro da execução:

- `API_URL`;
- `FIREBASE_PROJECT_ID`;
- `FIREBASE_CLIENT_EMAIL`;
- `FIREBASE_PRIVATE_KEY`;
- `FIREBASE_WEB_API_KEY`;
- `FIREBASE_WEB_APP_ID`;
- `APPCHECK_DEBUG_TOKEN`;
- `LOAD_TEST_RUN_ID`.

Smoke com 10 usuários:

```powershell
npm --prefix backend/render-api run load:smoke
```

Único teste completo, 100 usuários, rampa de 30 segundos e 15 minutos:

```powershell
$env:ALLOW_FULL_LOAD_TEST='YES'
npm --prefix backend/render-api run load:full
Remove-Item Env:ALLOW_FULL_LOAD_TEST
```

Critérios: erro abaixo de 1% e p95 abaixo de 2 segundos após aquecimento.

Limpeza obrigatória:

```powershell
npm --prefix backend/render-api run load:cleanup
```

A limpeza exclui somente usuários que atendem simultaneamente aos marcadores
`uid loadtest-*`, `is_test=true` e `origin=LOAD_TEST`. Contas reais não são
removidas por idade ou padrão parcial. O resumo do teste permanece em
`load_test_runs`. Depois, revogue manualmente o Debug Token em App Check.

## 9. Aquecimento e operação no dia

- 08:05: acesse `/healthz`, o frontend e uma rota autenticada.
- 08:15: execute o smoke de 10 usuários, se ainda não tiver sido executado.
- 10:15: aqueça novamente API e frontend antes da turma DSA.
- 12:05: feche o período, exporte o XLSX, execute a compensação de saldo e
  preserve o ledger.

## 10. Rollback

1. Anote o commit anterior considerado estável.
2. No Render, use **Manual Deploy > Deploy a specific commit** para API e web.
3. Não reverta o schema com exclusão de colunas/tabelas durante a aula.
4. Se a API nova falhar, restaure o commit anterior e mantenha o SQL Connect;
   as operações e cargas são idempotentes.
5. Registre hash, horário, motivo e responsável no relatório de execução.

## 11. Links e materiais — executar por último

Somente depois de aplicação, banco, autenticação, carga e exportação estarem
estáveis:

1. validar incorporação dos vídeos das fases 0 a 4;
2. validar slides e resumos das fases 1 e 2;
3. preencher slides e resumos das fases 3 e 4 quando forem fornecidos;
4. testar permissões anônimas/incorporação em janela privada;
5. manter na área de conteúdo apenas título, vídeo, slide, resumo e botões de
   navegação.

Os links permanecem como a última etapa porque não devem bloquear a publicação
funcional do piloto.
