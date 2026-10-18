import AddRounded from '@mui/icons-material/AddRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  createTeacherWorkshop,
  createWorkshopTeam,
  fetchTeacherWorkshops,
  fetchWorkshopTeams,
} from '../services/teacherWorkshopService';

export default function WorkshopTeamManager({ periods, selectedPeriodId }) {
  const [workshops, setWorkshops] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const workshop = useMemo(() => workshops.find((item) =>
    item.competitionPeriodId === selectedPeriodId) || null, [selectedPeriodId, workshops]);
  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId) || null;

  const load = useCallback(async () => {
    const events = await fetchTeacherWorkshops();
    setWorkshops(events);
    const event = events.find((item) => item.competitionPeriodId === selectedPeriodId);
    setTeams(event ? await fetchWorkshopTeams(event.id) : []);
  }, [selectedPeriodId]);

  useEffect(() => {
    let cancelled = false;
    fetchTeacherWorkshops()
      .then(async (events) => {
        const event = events.find((item) => item.competitionPeriodId === selectedPeriodId);
        const loadedTeams = event ? await fetchWorkshopTeams(event.id) : [];
        if (!cancelled) {
          setWorkshops(events);
          setTeams(loadedTeams);
        }
      })
      .catch((error) => { if (!cancelled) setMessage(error.message); });
    return () => { cancelled = true; };
  }, [selectedPeriodId]);

  async function prepareWorkshop() {
    if (!selectedPeriod) return;
    setBusy(true); setMessage('');
    try {
      await createTeacherWorkshop({
        name: 'Oficina Ciência Delas',
        competitionPeriodId: selectedPeriod.id,
      });
      await load();
      setMessage('Oficina preparada. Agora crie as equipes.');
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }

  async function addTeam(event) {
    event.preventDefault();
    if (!workshop || teamName.trim().length < 2) return;
    setBusy(true); setMessage('');
    try {
      const team = await createWorkshopTeam(workshop.id, teamName);
      setTeams((current) => [...current, team]);
      setTeamName('');
      setMessage(`Equipe ${team.name} criada.`);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }

  async function copy(value) {
    await navigator.clipboard.writeText(value);
    setMessage('Código copiado.');
  }

  return (
    <details className="mt-6 rounded-3xl border border-[#53666f] bg-[#1f2d33] p-5 sm:p-6" open>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-white">
        <GroupsRounded className="text-[#58cc02]" /> Equipes da oficina Ciência Delas
      </summary>
      {!selectedPeriod && <p className="mt-4 text-sm text-[#a5b7c2]">Crie e selecione um período antes de preparar a oficina.</p>}
      {selectedPeriod && !workshop && (
        <div className="mt-5 rounded-2xl border border-dashed border-[#53666f] p-5">
          <p className="text-sm text-[#b7c7cf]">A oficina será vinculada ao período <strong className="text-white">{selectedPeriod.name}</strong>. A pontuação usará exatamente essa janela.</p>
          <button className="mt-4 min-h-11 rounded-xl bg-[#58cc02] px-4 text-sm font-black text-[#13210f] disabled:opacity-50" disabled={busy} onClick={prepareWorkshop} type="button">Preparar oficina neste período</button>
        </div>
      )}
      {workshop && (
        <>
          <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={addTeam}>
            <input className="min-h-12 flex-1 rounded-xl border border-[#53666f] bg-[#131f24] px-4 text-sm text-white outline-none focus:border-[#58cc02]" disabled={busy} maxLength={60} onChange={(event) => setTeamName(event.target.value)} placeholder="Nome da equipe, ex.: Ada Lovelace" required value={teamName} />
            <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#58cc02] px-5 text-sm font-black text-[#13210f] disabled:opacity-50" disabled={busy} type="submit"><AddRounded /> Criar equipe</button>
          </form>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {teams.map((team) => (
              <article className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl border border-[#37464f] bg-[#131f24] p-4" key={team.id}>
                <div className="min-w-0">
                  <h3 className="truncate font-black text-white">{team.name}</h3>
                  <p className="mt-1 text-xs text-[#a5b7c2]">{team.memberCount || 0} participante(s) · {team.capiCoins || 0} CapiCoins</p>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#53666f] px-3 py-2 font-mono text-lg font-black tracking-[0.2em] text-[#ffc800]" onClick={() => void copy(team.joinCode)} type="button"><ContentCopyRounded sx={{ fontSize: 17 }} /> {team.joinCode}</button>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-[#78909c]"><QrCode2Rounded sx={{ fontSize: 16 }} /> O QR abre o cadastro com este código preenchido.</p>
                </div>
                <div className="rounded-xl bg-white p-2"><QRCodeSVG level="M" size={112} value={team.joinUrl} /></div>
              </article>
            ))}
          </div>
          {teams.length === 0 && <p className="mt-5 rounded-xl border border-dashed border-[#53666f] p-5 text-center text-sm text-[#a5b7c2]">Nenhuma equipe criada ainda.</p>}
        </>
      )}
      {message && <p className="mt-4 text-sm font-bold text-[#8edcff]">{message}</p>}
    </details>
  );
}
