/**
 * صفحه‌ی انقضا.
 *
 * بدون دکمه، بدون توضیح، بدون راه بازگشت — عمداً. اگر لینک منقضی شده،
 * هیچ‌چیز اینجا نباید راهی به داخل نشان بدهد.
 */
export default function ExpiredPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-safe">
      <p className="font-display text-xl text-mahtab">این پرونده بسته شد.</p>
    </main>
  );
}
