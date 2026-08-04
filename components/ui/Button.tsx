import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'solid' | 'outline' | 'quiet';

const variants: Record<Variant, string> = {
  // CTA اصلی — تنها رنگ پرشده‌ی کلیک‌شدنی
  solid: 'bg-tigh text-shab hover:bg-tigh/90 active:bg-tigh/80',
  // گزینه‌های داستان — قاب کهربایی روی کاغذ یا شب
  outline: 'border border-tigh/60 text-tigh hover:border-tigh hover:bg-tigh/10 active:bg-tigh/15',
  // کنش‌های فرعی مثل «شروع دوباره»
  quiet: 'text-jooheh-text hover:text-mahtab underline decoration-jooheh underline-offset-4',
};

/**
 * دکمه‌ی پایه.
 *
 * قاعده‌ی رنگ (بخش ۳٫۱): تنها رنگ کلیک‌شدنی `--tigh` است. هیچ دکمه‌ای
 * `--mohr` نمی‌گیرد؛ آن رنگ فقط مال مُهر است.
 *
 * ارتفاع حداقل ۴۴ پیکسل تا هدف لمسی موبایل درست باشد، و `:focus-visible`
 * از `globals.css` می‌آید — اینجا outline خاموش نمی‌شود.
 */
export function Button({
  children,
  variant = 'solid',
  className = '',
  type = 'button',
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-base transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
