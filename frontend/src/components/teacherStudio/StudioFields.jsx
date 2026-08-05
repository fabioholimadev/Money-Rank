export function StudioField({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export const inputClassName =
  'min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-400 disabled:opacity-60';

export const textareaClassName =
  'min-h-24 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-6 text-white outline-none transition focus:border-amber-400 disabled:opacity-60';

export function StudioSection({ title, description, children, accent = 'amber' }) {
  const accentClass = accent === 'cyan' ? 'text-cyan-300' : 'text-amber-300';
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <h3 className={`font-black ${accentClass}`}>{title}</h3>
      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
