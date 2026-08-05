# Checklist bloqueante — deploy do Money Rank

Este documento deve ser revisado antes de disponibilizar o Money Rank para
alunos e professores. Enquanto qualquer item bloqueante estiver pendente, o
deploy público não deve ser considerado concluído.

## Firebase App Check e API externa

- [ ] Registrar o aplicativo Web com **reCAPTCHA Enterprise** no Firebase App
  Check usando somente os domínios reais da aplicação.
- [ ] Criar ou selecionar uma chave de site baseada em pontuação e registrar a
  chave pública como `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` no ambiente de build.
- [ ] Garantir `VITE_FIREBASE_APPCHECK_DEBUG=false` no build de produção.
- [ ] Garantir que `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` não exista no ambiente
  de produção, no Git ou nos artefatos publicados.
- [ ] Enviar token de uso limitado para a API Render e valida-lo com Firebase
  Admin, junto do Firebase ID Token.
- [ ] Testar no dominio publicado que uma requisicao legitima recebe token e
  que uma requisicao sem Auth/App Check e rejeitada.
- [ ] Remover os tokens de depuração que não forem mais necessários.
- [ ] Confirmar protecao contra repeticao nas rotas de inicio/fim de atividade,
  professor, editorial e chats.

## API Render e pontuacao autoritativa

- [ ] Portar a logica testada de `functions/src` para Express sem usar o backend
  Supabase legado.
- [ ] Criar `GEMINI_API_KEY` como secret no Render; nunca expor a chave ao Vite.
- [ ] Confirmar Node.js 22, CORS restrito e health check sem banco/IA.
- [ ] Verificar Firebase ID Token e papel do professor em todas as rotas.
- [ ] Validar que o bundle e as respostas HTTP não expõem o gabarito do quiz.
- [ ] Reenviar a mesma sessão e confirmar uma tentativa e uma recompensa.
- [ ] Tentar enviar sessão de outro usuário e confirmar resposta `not-found`.
- [ ] Reavaliar o `npm audit` da API sem usar correção forçada
  incompatível.

## Configuração e controle de custos da IA

- [ ] Manter a IA opcional e confirmar fallback deterministico sem chave/cota.
- [ ] Configurar limite diario por usuario sem depender de memoria do processo.
- [ ] Validar que usuarios sem Firebase Auth
  recebem erro de autenticação.
- [ ] Nao ativar Google Search Grounding ou outro recurso pago no MVP gratuito.
- [ ] Validar que respostas fundamentadas do CapiMentor exibem fontes e o
  `searchEntryPoint.renderedContent` exigido pelos termos do Google Search.
- [ ] Confirmar que o fallback institucional continua disponível quando não há
  fontes, cota ou pesquisa.

## Conteúdo pedagógico

- [ ] Trocar todos os registros `pending_teacher_review` por
  `teacher_approved` somente depois da revisão do professor responsável.
- [ ] Verificar se links, vídeos, slides e resumos estão publicados e acessíveis
  pelo domínio final.
- [ ] Validar no Estúdio o fluxo completo `DRAFT -> IN_REVIEW -> PUBLISHED` e
  confirmar que a versão anterior vira `ARCHIVED`.
- [ ] Confirmar que pesquisas e conteúdos criados pelo projeto não publicam sem
  aprovação pedagógica do professor.
- [ ] Executar uma tentativa completa de cada atividade com uma conta de aluno
  e outra de professor.

## Materiais sem Firebase Storage

- [ ] Desativar o botao de upload no build online.
- [ ] Aceitar apenas links HTTPS externos aprovados pelo professor.
- [ ] Confirmar acesso aos videos e documentos em Chrome e Firefox sem login
  adicional no provedor do arquivo.
- [ ] Nao salvar Base64, arquivos ou banco no disco efemero do Render.

## Dados, autenticação e operação

- [ ] Criar e validar um unico Firestore Standard gratuito em
  `southamerica-east1`, apos aprovacao explicita da localizacao.
- [ ] Implantar regras inicialmente fechadas e indices revisados.
- [ ] Executar, com backup e aprovação explícita, o
  [`plano de limpeza pré-lançamento`](limpeza-pre-lancamento.md).
- [ ] Criar/agendar o período oficial e confirmar que somente transações
  dentro da janela recebem seu identificador.
- [ ] Confirmar que o período pode ser pausado sem interromper progresso,
  CapiCoins ou tentativas fora do ranking.
- [ ] Confirmar persistência de progresso, CapiCoins, streak, tentativas e
  rankings individual e por turma.
- [ ] Executar um teste de carga representando **100 alunos durante 7 dias**,
  incluindo o cenário conservador de até 100 sessões simultâneas em horário de
  atividade coletiva.
- [ ] Medir nesse teste latencia, taxa de erros, cold start/CPU do Render,
  leituras/escritas do Firestore e consumo de cota por aluno.
- [ ] Definir critérios de aprovação: nenhuma perda ou duplicação de moedas,
  nenhuma tentativa perdida, respostas principais dentro do tempo acordado e
  fallback local disponível quando a IA atingir limite ou ficar indisponível.
- [ ] Revisar domínios autorizados do Google Auth e remover origens de teste que
  não forem necessárias.
- [ ] Executar lint, build, testes automatizados e smoke test no ambiente final.
- [ ] Criar um procedimento de rollback e registrar a versão implantada.

## Render e ordem de implantação sem Blaze

- [x] Adicionar o Static Site do Render ao `render.yaml` para `frontend/dist`,
  com rewrite SPA para `/index.html`.
- [ ] Executar `npm run build` e confirmar que nenhum `.env.local`, segredo ou
  token debug entrou em `dist`.
- [ ] Migrar SQL Connect para Firestore Standard antes do deploy funcional.
- [ ] Migrar as callables para uma API Express segura no Render.
- [ ] Não publicar `backend/` como está: ele usa Supabase e não representa o
  backend autoritativo atual.
- [ ] Manter uploads de arquivos desativados enquanto não houver armazenamento
  persistente gratuito; aceitar somente links HTTPS externos.
- [ ] Executar primeiro em homologação e somente depois repetir em produção.

Consulte tambem a
[`arquitetura gratuita com Render e Firebase Spark`](arquitetura-firebase.md).
