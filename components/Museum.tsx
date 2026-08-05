'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useStoryStore } from '@/lib/store';
import { totalsFor } from '@/lib/collection';
import { ACHIEVEMENTS } from '@/content/achievements';
import { MAP_NODES } from '@/content/map';
import { EGGS } from '@/content/eggs';
import { Card } from '@/components/ui/Card';
import { faNumber } from '@/lib/format';

/**
 * موزه‌ی خاطرات — فاز ۹.
 *
 * هر چیزی که در طول پرونده جمع شده، یک‌جا. کاملاً از روی `localStorage` ساخته
 * می‌شود و هیچ درخواستی به هیچ‌جا نمی‌فرستد.
 *
 * دو تصمیم که ارزش گفتن دارند:
 *
 *   • **چیزهای نگرفته پنهان نمی‌شوند.** خالی بودنشان بخشی از پرونده است و
 *     دیدنشان تنها راهی است که کسی بفهمد چیزی برای برگشتن مانده. ولی متن
 *     واقعی‌شان لو نمی‌رود — فقط جای خالی.
 *   • **هیچ عددی اینجا نمره نیست.** همان قاعده‌ی `MERGED-SPEC` بخش ۴.
 */
export function Museum() {
  const reduceMotion = useReducedMotion() ?? false;
  const achievements = useStoryStore((state) => state.achievements);
  const unlockedNodes = useStoryStore((state) => state.unlockedNodes);
  const foundEggs = useStoryStore((state) => state.foundEggs);
  const seenOptions = useStoryStore((state) => state.seenOptions);

  const totals = totalsFor(achievements, unlockedNodes, foundEggs, seenOptions);

  const rows = [
    { label: 'نشان‌ها', ...totals.achievements },
    { label: 'گره‌های نقشه', ...totals.nodes },
    { label: 'چیزهای مخفی', ...totals.eggs },
    { label: 'واکنش‌های دیده‌شده', ...totals.reactions },
  ];

  const rise = (index: number) =>
    reduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: index * 0.05 },
        };

  return (
    <main className="flex min-h-dvh flex-col items-center gap-6 px-safe py-10">
      <Card label="بایگانی پرونده" title="موزه‌ی خاطرات">
        <div className="flex flex-col gap-7">
          <p className="text-base leading-[1.9] text-kaj">
            هرچه در این پرونده پیدا شد، اینجاست. آنچه هنوز پیدا نشده هم — چون خالی بودنش خودش بخشی
            از ماجراست.
          </p>

          {/* خلاصه */}
          <ul className="grid grid-cols-2 gap-2">
            {rows.map((row, index) => (
              <motion.li
                key={row.label}
                {...rise(index)}
                className="rounded-md border border-kaj/20 px-3 py-2"
              >
                <p className="font-ui text-xs tracking-[0.04em] text-kaj/80">{row.label}</p>
                <p className="font-display text-lg font-bold text-kaj">
                  {faNumber(row.got)}
                  <span className="font-ui text-xs font-normal text-kaj/80">
                    {' '}
                    از {faNumber(row.total)}
                  </span>
                </p>
              </motion.li>
            ))}
          </ul>

          {/* نشان‌ها */}
          <section className="flex flex-col gap-3">
            <h2 className="font-ui text-xs tracking-[0.04em] text-mohr">نشان‌ها</h2>
            <ul className="flex flex-col gap-2">
              {ACHIEVEMENTS.map((item) => {
                const got = achievements.includes(item.id);
                return (
                  <li
                    key={item.id}
                    className={`rounded-md border px-3 py-2 ${
                      got ? 'border-tigh bg-tigh/10' : 'border-dashed border-kaj/25'
                    }`}
                  >
                    <p className={`text-base ${got ? 'text-kaj' : 'text-kaj/75'}`}>
                      {got ? item.label : '؟'}
                    </p>
                    <p className="font-ui text-xs text-kaj/80">
                      {got ? item.note : 'هنوز گرفته نشده'}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* چیزهای مخفی */}
          <section className="flex flex-col gap-3">
            <h2 className="font-ui text-xs tracking-[0.04em] text-mohr">چیزهای مخفی</h2>
            <ul className="flex flex-col gap-2">
              {EGGS.map((egg) => {
                const got = foundEggs.includes(egg.id);
                return (
                  <li
                    key={egg.id}
                    className={`rounded-md border px-3 py-2 ${
                      got ? 'border-tigh bg-tigh/10' : 'border-dashed border-kaj/25'
                    }`}
                  >
                    <p className={`text-base ${got ? 'text-kaj' : 'text-kaj/75'}`}>
                      {got ? egg.label : 'هنوز پیدا نشده'}
                    </p>
                    {/* راهنما فقط تا وقتی پیدا نشده؛ بعدش جایش را می‌دهد. */}
                    <p className="font-ui text-xs text-kaj/80">{got ? egg.where : egg.hint}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* نقشه */}
          <section className="flex flex-col gap-3">
            <h2 className="font-ui text-xs tracking-[0.04em] text-mohr">گره‌های نقشه</h2>
            <ul className="flex flex-wrap gap-2">
              {MAP_NODES.map((node) => {
                const on = unlockedNodes.includes(node.id);
                return (
                  <li
                    key={node.id}
                    className={`rounded-full border px-3 py-1 font-ui text-xs ${
                      on ? 'border-tigh text-kaj' : 'border-kaj/25 text-kaj/75'
                    }`}
                  >
                    {node.label}
                  </li>
                );
              })}
            </ul>
          </section>

          <hr className="border-kaj/15" />

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/replay"
              className="inline-flex min-h-11 items-center font-ui text-sm text-kaj underline decoration-tigh underline-offset-4"
            >
              چه چیزی را هنوز ندیده‌ام؟
            </Link>
            <Link
              href="/story"
              className="inline-flex min-h-11 items-center font-ui text-sm text-kaj/80 underline decoration-kaj/40 underline-offset-4"
            >
              برگشت به پرونده
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
