export function BrandMark({ className = 'h-11 w-11', alt = 'Money Rank' }) {
  return <img src="/brand/capi-mark.png" alt={alt} className={`shrink-0 object-contain ${className}`} />;
}

export function BrandName({ className = '' }) {
  return (
    <span
      className={`whitespace-nowrap font-black uppercase leading-none tracking-[-0.04em] ${className}`}
      aria-label="Money Rank"
    >
      <span className="text-white">Money</span>
      <span className="text-[#58cc02]">Rank</span>
    </span>
  );
}

export default function BrandIdentity({
  className = '',
  markClassName = 'h-11 w-11',
  nameClassName = 'text-xl',
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <BrandMark className={markClassName} alt="" />
      <BrandName className={nameClassName} />
    </span>
  );
}
