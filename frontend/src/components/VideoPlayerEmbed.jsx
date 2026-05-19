import { useState } from 'react';
import { PlayArrow, CheckCircle } from '@mui/icons-material';

/**
 * VideoPlayerEmbed.jsx
 * Player de vídeo responsivo no formato vertical (9/16)
 * Simula Reels/Shorts com confirmação de visualização
 */
function VideoPlayerEmbed({ url, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  const handleVideoStart = () => {
    setIsPlaying(true);
    // Simular que o vídeo foi assistido após 2 segundos
    setTimeout(() => {
      setIsWatched(true);
    }, 2000);
  };

  const handleComplete = () => {
    if (isWatched) {
      onComplete({ tipo: 'video_player', visualizado: true });
    }
  };

  // Determinar se é URL do YouTube ou vídeo local
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-slate-950 to-zinc-900 rounded-3xl border border-zinc-800 min-h-[700px]">
      
      {/* TÍTULO */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-amber-400">Assista e Aprenda</h2>
        <p className="text-slate-400 text-sm">Conteúdo educativo no formato Reels/Shorts</p>
      </div>

      {/* CONTAINER DO VÍDEO */}
      <div className="relative w-full max-w-sm aspect-[9/16] bg-slate-900 rounded-3xl border-2 border-zinc-800 overflow-hidden shadow-2xl group">
        
        {/* VÍDEO */}
        {isYouTube ? (
          <iframe
            className="w-full h-full"
            src={url}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onPlay={handleVideoStart}
          ></iframe>
        ) : (
          <video
            className="w-full h-full object-cover"
            controls
            onPlay={handleVideoStart}
          >
            <source src={url} type="video/mp4" />
            Seu navegador não suporta vídeos HTML5.
          </video>
        )}

        {/* OVERLAY - Indicador de Visualização */}
        {!isWatched && !isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 group-hover:bg-black/20 transition-all">
            <div className="w-16 h-16 bg-amber-400/80 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <PlayArrow sx={{ fontSize: 40, color: '#000' }} />
            </div>
            <p className="text-white font-bold text-center text-sm px-4">Clique para iniciar</p>
          </div>
        )}

        {/* BADGE - Assistido */}
        {isWatched && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/90 px-3 py-1.5 rounded-full backdrop-blur-sm border border-green-400">
            <CheckCircle sx={{ fontSize: 16, color: '#fff' }} />
            <span className="text-white text-xs font-bold">Visualizado</span>
          </div>
        )}

        {/* PROGRESSO - Enquanto assiste */}
        {isPlaying && !isWatched && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 animate-pulse" style={{ width: '50%' }}></div>
          </div>
        )}
      </div>

      {/* INFORMAÇÃO EDUCATIVA */}
      <div className="w-full max-w-sm bg-zinc-900/60 border border-zinc-700 rounded-2xl p-6 space-y-3">
        <h4 className="text-amber-400 font-bold">📚 Sobre este Vídeo</h4>
        <p className="text-slate-400 text-sm leading-relaxed">
          Este conteúdo complementa sua aprendizagem sobre educação financeira e consumo responsável. 
          Após assistir, você terá acesso à próxima fase da trilha.
        </p>
      </div>

      {/* BOTÃO - Confirmar Visualização */}
      {isWatched && (
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-green-500/20 group animate-[fadeIn_0.5s_ease-in]"
        >
          <CheckCircle sx={{ fontSize: 20 }} />
          Confirmar Visualização
        </button>
      )}

      {!isWatched && (
        <div className="text-slate-400 text-sm text-center">
          Assista o vídeo completo para liberar a próxima etapa
        </div>
      )}
    </div>
  );
}

export default VideoPlayerEmbed;
