'use client';

import { METERS } from '@/content/meters';
import { ACHIEVEMENTS } from '@/content/achievements';
import { useStoryStore } from '@/lib/store';
import { faNumber } from '@/lib/format';

/**
 * برگه‌ی خلاصه‌ی پرونده — فقط برگه ۲۶.
 *
 * `MERGED-SPEC` بخش ۴: این اعداد **هیچ‌چیز را قفل نمی‌کنند** و هیچ‌کدام
 * نمی‌گویند «رد شدی». به همین دلیل هیچ نواری قرمز نمی‌شود و هیچ عددی با
 * «حداقل لازم» مقایسه نمی‌شود — فقط شمرده و به شکل مضحک نمایش داده می‌شود.
 */

/** عدد خام را به درصدی می‌برد که هیچ‌وقت زیر نصف نیفتد؛ چون «رد شدن» نداریم. */
function toPercent(value: number): number {
  return Math.min(100, 55 + value * 5);
}

function Bar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-kaj/15">
      <div className="h-2 rounded-full bg-tigh" style={{ width: `${percent}%` }} />
    </div>
  );
}

export function CaseSummary() {
  const meters = useStoryStore((state) => state.meters);
  const unlocked = useStoryStore((state) => state.achievements);

  return (
    <section className="flex flex-col gap-5">
      <ul className="flex flex-col gap-3">
        {METERS.map((meter) => {
          const raw = meters[meter.id] ?? 0;
          const percent = toPercent(raw);
          return (
            <li key={meter.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-kaj">{meter.label}</span>
                <span className="font-ui text-xs text-kaj/70">
                  {meter.display === 'percent' && `${faNumber(percent)}٪`}
                  {meter.display === 'count' && `${faNumber(Math.max(raw, 0))} مدرک`}
                  {meter.display === 'rank' && (raw >= 3 ? 'قابل قبول' : 'قابل بحث')}
                  {meter.display === 'stars' && '★'.repeat(Math.min(5, Math.max(1, raw + 2)))}
                  {meter.display === 'light' && (raw >= 0 ? 'چراغ سبز' : 'چراغ زرد')}
                </span>
              </div>
              {(meter.display === 'percent' || meter.display === 'count') && (
                <Bar percent={percent} />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2">
        <p className="font-ui text-xs tracking-[0.04em] text-kaj/70">
          نشان‌ها — {faNumber(unlocked.length)} از {faNumber(ACHIEVEMENTS.length)}
        </p>
        <ul className="flex flex-wrap gap-2">
          {ACHIEVEMENTS.map((item) => {
            const isOn = unlocked.includes(item.id);
            return (
              <li
                key={item.id}
                title={item.note}
                className={`rounded-full border px-3 py-1 font-ui text-xs ${
                  isOn ? 'border-tigh bg-tigh/15 text-kaj' : 'border-kaj/25 text-kaj/45'
                }`}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-sm text-kaj/70 italic">
        هیچ‌کدام از این اعداد نمره نیست و هیچ‌کدام هیچ پایانی را قفل نمی‌کند.
      </p>
    </section>
  );
}
