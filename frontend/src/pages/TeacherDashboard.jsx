import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AutoGraph,
  Download,
  GroupsOutlined,
  MonetizationOn,
  Refresh,
  SchoolOutlined,
  TaskAlt,
  WarningAmber,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import CompetitionPeriodManager from '../components/CompetitionPeriodManager';
import TeacherDataChat from '../components/TeacherDataChat';
import TestModePanel from '../components/TestModePanel';
import SystemDiagnosticsPanel from '../components/SystemDiagnosticsPanel';
import { buildTeacherDashboardCsvExport } from '../lib/teacherSpreadsheetExport';
import {
  fetchTeacherDashboard,
  fetchTeacherPeriods,
} from '../services/teacherAnalyticsService';
import {
  createTeacherCompetitionPeriod,
  setTeacherCompetitionPeriodStatus,
  updateTeacherCompetitionPeriod,
} from '../services/teacherCompetitionService';

const PERIOD_STATUS = {
  DRAFT: { label: 'Rascunho', style: 'border-[#53666f] text-[#d8e2e7]' },
  SCHEDULED: { label: 'Agendado', style: 'border-cyan-500/30 text-cyan-300' },
  ACTIVE: { label: 'Ativo', style: 'border-emerald-500/30 text-emerald-300' },
  PAUSED: { label: 'Pausado', style: 'border-[#58cc02]/30 text-[#79e72e]' },
  CLOSED: { label: 'Encerrado', style: 'border-[#53666f] text-[#a5b7c2]' },
};

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR');
const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Fortaleza',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Fortaleza',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

function formatNumber(value) {
  return NUMBER_FORMATTER.format(Number(value) || 0);
}

function formatDate(value) {
  return value ? DATE_FORMATTER.format(new Date(value)) : '—';
}

function formatDateTime(value) {
  return value ? DATE_TIME_FORMATTER.format(new Date(value)) : 'Sem atividade';
}

function choosePeriodId(availablePeriods, currentId = '') {
  if (availablePeriods.some((period) => period.id === currentId)) {
    return currentId;
  }

  return (
    availablePeriods.find((period) => period.status === 'ACTIVE')?.id ||
    availablePeriods.find((period) => period.status === 'SCHEDULED')?.id ||
    availablePeriods[0]?.id ||
    ''
  );
}

function ProgressBar({ value, color = 'bg-[#58cc02]', label }) {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-[#a5b7c2]">{label}</span>
        <span className="font-black text-white">{safeValue}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#17262c]">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function SummaryCard({ Icon, label, value, detail, accent }) {
  return (
    <article className="rounded-2xl border border-[#37464f] bg-[#1f2d33] p-5">
      <div className={`mb-4 inline-flex rounded-xl p-2.5 ${accent}`}>
        <Icon sx={{ fontSize: 22 }} aria-hidden="true" />
      </div>
      <p className="text-2xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-bold text-[#d8e2e7]">{label}</p>
      <p className="mt-1 text-xs text-[#78909b]">{detail}</p>
    </article>
  );
}

function EmptyState({ title, message }) {
  return (
    <section className="mt-8 rounded-3xl border border-[#37464f] bg-[#1f2d33] p-8 text-center">
      <WarningAmber
        className="text-[#58cc02]"
        sx={{ fontSize: 42 }}
        aria-hidden="true"
      />
      <h2 className="mt-3 text-xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#a5b7c2]">
        {message}
      </p>
    </section>
  );
}

export default function TeacherDashboard() {
  const { aluno } = useAuth();
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedPeriod = periods.find(
    (period) => period.id === selectedPeriodId,
  );

  const loadPeriods = useCallback(async () => {
    try {
      const availablePeriods = await fetchTeacherPeriods();
      setPeriods(availablePeriods);
      setSelectedPeriodId((currentId) =>
        choosePeriodId(availablePeriods, currentId));
      setIsLoadingDashboard(availablePeriods.length > 0);
    } catch (error) {
      setPeriods([]);
      setSelectedPeriodId('');
      setErrorMessage(
        error?.message || 'Não foi possível consultar os períodos.',
      );
    } finally {
      setIsLoadingPeriods(false);
    }
  }, []);

  const loadDashboard = useCallback(async (periodId) => {
    try {
      setDashboard(await fetchTeacherDashboard(periodId));
    } catch (error) {
      setDashboard(null);
      setErrorMessage(
        error?.message || 'Não foi possível preparar o painel.',
      );
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchTeacherPeriods()
      .then((availablePeriods) => {
        if (!isActive) return;
        setErrorMessage('');
        setPeriods(availablePeriods);
        setSelectedPeriodId((currentId) =>
          choosePeriodId(availablePeriods, currentId));
        setIsLoadingDashboard(availablePeriods.length > 0);
      })
      .catch((error) => {
        if (!isActive) return;
        setPeriods([]);
        setSelectedPeriodId('');
        setErrorMessage(
          error?.message || 'Não foi possível consultar os períodos.',
        );
      })
      .finally(() => {
        if (isActive) setIsLoadingPeriods(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPeriodId) return undefined;
    let isActive = true;

    fetchTeacherDashboard(selectedPeriodId)
      .then((nextDashboard) => {
        if (!isActive) return;
        setErrorMessage('');
        setDashboard(nextDashboard);
      })
      .catch((error) => {
        if (!isActive) return;
        setDashboard(null);
        setErrorMessage(
          error?.message || 'Não foi possível preparar o painel.',
        );
      })
      .finally(() => {
        if (isActive) setIsLoadingDashboard(false);
      });

    return () => {
      isActive = false;
    };
  }, [selectedPeriodId]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR');

    return (dashboard?.students || []).filter((student) => {
      const matchesClass =
        classFilter === 'ALL' || student.className === classFilter;
      const matchesSearch =
        !normalizedSearch ||
        student.preferredName
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedSearch);
      return matchesClass && matchesSearch;
    });
  }, [classFilter, dashboard?.students, searchTerm]);

  const handleRefresh = async () => {
    setIsLoadingPeriods(true);
    setIsLoadingDashboard(Boolean(selectedPeriodId));
    setErrorMessage('');
    await loadPeriods();
    if (selectedPeriodId) await loadDashboard(selectedPeriodId);
  };

  const handlePeriodChanged = async (changedPeriod) => {
    setIsLoadingPeriods(true);
    setIsLoadingDashboard(true);
    setErrorMessage('');
    try {
      const availablePeriods = await fetchTeacherPeriods();
      const nextPeriodId = choosePeriodId(
        availablePeriods,
        changedPeriod?.id || selectedPeriodId,
      );
      setPeriods(availablePeriods);
      setSelectedPeriodId(nextPeriodId);
      if (nextPeriodId) await loadDashboard(nextPeriodId);
      else setDashboard(null);
    } catch (error) {
      setErrorMessage(
        error?.message || 'O período mudou, mas o painel não foi atualizado.',
      );
    } finally {
      setIsLoadingPeriods(false);
      setIsLoadingDashboard(false);
    }
  };

  const handleExport = () => {
    setErrorMessage('');
    try {
      const exported = buildTeacherDashboardCsvExport({
        period: selectedPeriod,
        dashboard,
      });
      const url = URL.createObjectURL(new Blob(
        [exported.content],
        { type: exported.mimeType },
      ));
      const link = document.createElement('a');
      link.href = url;
      link.download = exported.fileName;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (error) {
      setErrorMessage(
        error?.message || 'Não foi possível exportar os dados.',
      );
    }
  };

  const summary = dashboard?.summary;
  const statusConfig = selectedPeriod
    ? PERIOD_STATUS[selectedPeriod.status] || PERIOD_STATUS.DRAFT
    : PERIOD_STATUS.DRAFT;

  return (
    <div className="text-white">
      <div>
        <header className="flex flex-col gap-5 border-b border-[#37464f] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#58cc02]">
              Money Rank · Área pedagógica
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Visão da turma
            </h1>
            <p className="mt-2 text-sm text-[#a5b7c2]">
              Olá, {aluno?.nome}. Acompanhe participação, progresso e
              dificuldades com dados consolidados do Capi Bank.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={!selectedPeriod || !dashboard || isLoadingDashboard}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-400/30 px-4 text-sm font-bold text-emerald-300 transition hover:border-emerald-300 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download sx={{ fontSize: 18 }} aria-hidden="true" />
              Exportar planilha
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoadingPeriods || isLoadingDashboard}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#53666f] px-4 text-sm font-bold text-[#d8e2e7] transition hover:border-[#58cc02]/50 hover:text-[#79e72e] disabled:opacity-50"
            >
              <Refresh sx={{ fontSize: 18 }} aria-hidden="true" />
              Atualizar
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 rounded-2xl border border-[#37464f] bg-[#1f2d33] p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-[#78909b]">
              Período analisado
            </span>
            <select
              value={selectedPeriodId}
              onChange={(event) => {
                setIsLoadingDashboard(true);
                setErrorMessage('');
                setSelectedPeriodId(event.target.value);
              }}
              disabled={isLoadingPeriods || periods.length === 0}
              className="min-h-12 w-full rounded-xl border border-[#53666f] bg-[#131f24] px-4 text-sm font-bold text-white outline-none transition focus:border-[#58cc02] disabled:opacity-50"
            >
              {periods.length === 0 && <option value="">Nenhum período</option>}
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} · {formatDate(period.startsAt)} a{' '}
                  {formatDate(period.endsAt)}
                  {period.recognizedByApi ? ' · reconhecido pela API' : ''}
                </option>
              ))}
            </select>
          </label>

          {selectedPeriod && (
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${statusConfig.style}`}
              >
                {statusConfig.label}
              </span>
              <span className="text-xs text-[#78909b]">
                Horário de Fortaleza
              </span>
              <CompetitionPeriodManager
                periods={periods}
                selectedPeriod={selectedPeriod}
                onCreate={createTeacherCompetitionPeriod}
                onUpdate={updateTeacherCompetitionPeriod}
                onStatusChange={setTeacherCompetitionPeriodStatus}
                onChanged={handlePeriodChanged}
              />
            </div>
          )}
          {!selectedPeriod && !isLoadingPeriods && (
            <div className="lg:justify-self-end">
              <CompetitionPeriodManager
                periods={periods}
                selectedPeriod={null}
                onCreate={createTeacherCompetitionPeriod}
                onUpdate={updateTeacherCompetitionPeriod}
                onStatusChange={setTeacherCompetitionPeriodStatus}
                onChanged={handlePeriodChanged}
              />
            </div>
          )}
        </section>

        <TestModePanel />

        <SystemDiagnosticsPanel />

        <TeacherDataChat
          key={selectedPeriodId || 'no-period'}
          periodId={selectedPeriodId}
        />

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-300"
          >
            {errorMessage}
          </div>
        )}

        {(isLoadingPeriods || isLoadingDashboard) && (
          <div role="status" className="flex min-h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#53666f] border-t-amber-400" />
          </div>
        )}

        {!isLoadingPeriods && periods.length === 0 && !errorMessage && (
          <EmptyState
            title="Nenhum período cadastrado"
            message="Crie ou agende uma disputa para que o painel consiga delimitar os dados analisados."
          />
        )}

        {!isLoadingDashboard && summary && (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <SummaryCard
                Icon={GroupsOutlined}
                label="Alunos cadastrados"
                value={formatNumber(summary.totalStudents)}
                detail="DSA e DSB"
                accent="bg-cyan-400/10 text-cyan-300"
              />
              <SummaryCard
                Icon={AutoGraph}
                label="Participação"
                value={`${summary.participationRate}%`}
                detail={`${summary.participatingStudents} alunos no período`}
                accent="bg-emerald-400/10 text-emerald-300"
              />
              <SummaryCard
                Icon={MonetizationOn}
                label="Pontos competitivos"
                value={formatNumber(summary.totalPoints)}
                detail="Créditos válidos do período"
                accent="bg-[#58cc02]/10 text-[#79e72e]"
              />
              <SummaryCard
                Icon={TaskAlt}
                label="Tentativas"
                value={formatNumber(summary.totalAttempts)}
                detail={`${summary.approvalRate}% aprovadas`}
                accent="bg-[#49c0f8]/10 text-[#7ed5fb]"
              />
              <SummaryCard
                Icon={SchoolOutlined}
                label="Média das notas"
                value={`${summary.averageScore}%`}
                detail="Tentativas deste período"
                accent="bg-blue-400/10 text-blue-300"
              />
              <SummaryCard
                Icon={TaskAlt}
                label="Trilha concluída"
                value={formatNumber(summary.completedTrailStudents)}
                detail="Progresso geral, não só do período"
                accent="bg-pink-400/10 text-pink-300"
              />
            </section>

            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#58cc02]">
                  Comparação coletiva
                </p>
                <h2 className="mt-1 text-2xl font-black">3º DSA x 3º DSB</h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {dashboard.classes.map((classMetric) => (
                  <article
                    key={classMetric.className}
                    className="rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-black">{classMetric.className}</p>
                        <p className="mt-1 text-xs text-[#78909b]">
                          {classMetric.participatingStudents} de{' '}
                          {classMetric.registeredStudents} participaram
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#79e72e]">
                          {formatNumber(classMetric.totalPoints)}
                        </p>
                        <p className="text-xs text-[#78909b]">pontos</p>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <ProgressBar
                        value={classMetric.participationRate}
                        label="Participação no período"
                        color="bg-emerald-400"
                      />
                      <ProgressBar
                        value={classMetric.progressPercent}
                        label="Progresso geral da trilha"
                        color="bg-cyan-400"
                      />
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#37464f] pt-5 text-sm">
                      <div>
                        <p className="text-[#78909b]">Nota média</p>
                        <p className="mt-1 font-black">{classMetric.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-[#78909b]">Tentativas</p>
                        <p className="mt-1 font-black">
                          {formatNumber(classMetric.totalAttempts)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#37464f] bg-[#1f2d33] p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#7ed5fb]">
                Diagnóstico por atividade
              </p>
              <h2 className="mt-1 text-2xl font-black">Onde a turma encontra dificuldade</h2>
              <p className="mt-2 text-sm text-[#78909b]">
                A dificuldade representa a proporção de respostas erradas entre todas as respostas registradas no período.
              </p>

              <div className="mt-6 space-y-4">
                {dashboard.phases.map((phase) => (
                  <article
                    key={phase.phaseNumber}
                    className="grid gap-4 rounded-2xl border border-[#37464f] bg-[#131f24] p-4 lg:grid-cols-[minmax(220px,1fr)_minmax(260px,1.4fr)_auto] lg:items-center"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#78909b]">
                        Fase {phase.phaseNumber}
                      </p>
                      <h3 className="mt-1 font-black">{phase.title}</h3>
                      <p className="mt-1 text-xs text-[#78909b]">
                        {phase.studentsCompleted} concluíram · {phase.totalAttempts}{' '}
                        tentativas
                      </p>
                    </div>
                    <ProgressBar
                      value={phase.difficultyRate}
                      label="Dificuldade observada"
                      color={
                        phase.difficultyRate >= 50
                          ? 'bg-red-400'
                          : phase.difficultyRate >= 30
                            ? 'bg-[#58cc02]'
                            : 'bg-emerald-400'
                      }
                    />
                    <div className="flex gap-6 text-sm lg:text-right">
                      <div>
                        <p className="text-[#78909b]">Média</p>
                        <p className="font-black">{phase.averageScore}%</p>
                      </div>
                      <div>
                        <p className="text-[#78909b]">Aprovação</p>
                        <p className="font-black">{phase.approvalRate}%</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#37464f] bg-[#1f2d33] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                    Acompanhamento pedagógico
                  </p>
                  <h2 className="mt-1 text-2xl font-black">Alunos</h2>
                  <p className="mt-2 text-sm text-[#78909b]">
                    Nomes são visíveis somente para professor autorizado; e-mail e UID não são consultados.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar aluno"
                    className="min-h-11 rounded-xl border border-[#53666f] bg-[#131f24] px-4 text-sm outline-none focus:border-cyan-400"
                  />
                  <select
                    value={classFilter}
                    onChange={(event) => setClassFilter(event.target.value)}
                    className="min-h-11 rounded-xl border border-[#53666f] bg-[#131f24] px-4 text-sm font-bold outline-none focus:border-cyan-400"
                  >
                    <option value="ALL">Todas as turmas</option>
                    <option value="3º DSA">3º DSA</option>
                    <option value="3º DSB">3º DSB</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[940px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#37464f] text-xs uppercase tracking-wider text-[#78909b]">
                      <th className="px-3 py-3">Aluno</th>
                      <th className="px-3 py-3">Turma</th>
                      <th className="px-3 py-3">Progresso geral</th>
                      <th className="px-3 py-3">Tentativas</th>
                      <th className="px-3 py-3">Nota média</th>
                      <th className="px-3 py-3">Erros</th>
                      <th className="px-3 py-3">Saldo</th>
                      <th className="px-3 py-3">Pontos</th>
                      <th className="px-3 py-3">Atividade recente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.key}
                        className="border-b border-[#37464f]/70 text-[#d8e2e7] last:border-0"
                      >
                        <td className="px-3 py-4 font-bold text-white">
                          {student.preferredName}
                        </td>
                        <td className="px-3 py-4">{student.className}</td>
                        <td className="px-3 py-4">
                          <span className="font-black">{student.progressPercent}%</span>
                          <span className="ml-2 text-xs text-[#78909b]">
                            Fase {student.currentPhase}
                          </span>
                        </td>
                        <td className="px-3 py-4">{student.totalAttempts}</td>
                        <td className="px-3 py-4">{student.averageScore}%</td>
                        <td className="px-3 py-4">{student.wrongAnswers}</td>
                        <td className="px-3 py-4">
                          {formatNumber(student.capiCoins)}
                        </td>
                        <td className="px-3 py-4 font-black text-[#79e72e]">
                          {formatNumber(student.totalPoints)}
                        </td>
                        <td className="px-3 py-4 text-xs text-[#78909b]">
                          {formatDateTime(student.lastActivityAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <p className="py-8 text-center text-sm text-[#78909b]">
                  Nenhum aluno corresponde aos filtros selecionados.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
