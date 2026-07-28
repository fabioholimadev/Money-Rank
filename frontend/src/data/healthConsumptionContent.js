export const HEALTH_CONSUMPTION_CONTENT = {
  introducao: {
    id: 'introducao',
    phaseNumber: 0,
    stepLabel: 'Passo 0',
    title: 'Introdução: escolhas que moldam o seu futuro',
    description:
      'Antes de começar as fases, observe como técnicas de venda e decisões por impulso podem afetar o bolso.',
    video: {
      embedUrl: 'https://www.youtube.com/embed/k6O554uP2Kc',
      title: 'Duas vezes Judite — Série Eu e meu dinheiro',
      sourceLabel: 'Banco Central do Brasil / Ministério da Justiça',
      sourceUrl:
        'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/escola-nacional-endc/videoteca/duas-vezes-judite-serie-eu-e-meu-dinheiro',
    },
    completionLabel: 'Assisti ao vídeo introdutório',
    continueLabel: 'Começar a Fase 1',
    nextPath: '/trilha/saude-consumo/perigo-doce/conteudo',
    introduction: true,
  },

  perigoDoce: {
    id: 'perigo-doce',
    phaseNumber: 1,
    stepLabel: 'Fase 1',
    title: 'O Perigo do Doce',
    description:
      'Entenda como o consumo de açúcar pode gerar impactos na saúde, no orçamento familiar e nos serviços públicos.',
    video: {
      embedUrl: 'https://www.youtube.com/embed/ZnTJw_e7YDU',
      title: 'Vídeo educativo — O Perigo do Doce',
      sourceLabel: 'Conteúdo educativo selecionado pelo Money Rank',
      sourceUrl: 'https://www.youtube.com/watch?v=ZnTJw_e7YDU',
    },
    slides: {
      embedUrl:
        'https://docs.google.com/presentation/d/e/2PACX-1vSIyWrjISGHq781i0JeVy4rJMw2chATeHHYWL_RvjNpocCsS4iyVC3gUZxEJw1UURrQa_xuUxJ-jFNZ/pubembed?start=false&loop=false&delayms=3000',
      title: 'Slides da aula — O Perigo do Doce',
    },
    completionLabel: 'Explorei o vídeo e os slides desta fase',
    continueLabel: 'Ir para o Quiz de Fixação',
    activityPath: '/trilha/saude-consumo/perigo-doce/atividade',
  },

  custoVicio: {
    id: 'custo-vicio',
    phaseNumber: 2,
    stepLabel: 'Fase 2',
    title: 'O Custo do Vício',
    description:
      'Analise como gastos recorrentes com tabaco, vapes e álcool se acumulam e reduzem outras possibilidades de escolha.',
    video: {
      embedUrl: 'https://www.youtube.com/embed/PniRKApD7co',
      title: 'Vídeo educativo do INCA sobre o tabagismo',
      sourceLabel: 'Instituto Nacional de Câncer (INCA)',
      sourceUrl: 'https://www.youtube.com/watch?v=PniRKApD7co',
    },
    materialsTitle: 'Pontos para levar ao estudo de caso',
    materials: [
      {
        title: 'Custo recorrente',
        description:
          'Um gasto pequeno e frequente deve ser analisado pelo total semanal, mensal e anual.',
      },
      {
        title: 'Custo de oportunidade',
        description:
          'Todo valor gasto deixa de financiar outra meta, como transporte, estudo, lazer ou reserva.',
      },
      {
        title: 'Impacto coletivo',
        description:
          'Problemas de saúde também geram custos para famílias, empresas e serviços públicos.',
      },
      {
        title: 'Decisão baseada em evidências',
        description:
          'Compare o custo financeiro com os riscos à saúde antes de avaliar qualquer escolha.',
      },
    ],
    completionLabel: 'Explorei o vídeo e os materiais desta fase',
    continueLabel: 'Ir para o Estudo de Caso',
    activityPath: '/trilha/saude-consumo/custo-vicio/atividade',
  },

  ilusaoDinheiro: {
    id: 'ilusao-dinheiro',
    phaseNumber: 3,
    stepLabel: 'Fase 3',
    title: 'A Ilusão do Dinheiro',
    description:
      'Reconheça decisões automáticas, pressão social e efeito manada para fazer escolhas financeiras mais conscientes.',
    video: {
      embedUrl:
        'https://www.youtube-nocookie.com/embed/FdTip4SdWMw?start=2',
      title: 'Eu vou levar — Série Eu e meu dinheiro',
      sourceLabel: 'Banco Central do Brasil / Ministério da Justiça',
      sourceUrl:
        'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/escola-nacional-endc/videoteca/eu-vou-levar-serie-eu-e-meu-dinheiro',
    },
    materialsTitle: 'Checklist para escapar das decisões automáticas',
    materials: [
      {
        title: 'Identifique a influência',
        description:
          'Pergunte se a vontade nasceu de uma necessidade real ou da pressão do grupo e da publicidade.',
      },
      {
        title: 'Calcule o custo total',
        description:
          'Parcelas pequenas podem esconder um valor final alto e comprometer meses do orçamento.',
      },
      {
        title: 'Crie uma pausa',
        description:
          'Adiar uma compra não urgente ajuda a reduzir a força do impulso e melhora a comparação.',
      },
      {
        title: 'Volte à sua meta',
        description:
          'Compare a compra com o objetivo financeiro que você definiu para o mesmo dinheiro.',
      },
    ],
    completionLabel: 'Explorei o vídeo e os materiais desta fase',
    continueLabel: 'Ir para Caminhos de Decisão',
    activityPath: '/trilha/saude-consumo/ilusao-dinheiro/atividade',
  },

  engenhariaDesejo: {
    id: 'engenharia-desejo',
    phaseNumber: 4,
    stepLabel: 'Fase 4',
    title: 'A Engenharia do Desejo',
    description:
      'Descubra como plataformas de apostas usam velocidade, recompensas e estímulos para manter o jogador ativo.',
    video: {
      embedUrl: 'https://www.youtube.com/embed/liUKTPXW6Ac',
      title: 'Como funcionam as apostas on-line e o que diz a lei',
      sourceLabel: 'TV Senado',
      sourceUrl:
        'https://www12.senado.leg.br/tv/programas/cidadania-1/2024/10/entenda-como-funcionam-as-apostas-online-e-o-que-diz-a-lei-das-bets',
    },
    materialsTitle: 'Sinais para analisar uma aposta com pensamento crítico',
    materials: [
      {
        title: 'Aposta não é investimento',
        description:
          'Investir busca construir patrimônio; apostar depende de um resultado incerto e pode gerar perda rápida.',
      },
      {
        title: 'A plataforma tem vantagem',
        description:
          'As regras e probabilidades são organizadas para sustentar o negócio da empresa ao longo do tempo.',
      },
      {
        title: 'Recompensa variável',
        description:
          'Resultados imprevisíveis estimulam novas tentativas e podem dificultar a decisão de parar.',
      },
      {
        title: 'Proteja o orçamento',
        description:
          'Dinheiro de alimentação, transporte, contas e metas nunca deve ser tratado como saldo de aposta.',
      },
    ],
    completionLabel: 'Explorei o vídeo e os materiais desta fase',
    continueLabel: 'Ir para Fato ou Fake',
    activityPath: '/trilha/saude-consumo/engenharia-desejo/atividade',
  },
};
