/**
 * ریشه‌ی سایت.
 * در فاز ۵ این صفحه به ریدایرکت `/gate` یا `/story/<مرحله‌ی فعلی>` تبدیل می‌شود.
 * فعلاً فقط پذیرش فاز ۰ را نشان می‌دهد: RTL، فونت نمایشی، پس‌زمینه‌ی --shab.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-safe text-center">
      <p className="font-ui text-xs tracking-[0.04em] text-jooheh-text">پرونده‌ی محرمانه</p>
      <h1 className="font-display text-2xl font-bold text-mahtab">شماره ۲۷</h1>
      <p className="max-w-[38ch] text-base text-jooheh-text">
        موضوع پرونده: یک گرگِ کرمو، یک جوجه‌تیغیِ به‌شدت مظلوم و حجم خطرناکی از «نمی‌دونم».
      </p>
    </main>
  );
}
