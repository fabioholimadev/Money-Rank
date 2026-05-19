import { useState } from 'react';
import { CheckCircle, Cancel, ChevronRight } from '@mui/icons-material';

/**
 * CaixaQuiz.jsx
 * Quiz de múltipla escolha com feedback visual instantâneo
 * Mostra explicação e permite avançar para próxima etapa
 */
function CaixaQuiz({ pergunta, alternativas, respostaCorreta, onComplete }) {
  const [selecionada, setSelecionada] = useState(null);
  const [respondido, setRespondido] = useState(false);

  const acertou = selecionada === respostaCorreta;

  const handleClick = (index) => {
    if (!respondido) {
      setSelecionada(index);
      setRespondido(true);
    }
  };

  const handleProximo = () => {
    if (respondido) {
      onComplete({
        tipo: 'quiz',
        resposta: selecionada,
        acertou,
        pergunta,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-slate-950 to-zinc-900 rounded-3xl border border-zinc-800 min-h-[600px]">
      
      {/* INDICADOR DE PROGRESSO */}
      <div className="flex items-center gap-2 text-sm text-amber-400 font-bold uppercase">
        <div className="w-8 h-8 bg-amber-400/20 border border-amber-400 rounded-full flex items-center justify-center">
          ❓
        </div>
        Questão Educativa
      </div>

      {/* PERGUNTA */}
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
          {pergunta}
        </h2>
      </div>

      {/* GRID DE ALTERNATIVAS */}
      <div className="w-full max-w-2xl space-y-3">
        {alternativas.map((alt, idx) => {
          const isSelected = selecionada === idx;
          const isCorrect = idx === respostaCorreta;
          
          // Determinar estilo baseado no estado
          let borderColor = 'border-zinc-700';
          let bgColor = 'bg-zinc-900/40 hover:bg-zinc-800/60';
          let textColor = 'text-slate-300';
          let icon = null;

          if (respondido) {
            if (isSelected && isCorrect) {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-500/10';
              textColor = 'text-green-300';
              icon = <CheckCircle className="text-green-400" sx={{ fontSize: 24 }} />;
            } else if (isSelected && !isCorrect) {
              borderColor = 'border-red-500';
              bgColor = 'bg-red-500/10';
              textColor = 'text-red-300';
              icon = <Cancel className="text-red-400" sx={{ fontSize: 24 }} />;
            } else if (isCorrect && !isSelected) {
              borderColor = 'border-green-500/40';
              bgColor = 'bg-green-500/5';
              icon = <CheckCircle className="text-green-400/60" sx={{ fontSize: 24 }} />;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              disabled={respondido}
              className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer ${borderColor} ${bgColor} ${textColor} ${
                respondido ? 'cursor-default' : 'hover:scale-102'
              }`}
            >
              {/* Letra/Índice */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                respondido && isSelected ? (isCorrect ? 'bg-green-500/30' : 'bg-red-500/30') : 'bg-amber-400/20'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>

              {/* Texto da Alternativa */}
              <span className="flex-1 text-left font-semibold text-base">{alt.texto}</span>

              {/* Ícone de Resultado */}
              {respondido && icon && <div className="flex-shrink-0">{icon}</div>}
            </button>
          );
        })}
      </div>

      {/* FEEDBACK E JUSTIFICATIVA */}
      {respondido && (
        <div className={`w-full max-w-2xl p-6 rounded-2xl border-2 animate-[fadeIn_0.4s_ease-in] ${
          acertou
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className={`flex items-start gap-3 ${acertou ? 'text-green-300' : 'text-red-300'}`}>
            <div className="flex-shrink-0 mt-1">
              {acertou ? (
                <CheckCircle sx={{ fontSize: 24 }} />
              ) : (
                <Cancel sx={{ fontSize: 24 }} />
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-lg">
                {acertou ? '✓ Parabéns! Resposta Correta!' : '✗ Resposta Incorreta'}
              </h4>
              <p className="text-sm leading-relaxed">
                {alternativas[respostaCorreta].justificativa}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO - PRÓXIMA ETAPA */}
      {respondido && (
        <button
          onClick={handleProximo}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-amber-500/20 group animate-[fadeIn_0.4s_ease-in]"
        >
          Próxima Etapa
          <ChevronRight sx={{ fontSize: 20 }} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {!respondido && (
        <div className="text-slate-400 text-sm">
          Selecione uma das alternativas acima
        </div>
      )}
    </div>
  );
}

export default CaixaQuiz;
