export const ENGENHARIA_DESEJO_CONTENT_VERSION = '2026-08-03';

export const ENGENHARIA_DESEJO_ACTIVITY = {
  id: 'engenharia-desejo-fato-fake-v1',
  phaseNumber: 4,
  stepLabel: 'Fase 4',
  mechanicLabel: 'Fato ou Fake',
  title: 'Engenharia do Desejo',
  introduction:
    'Investigue seis peças publicitárias. Três foram documentadas por um órgão regulador e três foram criadas para o Money Rank. As fontes só aparecem depois do seu palpite.',
  passingCorrectAnswers: 4,
};

export const engenhariaDesejoKnowledge = {
  version: ENGENHARIA_DESEJO_CONTENT_VERSION,
  purpose:
    'Base auditável para ensinar leitura crítica de publicidade de apostas.',
  editorialRules: [
    'Peças reais devem ter uma fonte institucional verificável.',
    'Descrições reais são adaptações pedagógicas, não reproduções integrais dos anúncios.',
    'Peças inventadas não podem receber links, marcas reais ou citações falsas.',
    'A classificação é definida pelo banco revisado; nenhuma IA decide o gabarito durante o jogo.',
  ],
  policySources: [
    {
      institution: 'Ministério da Fazenda do Brasil',
      title:
        'Ministério da Fazenda amplia exigências de publicidade de apostas no país',
      url: 'https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/julho/ministerio-da-fazenda-amplia-exigencias-de-publicidade-de-apostas-no-pais',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      relevance:
        'Contextualiza advertências obrigatórias, proteção de menores e proibição de apresentar aposta como investimento.',
    },
    {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'Betting and gaming: appeal to children',
      url: 'https://www.asa.org.uk/advice-online/betting-and-gaming-appeal-to-children.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      relevance:
        'Explica critérios usados pelo regulador britânico para avaliar apelo indevido a menores.',
    },
  ],
};

const realReview = {
  technical: 'source_verified',
  pedagogical: 'pending_teacher_review',
};

const inventedReview = {
  technical: 'project_created',
  pedagogical: 'pending_teacher_review',
};

export const engenhariaDesejoAdBank = [
  {
    id: 'real-paddy-power-family',
    classification: 'REAL',
    title: 'A roda que interrompeu o almoço',
    advertiser: 'Paddy Power',
    scenario:
      'Um anúncio mostrou um jovem ignorando a conversa da família para apostar pelo celular. A narração reforçava que haveria uma nova chance todos os dias.',
    channel: 'Televisão e vídeo sob demanda',
    location: 'Reino Unido — TV, My5 e All4',
    observedAt: 'Março de 2022',
    explanation:
      'A peça existiu e foi considerada problemática porque colocava a aposta acima da interação familiar e normalizava a repetição diária.',
    tactic: {
      label: 'Repetição e urgência cotidiana',
      explanation:
        'Uma recompensa diária pode transformar o retorno frequente em hábito e reduzir a percepção de risco.',
    },
    evidence: {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'ASA Ruling on PPB Counterparty Services Ltd',
      url: 'https://www.asa.org.uk/rulings/ppb-counterparty-services-ltd-g22-1149460-ppb-counterparty-services-ltd.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      outcome: 'Reclamação acolhida',
    },
    review: realReview,
  },
  {
    id: 'real-playojo-hot-cold',
    classification: 'REAL',
    title: 'O painel que parecia prever a sorte',
    advertiser: 'PlayOJO',
    scenario:
      'Uma campanha exibia listas de jogos “quentes” e “frios”, atualizadas a cada poucos minutos, como se dados recentes ajudassem o jogador a escolher resultados futuros.',
    channel: 'Site, blog e televisão',
    location: 'Reino Unido',
    observedAt: 'Setembro de 2021',
    explanation:
      'A campanha existiu. O regulador entendeu que o conjunto da mensagem sugeria controle ou previsão sobre jogos de azar, mesmo com uma ressalva em letras menores.',
    tactic: {
      label: 'Ilusão de controle',
      explanation:
        'Dados passados e interfaces analíticas podem parecer científicos sem alterar a aleatoriedade do próximo resultado.',
    },
    evidence: {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'ASA Ruling on Skill On Net Ltd',
      url: 'https://www.asa.org.uk/rulings/skill-on-net-ltd-g22-1151443-skill-on-net-ltd.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      outcome: 'Reclamação parcialmente acolhida',
    },
    review: realReview,
  },
  {
    id: 'real-betvictor-footballers',
    classification: 'REAL',
    title: 'A pergunta de futebol que também era anúncio',
    advertiser: 'BetVictor',
    scenario:
      'Uma publicação paga no Facebook mostrou dois jogadores do Barcelona e perguntou qual atleta era mais subestimado pelo público, acompanhada pela identidade visual de uma casa de apostas.',
    channel: 'Facebook — publicação patrocinada',
    location: 'Reino Unido',
    observedAt: 'Janeiro de 2023',
    explanation:
      'A publicação existiu. Mesmo sem pedir uma aposta diretamente, ela foi tratada como publicidade e considerada de forte apelo para menores.',
    tactic: {
      label: 'Publicidade disfarçada de conversa',
      explanation:
        'Uma pergunta sobre esporte pode estimular comentários e compartilhamentos enquanto mantém a marca de apostas em evidência.',
    },
    evidence: {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'ASA Ruling on BV Gaming Ltd',
      url: 'https://www.asa.org.uk/rulings/bv-gaming-ltd-a23-1183713-bv-gaming-ltd.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      outcome: 'Reclamação acolhida',
    },
    review: realReview,
  },
  {
    id: 'real-kwiff-hamilton',
    classification: 'REAL',
    title: 'O fim de semana de um campeão',
    advertiser: 'Kwiff',
    scenario:
      'Uma conta de apostas publicou no X uma imagem de Lewis Hamilton e um texto sobre o grande fim de semana do piloto antes do Grande Prêmio da Inglaterra.',
    channel: 'X — conta da marca',
    location: 'Reino Unido',
    observedAt: 'Julho de 2024',
    explanation:
      'A publicação existiu e foi considerada publicidade de apostas com forte apelo a menores por usar um esportista de enorme popularidade entre jovens.',
    tactic: {
      label: 'Transferência de prestígio',
      explanation:
        'A admiração por um ídolo esportivo pode ser transferida para a marca e diminuir a leitura crítica da mensagem.',
    },
    evidence: {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'ASA Ruling on Eaton Gate Gaming Ltd',
      url: 'https://www.asa.org.uk/rulings/eaton-gate-gaming-ltd-a24-1252292-eaton-gate-gaming-ltd.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      outcome: 'Reclamação acolhida',
    },
    review: realReview,
  },
  {
    id: 'real-freebets-mason-mount',
    classification: 'REAL',
    title: 'A transferência comentada por uma página de apostas',
    advertiser: 'Freebetsdotcom',
    scenario:
      'Uma publicação no Instagram usou a imagem do jogador Mason Mount durante rumores sobre sua transferência de clube, promovendo uma página ligada a apostas.',
    channel: 'Instagram',
    location: 'Reino Unido',
    observedAt: 'Julho de 2023',
    explanation:
      'A publicação existiu. O regulador concluiu que o atleta tinha forte apelo para menores e que a página facilitava o acesso a serviços de apostas.',
    tactic: {
      label: 'Aproveitamento de assunto em alta',
      explanation:
        'Marcas podem entrar em conversas esportivas populares para alcançar o público antes que ele perceba a intenção comercial.',
    },
    evidence: {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'ASA Ruling on XLMedia plc',
      url: 'https://www.asa.org.uk/rulings/xlmedia-plc-g23-1205202-xlmedia-plc.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      outcome: 'Reclamação acolhida',
    },
    review: realReview,
  },
  {
    id: 'real-sean-graham-voucher',
    classification: 'REAL',
    title: 'O vale promocional com uma condição escondida',
    advertiser: 'Sean Graham',
    scenario:
      'Um folheto ofereceu um vale de aposta correspondente a cinco libras e indicou uso em qualquer loja da rede, mas a data de validade relevante não aparecia com clareza.',
    channel: 'Folheto e vale impresso',
    location: 'Reino Unido',
    observedAt: 'Março de 2025',
    explanation:
      'A promoção existiu e foi considerada enganosa porque uma condição importante de validade não estava suficientemente clara para o consumidor.',
    tactic: {
      label: 'Condição essencial pouco visível',
      explanation:
        'Uma vantagem em destaque pode dominar a atenção enquanto prazo e restrições ficam fáceis de ignorar.',
    },
    evidence: {
      institution: 'Advertising Standards Authority (ASA)',
      title: 'ASA Ruling on SP Graham Retail Ltd',
      url: 'https://www.asa.org.uk/rulings/sp-graham-retail-ltd.html',
      accessedAt: ENGENHARIA_DESEJO_CONTENT_VERSION,
      outcome: 'Reclamação acolhida',
    },
    review: realReview,
  },
  {
    id: 'invented-luck-recovery',
    classification: 'INVENTED',
    title: 'O modo automático de recuperação da sorte',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario:
      'Um anúncio afirma que, depois de três derrotas seguidas, o aplicativo reconhece o azar e dobra automaticamente a chance de vitória na próxima rodada.',
    channel: 'Vídeo curto simulado para rede social',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation:
      'Esta peça foi inventada pelo Money Rank. Uma sequência de perdas não obriga um resultado aleatório futuro a compensar o jogador.',
    tactic: {
      label: 'Falácia do jogador',
      explanation:
        'A crença de que uma perda aumenta a chance imediata de vitória pode incentivar novas apostas para “recuperar” dinheiro.',
    },
    evidence: null,
    review: inventedReview,
  },
  {
    id: 'invented-school-ranking',
    classification: 'INVENTED',
    title: 'O ranking de escolas patrocinado por uma bet',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario:
      'Uma plataforma promete probabilidades especiais para estudantes que cadastrarem a escola e convida turmas a competir pelo maior número de apostas da semana.',
    channel: 'Campanha simulada para aplicativo',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation:
      'Esta peça foi inventada para provocar análise crítica. Direcionar apostas a estudantes e transformar escolas em ranking seria um grave sinal de exploração de menores.',
    tactic: {
      label: 'Pressão de grupo e competição',
      explanation:
        'Rankings e recompensas coletivas podem fazer uma decisão de risco parecer obrigação social.',
    },
    evidence: null,
    review: inventedReview,
  },
  {
    id: 'invented-loss-insurance',
    classification: 'INVENTED',
    title: 'A assinatura que devolveria todas as perdas',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario:
      'Uma campanha vende um “seguro de derrota” mensal e afirma devolver integralmente tudo o que o usuário perder, sem limite, prazo ou condição de uso.',
    channel: 'Banner simulado para site',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation:
      'Esta oferta foi inventada. Promessas absolutas e sem condições devem acionar o radar de verificação antes de qualquer decisão financeira.',
    tactic: {
      label: 'Risco aparentemente eliminado',
      explanation:
        'A palavra “seguro” pode criar sensação de proteção total e esconder custos, limites ou riscos reais.',
    },
    evidence: null,
    review: inventedReview,
  },
  {
    id: 'invented-lucky-minute',
    classification: 'INVENTED',
    title: 'O relógio que encontraria o minuto da sorte',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario:
      'Um aplicativo diz combinar bateria do celular, clima e horário para avisar o minuto exato em que as chances de ganhar ficam maiores.',
    channel: 'Anúncio simulado em loja de aplicativos',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation:
      'A peça é uma criação do Money Rank. Indicadores sem relação causal não mudam as probabilidades de um jogo aleatório.',
    tactic: {
      label: 'Tecnologia como autoridade',
      explanation:
        'Palavras como algoritmo e inteligência podem dar aparência científica a uma promessa sem fundamento.',
    },
    evidence: null,
    review: inventedReview,
  },
  {
    id: 'invented-financial-certificate',
    classification: 'INVENTED',
    title: 'O desafio que prometia disciplina financeira',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario:
      'Um influenciador convida seguidores para apostar durante trinta dias e promete um certificado de disciplina financeira a quem não abandonar o desafio.',
    channel: 'Série simulada de vídeos de influenciador',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation:
      'Esta campanha foi inventada. Frequência de apostas não comprova educação financeira e um certificado não transforma risco em investimento.',
    tactic: {
      label: 'Autoridade e compromisso público',
      explanation:
        'Um influenciador e uma meta de dias podem pressionar a continuidade mesmo quando parar seria a melhor decisão.',
    },
    evidence: null,
    review: inventedReview,
  },
  {
    id: 'invented-meal-cashback',
    classification: 'INVENTED',
    title: 'O cashback que viraria merenda',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario:
      'Uma plataforma anuncia que cada aposta perdida gera créditos para refeições e apresenta a promoção como uma forma de nunca sair totalmente no prejuízo.',
    channel: 'Outdoor simulado próximo a escolas',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation:
      'A peça foi criada pelo Money Rank. Vincular uma necessidade básica a perdas pode mascarar o prejuízo e normalizar apostas entre jovens.',
    tactic: {
      label: 'Reenquadramento da perda',
      explanation:
        'Uma recompensa pequena pode desviar a atenção do valor maior perdido para obtê-la.',
    },
    evidence: null,
    review: inventedReview,
  },
];
