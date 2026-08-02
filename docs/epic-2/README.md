# Épico 2 - Banco de dados com Firebase SQL Connect

## Objetivo

Estabelecer o Capi Bank, camada relacional do Money Rank baseada em Firebase
SQL Connect/PostgreSQL, e integrar o SDK tipado ao frontend React.

## Estado

| Task | Resultado | Commit |
| --- | --- | --- |
| 2.1 | Schema relacional e operações GraphQL iniciais | `d792b4a` |
| 2.2 | SDK Web gerado, mapeadores e integração React | `5baccde` |

O schema cresceu durante o Épico 3 para registrar tentativas, economia,
streaks e livro-caixa. Essas extensoes fazem parte da evolucao do Capi Bank.

## Modelo atual

Entidades principais:

- `User`: perfil, turma, papel, saldo, fase e streak;
- `StudentProgress`: progresso e melhor resultado por fase;
- `ActivityAttempt`: auditoria de cada tentativa;
- `CapiCoinTransaction`: livro-caixa e pontuação semanal;
- `EconomyConfig`: valores e multiplicadores definidos pelo servidor.

As operações ficam em:

- `dataconnect/schema/schema.gql`;
- `dataconnect/connector/queries.gql`;
- `dataconnect/connector/mutations.gql`;
- `dataconnect/connector/connector.yaml`.

## Integracao frontend

- `frontend/src/lib/dataConnectClient.js` configura o conector;
- `frontend/src/services/studentDataService.js` traduz os dados para a UI;
- `frontend/src/lib/dataconnect-sdk/` e gerado automaticamente;
- `scripts/test-data-connect-mappers.mjs` protege os mapeamentos.

O SDK gerado não deve ser editado manualmente. No Windows, ele pode aparecer
como modificado apenas por LF/CRLF. Antes de inclui-lo num commit, execute:

```powershell
git diff --quiet -- frontend/src/lib/dataconnect-sdk
$LASTEXITCODE
```

Saída `0` significa que não existe diferença real.

## Execução e teste local

```powershell
npx -y firebase-tools@latest emulators:start --only dataconnect
```

Em outro terminal:

```powershell
cd frontend
npm run test:dataconnect-mappers
npm run lint
npm run build
```

O encerramento do emulador ja apresentou `ECONNRESET` depois de carregar
schema e operações corretamente. O erro so pode ser tratado como ruido de
shutdown quando os testes e logs anteriores confirmarem a inicialização.

## Pendências relacionadas

- criar consultas autorizadas dos rankings individual e por turma;
- validar concorrência, índices e custos com cerca de 100 alunos;
- definir backup, observabilidade e estratégia de migração de dados;
- remover dependências Supabase somente depois da equivalência funcional.

## Registro de mudanças

Toda mudança em schema, query, mutation, autorização ou SDK deve ser registrada
aqui, junto dos testes de emulador e do commit correspondente.
