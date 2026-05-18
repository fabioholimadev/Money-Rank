import { useState } from 'react';

export default function StudentDashboard() {
  // 1. Estado para controlar as moedas do aluno
  const [moedas, setMoedas] = useState(150);

  // 2. Lista de Fases da nossa Trilha de Consumo
  const fases = [
    { id: 1, titulo: "O Monstro Invisível", status: "concluido" },
    { id: 2, titulo: "Decifrando a Nota Fiscal", status: "atual" },
    { id: 3, titulo: "Tributo à Saúde", status: "bloqueado" },
    { id: 4, titulo: "Justiça e Cashback", status: "bloqueado" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
      
      {/* CABEÇALHO (Moedas e Perfil) */}
      <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-700">Money Rank</h1>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-300">
          <span className="text-xl">🪙</span>
          <span className="font-bold text-yellow-700">{moedas}</span>
        </div>
      </header>

      {/* TÍTULO DA TRILHA */}
      <div className="mt-8 text-center px-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Trilha: Impostos no Consumo</h2>
        <p className="text-slate-500 mt-2">Aprenda como os impostos afetam o seu bolso e o seu país!</p>
      </div>

      {/* A TRILHA (Estilo Duolingo) */}
      <div className="mt-12 flex flex-col items-center gap-8">
        {fases.map((fase) => {
          // Lógica para definir a cor do botão baseado no status da fase
          let corBotao = "";
          let icone = "";

          if (fase.status === "concluido") {
            corBotao = "bg-green-500 hover:bg-green-600 shadow-[0_6px_0_0_#16a34a]"; // Verde
            icone = "⭐";
          } else if (fase.status === "atual") {
            corBotao = "bg-blue-500 hover:bg-blue-600 shadow-[0_6px_0_0_#2563eb] animate-bounce"; // Azul e pulando
            icone = "▶️";
          } else {
            corBotao = "bg-slate-300 shadow-[0_6px_0_0_#94a3b8] opacity-70 cursor-not-allowed"; // Cinza bloqueado
            icone = "🔒";
          }

          return (
            <div key={fase.id} className="flex flex-col items-center relative">
              {/* Balão com o título da fase */}
              <div className="mb-2 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-200 text-sm font-bold text-slate-700">
                {fase.titulo}
              </div>
              
              {/* Botão Redondo da Fase */}
              <button 
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white transition-all active:translate-y-2 active:shadow-none ${corBotao}`}
              >
                {icone}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}