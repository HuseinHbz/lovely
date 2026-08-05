'use client';

import { motion, useReducedMotion } from 'motion/react';
import { faNumber } from '@/lib/format';

/**
 * نوار پیشرفت — یک مُهر کوچک به‌ازای هر مرحله.
 *
 * بخش ۴ سند: با تکمیل هر مرحله، مُهرش رنگ می‌گیرد. مُهر تنها جایی است که
 * `--mohr` اجازه‌ی حضور دارد.
 *
 * فاز ۶: رنگ‌گرفتن حالا یک فرود کوچک هم دارد — همان حرکت مُهر بزرگ ولی خیلی
 * ملایم‌تر، چون این نوار نباید توجه را از کارت بدزدد. با `reduce-motion` فقط
 * رنگ عوض می‌شود و هیچ حرکتی نیست.
 */
export function ProgressSeal({
  total,
  done,
  current,
}: {
  total: number;
  /** تعداد مراحل تکمیل‌شده */
  done: number;
  /** شماره‌ی مرحله‌ی جاری، از ۱ */
  current?: number;
}) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={`پیشرفت پرونده: ${faNumber(done)} مرحله از ${faNumber(total)}`}
    >
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const isDone = step <= done;
        const isCurrent = step === current;
        return (
          <motion.span
            key={step}
            aria-hidden="true"
            // فرود فقط لحظه‌ای که مُهر رنگ می‌گیرد؛ بقیه‌ی مُهرها ثابت‌اند
            // چون `initial={false}` جلوی اجرای انیمیشن موقع mount را می‌گیرد.
            initial={false}
            animate={isDone && !reduceMotion ? { scale: [1.6, 1] } : { scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 420, damping: 18 }}
            className={`size-2.5 rounded-[2px] border transition-colors duration-300 ${
              isDone
                ? 'border-mohr bg-mohr'
                : isCurrent
                  ? 'border-tigh bg-tigh/25'
                  : 'border-jooheh/50 bg-transparent'
            }`}
          />
        );
      })}
    </div>
  );
}
