# Como rodar o Money Rank localmente

Este guia descreve o ambiente de desenvolvimento no Windows com PowerShell.
Execute os comandos a partir da raiz do repositório, salvo quando o texto
indicar outra pasta.

## 1. Pré-requisitos

- Node.js 22 ou superior;
- npm;
- Java/JDK disponível no `PATH` (necessário para o emulador do Storage);
- acesso ao projeto Firebase `money-rank` para testar login com Google;
- opcionalmente, Docker Desktop para executar somente o SQL Connect em um
  contêiner.

Confira o ambiente:

```powershell
node --version
npm --version
java -version
npx -y firebase-tools@latest --version
```

O projeto exige Node.js 22. Se `java` não for reconhecido, instale um JDK,
abra um novo terminal e repita a verificação.

## 2. Instalar as dependências

Não existe um `package.json` na raiz. Cada aplicação possui suas próprias
dependências:

```powershell
cd frontend
npm install

cd ..\functions
npm install

cd ..\backend\render-api
npm install

cd ..\..
```

O diretório `backend` sem o sufixo `render-api` contém a API antiga baseada em
Supabase. Para o desenvolvimento atual, use `backend/render-api`.

## 3. Configurar o frontend

Crie o arquivo local a partir do exemplo versionado:

```powershell
Copy-Item .\frontend\.env.example .\frontend\.env.local
```

Para usar os emuladores locais, ajuste estas variáveis em
`frontend/.env.local`:

```dotenv
VITE_DATA_CONNECT_ENABLED=false
VITE_USE_DATA_CONNECT_EMULATOR=true
VITE_DATA_CONNECT_EMULATOR_HOST=127.0.0.1
VITE_DATA_CONNECT_EMULATOR_PORT=9399

VITE_USE_FUNCTIONS_EMULATOR=true
VITE_FUNCTIONS_EMULATOR_HOST=127.0.0.1
VITE_FUNCTIONS_EMULATOR_PORT=5001
```

O frontend já contém a configuração pública do Firebase. Para o login local,
o provedor Google deve estar habilitado e `localhost` deve constar nos domínios
autorizados do Firebase Authentication.

## 4. Configurar o Gemini local

O script dos emuladores cria automaticamente:

- `functions/.env.local`, com o modelo configurado;
- `functions/.secret.local`, com `GEMINI_API_KEY=local-fallback` quando ainda
  não existe uma chave.

Com `local-fallback`, as funcionalidades continuam executando a resposta local
determinística, mas não chamam o Gemini. Para testar o Gemini de verdade, edite
somente o arquivo ignorado pelo Git:

```dotenv
# functions/.secret.local
GEMINI_API_KEY=SUA_CHAVE_LOCAL
```

E confirme o modelo:

```dotenv
# functions/.env.local
GEMINI_MODEL=gemini-3.6-flash
```

Nunca grave a chave em `.env.example`, no código-fonte ou em um commit. Depois
de alterar a chave, reinicie os emuladores. Nos logs, uma resposta marcada como
fallback normalmente indica chave ausente/inválida, indisponibilidade ou erro
do provedor.

## 5. Iniciar o ambiente Firebase local

Em um primeiro terminal, na raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

O script inicia os serviços juntos e deve permanecer aberto:

| Serviço | Endereço local |
| --- | --- |
| SQL Connect (Capi Bank) | `127.0.0.1:9399` |
| Cloud Functions | `127.0.0.1:5001` |
| Firebase Storage | `127.0.0.1:9199` |

Se uma dessas portas já estiver ocupada e as outras não, encerre o processo
antigo antes de executar o script novamente. Pare os emuladores com `Ctrl+C`.

### Alternativa: somente SQL Connect com Docker

Esta alternativa não inicia Functions nem Storage:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dataconnect-docker.ps1
```

Use-a para trabalhar apenas no esquema, nas operações GraphQL ou no SDK. O
Docker Desktop precisa estar em execução.

## 6. Iniciar o frontend

Em um segundo terminal:

```powershell
cd frontend
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente
`http://localhost:5173`.

## 7. API HTTP atual (opcional)

A API usada na hospedagem fica em `backend/render-api`. Ela acessa os serviços
reais do Firebase Admin e exige credenciais de uma conta de serviço, Firebase
App Check e SQL Connect configurados. O frontend abre sem ela, mas as telas que
usam `fetchApi` precisam dessa API para funcionar integralmente.

Caso precise testá-la, copie o exemplo e preencha localmente os valores sem
versioná-los:

```powershell
Copy-Item .\backend\render-api\.env.example .\backend\render-api\.env.local
```

O servidor não carrega esse arquivo automaticamente. O Node.js 22 pode
carregá-lo diretamente:

```powershell
cd backend\render-api
node --env-file=.env.local server.mjs
```

O padrão da API é a porta `8080`. Se o frontend precisar chamá-la, defina
`VITE_API_URL=http://localhost:8080` em `frontend/.env.local` e configure
`FRONTEND_ORIGIN=http://localhost:5173` na API. Requisições protegidas também
precisam de tokens válidos do Firebase Auth e do App Check.

## 8. Testes e validações

### Functions

```powershell
cd functions
npm run lint
npm test
cd ..
```

### API HTTP

```powershell
cd backend\render-api
npm test
cd ..\..
```

### Frontend

```powershell
cd frontend
npm run lint
npm run build
cd ..
```

### Esquema e operações do SQL Connect

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
```

O resultado esperado inclui:

```text
SQL Connect validado: esquema, relacoes e operacoes carregados.
```

## 9. Solução de problemas

- **`java` não encontrado:** instale um JDK e reabra o PowerShell.
- **Porta 9399, 5001 ou 9199 ocupada:** encerre o emulador anterior e reinicie
  o conjunto completo.
- **Login Google falha:** confirme o provedor Google e o domínio `localhost` no
  Firebase Authentication.
- **Gemini cai no fallback:** confira `functions/.secret.local`, reinicie os
  emuladores e observe o erro sanitizado no terminal das Functions.
- **Dados locais não aparecem:** confirme as duas flags
  `VITE_USE_DATA_CONNECT_EMULATOR` e `VITE_USE_FUNCTIONS_EMULATOR` e reinicie o
  Vite após alterar `.env.local`.
- **Docker informa que não está disponível:** abra o Docker Desktop e aguarde
  o daemon ficar pronto.
- **Alteração em arquivo `.gql`:** valide/regere o SDK e reinstale a
  dependência local:

  ```powershell
  powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
  cd frontend
  npm install .\src\lib\dataconnect-sdk
  ```

## Fluxo rápido para o dia a dia

Depois da primeira instalação e configuração:

```powershell
# Terminal 1, na raiz
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1

# Terminal 2
cd frontend
npm run dev
```
