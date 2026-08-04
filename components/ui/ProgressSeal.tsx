import { faNumber } from '@/lib/format';

/**
 * نوار پیشرفت — یک مُهر کوچک به‌ازای هر مرحله.
 *
 * بخش ۴ سند: با تکمیل هر مرحله، مُهرش رنگ می‌گیرد. مُهر تنها جایی است که
 * `--mohr` اجازه‌ی حضور دارد.
 *
 * انیمیشن رنگ‌گرفتن در فاز ۶ اضافه می‌شود؛ اینجا فقط حالت ثابت است.
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
          <span
            key={step}
            aria-hidden="true"
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
