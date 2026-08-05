# Roadmap atualizado do MVP e do piloto

## Caminho crítico em 2026-08-04

```text
Épicos 1, 2, 3 e 4 concluídos
  -> painel inicial do Épico 5 concluído
  -> Estúdio do Professor (5.4) em validação
  -> administração de períodos (5.5) implementada, em validação
  -> homologação e deploy
  -> carga para 100 alunos
  -> backup e limpeza de testes
  -> piloto quinta–quinta
  -> redesign global
```

## Concluído

- Auth Google, perfil e papéis;
- Capi Bank relacional e SDK;
- trilha, conteúdos, quatro atividades, economia, streak e rankings;
- painel `TEACHER`, métricas e Chat de Dados;
- CapiMentor migrado de Express/Supabase, testado e aprovado.

## Próximas entregas

### 1. Finalizar a validação ampliada da área do Professor

O código está registrado no commit `7440824`. Manter os roteiros de
`epic-5/estudio-professor.md` e `epic-5/administracao-competicao.md` para os
smokes de homologação. A implementação possui
materiais por URL HTTPS e upload protegido no Firebase Storage, versões das
atividades, revisão de pesquisa, prévia e publicação. Nada sugerido pela IA é
publicado sem aprovação do professor.

### 2. Validar a área final do professor

Testar criação/edição/pausa/retomada de períodos, exportação CSV e chat
flutuante. O novo período zera o ranking por escopo; ajustes de saldo continuam
como transações compensatórias.

### 3. Deploy e capacidade

- Firebase Hosting para Vite;
- SQL Connect antes de Functions e Hosting;
- reCAPTCHA Enterprise/App Check;
- Secret Manager, orçamento e alertas;
- homologação separada;
- teste conservador com até 100 sessões simultâneas por sete dias.

### 4. Limpeza e piloto

Backup, contagens, alvo verificado e autorização explícita antes de remover
dados de teste. Criar o período oficial quinta–quinta somente depois do smoke
test final.

### 5. Redesign

Padronizar Landing, Home, trilha, atividades, ranking, perfil e professor. A
Home deve priorizar progresso, próxima etapa e dificuldades. Ilusão do Dinheiro
e Engenharia do Desejo são referências de acabamento.

## Prioridade em caso de novo limite de tempo

1. integridade, Auth, autorização e livro-caixa;
2. teste/commit do tutor já implementado;
3. deploy, App Check, carga, backup e limpeza;
4. Estúdio do Professor;
5. validação manual da administração visual de períodos;
6. redesign.

Uma função incompleta envolvendo IA, credenciais, publicação ou exclusão deve
ficar desabilitada e documentada, nunca exposta parcialmente.
