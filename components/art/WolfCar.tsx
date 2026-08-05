/**
 * شاسی‌بلند مشکی گرگ.
 *
 * راهنمای شخصیت می‌گوید ماشین هم شخصیت دارد و داخلش قهوه، عینک، کابل شارژ و
 * لپ‌تاپ هست. `interior` همان جزئیات را از پشت شیشه نشان می‌دهد.
 *
 * در مرحله‌ی «بلوار دوردور» و صحنه‌های بیرون به کار می‌آید.
 */
export function WolfCar({
  className = '',
  title = 'شاسی‌بلند گرگ',
  interior = true,
}: {
  className?: string;
  title?: string;
  interior?: boolean;
}) {
  return (
    <svg viewBox="0 0 260 130" role="img" aria-label={title} className={className}>
      {/* سایه */}
      <ellipse cx="130" cy="118" rx="106" ry="7" fill="var(--color-shab)" opacity="0.45" />

      {/* بدنه */}
      <path
        d="M22 96 v-20 q0 -12 12 -16 l22 -6 l20 -22 q4 -4 10 -4 h68 q6 0 10 4 l20 22 l22 6 q12 4 12 16 v20 Z"
        fill="var(--color-mashki)"
      />
      {/* خط بدنه */}
      <path d="M22 78 h216" stroke="var(--color-jooheh)" strokeWidth="1.6" opacity="0.45" />

      {/* شیشه‌ها */}
      <path d="M84 34 h34 v24 h-52 Z" fill="var(--color-abi)" opacity="0.34" />
      <path d="M126 34 h34 l18 24 h-52 Z" fill="var(--color-abi)" opacity="0.34" />
      <path d="M168 40 l14 18 h-22 Z" fill="var(--color-abi)" opacity="0.26" />

      {interior && (
        <g>
          {/* لپ‌تاپ روی صندلی */}
          <path d="M92 46 h20 v10 h-22 Z" fill="var(--color-sefid)" opacity="0.85" />
          {/* لیوان قهوه */}
          <path d="M136 42 h9 l-1.5 14 h-6 Z" fill="var(--color-sefid)" opacity="0.9" />
          <path d="M136 42 h9 v2.5 h-9 Z" fill="var(--color-tigh)" />
          {/* عینک روی داشبورد */}
          <g stroke="var(--color-tigh)" strokeWidth="1.6" fill="none" opacity="0.95">
            <circle cx="154" cy="50" r="4" />
            <circle cx="164" cy="50" r="4" />
            <path d="M158 50 h2" />
          </g>
          {/* کابل شارژ */}
          <path
            d="M118 56 q6 8 14 2 q8 -6 14 2"
            stroke="var(--color-sefid)"
            strokeWidth="1.6"
            fill="none"
            opacity="0.65"
          />
        </g>
      )}

      {/* چراغ‌ها */}
      <path d="M238 78 h-14 v10 h14 q4 0 4 -5 Z" fill="var(--color-tigh)" />
      <path d="M22 78 h14 v10 h-14 q-4 0 -4 -5 Z" fill="var(--color-mohr)" opacity="0.75" />

      {/* چرخ‌ها */}
      <circle cx="72" cy="96" r="19" fill="var(--color-shab)" />
      <circle cx="72" cy="96" r="9" fill="var(--color-jooheh)" />
      <circle cx="190" cy="96" r="19" fill="var(--color-shab)" />
      <circle cx="190" cy="96" r="9" fill="var(--color-jooheh)" />
    </svg>
  );
}
