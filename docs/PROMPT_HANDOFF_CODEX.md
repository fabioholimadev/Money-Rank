# Prompt de continuidade para outro Codex

Copie o bloco abaixo para um novo Codex e anexe ou indique este repositório.

---

Você assumirá o desenvolvimento do **Money Rank v2.0** como engenheiro de
software sênior. Trabalhe no repositório canônico
`C:\Documentos\Programação\Money Rank` e mantenha a sequência, as regras de
segurança e o ciclo de versionamento abaixo.

## Leitura obrigatória antes de alterar código

1. Leia integralmente `docs/CONTEXTO_GERAL_PROJETO.md`.
2. Leia `docs/README.md`, `docs/roadmap-mvp.md` e o README do Épico em trabalho.
3. Para o próximo trabalho, leia também:
   - `docs/epic-4/roteiro-testes-capi-mentor.md`;
   - `docs/epic-5/README.md`;
   - `docs/epic-5/estudio-professor.md`;
   - `docs/deploy/checklist-producao.md`.
4. Execute `git status --short --branch`, `git log -10 --oneline` e confirme o
   remoto antes de editar.

## Estado atual

- Branch-base: `feat/mvp-gamificacao-ia`.
- O Épico 3 está concluído.
- Tasks 5.1, 5.2 e 5.3 estão implementadas: acesso por papel, painel analítico e
  Chat de Dados.
- O Épico 4 foi migrado para Firebase no commit `616394e`: o CapiMentor usa
  callable autenticada, contexto mínimo do SQL Connect, Gemini com Google
  Search, fontes, fallback seguro e avatar próprio.
- A chave Gemini real foi configurada pelo usuário exclusivamente em
  `functions/.secret.local`. Nunca leia seu valor para a resposta, nunca o
  versione e nunca o copie para documentação ou logs.
- A validação automática do Épico 4 passou: 14 testes de Functions, lints e
  build. Ainda é necessário confirmar manualmente o modo online e as fontes.

## Primeira ação obrigatória

Antes de alterar a Task 5.4, confira com o usuário o resultado do roteiro
`docs/epic-4/roteiro-testes-capi-mentor.md`. Se o Gemini real, as fontes ou a
interface falharem, diagnostique e corrija o Épico 4 em uma branch específica.
Se tudo passar, atualize o README do Épico 4 e o contexto geral, registrando a
validação sem copiar respostas com dados pessoais ou qualquer credencial.

## Próxima execução

Implemente primeiro a **Task 5.4 — Estúdio do Professor**, conforme
`docs/epic-5/estudio-professor.md`:

- conteúdos e atividades devem ter versões `DRAFT`, `IN_REVIEW`, `PUBLISHED`
  e `ARCHIVED`;
- o professor edita vídeo, slides, resumo/documento, bases, personagens,
  decisões e pesquisas numa interface estruturada;
- o aluno consome somente a versão publicada;
- toda publicação deve ter autoria, data, versão e resumo da alteração;
- fontes pesquisadas por Codex/Gemini entram como rascunho e exigem aprovação
  do professor;
- não use editor JSON genérico para dados que geram recompensa;
- arquivos binários ficam no Firebase Storage; o SQL guarda metadados e URL.

Depois, implemente a **Task 5.5 — Administração de períodos**, permitindo
agendar, ativar, pausar, retomar e encerrar competições com auditoria. Um novo
período zera o ranking da disputa por recorte, sem apagar o livro-caixa. Ajustes
de moedas devem ser transações compensatórias, nunca exclusões silenciosas.

## Fluxo obrigatório de cada Task

1. Explicar brevemente objetivo, suposições e restrições.
2. Criar branch específica a partir da branch-base atualizada.
3. Implementar código completo, componentizado e seguro.
4. Atualizar `docs/CONTEXTO_GERAL_PROJETO.md` e a documentação do Épico.
5. Executar testes proporcionais ao risco, incluindo lint, build e
   `dataconnect:compile` quando o schema/operações mudarem.
6. Entregar roteiro de teste manual ao usuário.
7. Somente após autorização, criar commit semântico e integrar por fast-forward.
8. Não fazer deploy, limpar dados ou alterar produção sem autorização
   explícita.

## Restrições importantes

- Preserve qualquer alteração do usuário em `vite.config.js`.
- Alguns arquivos gerados em `frontend/src/lib/dataconnect-sdk` podem aparecer
  modificados apenas por final de linha; não os inclua sem diff real.
- Não reintroduza Supabase nem o backend Express legado.
- Na interface, use o nome **Capi Bank**, nunca SQL Connect/PostgreSQL.
- Login de aluno e professor é exclusivamente Google; papéis são validados no
  backend, não apenas na rota React.
- App Check com reCAPTCHA Enterprise é obrigatório no deploy. O token debug é
  apenas local.
- Confirme o nome do modelo na lista atual do Firebase AI Logic antes de
  homologação ou deploy; não confie em nomes antigos documentados localmente.
- O modelo atende 3º DSA e 3º DSB.
- Não exponha gabaritos, prompts internos, UID ou dados pessoais ao Gemini.

## Depois das funcionalidades

Siga esta ordem:

1. configurar Firebase Hosting e ambiente de homologação;
2. validar App Check, domínios, Secret Manager, Functions e SQL Connect;
3. executar teste de carga para 100 alunos durante o cenário de sete dias;
4. fazer backup e limpeza pré-piloto somente com autorização;
5. realizar o redesign global de Landing, Home, trilha, atividades, ranking,
   perfil e professor, padronizando cores, tipografia e espaçamentos.

Antes de começar a Task 5.4, apresente um relatório curto do estado encontrado,
dos riscos e dos arquivos que pretende alterar. Não suponha que um documento
substitui a inspeção do código e do Git.

---
