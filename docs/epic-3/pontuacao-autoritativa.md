# Task 3.10 — Pontuação autoritativa

## Objetivo

Retirar do navegador a autoridade para aprovar atividades, calcular a nota e
definir CapiCoins. A interface envia somente os identificadores das escolhas;
uma Cloud Function autenticada recupera o gabarito privado, recalcula o
resultado e solicita ao Capi Bank a gravação atômica.

## Fluxo implementado

```text
aluno autenticado
  -> solicita uma sessão de atividade
  -> Cloud Function prepara payload público + gabarito privado
  -> Capi Bank guarda a sessão por 45 minutos
  -> navegador renderiza o payload público e envia somente IDs
  -> Cloud Function valida propriedade, prazo e respostas
  -> motor autoritativo calcula nota e aprovação
  -> mutação NO_ACCESS grava tentativa, progresso e recompensa
  -> a sessão é encerrada e o resultado confirmado volta ao aluno
```

As callables `startActivitySession` e `submitActivitySession` ficam em
`southamerica-east1`, a mesma região do Data Connect. Elas exigem Firebase
Auth com e-mail verificado. Fora do Functions Emulator, App Check e proteção
contra reutilização de token são ativados automaticamente.

## Contrato de segurança

- sessão identificada por UUID e vinculada ao UID autenticado;
- validade de 45 minutos;
- gabarito armazenado somente em `ActivitySession.answerKey`;
- operações que leem gabarito ou concedem recompensa usam
  `@auth(level: NO_ACCESS)` e só podem ser chamadas pelo Admin SDK;
- `ActivityAttempt.activitySessionId` é único;
- o ID da tentativa é o próprio ID da sessão;
- reenvios recuperam o resultado existente e não pagam novamente;
- sessão de outro aluno devolve `not-found` antes de revelar qualquer dado;
- resultado somente encerra a sessão depois de a tentativa ser encontrada no
  banco;
- valores extras enviados pelo cliente, como `points: 999`, são ignorados.

## Mecânicas cobertas

### Fase 1 — O Perigo Doce

As cinco questões são preparadas no backend. Quando o segredo do Gemini está
disponível, a IA recebe a base de conhecimento versionada e devolve JSON
estruturado. Se a IA falhar, o backend monta um fallback determinístico. O
campos `correctOptionId`, explicação e fontes internas nunca integram o
payload público.

### Fase 2 — O Custo do Vício

O backend recebe o personagem escolhido e guarda os valores canônicos das
cinco decisões. O navegador envia somente `decisionId` e `optionId`.

### Fase 3 — A Ilusão do Dinheiro

As seis escolhas são avaliadas com os valores canônicos do manifesto. O saldo
da história continua sendo feedback narrativo; somente o resultado do backend
pode alterar a carteira real.

### Fase 4 — A Engenharia do Desejo

O backend seleciona três publicidades reais e três peças inventadas. O
navegador recebe os IDs selecionados e envia cada classificação; o gabarito
da rodada permanece na sessão privada.

## Fontes canônicas e versões

O script abaixo converte os bancos editoriais do frontend em um manifesto
compacto usado pelas Functions:

```powershell
node .\scripts\build-authoritative-activity-manifest.mjs
```

O resultado versionado fica em
`functions/src/generated/activity-manifest.json`. Sempre que uma atividade ou
fonte pedagógica mudar, o manifesto deve ser regenerado e revisado no mesmo
commit. A pontuação autoritativa não substitui a validação do professor.

## Ambiente local

Instalar as dependências uma vez:

```powershell
cd "C:\Documentos\Programação\Money Rank\functions"
npm install
```

Iniciar Data Connect e Functions juntos na raiz:

```powershell
cd "C:\Documentos\Programação\Money Rank"
npx -y firebase-tools@latest emulators:start --only dataconnect,functions
```

No frontend, manter `VITE_USE_FUNCTIONS_EMULATOR=true` e iniciar o Vite em
outro terminal. Sem `GEMINI_API_KEY`, a Fase 1 usa o fallback seguro do
servidor, permitindo testar o fluxo sem segredo local.

O projeto ativo deve permanecer `money-rank`, pois o frontend usa tokens do
Firebase Auth real desse projeto. `demo-money-rank` serve para testes isolados
sem login, mas não para este roteiro integrado.

## Testes automatizados

```powershell
cd functions
npm test
npm run lint

cd ..\frontend
npm run lint
npm run build
```

A suíte do backend verifica proteção do gabarito, rejeição de respostas
duplicadas e que pontuações falsas enviadas pelo cliente não alteram Custo do
Vício, Ilusão do Dinheiro ou Engenharia do Desejo.

## Produção

Antes do deploy:

1. criar o segredo `GEMINI_API_KEY` no Secret Manager;
2. confirmar o modelo suportado em `GEMINI_MODEL`;
3. registrar reCAPTCHA Enterprise no App Check;
4. implantar Data Connect antes das Functions;
5. testar Auth, App Check, replay, expiração e reenvio idempotente;
6. executar o teste de capacidade para 100 alunos.

O `npm audit` das dependências atuais aponta sete vulnerabilidades moderadas
transitivas na cadeia oficial do Firebase. Não foi aplicado `--force`, pois a
correção proposta altera versões de forma incompatível. Reavaliar antes do
deploy com versões oficiais atualizadas.

## Limitações conhecidas

- o frontend ainda contém parte dos bancos editoriais necessários para
  narrativas e feedback; a autoridade financeira, porém, está no servidor;
- o teste manual integrado depende de uma conta Google e dos dois emuladores;
- o bundle principal do frontend ainda precisa de code splitting;
- nenhum deploy ou carga real foi executado nesta Task.
