# Fluxo de execução da oficina Ciência Delas

**Projeto:** Money Rank  
**Duração total:** 1 hora e 40 minutos  
**Público:** professor responsável, apoio de sala e equipe técnica  
**Data de revisão:** 20 de outubro de 2026

## Resultado esperado

O professor cria a competição e as equipes antes ou no início da oficina. Cada equipe recebe um código numérico de oito dígitos e um QR Code. Os alunos entram com Google, informam nome completo, turma, nome preferido, equipe e avatar, e passam a ver somente a trilha Ciência Delas. Durante a janela definida pelo professor, cada nova rodada concluída gera CapiCoins de acordo com a nota. O ranking individual e o ranking por equipes somam esses créditos.

O fluxo regular de 3º DSA e 3º DSB continua separado. A oficina não depende de vídeos e não usa inteligência artificial em tempo de execução.

## Responsabilidades

| Papel | Antes da oficina | Durante a oficina | Encerramento |
| --- | --- | --- | --- |
| Professor | Criar período, oficina e equipes; testar a trilha | Explicar regras, acompanhar equipes e controlar o tempo | Encerrar o período, conferir rankings e conduzir a premiação |
| Apoio de sala | Separar dispositivos e conferir internet | Ajudar no login, código e recuperação de acesso | Registrar ocorrências e apoiar o desempate |
| Aluno | Ter acesso à conta Google quando possível | Entrar na equipe correta e concluir rodadas | Conferir o resultado e participar da síntese |
| Equipe técnica | Iniciar emuladores ou ambiente publicado e fazer teste rápido | Monitorar erros sem alterar pontuação manualmente | Salvar evidências e registrar correções necessárias |

## Preparação no dia anterior

1. Confirmar que a branch da oficina está no commit aprovado e que o frontend, a API e o Capi Bank iniciam sem erro.
2. Criar um período competitivo com horário de Fortaleza, começo antes do bloco competitivo e fim próximo ao encerramento.
3. Abrir a seção Equipes da oficina no painel do professor e criar a oficina vinculada ao período.
4. Criar a quantidade planejada de equipes. Usar nomes curtos, distintos e fáceis de anunciar.
5. Salvar ou imprimir os QR Codes e anotar os códigos de oito dígitos como contingência.
6. Ativar o modo de teste do professor e abrir Visão do aluno.
7. Concluir uma rodada de cada atividade e confirmar que o teste informa zero CapiCoins oficiais.
8. Abrir o sistema em pelo menos um celular e um computador.
9. Conferir as fontes, o relógio do computador e o acesso Google.
10. Preparar prêmios e definir o critério de desempate antes de anunciar as regras.

## Criação do período e das equipes

1. Entrar com a conta de professor e abrir Visão da turma.
2. Criar ou selecionar o período competitivo.
3. Definir nome, início e fim. O período precisa estar ativo no momento das atividades para aceitar pontuação.
4. Na seção Equipes da oficina, criar o evento Ciência Delas para esse período.
5. Criar uma equipe por grupo de alunos.
6. Conferir para cada equipe o nome, o código de oito dígitos e o QR Code.
7. Projetar um QR Code de cada vez ou distribuir cartões separados para evitar entrada na equipe errada.

O QR Code abre um endereço do próprio Money Rank com o código da equipe. Na página de cadastro, o aluno pode tocar em **Ler QR Code da equipe**, autorizar a câmera e apontar para o código exibido pelo professor. O código permanece preenchido mesmo quando o aluno precisa entrar com Google. A digitação dos oito dígitos continua disponível como contingência.

Uma equipe criada por engano pode ser apagada no painel enquanto ainda estiver vazia. A exclusão pede confirmação e invalida imediatamente o código e o QR Code. Depois que houver participante, a equipe fica protegida para preservar respostas e ranking.

## Cadastro dos alunos

1. O aluno abre o link do QR Code ou a página de login.
2. Entra com Google.
3. Preenche nome completo para identificação interna.
4. Informa a turma em texto livre.
5. Escolhe o nome preferido que aparecerá no ranking.
6. Lê o QR Code pela câmera incorporada ou digita o código da equipe.
7. Seleciona um avatar.
8. Envia o cadastro e confere o nome da equipe na trilha.

O nome completo não aparece no ranking público. Depois da entrada, o aluno não pode trocar de equipe pelo próprio cadastro. Essa regra evita mudanças durante a disputa. Uma correção excepcional deve ser tratada pelo professor ou pela equipe técnica antes da pontuação.

## Roteiro dos 100 minutos

| Tempo | Condução | Resultado esperado |
| --- | --- | --- |
| 0 a 10 min | Apresentar a proposta, dividir grupos e entregar QR Codes ou códigos | Todos sabem sua equipe e as regras básicas |
| 10 a 20 min | Fazer login e completar o cadastro | Participantes aparecem nas equipes corretas |
| 20 a 30 min | Conversa curta sobre tributos, cotidiano, empreendedorismo e mulheres na ciência | Turma compreende o contexto das atividades |
| 30 a 70 min | Rodízio livre pelas quatro atividades | Equipes acumulam CapiCoins em formatos variados |
| 70 a 85 min | Repetições e disputa final | Participantes recuperam conceitos e ampliam pontuação |
| 85 a 95 min | Encerrar o período e projetar rankings | Resultado fica congelado para conferência |
| 95 a 100 min | Aplicar desempate se necessário, premiar e fazer síntese | Oficina termina com resultado e aprendizagem retomada |

Se o cadastro ultrapassar dez minutos, reduzir a introdução e preservar pelo menos 45 minutos de competição. Os alunos podem iniciar qualquer atividade sem assistir vídeos ou concluir conteúdos.

## Regras da competição

- As atividades são Verdadeiro ou falso, Ligar colunas, Completar frases e Quiz Ciência Delas.
- Cada rodada apresenta seis desafios e produz nota de zero a cem.
- A quantidade de CapiCoins da rodada é igual à nota obtida.
- Toda nova rodada concluída durante a janela pontua, inclusive repetições da mesma atividade.
- O reenvio da mesma sessão por falha de rede não duplica a recompensa.
- Não há nota mínima para continuar, teto de repetições, multiplicador de sequência ou bônus oculto.
- O ranking individual soma as CapiCoins de cada participante no período.
- O ranking da equipe soma as CapiCoins de seus integrantes no mesmo período.
- Para esta oficina, as equipes devem ter o mesmo tamanho. O sistema soma pontos e não normaliza por quantidade de integrantes.

## Critério de desempate recomendado

O sistema usa a soma de CapiCoins como critério principal. Se houver empate na premiação, aplicar nesta ordem:

1. maior número de acertos em uma rodada extra anunciada pelo professor;
2. menor tempo para concluir a rodada extra, observado pelo professor;
3. pergunta oral baseada nas fontes da oficina;
4. sorteio somente se o empate permanecer.

A rodada de desempate deve ocorrer depois do encerramento do período para não alterar a classificação acumulada. O professor registra o resultado separadamente.

## Visão do aluno para o professor

1. No painel do professor, localizar Modo de teste do professor.
2. Definir duração entre 5 e 120 minutos e ativar o teste.
3. Selecionar Abrir Visão do aluno ou usar o item correspondente no menu.
4. Navegar entre Atividades e Conteúdos.
5. Abrir e concluir as quatro atividades.
6. Confirmar a mensagem Sem CapiCoins no teste em cada resultado.
7. Voltar ao painel do professor.
8. Encerrar o modo de teste e, depois, limpar os dados dessa execução.

As sessões de teste usam o mesmo banco e a mesma correção da oficina, mas recebem identificação de teste. Elas não alteram saldo, matrícula, progresso nem ranking oficial.

## Acompanhamento durante a disputa

O professor deve observar o contador de participantes por equipe e abrir o ranking somente depois que a maioria terminar a primeira rodada. Mostrar a classificação o tempo todo pode desestimular quem teve dificuldades no cadastro. Uma boa cadência é projetar o ranking aos 55 minutos, novamente aos 75 minutos e no encerramento.

Erros conceituais recorrentes podem ser retomados sem revelar respostas das rodadas ainda abertas. O feedback individual já mostra uma explicação e a fonte depois da submissão.

## Planos de contingência

### QR Code não abre

Digitar o código de oito dígitos. Conferir se todos os algarismos foram informados e se a equipe pertence ao período correto.

### Câmera sem permissão

Permitir a câmera nas configurações do navegador e tentar novamente. Se a permissão continuar indisponível, digitar o código de oito dígitos; a oficina não depende da câmera para continuar.

### Login Google falha

Trocar de navegador, conferir a internet e evitar janela anônima com cookies bloqueados. Se não houver recuperação rápida, colocar o participante em dupla e registrar a ocorrência.

### Internet fica instável

Pedir que os alunos aguardem antes de reenviar. O servidor impede crédito duplicado da mesma sessão. Manter os códigos visíveis e evitar recarregar a página durante uma submissão.

### Um aluno entrou na equipe errada

Interromper a pontuação desse aluno e chamar a equipe técnica. O cadastro impede troca autônoma. Não criar outra conta depois que houver pontos sem antes registrar a ocorrência.

### Ambiente local não inicia

Conferir Node 22, Java 21 ou superior e portas dos emuladores. Iniciar primeiro o Firebase e depois a API e o frontend. Usar os comandos registrados em `docs/COMO_RODAR_LOCALMENTE.md`.

### Ranking parece congelado

Atualizar a página e confirmar se o período ainda está aberto. Submissões fora da janela não pontuam. Não alterar pontos diretamente no banco durante a oficina.

## Checklist de abertura

- [ ] Conta de professor entra no painel
- [ ] Período possui horário correto e ainda não terminou
- [ ] Oficina está vinculada ao período
- [ ] Todas as equipes possuem nome, código e QR Code
- [ ] Códigos impressos ou anotados como contingência
- [ ] Visão do aluno testada nas quatro atividades
- [ ] Celular e computador conseguem abrir o sistema
- [ ] Prêmios e desempate definidos
- [ ] Pessoa de apoio conhece o fluxo de cadastro

## Checklist de encerramento

- [ ] Professor anuncia o fim antes de fechar o período
- [ ] Período é encerrado no painel
- [ ] Ranking individual é atualizado e conferido
- [ ] Ranking por equipes é atualizado e conferido
- [ ] Empates são tratados pelo critério anunciado
- [ ] Premiação é registrada
- [ ] Ocorrências de cadastro e conexão são anotadas
- [ ] Dados do teste do professor são limpos
- [ ] Melhorias para a próxima oficina são registradas sem mudar o resultado oficial

## Estado da entrega

Estão implementados o evento da oficina, equipes, exclusão protegida de equipes vazias, código numérico, QR Code, leitura pela câmera no cadastro, cadastro específico, isolamento da trilha, quatro atividades, banco com 96 itens, pontuação recorrente, rankings individual e por equipe e Visão do aluno em modo de teste. As experiências ativas de inteligência artificial foram removidas.

Antes de usar com a turma, ainda é necessário fazer um ensaio completo com múltiplas contas e revisar o conteúdo com o professor responsável. O ensaio deve conferir a câmera autorizada, a câmera bloqueada e a digitação manual.

## Evoluções posteriores à oficina

As seguintes ideias ficam fora desta entrega e podem ser priorizadas depois do evento:

- limite configurável de integrantes por equipe;
- troca de equipe feita pelo professor com trilha de auditoria;
- normalização do ranking para equipes de tamanhos diferentes;
- painel com dificuldade por conceito e por formato;
- avaliação de uma arquitetura em Python e integração com Power BI.
