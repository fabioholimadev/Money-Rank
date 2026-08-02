export const CUSTO_VICIO_CONTENT_VERSION = '2026-08-01';

export const CUSTO_VICIO_REVIEW_STATUS = Object.freeze({
  technical: 'source_verified',
  pedagogical: 'pending_teacher_review',
});

export const custoVicioKnowledge = Object.freeze([
  {
    id: 'inca-vape-young-people',
    claim:
      'O INCA acompanha o crescimento do uso de dispositivos eletrônicos para fumar entre jovens e destaca que esses produtos exigem atenção em saúde pública.',
    teachingAngle:
      'Contrapor informação institucional a mensagens informais que minimizam riscos.',
    source: {
      publisher: 'Instituto Nacional de Câncer (INCA)',
      title: 'Dispositivos Eletrônicos para Fumar — dados e números',
      url: 'https://www.gov.br/inca/pt-br/assuntos/gestor-e-profissional-de-saude/observatorio-da-politica-nacional-de-controle-do-tabaco/dados-e-numeros-do-tabagismo/def-dados-e-numeros',
      accessedAt: CUSTO_VICIO_CONTENT_VERSION,
    },
    review: CUSTO_VICIO_REVIEW_STATUS,
  },
  {
    id: 'inca-tobacco-social-cost',
    claim:
      'O custo do tabagismo não se limita à compra individual: ele também envolve assistência em saúde e perdas de produtividade para a sociedade.',
    teachingAngle:
      'Diferenciar custo individual, custo de oportunidade e custo social.',
    source: {
      publisher: 'Instituto Nacional de Câncer (INCA)',
      title: 'Custos atribuíveis ao tabagismo',
      url: 'https://www.gov.br/inca/pt-br/assuntos/gestor-e-profissional-de-saude/observatorio-da-politica-nacional-de-controle-do-tabaco/dados-e-numeros-do-tabagismo/custos-atribuiveis-ao-tabagismo',
      accessedAt: CUSTO_VICIO_CONTENT_VERSION,
    },
    review: CUSTO_VICIO_REVIEW_STATUS,
  },
  {
    id: 'mj-alcohol-multiple-impacts',
    claim:
      'Os impactos do consumo de álcool podem aparecer na saúde, na segurança, no trânsito, na produtividade e nos custos econômicos, além do preço da bebida.',
    teachingAngle:
      'Ampliar a análise de uma decisão para custos diretos e indiretos.',
    source: {
      publisher: 'Ministério da Justiça e Segurança Pública',
      title: 'Álcool na Política sobre Drogas',
      url: 'https://www.gov.br/mj/pt-br/assuntos/sua-protecao/politicas-sobre-drogas/obid/alcool',
      accessedAt: CUSTO_VICIO_CONTENT_VERSION,
    },
    review: CUSTO_VICIO_REVIEW_STATUS,
  },
  {
    id: 'mj-risk-protection-balance',
    claim:
      'Fatores de risco não determinam sozinhos uma trajetória; vínculos, informação, autonomia e redes de apoio podem atuar como fatores de proteção.',
    teachingAngle:
      'Evitar culpabilização e reconhecer estratégias de apoio e prevenção.',
    source: {
      publisher: 'Ministério da Justiça e Segurança Pública',
      title: 'Fatores de Risco e de Proteção',
      url: 'https://www.gov.br/mj/pt-br/assuntos/sua-protecao/politicas-sobre-drogas/criancas-e-adolescentes/fatores-de-risco-e-de-protecao/fatores-de-risco-e-de-protecao',
      accessedAt: CUSTO_VICIO_CONTENT_VERSION,
    },
    review: CUSTO_VICIO_REVIEW_STATUS,
  },
  {
    id: 'health-adolescent-long-term',
    claim:
      'Hábitos e comportamentos na adolescência podem alterar a exposição a riscos nessa fase e repercutir na saúde na vida adulta.',
    teachingAngle:
      'Relacionar uma escolha imediata a efeitos acumulados e metas de longo prazo.',
    source: {
      publisher: 'Ministério da Saúde',
      title: 'Saúde do Adolescente e Jovens',
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-adolescente',
      accessedAt: CUSTO_VICIO_CONTENT_VERSION,
    },
    review: CUSTO_VICIO_REVIEW_STATUS,
  },
]);

const commonInsightLabels = Object.freeze({
  1: 'Leitura inicial',
  2: 'Leitura financeira',
  3: 'Leitura sistêmica',
});

function option(id, points, label, feedback, principle) {
  return {
    id,
    points,
    insightLabel: commonInsightLabels[points],
    label,
    feedback,
    principle,
  };
}

export const custoVicioCases = Object.freeze([
  {
    id: 'rafael-vape',
    name: 'Rafael',
    initials: 'RF',
    course: '3º DSA · estágio em suporte',
    habit: 'Uso recorrente de vape nos intervalos',
    goal: 'Comprar um teclado de R$ 360 para estudar e trabalhar',
    story:
      'Rafael recebe uma pequena bolsa de estágio. As compras ligadas ao vape parecem isoladas, mas começaram a disputar espaço com uma meta profissional.',
    simulatedBudget: {
      cadenceLabel: 'R$ 36 por semana',
      monthlyAmount: 144,
      goalMonths: 3,
      disclaimer:
        'Valores fictícios para exercício: quatro semanas por mês.',
    },
    sourceFactIds: [
      'inca-vape-young-people',
      'mj-risk-protection-balance',
      'health-adolescent-long-term',
    ],
    decisions: [
      {
        id: 'rafael-1-small-purchases',
        moment: '1 · Compras pequenas',
        narrative:
          'Rafael decide não registrar os R$ 36 semanais porque cada compra parece pequena.',
        question: 'Qual análise ajuda mais a entender essa escolha?',
        sourceFactIds: ['health-adolescent-long-term'],
        options: [
          option(
            'A',
            1,
            'O gasto cabe nesta semana, então ele pode observar novamente depois.',
            'Você percebeu o efeito imediato. Falta visualizar como a repetição muda o orçamento.',
            'efeito imediato',
          ),
          option(
            'B',
            2,
            'Registrar R$ 144 por mês mostra melhor o peso recorrente da decisão.',
            'Boa leitura financeira: transformar pequenas compras em total mensal reduz o ponto cego.',
            'custo recorrente',
          ),
          option(
            'C',
            3,
            'Somar o mês e comparar o valor com a meta revela custo recorrente e custo de oportunidade.',
            'Leitura completa: o total mensal ganha significado quando é comparado com aquilo que deixa de ser alcançado.',
            'custo de oportunidade',
          ),
        ],
      },
      {
        id: 'rafael-2-delayed-goal',
        moment: '2 · Meta adiada',
        narrative:
          'Depois de um mês, Rafael parcela o teclado porque os R$ 144 previstos para a meta foram usados no hábito.',
        question: 'O que essa decisão mostra sobre o planejamento?',
        sourceFactIds: ['health-adolescent-long-term'],
        options: [
          option(
            'A',
            1,
            'O parcelamento resolve a compra agora, embora crie um compromisso futuro.',
            'Essa leitura reconhece a conveniência, mas ainda não compara o custo total e a renda futura comprometida.',
            'compromisso futuro',
          ),
          option(
            'B',
            2,
            'A despesa recorrente atrasou a meta e tornou necessário revisar o orçamento.',
            'Você conectou o hábito ao atraso da meta e à necessidade de reorganização.',
            'planejamento de metas',
          ),
          option(
            'C',
            3,
            'Além de atrasar a meta, o parcelamento pode somar custo e reduzir a liberdade dos próximos meses.',
            'Análise sistêmica: a escolha atual afeta tanto o preço quanto as opções futuras.',
            'efeito intertemporal',
          ),
        ],
      },
      {
        id: 'rafael-3-online-claim',
        moment: '3 · Informação online',
        narrative:
          'Um influenciador diz que o vape não merece preocupação. Rafael aceita a mensagem sem verificar a fonte.',
        question: 'Como avaliar a qualidade dessa decisão?',
        sourceFactIds: ['inca-vape-young-people'],
        options: [
          option(
            'A',
            1,
            'A experiência do influenciador pode ser um ponto de partida para a conversa.',
            'Experiências ajudam a formular perguntas, mas não substituem evidência verificável.',
            'relato pessoal',
          ),
          option(
            'B',
            2,
            'Rafael deveria comparar a mensagem com uma fonte de saúde pública identificada.',
            'Boa prática: autoria, evidência e interesse de quem publica precisam entrar na análise.',
            'verificação de fonte',
          ),
          option(
            'C',
            3,
            'Ele deveria verificar fonte, possível interesse comercial e efeitos financeiros e de saúde acumulados.',
            'Você reuniu credibilidade, incentivo econômico e consequências da decisão.',
            'assimetria de informação',
          ),
        ],
      },
      {
        id: 'rafael-4-peer-pressure',
        moment: '4 · Pressão do grupo',
        narrative:
          'Rafael teme perder o convívio do intervalo se recusar o convite dos colegas.',
        question: 'Qual leitura considera melhor esse contexto?',
        sourceFactIds: ['mj-risk-protection-balance'],
        options: [
          option(
            'A',
            1,
            'Manter o convívio é importante e explica por que a decisão parece difícil.',
            'Você reconheceu uma necessidade real de pertencimento, sem reduzir o caso a falta de vontade.',
            'pertencimento',
          ),
          option(
            'B',
            2,
            'Ele pode propor outro momento de convivência e preservar o vínculo sem repetir o gasto.',
            'A alternativa cria autonomia sem exigir isolamento do grupo.',
            'autonomia',
          ),
          option(
            'C',
            3,
            'Além de negociar outra atividade, ele pode buscar apoio e preparar uma resposta para futuros convites.',
            'A combinação de vínculo, planejamento e rede de apoio fortalece fatores de proteção.',
            'rede de proteção',
          ),
        ],
      },
      {
        id: 'rafael-5-new-plan',
        moment: '5 · Novo plano',
        narrative:
          'Rafael considera registrar as despesas, conversar com uma pessoa de confiança e transferir semanalmente parte da bolsa para a meta.',
        question: 'Qual é o principal valor dessa estratégia?',
        sourceFactIds: [
          'mj-risk-protection-balance',
          'health-adolescent-long-term',
        ],
        options: [
          option(
            'A',
            1,
            'O registro permite perceber se a despesa mudou.',
            'Monitorar é um primeiro passo concreto e mensurável.',
            'monitoramento',
          ),
          option(
            'B',
            2,
            'A transferência automática protege a meta antes que o dinheiro seja gasto.',
            'A estratégia transforma intenção em uma regra simples de orçamento.',
            'pague-se primeiro',
          ),
          option(
            'C',
            3,
            'Registro, automação e apoio atuam juntos sobre dinheiro, rotina e contexto social.',
            'Essa leitura integra diferentes causas e evita tratar uma mudança de hábito como problema apenas individual.',
            'estratégia integrada',
          ),
        ],
      },
    ],
  },
  {
    id: 'beatriz-alcool',
    name: 'Beatriz',
    initials: 'BZ',
    course: '3º DSB · curso técnico em Enfermagem',
    habit: 'Gastos de fim de semana ligados ao consumo de álcool',
    goal: 'Pagar uma certificação de R$ 480',
    story:
      'Beatriz separa dinheiro para uma certificação, mas encontros de fim de semana passaram a gerar gastos com bebida, alimentação e transporte.',
    simulatedBudget: {
      cadenceLabel: 'R$ 48 por fim de semana',
      monthlyAmount: 192,
      goalMonths: 3,
      disclaimer:
        'Valores fictícios para exercício: quatro fins de semana por mês.',
    },
    sourceFactIds: [
      'mj-alcohol-multiple-impacts',
      'mj-risk-protection-balance',
      'health-adolescent-long-term',
    ],
    decisions: [
      {
        id: 'beatriz-1-visible-cost',
        moment: '1 · Preço visível',
        narrative:
          'Beatriz conta apenas o preço da bebida e deixa alimentação e transporte fora do cálculo.',
        question: 'Como melhorar essa leitura?',
        sourceFactIds: ['mj-alcohol-multiple-impacts'],
        options: [
          option(
            'A',
            1,
            'Anotar a bebida já melhora parte do controle.',
            'Registrar uma categoria é melhor que não registrar, mas o custo do evento ainda fica incompleto.',
            'custo direto',
          ),
          option(
            'B',
            2,
            'Somar bebida, comida e transporte revela o custo financeiro do encontro.',
            'Você construiu um custo total mais fiel para o orçamento.',
            'custo total',
          ),
          option(
            'C',
            3,
            'Somar tudo e observar impactos no dia seguinte amplia a análise para custos diretos e indiretos.',
            'A leitura sistêmica considera dinheiro, tempo e capacidade de cumprir compromissos.',
            'custos indiretos',
          ),
        ],
      },
      {
        id: 'beatriz-2-social-budget',
        moment: '2 · Orçamento social',
        narrative:
          'Ela aceita todos os convites para não se sentir de fora, mesmo quando o valor reservado ao lazer termina.',
        question: 'Qual análise respeita melhor a situação?',
        sourceFactIds: ['mj-risk-protection-balance'],
        options: [
          option(
            'A',
            1,
            'O convívio tem valor e ajuda a explicar a escolha de Beatriz.',
            'Reconhecer o contexto social evita uma análise moralista da personagem.',
            'valor social',
          ),
          option(
            'B',
            2,
            'Definir um limite de lazer permite escolher quais convites cabem no mês.',
            'Um limite transforma uma intenção abstrata em critério de decisão.',
            'limite de categoria',
          ),
          option(
            'C',
            3,
            'Ela pode combinar limite, alternativas de convívio e apoio dos amigos para não depender de uma única rotina.',
            'A proposta protege o orçamento sem ignorar pertencimento e rede social.',
            'proteção social e financeira',
          ),
        ],
      },
      {
        id: 'beatriz-3-next-day',
        moment: '3 · Dia seguinte',
        narrative:
          'Depois de um encontro, Beatriz perde parte de uma aula prática importante e pensa apenas no dinheiro gasto.',
        question: 'Que custo ainda precisa entrar na análise?',
        sourceFactIds: [
          'mj-alcohol-multiple-impacts',
          'health-adolescent-long-term',
        ],
        options: [
          option(
            'A',
            1,
            'O gasto financeiro continua sendo um indicador útil.',
            'O dinheiro é uma parte real do caso, mas não explica todo o impacto.',
            'indicador financeiro',
          ),
          option(
            'B',
            2,
            'O tempo de estudo perdido também possui custo de oportunidade.',
            'Você identificou um recurso escasso que não aparece no extrato bancário.',
            'custo do tempo',
          ),
          option(
            'C',
            3,
            'Tempo, aprendizagem, bem-estar e dinheiro devem ser avaliados juntos antes do próximo encontro.',
            'Essa leitura evita reduzir uma escolha complexa a apenas uma despesa.',
            'impacto multidimensional',
          ),
        ],
      },
      {
        id: 'beatriz-4-certification',
        moment: '4 · Certificação',
        narrative:
          'Com R$ 192 mensais comprometidos, a certificação de R$ 480 fica mais distante.',
        question: 'Qual comparação é mais informativa?',
        sourceFactIds: ['health-adolescent-long-term'],
        options: [
          option(
            'A',
            1,
            'Comparar apenas um fim de semana com o preço total do curso.',
            'A comparação inicia a reflexão, mas mistura períodos diferentes.',
            'comparação inicial',
          ),
          option(
            'B',
            2,
            'Comparar R$ 192 mensais com uma parcela planejada para a certificação.',
            'Usar o mesmo período torna a comparação mais justa e acionável.',
            'mesma base temporal',
          ),
          option(
            'C',
            3,
            'Calcular quantos meses cada cenário exige e incluir possíveis benefícios profissionais da certificação.',
            'A análise combina prazo, custo de oportunidade e retorno potencial sem prometer resultado garantido.',
            'cenários de longo prazo',
          ),
        ],
      },
      {
        id: 'beatriz-5-support-plan',
        moment: '5 · Escolha planejada',
        narrative:
          'Beatriz decide testar encontros com custo definido, outras formas de lazer e uma transferência mensal para a certificação.',
        question: 'Por que esse plano pode ser mais sustentável?',
        sourceFactIds: ['mj-risk-protection-balance'],
        options: [
          option(
            'A',
            1,
            'Ele cria uma referência de gasto para os próximos encontros.',
            'Ter uma referência ajuda a acompanhar o plano ao longo do tempo.',
            'referência de gasto',
          ),
          option(
            'B',
            2,
            'Ele protege parte da renda para a meta e diversifica o lazer.',
            'A solução cuida simultaneamente do orçamento e do convívio.',
            'diversificação',
          ),
          option(
            'C',
            3,
            'Ele combina meta, limite, alternativas e rede de apoio, permitindo ajustes com base nos resultados.',
            'Um plano adaptável e apoiado por mais de uma estratégia tende a ser mais robusto.',
            'planejamento adaptativo',
          ),
        ],
      },
    ],
  },
  {
    id: 'diego-tabaco',
    name: 'Diego',
    initials: 'DG',
    course: '3º DSA · curso técnico em Eletrotécnica',
    habit: 'Gasto frequente com produtos de tabaco',
    goal: 'Montar uma caixa de ferramentas de R$ 540',
    story:
      'Diego trabalha em pequenos serviços e quer comprar ferramentas. Ele percebe o preço diário do tabaco, mas ainda não avaliou o efeito mensal e coletivo.',
    simulatedBudget: {
      cadenceLabel: 'R$ 9 em 20 dias do mês',
      monthlyAmount: 180,
      goalMonths: 3,
      disclaimer:
        'Valores e frequência fictícios para o exercício.',
    },
    sourceFactIds: [
      'inca-tobacco-social-cost',
      'mj-risk-protection-balance',
      'health-adolescent-long-term',
    ],
    decisions: [
      {
        id: 'diego-1-daily-cost',
        moment: '1 · Conta diária',
        narrative:
          'Diego compara R$ 9 apenas com o dinheiro que recebeu naquele dia.',
        question: 'O que falta para entender o impacto no orçamento?',
        sourceFactIds: ['health-adolescent-long-term'],
        options: [
          option(
            'A',
            1,
            'Ver se os R$ 9 cabem no saldo daquele dia.',
            'A conferência evita saldo negativo imediato, mas não mostra a repetição.',
            'liquidez diária',
          ),
          option(
            'B',
            2,
            'Projetar os 20 dias revela um gasto simulado de R$ 180 por mês.',
            'Projetar frequência e período torna o custo recorrente visível.',
            'projeção mensal',
          ),
          option(
            'C',
            3,
            'Projetar o mês e comparar R$ 180 com a caixa de ferramentas mostra o custo de oportunidade.',
            'A meta transforma o número em uma escolha concreta entre usos do mesmo recurso.',
            'custo de oportunidade',
          ),
        ],
      },
      {
        id: 'diego-2-social-cost',
        moment: '2 · Além do bolso',
        narrative:
          'Diego afirma que o único impacto econômico possível é o valor pago por ele.',
        question: 'Como ampliar essa análise?',
        sourceFactIds: ['inca-tobacco-social-cost'],
        options: [
          option(
            'A',
            1,
            'O preço de compra realmente é um custo individual direto.',
            'A afirmação reconhece um custo real, mas ainda não responde à palavra “único”.',
            'custo privado',
          ),
          option(
            'B',
            2,
            'Também podem existir custos de saúde e perda de produtividade.',
            'Você identificou efeitos que não aparecem no comprovante da compra.',
            'externalidades',
          ),
          option(
            'C',
            3,
            'Custos individuais, familiares, produtivos e públicos podem coexistir e ser distribuídos entre pessoas diferentes.',
            'Essa é a leitura mais completa sobre quem paga e onde o impacto aparece.',
            'distribuição de custos',
          ),
        ],
      },
      {
        id: 'diego-3-future-work',
        moment: '3 · Trabalho futuro',
        narrative:
          'Ele considera apenas a renda desta semana e não relaciona o hábito à sua rotina profissional futura.',
        question: 'Qual horizonte de análise é mais útil?',
        sourceFactIds: [
          'inca-tobacco-social-cost',
          'health-adolescent-long-term',
        ],
        options: [
          option(
            'A',
            1,
            'A semana ajuda a conferir se as contas imediatas fecham.',
            'O curto prazo é necessário, mas sozinho pode esconder efeitos acumulados.',
            'curto prazo',
          ),
          option(
            'B',
            2,
            'O mês permite observar repetição e impacto sobre a compra das ferramentas.',
            'O horizonte mensal liga rotina e objetivo profissional.',
            'médio prazo',
          ),
          option(
            'C',
            3,
            'Curto, médio e longo prazo devem ser usados juntos para comparar caixa, metas e capacidade futura.',
            'Múltiplos horizontes reduzem o risco de otimizar apenas o presente.',
            'planejamento por horizontes',
          ),
        ],
      },
      {
        id: 'diego-4-blame',
        moment: '4 · Culpa ou apoio',
        narrative:
          'Ao tentar mudar a rotina, Diego conclui que pedir ajuda seria sinal de fraqueza.',
        question: 'Qual leitura é mais construtiva?',
        sourceFactIds: ['mj-risk-protection-balance'],
        options: [
          option(
            'A',
            1,
            'Reconhecer que a mudança é difícil já reduz uma expectativa irreal.',
            'A leitura evita simplificar a situação, embora ainda não crie suporte.',
            'autocompreensão',
          ),
          option(
            'B',
            2,
            'Pedir apoio pode acrescentar informação e acompanhamento ao plano.',
            'Apoio é um recurso de proteção, não uma falha moral.',
            'busca de apoio',
          ),
          option(
            'C',
            3,
            'Combinar apoio confiável, acompanhamento profissional quando necessário e ajustes financeiros torna o plano mais completo.',
            'A resposta integra cuidado, contexto e planejamento sem prometer uma solução única.',
            'cuidado integrado',
          ),
        ],
      },
      {
        id: 'diego-5-tool-fund',
        moment: '5 · Fundo das ferramentas',
        narrative:
          'Diego pensa em transferir R$ 45 por semana para uma conta separada e acompanhar tanto a meta quanto a despesa recorrente.',
        question: 'O que torna essa decisão verificável?',
        sourceFactIds: ['health-adolescent-long-term'],
        options: [
          option(
            'A',
            1,
            'A conta separada deixa o dinheiro da meta mais visível.',
            'Visibilidade ajuda a reduzir o uso acidental do valor reservado.',
            'separação de recursos',
          ),
          option(
            'B',
            2,
            'O valor semanal cria uma regra que pode ser comparada com o saldo acumulado.',
            'Uma regra com valor e frequência permite medir aderência.',
            'meta mensurável',
          ),
          option(
            'C',
            3,
            'Valor, frequência, prazo e revisão formam um ciclo de planejamento que pode ser corrigido com dados.',
            'A estratégia inclui execução e aprendizado, não apenas uma promessa.',
            'ciclo de controle',
          ),
        ],
      },
    ],
  },
]);

export function getCustoVicioCase(caseId) {
  return custoVicioCases.find((caseItem) => caseItem.id === caseId) ?? null;
}

export function getCustoVicioKnowledgeById(factId) {
  return custoVicioKnowledge.find((fact) => fact.id === factId) ?? null;
}
