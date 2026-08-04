# Task 5.1 - Acesso protegido do professor

Estado: concluída no commit funcional `99d8108`.

## Objetivo

Separar a área do aluno e a área pedagógica usando o papel armazenado no
Capi Bank. O navegador não escolhe nem eleva permissões.

## Modelo implementado

- `User.role` continua aceitando somente `STUDENT` ou `TEACHER`;
- novos perfis continuam sendo criados como `STUDENT` por padrão;
- `GetMyProfile` usa `auth.uid` e devolve somente o papel do próprio usuário;
- `/student` e todas as rotas da trilha exigem `STUDENT`;
- `/professor` exige `TEACHER` e possui layout inicial independente;
- tentativa de acessar a área errada redireciona para a Home correspondente;
- promoção por e-mail usa `SetUserRoleByEmail` com `NO_ACCESS`;
- o utilitário de promoção local recusa qualquer host que não seja o
  emulador em `127.0.0.1:9399` ou `localhost:9399`.

A tela entregue nesta Task confirma o acesso e reserva o espaço do dashboard.
Métricas e gráficos reais pertencem à Task 5.2; nenhum número fictício é
mostrado.

## Por que não usar apenas uma rota escondida

Esconder o link não é autorização. Um aluno poderia digitar `/professor`
manualmente. O `ProtectedRoute` compara o papel carregado do perfil do próprio
usuário e redireciona acessos incompatíveis. Nas Tasks 5.2 e 5.3, cada
operação coletiva também deverá repetir a validação de `TEACHER` no servidor.

## Criar um professor no ambiente local

1. Inicie o ambiente completo:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\start-local-emulators.ps1
   ```

2. Entre com a conta Google que será usada no teste e conclua o perfil. A
   promoção recusa contas sem perfil completo.
3. Em outro terminal, execute, substituindo o e-mail:

   ```powershell
   cd "C:\Documentos\Programação\Money Rank\functions"
   $env:DATA_CONNECT_EMULATOR_HOST="127.0.0.1:9399"
   npm run local:teacher -- promote "professor@escola.com"
   ```

4. Saia e entre novamente no Money Rank para recarregar o papel.

Para devolver a conta ao papel de estudante:

```powershell
npm run local:teacher -- demote "professor@escola.com"
```

Esse utilitário é deliberadamente local. Em produção, a concessão deverá
ser feita por um processo administrativo auditável com Firebase Admin SDK,
nunca por uma mutation liberada ao frontend.

## Roteiro de teste manual

### Conta de estudante

1. Entre com um perfil `STUDENT` completo.
2. Acesse `http://localhost:5173/professor`.
3. Confirme o redirecionamento para `/student`.
4. Confirme que Home, Trilha, Ranking e Perfil continuam acessíveis.

### Conta de professor

1. Promova a conta local seguindo o procedimento acima.
2. Saia e entre novamente.
3. Confirme que a entrada padrão é `/professor`.
4. Confirme a mensagem `Acesso protegido ativo`.
5. Digite `http://localhost:5173/student`.
6. Confirme o redirecionamento de volta para `/professor`.
7. Confirme que o botão `Sair` encerra a sessão.

### Sessão anônima

1. Sem login, acesse `/professor`.
2. Confirme o redirecionamento para `/login`.
3. Entre como estudante e confirme que o retorno não burla o papel.

## Testes automatizados

```powershell
cd frontend
npm run test:role-access
npm run lint
npm run build

cd ..\functions
npm test
npm run lint

cd ..
npx -y firebase-tools@latest dataconnect:compile --project money-rank
```

## Pendências para produção

1. definir quais contas Google serão professoras;
2. implementar concessão auditável fora do emulador;
3. revogar imediatamente professores removidos do projeto;
4. repetir a autorização dentro de todas as consultas da Task 5.2;
5. testar expiração de sessão e revogação antes do piloto.
