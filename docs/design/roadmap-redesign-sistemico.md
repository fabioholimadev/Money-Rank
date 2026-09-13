# Roadmap de redesign sistêmico — Money Rank

## Objetivo

Reconstruir a experiência visual do Money Rank como um produto educacional gamificado, coeso e reconhecível, usando as referências do Duolingo como direção de arquitetura, profundidade, ritmo, navegação e feedback — sem copiar sua marca, ilustrações ou interface literalmente.

O trabalho não será uma simples troca de cores. O resultado deve criar uma identidade própria para o Money Rank, baseada em educação fiscal, CapiCoins, Capis, progressão, turmas e pesquisa pedagógica.

## Direção recebida para a landing page

O briefing editorial da landing page foi recebido e incorporado a este roadmap. Sua estrutura de conteúdo, copy recomendada, atualização da equipe, regras de integridade e plano de imagens passam a orientar a futura implementação.

Há uma atualização deliberada em relação ao documento: a instrução de preservar a linguagem visual que já existia no repositório foi substituída pela decisão mais recente de aplicar o novo design system sistêmico inspirado nas referências do Duolingo. A landing compartilhará tokens, tipografia, componentes-base, acessibilidade e identidade Money Rank com o produto interno, mas manterá uma composição própria de marketing.

Esta incorporação organiza a execução, mas ainda não altera o código da landing.

## Leitura das referências

As imagens de referência indicam cinco decisões principais:

1. **Estrutura de produto, não de site institucional:** navegação lateral persistente no desktop, área central dedicada à tarefa e trilho contextual à direita.
2. **Fundo escuro azulado e superfícies discretas:** pouca dependência de sombras, com separação feita por bordas, mudanças suaves de superfície e espaço em branco.
3. **Componentes com volume e resposta:** botões, nós da trilha e indicadores possuem base inferior, estados pressionados e feedback visual claro.
4. **Gamificação visível:** progresso, moedas, sequência, divisão, missões e personagem aparecem como partes estruturais da interface, não como cards genéricos acrescentados depois.
5. **Hierarquia controlada:** poucas superfícies competem ao mesmo tempo; cada página tem uma ação ou progresso dominante.

## Identidade visual proposta

### Direção

- Personalidade: amigável, energética, confiável e escolar, sem aparência corporativa genérica.
- Forma: cantos arredondados consistentes, bordas espessas onde há interação e componentes ilustrados.
- Movimento: transições curtas, progresso animado e resposta de pressionamento; evitar animações decorativas constantes.
- Elementos proprietários: Capi, CapiCoin, trilhas fiscais, missões, conquistas de turma e indicadores de impacto coletivo.

### Paleta-base inicial

Os valores serão validados por contraste antes de se tornarem definitivos.

| Papel | Token sugerido | Uso |
| --- | --- | --- |
| Fundo principal | `#131F24` | Fundo contínuo do aplicativo |
| Fundo elevado | `#1F2D33` | Cards, menus, painéis e campos |
| Fundo pressionado | `#17262C` | Estados ativos e áreas internas |
| Borda | `#37464F` | Divisões e contornos estruturais |
| Texto principal | `#F1F7FB` | Títulos e conteúdo prioritário |
| Texto secundário | `#A5B7C2` | Descrições e metadados |
| Verde Money Rank | `#58CC02` | Ação principal, progresso e sucesso |
| Verde pressionado | `#46A302` | Base 3D e estado ativo |
| Azul informativo | `#49C0F8` | Navegação, links e informação |
| Amarelo recompensa | `#FFC800` | CapiCoins, prêmios e conquistas |
| Vermelho atenção | `#FF4B4B` | Erro, vidas e ações destrutivas |

Amarelo deixa de ser cor primária e passa a ter significado exclusivo de recompensa. Violeta deixa de identificar a área do professor; os papéis serão diferenciados por conteúdo, navegação e ícones, mantendo o mesmo produto.

## Arquitetura responsiva

### Desktop, a partir de 1200 px

- Sidebar fixa à esquerda, com largura única definida por token.
- Coluna central fluida, limitada para preservar leitura e foco.
- Coluna contextual à direita para status, missões, ajuda, resumo da turma ou publicação.
- Cabeçalhos e trilhos laterais podem ser `sticky`; conteúdo de página nunca deve ficar sob eles.
- O assistente Capi ocupa uma área reservada ou um launcher com zona de segurança própria.

### Tablet, entre 768 e 1199 px

- Sidebar compacta ou recolhível.
- Coluna contextual vira painel expansível ou aparece abaixo do conteúdo principal.
- Grids de três colunas reduzem para duas ou uma sem larguras mínimas rígidas.

### Mobile, abaixo de 768 px

- Navegação inferior com altura e `safe-area` centralizadas em tokens.
- Cabeçalho móvel compacto para contexto, saldo e progresso.
- Painéis contextuais viram drawers ou bottom sheets.
- O CapiMentor deve abrir acima da navegação inferior e nunca cobrir ações persistentes.

## Inventário de superfícies

### Estrutura compartilhada

- `Layout`, `TopBar`, `BottomNav`, `ProtectedRoute` e `ProfileAvatar`.
- Navegação do aluno e nova navegação do professor.
- Status globais: CapiCoins, sequência, fase, papel e turma.
- CapiMentor, modais, drawers, tooltips, alertas, loaders e estados vazios.

### Jornada do aluno

- Login e conclusão do perfil.
- Dashboard do aluno.
- Hub da trilha, categorias, módulos e estados bloqueados.
- Conteúdos pedagógicos e atividades interativas.
- Ranking e perfil.

### Jornada do professor

- Dashboard e métricas de turma.
- Período competitivo e modo de teste.
- Chat de dados e diagnósticos.
- Estúdio editorial, editores estruturados e revisão de pesquisa.
- Visualização/teste de atividades.

### Landing page

- Briefing editorial recebido e integrado ao roadmap.
- Usará os mesmos tokens tipográficos, cromáticos, responsivos e de acessibilidade do produto.
- Terá composição própria de marketing, sem copiar o `AppShell` autenticado nem reproduzir literalmente a interface do Duolingo.
- A implementação será feita depois da fundação do design system e dos componentes-base.

## Plano incorporado para a landing page

### Objetivo editorial

A primeira tela deve explicar em poucos segundos que a Money Rank é uma plataforma gamificada de educação financeira e fiscal para estudantes do ensino médio, com trilhas, desafios e simulações para alunos e acompanhamento para educadores.

A narrativa demonstrará o produto antes de apresentar trajetória, pesquisa ou equipe. A gamificação sustenta a aprendizagem, mas não substitui a explicação do benefício.

### Arquitetura de conteúdo

A ordem aprovada para a landing é:

1. Cabeçalho com navegação curta e CTA.
2. Hero com proposta de valor direta.
3. Apresentação rápida do produto.
4. Como funciona em três passos.
5. Produto em ação com telas reais.
6. O que se aprende.
7. Benefícios para estudantes e educadores.
8. Diferenciais verificáveis.
9. Nossa trajetória.
10. Pesquisa e fundamento.
11. Equipe.
12. Perguntas frequentes.
13. CTA final e rodapé.

### Cabeçalho e hero

- Navegação: `Como funciona`, `O que você aprende`, `Nossa trajetória` e `Equipe`.
- Ações: `Entrar` e `Acessar a plataforma`.
- Identificação opcional: `Educação financeira e fiscal para o ensino médio`.
- Título: `Aprenda finanças. Entenda os tributos. Pratique jogando.`
- Subtítulo: `A Money Rank transforma decisões do cotidiano em trilhas, desafios e simulações para estudantes - com uma experiência gamificada e acompanhamento para educadores.`
- CTA principal: `Acessar a plataforma`.
- CTA secundário opcional: `Ver como funciona`.
- A hero não terá os seis chips, cards flutuantes, métricas ou textos sobrepostos.
- A composição funcionará preferencialmente sem imagem. Se um apoio visual for necessário, usará somente a Capi ou uma captura real e limpa da trilha.

### Apresentação e funcionamento

A apresentação rápida destacará somente três ideias: aprendizado em etapas, decisões práticas e progresso visível.

O funcionamento será apresentado em três passos:

1. **Explore uma trilha:** avance por conteúdos organizados em uma sequência clara.
2. **Coloque em prática:** resolva desafios e analise situações cotidianas em um ambiente sem dinheiro real.
3. **Acompanhe sua evolução:** receba retorno, conquiste CapiCoins virtuais, mantenha a sequência e visualize o progresso.

### Produto em ação

A demonstração usará telas realmente implementadas, nesta prioridade:

1. Trilha com etapas concluídas e próximo desafio.
2. Desafio com opções de resposta e feedback pedagógico.
3. Progresso, ranking ou painel do professor sem dados pessoais reais.

As imagens não ficarão em mockups enganosos, não receberão textos ilegíveis por cima nem prometerão recursos inexistentes.

### Conteúdos apresentados

- Organização financeira: planejamento, orçamento, prioridades e reserva.
- Consumo, crédito e dívida: preço, juros, publicidade e endividamento.
- Tributos no cotidiano: função socioeconômica e impacto nas escolhas.
- Serviços públicos e cidadania: direitos, deveres, transparência e participação.
- Riscos e informação: apostas, produtos nocivos, falsas promessas e verificação de informações.

### Públicos e diferenciais

Para estudantes, a página comunicará prática no próprio ritmo, situações próximas da realidade, feedback e progresso. Para educadores, comunicará uso das trilhas em atividades, leitura do progresso da turma e apoio a discussões em sala, sempre conforme o estado real dessas funções.

Os diferenciais permitidos são:

- educação financeira e fiscal no mesmo caminho;
- conteúdo pensado para ensino médio e contexto escolar;
- aprendizagem por desafios e simulações;
- CapiCoins e recompensas sem valor real;
- construção por pesquisa-ação com oficinas, observação, aplicação e melhoria.

### Nossa trajetória

A linha do tempo conterá seis etapas, sem datas ou resultados inventados:

1. Oficina de Educação Financeira e experiências em olimpíadas e desafios de economia.
2. Diagnóstico e roda de conversa sobre consumo, riscos, tributos, fiscalização e transparência.
3. Oficina `O Perigo Doce`.
4. Oficina `O Custo do Vício`.
5. Transformação das oficinas na plataforma Money Rank.
6. Protótipos físico-digitais com MDF, impressão 3D e estudos de integração.

Cada etapa usará data, local, resultado e imagem somente quando houver comprovação. Etapas não concluídas receberão o rótulo `Em desenvolvimento`.

### Pesquisa e fundamento

A seção relacionará educação financeira a recursos, necessidades, riscos e escolhas; educação fiscal a tributos, direitos, deveres, serviços públicos, transparência e participação social.

Banco Central e Receita Federal poderão aparecer como referências institucionais verificáveis, não como selos de aprovação. Enquanto não existir matriz documentada entre módulos e habilidades, será usado `Conteúdos concebidos em diálogo com referências oficiais de educação financeira e cidadania fiscal` no lugar de uma afirmação de alinhamento integral à BNCC.

### Equipe

| Integrante | Função |
| --- | --- |
| Syllas | Professor coordenador |
| Fabio de Lima | Programador |
| Maria Vitória | Programadora |
| Diógenes Melo | Programador |
| Laura Nislyne | Designer |
| Gabriel Holanda | Designer |
| Vitor Gabriel | Designer |

Maria Isabella será removida da landing, incluindo dados, arrays, imports, imagem, texto alternativo e narrativa de origem. Retratos serão reais e autorizados; na ausência deles, serão usados placeholders neutros com iniciais, sem gerar rostos fictícios nem reutilizar fotos.

### FAQ e CTA final

O FAQ responderá para quem é a Money Rank, se há uso de dinheiro real, o que os estudantes aprendem, o que professores conseguem acompanhar no estado atual e qual é a situação real de disponibilidade da plataforma.

O CTA final recomendado é `Acessar a plataforma`, acompanhado da ideia de explorar trilhas, enfrentar desafios e acompanhar a evolução. Se o acesso não estiver efetivamente liberado no momento da implementação, o CTA será substituído por uma ação real como `Conhecer o projeto`, `Participar da validação` ou `Entrar na lista de interesse`.

### Remoções obrigatórias

- Cards flutuantes e seis chips da hero.
- Métricas genéricas `Múltiplas`, `Estatísticas` e `100%`.
- Maria Isabella e suas referências na landing.
- Expressões como `alta precisão pedagógica`, `revolução prática`, `engrenagem completa`, `puro mérito`, `blindando os alunos` e promessas de artigos científicos.
- Selo absoluto de alinhamento à BNCC sem matriz de correspondência.
- Termos internos como `leaderboard` e `painel coletor` quando houver equivalente claro em português.

### Integridade e imagens

- Escrever em português brasileiro, com frases curtas, verbos ativos e vocabulário compreensível.
- Descrever recursos como disponíveis, em piloto ou em desenvolvimento conforme o estado real.
- Não afirmar eficácia, impacto, adesão, número de turmas, prêmio, medalha ou resultado sem fonte e contexto.
- Não chamar CapiCoins de investimento, renda, prêmio financeiro ou moeda com poder de compra.
- Não gerar testemunhos, estatísticas, parceiros, logotipos ou pessoas fictícias.
- Usar registros reais de oficinas e protótipos com data, local, autorização e legenda confirmados.
- Redigir texto alternativo útil e ocultar dados pessoais em capturas do sistema.
- Manter os termos `Money Rank`, `CapiCoins`, `trilhas`, `desafios`, `sequência` e `ranking` consistentes.

## Componentes que devem existir antes das páginas

1. `AppShell`, `SidebarNav`, `MobileNav`, `StatusBar` e `ContextRail`.
2. `PageHeader`, `SectionHeader`, `Surface`, `Panel` e `Divider`.
3. `PrimaryButton`, `SecondaryButton`, `IconButton` e `DangerButton` com estados completos.
4. `MetricTile`, `RewardBadge`, `ProgressBar`, `StreakBadge` e `PhaseBadge`.
5. `TextField`, `Select`, `Textarea`, `Checkbox`, `RadioCard` e mensagens de validação.
6. `Dialog`, `Drawer`, `BottomSheet`, `Tooltip`, `Toast` e `EmptyState`.
7. `DataTable`, filtros, paginação e cards responsivos para dados do professor.
8. Primitivos da trilha: nó, caminho, unidade, bloqueio, conclusão e recompensa.

Cada componente deve usar variantes semânticas; páginas não devem declarar cores hexadecimais nem repetir grandes sequências de classes utilitárias.

## Regras para impedir sobreposições

- Definir tokens únicos para alturas de navegação, larguras de sidebar e espaçamento de conteúdo.
- Definir camadas globais: conteúdo, sticky, navegação, dropdown, backdrop, modal, toast e assistente.
- Proibir `z-index` arbitrário nas páginas.
- Proibir `position: fixed` em conteúdo comum; seu uso fica restrito a navegação, diálogos, toasts e assistente.
- Reservar no `AppShell` o espaço de elementos persistentes; não compensar com `padding` local repetido.
- Elementos decorativos absolutos devem viver dentro de um contêiner com `overflow: clip`, sem participar da leitura nem capturar cliques.
- Drawers e menus fechados devem ser desmontados ou removidos da árvore de acessibilidade e da ordem de foco.
- Textos, números e botões precisam suportar quebra sem colidir com badges ou ícones.
- Tabelas do professor devem ter modo compacto para celular em vez de apenas overflow horizontal sem contexto.

## Fases de execução

### Fase 0 — Baseline e proteção do escopo

- Registrar screenshots das rotas existentes nos breakpoints definidos.
- Catalogar componentes, cores, tipografia, espaçamentos e posicionamentos legados.
- Marcar a landing como fora do escopo de implementação.
- Criar uma matriz rota × estado: carregando, vazio, sucesso, erro, bloqueado e modal aberto.

**Saída:** inventário visual e lista reproduzível de defeitos.

### Fase 1 — Fundação do design system

- Substituir os tokens atuais por tokens semânticos centralizados.
- Sincronizar Tailwind, CSS global e tema do Material UI.
- Definir tipografia, escala de espaço, raios, bordas, sombras, movimento e camadas.
- Criar uma página interna de catálogo visual para validar componentes isoladamente.

**Saída:** uma única fonte de verdade visual, sem hexadecimais espalhados pelas páginas.

### Fase 2 — Primitivos e estados compartilhados

- Construir botões, campos, superfícies, indicadores, feedbacks e overlays.
- Incluir estados hover, active, focus-visible, disabled, loading e error.
- Validar contraste, teclado, leitores de tela e redução de movimento.

**Saída:** biblioteca reutilizável pronta para as jornadas.

### Fase 3 — Novo shell do produto

- Trocar a TopBar horizontal desktop pela composição sidebar + conteúdo + rail contextual.
- Manter navegação inferior no mobile, agora derivada da mesma configuração de rotas.
- Criar variante de navegação do professor dentro do mesmo shell.
- Resolver offsets, scroll independente, sticky e zonas do CapiMentor.

**Saída:** estrutura responsiva comum para aluno e professor.

### Fase 4 — Autenticação e perfil inicial

- Redesenhar login, loading de autenticação, erros e completar perfil.
- Introduzir personalidade visual com Capi e microcopy, sem sobrecarregar a tarefa.
- Remover a combinação legada amarelo/slate.

**Saída:** entrada do sistema coerente com o produto interno.

### Fase 5 — Núcleo do aluno

- Redesenhar dashboard com uma missão primária e progresso visível.
- Migrar ranking e perfil para layouts dedicados, evitando grades genéricas de cards.
- Transformar métricas em elementos de jogo com significado, ilustração e feedback.

**Saída:** Home, Ranking e Perfil com identidade própria do Money Rank.

### Fase 6 — Trilha e atividades

- Reorganizar o hub como caminho visual de progressão, com nós, unidades e bloqueios claros.
- Padronizar conteúdo, abas, fontes, checklists e ações de conclusão.
- Migrar todos os runners de atividade para um shell único de pergunta, resposta, feedback e resultado.
- Remover implementações paralelas ainda baseadas em amarelo/slate.

**Saída:** jornada pedagógica contínua do hub até o resultado da atividade.

### Fase 7 — Área do professor

- Colocar Dashboard, Estúdio e Teste no mesmo `AppShell`.
- Criar visão orientada a tarefas: resumo da turma, alertas, ações rápidas e dados detalhados.
- Padronizar tabelas, filtros, formulários extensos e editores.
- Migrar CompetitionPeriodManager, TeacherDataChat, TestModePanel, SystemDiagnosticsPanel e todos os componentes do Studio.
- Remover o violeta e o amarelo como temas paralelos.

**Saída:** área do professor reconhecível como parte do Money Rank, com maior densidade sem perder legibilidade.

### Fase 8 — Overlays e conflitos de posicionamento

- Consolidar CapiMentor, chat do professor, modais, drawers e toasts no sistema de camadas.
- Executar cenários combinados: menu + mentor, modal + teclado, bottom nav + sheet, sidebar + rail e mensagens longas.
- Corrigir foco, scroll lock, safe area, clipping e portais.

**Saída:** nenhuma sobreposição acidental em cenários suportados.

### Fase 9 — Remoção do legado e QA sistêmico

- Eliminar cores, superfícies e componentes antigos não utilizados.
- Impedir novos valores visuais arbitrários com lint ou convenção automatizada.
- Testar todas as rotas em 360, 390, 768, 1024, 1280, 1440 e 1920 px.
- Testar zoom de 200%, navegação por teclado, contraste, textos longos e dados vazios.
- Executar lint, build, testes existentes e regressão visual.

**Saída:** frontend padronizado, responsivo e sem dois design systems coexistindo.

### Fase 10 — Landing page

- Executar depois da fundação do design system e dos componentes-base.
- Remover hero e métricas atuais que conflitam com o briefing.
- Implementar as treze seções na ordem definida no plano incorporado.
- Produzir as três demonstrações do produto a partir de telas reais já migradas para o novo visual.
- Implementar a linha do tempo com evidências reais e placeholders explícitos para dados pendentes.
- Atualizar a equipe para os sete integrantes definidos e remover Maria Isabella da landing.
- Revisar cada afirmação de disponibilidade, pesquisa, premiação e alinhamento curricular.
- Validar âncoras, headings, foco, contraste, textos alternativos, privacidade e responsividade.
- Executar lint, testes, build e regressão visual antes da entrega.

## Ordem sugerida de entregas

| Entrega | Conteúdo | Dependência |
| --- | --- | --- |
| 1 | Auditoria + tokens + catálogo | Nenhuma |
| 2 | Primitivos + AppShell responsivo | Entrega 1 |
| 3 | Login + completar perfil + Home do aluno | Entrega 2 |
| 4 | Ranking + perfil + navegação | Entrega 3 |
| 5 | Hub da trilha + conteúdos | Entrega 2 |
| 6 | Atividades + feedback + resultados | Entrega 5 |
| 7 | Dashboard do professor | Entrega 2 |
| 8 | Estúdio + teste + ferramentas do professor | Entrega 7 |
| 9 | Overlays + regressão + remoção do legado | Entregas 3–8 |
| 10 | Landing page | Entregas 1–2, briefing editorial recebido e evidências reais disponíveis |

## Critérios de aceite globais

- Todas as rotas internas usam o mesmo design system e o mesmo shell responsivo.
- Nenhuma página contém cores de marca hardcoded; exceções documentadas são permitidas apenas para dados e estados semânticos.
- Área do aluno e área do professor parecem modos do mesmo produto.
- Não há conteúdo escondido por navegação, assistente, sticky headers, drawers ou teclado virtual.
- Componentes interativos têm foco visível, área mínima de toque e estados de uso completos.
- O layout funciona sem scroll horizontal nos breakpoints suportados, exceto componentes de dados explicitamente projetados para isso.
- Menus e modais fechados não ficam acessíveis ao teclado ou leitores de tela.
- A interface apresenta identidade Money Rank por meio de Capi, CapiCoins, trilhas, missões, turmas e impacto fiscal — não apenas por meio da cor verde.
- A landing identifica produto, público e benefício antes da primeira rolagem, sem cards flutuantes ou excesso de rótulos.
- A landing demonstra ao menos trilha, desafio com feedback e progresso usando telas reais e sem dados pessoais.
- A trajetória apresenta somente eventos comprováveis; dados ausentes ou etapas abertas ficam explicitamente pendentes ou em desenvolvimento.
- A equipe da landing contém os sete integrantes definidos, com funções e imagens consistentes.
- A copy não contém métricas genéricas, promessas de eficácia, medalhas ou alinhamento curricular sem evidência.
- Lint, build, testes funcionais e regressão visual passam antes da conclusão.

## Dívida visual já identificada

- `theme.js` ainda define amarelo e slate como tema primário do Material UI.
- `Layout` ainda usa o fundo legado e limita todo o conteúdo a uma coluna estreita.
- A área do professor usa grande quantidade de amarelo, slate e violeta sem compartilhar o shell do aluno.
- Login, estados protegidos e diversos componentes de trilha continuam no visual antigo.
- CapiMentor mistura os estilos novo e antigo e disputa espaço com a navegação inferior.
- O projeto possui várias declarações locais de `fixed`, `absolute`, `sticky` e `z-index`, sem uma política global de camadas.
- A landing possui um menu móvel fechado que continua presente na árvore de acessibilidade; a correção estrutural pode ser feita depois, junto de seu redesign específico.
