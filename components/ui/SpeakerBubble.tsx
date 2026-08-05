import type { ReactNode } from 'react';

/**
 * سمتی که گوینده از آن حرف می‌زند.
 *
 * بخش ۳٫۴ سند: در RTL راوی از راست وارد می‌شود. گرگ سمت راست کارت،
 * جوجه‌تیغی سمت چپ. `system` وسط می‌ماند چون صدای پرونده است، نه شخصیت.
 */
export type BubbleSide = 'start' | 'end' | 'center';

const sides: Record<BubbleSide, string> = {
  start: 'me-auto items-start text-start',
  end: 'ms-auto items-end text-end',
  center: 'mx-auto items-center text-center',
};

/**
 * یک خط دیالوگ.
 *
 * `name` را محتوا می‌دهد، نه کامپوننت — هیچ اسم شخصیتی داخل لایه‌ی UI
 * هاردکد نمی‌شود (قاعده ۱).
 */
export function SpeakerBubble({
  children,
  name,
  side = 'start',
  tone = 'paper',
}: {
  children: ReactNode;
  /** `undefined` یعنی گوینده نام ندارد — صدای خود پرونده. */
  name?: string | undefined;
  side?: BubbleSide;
  /** `paper` روی کارت روشن، `night` روی پس‌زمینه‌ی تیره */
  tone?: 'paper' | 'night';
}) {
  const isSystem = side === 'center';
  const body =
    tone === 'paper'
      ? isSystem
        ? 'border-s-0 bg-kaj/5 text-kaj italic'
        : 'border-s-2 border-tigh/50 bg-shab/[0.03] text-shab'
      : isSystem
        ? 'border-s-0 bg-mahtab/5 text-jooheh-text italic'
        : 'border-s-2 border-tigh/50 bg-mahtab/[0.04] text-mahtab';

  return (
    <div className={`flex max-w-[46ch] flex-col gap-1 ${sides[side]}`}>
      {name !== undefined && (
        <span
          className={`font-ui text-xs tracking-[0.04em] ${tone === 'paper' ? 'text-kaj/80' : 'text-jooheh-text'}`}
        >
          {name}
        </span>
      )}
      <p className={`rounded-md px-3 py-2 text-base leading-[1.9] ${body}`}>{children}</p>
    </div>
  );
}
