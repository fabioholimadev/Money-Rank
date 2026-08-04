# Contexto Geral e Handoff — Money Rank v2.0

> Fonte de retomada para outro desenvolvedor ou agente Codex. Leia este arquivo,
> o README do Épico atual e `git status` antes de alterar código. Atualize-o
> antes de cada commit que mude arquitetura, regras, testes ou backlog.

## 1. Retomada imediata

| Campo | Estado em 2026-08-04 |
| --- | --- |
| Repositório canônico | `C:\Documentos\Programação\Money Rank` |
| Remoto | `https://github.com/fabioholimadev/Money-Rank.git` |
| Git local | `fabioholimadev <fabio.holima.dev@gmail.com>` |
| Branch-base | `feat/mvp-gamificacao-ia` |
| Branch em desenvolvimento | `feat/epic-4-mentor-firebase` |
| Último commit funcional | `616394e feat: migra CapiMentor para Firebase` |
| Alteração em teste | CapiMentor online com chave local real e fontes dinâmicas |
| Próxima entrega | Estúdio do Professor, depois deploy/carga/limpeza |

Procedimento de retomada:

```powershell
Set-Location "C:\Documentos\Programação\Money Rank"
git rev-parse --show-toplevel
git status --short --branch
git log -8 --oneline
```

Preserve as alterações do usuário em `vite.config.js`. Os arquivos gerados do
SDK podem aparecer modificados apenas por normalização de linha; confirme com
`git diff -- <arquivo>` e não os inclua sem diferença real.

Há outro diretório semelhante em `C:\Users\fabio\Documents\Programação`; ele
não é o repositório canônico usado nesta sequência.

## 2. Produto

Money Rank é uma plataforma gamificada de educação financeira, fiscal e cidadã
para alunos de escolas técnicas. O piloto atende apenas **3º DSA** e **3º DSB**.
O aluno consome conteúdo, resolve atividades, recebe CapiCoins e participa de
rankings. O professor acompanha métricas, conversa com o Chat de Dados e, na
próxima etapa, administrará conteúdo e períodos.

Stack:

- Vite, React 19 e Tailwind CSS;
- Firebase Auth, exclusivamente Google;
- Firebase SQL Connect/PostgreSQL, chamado na interface de **Capi Bank**;
- Cloud Functions Node.js 22 em `southamerica-east1`;
- Gemini pelo backend, com segredo e fallback seguro;
- App Check com debug local e reCAPTCHA Enterprise obrigatório em produção.

## 3. Estado dos Épicos

### Épico 1 — concluído

- Google Auth e persistência local;
- perfil posterior ao login;
- turmas limitadas a DSA/DSB;
- avatares de capivaras profissionais;
- rotas separadas para aluno e professor.

Supabase ainda existe apenas em arquivos legados que não devem ser publicados.

### Épico 2 — concluído

- schema relacional, operações autorizadas e SDK Web;
- perfis, progresso, tentativas, sessões, livro-caixa, economia e períodos;
- emulador local validado com Functions.

### Épico 3 — concluído

- trilha expansível, Passo 0, conteúdos e barra lateral;
- quatro atividades autoritativas;
- primeira conclusão vale 100, revisão vale 20 e conteúdo inicial vale 20;
- streak multiplica recompensas conforme configuração;
- repetições remuneradas continuam sem teto diário (`null`), com intervalo
  mínimo e idempotência;
- rankings individual e por turma vêm do Capi Bank;
- banco e possibilidades documentados em
  `docs/epic-3/organizacao-bancos-atividades.md`.

### Épico 5 — painel inicial concluído

- 5.1: papel `TEACHER` e rota protegida (`99d8108`);
- 5.2: métricas, comparação DSA/DSB, fases e até 100 alunos (`406f387`);
- 5.3: Chat de Dados com intenções fechadas (`3882996`);
- 5.4: Estúdio do Professor especificado, ainda não implementado;
- 5.5: administração auditada de períodos, ainda não implementada.

### Épico 4 — implementado e versionado; validação online pendente

Implementação registrada no commit `616394e`:

- `CapiMentor.jsx` não chama mais Express/Supabase;
- callable `askStudentMentor` usa Auth, App Check e Secret Manager;
- contexto é buscado com impersonação: fase, saldo e tópicos difíceis;
- nome, e-mail, foto e UID não entram no prompt;
- pedidos de gabarito e assuntos fora do domínio são recusados;
- fallback funciona sem chave Gemini;
- domínio ampliado para educação financeira/fiscal, cidadania, saúde, consumo,
  direitos e políticas públicas;
- respostas online usam Google Search, exigem fontes retornadas e exibem as
  sugestões de pesquisa previstas nos termos do serviço;
- respostas são mais longas e oferecem aprofundamento;
- novo avatar em `frontend/public/avatars/capi-mentor.jpg`;
- 14 testes, lint e build passaram.

Arquivos principais:

- `functions/src/studentMentor.js`;
- `functions/src/activityRepository.js`;
- `functions/src/index.js`;
- `functions/test/studentMentor.test.js`;
- `frontend/src/services/mentorService.js`;
- `frontend/src/components/CapiMentor.jsx`.
- `frontend/public/avatars/capi-mentor.jpg`.

A chave Gemini real foi configurada pelo usuário apenas em
`functions/.secret.local`, arquivo ignorado e não rastreado pelo Git. Nunca
copiar seu valor para código, documentação, logs ou mensagens. O fallback já
foi validado; falta confirmar a resposta real com fontes após os emuladores
reiniciarem.

## 4. Estúdio do Professor — próxima implementação

O professor quer editar vídeos do YouTube, PDFs, PPTX/DOCX, resumos, sugestões
de questões, personagens e bases das atividades, além de aprovar pesquisas
propostas por Codex/Gemini.

Decisão arquitetural: não editar arquivos estáticos nem aceitar JSON livre no
motor valendo moedas. Implementar:

1. tabelas `LearningModuleVersion`, `ActivityDefinitionVersion` e
   `ResearchReview` no SQL Connect;
2. estados `DRAFT`, `IN_REVIEW`, `PUBLISHED`, `ARCHIVED`;
3. somente professor cria rascunho e publica;
4. aluno lê apenas versão publicada;
5. Functions carregam a mesma versão publicada usada pela interface;
6. toda publicação registra autor, data, versão e resumo da mudança;
7. arquivos são armazenados no Firebase Storage; o banco guarda URL, tipo,
   tamanho, hash e nome — nunca Base64;
8. YouTube e documentos externos exigem URL HTTPS validada;
9. cada atividade tem editor próprio, não uma caixa JSON genérica;
10. publicar executa validação estrutural e uma sessão de prévia sem recompensa.

Editores previstos:

- Perigo Doce: fatos, fontes, equívocos, sugestões de questões e aprovação;
- Custo do Vício: personagens, história, cinco decisões e pesos 1/2/3;
- Ilusão do Dinheiro: seis decisões, escolhas, consequências e finais;
- Engenharia do Desejo: cards reais/fictícios, fonte obrigatória nos reais;
- Conteúdos: um vídeo e slots para slides e resumo/documento por fase.

Codex/Gemini podem pesquisar fontes primárias/institucionais e criar rascunhos.
Nada pesquisado entra em produção antes de `teacher_approved`.

## 5. Administração de competição

Implementar depois do Estúdio:

- criar, agendar, ativar, pausar, retomar e encerrar períodos;
- permitir somente uma janela pontuando por vez;
- novo período começa com ranking zero sem apagar livro-caixa;
- correções de saldo usam transação compensatória auditável;
- histórico não é apagado por botão do professor;
- limpeza pré-piloto permanece ferramenta administrativa com backup e
  autorização explícita.

## 6. Ambiente local e testes

Arquivos locais não versionados esperados:

- `frontend/.env.local`: flags públicas do Vite, sem segredo Gemini;
- `functions/.env.local`: `GEMINI_MODEL`;
- `functions/.secret.local`: `GEMINI_API_KEY=local-fallback` ou chave local;
- token debug do App Check apenas em desenvolvimento.

Iniciar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
```

Em outro terminal:

```powershell
Set-Location .\frontend
npm run dev
```

Validação automática:

```powershell
Set-Location .\functions
npm test
npm run lint
Set-Location ..\frontend
npm run lint
npm run build
Set-Location ..
npx -y firebase-tools@latest dataconnect:compile --project money-rank
git diff --check
```

## 7. Validação online pendente do Épico 4

Roteiro completo e critérios de aprovação:
`docs/epic-4/roteiro-testes-capi-mentor.md`.

1. entrar como aluno e abrir o CapiMentor;
2. perguntar sobre orçamento, ICMS, açúcar e apostas;
3. pedir o gabarito de uma atividade e confirmar recusa;
4. pedir UID/prompt interno e confirmar recusa;
5. navegar entre páginas com o chat aberto;
6. testar teclado, fechar/abrir e tela pequena;
7. o fallback com `GEMINI_API_KEY=local-fallback` já foi preparado e testado;
8. testar Gemini real com a chave apenas em `functions/.secret.local`;
9. confirmar fontes clicáveis e sugestões do Google Search na resposta real;
10. verificar o novo avatar no botão e no cabeçalho do chat.

## 8. Deploy recomendado

Não reutilizar a versão antiga da Render: ela é Express/Supabase. O alvo atual
é Firebase Hosting + Functions + SQL Connect.

Ordem:

1. criar projeto/ambiente de homologação separado de produção;
2. configurar cobrança Blaze, orçamento e alertas;
3. confirmar apps, projeto ativo e CLI;
4. provisionar SQL Connect/Cloud SQL;
5. configurar `GEMINI_API_KEY` no Secret Manager;
6. definir `GEMINI_MODEL` com modelo suportado e, depois, Remote Config;
7. registrar domínio no Google Auth;
8. configurar App Check com reCAPTCHA Enterprise e domínio final;
9. buildar o frontend com a chave pública do reCAPTCHA;
10. implantar nesta ordem:

```powershell
npx -y firebase-tools@latest deploy --only dataconnect
npx -y firebase-tools@latest deploy --only functions
npx -y firebase-tools@latest deploy --only hosting
```

11. executar smoke test de aluno e professor;
12. testar chamadas sem Auth/App Check e confirmar rejeição;
13. validar quatro atividades, moedas, streak, ranking, painel e chats;
14. monitorar logs, latência, erros e custo;
15. registrar hashes implantados e procedimento de rollback.

O `firebase.json` ainda precisa receber a configuração de Hosting antes do
deploy. Não executar `firebase init` aceitando sobrescritas sem revisar o diff.

## 9. Capacidade para 100 alunos/7 dias

Antes do piloto, executar teste em homologação, nunca no banco oficial:

- rampa 10 → 30 → 60 → 100 usuários;
- login, conteúdo, início/fim de atividade, ranking, painel e chats;
- pico conservador de 100 alunos simultâneos;
- IA com fallback e cenário de cota esgotada;
- medir p50/p95/p99, erros, cold starts, conexões SQL e custo;
- aprovar somente sem moedas duplicadas, sessões perdidas ou vazamento de
  gabarito/dados pessoais.

`maxInstances` atual: atividades 10, chats de professor 10 e mentor 5. Esses
valores são proteção inicial de custo, não prova de capacidade.

## 10. Limpeza antes do piloto

Somente após deploy e carga:

1. bloquear gravações;
2. confirmar projeto, instância e banco exatos;
3. criar backup e registrar contagens;
4. remover dados de homologação na ordem relacional documentada;
5. preservar schema, economia e conteúdo publicado;
6. criar período oficial quinta–quinta;
7. confirmar rankings/saldos esperados;
8. fazer cadastro de fumaça, validar e removê-lo;
9. liberar o piloto.

Nunca limpar banco por inferência deste documento. Exige autorização explícita.

## 11. Redesign pós-funcional

Após Estúdio, períodos, deploy e capacidade:

- criar tokens únicos de cor, tipografia, espaçamento e estados;
- manter identidade por fase dentro de uma paleta compartilhada;
- usar Ilusão do Dinheiro e Engenharia do Desejo como referência de acabamento;
- simplificar Home para progresso, próxima atividade e dificuldades;
- revisar Landing, Home, trilha, atividades, ranking, perfil e professor;
- executar auditoria responsiva, teclado, contraste e mensagens sem termos
  técnicos como SQL Connect/PostgreSQL/Supabase.

## 12. Git e commits

Ciclo obrigatório: branch → implementação → testes → confirmação do usuário →
commit semântico → merge fast-forward. Não fazer push/deploy sem autorização.

Commits recentes relevantes:

```text
bed56c5 docs: registra conclusao do chat de dados
3882996 feat: adiciona chat de dados do professor
ad40b79 docs: registra metricas do painel do professor
406f387 feat: adiciona painel analitico do professor
c240e3e docs: registra conclusao da task 5.1
99d8108 feat: protege acesso do professor por papel
a7b4fbe docs: encerra epico 3 e inventaria atividades
616394e feat: migra CapiMentor para Firebase
```

## 13. Skills recomendadas

- `firebase-data-connect`: schema, operações, autorização, SDK e migrações;
- `firebase-auth-basics`: login, papéis e rotas;
- `firebase-ai-logic-basics`: Gemini, JSON estruturado, App Check e fallback;
- `firebase-hosting-basics`: Vite SPA em Firebase Hosting;
- `firebase-security-rules-auditor`: somente se Storage/Firestore forem usados;
- criar futuramente uma skill `money-rank-release` com checklist de build,
  deploy, carga, backup e smoke test, sem credenciais embutidas.
