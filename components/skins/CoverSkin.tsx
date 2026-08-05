'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FogLayer } from '@/components/motion/FogLayer';
import { Moon } from '@/components/art/Moon';
import { INK_BLEED_ID } from '@/components/motion/InkBleed';

/**
 * اسکین ۱ — جلد پرونده.
 * مه دولایه، ماه، دو ردپا که به هم می‌رسند، و مُهر «محرمانه — شماره ۲۷».
 */

/** ردپاها: از دو طرف شروع می‌شوند و وسط به هم می‌رسند. */
function Footprints() {
  const steps = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 200 40" aria-hidden="true" className="w-full max-w-card">
      {steps.map((step) => (
        <ellipse
          key={`start-${step}`}
          cx={12 + step * 13}
          cy={step % 2 === 0 ? 14 : 22}
          rx="3.4"
          ry="2.4"
          fill="var(--color-jooheh)"
          opacity={0.25 + step * 0.1}
        />
      ))}
      {steps.map((step) => (
        <ellipse
          key={`end-${step}`}
          cx={188 - step * 13}
          cy={step % 2 === 0 ? 26 : 18}
          rx="3.4"
          ry="2.4"
          fill="var(--color-tigh)"
          opacity={0.25 + step * 0.1}
        />
      ))}
    </svg>
  );
}

export function CoverSkin({ children }: { children?: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-shab px-safe py-10">
      <Moon className="pointer-events-none absolute -top-16 -start-16 w-64 opacity-90 sm:w-80" />
      <FogLayer className="absolute inset-x-0 bottom-0 h-40" />

      <div className="relative flex w-full max-w-card flex-col items-center gap-7 text-center">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 2.4, rotate: 0 }}
          animate={
            reduceMotion
              ? { opacity: 1, transition: { duration: 0.2 } }
              : {
                  opacity: 1,
                  scale: 1,
                  rotate: -5,
                  transition: { type: 'spring', stiffness: 420, damping: 18, delay: 0.25 },
                }
          }
          style={reduceMotion ? {} : { filter: `url(#${INK_BLEED_ID})` }}
          className="rounded-sm border-4 border-mohr px-4 py-2 font-display text-lg font-bold text-mohr"
        >
          محرمانه — شماره ۲۷
        </motion.div>

        <h1 className="font-display text-2xl leading-tight font-bold text-mahtab sm:text-3xl">
          پرونده‌ی گرگ و جوجه‌تیغی
        </h1>

        <Footprints />

        {children}
      </div>
    </section>
  );
}
