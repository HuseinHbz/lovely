'use client';

/**
 * پاندا (نازو) — بازپرس پرونده، با عینک بازجویی.
 *
 * تخم‌مرغ عید پاک: پنج بار کلیک، یک دیالوگ مخفی. خود دیالوگ در فاز ۶ سیم‌کشی
 * می‌شود؛ اینجا فقط `onClick` بیرون داده می‌شود تا کامپوننت خالص بماند.
 */
export function Panda({
  className = '',
  title = 'پاندا',
  onClick,
}: {
  className?: string;
  title?: string;
  onClick?: (() => void) | undefined;
}) {
  const interactive = onClick !== undefined;

  const art = (
    <svg viewBox="0 0 120 130" role="img" aria-label={title} className={className}>
      {/* گوش‌ها */}
      <circle cx="26" cy="30" r="15" fill="var(--color-shab)" />
      <circle cx="94" cy="30" r="15" fill="var(--color-shab)" />
      {/* سر */}
      <ellipse cx="60" cy="66" rx="44" ry="40" fill="var(--color-mahtab)" />
      {/* لکه‌های چشم */}
      <ellipse
        cx="42"
        cy="60"
        rx="14"
        ry="16"
        fill="var(--color-shab)"
        transform="rotate(-12 42 60)"
      />
      <ellipse
        cx="78"
        cy="60"
        rx="14"
        ry="16"
        fill="var(--color-shab)"
        transform="rotate(12 78 60)"
      />
      <circle cx="43" cy="60" r="4.4" fill="var(--color-mahtab)" />
      <circle cx="77" cy="60" r="4.4" fill="var(--color-mahtab)" />
      {/* پوزه */}
      <ellipse cx="60" cy="84" rx="8" ry="5.5" fill="var(--color-shab)" />
      <path
        d="M52 92 q8 8 16 0"
        stroke="var(--color-shab)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* عینک بازپرسی */}
      <g stroke="var(--color-tigh)" strokeWidth="2.6" fill="none">
        <circle cx="42" cy="60" r="18" />
        <circle cx="78" cy="60" r="18" />
        <path d="M60 60 h0" />
        <path d="M60.5 58 q-0.5 4 -0.5 4" />
        <path d="M24 56 l-10 -6" />
        <path d="M96 56 l10 -6" />
      </g>
    </svg>
  );

  if (!interactive) return art;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title} — شاید چیزی بداند`}
      className="cursor-pointer rounded-md"
    >
      {art}
    </button>
  );
}
