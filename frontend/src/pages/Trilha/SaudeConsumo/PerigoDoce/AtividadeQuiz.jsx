import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

export default function AtividadeQuiz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Atividade Quiz - O Perigo do Doce</h1>
        <p className="text-gray-400 mb-8">Conteúdo em construção...</p>
      </div>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-8 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
      >
        <ArrowBack /> Voltar
      </button>
    </div>
  );
}
