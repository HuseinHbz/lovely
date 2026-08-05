'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * مه دولایه — بخش ۴ سند: دو لایه‌ی SVG با `translateX` بی‌نهایت،
 * ۴۰ و ۶۵ ثانیه، در جهت‌های مخالف.
 *
 * با `prefers-reduced-motion: reduce` هر دو لایه ساکن می‌مانند و فقط دیده می‌شوند.
 */

function FogBand({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="h-full w-[200%]">
      <path
        d="M0 62 C40 44 70 78 110 60 C150 42 180 76 220 58 C260 40 290 74 330 56 C360 42 380 62 400 54 L400 100 L0 100 Z"
        fill="var(--color-kaj)"
        opacity={opacity}
      />
      <path
        d="M0 78 C50 62 80 92 130 76 C180 60 210 90 260 74 C300 62 340 84 400 72 L400 100 L0 100 Z"
        fill="var(--color-kaj)"
        opacity={opacity * 0.75}
      />
    </svg>
  );
}

export function FogLayer({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  const drift = (seconds: number, reverse: boolean) =>
    reduceMotion
      ? {}
      : {
          animate: { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] },
          transition: { duration: seconds, repeat: Infinity, ease: 'linear' as const },
        };

  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 bottom-0 h-40" {...drift(65, false)}>
        <FogBand opacity={0.5} />
      </motion.div>
      <motion.div className="absolute inset-x-0 bottom-0 h-28" {...drift(40, true)}>
        <FogBand opacity={0.35} />
      </motion.div>
    </div>
  );
}
