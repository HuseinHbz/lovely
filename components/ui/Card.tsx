import type { ReactNode } from 'react';
import { PaperTexture } from './PaperTexture';

/**
 * کارت پرونده — ظرف اصلی هر مرحله.
 *
 * بخش ۳٫۴ سند: عرض حداکثر ۶۲۰ پیکسل، حاشیه‌ی امن ۲۴ پیکسل، تمام‌قد در موبایل.
 * بافت کاغذ روی همه‌چیز، با blend ضربی و opacity کم.
 */
export function Card({
  children,
  label,
  title,
  className = '',
}: {
  children: ReactNode;
  /** برچسب کوچک بالای کارت — مثلاً «پرونده‌ی محرمانه» */
  label?: string;
  /** عنوان مرحله */
  title?: string;
  className?: string;
}) {
  return (
    <article
      className={`relative w-full max-w-card overflow-hidden rounded-lg bg-mahtab px-5 py-6 text-shab shadow-[0_18px_50px_-24px_rgb(0_0_0/0.9)] sm:px-8 sm:py-9 ${className}`}
    >
      <PaperTexture />
      {(label ?? title) !== undefined && (
        <header className="relative mb-5">
          {label !== undefined && (
            <p className="font-ui text-xs tracking-[0.04em] text-kaj/70">{label}</p>
          )}
          {title !== undefined && (
            <h1 className="mt-1 font-display text-xl leading-tight font-bold text-kaj">{title}</h1>
          )}
        </header>
      )}
      <div className="relative">{children}</div>
    </article>
  );
}
