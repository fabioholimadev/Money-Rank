import { useEffect, useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Groups from '@mui/icons-material/Groups';
import Leaderboard from '@mui/icons-material/Leaderboard';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import Person from '@mui/icons-material/Person';

import { getAvatarOption } from '../constants/profileOptions';
import { fetchGlobalRanking } from '../services/rankingDataService';
import { EmptyState, LoadingState, PageHeader, Surface } from '../components/ui/DesignSystem';

function positionPresentation(position) {
  switch (position) {
    case 1:
      return { label: '🥇', color: 'bg-amber-500/20 text-amber-400' };
    case 2:
      return { label: '🥈', color: 'bg-slate-500/20 text-[#dbe7ed]' };
    case 3:
      return { label: '🥉', color: 'bg-orange-500/20 text-orange-400' };
    default:
      return { label: `${position}º`, color: 'text-[#a5b7c2]' };
  }
}

function RankingAvatar({ entry, isClassRanking }) {
  if (isClassRanking) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#37464f] bg-[#17262c] md:h-11 md:w-11">
        <Groups sx={{ fontSize: 20 }} className="text-[#78909c]" />
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
        className="h-9 w-9 shrink-0 rounded-xl border-2 border-[#37464f] object-cover md:h-11 md:w-11"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#37464f] bg-[#17262c] md:h-11 md:w-11">
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
    return <LoadingState label="Preparando o ranking..." />;
  }

  const isClassRanking = activeTab === 'classes';
  const activeList = isClassRanking
    ? ranking.classes
    : ranking.individuals;
  return (
    <div className="space-y-6 py-2 text-[#f1f7fb] sm:py-4">
      <Surface className="bg-gradient-to-br from-[#1f2d33] to-[#183328] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <PageHeader eyebrow="Tabela de líderes" title="Ranking Geral" description="Cada CapiCoin conquistada na trilha pontua individualmente e soma para sua turma." icon={<Leaderboard sx={{ fontSize: 34 }} />} />

          <div className="flex w-full shrink-0 items-center justify-center rounded-2xl border border-[#37464f] bg-[#1f2d33] p-1.5 md:w-auto">
            <button
              type="button"
              aria-pressed={!isClassRanking}
              onClick={() => setActiveTab('individual')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all md:flex-none cursor-pointer ${
                !isClassRanking
                  ? 'bg-[#58cc02] text-[#131f24] shadow-[0_2px_0_#46a302]'
                  : 'text-[#a5b7c2] hover:bg-[#17262c] hover:text-white'
              }`}
            >
              <Person sx={{ fontSize: 18 }} /> Alunos
            </button>
            <button
              type="button"
              aria-pressed={isClassRanking}
              onClick={() => setActiveTab('classes')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black transition-all md:flex-none cursor-pointer ${
                isClassRanking
                  ? 'bg-[#58cc02] text-[#131f24] shadow-[0_2px_0_#46a302]'
                  : 'text-[#a5b7c2] hover:bg-[#17262c] hover:text-white'
              }`}
            >
              <Groups sx={{ fontSize: 18 }} /> Turmas
            </button>
          </div>
        </div>
      </Surface>

      <div>
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300">
            <p role="alert" className="font-bold">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setReloadRevision((value) => value + 1)}
              className="mt-3 rounded-xl bg-rose-300 px-4 py-2 text-xs font-black text-[#131f24] hover:bg-rose-200 cursor-pointer"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!errorMessage && activeList.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border-2 border-[#37464f] bg-[#1f2d33] shadow-[0_5px_0_#0d171b]">
            <table className="w-full">
              <thead className="border-b border-[#37464f] bg-[#131f24]/50">
                <tr>
                  <th className="w-16 px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-[#a5b7c2] md:w-20 md:px-6">
                    Pos.
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-[#a5b7c2] md:px-6">
                    {isClassRanking ? 'Turma' : 'Jogador'}
                  </th>
                  {isClassRanking && (
                    <th className="w-28 px-4 py-4 text-center text-xs font-black uppercase tracking-wider text-[#a5b7c2]">
                      Participação
                    </th>
                  )}
                  <th className="w-28 px-4 py-4 text-right text-xs font-black uppercase tracking-wider text-[#58cc02] md:w-36 md:px-6">
                    CapiCoins
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {activeList.map((entry) => {
                  const presentation = positionPresentation(entry.position);
                  return (
                    <tr
                      key={entry.key}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className={`whitespace-nowrap px-4 py-4 text-sm font-black md:px-6 md:text-lg ${presentation.color}`}>
                        {presentation.label}
                      </td>
                      <td className="px-4 py-4 md:px-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <RankingAvatar
                            entry={entry}
                            isClassRanking={isClassRanking}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm sm:text-base font-black text-white">
                              {isClassRanking
                                ? entry.className
                                : entry.preferredName}
                            </p>
                            {!isClassRanking && (
                              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a5b7c2]">
                                {entry.className}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      {isClassRanking && (
                        <td className="whitespace-nowrap px-4 py-4 text-center text-xs font-black text-[#dbe7ed]">
                          {entry.participatingStudents}/
                          {entry.registeredStudents}
                        </td>
                      )}
                      <td className="px-4 py-4 md:px-6">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap text-sm sm:text-base font-black text-[#58cc02] tabular-nums">
                          <MonetizationOn sx={{ fontSize: 18 }} />
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
          <EmptyState title="O ranking está pronto para começar" description="As primeiras CapiCoins conquistadas aparecerão aqui." />
        ) : null}
      </div>
    </div>
  );
}
