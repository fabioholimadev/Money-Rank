export function BrandMark({ className = 'h-11 w-11', alt = 'Money Rank' }) {
  return <img src="/brand/capi-mark.png" alt={alt} className={`shrink-0 object-contain ${className}`} />;
}

export default function BrandIdentity({ className = '' }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <BrandMark />
    </span>
  );
}
