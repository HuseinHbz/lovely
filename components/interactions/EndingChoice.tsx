'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Ending } from '@/content/schema';
import { Button } from '@/components/ui/Button';

/**
 * چهار پایان — فقط برگه ۲۷.
 *
 * `MERGED-SPEC` بخش ۵: **هر چهار پایان هم‌ارزش‌اند و هر چهار همیشه در دسترس.**
 * هیچ شاخصی هیچ‌کدام را قفل نمی‌کند، هیچ‌کدام «بهترین» نیست، و «مسیر اصلی»
 * وجود ندارد. به همین دلیل همه یک شکل رندر می‌شوند — هیچ‌کدام برجسته‌تر نیست.
 */
export function EndingChoice({
  endings,
  closing,
}: {
  endings: readonly Ending[];
  closing?: string | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const [picked, setPicked] = useState<Ending | undefined>(undefined);

  if (picked !== undefined) {
    return (
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.35 }}
        className="flex flex-col gap-4"
      >
        <p className="font-display text-lg font-bold text-kaj">{picked.label}</p>
        <p className="text-base leading-[1.9] text-kaj">{picked.message}</p>

        {closing !== undefined && (
          <p className="rounded-md bg-kaj/5 px-4 py-3 text-base leading-[1.9] text-kaj">
            {closing}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-ui text-xs tracking-[0.04em] text-kaj/70">وضعیت پرونده</span>
          <span className="rounded-full border border-tigh px-3 py-1 font-ui text-xs text-kaj">
            باز، برای یک فصل دیگر
          </span>
        </div>

        <Button variant="quiet" onClick={() => setPicked(undefined)}>
          پایان دیگری را ببین
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {endings.map((ending) => (
        <Button key={ending.id} variant="outline" onClick={() => setPicked(ending)}>
          {ending.label}
        </Button>
      ))}
      <p className="font-ui text-xs text-kaj/70">
        هر چهار پایان در دسترس‌اند و هیچ‌کدام بهتر از بقیه نیست.
      </p>
    </div>
  );
}
