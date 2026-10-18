import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { useEffect, useState } from 'react';
import ProfileAvatar from '../components/ProfileAvatar';
import { fetchWorkshopRanking } from '../services/workshopService';

export default function WorkshopRanking() {
  const [data, setData] = useState({ individualRanking: [], teamRanking: [] });
  const [tab, setTab] = useState('teams');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchWorkshopRanking()
      .then((result) => { if (active) setData(result); })
      .catch((cause) => { if (active) setError(cause.message); });
    const timer = window.setInterval(() => {
      fetchWorkshopRanking().then((result) => { if (active) setData(result); }).catch(() => {});
    }, 15_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const rows = tab === 'teams' ? data.teamRanking : data.individualRanking;
  return (
    <div className="space-y-6 py-3 text-[#f1f7fb]">
      <header className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6 sm:p-8">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffc800]"><EmojiEventsRounded /> Competição Ciência Delas</p>
        <h1 className="mt-2 text-3xl font-black text-white">Ranking da oficina</h1>
        <p className="mt-2 text-sm text-[#a5b7c2]">Cada rodada concluída soma seus pontos em CapiCoins enquanto o período estiver ativo.</p>
      </header>
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#37464f] bg-[#17262c] p-2">
        <button className={`min-h-11 rounded-xl font-black ${tab === 'teams' ? 'bg-[#49c0f8] text-[#10252d]' : 'text-[#b7c7cf]'}`} onClick={() => setTab('teams')} type="button"><GroupsRounded /> Equipes</button>
        <button className={`min-h-11 rounded-xl font-black ${tab === 'individual' ? 'bg-[#49c0f8] text-[#10252d]' : 'text-[#b7c7cf]'}`} onClick={() => setTab('individual')} type="button"><PersonRounded /> Individual</button>
      </div>
      {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
      <div className="space-y-3">
        {rows.map((row) => (
          <article className="flex items-center gap-4 rounded-2xl border border-[#37464f] bg-[#1f2d33] p-4" key={row.teamId || row.studentUid}>
            <span className="w-10 text-center text-xl font-black text-[#ffc800]">{row.position}º</span>
            {tab === 'individual' && <ProfileAvatar avatarId={String(row.avatarId || '').toLowerCase().replaceAll('_', '-')} photoUrl={row.avatarUrl} name={row.preferredName} size="sm" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-black text-white">{tab === 'teams' ? row.teamName : row.preferredName}</p>
              <p className="text-xs text-[#a5b7c2]">{tab === 'teams' ? `${row.memberCount} participante(s)` : row.teamName}</p>
            </div>
            <strong className="text-lg text-[#58cc02]">{row.capiCoins} CapiCoins</strong>
          </article>
        ))}
        {!error && rows.length === 0 && <p className="rounded-2xl border border-dashed border-[#53666f] p-8 text-center text-sm text-[#a5b7c2]">O ranking aparecerá assim que as equipes começarem a pontuar.</p>}
      </div>
    </div>
  );
}
