'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Interaction } from '@/content/schema';
import { Button } from '@/components/ui/Button';
import { useStoryStore } from '@/lib/store';
import { playSound } from '@/lib/sound';

type Find = Extract<Interaction, { kind: 'find' }>;

/**
 * پیدا کردن نقطه روی صحنه — برگه ۱۵.
 *
 * قاعده ۳: هیچ نقطه‌ای «غلط» نیست. هر نقطه‌ای که انتخاب شود واکنش خودش را
 * می‌دهد و بازیکن به برگه‌ی بعد می‌رود؛ `correct` فقط لحن واکنش را عوض می‌کند.
 *
 * هر نقطه علاوه بر دایره‌ی روی تصویر، یک دکمه‌ی متنی هم دارد تا با کیبورد و
 * صفحه‌خوان هم قابل انتخاب باشد.
 */
export function MapFind({
  interaction,
  onDone,
  disabled = false,
}: {
  interaction: Find;
  onDone: () => void;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [chosen, setChosen] = useState<string | undefined>(undefined);
  const soundOn = useStoryStore((state) => state.soundOn);

  const picked = interaction.hotspots.find((spot) => spot.id === chosen);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full overflow-hidden rounded-lg border border-kaj/20 bg-kaj/10">
        <svg viewBox="0 0 100 100" className="h-full w-full" role="presentation">
          {/* مسیرها */}
          <path
            d="M10 90 Q30 60 30 55 T62 40 T90 20"
            fill="none"
            stroke="var(--color-kaj)"
            strokeWidth="1.4"
            opacity="0.45"
          />
          {interaction.hotspots.map((spot) => {
            const isChosen = chosen === spot.id;
            return (
              <circle
                key={spot.id}
                cx={spot.x}
                cy={spot.y}
                r={spot.r}
                fill={isChosen ? 'var(--color-tigh)' : 'var(--color-tigh)'}
                fillOpacity={isChosen ? 0.5 : 0.16}
                stroke="var(--color-tigh)"
                strokeWidth="0.6"
              />
            );
          })}
        </svg>
      </div>

      {chosen === undefined ? (
        <ul className="flex flex-col gap-2">
          {interaction.hotspots.map((spot) => (
            <li key={spot.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setChosen(spot.id);
                  playSound('pin', soundOn);
                }}
                className="flex min-h-11 w-full cursor-pointer items-center rounded-md border border-kaj/25 px-4 py-3 text-start text-base text-kaj transition-colors hover:border-tigh hover:bg-tigh/10"
              >
                {spot.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <p className="text-base leading-[1.9] text-kaj">{picked?.reaction}</p>
          <Button variant="solid" onClick={onDone}>
            ثبت در پرونده
          </Button>
        </motion.div>
      )}
    </div>
  );
}
