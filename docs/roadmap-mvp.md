# Roadmap do MVP e do piloto

## Prioridade acordada

O caminho crítico foi reorganizado em 2026-08-04 para concentrar o trabalho
restante nas funções indispensáveis ao piloto com aproximadamente 100 alunos.

```text
concluir Épico 3
  -> executar Épico 5
  -> preparar e validar o deploy
  -> testar capacidade para 100 alunos
  -> fazer backup e limpar dados de teste
  -> abrir o piloto oficial
  -> executar Épico 4 e redesign como pós-MVP
```

## Fase A — concluir o Épico 3

1. encerrar a Task 3.10, com pontuação autoritativa;
2. executar a Task 3.11, migrando os rankings individual e por turma do
   Supabase para o Capi Bank;
3. usar o total geral do período competitivo, sem divisão semanal interna no
   primeiro piloto;
4. validar tentativas, recompensas, streak e ranking com dados consistentes.

## Fase B — antecipar o Épico 5

O dashboard é parte essencial do piloto porque permite ao professor observar
os dados coletados e validar a experiência. A ordem recomendada é:

1. **5.1 — autorização:** rotas e operações protegidas para professor;
2. **5.2 — painel analítico:** participação, progresso, tentativas, erros,
   CapiCoins e comparação das duas turmas;
3. **5.3 — Chat de Dados:** somente sobre agregações e consultas
   predefinidas, sem executar SQL gerada pela IA;
4. revisar privacidade, paginação e consistência com cerca de 100 alunos.

Se houver restrição de tempo, a autorização e os gráficos têm prioridade
sobre o Chat de Dados. O painel ainda pode cumprir o objetivo pedagógico sem a
IA conversacional na primeira versão.

## Fase C — deploy e capacidade

A versão antiga hospedada na Render pertence à arquitetura Express/Supabase e
não deve ser promovida automaticamente. A arquitetura atual será avaliada
para:

- frontend Vite em Firebase Hosting;
- Cloud Functions para pontuação e rotinas confiáveis;
- Firebase SQL Connect/Cloud SQL para dados relacionais;
- Firebase Auth e App Check para identidade e proteção;
- segredos no Secret Manager, nunca no frontend.

Antes do piloto, executar smoke test no ambiente implantado e teste de carga
com um cenário conservador de 100 usuários simultâneos. Medir latência, erros,
conexões, custo da IA, consistência e duplicidade de recompensas. O teste de
carga deve usar contas e dados de homologação, com orçamento e limites
configurados.

## Fase D — limpeza pré-piloto

A limpeza ocorre somente depois dos testes e imediatamente antes da abertura
oficial:

1. bloquear gravações;
2. confirmar projeto e banco exatos;
3. criar backup e registrar contagens;
4. remover contas e dados de teste na ordem relacional documentada;
5. recriar configuração econômica e período oficial;
6. confirmar rankings e saldos zerados;
7. executar um cadastro de fumaça e removê-lo;
8. abrir o piloto.

Nenhuma limpeza real é autorizada por este planejamento. Ela exige nova
autorização explícita, backup e alvo verificado.

## Fase E — itens adiados

### Épico 4

O CapiMentor legado usa Google AI Studio e backend Supabase. Ele pode servir de
referência visual, mas não está aprovado para o MVP atual. Existem duas opções:

- migrar depois para Firebase Auth, Functions, App Check e contexto do Capi
  Bank; ou
- mantê-lo desativado/oculto no piloto.

Não deixar o fluxo legado publicamente acessível apenas para conservar a
funcionalidade. A interface flutuante e a integração segura podem ser entregues
por outro agente usando o contexto deste repositório.

### Redesign

A padronização de Landing Page, Home, atividades, ranking, perfil e dashboard
fica para depois da estabilização das métricas e permissões. Correções visuais
que impedem uso ou acessibilidade continuam sendo parte do MVP; mudanças
puramente estéticas ficam no pós-MVP.

## Critério de corte por falta de tempo

Prioridade decrescente:

1. integridade de dados, Auth e autorização;
2. progressão, economia e rankings;
3. dashboard com métricas essenciais;
4. deploy, observabilidade, carga e limpeza;
5. Chat de Dados;
6. CapiMentor;
7. redesign visual amplo.

Uma funcionalidade incompleta que envolva IA, credenciais ou acesso coletivo
deve ficar desabilitada por padrão, não publicada parcialmente.
