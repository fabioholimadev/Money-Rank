import CheckCircle from '@mui/icons-material/CheckCircle';
import Lock from '@mui/icons-material/Lock';
import PlayArrow from '@mui/icons-material/PlayArrow';

const MODULE_OFFSETS = [
  'md:-translate-x-10',
  'md:translate-x-10',
];

export default function TrailModuleCard({
  modulo,
  liberado,
  concluido,
  atividadeLiberada,
  indice,
  onNavigate,
}) {
  const IconeConteudo = modulo.IconeConteudo;
  const IconeAtividade = modulo.IconeAtividade;
  const offsetClass = MODULE_OFFSETS[indice % MODULE_OFFSETS.length];
  const etapaLabel = modulo.etapaLabel || `Fase ${modulo.fase}`;

  return (
    <article
      className={`
        relative w-full max-w-sm rounded-3xl border p-5
        transition-all duration-300 ${offsetClass}
        ${
          liberado
            ? `bg-slate-900 ${modulo.corBorda} hover:-translate-y-1 hover:shadow-xl ${modulo.corSombra}`
            : 'border-slate-800/60 bg-slate-900/40 opacity-60'
        }
      `}
    >
      {concluido && (
        <div
          className="absolute -right-2 -top-2 rounded-full bg-green-500 p-0.5 shadow-lg shadow-green-500/40"
          title="Fase concluída"
        >
          <CheckCircle sx={{ fontSize: 18 }} className="text-white" />
        </div>
      )}

      {!liberado && (
        <div className="absolute right-4 top-4 text-slate-600">
          <Lock sx={{ fontSize: 20 }} aria-hidden="true" />
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <div
          className={`
            flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl
            bg-gradient-to-br ${modulo.cor} shadow-lg
            ${!liberado ? 'grayscale' : ''}
          `}
        >
          <span className="text-lg font-black text-white">
            {modulo.fase}
          </span>
        </div>

        <div>
          <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-slate-500">
            {etapaLabel}
          </p>
          <h3 className="text-base font-black leading-tight text-white">
            {modulo.titulo}
          </h3>
        </div>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-slate-400">
        {modulo.descricao}
      </p>

      {liberado ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onNavigate(`${modulo.rota}/conteudo`)}
            className="flex w-full items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-left text-slate-300 transition-colors hover:border-amber-500/50 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <IconeConteudo sx={{ fontSize: 18 }} aria-hidden="true" />
            <span className="flex-1 text-xs font-bold">
              {modulo.rotuloConteudo ||
                (concluido ? 'Rever conteúdo' : 'Ver conteúdo')}
            </span>
          </button>

          {!modulo.contentOnly && (
            <button
              type="button"
              disabled={!atividadeLiberada}
              onClick={() =>
                onNavigate(`${modulo.rota}/atividade`)
              }
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                atividadeLiberada
                  ? `bg-gradient-to-r ${modulo.cor} hover:brightness-110 hover:shadow-lg`
                  : 'cursor-not-allowed border border-slate-800 bg-slate-950/30 text-slate-600 shadow-none'
              }`}
            >
              {atividadeLiberada ? (
                <PlayArrow
                  sx={{ fontSize: 18 }}
                  className="text-white"
                  aria-hidden="true"
                />
              ) : (
                <Lock sx={{ fontSize: 17 }} aria-hidden="true" />
              )}
              <IconeAtividade
                sx={{ fontSize: 16 }}
                className={
                  atividadeLiberada ? 'text-white/80' : 'text-slate-700'
                }
                aria-hidden="true"
              />
              <span
                className={`text-xs font-bold ${
                  atividadeLiberada ? 'text-white' : 'text-slate-600'
                }`}
              >
                {modulo.nomeAtividade}
              </span>
            </button>
          )}

          {!modulo.contentOnly && !atividadeLiberada && (
            <p className="text-center text-[0.65rem] font-semibold text-slate-600">
              Conclua o conteúdo para liberar a atividade
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Lock sx={{ fontSize: 14 }} aria-hidden="true" />
          <span>Complete a fase anterior para desbloquear</span>
        </div>
      )}
    </article>
  );
}
