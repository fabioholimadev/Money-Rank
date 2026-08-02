export const PERIGO_DOCE_KNOWLEDGE_VERSION = '2026-08-01';

export const KNOWLEDGE_REVIEW_STATUS = Object.freeze({
  technical: 'source_verified',
  pedagogical: 'pending_teacher_review',
});

/**
 * Base de conhecimento da Fase 1.
 *
 * Cada registro contém uma afirmação curta e rastreável. A IA recebe apenas
 * estes fatos e não pode tratar conhecimento próprio como fonte da atividade.
 * As alternativas incorretas são conceitos equivocados controlados, usados
 * exclusivamente pelo modo local de contingência.
 */
export const perigoDoceKnowledge = Object.freeze([
  {
    id: 'who-free-sugars-limit',
    topic: 'Consumo de açúcares livres',
    difficulty: 'facil',
    claim:
      'A OMS recomenda reduzir os açúcares livres para menos de 10% da ingestão energética total e indica benefícios adicionais abaixo de 5%.',
    teachingAngle:
      'Relacionar escolhas de consumo frequentes com prevenção e planejamento financeiro de longo prazo.',
    explanation:
      'A recomendação trabalha com proporção da energia diária, não com a proibição absoluta de qualquer alimento doce.',
    misconceptions: [
      'A OMS recomenda que metade da energia diária venha de açúcares livres.',
      'A recomendação da OMS vale somente para atletas profissionais.',
      'A OMS considera desnecessário observar a quantidade de açúcar na alimentação.',
    ],
    source: {
      publisher: 'Organização Mundial da Saúde',
      title: 'Guideline: Sugars intake for adults and children',
      url: 'https://www.who.int/publications-detail-redirect/WHO-NMH-NHD-15.3',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'anvisa-front-label-thresholds',
    topic: 'Rotulagem nutricional frontal',
    difficulty: 'media',
    claim:
      'A regra brasileira exige a lupa de “alto em açúcar adicionado” a partir de 15 g por 100 g em alimentos sólidos e 7,5 g por 100 ml em líquidos.',
    teachingAngle:
      'Ensinar o aluno a comparar produtos usando uma informação padronizada da embalagem.',
    explanation:
      'Os limites diferem entre sólidos e líquidos; a lupa alerta para alto teor, mas não substitui a leitura do restante da tabela nutricional.',
    misconceptions: [
      'A lupa aparece em qualquer produto que tenha uma quantidade mínima de açúcar natural.',
      'O mesmo limite de 1 g é aplicado a sólidos e líquidos no Brasil.',
      'A rotulagem frontal informa somente o preço do produto por porção.',
    ],
    source: {
      publisher: 'Agência Nacional de Vigilância Sanitária',
      title: 'Rotulagem nutricional',
      url: 'https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem/rotulagem-nutricional',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'anvisa-informed-choice',
    topic: 'Informação e decisão de compra',
    difficulty: 'facil',
    claim:
      'A rotulagem frontal destaca nutrientes críticos para tornar a informação mais clara e apoiar escolhas de consumo conscientes.',
    teachingAngle:
      'Apresentar a rotulagem como uma ferramenta para reduzir a diferença de informação entre fornecedor e consumidor.',
    explanation:
      'O destaque frontal facilita identificar rapidamente altos teores antes de comparar preço, quantidade e composição.',
    misconceptions: [
      'A rotulagem frontal existe para esconder a composição dos alimentos.',
      'A lupa frontal define o preço máximo que o mercado pode cobrar.',
      'O rótulo torna todos os produtos com embalagens parecidas nutricionalmente iguais.',
    ],
    source: {
      publisher: 'Agência Nacional de Vigilância Sanitária',
      title: 'Rotulagem nutricional',
      url: 'https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem/rotulagem-nutricional',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'health-guide-food-priority',
    topic: 'Escolhas alimentares',
    difficulty: 'facil',
    claim:
      'O Guia Alimentar brasileiro orienta priorizar alimentos in natura ou minimamente processados e evitar alimentos ultraprocessados.',
    teachingAngle:
      'Comparar conveniência, orçamento e consequências de escolhas recorrentes sem culpabilizar o aluno.',
    explanation:
      'A orientação trata do padrão alimentar: itens in natura ou minimamente processados devem formar a base da alimentação.',
    misconceptions: [
      'O Guia Alimentar recomenda que ultraprocessados sejam a base de todas as refeições.',
      'O Guia Alimentar considera que apenas o preço define a qualidade de um alimento.',
      'A recomendação oficial proíbe o consumo de água durante as refeições.',
    ],
    source: {
      publisher: 'Ministério da Saúde',
      title: 'Guia Alimentar para a População Brasileira — 2ª edição',
      url: 'https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf/@@download/file/guia_alimentar_populacao_brasileira_2ed.pdf',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'brazil-selective-tax-sugary-drinks',
    topic: 'Imposto Seletivo no Brasil',
    difficulty: 'media',
    claim:
      'A Lei Complementar nº 214/2025 inclui bebidas açucaradas entre os bens sujeitos ao Imposto Seletivo por serem considerados prejudiciais à saúde ou ao meio ambiente.',
    teachingAngle:
      'Conectar tributação, preço e objetivos de saúde pública sem afirmar que o tributo sozinho resolve o problema.',
    explanation:
      'O Imposto Seletivo usa a tributação também para desestimular o consumo de determinados produtos; alíquotas e aplicação dependem da regulamentação vigente.',
    misconceptions: [
      'A Lei Complementar nº 214/2025 criou um subsídio obrigatório para refrigerantes.',
      'O Imposto Seletivo brasileiro incide apenas sobre livros didáticos.',
      'A lei determina que bebidas açucaradas sejam distribuídas gratuitamente nas escolas.',
    ],
    source: {
      publisher: 'Câmara dos Deputados',
      title: 'Lei Complementar nº 214, de 16 de janeiro de 2025',
      url: 'https://www2.camara.leg.br/legin/fed/leicom/2025/leicomplementar-214-16-janeiro-2025-796905-normaatualizada-pl.html',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'who-fiscal-policy-demand',
    topic: 'Preço e comportamento de consumo',
    difficulty: 'media',
    claim:
      'A OMS aponta que impostos sobre bebidas açucaradas podem elevar preços e contribuir para reduzir a demanda e o consumo.',
    teachingAngle:
      'Trabalhar o preço como um incentivo econômico, sem garantir que todas as pessoas reagirão da mesma forma.',
    explanation:
      'A política altera o incentivo de compra; seus resultados dependem do desenho do imposto, do repasse ao preço e das alternativas disponíveis.',
    misconceptions: [
      'Impostos sobre bebidas açucaradas reduzem obrigatoriamente o preço final desses produtos.',
      'A OMS afirma que consumidores nunca mudam escolhas quando preços mudam.',
      'A única finalidade possível de um tributo é aumentar o lucro do fabricante.',
    ],
    source: {
      publisher: 'Organização Mundial da Saúde',
      title: 'WHO launches new guideline on fiscal policies to promote healthy diets',
      url: 'https://www.who.int/news/item/14-06-2024-who-launches-new-guideline-on-fiscal-policies-to-promote-healthy-diets',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'paho-tax-triple-win',
    topic: 'Custos sociais e receita pública',
    difficulty: 'desafiadora',
    claim:
      'A OPAS descreve a tributação de bebidas açucaradas como uma medida capaz de combinar ganhos de saúde, geração de receita e redução de custos econômicos associados a doenças.',
    teachingAngle:
      'Analisar custos que não aparecem no preço de compra e podem afetar famílias, produtividade e orçamento público.',
    explanation:
      'A expressão “ganho triplo” reúne três efeitos potenciais; ela não significa que a arrecadação substitua políticas de prevenção e educação.',
    misconceptions: [
      'A OPAS afirma que a tributação elimina imediatamente todas as doenças crônicas.',
      'A medida é descrita como incapaz de gerar qualquer receita pública.',
      'Os custos econômicos de doenças nunca afetam famílias ou serviços públicos.',
    ],
    source: {
      publisher: 'Organização Pan-Americana da Saúde',
      title: 'Sugar-sweetened beverage taxation: a triple win for health, revenue and health equity',
      url: 'https://www.paho.org/en/node/78468',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
  {
    id: 'world-bank-tax-design',
    topic: 'Desenho de políticas públicas',
    difficulty: 'desafiadora',
    claim:
      'A avaliação de impostos sobre bebidas açucaradas deve observar preço, demanda, substituição por outros produtos e efeitos econômicos para orientar o desenho da política.',
    teachingAngle:
      'Mostrar que uma política pública precisa ser medida e ajustada com dados, em vez de depender de uma única suposição.',
    explanation:
      'Analisar vários indicadores ajuda a verificar se o incentivo mudou escolhas e se surgiram efeitos não planejados.',
    misconceptions: [
      'Uma política tributária deve ignorar qualquer mudança de demanda ou substituição.',
      'Avaliar a política significa observar somente a cor das embalagens.',
      'O desenho do imposto não pode ser ajustado depois de sua implementação.',
    ],
    source: {
      publisher: 'Banco Mundial',
      title: 'Health Taxes on Sugar-Sweetened Beverages',
      url: 'https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099131211272311932',
      accessedAt: '2026-08-01',
    },
    review: KNOWLEDGE_REVIEW_STATUS,
  },
]);

export function getPerigoDoceKnowledgeForPrompt() {
  return perigoDoceKnowledge.map((fact) => ({
    id: fact.id,
    topic: fact.topic,
    claim: fact.claim,
    teachingAngle: fact.teachingAngle,
    source: {
      publisher: fact.source.publisher,
      title: fact.source.title,
      url: fact.source.url,
    },
  }));
}
