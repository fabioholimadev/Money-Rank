# Documentação do Money Rank v2.0

Esta pasta guarda o histórico técnico e o planejamento executavel do projeto.
O `README.md` da raiz apresenta o produto; o
[`CONTEXTO_GERAL_PROJETO.md`](CONTEXTO_GERAL_PROJETO.md) permite transferir o
trabalho para outro desenvolvedor ou agente sem perder o estado atual.

## Índice

| Área | Estado | Documento |
| --- | --- | --- |
| Épico 1 - Infraestrutura e autenticação | Implementado, com divida legada mapeada | [`epic-1/README.md`](epic-1/README.md) |
| Épico 2 - Firebase SQL Connect | Base implementada e integrada | [`epic-2/README.md`](epic-2/README.md) |
| Épico 3 - Trilha e atividades | Em andamento | [`epic-3/README.md`](epic-3/README.md) |
| Épico 4 - Tutoria inteligente | Planejado | [`epic-4/README.md`](epic-4/README.md) |
| Épico 5 - Dashboard do professor | Planejado | [`epic-5/README.md`](epic-5/README.md) |
| Produção e capacidade | Preparação futura | [`deploy/checklist-producao.md`](deploy/checklist-producao.md) |

## Regra obrigatoria de manutenção

Antes de cada commit de Task:

1. atualizar o README do Épico afetado;
2. registrar status, arquivos, decisões, testes e pendências;
3. atualizar o contexto geral quando a mudança afetar o handoff;
4. revisar links relativos com `rg` ou teste equivalente;
5. nunca registrar credenciais, tokens ou dados pessoais.

Tasks ainda não iniciadas descrevem **como será feito**. Assim que forem
implementadas, o planejamento deve ser substituido pelo resultado real, com o
hash do commit correspondente.

## Convenção de nomes

- uma pasta `epic-N` por Épico;
- `README.md` como fonte principal do Épico;
- documentos complementares com nomes em kebab-case;
- `deploy/` somente para preparação de produção e operação transversal.
