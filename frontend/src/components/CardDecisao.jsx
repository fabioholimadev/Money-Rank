import { useState } from 'react';
import { MonetizationOn, TrendingDown, TrendingUp, ChevronRight } from '@mui/icons-material';

/**
 * CardDecisao.jsx
 * Dilema moral/financeiro com duas opções de escolha
 * Mostra impacto na carteira de CapiCoins
 */
function CardDecisao({ cenario, descricao, opcaoA, opcaoB, impactoA, impactoB, onComplete }) {
  const [escolhida, setEscolhida] = useState(null);
  const [decidido, setDecidido] = useState(false);

  const handleEscolha = (opcao) => {
    setEscolhida(opcao);
    setDecidido(true);
  };

  const handleProximo = () => {
    if (decidido) {
      onComplete({
        tipo: 'decisao',
        escolha: escolhida,
        impacto: escolhida === 'A' ? impactoA : impactoB,
        cenario,
      });
    }
  };

  const isOpcaoAPositiva = impactoA >= 0;
  const isOpcaoBPositiva = impactoB >= 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-slate-950 to-zinc-900 rounded-3xl border border-zinc-800 min-h-[700px]">
      
      {/* CABEÇALHO */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 font-bold text-xs uppercase">
          ⚖️ Dilema Financeiro
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">
          {cenario}
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          {descricao}
        </p>
      </div>

      {/* OPÇÕES DE DECISÃO */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* OPÇÃO A */}
        <button
          onClick={() => handleEscolha('A')}
          disabled={decidido && escolhida !== 'A'}
          className={`relative p-8 rounded-2xl border-2 transition-all transform hover:scale-105 ${
            escolhida === 'A'
              ? isOpcaoAPositiva
                ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                : 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
              : 'border-zinc-700 bg-zinc-900/40 hover:border-amber-400/30'
          } ${decidido && escolhida !== 'A' ? 'opacity-40' : ''}`}
        >
          <div className="flex flex-col items-center gap-4">
            
            {/* Ícone e Número */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-black text-white">A</div>
              <h4 className="font-bold text-white text-lg">{opcaoA}</h4>
            </div>

            {/* IMPACTO */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm w-full justify-center ${
              isOpcaoAPositiva
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {isOpcaoAPositiva ? (
                <TrendingUp sx={{ fontSize: 20 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 20 }} />
              )}
              <MonetizationOn sx={{ fontSize: 20 }} />
              <span>{isOpcaoAPositiva ? '+' : ''}{impactoA} CapiCoins</span>
            </div>

            {/* Indicador de Seleção */}
            {escolhida === 'A' && (
              <div className="w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></div>
            )}
          </div>
        </button>

        {/* OPÇÃO B */}
        <button
          onClick={() => handleEscolha('B')}
          disabled={decidido && escolhida !== 'B'}
          className={`relative p-8 rounded-2xl border-2 transition-all transform hover:scale-105 ${
            escolhida === 'B'
              ? isOpcaoBPositiva
                ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                : 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
              : 'border-zinc-700 bg-zinc-900/40 hover:border-amber-400/30'
          } ${decidido && escolhida !== 'B' ? 'opacity-40' : ''}`}
        >
          <div className="flex flex-col items-center gap-4">
            
            {/* Ícone e Número */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-black text-white">B</div>
              <h4 className="font-bold text-white text-lg">{opcaoB}</h4>
            </div>

            {/* IMPACTO */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm w-full justify-center ${
              isOpcaoBPositiva
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {isOpcaoBPositiva ? (
                <TrendingUp sx={{ fontSize: 20 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 20 }} />
              )}
              <MonetizationOn sx={{ fontSize: 20 }} />
              <span>{isOpcaoBPositiva ? '+' : ''}{impactoB} CapiCoins</span>
            </div>

            {/* Indicador de Seleção */}
            {escolhida === 'B' && (
              <div className="w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></div>
            )}
          </div>
        </button>
      </div>

      {/* FEEDBACK PÓS-DECISÃO */}
      {decidido && (
        <div className={`w-full max-w-2xl p-6 rounded-2xl border-2 text-center animate-[fadeIn_0.5s_ease-in] ${
          (escolhida === 'A' ? impactoA : impactoB) >= 0
            ? 'border-green-500/30 bg-green-500/10'
            : 'border-red-500/30 bg-red-500/10'
        }`}>
          <p className={`font-bold text-lg ${
            (escolhida === 'A' ? impactoA : impactoB) >= 0
              ? 'text-green-300'
              : 'text-red-300'
          }`}>
            {(escolhida === 'A' ? impactoA : impactoB) >= 0
              ? '💰 Ótima escolha! Sua carteira agradece.'
              : '⚠️ Essa decisão custou caro. Pense melhor na próxima!'}
          </p>
        </div>
      )}

      {/* BOTÃO - AVANÇAR */}
      {decidido && (
        <button
          onClick={handleProximo}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-amber-500/20 group animate-[fadeIn_0.5s_ease-in]"
        >
          Continuar Trilha
          <ChevronRight sx={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {!decidido && (
        <div className="text-slate-400 text-sm text-center">
          Escolha uma das opções acima para continuar
        </div>
      )}
    </div>
  );
}

export default CardDecisao;
