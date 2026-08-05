/**
 * اعتبارسنجی پیکربندی در لحظه‌ی بوت.
 *
 * Next این تابع را یک بار موقع راه‌اندازی سرور صدا می‌زند. اگر `.env` ناقص
 * باشد، پرتاب اینجا یعنی سرور اصلاً بالا نمی‌آید — نه اینکه بالا بیاید و
 * وسط اولین درخواست کاربر بشکند.
 */
export async function register(): Promise<void> {
  // فقط سمت سرور Node؛ در Edge متغیرهای محیطی این‌طور در دسترس نیستند.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { assertEnv, EnvError } = await import('./lib/env');
  try {
    assertEnv();
  } catch (error) {
    if (error instanceof EnvError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}
