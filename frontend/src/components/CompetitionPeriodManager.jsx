import { useMemo, useRef, useState } from 'react';
import {
  Add,
  CalendarMonth,
  Close,
  EditCalendar,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopCircleOutlined,
} from '@mui/icons-material';

const STATUS_LABELS = Object.freeze({
  DRAFT: 'Rascunho',
  SCHEDULED: 'Agendado',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  CLOSED: 'Encerrado',
});

const ACTIONS_BY_STATUS = Object.freeze({
  DRAFT: ['SCHEDULED', 'ACTIVE', 'CLOSED'],
  SCHEDULED: ['ACTIVE', 'PAUSED', 'CLOSED'],
  ACTIVE: ['PAUSED', 'CLOSED'],
  PAUSED: ['ACTIVE', 'CLOSED'],
  CLOSED: [],
});

function toFortalezaInput(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function toIsoTimestamp(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const timestamp = new Date(`${value}:00-03:00`);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
}

function initialForm(period) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return {
    name: period?.name || '',
    startsAt: toFortalezaInput(period?.startsAt) || `${today}T07:30`,
    endsAt: toFortalezaInput(period?.endsAt) || `${today}T08:10`,
  };
}

function replaceDate(value, date, fallbackTime) {
  return `${date}T${value?.slice(11, 16) || fallbackTime}`;
}

function replaceTime(value, time) {
  return `${value?.slice(0, 10) || ''}T${time}`;
}

function actionPresentation(status) {
  if (status === 'ACTIVE') {
    return { label: 'Ativar ou retomar', Icon: PlayCircleOutlined };
  }
  if (status === 'PAUSED') {
    return { label: 'Pausar', Icon: PauseCircleOutlined };
  }
  if (status === 'CLOSED') {
    return { label: 'Encerrar', Icon: StopCircleOutlined };
  }
  return { label: 'Agendar', Icon: CalendarMonth };
}

export default function CompetitionPeriodManager({
  periods,
  selectedPeriod,
  onCreate,
  onUpdate,
  onStatusChange,
  onChanged,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('edit');
  const [form, setForm] = useState(() => initialForm(selectedPeriod));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const triggerRef = useRef(null);

  const currentPeriod = mode === 'edit' ? selectedPeriod : null;
  const isReadOnly = currentPeriod?.status === 'CLOSED';
  const availableActions = useMemo(
    () => ACTIONS_BY_STATUS[currentPeriod?.status] || [],
    [currentPeriod?.status],
  );

  const openManager = () => {
    setMode(selectedPeriod ? 'edit' : 'create');
    setForm(initialForm(selectedPeriod));
    setMessage('');
    setErrorMessage('');
    setConfirmClose(false);
    setIsOpen(true);
  };

  const closeManager = () => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setForm(initialForm(nextMode === 'edit' ? selectedPeriod : null));
    setMessage('');
    setErrorMessage('');
    setConfirmClose(false);
  };

  const validatedInput = () => {
    const name = form.name.trim().replace(/\s+/g, ' ');
    const startsAt = toIsoTimestamp(form.startsAt);
    const endsAt = toIsoTimestamp(form.endsAt);
    if (name.length < 3 || name.length > 80) {
      throw new Error('Informe um nome entre 3 e 80 caracteres.');
    }
    if (!startsAt || !endsAt || Date.parse(startsAt) >= Date.parse(endsAt)) {
      throw new Error('O encerramento deve acontecer depois do início.');
    }
    return { name, startsAt, endsAt };
  };

  const runAction = async (action, successMessage) => {
    setIsSaving(true);
    setMessage('');
    setErrorMessage('');
    try {
      const changed = await action();
      setMessage(successMessage);
      setConfirmClose(false);
      await onChanged?.(changed);
    } catch (error) {
      setErrorMessage(
        error?.message || 'Não foi possível alterar o período.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    let input;
    try {
      input = validatedInput();
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }

    if (mode === 'create') {
      void runAction(
        () => onCreate({ ...input, status: 'DRAFT' }),
        'Período criado como rascunho.',
      );
      return;
    }
    void runAction(
      () => onUpdate({ periodId: currentPeriod.id, ...input }),
      'Nome, data e horários atualizados.',
    );
  };

  const handleStatus = (status) => {
    if (status === 'CLOSED' && !confirmClose) {
      setConfirmClose(true);
      setMessage('');
      setErrorMessage('');
      return;
    }
    const presentation = actionPresentation(status);
    void runAction(
      () => onStatusChange({ periodId: currentPeriod.id, status }),
      `${presentation.label.replace(' ou retomar', '')}: alteração concluída.`,
    );
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openManager}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-400/30 px-4 text-sm font-black text-amber-300 transition hover:border-amber-300 hover:text-amber-200"
      >
        <EditCalendar sx={{ fontSize: 19 }} aria-hidden="true" />
        Gerenciar períodos
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) closeManager();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="period-manager-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !isSaving) closeManager();
            }}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
                  Competição
                </p>
                <h2 id="period-manager-title" className="mt-1 text-2xl font-black">
                  Gerenciar períodos
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Ajuste a janela, pause ou encerre a competição sem apagar o
                  histórico já registrado.
                </p>
              </div>
              <button
                type="button"
                onClick={closeManager}
                disabled={isSaving}
                autoFocus
                aria-label="Fechar gerenciamento de períodos"
                className="rounded-xl border border-slate-700 p-2 text-slate-400 transition hover:text-white disabled:opacity-50"
              >
                <Close aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-950 p-1.5">
              <button
                type="button"
                onClick={() => switchMode('edit')}
                disabled={!selectedPeriod}
                className={`min-h-10 rounded-xl text-sm font-black transition ${
                  mode === 'edit'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                } disabled:opacity-40`}
              >
                Período selecionado
              </button>
              <button
                type="button"
                onClick={() => switchMode('create')}
                className={`min-h-10 rounded-xl text-sm font-black transition ${
                  mode === 'create'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Add sx={{ mr: 0.5, fontSize: 17 }} aria-hidden="true" />
                Novo período
              </button>
            </div>

            {mode === 'edit' && periods.length > 1 && (
              <p className="mt-3 text-xs text-slate-500">
                Para administrar outro período, feche esta janela e selecione-o
                na caixa do painel.
              </p>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Nome do período
                </span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({
                    ...current,
                    name: event.target.value.slice(0, 80),
                  }))}
                  disabled={isSaving || isReadOnly}
                  placeholder="Ex.: Disputa de agosto"
                  className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-bold outline-none transition focus:border-amber-400 disabled:opacity-50"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <fieldset className="rounded-2xl border border-slate-700 p-4">
                  <legend className="px-2 text-xs font-black uppercase tracking-wider text-amber-300">
                    Início · Fortaleza
                  </legend>
                  <div className="mt-1 grid grid-cols-[1fr_8rem] gap-3">
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-black uppercase text-slate-500">Data</span>
                      <input
                        type="date"
                        value={form.startsAt.slice(0, 10)}
                        onChange={(event) => setForm((current) => ({ ...current, startsAt: replaceDate(current.startsAt, event.target.value, '07:30') }))}
                        disabled={isSaving || isReadOnly}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-black uppercase text-slate-500">Hora</span>
                      <input
                        type="time"
                        step="60"
                        value={form.startsAt.slice(11, 16)}
                        onChange={(event) => setForm((current) => ({ ...current, startsAt: replaceTime(current.startsAt, event.target.value) }))}
                        disabled={isSaving || isReadOnly}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                      />
                    </label>
                  </div>
                </fieldset>
                <fieldset className="rounded-2xl border border-slate-700 p-4">
                  <legend className="px-2 text-xs font-black uppercase tracking-wider text-amber-300">
                    Encerramento · Fortaleza
                  </legend>
                  <div className="mt-1 grid grid-cols-[1fr_8rem] gap-3">
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-black uppercase text-slate-500">Data</span>
                      <input
                        type="date"
                        value={form.endsAt.slice(0, 10)}
                        onChange={(event) => setForm((current) => ({ ...current, endsAt: replaceDate(current.endsAt, event.target.value, '08:10') }))}
                        disabled={isSaving || isReadOnly}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-black uppercase text-slate-500">Hora</span>
                      <input
                        type="time"
                        step="60"
                        value={form.endsAt.slice(11, 16)}
                        onChange={(event) => setForm((current) => ({ ...current, endsAt: replaceTime(current.endsAt, event.target.value) }))}
                        disabled={isSaving || isReadOnly}
                        className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                      />
                    </label>
                  </div>
                </fieldset>
              </div>

              {!isReadOnly && (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-400 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                  {mode === 'create' ? 'Criar rascunho' : 'Salvar nome e datas'}
                </button>
              )}
            </form>

            {mode === 'edit' && currentPeriod && (
              <div className="mt-6 border-t border-slate-800 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Funcionamento atual
                    </p>
                    <p className="mt-1 font-black text-white">
                      {STATUS_LABELS[currentPeriod.status] || currentPeriod.status}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableActions.map((status) => {
                      const { label, Icon } = actionPresentation(status);
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatus(status)}
                          disabled={isSaving}
                          className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-xs font-black transition disabled:opacity-50 ${
                            status === 'CLOSED'
                              ? 'border-red-400/30 text-red-300 hover:border-red-300'
                              : 'border-slate-700 text-slate-300 hover:border-amber-400/50 hover:text-amber-200'
                          }`}
                        >
                          <Icon sx={{ fontSize: 18 }} aria-hidden="true" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {confirmClose && (
                  <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4">
                    <p className="text-sm font-bold text-red-200">
                      Encerrar é definitivo para este período. Os resultados
                      permanecem no histórico, mas ele não poderá ser retomado.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatus('CLOSED')}
                        disabled={isSaving}
                        className="min-h-10 rounded-xl bg-red-400 px-4 text-xs font-black text-slate-950 disabled:opacity-50"
                      >
                        Confirmar encerramento
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClose(false)}
                        disabled={isSaving}
                        className="min-h-10 rounded-xl border border-slate-700 px-4 text-xs font-bold text-slate-300 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div aria-live="polite" className="mt-4 min-h-6">
              {message && <p className="text-sm font-bold text-emerald-300">{message}</p>}
              {errorMessage && (
                <p role="alert" className="text-sm font-bold text-red-300">
                  {errorMessage}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
