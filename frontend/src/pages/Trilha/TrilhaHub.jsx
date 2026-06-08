import { useNavigate } from 'react-router-dom';
import AutoStories from '@mui/icons-material/AutoStories';
import Quiz from '@mui/icons-material/Quiz';
import Gavel from '@mui/icons-material/Gavel';
import AltRoute from '@mui/icons-material/AltRoute';
import FactCheck from '@mui/icons-material/FactCheck';
import Lock from '@mui/icons-material/Lock';
import CheckCircle from '@mui/icons-material/CheckCircle';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { useAuth } from '../../contexts/AuthContext';

// Definição estática dos módulos — sem liberado hardcodado
const MODULOS = [
  {
    id: 1,
    fase: 1,
    titulo: 'O Perigo do Doce',
    descricao: 'Descubra como o açúcar afeta o SUS e o seu bolso.',
    iconeConteudo: <AutoStories sx={{ fontSize: 18 }} />,
    iconeAtividade: <Quiz sx={{ fontSize: 18 }} />,
    nomeAtividade: 'Quiz de Fixação',
    rota: '/trilha/saude-consumo/perigo-doce',
    cor: 'from-amber-500 to-orange-500',
    corSombra: 'shadow-amber-500/20',
    corBorda: 'border-amber-500/30',
  },
  {
    id: 2,
    fase: 2,
    titulo: 'O Custo do Vício',
    descricao: 'A matemática implacável do Tabagismo, Vapes e Álcool.',
    iconeConteudo: <AutoStories sx={{ fontSize: 18 }} />,
    iconeAtividade: <Gavel sx={{ fontSize: 18 }} />,
    nomeAtividade: 'Estudo de Caso',
    rota: '/trilha/saude-consumo/custo-vicio',
    cor: 'from-violet-500 to-purple-600',
    corSombra: 'shadow-violet-500/20',
    corBorda: 'border-violet-500/30',
  },
  {
    id: 3,
    fase: 3,
    titulo: 'A Ilusão do Dinheiro',
    descricao: 'Economia comportamental e o Efeito Manada.',
    iconeConteudo: <AutoStories sx={{ fontSize: 18 }} />,
    iconeAtividade: <AltRoute sx={{ fontSize: 18 }} />,
    nomeAtividade: 'Caminhos de Decisão',
    rota: '/trilha/saude-consumo/ilusao-dinheiro',
    cor: 'from-cyan-500 to-blue-600',
    corSombra: 'shadow-cyan-500/20',
    corBorda: 'border-cyan-500/30',
  },
  {
    id: 4,
    fase: 4,
    titulo: 'A Engenharia do Desejo',
    descricao: 'O ralo das Bets e a epidemia das apostas.',
    iconeConteudo: <AutoStories sx={{ fontSize: 18 }} />,
    iconeAtividade: <FactCheck sx={{ fontSize: 18 }} />,
    nomeAtividade: 'Fato ou Fake',
    rota: '/trilha/saude-consumo/engenharia-desejo',
    cor: 'from-rose-500 to-pink-600',
    corSombra: 'shadow-rose-500/20',
    corBorda: 'border-rose-500/30',
  },
];

// Offset de zig-zag por índice
const ZIGZAG = ['mr-10', 'ml-10', 'mr-10', 'ml-10'];

function ModuloCard({ modulo, liberado, concluido, navigate }) {
  return (
    <div
      className={`
        relative w-full max-w-sm rounded-3xl border p-5 transition-all duration-300
        ${ZIGZAG[modulo.id - 1]}
        ${liberado
          ? `bg-slate-900 ${modulo.corBorda} hover:shadow-xl ${modulo.corSombra} hover:-translate-y-1`
          : 'bg-slate-900/40 border-slate-800/60 opacity-60'}
      `}
    >
      {/* Badge de concluído */}
      {concluido && (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 shadow-lg shadow-green-500/40">
          <CheckCircle sx={{ fontSize: 18 }} className="text-white" />
        </div>
      )}

      {/* Cadeado para bloqueado */}
      {!liberado && (
        <div className="absolute top-4 right-4 text-slate-600">
          <Lock sx={{ fontSize: 20 }} />
        </div>
      )}

      {/* Cabeçalho: ícone + título */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`
          w-12 h-12 rounded-2xl bg-gradient-to-br ${modulo.cor} 
          flex items-center justify-center shadow-lg flex-shrink-0
          ${!liberado ? 'grayscale' : ''}
        `}>
          <span className="text-white font-black text-lg">{modulo.id}</span>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-0.5">
            Fase {modulo.fase}
          </p>
          <h2 className="text-base font-black text-white leading-tight">{modulo.titulo}</h2>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-slate-400 text-xs leading-relaxed mb-4">{modulo.descricao}</p>

      {/* Botões de ação — só aparecem se liberado */}
      {liberado ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate(`${modulo.rota}/conteudo`)}
            className={`
              flex items-center gap-2 text-slate-300 bg-slate-950/60 px-3 py-2.5 rounded-xl 
              border border-slate-800/60 w-full text-left transition-colors
              hover:border-amber-500/50 hover:text-amber-400
            `}
          >
            <span className="text-amber-400">{modulo.iconeConteudo}</span>
            <span className="text-xs font-semibold">Ler Conteúdo</span>
          </button>
          <button
            onClick={() => navigate(`${modulo.rota}/atividade`)}
            className={`
              flex items-center gap-2 bg-gradient-to-r ${modulo.cor} px-3 py-2.5 rounded-xl 
              w-full text-left transition-all shadow-md hover:shadow-lg hover:brightness-110
            `}
          >
            <PlayArrow sx={{ fontSize: 18 }} className="text-white" />
            <span className="text-xs font-bold text-white">{modulo.nomeAtividade}</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
          <Lock sx={{ fontSize: 14 }} />
          <span>Complete a fase anterior para desbloquear</span>
        </div>
      )}
    </div>
  );
}

export default function TrilhaHub() {
  const navigate = useNavigate();
  const { aluno } = useAuth();

  // Bug fix: garante conversão para Number para evitar comparação string vs int
  // Se o aluno não tem fase_atual definida, assume fase 1 como padrão
  const faseAtual = Number(aluno?.fase_atual ?? 1);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:py-12">

      {/* Cabeçalho */}
      <div className="max-w-xl mx-auto mb-10 text-center">
        <span className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase">
          Trilha Principal
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mt-2">
          SAÚDE & CONSUMO
        </h1>
        <p className="text-slate-400 mt-3 text-sm leading-relaxed">
          Complete as missões, avance nas fases e acumule CapiCoins para o ranking.
        </p>

        {/* Indicador de progresso */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="flex-1 max-w-[160px] bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(((faseAtual - 1) / MODULOS.length) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
            Fase {faseAtual} de {MODULOS.length}
          </span>
        </div>
      </div>

      {/* Trilha vertical com linha conectora */}
      <div className="relative max-w-xl mx-auto flex flex-col items-center">

        {/* Linha vertical de fundo */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-slate-800 -z-0" />

        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
          {MODULOS.map((modulo) => {
            const liberado = modulo.fase <= faseAtual;
            const concluido = modulo.fase < faseAtual;

            return (
              <ModuloCard
                key={modulo.id}
                modulo={modulo}
                liberado={liberado}
                concluido={concluido}
                navigate={navigate}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}
