export function BrandMark({ className = 'h-11 w-11', alt = 'Money Rank' }) {
  return <img src="/brand/money-rank-mark.svg" alt={alt} className={`shrink-0 object-contain ${className}`} />;
}

export function BrandWordmark({ className = 'h-7 w-auto', alt = 'Money Rank' }) {
  return <img src="/brand/money-rank-wordmark.svg" alt={alt} className={`object-contain ${className}`} />;
}

export default function BrandIdentity({ compact = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <BrandMark />
      {!compact && <BrandWordmark />}
    </span>
  );
}
