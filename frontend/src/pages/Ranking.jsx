import { useEffect, useState } from 'react';
import {
  AccountCircle,
  Groups,
  Leaderboard,
  MonetizationOn,
  Person,
} from '@mui/icons-material';
import { getAvatarOption } from '../constants/profileOptions';
import { fetchGlobalRanking } from '../services/rankingDataService';

function positionPresentation(position) {
  switch (position) {
    case 1:
      return { label: '🥇', color: 'bg-amber-500/20 text-amber-400' };
    case 2:
      return { label: '🥈', color: 'bg-slate-500/20 text-slate-300' };
    case 3:
      return { label: '🥉', color: 'bg-orange-500/20 text-orange-400' };
    default:
      return { label: `${position}º`, color: 'text-slate-400' };
  }
}

function RankingAvatar({ entry, isClassRanking }) {
  if (isClassRanking) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-slate-900 md:h-11 md:w-11">
        <Groups sx={{ fontSize: 20 }} className="text-slate-500" />
      </div>
    );
  }

  const avatarUrl = entry.avatarUrl ||
    getAvatarOption(entry.avatarId)?.imageUrl;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`Avatar de ${entry.preferredName}`}
        className="h-9 w-9 shrink-0 rounded-xl border border-zinc-700 object-cover md:h-11 md:w-11"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-slate-900 md:h-11 md:w-11">
      <AccountCircle sx={{ fontSize: 20 }} className="text-slate-600" />
    </div>
  );
}

export default function Ranking() {
  const [ranking, setRanking] = useState({
    scope: 'ALL_TIME',
    individuals: [],
    classes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('individual');
  const [reloadRevision, setReloadRevision] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadRanking() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await fetchGlobalRanking();
        if (isActive) setRanking(result);
      } catch (error) {
        console.error('Não foi possível carregar o ranking.', error);
        if (isActive) {
          setErrorMessage(
            'Não foi possível carregar o ranking. Tente novamente em instantes.',
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadRanking();
    return () => {
      isActive = false;
    };
  }, [reloadRevision]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
        <p className="text-sm font-bold uppercase tracking-widest text-white">
          Preparando o ranking...
        </p>
      </div>
    );
  }

  const isClassRanking = activeTab === 'classes';
  const activeList = isClassRanking
    ? ranking.classes
    : ranking.individuals;
  return (
    <div className="relative min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <header className="relative mx-auto mb-8 max-w-4xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-2xl font-black tracking-tight md:text-4xl">
              <Leaderboard sx={{ fontSize: 34, color: '#fbbf24' }} />
              Ranking geral
            </h1>
            <p className="text-sm text-slate-400">
              Cada CapiCoin conquistada vira um ponto para você e para sua
              turma, sem depender de um período competitivo.
            </p>
          </div>

          <div className="flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-1 md:w-auto">
            <button
              type="button"
              aria-pressed={!isClassRanking}
              onClick={() => setActiveTab('individual')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all md:flex-none ${
                !isClassRanking
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Person sx={{ fontSize: 18 }} /> Alunos
            </button>
            <button
              type="button"
              aria-pressed={isClassRanking}
              onClick={() => setActiveTab('classes')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all md:flex-none ${
                isClassRanking
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Groups sx={{ fontSize: 18 }} /> Turmas
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <p role="alert" className="font-semibold">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setReloadRevision((value) => value + 1)}
              className="mt-3 min-h-11 rounded-lg bg-red-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-red-200"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!errorMessage && activeList.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-amber-500/5 backdrop-blur-sm">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-gradient-to-r from-slate-900/80 to-slate-900/60">
                <tr>
                  <th className="w-16 px-3 py-4 text-left text-xs font-bold text-slate-300 md:w-20 md:px-6 md:text-sm">
                    Pos.
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-bold text-slate-300 md:px-6 md:text-sm">
                    {isClassRanking ? 'Turma' : 'Jogador'}
                  </th>
                  {isClassRanking && (
                    <th className="w-28 px-3 py-4 text-center text-xs font-bold text-slate-300 md:text-sm">
                      Participação
                    </th>
                  )}
                  <th className="w-28 px-3 py-4 text-right text-xs font-bold text-amber-400 md:w-36 md:px-6 md:text-sm">
                    Pontos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {activeList.map((entry) => {
                  const presentation = positionPresentation(entry.position);
                  return (
                    <tr
                      key={entry.key}
                      className="transition-colors hover:bg-slate-900/40"
                    >
                      <td className={`whitespace-nowrap px-3 py-4 text-sm font-bold md:px-6 md:text-lg ${presentation.color}`}>
                        {presentation.label}
                      </td>
                      <td className="px-3 py-4 md:px-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <RankingAvatar
                            entry={entry}
                            isClassRanking={isClassRanking}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white md:text-base">
                              {isClassRanking
                                ? entry.className
                                : entry.preferredName}
                            </p>
                            {!isClassRanking && (
                              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                                {entry.className}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      {isClassRanking && (
                        <td className="whitespace-nowrap px-3 py-4 text-center text-xs font-bold text-slate-300 md:text-sm">
                          {entry.participatingStudents}/
                          {entry.registeredStudents}
                        </td>
                      )}
                      <td className="px-3 py-4 md:px-6">
                        <div className="flex items-center justify-end gap-1 whitespace-nowrap text-sm font-black text-amber-400 md:gap-2 md:text-lg">
                          <MonetizationOn sx={{ fontSize: 17 }} />
                          {entry.totalPoints.toLocaleString('pt-BR')}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : !errorMessage ? (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center shadow-lg shadow-amber-500/5">
            <p className="text-lg text-slate-400">
              Os primeiros pontos ainda não foram registrados.
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
