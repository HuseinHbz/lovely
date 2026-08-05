'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Interaction } from '@/content/schema';
import { Button } from '@/components/ui/Button';

type Split = Extract<Interaction, { kind: 'split' }>;

/**
 * تقسیم کارت بین کشوها — برگه‌های ۱۳ و ۱۹.
 *
 * کشیدن و رها کردن عمداً استفاده نشده: با کیبورد در دسترس نیست و روی موبایل با
 * اسکرول دعوا می‌کند. به‌جایش دو ضربه — اول کارت، بعد کشو — که هم با انگشت و هم
 * با Tab و Enter کار می‌کند.
 *
 * قاعده ۳: کارت در کشوی اشتباه بن‌بست نمی‌سازد. واکنش رد نشان داده می‌شود و
 * کارت برمی‌گردد تا دوباره امتحان شود.
 */
export function CardSplit({
  interaction,
  onDone,
  disabled = false,
}: {
  interaction: Split;
  onDone: () => void;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [held, setHeld] = useState<string | undefined>(undefined);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [rejection, setRejection] = useState<string | undefined>(undefined);

  const remaining = interaction.cards.filter((card) => placed[card.id] === undefined);
  const isDone = remaining.length === 0;

  function drop(bucketId: string) {
    if (held === undefined || disabled) return;
    const card = interaction.cards.find((item) => item.id === held);
    if (card === undefined) return;

    if (card.bucket !== bucketId) {
      const found = (interaction.rejections ?? []).find(
        (item) => item.cardId === card.id && item.bucketId === bucketId,
      );
      setRejection(found?.reaction ?? 'این کارت جای دیگری دارد. کشو پسش داد.');
      setHeld(undefined);
      return;
    }

    setRejection(undefined);
    setPlaced((current) => ({ ...current, [card.id]: bucketId }));
    setHeld(undefined);
  }

  return (
    <div className="flex flex-col gap-4">
      {interaction.prompt !== undefined && (
        <p className="text-lg font-medium text-kaj">{interaction.prompt}</p>
      )}

      {!isDone && (
        <ul className="flex flex-wrap gap-2">
          {remaining.map((card) => (
            <li key={card.id}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={held === card.id}
                onClick={() => setHeld(held === card.id ? undefined : card.id)}
                className={`min-h-11 cursor-pointer rounded-md border px-4 py-2 text-base transition-colors ${
                  held === card.id
                    ? 'border-tigh bg-tigh/20 text-kaj'
                    : 'border-kaj/25 text-kaj hover:border-tigh hover:bg-tigh/10'
                }`}
              >
                {card.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {interaction.buckets.map((bucket) => {
          const inside = interaction.cards.filter((card) => placed[card.id] === bucket.id);
          return (
            <li key={bucket.id}>
              <button
                type="button"
                disabled={disabled || held === undefined}
                onClick={() => drop(bucket.id)}
                className="flex min-h-24 w-full cursor-pointer flex-col gap-1 rounded-md border border-dashed border-kaj/35 p-3 text-start transition-colors enabled:hover:border-tigh disabled:cursor-default"
              >
                <span className="font-ui text-xs tracking-[0.04em] text-kaj/80">
                  {bucket.label}
                </span>
                {inside.map((card) => (
                  <span key={card.id} className="rounded bg-tigh/20 px-2 py-1 text-sm text-kaj">
                    {card.label}
                  </span>
                ))}
              </button>
            </li>
          );
        })}
      </ul>

      {held !== undefined && (
        <p className="font-ui text-xs text-kaj/80">حالا کشوی مقصد را انتخاب کن.</p>
      )}

      {rejection !== undefined && (
        <motion.p
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-md border border-mohr/50 bg-mohr/[0.06] px-3 py-2 text-sm text-kaj"
        >
          {rejection}
        </motion.p>
      )}

      {isDone && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <p className="text-base leading-[1.9] text-kaj">{interaction.message}</p>
          <Button variant="solid" onClick={onDone}>
            ثبت در پرونده
          </Button>
        </motion.div>
      )}
    </div>
  );
}
