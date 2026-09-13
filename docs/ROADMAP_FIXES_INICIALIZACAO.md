# Roadmap de correcoes de inicializacao

Objetivo: deixar uma unica arquitetura de backend documentada e executavel,
remover o Supabase legado e restaurar as verificacoes obrigatorias do projeto.

## Escopo

1. **Remocao do legado**
   - excluir o backend Supabase versionado em `backend/`, preservando
     `backend/render-api/`;
   - remover o cliente e a dependencia Supabase sem uso no frontend;
   - retirar instrucoes atuais que ainda tratam o legado como necessario.
2. **FIX-001 — build da trilha**
   - restaurar os imports do modelo de materiais;
   - remover variaveis de estilo que ficaram sem uso no redesign;
   - aprovar lint e build do frontend.
   - executar lint, build e testes automaticamente no GitHub Actions.
3. **FIX-002 — configuracao unica da API**
   - adotar `http://localhost:8080` como padrao local;
   - incluir `VITE_API_URL` no exemplo de ambiente;
   - fornecer valores locais seguros no exemplo da API.
4. **FIX-003 — App Check local**
   - manter App Check obrigatorio em producao;
   - permitir desativacao explicita somente em desenvolvimento local;
   - alinhar o modo debug do navegador ao provedor oficial do Firebase.
5. **FIX-004 — documentacao operacional**
   - tornar a API HTTP parte obrigatoria do fluxo atual;
   - separar o fluxo minimo do fluxo com emuladores;
   - documentar health check, readiness e diagnostico de portas.

## Validacao e entrega

- testes e lint das Functions;
- testes da API, incluindo a politica de App Check;
- lint, build e testes de dominio do frontend;
- validacao do SQL Connect;
- `git diff --check` limitado ao conjunto desta entrega;
- push da branch `new/fix-local-startup` para `origin`.

Alteracoes de interface que ja estavam no working tree antes deste trabalho nao
fazem parte da entrega e nao devem ser incluidas nos commits.
