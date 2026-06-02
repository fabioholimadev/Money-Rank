import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, CheckCircle, MonetizationOn, PlayCircleOutlined, Slideshow } from '@mui/icons-material';
import { fetchApi } from '../../../../lib/api';
import { useAuth } from '../../../../contexts/AuthContext';

export default function ConteudoPerigoDoce() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  // Controle das Abas: Começa mostrando o vídeo por padrão
  const [abaAtiva, setAbaAtiva] = useState('video');

  // ⚠️ ID da atividade no Supabase
  const ATIVIDADE_CONTEUDO_ID = 'ec178180-8513-44a4-9cb1-d0d9f3306b09';

  const { aluno, updateAluno } = useAuth();

  const marcarComoLido = async () => {
    setIsSubmitting(true);
    try {
      const alunoId = aluno?.id;
      if (!alunoId) throw new Error('Usuário não logado');

      const response = await fetchApi('/api/activities/complete', {
        method: 'POST',
        body: {
          id_atividade: ATIVIDADE_CONTEUDO_ID,
          id_aluno: alunoId,
          recompensa: 200,
          tipo: 'conteudo',
        },
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || 'Erro ao registrar conclusão');
      }

      setConcluido(true);
      const reward = json.reward ?? json.aluno?.recompensa ?? 200;
      if (json.aluno?.capicoins !== undefined) {
        updateAluno?.({ capicoins: json.aluno.capicoins });
      }

      // 🚀 CORREÇÃO DA LÓGICA DE MENSAGEM AQUI!
      if (reward > 0) {
        setMensagem(`Excelente! Você ganhou +${reward} CapiCoins por concluir a missão.`);
      } else {
        setMensagem(`Revisão concluída! Você já resgatou a recompensa desta missão hoje.`);
      }
    } catch (error) {
      console.error('Erro ao registrar conclusão:', error);
      alert(error?.message || 'Erro ao registrar conclusão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-10 flex flex-col items-center w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-4xl">
        
        <button onClick={() => navigate('/trilha')} className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-6 md:mb-8 font-bold transition-colors text-sm md:text-base">
          <ArrowBack fontSize="small" /> Voltar ao Mapa
        </button>

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-5xl font-black mb-3 md:mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            O Perigo do Doce
          </h1>
          <p className="text-slate-400 text-sm md:text-lg">
            Escolha como prefere aprender: assista ao vídeo resumo ou navegue pelos slides completos da aula.
          </p>
        </div>

        {/* BARRAS DE SELEÇÃO (TABS) */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setAbaAtiva('video')}
            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold text-xs md:text-sm transition-all ${abaAtiva === 'video' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <PlayCircleOutlined sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Vídeo Resumo</span>
            <span className="sm:hidden">Vídeo</span>
          </button>
          <button 
            onClick={() => setAbaAtiva('slide')}
            className={`flex-1 flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold text-xs md:text-sm transition-all ${abaAtiva === 'slide' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Slideshow sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Slides da Aula</span>
            <span className="sm:hidden">Slides</span>
          </button>
        </div>

        {/* ÁREA DO CONTEÚDO */}
        <div className="bg-slate-900 border border-slate-800 p-3 md:p-6 rounded-3xl shadow-xl mb-8 md:mb-12 w-full overflow-hidden">
          
          {abaAtiva === 'video' ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center relative">
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

        {/* BOTÃO DE RESGATE */}
        {!concluido ? (
          <div className="flex justify-center">
            <button 
              onClick={marcarComoLido}
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm md:text-lg rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sincronizando...</span>
              ) : (
                <>
                  <CheckCircle sx={{ fontSize: 20 }} />
                  <span>Missão Cumprida: Resgatar CapiCoins</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-amber-500/30 p-6 md:p-8 rounded-3xl text-center animate-fade-in shadow-2xl shadow-amber-500/10 max-w-2xl mx-auto">
            <MonetizationOn sx={{ fontSize: 50 }} className="text-amber-400 mx-auto mb-3" />
            <h3 className="text-xl md:text-2xl font-black text-white mb-2">Conhecimento Absorvido!</h3>
            <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-lg">{mensagem}</p>
            <button 
              onClick={() => navigate('/trilha/saude-consumo/perigo-doce/atividade')}
              className="w-full md:w-auto px-6 md:px-10 py-3 md:py-4 bg-slate-100 hover:bg-white text-slate-900 font-black rounded-xl transition-colors text-sm md:text-base"
            >
              Ir para o Quiz de Fixação
            </button>
          </div>
        )}

      </div>
    </div>
  );
}