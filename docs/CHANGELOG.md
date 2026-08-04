# تاریخچه‌ی تغییرات

## فاز ۰ — پایه و تصمیم‌های قفل‌شده

**وضعیت:** بسته ✅ · مستند: `docs/00-overview.md`

- مخزن با Next.js 15.5.22 (App Router)، React 19، TypeScript 5.9 در حالت `strict` به‌علاوه‌ی `noUncheckedIndexedAccess` و `exactOptionalPropertyTypes` راه‌اندازی شد.
- Tailwind CSS v4.3.3 با `@theme`؛ شش رنگ پالت، سه خانواده‌ی فونت و مقیاس تایپ `12/14/16/20/26/34/48` به‌صورت توکن تعریف شدند.
- `app/layout.tsx` با `lang="fa"`، `dir="rtl"` و متادیتای `noindex, nofollow, noarchive`.
- فونت‌های استعداد (variable، عربی + لاتین) و وزیرمتن ۴۰۰ به‌صورت self-host در `public/fonts` با مجوز OFL. جمعاً ۱۳۵KB.
- `:focus-visible` قابل‌مشاهده با رنگ `--tigh` و بلوک سراسری `prefers-reduced-motion` (قاعده ۵).
- ESLint 9 + Prettier 3 + Husky pre-commit با `lint-staged` و `typecheck`.
- `.env.example` با `ACCESS_TOKEN`، `LINK_EXPIRES_AT`، `SITE_URL`، `NEXT_TELEMETRY_DISABLED`.
- تله‌متری Next.js خاموش شد (قاعده ۲).

**ناتمام:** فونت **مربا** از هیچ منبع آزادی در دسترس پیدا نشد؛ `@font-face` آن کامنت است و `--font-display` روی استعداد برمی‌گردد. نیاز به فایل `Morabba-Bold.woff2` از سمت کارفرما — `public/fonts/README.md`.

---

## پیش از فازها — اسناد

- `docs/STORY.md` و `docs/PHASE-PLAN.md` تحویل شدند و جایگزین نسخه‌ی اولیه‌ی برنامه شدند. مرحله ۳ محتوای واقعی گرفت (بیمارستان جغدها، معرفی از طرف جغد رئیس) و دیگر `pending-content` نیست.
- `docs/OPEN-QUESTIONS.md` ثبت شد: ناسازگاری جدول فاز ۴ با داستان جدید، ۳۳ واکنش نوشته‌نشده، چهار کمبود اسکیما و شمارش نقاط نقشه.
