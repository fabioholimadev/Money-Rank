# Arquitetura de deploy no Firebase

## Decisao

O Firebase suporta o frontend e o backend atuais do Money Rank. O alvo do MVP
fica organizado assim:

| Camada | Servico | Origem no repositorio |
| --- | --- | --- |
| SPA React/Vite | Firebase Hosting (Classic) | `frontend/dist` |
| Backend confiavel | Cloud Functions for Firebase v2, Node.js 22 | `functions/` |
| Banco relacional | Firebase SQL Connect + Cloud SQL PostgreSQL | `dataconnect/` |
| Login Google | Firebase Authentication | `frontend/src/lib/firebaseConfig.js` |
| Materiais editoriais | Cloud Storage for Firebase | `storage.rules` e Functions |
| Protecao contra abuso | Firebase App Check + reCAPTCHA Enterprise | frontend e callables |
| Segredos | Google Secret Manager por parametros das Functions | `GEMINI_API_KEY` |

Firebase **App Hosting** nao e necessario: o frontend e uma SPA estatica, sem
SSR. O Hosting Classic e mais simples, possui CDN/HTTPS, canais temporarios de
preview e aceita o rewrite de todas as rotas React para `index.html`.

## Estado auditado em 5 de agosto de 2026

- projeto Firebase ativo: `money-rank`;
- aplicativo Web ativo: `Money Rank Web`;
- site Hosting padrao reservado: `https://money-rank.web.app`;
- nenhum servico SQL Connect esta implantado no projeto;
- o repositorio ja possui schema, conectores, Functions, Auth, App Check e
  regras de Storage;
- o `firebase.json` agora publica `frontend/dist`, recompila antes do deploy e
  atende rotas profundas da SPA;
- Node.js local 24.15.0 e Firebase CLI 15.25.1 foram validados;
- a sessao local da CLI esta autenticada e o alias ativo aponta para
  `money-rank`;
- o MCP do Firebase nao esta exposto neste ambiente Codex; as verificacoes
  remotas desta etapa usam somente a CLI oficial e comandos de leitura.

Validacoes locais desta etapa:

- lint e build do frontend aprovados;
- lint e 46 testes das Functions aprovados;
- SQL Connect compilado e SDK regenerado sem diferenca no Git;
- dry-run oficial do Hosting aprovado, incluindo o predeploy de build;
- raiz e rota profunda `/login` retornaram a mesma SPA no emulador Hosting.

O projeto remoto ainda nao deve ser tratado como producao pronta. Criar o
Cloud SQL, ativar cobranca, gravar segredos e publicar recursos sao alteracoes
remotas e exigem confirmacao explicita.

## Bloqueadores atuais

1. decidir se `money-rank` sera producao ou homologacao;
2. confirmar/vincular Blaze e criar orcamentos antes de Functions, Storage e
   Cloud SQL;
3. criar `frontend/.env.production.local` com a chave publica do App Check;
4. revisar e justificar no schema os alertas do compilador para
   `GetEconomyConfig` e `ListVisibleCompetitionPeriods`: hoje qualquer usuario
   autenticado pode consultar esses dois conjuntos globais;
5. registrar dominios do Hosting no Google Auth e no reCAPTCHA Enterprise;
6. criar o servico SQL Connect, pois a consulta remota retornou lista vazia;
7. confirmar a API/primeiro deploy das Functions, que ainda nao puderam ser
   listadas no projeto remoto;
8. reduzir o bundle principal de aproximadamente 837 kB com divisao de codigo.

O tamanho do bundle e uma pendencia de desempenho, nao um impedimento tecnico
para o primeiro preview restrito. Os itens de ambiente, cobranca, App Check e
banco sao bloqueantes para um teste online funcional.

## Ambientes

Recomendacao:

1. `demo-money-rank`: emuladores locais, descartavel e sem recursos reais;
2. um projeto Firebase separado de homologacao: contas, banco e arquivos de
   teste isolados;
3. `money-rank`: producao, sem dados de desenvolvimento.

Um canal de preview do Hosting isola somente o frontend. Ele ainda aponta para
o backend definido no build; portanto, nao substitui um projeto de homologacao
quando os testes alteram Auth, PostgreSQL ou Storage.

Antes de criar o segundo projeto, deve ser decidido se `money-rank` sera a
producao definitiva ou a homologacao inicial. Nao altere `.firebaserc` nem
provisione recursos antes dessa decisao.

## Faturamento e limites

- Cloud Functions e Cloud Storage exigem o plano Blaze para deploy/uso atual.
- SQL Connect cobra separadamente as operacoes do servico e a instancia Cloud
  SQL PostgreSQL. A instancia e o principal custo fixo da arquitetura.
- Hosting possui cota gratuita e cobra armazenamento/transferencia excedentes.
- Orcamentos do Google Cloud enviam alertas, mas nao interrompem gastos.
- A regiao `southamerica-east1` reduz distancia para os usuarios brasileiros,
  mas o preco real do Cloud SQL deve ser estimado nela antes da criacao.

Antes do primeiro recurso pago:

1. vincular a conta de faturamento escolhida;
2. configurar alertas em 50%, 80%, 100% e um valor absoluto aprovado;
3. escolher a menor instancia Cloud SQL adequada para homologacao;
4. registrar responsavel pelos alertas e pelo desligamento emergencial;
5. medir custo e latencia no teste de carga antes de abrir para turmas.

## Variaveis e segredos

O template versionado e `frontend/.env.production.example`. O arquivo efetivo
deve ser `frontend/.env.production.local`, que e ignorado pelo Git.

Regras:

- `VITE_DATA_CONNECT_ENABLED=true` somente depois do SQL Connect implantado;
- `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` e publica, mas precisa corresponder ao
  dominio do ambiente;
- App Check debug deve permanecer desligado e sem token em qualquer build
  online;
- `GEMINI_API_KEY` deve ser criada no Secret Manager pelas Functions e nunca
  usar prefixo `VITE_`;
- nao usar `backend/.env`: `backend/` e a implementacao Express/Supabase legada.

## Ordem do primeiro deploy

Cada etapa deve terminar com smoke test antes da proxima:

1. **Projeto e custos**: confirmar ambiente, Blaze, orcamento, APIs e regioes.
2. **Auth e App Check**: Google habilitado, dominios autorizados, chave
   reCAPTCHA Enterprise registrada; monitorar tokens antes de enforcement.
3. **SQL Connect**: compilar, revisar diff/migracao e implantar schema e
   conectores.
4. **Seed controlado**: criar configuracao economica, professor autorizado e
   conteudo inicial; nunca importar contas/tentativas locais.
5. **Storage**: criar o bucket correto e implantar `storage.rules`.
6. **Segredos e Functions**: registrar `GEMINI_API_KEY`, confirmar parametros e
   implantar callables na regiao `southamerica-east1`.
7. **Build de homologacao**: criar `.env.production.local`, compilar e procurar
   localhost, Supabase, segredos e token debug no artefato.
8. **Hosting preview**: publicar um canal temporario e executar login, aluno,
   professor, atividades, ranking, chat, upload e exportacao.
9. **Live**: promover o artefato aprovado, executar smoke test e registrar
   commit, horario e responsavel.

Comandos previstos, sempre a partir da raiz:

```powershell
npx -y firebase-tools@latest dataconnect:compile
npx -y firebase-tools@latest dataconnect:sql:diff
npx -y firebase-tools@latest deploy --only dataconnect
npx -y firebase-tools@latest deploy --only storage
npx -y firebase-tools@latest functions:secrets:set GEMINI_API_KEY
npx -y firebase-tools@latest deploy --only functions
npx -y firebase-tools@latest hosting:channel:deploy homologacao --expires 7d
```

Os comandos de deploy acima sao roteiro, nao autorizacao para executa-los.

## Validacao local por blocos

Executar separadamente evita um processo unico longo e deixa a falha clara:

```powershell
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix functions run lint
npm --prefix functions test
npx -y firebase-tools@latest dataconnect:compile
```

Depois do build, validar o Hosting local:

```powershell
npx -y firebase-tools@latest emulators:start --only hosting
```

Abrir `http://127.0.0.1:5000` e tambem uma rota profunda, como
`http://127.0.0.1:5000/login`, para confirmar o rewrite da SPA.

## Rollback

- Hosting: manter a release anterior e promover/reativar a ultima versao
  aprovada.
- Functions: reimplantar o commit anterior; nao alterar configuracao manual no
  console sem registrar a mudanca.
- SQL Connect: toda migracao exige diff, backup e plano de reversao. Nao usar
  `--force` automaticamente.
- Storage: regras podem ser reimplantadas; arquivos e metadados precisam de
  politica propria de retencao e restauracao.

O registro de cada release deve conter projeto, commit, ambiente, migration
diff, URL, resultado do smoke test e responsavel pela aprovacao.
