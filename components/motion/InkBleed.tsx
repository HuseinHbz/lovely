/**
 * فیلتر پخش جوهر — عنصر امضای پروژه (بخش ۳٫۳ سند).
 *
 * یک بار در ریشه‌ی صفحه رندر می‌شود و هر جای دیگر با
 * `style={{ filter: 'url(#ink-bleed)' }}` یا کلاس `filter-ink` صدا زده می‌شود.
 * چیزی رسم نمی‌کند؛ فقط `<defs>` را وارد سند می‌کند.
 */

export const INK_BLEED_ID = 'ink-bleed';
export const INK_BLEED_SOFT_ID = 'ink-bleed-soft';

export function InkBleedDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute h-0 w-0">
      <defs>
        {/* لبه‌ی مُهر: آشفتگی درشت، جابه‌جایی محسوس */}
        <filter id={INK_BLEED_ID} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.045 0.06"
            numOctaves={4}
            seed={27}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={3.2}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* نسخه‌ی ملایم برای خط‌ها و قاب‌ها */}
        <filter id={INK_BLEED_SOFT_ID} x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={9}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={1.1}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
