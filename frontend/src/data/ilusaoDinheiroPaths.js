export const ILUSAO_DINHEIRO_CONTENT_VERSION = '2026-08-01';

export const ILUSAO_DINHEIRO_REVIEW_STATUS = Object.freeze({
  technical: 'source_verified',
  pedagogical: 'pending_teacher_review',
});

export const ilusaoDinheiroKnowledge = Object.freeze([
  {
    id: 'bcb-two-strategies',
    claim:
      'Pessoas com condições econômicas semelhantes podem chegar a resultados diferentes quando adotam estratégias de compra distintas.',
    teachingAngle:
      'Mostrar que planejamento e contexto da decisão importam, sem atribuir todo resultado apenas à renda.',
    source: {
      publisher: 'Banco Central do Brasil / Ministério da Justiça',
      title: 'Eu vou levar — Série Eu e meu dinheiro',
      url: 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/escola-nacional-endc/videoteca/eu-vou-levar-serie-eu-e-meu-dinheiro',
      accessedAt: ILUSAO_DINHEIRO_CONTENT_VERSION,
    },
    review: ILUSAO_DINHEIRO_REVIEW_STATUS,
  },
  {
    id: 'bcb-budget-controls',
    claim:
      'Registrar, acompanhar e analisar renda e gastos oferece informações para decidir se uma compra cabe no orçamento.',
    teachingAngle:
      'Usar saldo e categorias como instrumentos de decisão, não como julgamento do aluno.',
    source: {
      publisher: 'Banco Central do Brasil',
      title: 'Relatório de letramento financeiro',
      url: 'https://www.bcb.gov.br/cidadaniafinanceira/letramento_financeiro',
      accessedAt: ILUSAO_DINHEIRO_CONTENT_VERSION,
    },
    review: ILUSAO_DINHEIRO_REVIEW_STATUS,
  },
  {
    id: 'bcb-impulse-and-credit',
    claim:
      'Compras não planejadas, marketing sedutor e excesso de compras a prazo podem comprometer o planejamento financeiro pessoal.',
    teachingAngle:
      'Relacionar impulso, publicidade e crédito com compromissos assumidos para os meses seguintes.',
    source: {
      publisher: 'Banco Central do Brasil',
      title: 'Caderno de Educação Financeira — Gestão de Finanças Pessoais',
      url: 'https://www.bcb.gov.br/pre/pef/port/caderno_cidadania_financeira.pdf',
      accessedAt: ILUSAO_DINHEIRO_CONTENT_VERSION,
    },
    review: ILUSAO_DINHEIRO_REVIEW_STATUS,
  },
  {
    id: 'susep-total-cost',
    claim:
      'Antes de comprar, é importante pesquisar preços e observar o custo total, pois parcelas pequenas podem esconder um compromisso elevado.',
    teachingAngle:
      'Diferenciar o valor da parcela do custo total da compra.',
    source: {
      publisher: 'Superintendência de Seguros Privados (SUSEP)',
      title: 'Educação Financeira',
      url: 'https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/educacao-financeira',
      accessedAt: ILUSAO_DINHEIRO_CONTENT_VERSION,
    },
    review: ILUSAO_DINHEIRO_REVIEW_STATUS,
  },
  {
    id: 'susep-social-influence',
    claim:
      'Uma compra feita apenas pela influência de outras pessoas pode afastar o consumidor de seu orçamento e de suas metas.',
    teachingAngle:
      'Trabalhar pertencimento e efeito manada sem ridicularizar o desejo de participar do grupo.',
    source: {
      publisher: 'Superintendência de Seguros Privados (SUSEP)',
      title: 'Educação Financeira',
      url: 'https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/educacao-financeira',
      accessedAt: ILUSAO_DINHEIRO_CONTENT_VERSION,
    },
    review: ILUSAO_DINHEIRO_REVIEW_STATUS,
  },
  {
    id: 'caixa-purchase-pause',
    claim:
      'Criar uma pausa antes de uma compra não planejada ajuda a comparar necessidade, alternativas e objetivos de longo prazo.',
    teachingAngle:
      'Transformar a espera em uma ferramenta prática contra urgência artificial.',
    source: {
      publisher: 'CAIXA Econômica Federal',
      title: 'Comprar é bom. Mas comprar com consciência é melhor ainda',
      url: 'https://www.caixa.gov.br/educacao-financeira/voce/comprar-e-bom-mas-comprar-com-consciencia-e-melhor-ainda/Paginas/default.aspx',
      accessedAt: ILUSAO_DINHEIRO_CONTENT_VERSION,
    },
    review: ILUSAO_DINHEIRO_REVIEW_STATUS,
  },
]);

function choice(
  id,
  analysisPoints,
  balanceDelta,
  label,
  consequence,
  principle,
) {
  return {
    id,
    analysisPoints,
    balanceDelta,
    label,
    consequence,
    principle,
  };
}

export const ilusaoDinheiroMission = Object.freeze({
  id: 'ilusao-dinheiro-caminhos-v1',
  phaseNumber: 3,
  title: 'A Ilusão do Dinheiro',
  characterName: 'Alex',
  initialBalance: 600,
  goalCost: 420,
  goalLabel: 'inscrição e materiais para uma feira técnica',
  introduction:
    'Alex recebeu 600 créditos simulados para organizar o mês. A meta principal custa 420, mas promoções, pressão social e imprevistos aparecerão pelo caminho.',
  disclaimer:
    'O saldo desta história é apenas uma simulação. Sua carteira real de CapiCoins só muda quando o Capi Bank registra o resultado final.',
  sourceFactIds: [
    'bcb-two-strategies',
    'bcb-budget-controls',
    'bcb-impulse-and-credit',
    'susep-total-cost',
    'susep-social-influence',
    'caixa-purchase-pause',
  ],
  decisions: [
    {
      id: 'flash-sale',
      stepLabel: 'Decisão 1 · A oferta relâmpago',
      title: 'Só hoje, segundo o anúncio',
      narrative:
        'Ao abrir uma rede social, Alex encontra um headset de R$ 160 com contador regressivo. A compra não estava no plano do mês.',
      question: 'Qual caminho Alex deve seguir?',
      sourceFactIds: ['bcb-impulse-and-credit', 'caixa-purchase-pause'],
      choices: [
        choice(
          'A',
          0,
          -160,
          'Comprar imediatamente para não perder o contador.',
          'A urgência venceu a comparação. O headset entrou no carrinho e consumiu R$ 160 do caixa.',
          'urgência artificial',
        ),
        choice(
          'B',
          1,
          -95,
          'Pesquisar por alguns minutos e escolher uma alternativa de R$ 95.',
          'A comparação reduziu o gasto, mas a compra ainda disputou recursos com uma meta já definida.',
          'pesquisa de preços',
        ),
        choice(
          'C',
          2,
          0,
          'Salvar na lista de desejos e esperar 24 horas antes de decidir.',
          'A pausa desativou a pressão do contador. Alex manteve o saldo e ganhou tempo para revisar a necessidade.',
          'pausa consciente',
        ),
      ],
    },
    {
      id: 'group-pressure',
      stepLabel: 'Decisão 2 · O convite do grupo',
      title: 'Todo mundo vai',
      narrative:
        'Os colegas combinam um passeio de R$ 100. Alex quer participar, mas o valor reservado para lazer no plano era menor.',
      question: 'Como equilibrar convivência e orçamento?',
      sourceFactIds: ['susep-social-influence', 'bcb-budget-controls'],
      choices: [
        choice(
          'A',
          0,
          -100,
          'Aceitar o pacote completo para não parecer diferente.',
          'Alex participou, mas permitiu que a pressão do grupo definisse sozinho o valor do gasto.',
          'efeito manada',
        ),
        choice(
          'B',
          1,
          -45,
          'Participar apenas da parte que cabe no limite de R$ 45.',
          'Alex preservou o convívio e comunicou um limite financeiro claro.',
          'limite de categoria',
        ),
        choice(
          'C',
          2,
          -15,
          'Propor uma atividade gratuita e separar R$ 15 para o transporte.',
          'O grupo ganhou uma alternativa acessível e Alex protegeu a meta sem se isolar.',
          'alternativa de baixo custo',
        ),
      ],
    },
    {
      id: 'small-installment',
      stepLabel: 'Decisão 3 · A parcela pequena',
      title: 'Quatro vezes de apenas R$ 45',
      narrative:
        'Uma loja oferece um acessório em quatro parcelas de R$ 45. O anúncio destaca a parcela, mas o compromisso total é de R$ 180.',
      question: 'Qual decisão considera melhor o futuro?',
      sourceFactIds: ['susep-total-cost', 'bcb-impulse-and-credit'],
      choices: [
        choice(
          'A',
          0,
          -180,
          'Aceitar porque R$ 45 parece pequeno e ignorar as outras parcelas.',
          'O caixa passou a representar o compromisso completo: R$ 180 deixarão de financiar outras escolhas.',
          'ilusão da parcela',
        ),
        choice(
          'B',
          1,
          -80,
          'Calcular os R$ 180 e escolher uma alternativa à vista de R$ 80.',
          'Alex comparou o custo total e reduziu o compromisso, embora ainda tenha feito uma compra não planejada.',
          'custo total',
        ),
        choice(
          'C',
          2,
          0,
          'Adiar a compra e continuar usando o equipamento atual.',
          'Sem urgência técnica, Alex evitou comprometer os próximos meses.',
          'compromisso futuro',
        ),
      ],
    },
    {
      id: 'free-trial',
      stepLabel: 'Decisão 4 · O teste gratuito',
      title: 'Grátis por sete dias',
      narrative:
        'Um aplicativo oferece teste gratuito, mas pede cartão e renova automaticamente por R$ 40 se o cancelamento for esquecido.',
      question: 'Como Alex deve lidar com esse custo escondido no tempo?',
      sourceFactIds: ['bcb-budget-controls', 'bcb-impulse-and-credit'],
      choices: [
        choice(
          'A',
          0,
          -40,
          'Ativar sem ler a renovação e confiar que vai lembrar depois.',
          'A cobrança automática aconteceu e retirou R$ 40 do caixa simulado.',
          'custo automático',
        ),
        choice(
          'B',
          1,
          0,
          'Ler as condições e criar um lembrete antes da renovação.',
          'Alex tornou a data visível e manteve controle sobre a continuidade do serviço.',
          'controle de assinatura',
        ),
        choice(
          'C',
          2,
          0,
          'Comparar com os recursos gratuitos da escola antes de cadastrar o cartão.',
          'Uma alternativa disponível atendeu à necessidade sem criar cobrança futura.',
          'comparar alternativas',
        ),
      ],
    },
    {
      id: 'unexpected-transport',
      stepLabel: 'Decisão 5 · O imprevisto',
      title: 'Transporte fora do planejado',
      narrative:
        'Uma atividade técnica obrigatória exige R$ 80 extras de transporte. É uma despesa essencial e não pode ser simplesmente ignorada.',
      question: 'Qual caminho protege melhor o restante do mês?',
      sourceFactIds: ['bcb-budget-controls', 'susep-total-cost'],
      choices: [
        choice(
          'A',
          0,
          -105,
          'Usar crédito sem verificar encargos e deixar a conta para depois.',
          'O transporte foi pago, mas o compromisso simulado subiu para R$ 105 por causa do custo do crédito.',
          'crédito sem comparação',
        ),
        choice(
          'B',
          1,
          -80,
          'Pagar os R$ 80 e reduzir o restante do lazer neste mês.',
          'Alex priorizou a despesa essencial e ajustou uma categoria flexível.',
          'revisão do orçamento',
        ),
        choice(
          'C',
          2,
          -80,
          'Usar a parte flexível planejada para imprevistos e registrar o gasto.',
          'A reserva cumpriu sua função e o registro manteve o planejamento atualizado.',
          'reserva para imprevistos',
        ),
      ],
    },
    {
      id: 'goal-upgrade',
      stepLabel: 'Decisão 6 · A hora da meta',
      title: 'Um upgrade antes da inscrição',
      narrative:
        'No dia de verificar a meta, surge uma oferta de upgrade de R$ 120. Ele não é necessário para participar da feira técnica.',
      question: 'Qual encerramento Alex escolhe para o mês?',
      sourceFactIds: ['bcb-two-strategies', 'caixa-purchase-pause'],
      choices: [
        choice(
          'A',
          0,
          -120,
          'Comprar o upgrade porque a oferta aparece junto da meta.',
          'O item extra consumiu R$ 120 e passou a competir diretamente com o objetivo principal.',
          'venda adicional',
        ),
        choice(
          'B',
          1,
          -40,
          'Escolher somente um material complementar de R$ 40 após comparar.',
          'Alex limitou o adicional, mas ainda reduziu o saldo disponível para a meta.',
          'priorização parcial',
        ),
        choice(
          'C',
          2,
          0,
          'Ignorar o upgrade e comparar o saldo final com a meta original.',
          'Alex encerrou o caminho usando o objetivo inicial como critério de decisão.',
          'fidelidade à meta',
        ),
      ],
    },
  ],
});
