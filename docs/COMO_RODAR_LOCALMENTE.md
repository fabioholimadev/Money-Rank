# Como rodar o Money Rank localmente

Este guia descreve o ambiente atual no Windows com PowerShell. A aplicacao usa
uma unica API HTTP em `backend/render-api`; o backend Supabase antigo foi
removido.

## 1. Pre-requisitos

- Node.js 22, que corresponde ao runtime de producao;
- npm;
- acesso ao projeto Firebase `money-rank` para testar o login Google;
- Java apenas para o modo opcional com Storage Emulator.

Confira o ambiente:

```powershell
node --version
npm --version
npx -y firebase-tools@latest --version
```

## 2. Primeira instalacao

Nao existe `package.json` na raiz. Instale cada aplicacao separadamente:

```powershell
cd frontend
npm ci

cd ..\functions
npm ci

cd ..\backend\render-api
npm ci

cd ..\..
```

Crie a configuracao do frontend:

```powershell
Copy-Item .\frontend\.env.example .\frontend\.env.local
```

O exemplo ja aponta `VITE_API_URL` para `http://localhost:8080`.

## 3. Fluxo diario atual

Use tres terminais, todos iniciados na raiz do repositorio.

### Terminal 1 — Capi Bank local

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

Esse comando inicia somente o SQL Connect em `127.0.0.1:9399`, suficiente para
a API HTTP atual. Ele nao depende de Java ou Docker.

### Terminal 2 — API HTTP

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-api.ps1
```

Na primeira execucao, o script cria `backend/render-api/.env.local` a partir do
exemplo versionado. A configuracao local:

- escuta em `http://localhost:8080`;
- aceita o frontend em `http://localhost:5173`;
- usa o SQL Connect Emulator em `127.0.0.1:9399`;
- desativa App Check explicitamente somente em desenvolvimento.

Use `-InstallDependencies` para forcar um novo `npm ci` antes de iniciar.

### Terminal 3 — frontend

```powershell
cd frontend
npm run dev
```

Acesse o endereco exibido pelo Vite, normalmente
`http://localhost:5173`.

## 4. Verificar se o backend esta pronto

Com a API em execucao:

```powershell
Invoke-RestMethod http://localhost:8080/healthz
Invoke-WebRequest http://localhost:8080/readyz
```

- `/healthz` confirma que o processo HTTP esta ativo;
- `/readyz` confirma acesso ao Capi Bank e exige os 140 itens pedagogicos
  ativos; responde `503` quando o banco iniciou, mas ainda nao foi populado.

## 5. App Check

`APP_CHECK_ENFORCEMENT=false` e aceito apenas fora de producao. A API ignora
essa desativacao quando `NODE_ENV=production`, mesmo que a variavel seja
configurada incorretamente.

Para testar localmente com App Check real:

1. altere `APP_CHECK_ENFORCEMENT=true` na API;
2. defina `VITE_FIREBASE_APPCHECK_DEBUG=true` no frontend;
3. inicie o frontend e copie o token exibido pelo SDK no console do navegador;
4. registre o token em **Firebase Console > App Check > Manage debug tokens**;
5. opcionalmente grave o token somente em `frontend/.env.local` como
   `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN`.

Nunca versione ou envie um token de depuracao em builds de producao.

## 6. Pilha Firebase completa opcional

Functions e Storage nao sao necessarios para o fluxo HTTP diario. Para testar
esses emuladores de referencia:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1 -FullFirebaseStack
```

Esse modo inicia SQL Connect (`9399`), Functions (`5001`) e Storage (`9199`) e
exige Java no `PATH`.

## 7. Gemini local

A API funciona sem `GEMINI_API_KEY`, usando as contingencias previstas. Para
testar o provedor real, preencha a chave somente no arquivo ignorado
`backend/render-api/.env.local`:

```dotenv
GEMINI_API_KEY=SUA_CHAVE_LOCAL
GEMINI_MODEL=gemini-3.6-flash
```

Reinicie a API depois da alteracao. Nunca grave a chave em exemplos, codigo ou
commits.

## 8. Testes e validacoes

```powershell
cd functions
npm run lint
npm test

cd ..\backend\render-api
npm test

cd ..\..\frontend
npm run lint
npm run build

cd ..
powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
git diff --check
```

## 9. Solucao de problemas

- **Porta 8080 ocupada:** encerre a API anterior ou altere `PORT` e
  `VITE_API_URL` juntos.
- **Porta 9399 ocupada:** encerre o SQL Connect Emulator anterior antes de
  executar o script novamente.
- **`healthz` passa e `readyz` falha:** confira o Terminal 1 e confirme que o
  banco pedagogico foi carregado.
- **Erro de CORS:** `FRONTEND_ORIGIN` deve ser exatamente a origem exibida pelo
  Vite.
- **Resposta `missing_app_check`:** use a desativacao local documentada ou
  registre um token debug; producao nunca aceita o bypass.
- **Login Google falha:** habilite o provedor Google e autorize `localhost` no
  Firebase Authentication.
- **Java nao encontrado:** Java e necessario apenas com
  `-FullFirebaseStack`.
- **Gemini usa fallback:** confira a chave local e reinicie a API.
