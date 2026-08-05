/**
 * متغیرهای محیطی — بدون هیچ پیش‌فرضی.
 *
 * **هیچ توکن پیش‌فرضی وجود ندارد.** اگر `.env` ناقص باشد سرور بالا نمی‌آید،
 * چون یک سایت خصوصی که با توکن پیش‌فرض بالا بیاید، خصوصی نیست.
 *
 * اعتبارسنجی در `instrumentation.ts` موقع بوت اجرا می‌شود، پس خطا در لحظه‌ی
 * راه‌اندازی می‌آید نه وسط اولین درخواست کاربر.
 */

export type Env = {
  ACCESS_TOKEN: string;
  SESSION_SECRET: string;
  LINK_EXPIRES_AT: string;
  SITE_URL: string;
};

const REQUIRED = ['ACCESS_TOKEN', 'SESSION_SECRET', 'LINK_EXPIRES_AT', 'SITE_URL'] as const;

const HOW_TO: Record<(typeof REQUIRED)[number], string> = {
  ACCESS_TOKEN: 'openssl rand -hex 16',
  SESSION_SECRET: 'openssl rand -hex 32',
  LINK_EXPIRES_AT: 'یک تاریخ ISO 8601، مثلاً 2026-12-31T23:59:59Z',
  SITE_URL: 'آدرس کامل سایت بدون اسلش انتهایی، مثلاً https://example.ir',
};

export class EnvError extends Error {}

/** اگر چیزی کم یا خراب باشد پرتاب می‌کند. پیام برای آدمی است که سرور را بالا می‌آورد. */
export function assertEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const missing = REQUIRED.filter((key) => (source[key] ?? '').trim() === '');

  if (missing.length > 0) {
    const lines = missing.map((key) => `  ${key}  ←  ${HOW_TO[key]}`);
    throw new EnvError(
      [
        '',
        'پیکربندی ناقص است و سرور بالا نمی‌آید.',
        '',
        'این متغیرها در .env خالی یا غایب‌اند:',
        ...lines,
        '',
        'هیچ مقدار پیش‌فرضی وجود ندارد — یک سایت خصوصی با توکن پیش‌فرض خصوصی نیست.',
        '',
      ].join('\n'),
    );
  }

  const expiresAt = Date.parse(source.LINK_EXPIRES_AT as string);
  if (Number.isNaN(expiresAt)) {
    throw new EnvError(
      `LINK_EXPIRES_AT قابل تفسیر نیست: «${source.LINK_EXPIRES_AT}». ${HOW_TO.LINK_EXPIRES_AT}`,
    );
  }

  const token = source.ACCESS_TOKEN as string;
  if (token.length < 16) {
    throw new EnvError('ACCESS_TOKEN خیلی کوتاه است. با `openssl rand -hex 16` بسازش.');
  }

  const secret = source.SESSION_SECRET as string;
  if (secret.length < 32) {
    throw new EnvError('SESSION_SECRET خیلی کوتاه است. با `openssl rand -hex 32` بسازش.');
  }

  return {
    ACCESS_TOKEN: token,
    SESSION_SECRET: secret,
    LINK_EXPIRES_AT: source.LINK_EXPIRES_AT as string,
    SITE_URL: source.SITE_URL as string,
  };
}

/** لحظه‌ی انقضا به میلی‌ثانیه. */
export function expiresAtMs(source: NodeJS.ProcessEnv = process.env): number {
  return Date.parse(source.LINK_EXPIRES_AT ?? '');
}

export function isExpired(
  now: number = Date.now(),
  source: NodeJS.ProcessEnv = process.env,
): boolean {
  const at = expiresAtMs(source);
  return Number.isFinite(at) && now > at;
}
