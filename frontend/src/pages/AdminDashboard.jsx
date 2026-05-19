import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MonetizationOn, Logout } from '@mui/icons-material';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/students');
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Erro ao carregar alunos.');
        } else {
          setStudents(data.students || []);
        }
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Não foi possível conectar ao servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Painel do Administrador</h1>
            <p className="text-slate-400 mt-2">Visão geral dos alunos cadastrados na plataforma.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold py-3 px-8 rounded-2xl shadow-lg shadow-amber-400/20 active:translate-y-1 active:shadow-md transition-all flex items-center gap-2"
          >
            <Logout sx={{ fontSize: 20 }} />
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="rounded-3xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-10 text-center text-white shadow-lg shadow-amber-500/5">
            Carregando dados dos alunos...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-500/10 border border-red-500 p-8 text-red-200 shadow-lg">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-lg shadow-amber-500/5">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-400">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-400">Nome do Aluno</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">CapiCoins</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Fase Atual</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Dias Seguidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-400">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-amber-400 font-semibold flex items-center justify-center gap-1">
                      <MonetizationOn sx={{ fontSize: 18 }} />
                      {student.capicoins ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-amber-400 font-semibold">{student.fase_atual ?? 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-amber-400 font-semibold">{student.streak_atual ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
