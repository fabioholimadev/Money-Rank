# Frontend do Money Rank

Aplicação web do Money Rank v2.0, construida com Vite, React e Tailwind CSS.
Este diretorio concentra a experiencia do aluno, autenticação Google, trilhas,
atividades, progressão e integração com o Firebase SQL Connect.

O panorama completo do projeto e o estado de cada Epic estao em
[`../docs/README.md`](../docs/README.md). Para transferir o desenvolvimento a
outro agente ou desenvolvedor, consulte
[`../docs/CONTEXTO_GERAL_PROJETO.md`](../docs/CONTEXTO_GERAL_PROJETO.md).

## Requisitos

- Node.js compativel com o Vite 8;
- dependências instaladas com `npm install`;
- variaveis locais configuradas em `.env.local` ou
  `.env.development.local`, nunca versionadas;
- projeto Firebase e emuladores configurados quando o fluxo exigir dados.

## Execução local

```powershell
cd frontend
npm install
npm run dev
```

O Vite informa a URL local no terminal, normalmente
`http://localhost:5173`.

## Verificações

```powershell
npm run lint
npm run build
npm run test:competitive-economy
npm run test:content-materials
npm run test:custo-vicio
npm run test:dataconnect-mappers
npm run test:ilusao-dinheiro
npm run test:perigo-doce-ai
npm run test:trail-progress
```

## Organização principal

- `src/components/`: componentes reutilizaveis e elementos da trilha;
- `src/contexts/`: sessão e estado compartilhado;
- `src/data/`: bases pedagogicas e configurações das atividades;
- `src/lib/`: regras de negocio e adaptadores de infraestrutura;
- `src/pages/`: telas e rotas;
- `src/services/`: comunicacao com IA e dados do aluno;
- `src/lib/dataconnect-sdk/`: SDK gerado; não editar manualmente;
- `public/avatars/`: Capivaras profissionais usadas no perfil.

## Cuidados

- A interface deve usar o termo **Capi Bank**, nunca expor SQL Connect,
  PostgreSQL, GraphQL ou nomes internos ao aluno.
- Não registrar chaves, tokens, fotos enviadas ou dados pessoais no Git.
- O cliente não pode escolher o valor de recompensas; a economia deve ser
  aplicada no banco.
- O backend Supabase ainda e legado de transição e não deve ser removido sem
  concluir a migração do ranking e do CapiMentor.
