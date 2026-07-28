export const HEALTH_CONSUMPTION_ACTIVITIES = {
  custoVicio: {
    id: 'custo-vicio-case',
    phaseNumber: 2,
    stepLabel: 'Fase 2',
    mechanicLabel: 'Estudo de Caso',
    title: 'O orçamento de Rafael',
    prompt:
      'Rafael gasta R$ 15 por dia com um hábito de consumo. Considerando 30 dias, quanto esse gasto representa no mês?',
    options: [
      { label: 'R$ 150', correct: false },
      { label: 'R$ 300', correct: false },
      { label: 'R$ 450', correct: true },
      { label: 'R$ 1.500', correct: false },
    ],
    explanation:
      'R$ 15 × 30 dias = R$ 450. Observar o total mensal ajuda a enxergar o custo real de um gasto recorrente.',
    nextPath: '/trilha/saude-consumo/ilusao-dinheiro/conteudo',
    nextLabel: 'Continuar para a Fase 3',
  },

  ilusaoDinheiro: {
    id: 'ilusao-dinheiro-paths',
    phaseNumber: 3,
    stepLabel: 'Fase 3',
    mechanicLabel: 'Caminhos de Decisão',
    title: 'Uma promoção que termina hoje',
    prompt:
      'Todos os seus colegas estão comprando um produto em promoção. Você não planejava essa compra. Qual caminho protege melhor o seu orçamento?',
    options: [
      {
        label: 'Comprar imediatamente para não ficar de fora',
        correct: false,
      },
      {
        label: 'Parcelar no máximo possível sem calcular o total',
        correct: false,
      },
      {
        label: 'Esperar, comparar preços e revisar sua meta financeira',
        correct: true,
      },
    ],
    explanation:
      'Criar uma pausa reduz o impulso e permite comparar a compra com suas necessidades e metas.',
    nextPath: '/trilha/saude-consumo/engenharia-desejo/conteudo',
    nextLabel: 'Continuar para a Fase 4',
  },

  engenhariaDesejo: {
    id: 'engenharia-desejo-fact',
    phaseNumber: 4,
    stepLabel: 'Fase 4',
    mechanicLabel: 'Fato ou Fake',
    title: 'Aposta é investimento?',
    prompt:
      '“Apostar regularmente é uma forma segura de investimento, porque a experiência do jogador elimina o risco de perda.”',
    options: [
      { label: 'Fato', correct: false },
      { label: 'Fake', correct: true },
    ],
    explanation:
      'Fake. Apostas dependem de resultados incertos e a plataforma mantém vantagem estatística. Isso não elimina o risco nem constrói patrimônio de forma previsível.',
    nextPath: '/trilha',
    nextLabel: 'Voltar ao mapa da trilha',
  },
};
