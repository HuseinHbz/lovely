/**
 * دروازه‌ی ورود.
 *
 * دو نکته‌ی امنیتی که عمدی‌اند:
 *
 * ۱. **کوکی خودِ توکن را نگه نمی‌دارد.** مقدارش `HMAC-SHA256(SESSION_SECRET, "granted")`
 *    است. اگر کسی کوکی را بدزدد، توکن اصلی را ندارد؛ و چون امضا به سکرت سرور
 *    وابسته است، جعلش بدون سکرت ممکن نیست.
 *
 * ۲. **مقایسه‌ها زمان‌ثابت‌اند.** هر دو طرف اول `sha256` می‌شوند تا طولشان
 *    یکسان شود، بعد بایت‌به‌بایت مقایسه می‌شوند. مقایسه‌ی معمولی رشته‌ها با
 *    اولین بایت متفاوت برمی‌گردد و طول توکن را لو می‌دهد.
 *
 * این فایل هم در Node (روت `api/verify`) و هم در Edge (middleware) اجرا می‌شود،
 * پس فقط از Web Crypto استفاده می‌کند که هر دو دارند.
 */

export const COOKIE_NAME = 'wh_access';
const GRANT_PAYLOAD = 'granted';

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** امضای کوکی. همان چیزی که در `wh_access` می‌نشیند. */
export async function grantSignature(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(GRANT_PAYLOAD)));
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

/**
 * مقایسه‌ی زمان‌ثابت روی دو رشته‌ی هم‌طول.
 *
 * حلقه هیچ‌وقت زودتر تمام نمی‌شود: همه‌ی بایت‌ها XOR و OR می‌شوند و نتیجه
 * آخر سر یک بار سنجیده می‌شود.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** توکن واردشده را با توکن واقعی می‌سنجد. هیچ‌جا لاگ نمی‌شود. */
export async function verifyToken(supplied: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256Hex(supplied), sha256Hex(expected)]);
  return constantTimeEqual(a, b);
}

/** کوکی موجود را با امضای مورد انتظار می‌سنجد. */
export async function verifyCookie(
  cookieValue: string | undefined,
  secret: string,
): Promise<boolean> {
  if (cookieValue === undefined || cookieValue === '') return false;
  return constantTimeEqual(cookieValue, await grantSignature(secret));
}

/**
 * عمر کوکی: کمینه‌ی ۳۰ روز و زمان باقی‌مانده تا انقضای لینک.
 * برحسب ثانیه، چون `Set-Cookie: Max-Age` ثانیه می‌خواهد.
 */
export function cookieMaxAgeSeconds(expiresAtMs: number, now: number = Date.now()): number {
  const thirtyDays = 30 * 24 * 60 * 60;
  const untilExpiry = Math.floor((expiresAtMs - now) / 1000);
  return Math.max(0, Math.min(thirtyDays, untilExpiry));
}
