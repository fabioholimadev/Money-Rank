import AutoGraphRounded from '@mui/icons-material/AutoGraphRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchTeacherWorkshops,
  fetchWorkshopDashboard,
} from '../services/teacherWorkshopService';
import TestModePanel from './TestModePanel';
import WorkshopTeamManager from './WorkshopTeamManager';

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR');
const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Fortaleza',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
const ACTIVITY_TITLES = {
  1: 'Verdadeiro ou falso',
  2: 'Ligar colunas',
  3: 'Completar frases',
  4: 'Quiz Ciência Delas',
};

function MetricCard({ Icon, label, value, detail, color }) {
  return (
    <article className="rounded-2xl border border-[#37464f] bg-[#1f2d33] p-5">
      <Icon className={color} sx={{ fontSize: 26 }} />
      <p className="mt-4 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-black text-[#d8e2e7]">{label}</p>
      <p className="mt-1 text-xs text-[#78909b]">{detail}</p>
    </article>
  );
}

function difficulty(activity) {
  const total = activity.correctAnswers + activity.wrongAnswers;
  return total ? Math.round((activity.wrongAnswers / total) * 100) : 0;
}

export default function WorkshopTeacherDashboard({
  onPeriodChanged,
  periods,
  selectedPeriodId,
}) {
  const [event, setEvent] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!selectedPeriodId) {
      setEvent(null);
      setDashboard(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const events = await fetchTeacherWorkshops();
      const selectedEvent = events.find((item) => item.competitionPeriodId === selectedPeriodId) || null;
      setEvent(selectedEvent);
      setDashboard(selectedEvent ? await fetchWorkshopDashboard(selectedEvent.id) : null);
    } catch (cause) {
      setDashboard(null);
      setError(cause?.message || 'Não foi possível consultar os dados da oficina.');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriodId]);

  useEffect(() => {
    let active = true;
    fetchTeacherWorkshops()
      .then(async (events) => {
        const selectedEvent = events.find((item) => item.competitionPeriodId === selectedPeriodId) || null;
        const data = selectedEvent ? await fetchWorkshopDashboard(selectedEvent.id) : null;
        if (active) {
          setEvent(selectedEvent);
          setDashboard(data);
          setError('');
        }
      })
      .catch((cause) => {
        if (active) setError(cause?.message || 'Não foi possível consultar os dados da oficina.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedPeriodId]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    if (!term) return dashboard?.students || [];
    return (dashboard?.students || []).filter((student) => [
      student.preferredName,
      student.fullName,
      student.teamName,
      student.className,
    ].some((value) => String(value || '').toLocaleLowerCase('pt-BR').includes(term)));
  }, [dashboard?.students, search]);

  const summary = dashboard?.summary;

  return (
    <div>
      <TestModePanel />

      <WorkshopTeamManager
        onPeriodChanged={onPeriodChanged}
        onWorkshopChanged={load}
        periods={periods}
        selectedPeriodId={selectedPeriodId}
      />

      <section className="mt-6 rounded-3xl border border-[#37464f] bg-[#17262c] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#58cc02]">Categoria selecionada</p>
            <h2 className="mt-1 text-2xl font-black text-white">Criação de times para oficina</h2>
            <p className="mt-2 text-sm text-[#78909b]">
              Somente participantes, tentativas e CapiCoins da trilha Ciência Delas neste período.
            </p>
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#53666f] px-4 text-sm font-black text-[#d8e2e7] hover:border-[#8edcff] disabled:opacity-40"
            disabled={loading}
            onClick={() => void load()}
            type="button"
          >
            <RefreshRounded sx={{ fontSize: 19 }} /> Atualizar oficina
          </button>
        </div>
      </section>

      {error && (
        <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-200" role="alert">{error}</p>
      )}

      {loading && (
        <div className="flex min-h-48 items-center justify-center" role="status">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#37464f] border-t-[#58cc02]" />
        </div>
      )}

      {!loading && !event && !error && (
        <section className="mt-6 rounded-3xl border border-dashed border-[#53666f] bg-[#1f2d33] p-8 text-center">
          <GroupsRounded className="text-[#78909b]" sx={{ fontSize: 44 }} />
          <h3 className="mt-3 text-xl font-black">Oficina ainda não vinculada a este período</h3>
          <p className="mt-2 text-sm text-[#a5b7c2]">Use o painel de equipes acima para preparar a oficina e criar os times.</p>
        </section>
      )}

      {!loading && summary && (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <MetricCard Icon={GroupsRounded} label="Participantes" value={summary.totalStudents} detail={`${summary.participatingStudents} já competiram`} color="text-cyan-300" />
            <MetricCard Icon={SchoolRounded} label="Equipes" value={summary.totalTeams} detail="Times ativos neste período" color="text-[#79e72e]" />
            <MetricCard Icon={MonetizationOnRounded} label="CapiCoins" value={NUMBER_FORMATTER.format(summary.totalPoints)} detail="Somente atividades da oficina" color="text-[#ffc800]" />
            <MetricCard Icon={TaskAltRounded} label="Rodadas" value={summary.totalAttempts} detail="Todas as repetições pontuadas" color="text-[#49c0f8]" />
            <MetricCard Icon={AutoGraphRounded} label="Média" value={`${summary.averageScore}%`} detail="Média das rodadas" color="text-violet-300" />
            <MetricCard Icon={TaskAltRounded} label="Acertos" value={summary.correctAnswers} detail={`${summary.wrongAnswers} respostas incorretas`} color="text-pink-300" />
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <article className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffc800]">Ranking por equipe</p>
              <h3 className="mt-1 text-2xl font-black">Disputa dos times</h3>
              <div className="mt-5 space-y-3">
                {dashboard.teamRanking.map((team) => (
                  <div className="flex items-center gap-4 rounded-2xl border border-[#37464f] bg-[#131f24] p-4" key={team.teamId}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffc800]/10 font-black text-[#ffc800]">{team.position}º</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-white">{team.teamName}</p>
                      <p className="text-xs text-[#78909b]">{team.memberCount} participante(s)</p>
                    </div>
                    <p className="font-black text-[#79e72e]">{NUMBER_FORMATTER.format(team.capiCoins)}</p>
                  </div>
                ))}
                {dashboard.teamRanking.length === 0 && <p className="py-6 text-center text-sm text-[#78909b]">Crie equipes para iniciar este ranking.</p>}
              </div>
            </article>

            <article className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#49c0f8]">Diagnóstico por atividade</p>
              <h3 className="mt-1 text-2xl font-black">Desempenho na oficina</h3>
              <div className="mt-5 space-y-3">
                {dashboard.activities.map((activity) => {
                  const difficultyRate = difficulty(activity);
                  return (
                    <div className="rounded-2xl border border-[#37464f] bg-[#131f24] p-4" key={activity.phaseNumber}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-[#78909b]">ATIVIDADE {activity.phaseNumber}</p>
                          <p className="mt-1 font-black text-white">{ACTIVITY_TITLES[activity.phaseNumber]}</p>
                          <p className="mt-1 text-xs text-[#78909b]">{activity.totalAttempts} rodadas · {activity.participants} participantes</p>
                        </div>
                        <p className="text-right text-sm text-[#a5b7c2]">Média <strong className="ml-1 text-white">{activity.averageScore}%</strong></p>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1f2d33]">
                        <div className={difficultyRate >= 50 ? 'h-full bg-[#ff4b4b]' : 'h-full bg-[#58cc02]'} style={{ width: `${difficultyRate}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-[#78909b]">Dificuldade observada: {difficultyRate}%</p>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>

          <section className="mt-8 rounded-3xl border border-[#37464f] bg-[#1f2d33] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#58cc02]">Participantes da oficina</p>
                <h3 className="mt-1 text-2xl font-black">Alunos por equipe</h3>
              </div>
              <input
                className="min-h-11 rounded-xl border border-[#53666f] bg-[#131f24] px-4 text-sm outline-none focus:border-[#49c0f8]"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar aluno, turma ou equipe"
                type="search"
                value={search}
              />
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-[#37464f] text-xs uppercase tracking-wider text-[#78909b]">
                  <tr><th className="px-3 py-3">Aluno</th><th className="px-3 py-3">Equipe</th><th className="px-3 py-3">Turma informada</th><th className="px-3 py-3">Rodadas</th><th className="px-3 py-3">Média</th><th className="px-3 py-3">Pontos</th><th className="px-3 py-3">Última atividade</th></tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr className="border-b border-[#37464f]/70 last:border-0" key={student.key}>
                      <td className="px-3 py-4 font-black text-white">{student.preferredName || student.fullName}</td>
                      <td className="px-3 py-4">{student.teamName}</td>
                      <td className="px-3 py-4">{student.className}</td>
                      <td className="px-3 py-4">{student.totalAttempts}</td>
                      <td className="px-3 py-4">{student.averageScore}%</td>
                      <td className="px-3 py-4 font-black text-[#79e72e]">{NUMBER_FORMATTER.format(student.totalPoints)}</td>
                      <td className="px-3 py-4 text-xs text-[#78909b]">{student.lastActivityAt ? DATE_FORMATTER.format(new Date(student.lastActivityAt)) : 'Sem atividade'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStudents.length === 0 && <p className="py-7 text-center text-sm text-[#78909b]">Nenhum participante encontrado.</p>}
          </section>
        </>
      )}
    </div>
  );
}
