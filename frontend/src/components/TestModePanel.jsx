import { useEffect, useState } from 'react';
import { DeleteSweep, Science, StopCircleOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  activateTeacherTestMode,
  cleanTeacherTestModeData,
  endTeacherTestMode,
  fetchTeacherTestMode,
} from '../services/testModeService';

const DATE_TIME = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Fortaleza',
  dateStyle: 'short',
  timeStyle: 'short',
});

const ACTIVITIES = [
  [1, 'Perigo Doce'],
  [2, 'Custo do Vício'],
  [3, 'Ilusão do Dinheiro'],
  [4, 'Engenharia do Desejo'],
];

export default function TestModePanel() {
  const navigate = useNavigate();
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [testRun, setTestRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchTeacherTestMode()
      .then((result) => { if (mounted) setTestRun(result.testRun); })
      .catch((cause) => { if (mounted) setError(cause.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function run(action) {
    setLoading(true);
    setError('');
    try {
      setTestRun(await action());
    } catch (cause) {
      setError(cause?.message || 'Não foi possível alterar o modo de teste.');
    } finally {
      setLoading(false);
    }
  }

  const active = testRun?.active === true;
  const canClean = ['ENDED', 'EXPIRED'].includes(testRun?.status);

  return (
    <section className="mt-6 rounded-3xl border border-violet-400/25 bg-violet-400/5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">Validação isolada</p>
          <h2 className="mt-1 text-xl font-black">Modo de teste do professor</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Acesso exclusivo desta conta de professor. As sessões usam o banco pedagógico real,
            mas recebem <code>is_test</code> e <code>test_run_id</code>; não alteram saldo,
            progresso nem ranking oficial.
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${active ? 'border-violet-300/40 text-violet-200' : 'border-slate-700 text-slate-400'}`}>
          {active ? 'Modo de teste ativo' : testRun?.status === 'CLEANED' ? 'Dados limpos' : 'Modo de teste inativo'}
        </span>
      </div>

      {!active && !canClean && (
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label>
            <span className="mb-1 block text-xs font-black uppercase text-slate-500">Duração (minutos)</span>
            <input type="number" min="5" max="120" value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} className="min-h-11 w-36 rounded-xl border border-slate-700 bg-slate-950 px-3" />
          </label>
          <button type="button" disabled={loading} onClick={() => run(() => activateTeacherTestMode(durationMinutes))} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-300 px-4 text-sm font-black text-slate-950 disabled:opacity-50">
            <Science sx={{ fontSize: 19 }} /> Ativar modo de teste
          </button>
        </div>
      )}

      {active && (
        <div className="mt-5">
          <p className="text-sm font-bold text-violet-100">Encerra automaticamente em {DATE_TIME.format(new Date(testRun.endsAt))}.</p>
          <p className="mt-1 text-xs text-slate-500">Execução {testRun.id} · {testRun.sessionCount} sessões · {testRun.attemptCount} submissões · {testRun.auditCount} eventos auditados</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ACTIVITIES.map(([phase, label]) => (
              <button key={phase} type="button" onClick={() => navigate(`/professor/teste/${phase}`)} className="min-h-10 rounded-xl border border-violet-300/30 px-3 text-xs font-black text-violet-200 hover:border-violet-200">
                Iniciar {label}
              </button>
            ))}
            <button type="button" disabled={loading} onClick={() => run(endTeacherTestMode)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-400/30 px-3 text-xs font-black text-red-300 disabled:opacity-50">
              <StopCircleOutlined sx={{ fontSize: 18 }} /> Encerrar modo de teste
            </button>
          </div>
        </div>
      )}

      {canClean && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-300">Execução encerrada: {testRun.sessionCount} sessões, {testRun.attemptCount} submissões e {testRun.auditCount} eventos auditados.</p>
          <button type="button" disabled={loading} onClick={() => run(cleanTeacherTestModeData)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-400/30 px-3 text-xs font-black text-red-300 disabled:opacity-50">
            <DeleteSweep sx={{ fontSize: 18 }} /> Limpar dados do teste
          </button>
        </div>
      )}

      {error && <p role="alert" className="mt-4 text-sm font-bold text-red-300">{error}</p>}
    </section>
  );
}
