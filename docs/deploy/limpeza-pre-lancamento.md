# Plano de limpeza pré-lançamento

## Objetivo

Iniciar a coleta oficial sem contas, tentativas, moedas ou progresso criados
durante desenvolvimento e homologação. Este documento é um procedimento
planejado: a Task 3.9 **não apaga dados**.

## Ambientes

- desenvolvimento local: descartável e usado para testes frequentes;
- homologação: usado pela equipe e pelo professor antes da abertura;
- produção: deve nascer sem dados de teste e receber somente configurações
  canônicas.

Sempre preferir um projeto Firebase de produção separado. Se os testes
ocorrerem no mesmo projeto, a limpeza exige janela de manutenção, backup e
aprovação explícita do responsável.

## Checklist bloqueante

1. interromper login e gravações durante a manutenção;
2. confirmar projeto, instância PostgreSQL e ambiente pelos identificadores
   completos, sem depender apenas de uma variável local;
3. exportar backup e registrar a contagem de cada tabela;
4. preservar materiais pedagógicos e configurações aprovadas;
5. excluir dados de teste respeitando dependências;
6. limpar separadamente as contas de teste no Firebase Auth;
7. recriar a configuração econômica canônica: 20/100/20, limite diário
   `null`, intervalo mínimo 30 segundos e multiplicadores 110/120/130;
8. criar o período oficial inicialmente como `DRAFT` ou `SCHEDULED`;
9. validar que contagens, saldos e rankings começam em zero;
10. executar um cadastro completo e removê-lo antes de abrir o acesso;
11. guardar evidências do resultado e um procedimento de restauração.

## Ordem relacional de limpeza

A ordem exata deve ser revisada contra o esquema vigente. Pela arquitetura da
Task 3.9, os dados dependentes são removidos antes dos pais:

1. `capi_coin_transactions`;
2. `activity_attempts`;
3. `activity_sessions`;
4. `student_progress`;
5. `competition_periods` de teste;
6. `users` de teste.

`economy_config` não deve ser simplesmente apagada: deve ser validada ou
recriada com valores aprovados. Firebase Auth é outro sistema e não é limpo
por SQL.

## Salvaguardas do futuro comando

O utilitário de limpeza só deve ser criado perto do lançamento, quando o
esquema final estiver estabilizado. Ele precisará de:

- modo de simulação como padrão;
- lista explícita de projetos permitidos;
- confirmação digitada com o ID completo do projeto;
- contagens antes/depois;
- transação e rollback quando aplicável;
- credencial administrativa fora do navegador e fora do Git;
- proibição de curingas ou alvos inferidos.

Nenhuma limpeza do banco real deve ocorrer sem nova autorização do usuário.
