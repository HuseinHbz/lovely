/** ماه جلد پرونده. هاله با گرادیان رادیال، بدون فایل تصویری. */
export function Moon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="moon-halo">
          <stop offset="45%" stopColor="var(--color-mahtab)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--color-mahtab)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#moon-halo)" />
      <circle cx="100" cy="100" r="42" fill="var(--color-mahtab)" />
      <circle cx="86" cy="88" r="7" fill="var(--color-jooheh)" opacity="0.28" />
      <circle cx="112" cy="106" r="10" fill="var(--color-jooheh)" opacity="0.22" />
      <circle cx="96" cy="118" r="5" fill="var(--color-jooheh)" opacity="0.2" />
    </svg>
  );
}
