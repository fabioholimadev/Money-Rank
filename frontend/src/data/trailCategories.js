import AltRoute from '@mui/icons-material/AltRoute';
import AutoStories from '@mui/icons-material/AutoStories';
import FactCheck from '@mui/icons-material/FactCheck';
import Gavel from '@mui/icons-material/Gavel';
import HealthAndSafety from '@mui/icons-material/HealthAndSafety';
import Quiz from '@mui/icons-material/Quiz';

export const TRAIL_CATEGORIES = [
  {
    id: 'saude-consumo',
    titulo: 'Saúde & Consumo',
    etiqueta: 'Trilha principal',
    descricao:
      'Entenda como escolhas de consumo afetam sua saúde, seu bolso e os serviços públicos.',
    Icone: HealthAndSafety,
    cor: 'from-emerald-500 via-teal-500 to-cyan-500',
    corBorda: 'border-emerald-500/30',
    corSombra: 'shadow-emerald-500/10',
    modulos: [
      {
        id: 'perigo-doce',
        fase: 1,
        titulo: 'O Perigo do Doce',
        descricao: 'Descubra como o açúcar afeta o SUS e o seu bolso.',
        IconeConteudo: AutoStories,
        IconeAtividade: Quiz,
        nomeAtividade: 'Quiz de Fixação',
        rota: '/trilha/saude-consumo/perigo-doce',
        cor: 'from-amber-500 to-orange-500',
        corSombra: 'shadow-amber-500/20',
        corBorda: 'border-amber-500/30',
      },
      {
        id: 'custo-vicio',
        fase: 2,
        titulo: 'O Custo do Vício',
        descricao: 'A matemática implacável do tabagismo, vapes e álcool.',
        IconeConteudo: AutoStories,
        IconeAtividade: Gavel,
        nomeAtividade: 'Estudo de Caso',
        rota: '/trilha/saude-consumo/custo-vicio',
        cor: 'from-violet-500 to-purple-600',
        corSombra: 'shadow-violet-500/20',
        corBorda: 'border-violet-500/30',
      },
      {
        id: 'ilusao-dinheiro',
        fase: 3,
        titulo: 'A Ilusão do Dinheiro',
        descricao: 'Economia comportamental e o efeito manada.',
        IconeConteudo: AutoStories,
        IconeAtividade: AltRoute,
        nomeAtividade: 'Caminhos de Decisão',
        rota: '/trilha/saude-consumo/ilusao-dinheiro',
        cor: 'from-cyan-500 to-blue-600',
        corSombra: 'shadow-cyan-500/20',
        corBorda: 'border-cyan-500/30',
      },
      {
        id: 'engenharia-desejo',
        fase: 4,
        titulo: 'A Engenharia do Desejo',
        descricao: 'O ralo das bets e a epidemia das apostas.',
        IconeConteudo: AutoStories,
        IconeAtividade: FactCheck,
        nomeAtividade: 'Fato ou Fake',
        rota: '/trilha/saude-consumo/engenharia-desejo',
        cor: 'from-rose-500 to-pink-600',
        corSombra: 'shadow-rose-500/20',
        corBorda: 'border-rose-500/30',
      },
    ],
  },
];
