import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, CheckCircle, MonetizationOn, PlayCircleOutlined, Slideshow } from '@mui/icons-material';
import { supabase } from "../../../../lib/supabase";

export default function ConteudoPerigoDoce() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  // Controle das Abas: Começa mostrando o vídeo por padrão
  const [abaAtiva, setAbaAtiva] = useState('video');

  // ⚠️ ID da atividade no Supabase
  const ATIVIDADE_CONTEUDO_ID = 'ec178180-8513-44a4-9cb1-d0d9f3306b09';

  const marcarComoLido = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado");

      const { data, error } = await supabase.rpc('complete_task', {
        p_aluno_id: user.id,
        p_atividade_id: ATIVIDADE_CONTEUDO_ID
      });

      if (error) throw error;

      setConcluido(true);
      
      if (data[0].is_farming) {
        setMensagem('Você já havia revisado este material. Nenhuma CapiCoin adicional foi gerada, mas o conhecimento é todo seu!');
      } else {
        setMensagem(`Excelente! Você ganhou ${data[0].reward} CapiCoins por concluir a missão.`);
      }

    } catch (error) {
      console.error("Erro ao registrar conclusão:", error);
      alert("Erro ao registrar conclusão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        <button onClick={() => navigate('/trilha')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-8 font-bold transition-colors">
          <ArrowBack fontSize="small" /> Voltar ao Mapa
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            O Perigo do Doce
          </h1>
          <p className="text-slate-400 text-lg">
            Escolha como prefere aprender: assista ao vídeo resumo ou navegue pelos slides completos da aula.
          </p>
        </div>

        {/* BARRAS DE SELEÇÃO (TABS) */}
        <div className="flex gap-4 mb-8 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setAbaAtiva('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${abaAtiva === 'video' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <PlayCircleOutlined /> Vídeo Resumo
          </button>
          <button 
            onClick={() => setAbaAtiva('slide')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${abaAtiva === 'slide' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Slideshow /> Slides da Aula
          </button>
        </div>

        {/* ÁREA DO CONTEÚDO (Renderiza condicionalmente baseado na aba) */}
        <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-3xl shadow-xl mb-12">
          
          {abaAtiva === 'video' ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center relative">
              {/* PLACEHOLDER: Troque este link pelo do seu vídeo do YouTube depois */}
              <iframe 
                src="https://www.youtube.com/embed/ZnTJw_e7YDU" 
                title="Vídeo Resumo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            <div className="aspect-[4/3] md:aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 relative">
              {/* O seu link oficial do Google Slides */}
              <iframe 
                src="https://docs.google.com/presentation/d/e/2PACX-1vSIyWrjISGHq781i0JeVy4rJMw2chATeHHYWL_RvjNpocCsS4iyVC3gUZxEJw1UURrQa_xuUxJ-jFNZ/pubembed?start=false&loop=false&delayms=3000" 
                frameBorder="0" 
                width="100%" 
                height="100%" 
                allowFullScreen={true}
                className="absolute top-0 left-0 w-full h-full"
                title="Slides O Perigo do Doce"
              ></iframe>
            </div>
          )}
          
        </div>

        {/* BOTÃO DE RESGATE (Fica embaixo, independente da aba) */}
        {!concluido ? (
          <button 
            onClick={marcarComoLido}
            disabled={isSubmitting}
            className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
          >
            {isSubmitting ? 'Sincronizando Banco Central...' : <><CheckCircle /> Missão Cumprida: Resgatar CapiCoins</>}
          </button>
        ) : (
          <div className="bg-slate-900 border border-amber-500/30 p-8 rounded-3xl text-center animate-fade-in shadow-2xl shadow-amber-500/10 max-w-2xl mx-auto">
            <MonetizationOn sx={{ fontSize: 60, color: '#fbbf24', mb: 3 }} />
            <h3 className="text-2xl font-black text-white mb-2">Conhecimento Absorvido!</h3>
            <p className="text-slate-400 mb-8 text-lg">{mensagem}</p>
            <button 
              onClick={() => navigate('/trilha/saude-consumo/perigo-doce/atividade')}
              className="px-10 py-4 bg-slate-100 hover:bg-white text-slate-900 font-black rounded-xl transition-colors w-full md:w-auto"
            >
              Ir para o Quiz de Fixação
            </button>
          </div>
        )}

      </div>
    </div>
  );
}