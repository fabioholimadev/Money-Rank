// frontend/src/pages/Trilha/SaudeConsumo/PerigoDoce/questoes.jsx

export const bancoDeQuestoes = [
  // ================= NÍVEL 1: FÁCEIS =================
  {
    id: 1, nivel: 'facil',
    enunciado: 'Quando economistas afirmam que o custo do consumo de ultraprocessados é "socializado", o que isso significa na prática?',
    alternativas: [
      'A) O lucro das empresas de alimentos é dividido igualmente com a rede de hospitais públicos.',
      'B) Toda a sociedade paga, através dos impostos destinados ao SUS, pelos tratamentos de doenças causadas pelo açúcar.',
      'C) O governo compra e distribui refrigerantes gratuitamente nas escolas públicas para fins sociais.',
      'D) Apenas as pessoas que consomem o produto pagam a conta hospitalar por meio de planos de saúde privados.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O lucro é privado (fica com a empresa), mas o prejuízo (doenças) recai sobre o orçamento público financiado por todos nós.'
  },
  {
    id: 2, nivel: 'facil',
    enunciado: 'O que é a "Função Extrafiscal" de um tributo como o Imposto Seletivo?',
    alternativas: [
      'A) Arrecadar o máximo de dinheiro possível para pagar os salários dos deputados.',
      'B) Congelar os preços dos alimentos nos supermercados por decreto do Banco Central.',
      'C) Usar a cobrança do imposto para desestimular comportamentos nocivos à saúde ou ao meio ambiente.',
      'D) Isentar grandes indústrias de pagar impostos trabalhistas para gerar mais empregos.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'A extrafiscalidade foca em mudar hábitos (como reduzir o fumo ou o consumo de açúcar) pesando no bolso do consumidor.'
  },
  {
    id: 3, nivel: 'facil',
    enunciado: 'Qual é a principal consequência financeira direta para o Sistema Único de Saúde (SUS) devido ao alto consumo de bebidas açucaradas no Brasil?',
    alternativas: [
      'A) Um gasto anual estimado em R$ 3 bilhões apenas com tratamentos de obesidade e doenças relacionadas.',
      'B) A geração de um superávit financeiro que permite ao SUS construir novos hospitais de luxo.',
      'C) A redução imediata dos custos com cirurgias, já que o açúcar atua como preventivo de doenças.',
      'D) O aumento da cotação do dólar, encarecendo a importação de adoçantes.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'O consumo excessivo gera comorbidades severas, drenando bilhões de reais da saúde pública todos os anos.'
  },
  {
    id: 4, nivel: 'facil',
    enunciado: 'A rotulagem nutricional frontal (como o símbolo de lupa "Alto em Açúcar Adicionado") ataca qual problema econômico específico?',
    alternativas: [
      'A) A escassez de produtos nas prateleiras dos supermercados.',
      'B) A assimetria de informação entre a indústria e o consumidor.',
      'C) A alta inflação nos produtos agrícolas in natura.',
      'D) O excesso de impostos cobrados sobre as indústrias de embalagens.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O selo corrige a falta de informação, garantindo que o consumidor saiba o que está comprando sem ser enganado pelo marketing.'
  },
  {
    id: 5, nivel: 'facil',
    enunciado: 'Qual é o apelido globalmente conhecido na economia para o Imposto Seletivo?',
    alternativas: [
      'A) Imposto de Renda Retido na Fonte (IRRF).',
      'B) Robin Hood Tax.',
      'C) Sin Tax (Imposto do Pecado).',
      'D) Flat Tax (Imposto Único).'
    ],
    respostaCorreta: 2, // C
    justificativa: '"Sin Tax" é o termo internacional para impostos aplicados a produtos prejudiciais (álcool, tabaco, bebidas açucaradas).'
  },
  {
    id: 6, nivel: 'facil',
    enunciado: 'Do ponto de vista das finanças pessoais, comprar muitos produtos com "calorias vazias" significa que o jovem está:',
    alternativas: [
      'A) Investindo em ativos de alta liquidez e retorno nutricional garantido.',
      'B) Poupando dinheiro, pois esses produtos costumam ser isentos de qualquer inflação.',
      'C) Desperdiçando dinheiro com itens que não nutrem e ainda gerarão passivos médicos no futuro.',
      'D) Ajudando a fortalecer o sistema de previdência social.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Paga-se por um produto sem valor nutricional e assume-se o risco financeiro de gastar com remédios futuramente.'
  },
  {
    id: 7, nivel: 'facil',
    enunciado: 'Por que a água mineral engarrafada não é alvo do Imposto Seletivo, mas o refrigerante sim?',
    alternativas: [
      'A) Porque a água gera externalidades positivas, enquanto o refrigerante gera externalidades negativas e sobrecarrega o SUS.',
      'B) Porque as empresas de água pagam mais propina aos políticos locais.',
      'C) Porque a água mineral é toda importada e já paga impostos alfandegários altíssimos.',
      'D) Porque a embalagem da água é sempre 100% biodegradável.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'O Imposto Seletivo pune apenas bens que causam danos à saúde ou ao meio ambiente. A água é essencial à vida.'
  },
  {
    id: 8, nivel: 'facil',
    enunciado: 'Se os jovens consumirem menos ultraprocessados, o que acontecerá com os custos públicos do Estado a longo prazo?',
    alternativas: [
      'A) O Estado falirá rapidamente pela falta de arrecadação de impostos sobre doces.',
      'B) O orçamento da saúde terá um alívio bilionário com a queda nas doenças, liberando dinheiro para outras áreas.',
      'C) A inflação explodirá porque os hospitais precisarão cobrar mais caro para sobreviver.',
      'D) O Ministério da Saúde será extinto por falta de demanda.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'A prevenção reduz drasticamente a necessidade de internações e remédios financiados pelo SUS.'
  },
  {
    id: 9, nivel: 'facil',
    enunciado: 'Crianças e adolescentes consomem em média 88 litros de bebidas açucaradas por ano. Economicamente, quem incentiva esse comportamento?',
    alternativas: [
      'A) O Ministério da Fazenda, para fechar a meta de arrecadação.',
      'B) Organizações internacionais de saúde pública.',
      'C) O marketing bilionário da indústria, focado em fidelizar clientes desde a infância.',
      'D) Professores de educação financeira.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'A indústria investe pesado em publicidade infantil para garantir uma demanda inelástica no futuro.'
  },
  {
    id: 10, nivel: 'facil',
    enunciado: 'Qual é a principal falácia econômica que as empresas de refrigerantes usam para tentar barrar impostos?',
    alternativas: [
      'A) Dizer que o açúcar cura a ansiedade.',
      'B) Alegar que impostos mais altos vão destruir empregos e quebrar o comércio local.',
      'C) Afirmar que a água potável do Brasil está acabando.',
      'D) Provar que crianças parariam de ir à escola se não houvesse refrigerante.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'A indústria ameaça com desemprego, ocultando que o dinheiro economizado pelo consumidor será gasto em outros setores.'
  },
  {
    id: 11, nivel: 'facil',
    enunciado: 'Como o Imposto Seletivo tenta mudar a sua decisão de compra no supermercado?',
    alternativas: [
      'A) Proibindo menores de 18 anos de entrarem nos corredores de doces.',
      'B) Limitando a quantidade de pacotes que cada CPF pode comprar.',
      'C) Aumentando artificialmente o preço final do produto nocivo para que ele doa no seu bolso.',
      'D) Trocando embalagens coloridas por preto e branco.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Foca na sensibilidade do consumidor ao preço, desestimulando a compra pelo encarecimento.'
  },
  {
    id: 12, nivel: 'facil',
    enunciado: 'Na hora do recreio, por que os ultraprocessados vencem opções naturais?',
    alternativas: [
      'A) Porque são vendidos a preço de custo pela escola.',
      'B) Pela alta conveniência, marketing e hiperpalatabilidade (design de sabor que vicia).',
      'C) Porque alimentos naturais são proibidos pela vigilância.',
      'D) Porque jovens não têm capacidade cognitiva de entender uma fruta.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Baixo esforço (pronto para comer) e sabor artificial explosivo dominam a decisão rápida do jovem.'
  },
  {
    id: 13, nivel: 'facil',
    enunciado: 'A arrecadação de impostos deve focar em qual princípio quando falamos de saúde pública?',
    alternativas: [
      'A) Onerar mais quem causa mais prejuízo ao sistema público (Poluidor-Pagador).',
      'B) Taxar apenas produtos naturais para modernizar fazendas.',
      'C) Isentar corporações estrangeiras.',
      'D) Fazer hospitais serem de capital aberto.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'O princípio dita que quem cria o custo social deve arcar com maior carga tributária.'
  },
  {
    id: 14, nivel: 'facil',
    enunciado: 'O que acontece com a verba pública quando bilhões são gastos no SUS com doenças evitáveis?',
    alternativas: [
      'A) O governo imprime dinheiro, gerando deflação.',
      'B) Há um "Custo de Oportunidade": esse dinheiro deixa de ir para educação e segurança.',
      'C) A indústria farmacêutica doa o mesmo valor.',
      'D) O salário mínimo é reajustado automaticamente.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Dinheiro público é finito; o que se gasta tapando furos de saúde falta para construir escolas e estradas.'
  },
  {
    id: 15, nivel: 'facil',
    enunciado: 'Se você fosse Ministro, a forma mais rápida de melhorar o caixa e a saúde a longo prazo seria:',
    alternativas: [
      'A) Abolir imposto de renda e taxar remédios.',
      'B) Implementar o Imposto Seletivo ("Sin Tax") de forma rigorosa.',
      'C) Congelar investimentos no SUS.',
      'D) Dar subsídios para fábricas de refrigerante.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O imposto de "duplo-dividendo" arrecada a curto prazo e diminui custos de saúde a longo prazo.'
  },

  // ================= NÍVEL 2: MÉDIAS =================
  {
    id: 16, nivel: 'media',
    enunciado: 'Como classificamos rigorosamente os custos hospitalares bilionários que as bebidas açucaradas geram e que não estão no preço da lata?',
    alternativas: [
      'A) Custos de transação.',
      'B) Bens de Veblen.',
      'C) Externalidades negativas de consumo.',
      'D) Vantagens comparativas absolutas.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Externalidade negativa ocorre quando o uso de um bem gera impactos prejudiciais a terceiros (sociedade/SUS) não refletidos no preço.'
  },
  {
    id: 17, nivel: 'media',
    enunciado: 'Se a "elasticidade-preço da demanda" por bebidas açucaradas no Brasil é de -1,40, o que isso significa?',
    alternativas: [
      'A) Demanda perfeitamente inelástica: as pessoas compram igual.',
      'B) Demanda elástica: se o preço subir 10%, o consumo cairá 14%, provando que o imposto funciona.',
      'C) Demanda unitária.',
      'D) O produto é um Bem de Giffen.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Coeficiente maior que 1 indica alta sensibilidade ao preço. Aumentar tributo reduz fortemente o consumo.'
  },
  {
    id: 18, nivel: 'media',
    enunciado: 'Por que a rejeição do "teto de 2%" para o Imposto Seletivo na Reforma Tributária foi uma vitória para a saúde?',
    alternativas: [
      'A) Porque um imposto de 2% é irrisório e incapaz de gerar impacto no preço para desestimular a compra.',
      'B) Porque 2% faria a água mineral ser taxada em 50%.',
      'C) Porque obrigaria o governo a privatizar o SUS.',
      'D) Porque a Constituição exige no mínimo 25%.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Retirar o teto permite aplicar taxas realmente efetivas para reduzir o consumo.'
  },
  {
    id: 19, nivel: 'media',
    enunciado: 'Subsídios indiretos que barateiam refrigerantes produzidos em zonas econômicas são chamados criticamente de:',
    alternativas: [
      'A) Armadilha da liquidez.',
      'B) "Bolsa-Refrigerante".',
      'C) Paradoxo da Água e Diamante.',
      'D) Efeito Manada tributário.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Créditos fiscais geravam vantagens financeiras absurdas, subsidiando a produção de itens nocivos.'
  },
  {
    id: 20, nivel: 'media',
    enunciado: 'O que acontece com a "Assimetria de Informação" quando o Estado torna obrigatório o selo da Lupa Frontal?',
    alternativas: [
      'A) Aumenta, pois o consumidor fica confuso.',
      'B) É reduzida, equilibrando o poder de decisão do consumidor perante o marketing.',
      'C) Desaparece, porque a indústria revela receitas secretas.',
      'D) Não há impacto econômico.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O rótulo claro quebra a vantagem de informação oculta que a corporação possuía.'
  },
  {
    id: 21, nivel: 'media',
    enunciado: 'Segundo a teoria dos "bens substitutos", para onde vai o dinheiro que as famílias pararam de gastar com refrigerante?',
    alternativas: [
      'A) Desaparece do mercado.',
      'B) Migra para bens substitutos mais saudáveis, como água, sucos e alimentos in natura.',
      'C) Canalizado para Bitcoins.',
      'D) Queima-se em reservas de poupança.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O consumo não some, migra. Encarecer o ultraprocessado estimula setores mais saudáveis.'
  },
  {
    id: 22, nivel: 'media',
    enunciado: 'Como o mecanismo de "Repasse" funciona com um novo imposto sobre refrigerantes?',
    alternativas: [
      'A) A empresa absorve 100% do custo.',
      'B) A Receita cobra direto no Pix do consumidor.',
      'C) A indústria repassa o custo para o preço final na prateleira, forçando o consumidor a pagar.',
      'D) O Banco Central emite novas moedas.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Para manter lucros, fabricantes repassam o ônus, efetivando o encarecimento planejado pelo imposto.'
  },
  {
    id: 23, nivel: 'media',
    enunciado: 'Qual é a reação da indústria (Efeito de Substituição) a um imposto baseado na gramatura de açúcar?',
    alternativas: [
      'A) Fecham fábricas no Brasil.',
      'B) Reformulam receitas, reduzindo açúcar e usando adoçantes para escapar da taxação.',
      'C) Compram hospitais públicos.',
      'D) Reduzem as garrafas e cobram o triplo.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O imposto força a indústria a reformular produtos, o que indiretamente reduz o açúcar ofertado.'
  },
  {
    id: 24, nivel: 'media',
    enunciado: 'O que "Déficit Fiscal Setorial" significa neste contexto?',
    alternativas: [
      'A) O governo gasta mais tratando doenças desses produtos do que arrecada em impostos sobre eles.',
      'B) Empresas operam no vermelho.',
      'C) A arrecadação cobriu totalmente o SUS.',
      'D) Falta açúcar no mercado internacional.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'O setor gera prejuízo ao Estado: a arrecadação não paga a "fatura" hospitalar.'
  },
  {
    id: 25, nivel: 'media',
    enunciado: 'O "Sin Tax" é um Imposto Pigouviano. O que isso significa?',
    alternativas: [
      'A) Tributo da Idade Média.',
      'B) Imposto sobre dividendos.',
      'C) Imposto sobre mercado que gera externalidade negativa, para igualar custo privado ao custo social.',
      'D) Taxa sobre exportação suína.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Força o mercado a internalizar e pagar pelos estragos sociais que sua operação causa.'
  },
  {
    id: 26, nivel: 'media',
    enunciado: 'Por que a crença de que o "consumidor faz escolhas 100% racionais" é falha com ultraprocessados?',
    alternativas: [
      'A) O cérebro só processa números pares.',
      'B) Marketing, design e aditivos químicos exploram vieses biológicos, induzindo consumo impulsivo.',
      'C) É proibido ler rótulos.',
      'D) Açúcar zera o Q.I.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O ser humano não calcula perfeitamente; é influenciado pela dopamina e heurísticas.'
  },
  {
    id: 27, nivel: 'media',
    enunciado: 'Como as políticas modernas respondem à crítica de que o Imposto Seletivo afeta mais os pobres?',
    alternativas: [
      'A) Isentando milionários.',
      'B) Devolvendo o imposto como "Cashback" aos mais pobres, mantendo o preço alto na prateleira.',
      'C) Tabelando preços.',
      'D) Distribuindo chocolates grátis.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O cashback protege a renda sem destruir a eficácia do preço alto contra o produto nocivo.'
  },
  {
    id: 28, nivel: 'media',
    enunciado: 'Por que ocorreu uma "Falha de Mercado" na epidemia de obesidade?',
    alternativas: [
      'A) Mercado odeia indústrias.',
      'B) Hospitais fizeram lobby para adoecer pessoas.',
      'C) Corporações focam no lucro e ignoram o passivo de saúde deixado para o Estado resolver.',
      'D) Existe só uma marca de doce.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'O mercado falha quando não alinha lucro privado com bem-estar social.'
  },
  {
    id: 29, nivel: 'media',
    enunciado: 'Ao calcular perdas econômicas, o que mede o "Absenteísmo"?',
    alternativas: [
      'A) Evasão escolar.',
      'B) Perdas por faltas ao trabalho, licenças médicas e queda na produtividade do país.',
      'C) Furtos em supermercados.',
      'D) Fuga de cérebros.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Custos indiretos englobam os dias de trabalho perdidos por adoecimento.'
  },
  {
    id: 30, nivel: 'media',
    enunciado: 'Se a arrecadação cair porque as pessoas pararam de comprar refri, por que o governo não deve se desesperar?',
    alternativas: [
      'A) Porque pode imprimir dinheiro.',
      'B) A economia astronômica do SUS com internações compensará a queda no imposto.',
      'C) Cobrará imposto de oxigênio.',
      'D) Arrecadação não importa.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'A economia orçamentária na saúde futura supera o imposto não arrecadado hoje.'
  },

  // ================= NÍVEL 3: DIFÍCEIS =================
  {
    id: 31, nivel: 'dificil',
    enunciado: 'O que o "Custo de Oportunidade" dos R$ 3 bi gastos pelo SUS representa?',
    alternativas: [
      'A) Oportunidade de lucrar com seringas.',
      'B) Os ativos (escolas, infraestrutura) que o país deixou de financiar para custear a doença.',
      'C) Perda de marketing das empresas.',
      'D) Investimento no mercado de ações.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O que se gasta tapando buracos significa falta de investimentos estruturais no país.'
  },
  {
    id: 32, nivel: 'dificil',
    enunciado: 'Se a "elasticidade cruzada" entre refrigerante e suco é positiva, o imposto no refrigerante gera:',
    alternativas: [
      'A) Aumento brutal na demanda por sucos naturais (bem substituto).',
      'B) Falência de fazendas.',
      'C) Queda de todos os líquidos.',
      'D) Estagnação da indústria.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Bens com elasticidade cruzada positiva são substitutos. Encarecer um impulsiona o outro.'
  },
  {
    id: 33, nivel: 'dificil',
    enunciado: 'Qual o "trade-off" oculto de isentar impostos de uma fábrica de biscoitos em troca de 500 empregos?',
    alternativas: [
      'A) Ganha empregos hoje, mas compromete o orçamento da saúde amanhã com diabetes.',
      'B) Perde empregos para robôs.',
      'C) Não há trade-off, é só lucro.',
      'D) Prefeito proibirá frutas.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Troca-se benefício político de curto prazo por um rombo sanitário irreversível no futuro.'
  },
  {
    id: 34, nivel: 'dificil',
    enunciado: 'Sobre "Pesos Mortos" (Deadweight Loss), qual o efeito de um Imposto Pigouviano?',
    alternativas: [
      'A) Cria peso morto e destrói o mercado.',
      'B) Elimina o peso morto pré-existente ao corrigir a externalidade, maximizando o bem-estar.',
      'C) Afeta apenas a oferta.',
      'D) Transfere riqueza para máquinas.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Impostos sobre externalidades corrigem uma ineficiência, aproximando do ponto ideal.'
  },
  {
    id: 35, nivel: 'dificil',
    enunciado: 'Por que a ameaça de "demissões em massa" devido ao imposto é rebatida pela macroeconomia?',
    alternativas: [
      'A) Robôs já operam 100%.',
      'B) O dinheiro economizado pelo consumidor será gasto em outros setores, realocando os empregos.',
      'C) Ministério da Saúde contrata todos.',
      'D) Demissão é o objetivo real.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'O consumo não some; migra. O declínio de vagas nocivas é compensado em setores saudáveis.'
  },
  {
    id: 36, nivel: 'dificil',
    enunciado: 'Como o "Desconto Hiperbólico" explica a epidemia de obesidade juvenil?',
    alternativas: [
      'A) Descontos em lojas de roupa.',
      'B) O cérebro valoriza muito a dopamina imediata do doce e ignora custos médicos de longo prazo.',
      'C) Jovens gostam de gráficos em curva.',
      'D) Supermercados mudam preços no fim de semana.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Recompensas imediatas sobrepujam os impactos catastróficos que demoram a chegar.'
  },
  {
    id: 37, nivel: 'dificil',
    enunciado: 'Qual a utilidade técnica de o PLP 108/2024 colocar o Imposto Seletivo sob gestão de um Comitê Gestor?',
    alternativas: [
      'A) Permitir ajustes ágeis na alíquota para manter eficácia contra a inflação e manobras da indústria.',
      'B) O Congresso não sabe matemática.',
      'C) Juízes decidirem preços de doce.',
      'D) Gerar caos no mercado de ações.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Tributos regulatórios precisam ser calibrados para o poder de desestímulo não evaporar.'
  },
  {
    id: 38, nivel: 'dificil',
    enunciado: 'Como ultraprocessados afetam indiretamente a Previdência Social?',
    alternativas: [
      'A) Aumentam arrecadação de embalagens.',
      'B) Doenças crônicas geram explosão de pagamentos precoces de auxílio-doença e invalidez.',
      'C) Idosos compram doces para os netos.',
      'D) Previdência financia a indústria.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Pensões precoces por incapacidade laboral são danos fiscais indiretos da obesidade.'
  },
  {
    id: 39, nivel: 'dificil',
    enunciado: 'Se a demanda por refrigerante fosse "perfeitamente inelástica", o imposto funcionaria para a saúde?',
    alternativas: [
      'A) Sim, confiscaria na fronteira.',
      'B) Não. O consumo continuaria idêntico e o imposto teria apenas caráter arrecadatório falho.',
      'C) Sim, as calorias sumiriam.',
      'D) Não, empresas baixariam o preço a zero.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Se a demanda é cega ao preço, não há desestímulo. (Felizmente, a demanda real é elástica).'
  },
  {
    id: 40, nivel: 'dificil',
    enunciado: 'Segundo a teoria da "Escolha Pública", por que políticos relutam em taxar ultraprocessados?',
    alternativas: [
      'A) Políticos não conhecem impostos.',
      'B) O lobby gera benefícios imediatos ao político, enquanto o custo da doença é diluído na sociedade.',
      'C) Exércitos privados intimidam o Ministério.',
      'D) Proibição do uso de matemática.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Interesses concentrados (indústria) têm mais pressão do que interesses difusos (saúde pública).'
  },
  {
    id: 41, nivel: 'dificil',
    enunciado: 'Combinando Imposto + Lupa + Restrição de Marketing, qual fenômeno esperamos em 10 anos?',
    alternativas: [
      'A) Privatização do SUS.',
      'B) Aumento exponencial de doenças.',
      'C) "Desnormalização do Consumo", alterando o padrão cultural e gerando alívio fiscal.',
      'D) Extinção do livre mercado.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Intervenções conjuntas reduzem a aceitação social do vício.'
  },
  {
    id: 42, nivel: 'dificil',
    enunciado: 'A ferramenta para interromper a "privatização dos lucros e socialização dos prejuízos" chama-se:',
    alternativas: [
      'A) Internalização de Externalidades via Imposto Seletivo.',
      'B) Política Monetária Expansionista.',
      'C) Flexibilização Quantitativa.',
      'D) Fixação de Taxa SELIC negativa.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Obriga o preço na prateleira a refletir os danos impostos ao SUS.'
  },
  {
    id: 43, nivel: 'dificil',
    enunciado: 'Por que o Imposto do Pecado deve ser "específico" (fixo por grama) e não percentual ao preço?',
    alternativas: [
      'A) Percentual é inconstitucional.',
      'B) Evitar que a marca crie linhas baratíssimas para vender muito volume pagando imposto irrisório.',
      'C) Imposto percentual gera desemprego.',
      'D) Supermercados não usam computadores.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Imposto por volume pune o dano real (açúcar). O modelo percentual protege os piores produtos.'
  },
  {
    id: 44, nivel: 'dificil',
    enunciado: 'Por que a "autorregulação da indústria" falhou mundialmente na Assimetria de Informação?',
    alternativas: [
      'A) Ninguém lê letras pequenas.',
      'B) O mercado pune quem revela riscos e foca na saúde em vez do lucro (corrida pro fundo do poço).',
      'C) Governos proibiram pesquisas.',
      'D) Fórmulas mudam aleatoriamente.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Sem lei, nenhuma empresa dirá sozinha que seu produto faz mal; ela perderia vendas para a concorrente calada.'
  },
  {
    id: 45, nivel: 'dificil',
    enunciado: 'Se o Estado arrecada R$ 2 bi e economiza R$ 3 bi no SUS, qual o saldo macroeconômico?',
    alternativas: [
      'A) Déficit de R$ 1 bilhão.',
      'B) Colapso por queda do PIB no setor.',
      'C) Ganho estrondoso: Duplo Dividendo, maximizando a eficiência do país.',
      'D) Inflação consome tudo em 24h.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Ganha-se receita hoje e economiza-se na conta do hospital amanhã.'
  },
  // ================= BÔNUS: QUESTÕES DO PROFESSOR (KAHOOT) =================
  {
    id: 46, nivel: 'media',
    enunciado: 'Sobre o consumo de ultraprocessados, qual é a principal relação estabelecida entre a saúde pública e a área da economia?',
    alternativas: [
      'A) A privatização total dos leitos hospitalares de alta complexidade.',
      'B) A redução imediata da carga tributária global do país.',
      'C) O aumento do lucro líquido das indústrias farmacêuticas multinacionais.',
      'D) O impacto financeiro que o aumento de doenças gera nos gastos do SUS.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'O custo de tratar doenças relacionadas à má alimentação recai fortemente sobre o orçamento da saúde pública.'
  },
  {
    id: 47, nivel: 'media',
    enunciado: 'Sobre a Ed. Fiscal e os ultraprocessados, os tributos arrecadados pelo governo devem ser relacionados a qual aspecto?',
    alternativas: [
      'A) Ao cancelamento de todos os fundos destinados à merenda escolar básica.',
      'B) Ao pagamento de bônus salariais para diretores de indústrias de alimentos.',
      'C) Ao financiamento do serviço de saúde pública devido ao aumento de doenças.',
      'D) Ao subsídio para a publicidade de bebidas açucaradas de marcas famosas.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'A arrecadação através de impostos (Sin Tax) deve idealmente ajudar a custear os danos que esses produtos causam ao SUS.'
  },
  {
    id: 48, nivel: 'facil',
    enunciado: 'Qual imposto específico está diretamente ligado à produção e comercialização de ultraprocessados?',
    alternativas: [
      'A) Impostos sobre produtos industrializados (IPI).',
      'B) Imposto sobre a Propriedade de Veículos Automotores (IPVA).',
      'C) Imposto Territorial Rural (ITR).',
      'D) Imposto Predial e Territorial Urbano (IPTU).'
    ],
    respostaCorreta: 0, // A
    justificativa: 'O IPI incide sobre produtos industrializados (saídos de fábricas), que é exatamente a categoria onde os ultraprocessados se enquadram.'
  },
  {
    id: 49, nivel: 'facil',
    enunciado: 'Qual destes produtos apresenta a menor quantidade de açúcar (apenas 4 gramas) por colher de sopa?',
    alternativas: [
      'A) Sorvete de creme.',
      'B) Biscoito recheado.',
      'C) Ketchup.',
      'D) Chocolate em pó.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Embora seja visto como salgado, o ketchup contém açúcar embutido (cerca de 4g por colher), mas em menor volume concentrado do que doces óbvios.'
  },
  {
    id: 50, nivel: 'media',
    enunciado: 'Qual é o principal objetivo macroeconômico na compreensão do "consumo consciente"?',
    alternativas: [
      'A) Garantir que a população gaste todo o seu salário com bebidas energéticas.',
      'B) Aumentar a inflação interna de produtos hortifrúti in natura.',
      'C) Estimular a falência em massa das indústrias químicas nacionais.',
      'D) Reduzir de forma preventiva os gastos e custos públicos na área da saúde.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'O consumo consciente previne doenças a longo prazo, o que alivia a pressão sobre o orçamento público de saúde.'
  },
  {
    id: 51, nivel: 'facil',
    enunciado: 'Quais são as três principais doenças crônicas relacionadas ao consumo de ultraprocessados?',
    alternativas: [
      'A) Obesidade, diabetes e hipertensão.',
      'B) Gastrite, miopia e asma crônica.',
      'C) Anemia falciforme, escoliose e depressão.',
      'D) Dengue, zika e chikungunya.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'O excesso de açúcar, sódio e gorduras saturadas é o principal fator de risco para essas Doenças Crônicas Não Transmissíveis (DCNTs).'
  },
  {
    id: 52, nivel: 'media',
    enunciado: 'Se o governo decidir elevar a alíquota dos impostos sobre produtos industrializados, o que ocorre no mercado consumidor?',
    alternativas: [
      'A) Extinção imediata da cobrança de qualquer tributo sobre sucos naturais.',
      'B) Queda imediata nos preços de venda e aumento exponencial das vendas.',
      'C) Aumento no preço final ao consumidor.',
      'D) Substituição completa do açúcar por aditivos químicos.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'O aumento de impostos sobre a produção é invariavelmente repassado pelas indústrias para o consumidor, encarecendo o produto na prateleira.'
  },
  {
    id: 53, nivel: 'media',
    enunciado: 'Se o consumo de sucos industrializados cair drasticamente, o que acontece com a receita de impostos desse setor?',
    alternativas: [
      'A) Um congelamento total de todo o orçamento anual do Ministério da Fazenda.',
      'B) O Estado passa a arrecadar mais, pois o açúcar vira uma moeda de troca.',
      'C) A arrecadação desse setor se multiplica por causa do patriotismo fiscal.',
      'D) Ocorre a redução na arrecadação de impostos sobre esse setor a curto prazo.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'Menos vendas significam menos produtos tributados sendo comercializados, o que reduz a arrecadação daquele setor específico de imediato.'
  },
  {
    id: 54, nivel: 'facil',
    enunciado: 'Por que os custos hospitalares com diabetes e hipertensão são uma preocupação fiscal relevante?',
    alternativas: [
      'A) Porque essas doenças desaparecem instantaneamente após a aplicação de IPTU.',
      'B) Porque geram uma receita financeira para os caixas do governo federal.',
      'C) Porque o tratamento hospitalar dessas patologias não exige insumos médicos.',
      'D) Porque demandam tratamentos de longo prazo, com gastos públicos contínuos.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'Doenças crônicas exigem acompanhamento, medicamentos e internações recorrentes por toda a vida, drenando recursos públicos ano após ano.'
  },
  {
    id: 55, nivel: 'dificil',
    enunciado: 'Se o GOV arrecada um determinado valor sobre ultraprocessados, mas gasta o dobro no SUS, qual é o resultado desta conta?',
    alternativas: [
      'A) A eliminação completa da necessidade de emitir papel-moeda no país.',
      'B) Um superávit orçamentário perfeito que enriquece toda a população ativa.',
      'C) Um déficit fiscal, pois o custo da saúde supera o ganho com a arrecadação.',
      'D) Um equilíbrio macroeconômico estável imune a crises inflacionárias.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Quando a despesa social gerada pelo produto para tratá-lo é maior que o imposto recolhido em sua venda, o Estado (e a sociedade) ficam no prejuízo.'
  },
  {
    id: 56, nivel: 'media',
    enunciado: 'Se uma pessoa consumir rotineiramente biscoito, qual será a relação direta no seu orçamento / valor nutricional?',
    alternativas: [
      'A) Isenção total de impostos na fatura do cartão de crédito de quem compra.',
      'B) Alto custo por caloria, gastando em produtos de baixo retorno nutricional.',
      'C) Uma economia de escala que zera as despesas médicas de longo prazo.',
      'D) Alto rendimento financeiro que substitui o uso de moedas nacionais.'
    ],
    respostaCorreta: 1, // B
    justificativa: 'Ultraprocessados representam calorias vazias: você gasta dinheiro comprando algo que não fornece os nutrientes essenciais que o corpo precisa.'
  },
  {
    id: 57, nivel: 'facil',
    enunciado: 'A rotulagem nutricional frontal obrigatória "Alto em Açúcar Adicionado", por exemplo, funciona como?',
    alternativas: [
      'A) Uma isenção aduaneira para transporte marítimo de cargas pesadas.',
      'B) Uma proibição comercial que impede os supermercados de taxar indevidamente.',
      'C) Um cupom de desconto fiscal emitido diretamente pelo Banco Central.',
      'D) Um instrumento que permite escolhas mais conscientes de compra.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'A rotulagem reduz a assimetria de informação, empoderando o consumidor a não ser enganado pelo marketing e tomar decisões mais saudáveis.'
  },
  {
    id: 58, nivel: 'media',
    enunciado: 'As indústrias de ultraprocessados que geram custos ao Estado não pagando diretamente por eles são classificados como produtoras de:',
    alternativas: [
      'A) Vantagens comparativas de comércio internacional.',
      'B) Monopólios naturais de utilidade pública.',
      'C) Bens públicos puros de livre acesso.',
      'D) Externalidades negativas de consumo.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'Externalidade negativa ocorre quando o custo dos impactos (como danos à saúde pública) não está incluído no preço da mercadoria, sendo repassado para toda a sociedade.'
  },
  {
    id: 59, nivel: 'dificil',
    enunciado: 'Muitos economistas defendem a aplicação de um "Imposto Seletivo" sobre ultraprocessados. Qual é o fundamento de tal medida?',
    alternativas: [
      'A) Desestimular o consumo por meio do aumento do preço relativo.',
      'B) Garantir que as empresas de ultraprocessados fiquem totalmente isentas.',
      'C) Forçar os cidadãos a comprarem mercadorias com alto teor de sódio.',
      'D) Eliminar o uso de dinheiro em papel em todas as transações comerciais.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Aumentar o preço através de impostos punitivos (Sin Tax) afeta a elasticidade da demanda, reduzindo a compra de produtos que causam danos à saúde.'
  },
  {
    id: 60, nivel: 'media',
    enunciado: 'Quando o Estado gasta bilhões de reais para tratar complicações causadas por ultraprocessados no SUS, o que ocorre nas outras áreas públicas?',
    alternativas: [
      'A) Passam a receber verbas infinitas sem restrição orçamentária.',
      'B) Ocorre um fechamento de todas as agências bancárias por falta de liquidez.',
      'C) Deixa-se de investir em infraestrutura, segurança e educação básica.',
      'D) Os impostos urbanos como o IPTU deixam de existir em todas as cidades.'
    ],
    respostaCorreta: 2, // C
    justificativa: 'Isso é o que a economia chama de Custo de Oportunidade. O dinheiro público é finito; o que vai para tratar doenças evitáveis falta em outras áreas vitais.'
  },
  {
    id: 61, nivel: 'dificil',
    enunciado: 'Além dos custos diretos com internações no SUS, como a epidemia de obesidade e diabetes afeta a produtividade econômica?',
    alternativas: [
      'A) Gera perdas econômicas por licenças médicas da força de trabalho ativa.',
      'B) Aumenta a eficiência operacional das fábricas, por aumento na escalas.',
      'C) Provoca uma valorização da moeda nacional perante o dólar americano.',
      'D) Zera as taxas de desemprego porque os hospitais passam a contratar mais.'
    ],
    respostaCorreta: 0, // A
    justificativa: 'Doenças crônicas geram alto índice de absenteísmo (faltas) e aposentadorias precoces por invalidez, reduzindo a capacidade produtiva geral do país.'
  },
  {
    id: 62, nivel: 'dificil',
    enunciado: 'Se um município decide implementar incentivos fiscais para atrair fábricas de ultraprocessados, que conflito pode criar?',
    alternativas: [
      'A) Zera todos os repasses financeiros à segurança pública de forma definitiva.',
      'B) Obriga as outras indústrias a se converterem para ultraprocessados.',
      'C) Garante que a região fique livre de qualquer caso de diabetes por 50 anos.',
      'D) Gera empregos a curto prazo, mas eleva as despesas com saúde a longo prazo.'
    ],
    respostaCorreta: 3, // D
    justificativa: 'O município ganha arrecadação e algumas vagas de emprego inicialmente (benefício político curto), mas acaba gastando muito mais no futuro para tratar a população adoecida.'
  }
];
