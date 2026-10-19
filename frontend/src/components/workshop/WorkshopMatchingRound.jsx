import DeleteSweepRounded from '@mui/icons-material/DeleteSweepRounded';
import LinkRounded from '@mui/icons-material/LinkRounded';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const PAIR_COLORS = ['#58cc02', '#49c0f8', '#ffc800', '#ff86d0'];

export default function WorkshopMatchingRound({ answers, disabled, items, onChange }) {
  const boardRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [lines, setLines] = useState([]);
  const options = items[0]?.options || [];

  const itemIndexById = useMemo(() => new Map(
    items.map((item, index) => [item.itemId, index]),
  ), [items]);

  const updateLines = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const boardBox = board.getBoundingClientRect();
    const nextLines = Object.entries(answers).flatMap(([itemId, optionIndex]) => {
      const itemIndex = itemIndexById.get(itemId);
      const left = leftRefs.current[itemIndex];
      const right = rightRefs.current[optionIndex];
      if (!left || !right) return [];
      const leftBox = left.getBoundingClientRect();
      const rightBox = right.getBoundingClientRect();
      return [{
        itemId,
        optionIndex,
        color: PAIR_COLORS[itemIndex % PAIR_COLORS.length],
        x1: leftBox.right - boardBox.left,
        y1: leftBox.top + (leftBox.height / 2) - boardBox.top,
        x2: rightBox.left - boardBox.left,
        y2: rightBox.top + (rightBox.height / 2) - boardBox.top,
      }];
    });
    setLines(nextLines);
  }, [answers, itemIndexById]);

  useEffect(() => {
    updateLines();
    const observer = typeof ResizeObserver === 'function'
      ? new ResizeObserver(updateLines)
      : null;
    if (boardRef.current) observer?.observe(boardRef.current);
    window.addEventListener('resize', updateLines);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines]);

  function connect(optionIndex) {
    if (!selectedItemId || disabled) return;
    const next = { ...answers };
    Object.entries(next).forEach(([itemId, linkedOption]) => {
      if (linkedOption === optionIndex && itemId !== selectedItemId) delete next[itemId];
    });
    next[selectedItemId] = optionIndex;
    onChange(next);
    setSelectedItemId('');
  }

  function clearConnections() {
    onChange({});
    setSelectedItemId('');
  }

  return (
    <section className="workshop-question-in rounded-3xl border border-[#37464f] bg-[#1f2d33] p-4 sm:p-7">
      <div className="flex flex-col gap-3 border-b border-[#37464f] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#49c0f8]">Desafio de conexões</p>
          <h2 className="mt-1 text-xl font-black text-white">Forme os quatro pares corretos</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a5b7c2]">
            Selecione um conceito à esquerda e depois sua explicação à direita. Cada cor e linha representa um par.
          </p>
        </div>
        <button
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#53666f] px-3 text-xs font-black text-[#d8e2e7] transition hover:border-[#ff9600] hover:text-[#ffd39a] disabled:opacity-40"
          disabled={disabled || Object.keys(answers).length === 0}
          onClick={clearConnections}
          type="button"
        >
          <DeleteSweepRounded sx={{ fontSize: 18 }} /> Limpar ligações
        </button>
      </div>

      <div className="relative mt-6" ref={boardRef}>
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
          {lines.map((line) => {
            const curve = Math.max((line.x2 - line.x1) * 0.45, 24);
            return (
              <path
                className="workshop-connection-line"
                d={`M ${line.x1} ${line.y1} C ${line.x1 + curve} ${line.y1}, ${line.x2 - curve} ${line.y2}, ${line.x2} ${line.y2}`}
                fill="none"
                key={`${line.itemId}-${line.optionIndex}`}
                pathLength="1"
                stroke={line.color}
                strokeLinecap="round"
                strokeWidth="4"
              />
            );
          })}
        </svg>

        <div className="grid grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)] gap-y-4 sm:grid-cols-[minmax(0,1fr)_minmax(72px,0.2fr)_minmax(0,1fr)]">
          <p className="px-2 text-xs font-black uppercase tracking-widest text-[#78909b]">Conceitos</p>
          <span />
          <p className="px-2 text-xs font-black uppercase tracking-widest text-[#78909b]">Explicações</p>

          <div className="col-start-1 row-start-2 grid gap-4">
            {items.map((item, index) => {
              const connected = Number.isInteger(answers[item.itemId]);
              const active = selectedItemId === item.itemId;
              const color = PAIR_COLORS[index % PAIR_COLORS.length];
              return (
                <button
                  aria-pressed={active}
                  className={`relative z-20 min-h-24 rounded-2xl border-2 bg-[#17262c] p-3 text-left text-xs font-black leading-5 text-white shadow-[0_4px_0_#0c1519] transition hover:-translate-y-0.5 sm:p-4 sm:text-sm ${active ? 'scale-[1.02]' : ''}`}
                  disabled={disabled}
                  key={item.itemId}
                  onClick={() => setSelectedItemId(item.itemId)}
                  ref={(node) => { leftRefs.current[index] = node; }}
                  style={{ borderColor: active || connected ? color : '#53666f' }}
                  type="button"
                >
                  <span className="mb-2 block text-[10px] uppercase tracking-widest" style={{ color }}>
                    {connected ? 'Par conectado' : active ? 'Agora escolha à direita' : `Item ${index + 1}`}
                  </span>
                  {item.prompt}
                  <span className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-[#131f24]" style={{ borderColor: active || connected ? color : '#53666f' }}>
                    <LinkRounded sx={{ fontSize: 14 }} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="col-start-3 row-start-2 grid gap-4">
            {options.map((option, optionIndex) => {
              const connection = Object.entries(answers).find(([, linked]) => linked === optionIndex);
              const linkedItemIndex = connection ? itemIndexById.get(connection[0]) : -1;
              const color = linkedItemIndex >= 0 ? PAIR_COLORS[linkedItemIndex % PAIR_COLORS.length] : '#53666f';
              return (
                <button
                  className="relative z-20 min-h-24 rounded-2xl border-2 bg-[#17262c] p-3 text-left text-xs font-bold leading-5 text-[#d8e2e7] shadow-[0_4px_0_#0c1519] transition hover:-translate-y-0.5 hover:border-[#8edcff] disabled:opacity-70 sm:p-4 sm:text-sm"
                  disabled={disabled || !selectedItemId}
                  key={`${optionIndex}-${option}`}
                  onClick={() => connect(optionIndex)}
                  ref={(node) => { rightRefs.current[optionIndex] = node; }}
                  style={{ borderColor: color }}
                  type="button"
                >
                  <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 bg-[#131f24]" style={{ borderColor: color }} />
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#131f24] px-4 py-3 text-sm">
        <span className="text-[#a5b7c2]">Progresso das conexões</span>
        <strong className="text-[#79e72e]">{Object.keys(answers).length} de {items.length} pares</strong>
      </div>
    </section>
  );
}
