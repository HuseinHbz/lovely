'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Panda } from '@/components/art/Panda';
import { useStoryStore } from '@/lib/store';
import { playSound } from '@/lib/sound';

/**
 * لایه‌ی پاندا — `MERGED-SPEC` بخش ۲.
 *
 * پاندا بعد از هر صحنه با لحن منشی دادگاه وارد می‌شود و همان صحنه را به‌عنوان
 * «مدرک» ثبت می‌کند. عمداً شکل «برگه‌ی الصاق‌شده» دارد، نه حباب دیالوگ — چون
 * صدای پرونده است، نه یک شخصیت داخل صحنه.
 *
 * **Easter Egg (فاز ۶):** پنج بار کلیک روی نازو یک جمله‌ی مخفی باز می‌کند.
 * شمارنده عمداً محلی است و با عوض شدن برگه صفر می‌شود — یعنی باید همان‌جا و با
 * حوصله پیدا شود، نه اینکه در طول پرونده تصادفاً جمع شود.
 */

const SECRET_CLICKS = 5;

export function PandaLog({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  const soundOn = useStoryStore((state) => state.soundOn);
  const [clicks, setClicks] = useState(0);
  const found = clicks >= SECRET_CLICKS;

  return (
    <aside className="rounded-md border border-dashed border-mohr/45 bg-mohr/[0.05] px-4 py-3">
      <div className="mb-1 flex items-center gap-2">
        <motion.span
          // تکان کوچک بعد از هر کلیک، تا معلوم باشد چیزی دارد اتفاق می‌افتد.
          animate={reduceMotion || clicks === 0 || found ? {} : { rotate: [0, -6, 6, 0] }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <Panda
            className="size-8"
            title={found ? 'نازو، دبیر پرونده' : 'نازو'}
            onClick={
              found
                ? undefined
                : () => {
                    setClicks((count) => count + 1);
                    playSound('pin', soundOn);
                  }
            }
          />
        </motion.span>
        <p className="font-ui text-xs tracking-[0.04em] text-mohr">ثبت در پرونده</p>
      </div>

      <p className="text-sm leading-[1.9] text-kaj">{children}</p>

      <AnimatePresence>
        {found && (
          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.35 }}
            className="mt-3 border-t border-dashed border-mohr/40 pt-3 text-sm leading-[1.9] text-mohr"
          >
            باشد، دیدمت. پنج بار. دبیرخانه رسماً اعلام می‌کند که این پرونده را کسی با حوصله می‌خواند
            — و همین یک بند، از تمام مدارک داخل پرونده مهم‌تر است.
          </motion.p>
        )}
      </AnimatePresence>
    </aside>
  );
}
