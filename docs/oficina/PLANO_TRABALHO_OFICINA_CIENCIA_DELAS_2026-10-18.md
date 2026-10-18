# Plano de trabalho — Oficina Ciência Delas

**Projeto:** Money Rank  
**Branch de trabalho:** `feat/oficina-ciencia-delas-redesign`  
**Base:** `origin/new/redesign-sistemico` (`e6d7e44`)  
**Data do plano:** 18 de outubro de 2026  
**Estado:** planejamento aprovado antes da implementação

## 1. Objetivo

Preparar uma experiência isolada para uma oficina de 1 hora e 40 minutos sobre
educação fiscal no cotidiano, no empreendedorismo e na ciência, com recorte
voltado às mulheres e ao tema **Ciência Delas**.

O professor deverá criar equipes na hora, compartilhar um código numérico de
oito dígitos ou um QR Code e acompanhar uma competição individual e por equipe.
Quem entrar por um código da oficina verá somente a trilha da oficina. A trilha
regular continuará disponível apenas para participantes regulares.

A entrega também retirará as experiências de inteligência artificial do fluxo
ativo e acrescentará uma visão segura de aluno para o professor testar a
oficina sem alterar pontos, progresso ou ranking oficiais.

## 2. Diagnóstico da versão atual

A versão redesenhada já oferece uma base útil que deve ser estendida, não
substituída:

- autenticação Google pelo Firebase Auth;
- perfis de aluno e professor;
- frontend React/Vite com shell responsivo;
- API principal em Express no Render;
- Firebase SQL Connect/PostgreSQL como Capi Bank;
- sessões de atividade e correção autoritativa no servidor;
- períodos competitivos controlados pelo professor;
- livro-caixa auditável de CapiCoins;
- ranking individual e por turma;
- modo de teste do professor isolado por `test_run_id`;
- banco pedagógico com payload público e gabarito privado.

Há três limitações centrais para a oficina:

1. o perfil exige uma das turmas fixas `3º DSA` ou `3º DSB`;
2. o ranking e a trilha pressupõem o piloto regular por turma e por fase;
3. IA ainda aparece no aluno, no professor, nos diagnósticos, nas Functions,
   na API Render, nas dependências, nos scripts e nos documentos.

Também existem dois caminhos de backend parcialmente paralelos — Cloud
Functions e API Render. As novas regras deverão ter uma fonte autoritativa
clara e a remoção de IA deverá alcançar os dois caminhos para não deixar
funções órfãs ou documentação enganosa.

## 3. Decisões de arquitetura

### 3.1 Preservar o sistema regular

`3º DSA` e `3º DSB` não serão removidos globalmente. Eles continuarão válidos
para o fluxo regular. A oficina usará uma matrícula específica em equipe e uma
turma textual, evitando alterar o histórico existente.

### 3.2 Separar oficina e trilha regular por autorização

O bloqueio não será apenas visual. A API verificará a matrícula ativa:

- participante com matrícula de oficina: acessa a trilha da oficina;
- participante regular: acessa a trilha regular;
- professor em modo de teste: acessa uma prévia isolada;
- tentativa de abrir uma rota incompatível: redirecionamento e resposta de
  acesso negado na API.

### 3.3 Ligar equipes ao período competitivo

Cada equipe pertencerá a um período competitivo. Isso permite criar as equipes
na hora, calcular o ranking somente na janela escolhida pelo professor e
preservar o histórico depois do encerramento.

### 3.4 Pontuação simples e comparável

Cada rodada válida das quatro atividades deverá gerar CapiCoins durante a
janela da competição. A disputa será por desempenho e quantidade de rodadas
concluídas dentro do tempo definido pelo professor.

- toda submissão válida pontua, inclusive repetições da mesma atividade;
- cada nova rodada recebe uma sessão própria e pode gerar CapiCoins;
- a mesma sessão só pode ser creditada uma vez, mesmo se a rede reenviar a
  requisição;
- a regra inicial será direta: a pontuação da rodada, de 0 a 100, será a
  quantidade de CapiCoins creditada; os quatro formatos terão a mesma escala;
- não será necessário atingir uma nota mínima para a rodada entrar na disputa:
  menos acertos geram menos CapiCoins, sem bloquear novas tentativas;
- o ranking individual soma todas as CapiCoins válidas durante o período;
- o ranking de equipe soma as CapiCoins válidas de seus integrantes;
- não haverá teto de repetições pontuadas durante a janela da oficina;
- não haverá multiplicador de sequência, recompensa de conteúdo ou bônus
  oculto no ranking da oficina;
- como a divisão será feita com equipes do mesmo tamanho, não haverá média ou
  normalização por participante nesta primeira oficina.

### 3.5 QR Code como atalho, código como contingência

O código manual de oito dígitos será o mecanismo obrigatório. O QR Code
codificará um endereço do próprio Money Rank com o código da equipe, por
exemplo `.../login?team=12345678`.

O fluxo deverá preservar esse código durante login e completar perfil. A
leitura por câmera terá fallback explícito para digitação, garantindo que
incompatibilidade de navegador ou permissão de câmera não bloqueie a oficina.

### 3.6 Sem IA em tempo de execução

O banco de questões será curado, versionado e baseado em fontes oficiais. A
geração, seleção, correção e explicação das atividades não dependerá de IA.
Registros históricos que mencionem `GEMINI` poderão ser preservados apenas
quando sua remoção quebrar dados antigos; eles não aparecerão como opção ativa.

## 4. Modelo de dados proposto

O schema deverá crescer de modo compatível, sem apagar tabelas ou enums atuais.

### 4.1 Perfil

Adicionar ao usuário, ou a uma extensão de perfil equivalente:

- `fullName`: nome completo para identificação do cadastro;
- `preferredName`: apelido ou nome preferido já existente;
- `schoolClassLabel`: turma informada livremente na oficina;
- `enrollmentMode`: `REGULAR` ou `WORKSHOP`;
- manter `classGroup` opcional para `THIRD_DSA` e `THIRD_DSB`.

O nome completo não deverá aparecer no ranking público. O ranking mostrará
somente nome preferido e avatar.

### 4.2 Equipe da oficina

Criar `WorkshopTeam` com:

- identificador UUID;
- período competitivo;
- nome da equipe;
- código numérico único de oito dígitos;
- estado ativo/inativo;
- limite opcional de integrantes;
- professor criador;
- data de criação e atualização.

Os códigos serão gerados com aleatoriedade criptográfica, validados no servidor
e nunca listados em uma operação de aluno.

### 4.3 Matrícula na oficina

Criar `WorkshopMembership` com:

- aluno;
- equipe;
- período competitivo;
- turma textual informada no cadastro;
- estado da matrícula;
- data de entrada.

Uma chave composta aluno + período impedirá participação simultânea em duas
equipes da mesma competição. Mudanças de equipe deverão ser uma ação explícita
do professor e ficar auditáveis.

### 4.4 Banco e resultados da oficina

O banco pedagógico atual pode ser estendido com identificadores próprios da
oficina, desde que os quatro formatos recebam contratos claros. Também serão
necessários:

- sessão autoritativa de atividade vinculada à matrícula e ao período;
- tentativa append-only para auditoria e repetição;
- transação de CapiCoins idempotente por sessão concluída;
- itens já vistos para reduzir repetição até o banco ser esgotado;
- fonte, instituição, URL, explicação e versão em cada item.

O gabarito e as pontuações permanecerão acessíveis somente ao backend.

## 5. Fluxos funcionais

### 5.1 Professor cria a competição

1. Criar ou selecionar um período com início e fim da oficina.
2. Abrir a área **Equipes da oficina**.
3. Criar as equipes necessárias.
4. Receber para cada equipe:
   - nome;
   - código de oito dígitos;
   - QR Code;
   - contador de participantes.
5. Projetar, imprimir ou compartilhar o QR Code.
6. Ativar o período quando a competição começar.

### 5.2 Aluno entra por código ou QR Code

1. Abrir o link ou escanear o QR Code.
2. Entrar com Google.
3. Completar o cadastro com:
   - nome completo;
   - turma;
   - apelido/nome preferido;
   - código da equipe;
   - leitura opcional do QR Code;
   - avatar.
4. A API valida código, equipe, período, capacidade e matrícula duplicada.
5. O aluno é matriculado e direcionado à trilha da oficina.
6. A trilha regular permanece bloqueada para essa matrícula.

### 5.3 Trilha da oficina

O hub da oficina terá uma introdução curta e opcional, seguida de quatro
atividades independentes. Nenhum vídeo será pré-requisito para responder.

1. **Verdadeiro ou falso** — afirmações contextualizadas e explicação após o
   envio.
2. **Ligar colunas** — associação entre conceito, situação, tributo, direito ou
   consequência.
3. **Completar frases** — lacunas com opções controladas para evitar correção
   ambígua de texto livre.
4. **Quiz** — múltipla escolha com situações do cotidiano, empreendedorismo,
   ciência e tecnologia.

Cada atividade terá rota, sessão, resultado e botão de repetição próprios.

### 5.4 Ranking

A página da oficina terá duas abas:

- **Individual:** apelido, avatar, equipe e soma dos resultados oficiais;
- **Equipes:** posição, equipe, quantidade de integrantes e soma dos pontos.

O recorte será sempre o período da oficina associado à matrícula. Dados de
DSA/DSB, conteúdo regular, streak e testes do professor não entrarão nessa
classificação.

### 5.5 Professor testa como aluno

O modo atual de teste será ampliado para uma verdadeira **Visão do aluno**:

- botão visível no painel do professor;
- banner persistente avisando que é uma simulação;
- acesso ao hub e às quatro atividades da oficina;
- mesma seleção e correção do banco real;
- sessões e tentativas marcadas com `is_test` e `test_run_id`;
- nenhum efeito em saldo, matrícula, progresso ou ranking;
- ação clara para voltar à visão do professor;
- expiração e limpeza controladas pelo painel existente.

## 6. Banco pedagógico

### 6.1 Quantidade inicial

Preparar pelo menos 96 itens, distribuídos assim:

- 24 itens de verdadeiro ou falso;
- 24 associações para ligar colunas;
- 24 frases com lacunas;
- 24 questões de múltipla escolha.

O sorteio deverá equilibrar dificuldade e tema, evitar itens vistos até o ciclo
se esgotar e permitir novas rodadas sem conceder pontos extras.

### 6.2 Eixos de conteúdo

- tributos e documentos fiscais no cotidiano;
- relação entre arrecadação, políticas públicas e cidadania;
- direitos do consumidor e combate à desinformação fiscal;
- formalização, MEI e obrigações básicas de pequenos negócios;
- empreendedorismo feminino e barreiras de participação;
- trabalho de cuidado e desigualdades de tempo e renda;
- mulheres na ciência, tecnologia e inovação;
- financiamento, compras, pesquisa e incentivos com linguagem adequada ao
  ensino médio;
- Reforma Tributária apenas em pontos confirmados e com indicação de vigência.

### 6.3 Política de fontes

Priorizar Receita Federal, Portal do Empreendedor, Planalto, Tesouro Nacional,
IBGE, CNPq, MCTI, Banco Central e outras fontes públicas primárias. Cada fato
deverá guardar:

- afirmação utilizada;
- instituição;
- título da página ou publicação;
- URL direta;
- data de acesso;
- observação pedagógica;
- alerta temporal quando a regra puder mudar.

Nenhuma estatística, obrigação legal ou regra tributária será tratada como
permanente sem revisão da fonte.

## 7. Retirada da IA

A remoção será feita por camada.

### 7.1 Frontend

- retirar `CapiMentor` do layout;
- retirar `TeacherDataChat` do painel;
- remover serviços, diálogos, textos, botões e estados exclusivos dessas IAs;
- retirar a prova do Gemini dos diagnósticos;
- substituir referências visuais a “mentora IA” por uma Capi institucional
  neutra quando a imagem ainda for necessária;
- confirmar que nenhuma atividade ativa chama `perigoDoceAiService`.

### 7.2 API Render e Cloud Functions

- remover endpoints/actions de mentor e chat de dados;
- remover a rota de diagnóstico `gemini-probe`;
- remover importações e exports correspondentes nas Functions;
- remover `@google/genai` das dependências quando nenhum uso ativo restar;
- remover configuração de `GEMINI_API_KEY` e `GEMINI_MODEL`;
- ajustar healthcheck, logs e códigos de erro;
- manter somente análise determinística do painel do professor.

### 7.3 Infraestrutura, testes e documentação

- limpar `render.yaml`, exemplos de ambiente e script dos emuladores;
- remover testes exclusivos de IA e criar testes que comprovem a ausência dos
  endpoints;
- atualizar manuais, contexto geral, checklist e guias de demonstração;
- preservar documentação histórica em arquivo somente se for claramente
  marcada como descontinuada.

## 8. Etapas de implementação

### Etapa 0 — Baseline e proteção

- confirmar branch e diretório canônico;
- executar testes, lint, build e compilação do Data Connect antes de alterar;
- registrar falhas preexistentes separadamente;
- criar a matriz de requisitos e critérios de aceite.

**Saída:** baseline reproduzível sem mudanças funcionais.

### Etapa 1 — Remoção da IA ativa

- remover UI, endpoints, dependências, secrets e diagnósticos;
- manter o restante do painel e das atividades funcionando;
- atualizar testes afetados.

**Saída:** sistema funcional sem chamadas, botões ou configuração de IA.

### Etapa 2 — Schema da oficina e operações seguras

- adicionar perfil ampliado, equipes, matrículas, sessões e resultados;
- criar operações de aluno filtradas por `auth.uid`;
- criar operações administrativas `NO_ACCESS` ou autorizadas por papel;
- impedir duplicidade de resultado e matrícula por restrições do banco;
- compilar o conector e revisar o SQL diff.

**Saída:** modelo relacional validado e compatível com os dados atuais.

### Etapa 3 — API de equipes, códigos e QR Code

- gerar códigos criptograficamente seguros;
- criar, listar, ativar e desativar equipes como professor;
- validar entrada por código de modo atômico;
- gerar QR Code com link do próprio sistema;
- implementar leitor com fallback manual;
- preservar o código pelo login Google.

**Saída:** professor cria equipes e aluno entra com código ou QR.

### Etapa 4 — Cadastro adaptativo

- separar nome completo de nome preferido;
- permitir turma textual na oficina;
- manter DSA/DSB no cadastro regular;
- incluir equipe e avatar;
- adaptar cache local, mapeadores, contexto de autenticação e mensagens;
- ocultar dados pessoais no ranking.

**Saída:** onboarding regular e onboarding da oficina coexistem.

### Etapa 5 — Banco de questões e importação

- estruturar os 96 itens com fontes e gabaritos privados;
- validar duplicidade, dificuldade, formato e links;
- criar importação idempotente e relatório da carga;
- criar dados locais de teste.

**Saída:** banco grande, auditável e reproduzível.

### Etapa 6 — Trilha e quatro atividades

- criar hub exclusivo da oficina;
- implementar os quatro runners separados sobre um shell comum;
- permitir acesso direto às atividades sem concluir conteúdo ou vídeo;
- sortear itens com baixa repetição;
- exibir feedback e fontes após o envio;
- liberar novas rodadas pontuadas enquanto o período estiver aberto.

**Saída:** jornada completa do aluno para a oficina.

### Etapa 7 — Pontuação e rankings

- registrar e premiar cada nova sessão concluída;
- impedir crédito duplicado somente para o reenvio da mesma sessão;
- calcular a recompensa conforme o desempenho da rodada;
- somar todas as CapiCoins individuais obtidas durante o período;
- somar todas as CapiCoins dos integrantes da equipe;
- filtrar pelo período da oficina;
- integrar as duas abas do ranking;
- adaptar o painel e a exportação do professor.

**Saída:** competição individual e por equipe auditável.

### Etapa 8 — Visão do aluno para o professor

- ampliar o modo de teste existente;
- criar entrada e saída claras da visão simulada;
- cobrir hub, atividades e resultados;
- comprovar isolamento de pontos e ranking.

**Saída:** professor consegue testar a experiência completa com segurança.

### Etapa 9 — Documentos e operação da oficina

Produzir dois documentos principais em Markdown e DOCX:

1. **Base pedagógica e fontes da oficina**
   - conceitos e fatos usados;
   - organização por tema;
   - links oficiais com descrição;
   - observações de vigência e limites;
   - catálogo das atividades e exemplos sem expor todo o gabarito aos alunos.

2. **Fluxo de execução da oficina**
   - preparação antes do evento;
   - criação de período e equipes;
   - cadastro por código/QR;
   - condução sugerida dos 100 minutos;
   - monitoramento, ranking, desempate e premiação;
   - plano B para câmera, internet ou dispositivo;
   - roteiro de teste do professor;
   - checklist de encerramento e exportação.

Os DOCX serão renderizados e revisados visualmente antes da entrega.

### Etapa 10 — QA final e ensaio

- executar testes unitários e de integração;
- testar com dados locais de múltiplas equipes;
- validar dois logins simultâneos e concorrência de submissão;
- testar celular, desktop, câmera negada e código digitado;
- verificar que DSA/DSB continuam funcionando;
- verificar que não há vestígio ativo de IA;
- executar ensaio completo de 100 minutos em tempo reduzido;
- revisar acessibilidade, privacidade e mensagens de erro.

**Saída:** versão pronta para teste guiado antes da oficina.

## 9. Roteiro operacional sugerido para 1h40

| Janela | Atividade |
| --- | --- |
| 0–10 min | Apresentação, divisão das equipes e exibição dos QR Codes |
| 10–20 min | Login, cadastro e conferência dos integrantes |
| 20–30 min | Introdução curta à educação fiscal e ao tema Ciência Delas |
| 30–70 min | Rodízio livre pelas quatro atividades |
| 70–85 min | Repetição, recuperação e disputa final |
| 85–95 min | Fechamento do período e apresentação dos rankings |
| 95–100 min | Síntese, desempate se necessário e premiação |

O sistema deverá permitir reduzir a introdução e ampliar a disputa caso o
cadastro consuma mais tempo que o previsto.

## 10. Estratégia de testes

### Banco e API

- código sempre numérico, oito dígitos e único;
- código inexistente, expirado ou inativo recusado;
- matrícula duplicada e troca indevida de equipe recusadas;
- somente professor autorizado cria ou altera equipe;
- aluno acessa apenas os próprios dados e a classificação pública mínima;
- gabarito nunca aparece no payload público;
- cada nova sessão concluída gera CapiCoins conforme o desempenho;
- reenvios concorrentes da mesma sessão geram no máximo um crédito;
- repetições em novas sessões continuam pontuando durante o período ativo;
- submissões fora da janela não entram no ranking da oficina;
- tentativa de teste nunca altera resultados oficiais.

### Frontend

- QR com câmera permitida, negada e indisponível;
- código preservado durante redirecionamento de login;
- cadastro regular e cadastro da oficina;
- bloqueio cruzado entre trilha regular e oficina;
- quatro formatos em telas pequenas;
- estados carregando, vazio, erro, concluído e repetição;
- entrada e saída da visão do aluno.

### Regressão

- lint e build do frontend;
- testes da API Render;
- testes das Functions remanescentes;
- `dataconnect:compile`;
- geração e revisão dos SDKs Web/Admin;
- SQL diff revisado sem `--force`;
- testes existentes de perfil, trilha, períodos e ranking.

## 11. Sequência de commits

Os commits devem ser pequenos e verificáveis. Ordem sugerida:

1. `docs: planejar adaptacao para oficina ciencia delas`
2. `refactor: retirar experiencias de ia do fluxo ativo`
3. `feat: modelar equipes e matriculas da oficina`
4. `feat: adicionar cadastro por codigo e qr code`
5. `feat: criar banco pedagogico da oficina`
6. `feat: implementar quatro atividades da oficina`
7. `feat: adicionar ranking individual e por equipes`
8. `feat: ampliar visao de aluno para o professor`
9. `docs: entregar base pedagogica e fluxo da oficina`
10. `test: validar jornada completa da oficina`

Nenhum commit da branch antiga será mesclado ou aplicado por cherry-pick. O
conteúdo pedagógico poderá ser reavaliado e reescrito sobre a arquitetura atual.

## 12. Limites desta entrega

- ranking normalizado para equipes de tamanhos diferentes;
- criação automática de questões por IA;
- aplicativo móvel nativo;
- substituição completa do Estúdio do Professor.

## 13. Critérios de conclusão

A adaptação estará pronta quando:

- o professor criar período e equipes sem usar terminal;
- cada equipe possuir código de oito dígitos e QR Code funcional;
- o aluno completar todos os campos pedidos e entrar na equipe correta;
- participantes da oficina não acessarem a trilha regular;
- as quatro atividades estiverem separadas e acessíveis sem vídeo obrigatório;
- o banco possuir ao menos 96 itens revisados e documentados;
- toda nova rodada válida gerar CapiCoins durante o período ativo;
- reenvios da mesma sessão não duplicarem a recompensa;
- rankings individual e por equipe somarem todas as CapiCoins válidas do
  período;
- a visão do aluno do professor estiver isolada dos dados reais;
- não houver IA ativa, chave Gemini obrigatória ou dependência GenAI em uso;
- o fluxo regular de DSA/DSB continuar funcionando;
- os dois documentos finais estiverem renderizados e revisados;
- os testes, lint, build e compilação do Data Connect passarem;
- a oficina completa puder ser ensaiada localmente antes do evento.
