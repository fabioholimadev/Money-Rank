import { CONTENT_MATERIAL_STATUS } from '../lib/contentMaterialModel.js';

const AVAILABLE = CONTENT_MATERIAL_STATUS.AVAILABLE;
const PENDING = CONTENT_MATERIAL_STATUS.PENDING;

function pendingMaterial(title, description) {
  return {
    status: PENDING,
    title,
    description,
  };
}

export const HEALTH_CONSUMPTION_CONTENT = {
  introducao: {
    id: 'introducao',
    phaseNumber: 0,
    stepLabel: 'Passo 0',
    title: 'Introdução: escolhas que moldam o seu futuro',
    description:
      'Antes de começar as fases, observe como técnicas de venda e decisões por impulso podem afetar o bolso.',
    materialSlots: {
      video: {
        status: AVAILABLE,
        title: 'Duas vezes Judite — Série Eu e meu dinheiro',
        description: 'Vídeo introdutório sobre consumo e tomada de decisão.',
        embedUrl: 'https://www.youtube.com/embed/k6O554uP2Kc',
        sourceLabel: 'Banco Central do Brasil / Ministério da Justiça',
        sourceUrl:
          'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/escola-nacional-endc/videoteca/duas-vezes-judite-serie-eu-e-meu-dinheiro',
        format: 'YouTube',
        estimatedMinutes: 5,
        version: '1.0',
      },
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
    materialSlots: {
      video: {
        status: AVAILABLE,
        title: 'Vídeo educativo — O Perigo do Doce',
        description: 'Apresenta os conceitos centrais usados no quiz da fase.',
        embedUrl: 'https://www.youtube.com/embed/ZnTJw_e7YDU',
        sourceLabel: 'Conteúdo educativo selecionado pelo Money Rank',
        sourceUrl: 'https://www.youtube.com/watch?v=ZnTJw_e7YDU',
        format: 'YouTube',
        estimatedMinutes: 6,
        version: '1.0',
      },
      slides: {
        status: AVAILABLE,
        title: 'Slides da aula — O Perigo do Doce',
        description: 'Material visual preparado para acompanhar o vídeo.',
        embedUrl:
          'https://docs.google.com/presentation/d/e/2PACX-1vSIyWrjISGHq781i0JeVy4rJMw2chATeHHYWL_RvjNpocCsS4iyVC3gUZxEJw1UURrQa_xuUxJ-jFNZ/pubembed?start=false&loop=false&delayms=3000',
        format: 'Google Slides',
        estimatedMinutes: 5,
        version: '1.0',
      },
      summary: pendingMaterial(
        'Resumo / Documento — O Perigo do Doce',
        'Espaço reservado para o resumo validado pelo professor.',
      ),
    },
    completionLabel: 'Assisti ao vídeo e acessei pelo menos um material extra',
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
    materialSlots: {
      video: {
        status: AVAILABLE,
        title: 'Conscientizar o jovem a evitar o cigarro',
        description: 'Orientações de prevenção ao tabagismo na adolescência.',
        embedUrl: 'https://www.youtube.com/embed/CQRtCPFxQPs',
        sourceLabel: 'Ministério da Saúde',
        sourceUrl: 'https://www.youtube.com/watch?v=CQRtCPFxQPs',
        format: 'YouTube',
        estimatedMinutes: 2,
        version: '1.0',
      },
      slides: pendingMaterial(
        'Slides da aula — O Custo do Vício',
        'Espaço reservado para os slides preparados pelo professor.',
      ),
      summary: pendingMaterial(
        'Resumo / Documento — O Custo do Vício',
        'Espaço reservado para o resumo em Google Documentos.',
      ),
    },
    completionLabel: 'Assisti ao vídeo e acessei pelo menos um material extra',
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
    materialSlots: {
      video: {
        status: AVAILABLE,
        title: 'Eu vou levar — Série Eu e meu dinheiro',
        description: 'Narrativa sobre pressão de compra e decisões por impulso.',
        embedUrl:
          'https://www.youtube-nocookie.com/embed/FdTip4SdWMw?start=2',
        sourceLabel: 'Banco Central do Brasil / Ministério da Justiça',
        sourceUrl:
          'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/escola-nacional-endc/videoteca/eu-vou-levar-serie-eu-e-meu-dinheiro',
        format: 'YouTube',
        estimatedMinutes: 6,
        version: '1.0',
      },
      slides: pendingMaterial(
        'Slides da aula — A Ilusão do Dinheiro',
        'Espaço reservado para os slides preparados pelo professor.',
      ),
      summary: pendingMaterial(
        'Resumo / Documento — A Ilusão do Dinheiro',
        'Espaço reservado para o resumo em Google Documentos.',
      ),
    },
    completionLabel: 'Assisti ao vídeo e acessei pelo menos um material extra',
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
    materialSlots: {
      video: {
        status: AVAILABLE,
        title: 'Como funcionam as apostas on-line e o que diz a lei',
        description: 'Contextualiza o funcionamento das bets e sua regulamentação.',
        embedUrl: 'https://www.youtube.com/embed/liUKTPXW6Ac',
        sourceLabel: 'TV Senado',
        sourceUrl:
          'https://www12.senado.leg.br/tv/programas/cidadania-1/2024/10/entenda-como-funcionam-as-apostas-online-e-o-que-diz-a-lei-das-bets',
        format: 'YouTube',
        estimatedMinutes: 8,
        version: '1.0',
      },
      slides: pendingMaterial(
        'Slides da aula — A Engenharia do Desejo',
        'Espaço reservado para os slides preparados pelo professor.',
      ),
      summary: pendingMaterial(
        'Resumo / Documento — A Engenharia do Desejo',
        'Espaço reservado para o resumo em Google Documentos.',
      ),
    },
    completionLabel: 'Assisti ao vídeo e acessei pelo menos um material extra',
    continueLabel: 'Ir para Fato ou Fake',
    activityPath: '/trilha/saude-consumo/engenharia-desejo/atividade',
  },
};
