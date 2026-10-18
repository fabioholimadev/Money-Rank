export const WORKSHOP_SOURCES = Object.freeze({
  RFB_EDUCACAO_FISCAL: {
    title: 'Educação Fiscal: Estado, Tributos e Sociedade',
    url: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/cidadania-fiscal/cidadania-fiscal-no-curriculo-escolar/videos/professores/educacao-fiscal',
  },
  RFB_NOTA_FISCAL: {
    title: 'Nota Fiscal e Cupom Fiscal, aliados da sociedade',
    url: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/materiais-didaticos/cidadania-fiscal/curriculo-escolar/quem-ensina/planos-de-aula/modelos-aulas/modelos-aulas-01',
  },
  ORCAMENTO_CIDADAO: {
    title: 'Orçamento Cidadão',
    url: 'https://www.gov.br/planejamento/pt-br/assuntos/orcamento/orcamento-cidadao',
  },
  PORTAL_TRANSPARENCIA: {
    title: 'Portal da Transparência do Governo Federal',
    url: 'https://www.gov.br/fnde/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas/portal-da-transparencia',
  },
  MEI_DIREITOS_OBRIGACOES: {
    title: 'MEI — Direitos e Obrigações',
    url: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/direitos-e-obrigacoes/',
  },
  EMPREENDEDORISMO_FEMININO: {
    title: 'O Empreendedorismo Feminino no Brasil',
    url: 'https://www.gov.br/empresas-e-negocios/pt-br/drei/novos-paineis-do-mapa-de-empresas-e-observatorio-do-empreendedorismo-feminino/mapa-de-empresas-especial-mulheres-1.pdf',
  },
  CNPQ_INICIACAO: {
    title: 'Programas Institucionais de Iniciação Científica e Tecnológica',
    url: 'https://www.gov.br/cnpq/pt-br/acesso-a-informacao/acoes-e-programas/programas/programas-ict/programas-de-iniciacao-cientifica-teste-Proposta-ACS/',
  },
  CNPQ_MULHERES_CIENCIA: {
    title: 'Painel de Fomento em Ciência, Tecnologia e Inovação',
    url: 'https://www.gov.br/cnpq/pt-br/assuntos/noticias/cnpq-em-acao/2023.09.20PainelolhareseperspectivasCNPq.pdf',
  },
});

const CONCEPTS = [
  ['tributos-politicas', 'Tributos', 'Recursos que ajudam a financiar políticas e serviços públicos.', true, 'Os tributos ajudam a financiar políticas e serviços públicos.', 'Recursos que ajudam a financiar saúde, educação e outros serviços públicos são chamados de ____.', 'O que conecta arrecadação à oferta de políticas públicas?', 'RFB_EDUCACAO_FISCAL'],
  ['orcamento-alocacao', 'Orçamento público', 'Instrumento que organiza receitas e define a alocação das despesas públicas.', true, 'O orçamento público mostra prioridades e destina recursos a diferentes áreas.', 'O instrumento que organiza receitas e despesas do governo é o ____.', 'Onde a sociedade pode observar como recursos públicos serão distribuídos?', 'ORCAMENTO_CIDADAO'],
  ['controle-social', 'Controle social', 'Acompanhamento da gestão pública feito pela sociedade.', false, 'Controle social significa deixar somente o governo fiscalizar o uso do dinheiro público.', 'Quando a sociedade acompanha e fiscaliza a gestão pública, pratica ____.', 'Como se chama a participação cidadã no acompanhamento da gestão pública?', 'PORTAL_TRANSPARENCIA'],
  ['transparencia-ativa', 'Transparência ativa', 'Divulgação de informações públicas sem depender de um pedido individual.', true, 'O Portal da Transparência é um instrumento de transparência ativa.', 'A divulgação espontânea de dados públicos é chamada de ____.', 'Que prática permite consultar informações governamentais já publicadas?', 'PORTAL_TRANSPARENCIA'],
  ['portal-transparencia', 'Portal da Transparência', 'Site de acesso livre com dados como orçamento, licitações e benefícios sociais.', false, 'O Portal da Transparência pode ser usado apenas por servidoras e servidores públicos.', 'Orçamento, licitações e benefícios podem ser consultados no ____.', 'Qual ferramenta pública permite acompanhar gastos e transferências federais?', 'PORTAL_TRANSPARENCIA'],
  ['nota-fiscal-cidadania', 'Nota fiscal', 'Documento que registra a operação e apoia direitos do consumidor e fiscalização tributária.', true, 'Pedir nota fiscal é também uma atitude de cidadania fiscal.', 'O documento que registra a compra e pode apoiar uma reclamação é a ____.', 'Qual documento deve ser solicitado em uma compra para registrar a operação?', 'RFB_NOTA_FISCAL'],
  ['comprovante-garantia', 'Comprovante de compra', 'Registro que ajuda a demonstrar quando, onde e o que foi adquirido.', false, 'Guardar o comprovante não ajuda quando surge um problema com o produto.', 'Para demonstrar uma compra em caso de problema, é útil guardar o ____.', 'O que ajuda a comprovar uma relação de consumo?', 'RFB_NOTA_FISCAL'],
  ['orcamento-cidadao', 'Orçamento Cidadão', 'Versão acessível que explica os principais temas e números do projeto orçamentário.', true, 'O Orçamento Cidadão busca tornar informações orçamentárias mais acessíveis.', 'A publicação anual que traduz o projeto orçamentário em linguagem acessível é o ____.', 'Qual publicação facilita a compreensão do orçamento pela população?', 'ORCAMENTO_CIDADAO'],
  ['formalizacao-mei', 'Formalização como MEI', 'Processo oficial que cria um CNPJ para atividade individual enquadrada nas regras do MEI.', false, 'A formalização oficial como MEI exige pagamento a uma associação privada.', 'A criação oficial e gratuita de um pequeno negócio individual pode ocorrer pela ____.', 'Qual caminho oficial pode dar CNPJ a uma empreendedora individual elegível?', 'MEI_DIREITOS_OBRIGACOES'],
  ['das-mei', 'DAS', 'Guia mensal usada pelo MEI para recolher sua contribuição.', true, 'Pagar mensalmente o DAS é uma obrigação do MEI.', 'A guia mensal de contribuição do MEI é chamada de ____.', 'Qual documento reúne o pagamento mensal devido pelo MEI?', 'MEI_DIREITOS_OBRIGACOES'],
  ['dasn-simei', 'DASN-SIMEI', 'Declaração anual em que o MEI informa seu faturamento.', true, 'O MEI deve entregar a declaração anual de faturamento.', 'A declaração anual de faturamento do MEI é a ____.', 'Qual obrigação anual informa o faturamento do MEI?', 'MEI_DIREITOS_OBRIGACOES'],
  ['nota-mei-pj', 'Nota fiscal para pessoa jurídica', 'Documento que o MEI deve emitir, em regra, quando negocia com outra empresa.', false, 'O MEI nunca precisa emitir nota fiscal quando vende para outra empresa.', 'Ao negociar com uma empresa, o MEI deve observar a obrigação de emitir ____.', 'Em uma venda do MEI para outra empresa, qual documento fiscal normalmente é exigido?', 'MEI_DIREITOS_OBRIGACOES'],
  ['relatorio-mensal', 'Relatório mensal', 'Registro de receitas que integra a organização das obrigações do MEI.', true, 'Preencher o relatório mensal está entre as obrigações listadas para o MEI.', 'Para acompanhar as receitas do negócio, o MEI deve preencher o ____.', 'Que registro periódico ajuda o MEI a organizar suas receitas?', 'MEI_DIREITOS_OBRIGACOES'],
  ['guardar-notas', 'Arquivo de notas fiscais', 'Conjunto de notas de compra e venda que o MEI deve conservar pelo prazo indicado na orientação oficial.', true, 'A orientação oficial manda o MEI guardar notas fiscais de compra e venda por cinco anos.', 'Documentos de compra e venda devem compor o ____ do negócio.', 'O que a empreendedora deve manter organizado para comprovar operações do negócio?', 'MEI_DIREITOS_OBRIGACOES'],
  ['faturamento', 'Faturamento', 'Total das receitas de vendas e serviços antes de descontar despesas.', false, 'Faturamento e lucro representam sempre o mesmo valor.', 'O total obtido com vendas e serviços antes das despesas é o ____.', 'Qual medida registra a receita bruta do negócio, e não o resultado após custos?', 'MEI_DIREITOS_OBRIGACOES'],
  ['obrigacoes-em-dia', 'Regularidade do MEI', 'Cumprimento de pagamentos e declarações necessários para manter as obrigações organizadas.', true, 'DAS e declaração anual fazem parte da rotina de regularidade do MEI.', 'Manter pagamentos e declarações em dia contribui para a ____.', 'O que resulta do cumprimento contínuo das obrigações formais do MEI?', 'MEI_DIREITOS_OBRIGACOES'],
  ['lideranca-feminina', 'Liderança feminina', 'Participação de mulheres na condução de empresas e na geração de renda.', true, 'Dados públicos recentes registram milhões de empresas brasileiras lideradas por mulheres.', 'A presença de mulheres na condução de negócios é chamada de ____.', 'Qual expressão descreve empresas conduzidas por mulheres?', 'EMPREENDEDORISMO_FEMININO'],
  ['dados-empreendedorismo', 'Mapa de Empresas', 'Base pública usada para observar porte, setor, território e liderança empresarial.', false, 'Dados sobre liderança feminina nas empresas não podem apoiar políticas públicas.', 'A base que amplia a transparência sobre a dinâmica empresarial é o ____.', 'Qual fonte pública ajuda a analisar a presença de mulheres nos negócios?', 'EMPREENDEDORISMO_FEMININO'],
  ['inclusao-produtiva', 'Inclusão produtiva', 'Ampliação de oportunidades de trabalho, renda e participação econômica.', true, 'O empreendedorismo feminino pode contribuir para renda e inclusão produtiva.', 'A ampliação de oportunidades de trabalho e renda favorece a ____.', 'Que resultado social pode ser fortalecido por negócios liderados por mulheres?', 'EMPREENDEDORISMO_FEMININO'],
  ['iniciacao-cientifica', 'Iniciação científica', 'Experiência formativa que aproxima jovens da pesquisa e de carreiras científicas.', true, 'A iniciação científica busca despertar e formar jovens talentos para ciência e tecnologia.', 'O primeiro contato estruturado de estudantes com pesquisa pode ocorrer na ____.', 'Qual programa formativo aproxima jovens da prática de pesquisa?', 'CNPQ_INICIACAO'],
  ['pibic-em', 'PIBIC-EM', 'Modalidade de iniciação científica destinada a estudantes do ensino médio.', false, 'O PIBIC-EM é destinado exclusivamente a pessoas que já concluíram doutorado.', 'A modalidade de iniciação científica para o ensino médio é o ____.', 'Qual programa permite a estudantes do ensino médio participar de pesquisas?', 'CNPQ_INICIACAO'],
  ['bolsa-pesquisa', 'Bolsa de pesquisa', 'Apoio que contribui para formação e permanência em atividades científicas.', true, 'Bolsas públicas podem apoiar a formação de jovens pesquisadoras.', 'O apoio financeiro à formação em pesquisa pode ocorrer por meio de ____.', 'Que instrumento de fomento ajuda estudantes a permanecer em atividades científicas?', 'CNPQ_INICIACAO'],
  ['subrepresentacao', 'Sub-representação feminina', 'Participação proporcionalmente baixa de mulheres em determinadas áreas ou níveis científicos.', true, 'Dados do CNPq mostram sub-representação feminina em áreas como Computação.', 'A presença proporcionalmente baixa de mulheres em uma área é uma ____.', 'Como se chama a baixa participação proporcional de mulheres em um campo científico?', 'CNPQ_MULHERES_CIENCIA'],
  ['equidade-ciencia', 'Equidade de gênero na ciência', 'Conjunto de condições e ações para ampliar oportunidades e participação de mulheres na ciência e tecnologia.', false, 'Promover equidade de gênero reduz necessariamente a excelência científica.', 'Ampliar oportunidades e participação de mulheres fortalece a ____.', 'Que objetivo orienta ações para reduzir barreiras enfrentadas por mulheres na ciência?', 'CNPQ_MULHERES_CIENCIA'],
];

function distractors(index) {
  return [1, 7, 13].map((offset) => CONCEPTS[(index + offset) % CONCEPTS.length][1]);
}

function source(sourceId) {
  return { sourceId, ...WORKSHOP_SOURCES[sourceId] };
}

export const WORKSHOP_ACTIVITY_KEYS = Object.freeze({
  'verdadeiro-falso': { activityId: 'workshop-true-false-v1', phaseNumber: 1 },
  'ligar-colunas': { activityId: 'workshop-matching-v1', phaseNumber: 2 },
  'completar-frases': { activityId: 'workshop-fill-blank-v1', phaseNumber: 3 },
  quiz: { activityId: 'workshop-quiz-v1', phaseNumber: 4 },
});

export const WORKSHOP_QUESTION_BANK = Object.freeze({
  'verdadeiro-falso': CONCEPTS.map((concept, index) => ({
    itemId: `wf-tf-${String(index + 1).padStart(2, '0')}`,
    prompt: concept[4],
    options: ['Verdadeiro', 'Falso'],
    correctIndex: concept[3] ? 0 : 1,
    explanation: concept[2],
    ...source(concept[7]),
  })),
  'ligar-colunas': CONCEPTS.map((concept, index) => {
    const options = [concept[2], ...[1, 7, 13].map((offset) => CONCEPTS[(index + offset) % CONCEPTS.length][2])];
    return {
      itemId: `wf-match-${String(index + 1).padStart(2, '0')}`,
      prompt: concept[1],
      options,
      correctIndex: 0,
      explanation: `${concept[1]}: ${concept[2]}`,
      ...source(concept[7]),
    };
  }),
  'completar-frases': CONCEPTS.map((concept, index) => ({
    itemId: `wf-fill-${String(index + 1).padStart(2, '0')}`,
    prompt: concept[5],
    options: [concept[1], ...distractors(index)],
    correctIndex: 0,
    explanation: `${concept[1]} — ${concept[2]}`,
    ...source(concept[7]),
  })),
  quiz: CONCEPTS.map((concept, index) => ({
    itemId: `wf-quiz-${String(index + 1).padStart(2, '0')}`,
    prompt: concept[6],
    options: [concept[1], ...distractors(index)],
    correctIndex: 0,
    explanation: concept[2],
    ...source(concept[7]),
  })),
});

export function validateWorkshopQuestionBank() {
  for (const [key, items] of Object.entries(WORKSHOP_QUESTION_BANK)) {
    if (items.length !== 24) throw new Error(`Banco ${key} deve conter 24 itens.`);
    if (new Set(items.map((item) => item.itemId)).size !== items.length) {
      throw new Error(`Banco ${key} contém identificadores duplicados.`);
    }
    for (const item of items) {
      if (!WORKSHOP_SOURCES[item.sourceId] || !item.url.startsWith('https://')) {
        throw new Error(`Item ${item.itemId} não possui fonte oficial válida.`);
      }
    }
  }
  return true;
}
