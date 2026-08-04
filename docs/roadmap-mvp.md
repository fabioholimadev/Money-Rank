# Roadmap atualizado do MVP e do piloto

## Caminho crítico em 2026-08-04

```text
Épicos 1, 2 e 3 concluídos
  -> painel inicial do Épico 5 concluído
  -> Épico 4 implementado, aguardando teste/commit
  -> Estúdio do Professor (5.4)
  -> administração de períodos (5.5)
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
- CapiMentor migrado de Express/Supabase para Firebase no código local.

## Próximas entregas

### 1. Validar e commitar o Épico 4

Executar o roteiro em `epic-4/README.md`. O tutor usa Auth, App Check, contexto
mínimo, Secret Manager e fallback; ainda não há commit porque o ciclo exige
confirmação manual.

### 2. Estúdio do Professor

Implementar o desenho de `epic-5/estudio-professor.md`: materiais, versões das
atividades, revisão de pesquisa, prévia e publicação. Nada sugerido pela IA é
publicado sem aprovação do professor.

### 3. Períodos

Criar/agendar/pausar/encerrar sem apagar histórico. Novo período zera o ranking
por escopo; ajustes de saldo são transações compensatórias.

### 4. Deploy e capacidade

- Firebase Hosting para Vite;
- SQL Connect antes de Functions e Hosting;
- reCAPTCHA Enterprise/App Check;
- Secret Manager, orçamento e alertas;
- homologação separada;
- teste conservador com até 100 sessões simultâneas por sete dias.

### 5. Limpeza e piloto

Backup, contagens, alvo verificado e autorização explícita antes de remover
dados de teste. Criar o período oficial quinta–quinta somente depois do smoke
test final.

### 6. Redesign

Padronizar Landing, Home, trilha, atividades, ranking, perfil e professor. A
Home deve priorizar progresso, próxima etapa e dificuldades. Ilusão do Dinheiro
e Engenharia do Desejo são referências de acabamento.

## Prioridade em caso de novo limite de tempo

1. integridade, Auth, autorização e livro-caixa;
2. teste/commit do tutor já implementado;
3. deploy, App Check, carga, backup e limpeza;
4. Estúdio do Professor;
5. administração visual de períodos;
6. redesign.

Uma função incompleta envolvendo IA, credenciais, publicação ou exclusão deve
ficar desabilitada e documentada, nunca exposta parcialmente.
