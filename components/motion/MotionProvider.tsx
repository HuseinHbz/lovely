'use client';

import { MotionConfig } from 'motion/react';

/**
 * تنظیم سراسری حرکت.
 *
 * `reducedMotion="user"` باعث می‌شود Framer Motion برای کاربری که
 * `prefers-reduced-motion: reduce` دارد، **خودش** انیمیشن‌های transform و layout
 * را کنار بگذارد و فقط `opacity` و رنگ را نگه دارد.
 *
 * چرا لازم است و چرا شرط دستی کافی نبود: `useReducedMotion()` در اولین رندر
 * (سمت سرور و لحظه‌ی hydration) مقدار `null` برمی‌گرداند. `initial` فقط همان
 * یک بار خوانده می‌شود، پس کارت با `y: 40` و `rotate: -1.5` سوار می‌شد و بعد که
 * هوک به `true` می‌رسید، `animate` تقلیل‌یافته فقط `opacity` را ست می‌کرد و
 * transform را **پاک نمی‌کرد**. نتیجه این بود که کاربرِ کاهش حرکت، کارت را
 * برای همیشه ۴۰ پیکسل پایین‌تر و ۱٫۵ درجه کج می‌دید — یعنی بدتر از بقیه.
 *
 * این یکی کمربند است؛ شرط‌های دستی داخل کامپوننت‌ها بند شلوارند. هر دو می‌مانند.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
