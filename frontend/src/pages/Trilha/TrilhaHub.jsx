import { useNavigate } from 'react-router-dom';
import { ArrowBack, AutoStories, Quiz, Gavel, AltRoute, FactCheck, Lock } from '@mui/icons-material';

export default function TrilhaHub() {
  const navigate = useNavigate();

  const modulos = [
    {
      id: 1,
      titulo: 'O Perigo do Doce',
      descricao: 'Descubra como o açúcar afeta o SUS e o seu bolso.',
      iconeConteudo: <AutoStories sx={{ fontSize: 20 }} />,
      iconeAtividade: <Quiz sx={{ fontSize: 20 }} />,
      nomeAtividade: 'Quiz de Fixação',
      rota: '/trilha/saude-consumo/perigo-doce',
      liberado: true,
      cor: 'from-amber-500 to-orange-500'
    },
    {
      id: 2,
      titulo: 'O Custo do Vício',
      descricao: 'A matemática implacável do Tabagismo, Vapes e Álcool.',
      iconeConteudo: <AutoStories sx={{ fontSize: 20 }} />,
      iconeAtividade: <Gavel sx={{ fontSize: 20 }} />,
      nomeAtividade: 'Estudo de Caso',
      rota: '/trilha/saude-consumo/custo-vicio',
      liberado: false, // Bloqueado para o MVP
      cor: 'from-slate-500 to-slate-700'
    },
    {
      id: 3,
      titulo: 'A Ilusão do Dinheiro',
      descricao: 'Economia comportamental e o Efeito Manada.',
      iconeConteudo: <AutoStories sx={{ fontSize: 20 }} />,
      iconeAtividade: <AltRoute sx={{ fontSize: 20 }} />,
      nomeAtividade: 'Caminhos de Decisão',
      rota: '/trilha/saude-consumo/ilusao-dinheiro',
      liberado: false, // Bloqueado para o MVP
      cor: 'from-slate-500 to-slate-700'
    },
    {
      id: 4,
      titulo: 'A Engenharia do Desejo',
      descricao: 'O ralo das Bets e a epidemia das apostas.',
      iconeConteudo: <AutoStories sx={{ fontSize: 20 }} />,
      iconeAtividade: <FactCheck sx={{ fontSize: 20 }} />,
      nomeAtividade: 'Fato ou Fake',
      rota: '/trilha/saude-consumo/engenharia-desejo',
      liberado: false, // Bloqueado para o MVP
      cor: 'from-slate-500 to-slate-700'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <button 
          onClick={() => navigate('/student')} 
          className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 font-bold text-sm"
        >
          <ArrowBack fontSize="small" /> Voltar ao Dashboard
        </button>

        <div className="mb-10">
          <span className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase">Trilha Principal</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-2">SAÚDE & CONSUMO</h1>
          <p className="text-slate-400 mt-4 max-w-2xl text-lg leading-relaxed">
            Como o governo e o mercado moldam o que você consome? Complete as missões, avance nas fases e acumule CapiCoins para o ranking.
          </p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className={`relative rounded-3xl p-6 border ${modulo.liberado ? 'bg-slate-900/80 border-slate-700 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all' : 'bg-slate-900/30 border-slate-800 opacity-75'}`}
            >
              {!modulo.liberado && (
                <div className="absolute top-6 right-6 text-slate-600">
                  <Lock />
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${modulo.cor} flex items-center justify-center mb-6 shadow-lg`}>
                <span className="text-white font-black text-xl">{modulo.id}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{modulo.titulo}</h2>
              <p className="text-slate-400 text-sm mb-6 h-10">{modulo.descricao}</p>
              
              <div className="flex flex-col gap-3">
                <button
                  disabled={!modulo.liberado}
                  onClick={() => navigate(`${modulo.rota}/conteudo`)}
                  className="flex items-center gap-3 text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 w-full text-left transition-colors enabled:hover:border-amber-500/50 enabled:hover:text-amber-400 disabled:cursor-not-allowed"
                >
                  <span className={modulo.liberado ? "text-amber-400" : "text-slate-600"}>{modulo.iconeConteudo}</span>
                  <span className="text-sm font-semibold">Ler Conteúdo</span>
                </button>
                <button
                  disabled={!modulo.liberado}
                  onClick={() => navigate(`${modulo.rota}/atividade`)}
                  className="flex items-center gap-3 text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 w-full text-left transition-colors enabled:hover:border-amber-500/50 enabled:hover:text-amber-400 disabled:cursor-not-allowed"
                >
                  <span className={modulo.liberado ? "text-amber-400" : "text-slate-600"}>{modulo.iconeAtividade}</span>
                  <span className="text-sm font-semibold">{modulo.nomeAtividade}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}