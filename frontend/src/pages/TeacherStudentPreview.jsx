import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WorkshopTrail from './Trilha/WorkshopTrail';
import { fetchTeacherTestMode } from '../services/testModeService';

export default function TeacherStudentPreview() {
  const [testRun, setTestRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchTeacherTestMode()
      .then(({ testRun: current }) => {
        if (mounted) setTestRun(current);
      })
      .catch((cause) => {
        if (mounted) setError(cause?.message || 'Não foi possível verificar o modo de teste.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#37464f] border-t-[#49c0f8]" />
      </div>
    );
  }

  if (error || !testRun?.active) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-[#49c0f8]/30 bg-[#1f2d33] p-7 text-white">
        <ScienceRounded className="text-[#49c0f8]" sx={{ fontSize: 44 }} />
        <h1 className="mt-3 text-2xl font-black">Ative o modo de teste</h1>
        <p className="mt-3 text-sm leading-6 text-[#a5b7c2]">
          A visão do aluno só funciona durante uma execução de teste. Assim, todas as sessões permanecem isoladas do saldo e do ranking oficial.
        </p>
        {error && <p className="mt-3 text-sm font-bold text-red-300">{error}</p>}
        <Link className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#58cc02] px-5 font-black text-[#13210f]" to="/professor">
          <ArrowBackRounded /> Voltar e ativar
        </Link>
      </section>
    );
  }

  return <WorkshopTrail teacherPreview />;
}
