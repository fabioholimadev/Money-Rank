# Reset controlado do ambiente de produção

Este procedimento prepara o Money Rank para uma nova configuração sem apagar
o banco pedagógico, o conteúdo editorial ou a configuração da economia.

## O que é preservado

- a conta `fabiooliveiral2020@gmail.com`, com papel `TEACHER`;
- itens e cargas do banco pedagógico;
- módulos e definições editoriais;
- materiais, pesquisas e auditoria editorial;
- configuração da economia.

## O que é apagado

- todas as demais contas do Firebase Authentication e perfis SQL;
- todos os alunos regulares e da oficina;
- progresso, sessões, tentativas e transações de CapiCoins;
- períodos competitivos;
- oficinas, equipes e matrículas;
- execuções de teste e registros de teste de carga.

## Proteções

O comando é `dry-run` por padrão. A execução real exige simultaneamente:

1. o argumento `--commit`;
2. `CONFIRM_FRESH_START=APAGAR_DADOS_DO_MONEY_RANK`;
3. exatamente uma conta do professor preservado no Authentication;
4. exatamente um perfil completo desse professor no Data Connect.

Se qualquer proteção falhar, nenhum usuário é apagado. Não coloque a conta de
serviço em arquivo versionado nem copie seus valores para documentação ou
conversas.

## Execução

Depois de implantar as operações atuais do Data Connect, configure as
credenciais apenas no terminal seguro da execução e rode primeiro:

```powershell
npm --prefix backend/render-api run production:reset
```

Revise as contagens. Para aplicar:

```powershell
$env:CONFIRM_FRESH_START='APAGAR_DADOS_DO_MONEY_RANK'
npm --prefix backend/render-api run production:reset -- --commit
Remove-Item Env:CONFIRM_FRESH_START
```

O resumo final deve informar um usuário no banco, um professor preservado e
zero alunos, períodos, oficinas, sessões, tentativas e transações.
