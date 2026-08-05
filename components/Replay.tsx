'use client';

import Link from 'next/link';
import { useStoryStore } from '@/lib/store';
import { replayFor } from '@/lib/collection';
import { FOLDERS } from '@/content/index';
import { Card } from '@/components/ui/Card';
import { faNumber } from '@/lib/format';

/**
 * پخش دوباره — فاز ۹.
 *
 * می‌گوید در هر برگه چند واکنش دیده شده و چند تا نه، و مستقیم به همان برگه
 * لینک می‌دهد.
 *
 * **برچسب گزینه‌های دیده‌نشده نمایش داده می‌شود، ولی واکنششان نه.** خود گزینه
 * چیزی لو نمی‌دهد — همان جمله‌ای است که روی دکمه می‌بینی؛ واکنش پشتش است که
 * ارزش برگشتن دارد.
 *
 * چرا از `seenOptions` می‌خواند نه `choices`: آن یکی فقط **آخرین** انتخاب هر
 * تعامل را نگه می‌دارد و بازدید دوباره رویش می‌نویسد، پس نمی‌شود از رویش
 * فهمید چه چیزهایی تا به حال دیده شده‌اند.
 */
export function Replay() {
  const seenOptions = useStoryStore((state) => state.seenOptions);
  const stages = replayFor(seenOptions);

  const withChoices = stages.filter((stage) => stage.total > 0);
  const seenTotal = withChoices.reduce((sum, stage) => sum + stage.seen, 0);
  const allTotal = withChoices.reduce((sum, stage) => sum + stage.total, 0);
  const done = seenTotal === allTotal;

  return (
    <main className="flex min-h-dvh flex-col items-center gap-6 px-safe py-10">
      <Card label="بایگانی پرونده" title="چه چیزی را ندیده‌ام">
        <div className="flex flex-col gap-6">
          <p className="text-base leading-[1.9] text-kaj">
            {done
              ? 'هر واکنشی که در این پرونده نوشته شده را دیده‌ای. هر کدام. دبیرخانه چیزی برای نشان دادن نگه نداشته.'
              : `از ${faNumber(allTotal)} واکنش این پرونده، ${faNumber(seenTotal)} تا را دیده‌ای. بقیه هنوز سر جایشان‌اند.`}
          </p>

          {FOLDERS.map((folder) => {
            const inFolder = stages.filter((stage) => stage.folder === folder.number);
            if (inFolder.length === 0) return null;

            return (
              <section key={folder.number} className="flex flex-col gap-2">
                <h2 className="font-ui text-xs tracking-[0.04em] text-mohr">
                  دفتر {faNumber(folder.number)} — {folder.title}
                </h2>

                <ul className="flex flex-col gap-1.5">
                  {inFolder.map((stage) => {
                    const complete = stage.total > 0 && stage.seen === stage.total;
                    return (
                      <li key={stage.id}>
                        <Link
                          href={`/story/${stage.id}`}
                          className={`flex min-h-11 items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors ${
                            complete
                              ? 'border-kaj/20 hover:border-tigh'
                              : 'border-tigh/50 bg-tigh/[0.07] hover:border-tigh'
                          }`}
                        >
                          <span className="text-base text-kaj">{stage.title}</span>
                          <span className="shrink-0 font-ui text-xs text-kaj/80">
                            {stage.total === 0
                              ? 'روایی'
                              : `${faNumber(stage.seen)} از ${faNumber(stage.total)}`}
                          </span>
                        </Link>

                        {stage.unseen.length > 0 && (
                          <ul className="mt-1 mb-2 flex flex-col gap-1 ps-3">
                            {stage.unseen.map((label) => (
                              <li key={label} className="font-ui text-xs text-kaj/80">
                                ‌— {label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <hr className="border-kaj/15" />

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/museum"
              className="inline-flex min-h-11 items-center font-ui text-sm text-kaj underline decoration-tigh underline-offset-4"
            >
              موزه‌ی خاطرات
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
