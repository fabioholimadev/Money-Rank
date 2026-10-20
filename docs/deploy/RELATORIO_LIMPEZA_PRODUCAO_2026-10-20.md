# Relatório de limpeza do ambiente de produção

Data da execução: 20/10/2026, às 03:09 (America/Fortaleza).

Branch: `feat/oficina-ciencia-delas-redesign`  
Commit que estava em produção antes da limpeza: `2528cb7c52cbdd5f47b0c214462c61a521891746`

## Objetivo

Preparar o Money Rank para a oficina removendo contas e dados operacionais
criados durante os testes, sem apagar o banco pedagógico, o conteúdo
editorial, a configuração da economia ou a conta principal do professor.

## Salvaguardas aplicadas

- o projeto de destino foi conferido como `money-rank`;
- a conta `fabiooliveiral2020@gmail.com` apareceu exatamente uma vez no
  Firebase Authentication e uma vez no SQL Connect;
- foi executada uma auditoria somente leitura antes da exclusão;
- o Firebase Authentication foi exportado para um backup local fora do
  repositório e esse arquivo não foi versionado;
- o reset relacional foi executado pela operação atômica
  `ResetApplicationForFreshStart`;
- as contas restantes de teste foram removidas do Firebase Authentication;
- as contagens finais foram auditadas novamente.

## Contagens anteriores

| Recurso | Quantidade |
| --- | ---: |
| Contas no Firebase Authentication | 4 |
| Perfis SQL | 4 |
| Professores SQL | 2 |
| Alunos SQL | 2 |
| Períodos | 1 |
| Oficinas | 1 |
| Equipes | 1 |
| Matrículas em equipes | 1 |
| Registros de progresso | 1 |
| Sessões de atividade | 2 |
| Tentativas | 2 |
| Transações de CapiCoins | 4 |

## Resultado

- 3 perfis SQL removidos;
- 3 contas de autenticação removidas, sem falhas;
- 1 conta e 1 perfil do professor preservados;
- zero alunos, períodos, oficinas, equipes, matrículas, progressos,
  sessões, tentativas, transações e execuções de teste restantes;
- 140 itens pedagógicos preservados;
- endpoint `/readyz` respondeu com `ok: true` e sem advertências de ambiente.

## Observação operacional

O backup local do Authentication contém dados sensíveis e deve permanecer
fora do Git. Ele só deve ser usado em uma restauração deliberada e depois
descartado de forma segura quando não for mais necessário.
