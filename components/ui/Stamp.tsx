'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { INK_BLEED_ID } from '@/components/motion/InkBleed';

/**
 * مُهر پرونده — عنصر امضای پروژه.
 *
 * `PHASE-PLAN` بخش ۳٫۳: «تمام جسارت بصری پروژه در همین یک عنصر خرج می‌شود.
 * بقیه‌ی صفحه آرام و منظم می‌ماند.» پس هرچه اینجا اغراق‌آمیز است عمدی است و
 * هیچ‌جای دیگری تکرار نمی‌شود.
 *
 * مشخصات از بخش ۴: `scale: 2.4 → 1`، `opacity: 0 → 1`، چرخش تصادفی ۳ تا ۷ درجه،
 * spring `{stiffness: 420, damping: 18}`، لبه با فیلتر `feTurbulence` +
 * `feDisplacementMap`، و شیک ۳ پیکسلی روی والد.
 *
 * با `prefers-reduced-motion: reduce` مُهر **بدون شیک و بدون چرخش** ظاهر
 * می‌شود — همان چیزی که بخش ۴ صریحاً خواسته. یعنی حتی زاویه‌ی ثابتش هم صفر
 * می‌شود، نه اینکه فقط انیمیشنش قطع شود.
 */

/** جهت چرخش تصادفی است ولی به ازای هر مُهر پایدار می‌ماند. */
function useTilt(seed: string, disabled: boolean): number {
  return useMemo(() => {
    if (disabled) return 0;
    // هش ساده‌ی رشته تا هر بار رندر همان زاویه بیاید و مُهر موقع re-render نپرد.
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash * 31 + seed.charCodeAt(index)) | 0;
    }
    const magnitude = 3 + (Math.abs(hash) % 5); // ۳ تا ۷ درجه
    return hash % 2 === 0 ? magnitude : -magnitude;
  }, [seed, disabled]);
}

export function Stamp({
  text,
  /** برای پایدار ماندن زاویه بین رندرها — معمولاً شناسه‌ی گزینه. */
  seed,
  tone = 'default',
}: {
  text: string;
  seed?: string;
  /** `alert` برای مُهرهای پرسروصدا مثل «وکیل خبر شد». */
  tone?: 'default' | 'alert';
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const tilt = useTilt(seed ?? text, reduceMotion);

  return (
    <motion.span
      role="status"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 2.4, rotate: tilt }}
      animate={
        reduceMotion
          ? { opacity: 1, transition: { duration: 0.2 } }
          : {
              opacity: 1,
              scale: 1,
              rotate: tilt,
              transition: { type: 'spring' as const, stiffness: 420, damping: 18 },
            }
      }
      style={{ filter: `url(#${INK_BLEED_ID})` }}
      className={`inline-flex select-none items-center justify-center rounded-[3px] border-2 px-3 py-1 font-display text-sm font-bold tracking-[0.08em] ${
        tone === 'alert' ? 'border-mohr text-mohr' : 'border-mohr/80 text-mohr'
      }`}
    >
      {text}
    </motion.span>
  );
}

/**
 * شیک ۳ پیکسلی والد، هم‌زمان با فرود مُهر.
 *
 * جدا از خود `Stamp` است چون سند شیک را «روی والد» خواسته: کارت تکان می‌خورد،
 * نه مُهر. با `reduce-motion` این کامپوننت هیچ حرکتی نمی‌دهد.
 */
export function StampShake({ active, children }: { active: boolean; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      animate={active && !reduceMotion ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
