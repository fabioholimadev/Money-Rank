import CheckCircle from '@mui/icons-material/CheckCircle';
import Lock from '@mui/icons-material/Lock';
import PlayArrow from '@mui/icons-material/PlayArrow';

const MODULE_OFFSETS = [
  'md:-translate-x-8',
  'md:translate-x-8',
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
        relative w-full max-w-sm rounded-3xl border p-6
        transition-all duration-300 ${offsetClass}
        ${
          liberado
            ? `bg-[#17262c] border-[#37464f] hover:border-[#58cc02]/40 hover:-translate-y-1 hover:shadow-2xl`
            : 'border-white/[0.04] bg-[#1f2d33]/50 opacity-50'
        }
      `}
    >
      {concluido && (
        <div
          className="absolute -right-2 -top-2 rounded-full bg-[#58cc02] p-1 shadow-lg shadow-[#58cc02]/30 flex items-center justify-center"
          title="Fase concluída"
        >
          <CheckCircle sx={{ fontSize: 20 }} className="text-[#131f24]" />
        </div>
      )}

      {!liberado && (
        <div className="absolute right-4 top-4 text-[#78909c]">
          <Lock sx={{ fontSize: 20 }} aria-hidden="true" />
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <div
          className={`
            flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl
            bg-[#1f2d33] border border-[#37464f] shadow-md
            ${!liberado ? 'grayscale' : ''}
          `}
        >
          <span className="text-lg font-black text-[#58cc02]">
            {modulo.fase}
          </span>
        </div>

        <div>
          <p className="mb-0.5 text-xs font-black uppercase tracking-wider text-[#78909c]">
            {etapaLabel}
          </p>
          <h3 className="text-base font-black leading-tight text-white">
            {modulo.titulo}
          </h3>
        </div>
      </div>

      <p className="mb-5 text-xs leading-relaxed text-[#a5b7c2]">
        {modulo.descricao}
      </p>

      {liberado ? (
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => onNavigate(`${modulo.rota}/conteudo`)}
            className="flex w-full items-center gap-2 rounded-2xl border border-[#37464f] bg-[#1f2d33] px-4 py-3 text-left text-[#dbe7ed] transition-colors hover:border-[#536670] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58cc02] cursor-pointer"
          >
            <IconeConteudo sx={{ fontSize: 18 }} className="text-[#58cc02]" aria-hidden="true" />
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
              className={`flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer ${
                atividadeLiberada
                  ? 'bg-[#58cc02] hover:bg-[#46a302] text-[#131f24] font-black shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none'
                  : 'cursor-not-allowed border border-white/[0.04] bg-[#1f2d33] text-[#78909c] shadow-none'
              }`}
            >
              {atividadeLiberada ? (
                <PlayArrow
                  sx={{ fontSize: 18 }}
                  className="text-[#131f24]"
                  aria-hidden="true"
                />
              ) : (
                <Lock sx={{ fontSize: 16 }} aria-hidden="true" />
              )}
              <IconeAtividade
                sx={{ fontSize: 16 }}
                className={
                  atividadeLiberada ? 'text-[#131f24]' : 'text-[#78909c]'
                }
                aria-hidden="true"
              />
              <span
                className={`text-xs font-black ${
                  atividadeLiberada ? 'text-[#131f24]' : 'text-[#78909c]'
                }`}
              >
                {modulo.nomeAtividade}
              </span>
            </button>
          )}

          {!modulo.contentOnly && !atividadeLiberada && (
            <p className="text-center text-[10px] font-bold uppercase tracking-wider text-[#78909c]">
              Conclua o conteúdo para liberar a atividade
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-bold text-[#78909c]">
          <Lock sx={{ fontSize: 14 }} aria-hidden="true" />
          <span>Complete a fase anterior para desbloquear</span>
        </div>
      )}
    </article>
  );
}
