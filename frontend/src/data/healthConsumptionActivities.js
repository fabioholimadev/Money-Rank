export const HEALTH_CONSUMPTION_ACTIVITIES = {
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
