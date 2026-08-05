import { GateForm } from '@/components/GateForm';
import { Card } from '@/components/ui/Card';

/**
 * دروازه‌ی ورود.
 *
 * عمداً هیچ‌چیز درباره‌ی محتوای پشتش نمی‌گوید: نه نام شخصیتی، نه تصویری، نه
 * اشاره‌ای به داستان. اگر کسی تصادفی به این آدرس رسید، نباید بفهمد پشتش چیست.
 */
export default function GatePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-safe py-10">
      <Card label="پرونده محرمانه" title="شماره ۲۷">
        <div className="flex flex-col gap-5">
          <p className="text-base leading-[1.9] text-kaj">
            برای باز کردن پرونده، کد دسترسی را وارد کنید.
          </p>
          <GateForm />
        </div>
      </Card>
    </main>
  );
}
