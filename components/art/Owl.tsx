/** جغد رئیس — هم خاله‌ی گرگ، هم بالادست جوجه‌تیغی. تنها موجود حرفه‌ای پرونده. */
export function Owl({
  className = '',
  title = 'جغد رئیس',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 120 130" role="img" aria-label={title} className={className}>
      {/* بدن */}
      <path
        d="M60 16 C90 16 106 44 106 76 C106 104 86 118 60 118 C34 118 14 104 14 76 C14 44 30 16 60 16 Z"
        fill="var(--color-kaj)"
      />
      {/* شکم روشن */}
      <path
        d="M60 62 C76 62 86 78 86 94 C86 108 74 116 60 116 C46 116 34 108 34 94 C34 78 44 62 60 62 Z"
        fill="var(--color-mahtab)"
        opacity="0.9"
      />
      {/* شاخک‌ها */}
      <path d="M26 30 L34 8 L48 26 Z" fill="var(--color-kaj)" />
      <path d="M94 30 L86 8 L72 26 Z" fill="var(--color-kaj)" />
      {/* چشم‌ها */}
      <circle cx="42" cy="52" r="18" fill="var(--color-mahtab)" />
      <circle cx="78" cy="52" r="18" fill="var(--color-mahtab)" />
      <circle cx="42" cy="52" r="7" fill="var(--color-shab)" />
      <circle cx="78" cy="52" r="7" fill="var(--color-shab)" />
      {/* نوک */}
      <path d="M60 58 L67 70 L53 70 Z" fill="var(--color-tigh)" />
      {/* عینک مدیریت */}
      <g stroke="var(--color-jooheh)" strokeWidth="2.4" fill="none">
        <circle cx="42" cy="52" r="19" />
        <circle cx="78" cy="52" r="19" />
        <path d="M61 52 h-2" />
      </g>
    </svg>
  );
}
