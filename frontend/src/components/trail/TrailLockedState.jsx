import { ArrowBack, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TrailPageShell from './TrailPageShell';

export default function TrailLockedState({
  title = 'Etapa bloqueada',
  message = 'Conclua a etapa anterior para continuar sua jornada.',
}) {
  const navigate = useNavigate();

  return (
    <TrailPageShell>
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-white">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
          <Lock sx={{ fontSize: 28 }} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          {message}
        </p>
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-amber-400"
        >
          <ArrowBack sx={{ fontSize: 18 }} aria-hidden="true" />
          Voltar ao mapa
        </button>
      </section>
    </TrailPageShell>
  );
}
