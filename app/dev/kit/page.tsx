import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SpeakerBubble } from '@/components/ui/SpeakerBubble';
import { ProgressSeal } from '@/components/ui/ProgressSeal';
import { INK_BLEED_ID } from '@/components/motion/InkBleed';

/** ویترین سیستم طراحی. فقط در development باز است. */

const palette = [
  { token: '--shab', name: 'شب', use: 'پس‌زمینه‌ی همیشگی', swatch: 'bg-shab' },
  { token: '--kaj', name: 'کاج', use: 'لایه‌ی میانی، مه، متن روی کاغذ', swatch: 'bg-kaj' },
  { token: '--mahtab', name: 'مهتاب', use: 'کاغذ پرونده و متن روی تیره', swatch: 'bg-mahtab' },
  { token: '--mohr', name: 'مُهر', use: 'فقط مُهر — جای دیگر ممنوع', swatch: 'bg-mohr' },
  { token: '--tigh', name: 'تیغ', use: 'تنها رنگ کلیک‌شدنی', swatch: 'bg-tigh' },
  { token: '--jooheh', name: 'جوجه', use: 'خط و حاشیه — غیرمتنی', swatch: 'bg-jooheh' },
  { token: '--jooheh-text', name: 'جوجه (متن)', use: 'متن ثانویه، AA', swatch: 'bg-jooheh-text' },
];

const typeScale = [
  { cls: 'text-xs', label: '۱۲ — برچسب و فوتر', font: 'font-ui' },
  { cls: 'text-sm', label: '۱۴ — یادداشت', font: 'font-body' },
  { cls: 'text-base', label: '۱۶ — متن اصلی', font: 'font-body' },
  { cls: 'text-lg', label: '۲۰ — نقل‌قول', font: 'font-body' },
  { cls: 'text-xl', label: '۲۶ — عنوان مرحله', font: 'font-display' },
  { cls: 'text-2xl', label: '۳۴ — تیتر پرونده', font: 'font-display' },
  { cls: 'text-3xl', label: '۴۸ — شماره‌ی پرونده', font: 'font-display' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-jooheh/30 pb-2 font-display text-lg font-bold text-tigh">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DevKitPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-safe py-12">
      <header>
        <p className="font-ui text-xs tracking-[0.04em] text-jooheh-text">فقط در development</p>
        <h1 className="font-display text-2xl font-bold">ویترین سیستم طراحی</h1>
      </header>

      <Section title="پالت">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {palette.map((color) => (
            <li
              key={color.token}
              className="flex items-center gap-3 rounded-md border border-jooheh/30 p-3"
            >
              <span
                className={`size-11 shrink-0 rounded border border-jooheh/40 ${color.swatch}`}
                aria-hidden="true"
              />
              <span className="flex flex-col">
                <span className="text-base">{color.name}</span>
                <code className="font-ui text-xs text-jooheh-text">{color.token}</code>
                <span className="text-sm text-jooheh-text">{color.use}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-jooheh-text">
          نسبت کنتراست هر جفت با <code className="font-ui">node scripts/contrast.mjs</code> سنجیده
          می‌شود.
        </p>
      </Section>

      <Section title="مقیاس تایپ">
        <ul className="flex flex-col gap-3">
          {typeScale.map((row) => (
            <li key={row.cls} className={`${row.cls} ${row.font}`}>
              {row.label}
            </li>
          ))}
        </ul>
        <p className="text-sm text-jooheh-text">
          فونت نمایشی فعلاً روی استعداد برمی‌گردد چون فایل مربا هنوز تحویل نشده.
        </p>
      </Section>

      <Section title="دکمه">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="solid">پرونده را باز کن</Button>
          <Button variant="outline">یک سلیطه‌ی مظلومم</Button>
          <Button variant="quiet">شروع دوباره</Button>
          <Button variant="solid" disabled>
            غیرفعال
          </Button>
        </div>
      </Section>

      <Section title="نوار پیشرفت">
        <ProgressSeal total={20} done={7} current={8} />
      </Section>

      <Section title="کارت پرونده و دیالوگ">
        <Card label="پرونده‌ی محرمانه شماره ۲۷" title="احراز هویت جوجه‌تیغی">
          <div className="flex flex-col gap-4">
            <SpeakerBubble name="پاندا" side="start">
              آیا شما همان جوجه‌تیغی مظلومی هستید که همیشه بی‌دلیل متهم می‌شود؟
            </SpeakerBubble>
            <SpeakerBubble name="جوجه‌تیغی" side="end">
              یک سلیطه‌ی مظلومم.
            </SpeakerBubble>
            <SpeakerBubble side="center">هویت تأیید شد: سلیطه‌ی مظلوم.</SpeakerBubble>
          </div>
        </Card>
        <div className="flex flex-col gap-3 rounded-md border border-jooheh/30 p-4">
          <p className="font-ui text-xs text-jooheh-text">همان حباب روی پس‌زمینه‌ی تیره</p>
          <SpeakerBubble name="گرگ" side="end" tone="night">
            من آدم آرومی‌ام.
          </SpeakerBubble>
        </div>
      </Section>

      <Section title="فیلتر پخش جوهر">
        <div className="flex flex-wrap items-center gap-8">
          <span className="font-display text-2xl font-bold text-mohr">بدون فیلتر</span>
          <span
            className="font-display text-2xl font-bold text-mohr"
            style={{ filter: `url(#${INK_BLEED_ID})` }}
          >
            با فیلتر
          </span>
        </div>
        <p className="text-sm text-jooheh-text">همین فیلتر در فاز ۶ روی کامپوننت مُهر می‌نشیند.</p>
      </Section>
    </main>
  );
}
