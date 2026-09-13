export function StudioField({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#a5b7c2]">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-[#78909b]">{hint}</span>}
    </label>
  );
}

export const inputClassName =
  'min-h-11 w-full rounded-xl border border-[#53666f] bg-[#131f24] px-3 py-2 text-sm text-white outline-none transition focus:border-[#58cc02] disabled:opacity-60';

export const textareaClassName =
  'min-h-24 w-full resize-y rounded-xl border border-[#53666f] bg-[#131f24] px-3 py-2 text-sm leading-6 text-white outline-none transition focus:border-[#58cc02] disabled:opacity-60';

export function StudioSection({ title, description, children, accent = 'amber' }) {
  const accentClass = accent === 'cyan' ? 'text-cyan-300' : 'text-[#79e72e]';
  return (
    <section className="rounded-2xl border border-[#37464f] bg-[#1f2d33] p-4 sm:p-5">
      <h3 className={`font-black ${accentClass}`}>{title}</h3>
      {description && (
        <p className="mt-1 text-xs leading-5 text-[#78909b]">{description}</p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
