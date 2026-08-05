import type { MetadataRoute } from 'next';

/**
 * لایه‌ی اول جلوگیری از ایندکس.
 *
 * سه لایه‌ی دیگر: متادیتای `robots` در `app/layout.tsx`، هدر `X-Robots-Tag` در
 * `next.config.ts`، و همان هدر در `deploy/nginx.conf.template`.
 * هر چهار لازم‌اند — `robots.txt` را همه‌ی خزنده‌ها محترم نمی‌شمارند.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  };
}
