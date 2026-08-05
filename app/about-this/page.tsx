import { Card } from '@/components/ui/Card';
import { ClearDataButton } from '@/components/ClearDataButton';

/**
 * توضیح صادقانه‌ی حریم خصوصی.
 *
 * **هر جمله‌ی این صفحه باید راست باشد.** اگر روزی کد طوری عوض شد که یکی از
 * این جمله‌ها دیگر درست نبود، کد باید برگردد — نه اینکه متن نرم شود.
 *
 * پشتوانه‌ی هر ادعا:
 *   «هیچ پاسخی ذخیره یا ارسال نمی‌شود»  → `pnpm audit:privacy` تنها fetch پروژه
 *                                          را می‌شناسد و آن `/api/verify` است.
 *   «فقط در مرورگر خودتان»              → `lib/store.ts` روی localStorage.
 *   «هیچ‌کس نمی‌بیند چه انتخاب کردید»   → انتخاب‌ها در URL نیستند و لاگ دسترسی
 *                                          Nginx هم خاموش است (`deploy/nginx.conf.template`).
 */
export default function AboutThisPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-safe py-10">
      <Card label="درباره‌ی این صفحه" title="چه چیزی ذخیره می‌شود">
        <div className="flex flex-col gap-4 text-base leading-[1.9] text-kaj">
          <p>این سایت هیچ پاسخی را ذخیره یا ارسال نمی‌کند.</p>
          <p>
            انتخاب‌های شما فقط در مرورگر خودتان می‌ماند و با پاک کردن حافظه‌ی مرورگر از بین می‌رود.
          </p>
          <p>این لینک تاریخ انقضا دارد.</p>
          <p>هیچ‌کس نمی‌بیند شما چه انتخاب کردید.</p>

          <hr className="border-kaj/15" />

          <p className="text-sm text-kaj/75">
            تنها چیزی که شما وارد می‌کنید و به سرور می‌رود، کد دسترسی هنگام ورود است — و آن هم نه
            ذخیره می‌شود و نه لاگ. لاگ دسترسی وب‌سرور خاموش است، پس حتی این که کدام برگه را باز
            کرده‌اید هم جایی نوشته نمی‌شود.
          </p>

          <ClearDataButton />
        </div>
      </Card>
    </main>
  );
}
