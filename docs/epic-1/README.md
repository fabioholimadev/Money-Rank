# Épico 1 - Infraestrutura e nova autenticação

## Objetivo

Substituir o acesso convencional por uma sessão Google gerenciada pelo
Firebase Auth e coletar os dados escolares necessários no primeiro acesso.

## Estado

As Tasks 1.1 a 1.3 foram implementadas. A remoção completa do Supabase não faz
parte do resultado ja concluído: ranking, backend e CapiMentor ainda possuem
dependências legadas que devem ser migradas de forma controlada.

| Task | Resultado | Commit |
| --- | --- | --- |
| 1.1 | Remocao dos formularios e fluxos frontend de e-mail/senha | `0bb8470` |
| 1.2 | Firebase App/Auth e login exclusivo com Google | `3b994ad` |
| 1.3 | Completar perfil com turma e avatar/foto | `9c9083e` |

## Implementacao atual

O fluxo observa a sessão com `onAuthStateChanged`. O primeiro login leva a
`/completar-perfil`; perfis concluídos seguem para a area do aluno. As únicas
turmas aceitas sao `3_DSA` e `3_DSB`, exibidas como **3º DSA** e **3º DSB**.

O aluno pode selecionar uma Capi profissional ou enviar JPG, PNG ou WebP. A
imagem enviada e redimensionada no navegador antes do armazenamento local de
transição. Nenhuma senha Google e recebida pelo Money Rank.

Arquivos centrais:

- `frontend/src/lib/firebaseConfig.js`;
- `frontend/src/contexts/AuthContext.jsx`;
- `frontend/src/pages/Login.jsx`;
- `frontend/src/pages/CompleteProfile.jsx`;
- `frontend/src/components/ProfileForm.jsx`;
- `frontend/src/constants/profileOptions.js`;
- `frontend/public/avatars/`.

## Validação funcional

1. entrar exclusivamente com Google;
2. confirmar o redirecionamento do primeiro acesso;
3. validar que apenas 3º DSA e 3º DSB podem ser escolhidas;
4. testar avatar predefinido e upload de foto;
5. recarregar e verificar persistência da sessão;
6. sair e confirmar protecao das rotas privadas.

## Pendências relacionadas

- retirar Supabase do ranking depois que as consultas equivalentes existirem
  no SQL Connect;
- retirar JWT/Supabase do CapiMentor no Épico 4;
- definir armazenamento definitivo das fotos de perfil antes da produção;
- configurar dominios autorizados e App Check no ambiente publicado.

## Registro de mudanças

Atualizar esta secao se autenticação, papéis, turmas, perfil, rotas protegidas
ou persistência da sessão forem alterados.
