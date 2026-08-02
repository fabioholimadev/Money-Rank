# 🏆 Money Rank

> Formando a próxima geração de jovens financeiramente livres.

> Para retomar o desenvolvimento em outro Codex ou com outro desenvolvedor,
> comece por [`docs/CONTEXTO_GERAL_PROJETO.md`](docs/CONTEXTO_GERAL_PROJETO.md).
> O indice tecnico, o historico e o planejamento dos cinco Epicos ficam em
> [`docs/README.md`](docs/README.md).

O **Money Rank** é uma plataforma educacional gamificada (estilo Duolingo) focada em ensinar Educação Financeira e Fiscal para a Geração Z. O projeto visa combater a "ilusão fiscal" brasileira, ensinando de forma prática e visual como os impostos sobre o consumo (ICMS, IBS, CBS) impactam o dia a dia e financiam serviços essenciais como o SUS e a educação.

## 🎯 O Problema que Resolvemos
* **46,7%** dos jovens de 15 anos no Brasil estão no nível mais básico de letramento financeiro mundial (PISA 2022).
* **74%** dos brasileiros não sabem o quanto pagam de impostos embutidos nas compras diárias.
* **90%** dos estudantes desconhecem o conceito de sonegação fiscal e o impacto disso nos serviços públicos.

## ✨ Funcionalidades (Features)
* **Trilhas Pedagógicas:** Aprenda sobre tributos e controle de gastos em missões curtas e interativas.
* **Sistema de Recompensas:** Ganhe moedas (XP) ao desvendar impostos ocultos em cupons fiscais.
* **Impacto Social Visível:** Mecânica que mostra o dinheiro dos impostos virtuais sendo convertido em infraestrutura de saúde e educação.
* **Autenticação Segura:** Acesso exclusivo com conta Google pelo Firebase Auth.

## 🚀 Tecnologias Utilizadas

**Front-end:**
* React (Vite)
* Tailwind CSS
* React Router DOM
* Firebase Authentication

**Back-end & Banco de Dados:**
* Node.js com Express
* Firebase SQL Connect (PostgreSQL, em migração)
* CORS & Dotenv

## 🔐 Configuração do Firebase Auth

O aplicativo Web `Money Rank Web` está registrado no projeto Firebase
`money-rank`. Para executar o login localmente:

1. Acesse o [Firebase Console do projeto Money Rank](https://console.firebase.google.com/project/money-rank/authentication/providers).
2. Abra **Authentication > Sign-in method**.
3. Ative o provedor **Google**.
4. Selecione o e-mail de suporte do projeto e salve.
5. Em **Authentication > Settings > Authorized domains**, confirme que
   `localhost` está autorizado.
6. No terminal, execute:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

O frontend usa a API modular do Firebase e observa a sessão pelo
`onAuthStateChanged`. Nenhuma senha do Google é recebida ou armazenada pelo
Money Rank.

### Teste local do login

1. Acesse `http://localhost:5173/login`.
2. Clique em **Continuar com o Google** e selecione uma conta.
3. Confirme o redirecionamento para `/completar-perfil` no primeiro acesso ou
   para `/student` quando o perfil já estiver completo.
4. Recarregue a página e confirme que a sessão continua ativa.
5. Clique em **Sair** e confirme o retorno para `/login`.
6. Sem uma sessão ativa, acesse `/student` diretamente e confirme o
   redirecionamento para `/login`.

## 👤 Fluxo de completar perfil

Depois do primeiro login com Google, o aluno é direcionado automaticamente para
`/completar-perfil`. Para liberar as áreas do jogo, ele deve:

1. Confirmar ou alterar o nome preferido.
2. Selecionar **3º DSA** ou **3º DSB** na caixa de turma.
3. Escolher uma Capi profissional ou enviar uma foto JPG, PNG ou WebP de até
   5 MB.
4. Clicar em **Concluir e começar**.

O nome preferido também é atualizado no perfil básico do Firebase Auth. Durante
a migração, turma, avatar, foto e estado de conclusão ficam no armazenamento
local, separados pelo `uid` do Firebase. A foto enviada é recortada, reduzida
para 320 × 320 pixels e convertida para JPEG antes de ser salva no navegador.
Esses campos serão migrados para o PostgreSQL e para o armazenamento definitivo
nas Tasks 2.1 e 2.2 do Firebase SQL Connect.

### Teste local do perfil

1. Entre com uma conta Google que ainda não tenha perfil local.
2. Confirme o redirecionamento de `/student` para `/completar-perfil`.
3. Tente enviar o formulário vazio e confirme as mensagens de validação.
4. Preencha o nome, selecione **3º DSA** e escolha uma Capi profissional.
5. Confirme o redirecionamento para `/student` e a Capi no dashboard.
6. Recarregue a página e confirme que o perfil continua completo.
7. Acesse `/perfil`, troque a turma para **3º DSB** e envie uma foto válida.
8. Confirme a prévia quadrada da foto, salve e recarregue a página.
9. Tente enviar um arquivo que não seja imagem ou uma imagem acima de 5 MB e
   confirme que o formulário exibe a validação sem perder o perfil atual.

## 🗄️ Firebase SQL Connect

O backend relacional fica em `dataconnect/` e usa PostgreSQL por meio do
Firebase SQL Connect:

- `schema/schema.gql`: tabelas, enums, chaves, relações e índices.
- `connector/queries.gql`: leituras autorizadas do próprio aluno.
- `connector/mutations.gql`: perfil do aluno e operações administrativas.
- `dataconnect.yaml`: serviço `money-rank-service` em
  `southamerica-east1`.

### Modelo inicial

- `User`: perfil vinculado diretamente ao `uid` do Firebase Auth, turma,
  papel, saldo de CapiCoins e fase atual.
- `StudentProgress`: progresso consolidado por aluno e fase, com chave
  composta para impedir registros duplicados.
- `CapiCoinTransaction`: livro-caixa de créditos e débitos. O saldo rápido
  permanece em `User.capiCoins`, mas toda alteração gera um lançamento
  auditável na mesma transação.

As turmas são enums fechados: `THIRD_DSA` representa **3º DSA** e `THIRD_DSB`
representa **3º DSB**. A conversão para os rótulos da interface será feita na
integração do SDK.

### Segurança das operações

- Consultas de perfil, progresso e histórico exigem e-mail verificado e usam
  `auth.uid` no servidor. O frontend nunca envia um `uid` para ler outro aluno.
- O aluno pode completar apenas o próprio perfil.
- Pontuação e CapiCoins usam `@auth(level: NO_ACCESS)`: somente um backend com
  Firebase Admin poderá executá-las. Isso impede premiação pelo navegador.

### Teste local do esquema

O teste usa o projeto isolado `demo-money-rank`, o PostgreSQL PGlite local e
não cria recursos no Google Cloud:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
```

O resultado esperado é:

```text
SQL Connect validado: esquema, relacoes e operacoes carregados.
```

No Windows, a CLI pode exibir um aviso `ECONNRESET` ao desligar o processo
PGlite. O script só considera o teste aprovado quando o comando termina com
código zero e o log confirma que o serviço foi configurado sem erros de
compilação.

O deploy não faz parte do teste local. Antes de executar
`firebase deploy --only dataconnect`, é necessário ativar a API SQL Connect,
confirmar o plano de faturamento e revisar a criação do Cloud SQL
`money-rank-sql`.

### SDK Web gerado

O conector gera um SDK JavaScript tipado em
`frontend/src/lib/dataconnect-sdk`. O frontend instala esse diretório como uma
dependência local chamada `@money-rank/dataconnect`, evitando operações
GraphQL escritas manualmente nos componentes React.

A integração está separada em três camadas:

- `dataConnectClient.js`: inicializa o cliente e conecta o emulador quando
  solicitado.
- `profileDataMapper.js`: converte `3º DSA`, `3º DSB` e as Capis para os enums
  relacionais.
- `studentDataService.js`: executa perfil, progresso e histórico usando apenas
  as operações autorizadas do SDK.

O `AuthContext` usa o PostgreSQL como fonte do perfil quando o SQL Connect está
ativado. Se ele estiver desativado ou indisponível durante a leitura, o perfil
local continua funcionando como contingência. Uma falha durante a gravação é
informada ao aluno para evitar que a interface confirme dados que não chegaram
ao banco.

Fotos enviadas pelo aluno ainda são URLs `data:image` locais e não são gravadas
no PostgreSQL. Nome, turma e conclusão do perfil são sincronizados; o arquivo
continuará no navegador até a implementação do Firebase Storage.

#### Variáveis do frontend

Copie `frontend/.env.example` para `frontend/.env.local` somente quando quiser
ativar o SQL Connect:

```dotenv
VITE_DATA_CONNECT_ENABLED=false
VITE_USE_DATA_CONNECT_EMULATOR=true
VITE_DATA_CONNECT_EMULATOR_HOST=127.0.0.1
VITE_DATA_CONNECT_EMULATOR_PORT=9399
```

`VITE_DATA_CONNECT_ENABLED` deve permanecer `false` enquanto o serviço de
produção não estiver implantado. No modo de desenvolvimento,
`VITE_USE_DATA_CONNECT_EMULATOR=true` já ativa o cliente local.

Sempre que um arquivo `.gql` for alterado, valide o conector para regenerar o
SDK e reinstale a dependência local:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-dataconnect.ps1
cd frontend
npm install ./src/lib/dataconnect-sdk
```

Os mapeamentos entre a interface e os enums relacionais podem ser verificados
separadamente:

```powershell
cd frontend
npm run test:dataconnect-mappers
```

## 🚧 Bloqueio de deploy público

Antes de publicar o Money Rank para alunos e professores, revise e conclua o
arquivo [`docs/deploy/checklist-producao.md`](docs/deploy/checklist-producao.md).
Ele registra as pendências de App Check com reCAPTCHA Enterprise, proteção
contra repetição, custos da IA, aprovação pedagógica, SQL Connect de produção e
testes do ambiente final. O modo debug do App Check nunca deve ser publicado.

## 🧠 Atividades do Épico 3

A documentação pedagógica e técnica das atividades fica em `docs/epic-3`.
O estudo de caso **O Custo do Vício** possui três personagens, cinco decisões
sem alternativa errada e repetição competitiva registrada pelo SQL Connect.
Consulte [`docs/epic-3/custo-vicio-estudo-caso.md`](docs/epic-3/custo-vicio-estudo-caso.md).

**A Ilusão do Dinheiro** usa seis decisões ramificadas, caixa narrativo e
quatro finais sem misturar valores simulados com a carteira competitiva.
Consulte [`docs/epic-3/ilusao-dinheiro-caminhos.md`](docs/epic-3/ilusao-dinheiro-caminhos.md).
