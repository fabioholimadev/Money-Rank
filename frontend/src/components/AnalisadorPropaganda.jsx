import { useState } from 'react';
import { SearchOutlined, CheckCircle, ChevronRight, Lightbulb } from '@mui/icons-material';

/**
 * AnalisadorPropaganda.jsx
 * Análise interativa de propaganda e técnicas de neuromarketing
 * Aluno deve encontrar a "pegadinha" publicitária clicando em hotspots
 */
function AnalisadorPropaganda({ 
  imagemUrl, 
  titulo, 
  descricao,
  hotspots = [], // Array de { id, x, y, label, explicacao }
  onComplete 
}) {
  const [hostpotsEncontrados, setHotpotsEncontrados] = useState([]);
  const [hotspotAtual, setHotspotAtual] = useState(null);
  const [analisado, setAnalisado] = useState(false);

  const handleClickHotspot = (hotspot) => {
    if (!hostpotsEncontrados.find(h => h.id === hotspot.id)) {
      setHotpotsEncontrados([...hostpotsEncontrados, hotspot]);
      setHotspotAtual(hotspot);
    }
  };

  const handleProximo = () => {
    setHotspotAtual(null);
  };

  const todosSelecionados = hotspots.length > 0 && hostpotsEncontrados.length === hotspots.length;

  const handleConcluir = () => {
    setAnalisado(true);
    onComplete({
      tipo: 'analisador_propaganda',
      hotspots_encontrados: hostpotsEncontrados.length,
      total_hotspots: hotspots.length,
      completo: todosSelecionados,
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-slate-950 to-zinc-900 rounded-3xl border border-zinc-800 min-h-[700px]">
      
      {/* CABEÇALHO */}
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 font-bold text-xs uppercase">
          <SearchOutlined sx={{ fontSize: 16 }} /> Análise de Propaganda
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">
          {titulo}
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          {descricao}
        </p>
      </div>

      {/* CONTAINER DE IMAGEM COM HOTSPOTS */}
      <div className="relative w-full max-w-2xl mx-auto">
        
        {/* IMAGEM DE PROPAGANDA */}
        <div className="relative rounded-3xl border-2 border-zinc-800 overflow-hidden shadow-2xl bg-zinc-900/60">
          {imagemUrl ? (
            <img 
              src={imagemUrl} 
              alt={titulo}
              className="w-full h-auto display-block"
            />
          ) : (
            // Placeholder de imagem
            <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-zinc-900 flex items-center justify-center border-2 border-dashed border-zinc-700 rounded-xl">
              <div className="text-center space-y-3">
                <div className="text-4xl">📢</div>
                <p className="text-slate-400 text-sm">Imagem de Propaganda</p>
              </div>
            </div>
          )}

          {/* HOTSPOTS INTERATIVOS */}
          {hotspots.map((hotspot) => {
            const isFound = hostpotsEncontrados.find(h => h.id === hotspot.id);
            const isCurrent = hotspotAtual?.id === hotspot.id;

            return (
              <button
                key={hotspot.id}
                onClick={() => handleClickHotspot(hotspot)}
                className={`absolute w-14 h-14 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                  isFound
                    ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/30'
                    : isCurrent
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/30 scale-110'
                    : 'bg-amber-400/10 border-amber-400/40 hover:border-amber-400'
                }`}
                style={{
                  left: `calc(${hotspot.x}% - 28px)`,
                  top: `calc(${hotspot.y}% - 28px)`,
                }}
                title={hotspot.label}
              >
                {isFound ? (
                  <CheckCircle className="text-green-400" sx={{ fontSize: 28 }} />
                ) : (
                  <SearchOutlined className="text-amber-400" sx={{ fontSize: 28 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Pegadinhas Encontradas</span>
            <span className="font-bold text-amber-400">
              {hostpotsEncontrados.length} / {hotspots.length}
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${(hostpotsEncontrados.length / hotspots.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* CARD DE INFORMAÇÃO DO HOTSPOT SELECIONADO */}
      {hotspotAtual && (
        <div className="w-full max-w-2xl bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-6 space-y-4 animate-[fadeIn_0.3s_ease-in]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Lightbulb className="text-blue-400" sx={{ fontSize: 20 }} />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-blue-300 text-lg">
                {hotspotAtual.label}
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {hotspotAtual.explicacao}
              </p>
            </div>
          </div>
          <button
            onClick={handleProximo}
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-semibold py-2 px-4 rounded-lg transition-all text-sm"
          >
            Fechar
          </button>
        </div>
      )}

      {/* INSIGHT EDUCATIVO */}
      {hostpotsEncontrados.length > 0 && (
        <div className="w-full max-w-2xl bg-amber-400/10 border border-amber-400/30 rounded-2xl p-6 space-y-3 animate-[fadeIn_0.4s_ease-in]">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-400 flex-shrink-0" sx={{ fontSize: 24 }} />
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400">Dica de Consumo Consciente</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ao analisar propagandas, sempre procure por: letras miúdas, gatilhos de urgência,
                promessas vagas e falta de comprovação científica. Questione tudo o que lê!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO - CONCLUIR */}
      {todosSelecionados && !analisado && (
        <button
          onClick={handleConcluir}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-green-500/20 group animate-[fadeIn_0.5s_ease-in]"
        >
          Análise Completa! Avançar
          <ChevronRight sx={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {!todosSelecionados && !analisado && (
        <div className="text-slate-400 text-sm text-center">
          Clique nos {{ plural: hostspots.length > 1 ? 'pontos' : 'ponto' }}
          {' '}dourados para revelar as pegadinhas publicitárias
        </div>
      )}

      {analisado && (
        <div className="text-center space-y-2 text-green-300">
          <CheckCircle sx={{ fontSize: 48 }} />
          <p className="font-bold">Análise Concluída com Sucesso!</p>
        </div>
      )}
    </div>
  );
}

export default AnalisadorPropaganda;
