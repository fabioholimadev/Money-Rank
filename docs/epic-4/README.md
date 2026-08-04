# Épico 4 — Tutoria inteligente

## Estado

Implementado e versionado na branch `feat/epic-4-mentor-firebase` pelo commit
`616394e`. O fluxo Express/Supabase foi removido do componente usado pelo aluno.
O fallback e as validações automáticas passaram; falta validar a resposta online
com a chave real mantida somente no ambiente local.

| Task | Resultado | Estado |
| --- | --- | --- |
| 4.1 | Interface flutuante responsiva, teclado, estados e limite de entrada | Implementada |
| 4.2 | Callable Firebase com contexto mínimo, Gemini e fallback | Validação online pendente |

## Arquitetura implementada

1. `CapiMentor.jsx` chama `mentorService.js`;
2. a callable `askStudentMentor` exige Firebase Auth e App Check em produção;
3. o Admin SDK consulta `GetMyProfile` e `ListMyProgress` impersonando o aluno;
4. somente fase, saldo do jogo e tópicos difíceis entram no prompt;
5. Gemini pode usar Google Search e a interface exibe fontes e sugestões de
   pesquisa exigidas pelo serviço;
6. respostas online só são aceitas quando retornam fontes de fundamentação;
7. sem chave, cota ou fontes, entra um fallback longo com links institucionais;
8. pedidos de gabarito, prompt, UID e assuntos fora do domínio são recusados;
9. nenhuma mensagem é persistida no banco nesta versão.

Arquivos:

- `functions/src/studentMentor.js`;
- `functions/src/activityRepository.js`;
- `functions/src/index.js`;
- `functions/test/studentMentor.test.js`;
- `frontend/src/services/mentorService.js`;
- `frontend/src/components/CapiMentor.jsx`.
- `frontend/public/avatars/capi-mentor.jpg`.

## Segurança e limites

- segredo `GEMINI_API_KEY` somente na Function;
- `limitedUseAppCheckTokens` e replay protection fora do emulador;
- `maxInstances: 5`, timeout de 45 segundos e até 500 caracteres;
- professor, perfil incompleto e sessão ausente são recusados;
- o tutor não escolhe alternativas nem entrega respostas de atividades;
- dados pessoais não entram no prompt ou retorno.
- o domínio cobre educação financeira e fiscal, cidadania, saúde, consumo,
  direitos e políticas públicas relacionadas;
- respostas visam quatro a seis parágrafos e terminam oferecendo aprofundamento.

O avatar foi gerado com a ferramenta integrada de imagens, tomando as capivaras
profissionais existentes apenas como referência visual. Prompt final registrado
no histórico da Task; asset otimizado para aproximadamente 53 KB.

O limite de instâncias reduz exposição de custo, mas rate limit global por aluno
deve ser acrescentado antes do piloto se as medições de carga indicarem risco.

## Validação automática

- 14 testes das Functions aprovados;
- lint das Functions e frontend aprovado;
- build Vite aprovado;
- aviso conhecido de bundle principal acima de 500 kB permanece para o
  redesign/code splitting.

## Teste manual

Execute integralmente [`roteiro-testes-capi-mentor.md`](roteiro-testes-capi-mentor.md).
O usuário autorizou o commit e o envio ao GitHub antes do teste online conjunto.
A chave real está em `functions/.secret.local`, que deve permanecer ignorado e
nunca ter seu valor documentado.

## Critério de conclusão

Testes automáticos, fallback, commit funcional/documental e integração na
branch-base; depois confirmar Gemini real, fontes, navegação, teclado e
responsividade antes do deploy.
