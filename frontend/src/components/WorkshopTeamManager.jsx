import AddRounded from '@mui/icons-material/AddRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  createTeacherWorkshop,
  createWorkshopTeam,
  deleteWorkshopTeam,
  fetchTeacherWorkshops,
  fetchWorkshopTeams,
} from '../services/teacherWorkshopService';
import { setTeacherCompetitionPeriodStatus } from '../services/teacherCompetitionService';

function activationTarget(period, now = Date.now()) {
  if (!period) return null;
  const startsAt = Date.parse(period.startsAt);
  const endsAt = Date.parse(period.endsAt);
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || now >= endsAt) return null;
  if (now < startsAt) return period.status === 'DRAFT' ? 'SCHEDULED' : null;
  return ['DRAFT', 'PAUSED'].includes(period.status) ? 'ACTIVE' : null;
}

export default function WorkshopTeamManager({ periods, selectedPeriodId, onPeriodChanged, onWorkshopChanged }) {
  const [workshops, setWorkshops] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [teamPendingDeletion, setTeamPendingDeletion] = useState(null);
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
      const targetStatus = activationTarget(selectedPeriod);
      if (selectedPeriod.status === 'DRAFT' && !targetStatus) {
        throw new Error('Revise o horário: esse período já terminou e não pode receber a oficina.');
      }
      if (targetStatus) {
        const changedPeriod = await setTeacherCompetitionPeriodStatus({
          periodId: selectedPeriod.id,
          status: targetStatus,
        });
        await onPeriodChanged?.(changedPeriod);
      }
      await createTeacherWorkshop({
        name: 'Oficina Ciência Delas',
        competitionPeriodId: selectedPeriod.id,
      });
      await load();
      await onWorkshopChanged?.();
      setMessage('Oficina e período preparados. Agora crie as equipes.');
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }

  async function openCompetition() {
    const targetStatus = activationTarget(selectedPeriod);
    if (!targetStatus) {
      setMessage('Ajuste a janela do período antes de abrir a competição.');
      return;
    }
    setBusy(true); setMessage('');
    try {
      const changedPeriod = await setTeacherCompetitionPeriodStatus({
        periodId: selectedPeriod.id,
        status: targetStatus,
      });
      await onPeriodChanged?.(changedPeriod);
      await onWorkshopChanged?.();
      setMessage(targetStatus === 'ACTIVE'
        ? 'Competição ativada. As atividades estão liberadas.'
        : 'Competição agendada. Ela será liberada no horário definido.');
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
      await onWorkshopChanged?.();
      setMessage(`Equipe ${team.name} criada.`);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }

  async function copy(value) {
    await navigator.clipboard.writeText(value);
    setMessage('Código copiado.');
  }

  async function removeTeam(team) {
    if (!workshop || Number(team.memberCount || 0) > 0) return;
    setBusy(true); setMessage('');
    try {
      await deleteWorkshopTeam(workshop.id, team.id);
      setTeams((current) => current.filter((item) => item.id !== team.id));
      setTeamPendingDeletion(null);
      await onWorkshopChanged?.();
      setMessage(`Equipe ${team.name} apagada. O código dela não pode mais ser usado.`);
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
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
          {['DRAFT', 'PAUSED'].includes(selectedPeriod?.status) && (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#ff9600]/30 bg-[#ff9600]/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#ffd39a]">A competição ainda não está liberada</p>
                <p className="mt-1 text-xs leading-5 text-[#e7ba83]">Ative o período para os alunos iniciarem rodadas e receberem CapiCoins.</p>
              </div>
              <button className="min-h-11 rounded-xl bg-[#ffb020] px-4 text-sm font-black text-[#2b1b00] disabled:opacity-50" disabled={busy || !activationTarget(selectedPeriod)} onClick={() => void openCompetition()} type="button">
                {selectedPeriod.status === 'PAUSED' ? 'Retomar competição' : 'Ativar competição'}
              </button>
            </div>
          )}
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
                  {Number(team.memberCount || 0) === 0 ? (
                    <button
                      className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-400/40 px-3 text-xs font-black text-rose-300 transition hover:border-rose-300 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={busy}
                      onClick={() => setTeamPendingDeletion(teamPendingDeletion === team.id ? null : team.id)}
                      type="button"
                    >
                      <DeleteOutlineRounded sx={{ fontSize: 18 }} /> Apagar equipe
                    </button>
                  ) : (
                    <p className="mt-3 text-[11px] leading-5 text-[#78909c]">Equipes com participantes não podem ser apagadas, preservando o ranking e as respostas.</p>
                  )}
                </div>
                <div className="rounded-xl bg-white p-2"><QRCodeSVG level="M" size={112} value={team.joinUrl} /></div>
                {teamPendingDeletion === team.id && (
                  <div className="col-span-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3" role="alert">
                    <p className="text-sm font-bold text-rose-100">Apagar a equipe <strong>{team.name}</strong>?</p>
                    <p className="mt-1 text-xs leading-5 text-rose-200/80">O código {team.joinCode} deixará de funcionar. Esta ação não pode ser desfeita.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="min-h-10 rounded-xl border border-[#53666f] px-3 text-xs font-black text-white disabled:opacity-50" disabled={busy} onClick={() => setTeamPendingDeletion(null)} type="button">Cancelar</button>
                      <button className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-400 px-3 text-xs font-black text-[#301014] disabled:opacity-50" disabled={busy} onClick={() => void removeTeam(team)} type="button"><DeleteOutlineRounded sx={{ fontSize: 18 }} /> Confirmar exclusão</button>
                    </div>
                  </div>
                )}
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
