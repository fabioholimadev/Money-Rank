import { useState } from 'react';
import { ChevronRight, Info } from '@mui/icons-material';

/**
 * InfograficoLata.jsx
 * Raio-X interativo de uma lata de energético
 * Mostra composição de custo: açúcar, impostos e marketing
 */
function InfograficoLata({ onComplete }) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Dados da composição da lata
  const composicao = [
    { label: 'Açúcar e Aditivos', percentual: 35, cor: 'bg-red-500/80', descricao: 'Danos à saúde: diabetes e obesidade' },
    { label: 'Impostos (ICMS + PIS)', percentual: 28, cor: 'bg-amber-500/80', descricao: 'Custo real repassado ao consumidor' },
    { label: 'Custo de Produção', percentual: 22, cor: 'bg-blue-500/80', descricao: 'Fabricação, embalagem e logística' },
    { label: 'Margem Comercial', percentual: 15, cor: 'bg-green-500/80', descricao: 'Lucro da empresa distribuidora' }
  ];

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleComplete = () => {
    onComplete({ tipo: 'infografico_lata', revelado: true });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-slate-950 to-zinc-900 rounded-3xl border border-zinc-800 min-h-[600px]">
      
      {/* TÍTULO */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-amber-400">O Que Você REALMENTE Está Comprando?</h2>
        <p className="text-slate-400 text-sm max-w-lg">Clique na lata para descobrir a composição de custos e impostos embutidos</p>
      </div>

      {/* LATA INTERATIVA (VISUAL) */}
      <div className="relative w-32 h-48 mx-auto my-8 cursor-pointer" onClick={handleReveal}>
        {/* Silhueta da Lata */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-700 rounded-3xl shadow-2xl border-2 border-red-800 flex items-center justify-center hover:shadow-amber-500/30 hover:shadow-lg transition-all">
          <div className="text-center space-y-1">
            <div className="text-4xl font-black text-white">⚡</div>
            <div className="text-white font-bold text-xs">ENERGÉTICO</div>
          </div>
        </div>

        {/* Efeito de Clique (Click Here) */}
        {!isRevealed && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-amber-400 text-xs font-bold animate-bounce">
            <Info sx={{ fontSize: 16 }} /> Clique para revelar
          </div>
        )}
      </div>

      {/* COMPOSIÇÃO REVELADA */}
      {isRevealed && (
        <div className="w-full max-w-2xl space-y-6 animate-[fadeIn_0.5s_ease-in]">
          
          {/* Barra de Composição */}
          <div className="space-y-3">
            <div className="text-amber-400 font-bold text-sm uppercase">Composição de Custo por Lata (R$ 7,99)</div>
            
            <div className="relative h-16 bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-700 flex">
              {composicao.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.cor} relative flex-1 flex items-center justify-center transition-all hover:opacity-80 cursor-default`}
                  style={{ width: `${item.percentual}%` }}
                >
                  <span className="text-white font-bold text-xs">{item.percentual}%</span>
                </div>
              ))}
            </div>

            {/* Legenda Detalhada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {composicao.map((item, idx) => (
                <div key={idx} className="bg-zinc-900/60 border border-zinc-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.cor}`}></div>
                    <span className="text-white font-bold text-sm">{item.label}</span>
                    <span className="text-amber-400 font-black">{item.percentual}%</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INSIGHT EDUCATIVO */}
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Info className="text-amber-400 flex-shrink-0" sx={{ fontSize: 24 }} />
              <div className="space-y-2">
                <h4 className="font-bold text-amber-400">Lição Importante</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Uma lata de energético custa R$ 7,99. Desses, R$ 2,23 (28%) são impostos diretos que vão para o governo. 
                  Além disso, 35% do valor cobrem ingredientes que causam problemas de saúde. <strong>Consumo consciente exige compreensão.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO AVANÇAR */}
      {isRevealed && (
        <button
          onClick={handleComplete}
          className="mt-6 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-amber-500/20 group"
        >
          Avançar para Próxima Fase
          <ChevronRight sx={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}

export default InfograficoLata;
