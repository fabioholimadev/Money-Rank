# Relatório de execução e hospedagem — 11/08/2026

## Estado do pacote

O código do piloto foi preparado para a arquitetura Render + Firebase SQL
Connect, sem redesign. O provisionamento remoto e o teste de carga não foram
executados neste relatório porque dependem da ativação da avaliação única do
Cloud SQL no Spark e de secrets que devem permanecer fora do Git e do chat.

## Implementado

- schema e operações SQL Connect para banco pedagógico, período, marcação de
  usuários sintéticos e auditoria de teste de carga;
- importador validado, transacional e idempotente por
  `activity_id + version + item_id`;
- banco server-side gerado a partir da planilha, com 140 itens ativos e status
  `PILOT_UNREVIEWED` preservado;
- regras definitivas de sorteio, nota, finais, economia, cooldown,
  idempotência e precedência de encerramento;
- API autoritativa Express para Render com Auth, App Check, CORS, rate limit,
  request ID, logging e exportação XLSX;
- migração dos serviços do frontend que ainda chamavam Firebase callable para
  HTTP autenticado na API;
- interface funcional mínima das quatro atividades, sem gabarito, pesos ou
  deltas antes da submissão final;
- scripts de provisionamento, smoke, carga de 100 usuários e limpeza seletiva;
- `render.yaml`, Docker multi-stage não root e guia de hospedagem/rollback.

## Evidência local

- planilha: hash SHA-256
  `AD50006032FEC0AA6CE469AE12222EA9E440CDEDC7F2BD8EC84ACB86F9B7E8C4`;
- itens: Perigo 30, Custo 54, Ilusão 24, Engenharia 32, total 140;
- importador: 140 válidos, 0 rejeitados;
- funções: 47/47 testes passando e lint passando;
- API: 2/2 testes passando;
- frontend: lint e build de produção passando;
- SQL Connect: SDK gerado com sucesso;
- Docker: imagem `money-rank-api:pilot` construída e `/healthz` respondeu 200
  dentro de contêiner executado como usuário não root.

## Avisos não bloqueantes

- o bundle principal do frontend tem aproximadamente 747 kB antes de gzip e
  merece code splitting depois do piloto;
- `npm audit` informa sete vulnerabilidades moderadas em dependências
  transitivas; não foi aplicado `--force` por poder introduzir breaking changes;
- farming continua registrado como risco conhecido, conforme a decisão de não
  limitar repetições remuneradas durante o piloto.

## Pendente em ambiente provisionado

1. confirmar e ativar a avaliação do SQL Connect/Cloud SQL no Spark;
2. executar `pilot:provision` e reconciliar a carga remota dos 140 itens;
3. cadastrar os secrets protegidos no Render e publicar API e frontend;
4. validar Auth, App Check, CORS, turma/pausa e idempotência em produção;
5. abrir a exportação XLSX real com as seis abas e três filtros;
6. executar uma única carga completa de 100 usuários, registrar métricas,
   limpar os sintéticos e revogar o Debug Token;
7. executar smoke real com TEACHER, DSB e DSA;
8. validar os links pedagógicos por último, preenchendo os materiais ainda
   ausentes das fases 3 e 4.

## Documentos operacionais

- guia: `docs/deploy/GUIA_HOSPEDAGEM_RENDER_FIREBASE_2026-08-11.md`;
- evidência do contrato: `docs/evidence/pedagogical-bank-import-report.json`;
- fonte: `docs/sources/banco-pedagogico-money-rank-preenchido.xlsx`.
