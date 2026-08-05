'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * اسکین ۴ — ذهن جوجه‌تیغی.
 *
 * سند: «پالت به `--kaj` روشن‌تر می‌رود، مه کم می‌شود، حباب‌های قابل‌جابه‌جایی».
 * پس‌زمینه اینجا از شب به کاج می‌رود و مه کنار می‌رود — بیرون از سر، شب است؛
 * اینجا داخل سر است.
 */

/** حباب‌های شناور بی‌کار — هر کدام فاز تصادفی خودش را دارد (بخش ۴ سند). */
function IdleBubbles() {
  const reduceMotion = useReducedMotion() ?? false;
  const bubbles = [
    { size: 90, start: 6, top: 4, delay: 0 },
    { size: 58, start: 72, top: 14, delay: 1.1 },
    { size: 44, start: 40, top: 2, delay: 2.2 },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-mahtab/[0.06]"
          style={{
            width: bubble.size,
            height: bubble.size,
            insetInlineStart: `${bubble.start}%`,
            top: `${bubble.top}%`,
          }}
          animate={reduceMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: bubble.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function MindSkin({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden rounded-xl bg-kaj/70 px-4 py-8">
      <IdleBubbles />
      <p className="relative mb-4 font-ui text-xs tracking-[0.04em] text-mahtab/70">
        داخل سر جوجه‌تیغی
      </p>
      <div className="relative flex w-full justify-center">{children}</div>
    </section>
  );
}
