# Checklist bloqueante — deploy do Money Rank

Este documento deve ser revisado antes de disponibilizar o Money Rank para
alunos e professores. Enquanto qualquer item bloqueante estiver pendente, o
deploy público não deve ser considerado concluído.

## Firebase App Check e Firebase AI Logic

- [ ] Registrar o aplicativo Web com **reCAPTCHA Enterprise** no Firebase App
  Check usando somente os domínios reais da aplicação.
- [ ] Criar ou selecionar uma chave de site baseada em pontuação e registrar a
  chave pública como `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` no ambiente de build.
- [ ] Garantir `VITE_FIREBASE_APPCHECK_DEBUG=false` no build de produção.
- [ ] Garantir que `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` não exista no ambiente
  de produção, no Git ou nos artefatos publicados.
- [ ] Confirmar em **Security > App Check > APIs** que a proteção básica do
  Firebase AI Logic continua como `Enforced`.
- [ ] Testar no domínio publicado que uma requisição legítima recebe token e
  que uma requisição sem App Check é rejeitada.
- [ ] Confirmar que as callables usam `limitedUseAppCheckTokens: true`; a
  proteção contra repetição do backend depende desses tokens de uso limitado.
- [ ] Remover os tokens de depuração que não forem mais necessários.
- [ ] Confirmar que `startActivitySession` e `submitActivitySession` rejeitam
  chamadas sem App Check e que tokens de uso limitado não podem ser repetidos.
- [ ] Confirmar o mesmo comportamento em `askTeacherData` e
  `askStudentMentor`.

## Cloud Functions e pontuação autoritativa

- [ ] Implantar o schema e as operações do Data Connect antes das Functions.
- [ ] Criar `GEMINI_API_KEY` no Secret Manager; nunca expor a chave ao Vite.
- [ ] Confirmar Node.js 22 e região `southamerica-east1` em todas as callables.
- [ ] Validar que o bundle e as respostas HTTP não expõem o gabarito do quiz.
- [ ] Reenviar a mesma sessão e confirmar uma tentativa e uma recompensa.
- [ ] Tentar enviar sessão de outro usuário e confirmar resposta `not-found`.
- [ ] Reavaliar o `npm audit` de `functions/` sem usar correção forçada
  incompatível.

## Configuração e controle de custos da IA

- [ ] Confirmar o modelo estável suportado pelo Firebase AI Logic e atualizar
  `VITE_FIREBASE_AI_MODEL` sem depender de um modelo descontinuado.
- [ ] Migrar o nome do modelo e os principais limites para Firebase Remote
  Config, permitindo troca sem novo deploy.
- [ ] Configurar orçamento, alertas de cobrança e limites de uso antes de abrir
  o acesso para as turmas.
- [ ] Medir o CapiMentor com `maxInstances: 5` e decidir se será necessário um
  rate limit persistente por aluno antes do piloto.
- [ ] Manter `security.auth-only=true` e validar que usuários sem Firebase Auth
  recebem erro de autenticação.
- [ ] Revisar a amostragem do AI Monitoring para não armazenar conteúdo além do
  necessário para diagnóstico.
- [ ] Confirmar preço, cota e orçamento do Google Search Grounding; cada busca
  pode gerar cobrança adicional.
- [ ] Validar que respostas fundamentadas do CapiMentor exibem fontes e o
  `searchEntryPoint.renderedContent` exigido pelos termos do Google Search.
- [ ] Confirmar que o fallback institucional continua disponível quando não há
  fontes, cota ou pesquisa.

## Conteúdo pedagógico

- [ ] Trocar todos os registros `pending_teacher_review` por
  `teacher_approved` somente depois da revisão do professor responsável.
- [ ] Verificar se links, vídeos, slides e resumos estão publicados e acessíveis
  pelo domínio final.
- [ ] Enquanto o Estúdio não existir, validar e versionar manualmente os arquivos
  em `frontend/src/data`; não editar conteúdo direto em produção.
- [ ] Executar uma tentativa completa de cada atividade com uma conta de aluno
  e outra de professor.

## Dados, autenticação e operação

- [ ] Implantar e validar o Firebase SQL Connect de produção.
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
- [ ] Medir nesse teste latência, taxa de erros, conexões do PostgreSQL,
  geração de questões pelo Gemini, consumo de cotas e custo estimado por aluno.
- [ ] Definir critérios de aprovação: nenhuma perda ou duplicação de moedas,
  nenhuma tentativa perdida, respostas principais dentro do tempo acordado e
  fallback local disponível quando a IA atingir limite ou ficar indisponível.
- [ ] Revisar domínios autorizados do Google Auth e remover origens de teste que
  não forem necessárias.
- [ ] Executar lint, build, testes automatizados e smoke test no ambiente final.
- [ ] Criar um procedimento de rollback e registrar a versão implantada.

## Hosting e ordem de implantação

- [ ] Adicionar Firebase Hosting ao `firebase.json` para `frontend/dist`, com
  rewrite SPA para `/index.html`, sem sobrescrever Data Connect/Functions.
- [ ] Executar `npm run build` e confirmar que nenhum `.env.local`, segredo ou
  token debug entrou em `dist`.
- [ ] Implantar na ordem: `dataconnect`, `functions`, `hosting`.
- [ ] Não reutilizar a aplicação antiga da Render, pois ela depende da
  arquitetura Express/Supabase.
- [ ] Executar primeiro em homologação e somente depois repetir em produção.
