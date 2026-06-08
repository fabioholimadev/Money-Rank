# Documento de Requisitos

## Introduction

O **Sistema de Desbloqueio de Fases** implementa progressão linear na trilha de aprendizado do Money Rank. Atualmente o mapa (`TrilhaHub`) exibe módulos com status de liberação estático (hardcoded), e a atividade do Módulo 1 (`AtividadeQuiz`) não atualiza nenhum indicador de progresso ao ser concluída.

Esta feature conecta os três pilares — banco de dados, backend e frontend — para que o avanço do aluno na trilha seja persistido no Supabase, refletido em tempo real no mapa e protegido por regras de elegibilidade no servidor.

A progressão é linear: o aluno começa na fase 1 e avança apenas após concluir a atividade do módulo corrente com pontuação mínima de aprovação. Módulos cujo número é maior que a `fase_atual` do aluno ficam bloqueados visualmente e funcionalmente.

---

## Glossary

- **Aluno**: usuário autenticado da plataforma, representado na tabela `alunos` do Supabase e no objeto `aluno` do `AuthContext`.
- **Fase**: unidade de progresso linear numerada de 1 a N, onde N é o total de módulos da trilha. `fase_atual = 1` significa que apenas o Módulo 1 está liberado.
- **Módulo**: bloco de conteúdo + atividade exibido no mapa (`TrilhaHub`). Cada módulo possui um `id` inteiro único (1–4 no MVP).
- **Atividade Elegível**: atividade de tipo `atividade` cuja conclusão pode promover o avanço de fase, desde que o aluno atinja a pontuação mínima e ainda esteja na fase correspondente ao módulo.
- **TrilhaHub**: página React que exibe o mapa com todos os módulos e seus respectivos estados de liberação.
- **AtividadeQuiz**: página React da atividade do Módulo 1 (Quiz de Fixação — "O Perigo do Doce").
- **AuthContext**: contexto React que mantém o objeto `aluno` em memória e no `localStorage`, expondo `updateAluno()` para atualizações incrementais.
- **ActivityController**: módulo Node.js responsável pela lógica de negócio de atividades no backend (`activityController.js`).
- **Supabase**: banco de dados PostgreSQL gerenciado utilizado pela plataforma.
- **CapiCoins**: moeda virtual da plataforma, campo `capicoins` na tabela `alunos`.
- **Pontuação Mínima**: limiar de acertos para que uma atividade seja considerada aprovada; atualmente 3 acertos de 5 questões no `AtividadeQuiz`.

---

## Requirements

### Requirement 1: Campo `fase_atual` na Tabela de Alunos

**User Story:** Como desenvolvedor, quero que o campo `fase_atual` exista na tabela `alunos` do Supabase com valor padrão, para que o progresso de cada aluno possa ser persistido corretamente.

#### Acceptance Criteria

1. THE Supabase SHALL conter a coluna `fase_atual` do tipo `integer` na tabela `alunos`.
2. THE Supabase SHALL atribuir o valor padrão `1` à coluna `fase_atual` para todos os registros novos.
3. WHEN um registro de aluno existente não possui valor em `fase_atual`, THE Supabase SHALL tratar o campo como `1` ao ser lido pelo backend.

---

### Requirement 2: Leitura do Progresso Real no Mapa da Trilha

**User Story:** Como aluno, quero que o mapa da trilha mostre apenas os módulos que já desbloqueei, para que eu saiba exatamente onde estou na minha jornada.

#### Acceptance Criteria

1. WHEN o `TrilhaHub` é renderizado, THE TrilhaHub SHALL ler o campo `fase_atual` do objeto `aluno` disponível no `AuthContext`.
2. THE TrilhaHub SHALL calcular o estado de liberação de cada módulo pela regra: um módulo está liberado se e somente se `modulo.id <= aluno.fase_atual`.
3. THE TrilhaHub SHALL exibir o ícone de cadeado e aplicar opacidade reduzida em todos os módulos cujo `id` seja maior que `aluno.fase_atual`.
4. THE TrilhaHub SHALL habilitar os botões "Ler Conteúdo" e a respectiva atividade somente em módulos liberados.
5. WHEN `aluno.fase_atual` é `undefined` ou `null`, THE TrilhaHub SHALL tratar o valor como `1`, garantindo que ao menos o Módulo 1 esteja liberado.
6. THE TrilhaHub SHALL remover qualquer valor `liberado` hardcoded do array de módulos, substituindo-o pelo cálculo dinâmico baseado em `fase_atual`.

---

### Requirement 3: Avanço de Fase ao Concluir Atividade com Aprovação

**User Story:** Como aluno, quero avançar automaticamente para o próximo módulo ao concluir uma atividade com nota suficiente, para que a minha progressão seja recompensada de forma imediata.

#### Acceptance Criteria

1. WHEN o `AtividadeQuiz` finaliza com `pontuacao >= 3` e `aluno.fase_atual === 1`, THE AtividadeQuiz SHALL enviar ao backend uma requisição de avanço de fase juntamente com a requisição de CapiCoins.
2. WHEN o backend recebe a requisição de avanço de fase para o `id_aluno` com `fase_modulo = 1`, THE ActivityController SHALL verificar que `aluno.fase_atual === fase_modulo` antes de realizar o UPDATE.
3. WHEN a condição de avanço é confirmada pelo backend, THE ActivityController SHALL executar `UPDATE alunos SET fase_atual = fase_atual + 1 WHERE id = id_aluno AND fase_atual = fase_modulo`.
4. WHEN o backend retorna sucesso com a nova `fase_atual`, THE AtividadeQuiz SHALL chamar `updateAluno({ fase_atual: novaFase })` para atualizar o `AuthContext` e o `localStorage`.
5. IF o aluno já possui `fase_atual > fase_modulo` no momento da requisição, THEN THE ActivityController SHALL ignorar o UPDATE de fase e retornar a `fase_atual` atual sem erro.
6. IF o aluno possui `fase_atual < fase_modulo` no momento da requisição, THEN THE ActivityController SHALL retornar HTTP 409 com mensagem de erro descrevendo a inconsistência.
7. THE AtividadeQuiz SHALL exibir na tela de resultado a mensagem de avanço de fase somente após confirmação do backend, com indicação do novo módulo desbloqueado.

---

### Requirement 4: Resposta da API com `fase_atual` Atualizada

**User Story:** Como desenvolvedor, quero que a API de conclusão de atividade retorne a `fase_atual` atualizada do aluno, para que o frontend possa sincronizar o estado sem uma requisição adicional.

#### Acceptance Criteria

1. WHEN `POST /api/activities/complete` é processado com sucesso, THE ActivityController SHALL incluir o campo `fase_atual` no objeto `aluno` do corpo da resposta JSON.
2. WHEN o avanço de fase é aplicado na mesma requisição, THE ActivityController SHALL retornar `fase_atual` com o valor já incrementado.
3. WHEN o avanço de fase não é aplicado (aluno já avançou ou não elegível), THE ActivityController SHALL retornar `fase_atual` com o valor atual do aluno sem modificação.

---

### Requirement 5: Proteção contra Avanço Duplicado

**User Story:** Como desenvolvedor, quero que repetir a conclusão de uma atividade já aprovada não avance a fase novamente, para que o sistema de progressão não seja corrompido por repetições.

#### Acceptance Criteria

1. WHEN o `AtividadeQuiz` é concluído com `pontuacao >= 3` e `aluno.fase_atual > 1`, THE AtividadeQuiz SHALL omitir a requisição de avanço de fase ao backend.
2. THE ActivityController SHALL executar o UPDATE de `fase_atual` somente quando `aluno.fase_atual = fase_modulo` (condição atômica via cláusula `WHERE` no SQL), garantindo idempotência no nível do banco de dados.
3. FOR ALL execuções repetidas da mesma atividade aprovada por um mesmo aluno, THE ActivityController SHALL retornar `fase_atual` inalterada sem retornar erro.

---

### Requirement 6: Extensibilidade para Atividades dos Módulos Futuros

**User Story:** Como desenvolvedor, quero que o mecanismo de avanço de fase seja genérico o suficiente para ser reutilizado pelas atividades dos módulos 2, 3 e 4, para que a lógica não precise ser duplicada em cada nova atividade.

#### Acceptance Criteria

1. THE ActivityController SHALL aceitar o campo `fase_modulo` (inteiro) no payload de `POST /api/activities/complete`, indicando a qual fase a atividade pertence.
2. WHEN `fase_modulo` não é fornecido no payload, THE ActivityController SHALL tratar o campo como `null` e omitir qualquer lógica de avanço de fase, mantendo compatibilidade retroativa com chamadas existentes.
3. THE ActivityController SHALL aplicar a lógica de avanço de fase de forma independente para qualquer valor de `fase_modulo` entre `1` e o número máximo de fases da trilha.

---

### Requirement 7: Persistência do Estado de Fase entre Sessões

**User Story:** Como aluno, quero que o módulo desbloqueado continue aparecer liberado ao retornar ao mapa após sair e voltar ao app, para que o meu progresso não se perca entre sessões.

#### Acceptance Criteria

1. WHEN `updateAluno({ fase_atual: novaFase })` é chamado pelo `AtividadeQuiz`, THE AuthContext SHALL persistir o novo valor de `fase_atual` no `localStorage` junto com os demais campos do objeto `aluno`.
2. WHEN o app é recarregado e o `AuthContext` restaura o objeto `aluno` do `localStorage`, THE AuthContext SHALL disponibilizar `fase_atual` com o valor salvo anteriormente.
3. WHEN o `TrilhaHub` é renderizado após recarregamento do app, THE TrilhaHub SHALL exibir o mapa com o estado de liberação consistente com o `fase_atual` restaurado do `localStorage`.
