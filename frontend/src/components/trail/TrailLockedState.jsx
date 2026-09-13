import ArrowBack from '@mui/icons-material/ArrowBack';
import Lock from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

import TrailPageShell from './TrailPageShell';

export default function TrailLockedState({
  title = 'Etapa bloqueada',
  message = 'Conclua a etapa anterior para continuar sua jornada.',
}) {
  const navigate = useNavigate();

  return (
    <TrailPageShell>
      <section className="rounded-3xl border border-[#37464f] bg-[#17262c] p-8 text-center text-white">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f2d33] text-[#78909c]">
          <Lock sx={{ fontSize: 28 }} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#a5b7c2]">
          {message}
        </p>
        <button
          type="button"
          onClick={() => navigate('/trilha')}
          className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-[#58cc02] px-5 py-3 text-sm font-black text-[#131f24] transition-colors hover:bg-[#70e823]"
        >
          <ArrowBack sx={{ fontSize: 18 }} aria-hidden="true" />
          Voltar ao mapa
        </button>
      </section>
    </TrailPageShell>
  );
}
