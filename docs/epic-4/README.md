# Épico 4 - Tutoria inteligente

## Objetivo

Oferecer um CapiMentor flutuante que responda dúvidas com linguagem adequada ao
aluno e use somente o contexto pedagógico necessário.

## Estado

Planejado. Existe um componente legado `frontend/src/components/CapiMentor.jsx`
ligado ao backend Express/Supabase. Ele e referência de interface, não a
arquitetura final.

| Task | Como será feita | Estado |
| --- | --- | --- |
| 4.1 | Refatorar a interface flutuante, acessibilidade, estados e responsividade | Planejada |
| 4.2 | Integrar agente de IA com contexto mínimo, seguranca e limites | Planejada |

## Arquitetura prevista

1. autenticar a chamada com Firebase Auth;
2. buscar no servidor fase, saldo e dificuldades autorizadas;
3. montar contexto sem nome completo, e-mail, foto ou identificador desnecessário;
4. limitar o tutor ao dominio de educacao financeira e cidadania;
5. aplicar App Check, cotas, timeout e fallback;
6. registrar apenas telemetria pedagogica e operacional aprovada;
7. nunca colocar chave privilegiada no frontend.

## Comportamento esperado

- persona jovem, encorajadora e didatica;
- explicações curtas, com opcao de aprofundamento;
- nenhuma resposta entrega diretamente a solução de uma atividade ativa;
- informações potencialmente incorretas sao apresentadas com cautela;
- o aluno e orientado a procurar professor ou fonte oficial quando necessário.

## Testes previstos

- abrir, fechar, navegar por teclado e usar em tela pequena;
- sessão ausente, expirada e valida;
- IA indisponivel, lenta ou com resposta invalida;
- tentativa de injeção de prompt;
- ausência de dados pessoais no prompt e nos logs;
- limite de uso e custo;
- contexto correto para fases e alunos diferentes.

## Critério de conclusao

O Épico so termina quando o fluxo legado Supabase/JWT for removido do tutor, a
integração estiver protegida e os fallbacks forem testados.

## Registro de mudanças

Ao iniciar cada Task, substituir o planejamento pelo desenho real, listar
arquivos e testes e registrar o hash do commit.
