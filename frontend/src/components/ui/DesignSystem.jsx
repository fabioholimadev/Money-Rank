export function PageHeader({ eyebrow, title, description, icon, actions, className = '' }) {
  return (
    <header className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && <p className="mr-eyebrow">{eyebrow}</p>}
        <h1 className="mt-1 flex items-center gap-3 text-3xl font-black tracking-tight text-[#f1f7fb] sm:text-4xl">
          {icon && <span className="text-[#58cc02]">{icon}</span>}
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#a5b7c2]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function SectionHeader({ title, action, eyebrow }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mr-eyebrow">{eyebrow}</p>}
        <h2 className="text-xl font-black text-[#f1f7fb]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Surface({ as: Element = 'section', className = '', children, ...props }) {
  return <Element className={`mr-surface ${className}`} {...props}>{children}</Element>;
}

export function ProgressBar({ value = 0, label, valueLabel, color = '#58cc02' }) {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <div>
      {(label || valueLabel) && (
        <div className="mb-2 flex items-center justify-between gap-4 text-xs font-black">
          <span className="text-[#a5b7c2]">{label}</span>
          <span className="text-[#f1f7fb]">{valueLabel ?? `${safeValue}%`}</span>
        </div>
      )}
      <div className="h-4 overflow-hidden rounded-full bg-[#0c171c] p-1" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={safeValue}>
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${safeValue}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <Surface className="p-8 text-center">
      {icon && <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17262c] text-[#a5b7c2]">{icon}</div>}
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#a5b7c2]">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Surface>
  );
}

export function LoadingState({ label = 'Carregando...' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status">
      <span className="h-11 w-11 animate-spin rounded-full border-4 border-[#37464f] border-t-[#58cc02]" />
      <span className="text-sm font-black text-[#a5b7c2]">{label}</span>
    </div>
  );
}
