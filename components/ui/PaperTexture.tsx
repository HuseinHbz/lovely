/**
 * بافت کاغذ — لایه‌ی روی کارت پرونده.
 *
 * طبق بخش ۳٫۴: `mix-blend-mode: multiply` و opacity حداکثر ۰٫۰۸.
 * نویز با `feTurbulence` تولید می‌شود، نه فایل تصویری — یعنی صفر بایت دانلود
 * و بدون وابستگی به هیچ دامنه‌ی بیرونی (قاعده‌ی شبکه‌ی ایران).
 *
 * والدش باید `relative` و `overflow-hidden` باشد.
 */
export function PaperTexture({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <filter id="paper-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}
