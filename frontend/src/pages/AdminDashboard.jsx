import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Painel do Administrador</h1>
            <p className="text-slate-400 mt-2">Visão geral dos alunos cadastrados na plataforma.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-green-500 hover:bg-green-400 text-slate-900 font-extrabold py-3 px-8 rounded-xl shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none transition-all"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="rounded-3xl bg-slate-800 border border-slate-700 p-10 text-center text-white">
            Carregando dados dos alunos...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-500/10 border border-red-500 p-8 text-red-200">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-800 shadow-lg shadow-black/20">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-400">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-400">Nome do Aluno</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">CapiCoins</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Fase Atual</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Dias Seguidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-300">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{student.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-400">🪙 {student.capicoins ?? 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-300">{student.fase_atual ?? 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-300">{student.streak_atual ?? 0}</td>
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
