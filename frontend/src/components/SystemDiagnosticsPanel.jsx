import { useEffect, useState } from 'react';
import HealthAndSafety from '@mui/icons-material/HealthAndSafety';
import Refresh from '@mui/icons-material/Refresh';
import { API_BASE } from '../lib/api';
import { fetchTeacherDiagnostics } from '../services/diagnosticsService';

function value(value, fallback = 'Ainda não registrado') {
  return value === null || value === undefined || value === '' ? fallback : String(value);
}

export default function SystemDiagnosticsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try { setData(await fetchTeacherDiagnostics()); }
    catch (cause) { setError(cause.message); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let mounted = true;
    fetchTeacherDiagnostics()
      .then((result) => { if (mounted) setData(result); })
      .catch((cause) => { if (mounted) setError(cause.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const period = data?.database?.recognizedPeriod;
  return (
    <details className="mt-6 rounded-3xl border border-[#53666f] bg-[#1f2d33] p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-black">
        <HealthAndSafety className="text-cyan-300" /> Diagnóstico administrativo
      </summary>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#37464f] bg-[#131f24] p-4 text-xs leading-6 text-[#d8e2e7]">
          <h3 className="font-black text-white">Banco e período</h3>
          <p>SQL Connect: {data?.database?.accessible ? 'acessível' : 'indisponível'}</p>
          <p>Itens ativos: {value(data?.database?.activeItems)}</p>
          <p>Servidor: {data?.serverTime ? new Date(data.serverTime).toLocaleString('pt-BR', { timeZone: data.timezone }) : '—'} ({value(data?.timezone)})</p>
          <p>Estado: {value(period?.state)} · {value(period?.reason)}</p>
          <p>Período reconhecido: {value(period?.selectedPeriodName)}</p>
          <p>Última falha SQL: {value(data?.database?.lastFailure?.message, 'nenhuma neste processo')}</p>
        </section>
        <section className="rounded-2xl border border-[#37464f] bg-[#131f24] p-4 text-xs leading-6 text-[#d8e2e7]">
          <h3 className="font-black text-white">Build publicado</h3>
          <p>Frontend: {value(import.meta.env.VITE_BUILD_COMMIT, 'commit não injetado')}</p>
          <p>API: {value(data?.render?.apiCommit)}</p>
          <p>API usada pelo frontend: {API_BASE}</p>
          <p>Node: {value(data?.render?.nodeVersion)}</p>
          <p>Versão: {value(data?.render?.buildVersion)}</p>
        </section>
      </div>
      {error && <p role="alert" className="mt-4 text-sm font-bold text-red-300">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={loading} onClick={() => void load()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#53666f] px-3 text-xs font-black disabled:opacity-50"><Refresh sx={{ fontSize: 17 }} /> Atualizar</button>
      </div>
    </details>
  );
}
