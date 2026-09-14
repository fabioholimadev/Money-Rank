# Guia de demonstração local — Money Rank

Roteiro preparado para a apresentação de 15 de setembro de 2026. O ambiente
local atual usa três processos: Capi Bank, API HTTP e frontend.

## Antes de sair para a apresentação

1. Conecte o computador à internet e confirme que a conta Google da
   demonstração consegue entrar no Firebase.
2. Não mostre nem compartilhe `backend/render-api/.env.local`, pois ele contém
   a chave do Gemini.
3. Abra os três terminais na raiz do repositório:

   ```text
   C:\Users\fabio\Documents\Programação\Money Rank
   ```

4. Mantenha o carregador conectado. Os emuladores, a API e o navegador usam
   memória simultaneamente.
5. Feche processos antigos antes de iniciar se as portas 9399, 8080 ou 5173
   já estiverem ocupadas.

## Terminal 1 — Capi Bank

Na raiz do repositório, execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

Espere aparecer a confirmação de que o SQL Connect está ativo. O serviço usa a
porta `9399`. Não use `-FullFirebaseStack`: o fluxo atual não precisa de Java,
Functions nem Storage Emulator.

Deixe este terminal aberto durante toda a demonstração.

## Terminal 2 — API e Gemini

Abra outro PowerShell na raiz e execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-api.ps1
```

A API usa:

- endereço `http://localhost:8080`;
- Capi Bank do Terminal 1;
- chave e modelo Gemini de `backend/render-api/.env.local`;
- App Check desativado somente no desenvolvimento local.

Espere aparecer uma linha JSON com `"event":"listening"` e `"port":8080`.
Deixe o terminal aberto: ele também mostrará diagnósticos do CapiMentor e do
Capi Analista durante a apresentação.

## Terminal 3 — interface

Abra o terceiro PowerShell na raiz e execute:

```powershell
cd .\frontend
npm run dev
```

Abra o endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

Se o Vite escolher `5174`, há outro frontend ocupando a porta 5173. Para uma
demonstração previsível, encerre o processo antigo e reinicie este terminal.

## Verificação rápida antes de receber a banca

Em um quarto PowerShell temporário, execute:

```powershell
Invoke-RestMethod http://localhost:8080/healthz
Invoke-RestMethod http://localhost:8080/readyz
```

O primeiro comando deve retornar `ok: true`. O segundo deve mostrar:

- `ok: true`;
- `database: sql-connect`;
- `geminiConfigured: true`;
- `activeItems: 140`.

Se `activeItems` for zero, carregue o banco local uma vez:

```powershell
$env:FIREBASE_DATA_CONNECT_EMULATOR_HOST="127.0.0.1:9399"
cd .\backend\render-api
npm run bank:import
cd ..\..
Remove-Item Env:FIREBASE_DATA_CONNECT_EMULATOR_HOST
```

## Ordem sugerida para demonstrar

1. Landing page, identidade visual e responsividade.
2. Login Google e perfil do estudante.
3. Página Início, progresso e navegação recolhível.
4. Trilha e uma atividade já validada.
5. CapiMentor com uma pergunta curta, por exemplo: `O que é IPI?`.
6. Ranking e perfil.
7. Área do professor, período e dados agregados.
8. Capi Analista com uma pergunta coerente com o período selecionado.

Faça login e uma pergunta para cada assistente pelo menos 30 minutos antes da
apresentação. Isso confirma autenticação, internet, chave, cota e modelo sem
depender da primeira execução diante da banca.

## Se o Gemini local falhar

1. Confira se o Terminal 2 continua aberto.
2. Procure no Terminal 2 por `student_mentor_unavailable` ou
   `teacher_analyst_unavailable`.
3. Confirme somente os nomes, nunca os valores, em
   `backend/render-api/.env.local`:

   ```dotenv
   GEMINI_API_KEY=...
   GEMINI_MODEL=gemini-3.6-flash
   ```

4. Depois de alterar o arquivo, encerre o Terminal 2 com `Ctrl+C` e execute o
   script novamente.
5. Se aparecer erro `429`, aguarde e evite perguntas repetidas: a cota é por
   projeto. Se aparecer `400`, `401` ou `403`, revise chave, tipo da chave,
   modelo e restrições em vez de insistir em novas tentativas.

O CapiMentor possui resposta pedagógica de contingência para alguns temas. Ao
apresentar, diferencie claramente uma resposta do Gemini de uma resposta de
contingência.

## Diagnóstico do Gemini hospedado no Render

A API publicada em `https://money-rank-wb1h.onrender.com` foi verificada no
commit `a23bb15`. O endpoint `/readyz` confirmou banco, 140 itens e uma variável
`GEMINI_API_KEY` não vazia. Isso não valida a chave junto ao Google.

No serviço da API no Render:

1. Abra **Environment**.
2. Edite `GEMINI_API_KEY` manualmente e cole a mesma chave Auth que funciona
   no arquivo local, sem aspas e sem espaços antes ou depois.
3. Confirme `GEMINI_MODEL=gemini-3.6-flash`.
4. Escolha **Save, rebuild and deploy**.
5. Aguarde o novo deploy ficar ativo.
6. Abra **Logs** e deixe a tela acompanhando.
7. Faça uma única pergunta no CapiMentor hospedado.
8. Pesquise nos logs pelo código de diagnóstico exibido na interface ou pelos
   eventos `student_mentor_unavailable`, `student_mentor_success` e
   `student_mentor_fallback`.
9. Na área do professor, atualize o Diagnóstico administrativo após o teste. O
   campo `reason` separa falha de chave/modelo, cota e ausência de fontes.

O segredo está declarado com `sync: false` no `render.yaml`. Em um serviço já
existente, sincronizar o Blueprint não troca esse valor; a edição precisa ser
feita no painel do serviço.

Em setembro de 2026, chaves Standard antigas deixaram de ser aceitas pela API
Gemini. No Google AI Studio, confira a coluna **Key Type**. Se a chave for
Standard ou estiver bloqueada, crie uma chave Auth nova, teste-a localmente e
depois atualize manualmente o segredo no Render.

Se a chave tiver restrição por IP, confira os intervalos de saída em
**Render service > Connect > Outbound** e autorize todos os intervalos da
região. Prefira uma chave Auth dedicada ao backend e restrita à Gemini API.

## Plano de contingência para a apresentação

- Mostre primeiro que o sistema hospedado está publicado e que `/readyz`
  confirma API e banco.
- Para a demonstração funcional completa, use os três terminais locais.
- Explique que o ambiente local e o hospedado usam a mesma arquitetura; muda
  apenas a origem dos serviços e o controle de App Check/segredos.
- Não altere chave, branch ou banco minutos antes da apresentação se o ambiente
  local já tiver sido validado.
- Tenha capturas de uma resposta bem-sucedida dos dois assistentes como apoio,
  mas demonstre ao vivo somente depois do teste prévio.

## Encerramento

Ao terminar, use `Ctrl+C` nos terminais na ordem inversa:

1. frontend;
2. API;
3. Capi Bank.

Não apague `.env.local`. Ele é ignorado pelo Git e será reutilizado na próxima
execução.
