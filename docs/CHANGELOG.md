# تاریخچه‌ی تغییرات

## فاز ۱ — سیستم طراحی

**وضعیت:** بسته ✅ · مستند: `docs/01-design-system.md`

- شش رنگ پالت به‌علاوه‌ی `--color-jooheh-text` در `@theme`؛ کامپوننت‌های `Card`، `Button`، `SpeakerBubble`، `ProgressSeal`، `PaperTexture` و `InkBleedDefs`.
- `scripts/contrast.mjs` (`pnpm contrast`): رنگ‌ها را از `globals.css` می‌خواند، نسبت WCAG هر جفت را می‌سنجد و با افتادن هر جفت خطا می‌دهد. هر ۹ جفت پاس شدند.
- `/dev/kit` به‌عنوان ویترین توکن‌ها و کامپوننت‌ها؛ در production با `notFound()` بسته می‌شود. اسکرین‌شات دسکتاپ و موبایل در `docs/img/`.
- بافت کاغذ و فیلترهای پخش جوهر با `feTurbulence` تولید می‌شوند — صفر بایت دانلود، بدون فایل تصویری و بدون CDN.

**تصمیم قابل بازبینی:** `--jooheh` (`#6B7A8F`) روی `--shab` نسبت ۳٫۹۷ دارد و برای متن معمولی زیر حد AA است، در حالی که سند همان را «متن ثانویه» معرفی کرده بود. به‌جای تغییر رنگ اعلام‌شده، `--color-jooheh-text` (`#778598`، نسبت ۴٫۶۳) اضافه شد و `--jooheh` به خط و حاشیه محدود ماند.

---

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
