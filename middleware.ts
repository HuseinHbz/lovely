import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAME, verifyCookie } from '@/lib/gate';

/**
 * دروازه در سطح درخواست.
 *
 * هر مسیری جز فهرست عمومی پایین بدون کوکی معتبر به `/gate` می‌رود — و این
 * شامل مسیرهای مستقیم مثل `/story/p13` هم می‌شود، نه فقط صفحه‌ی اصلی. به همین
 * دلیل دروازه اینجاست و نه داخل کامپوننت: صفحه‌های داستان از پیش ساخته شده‌اند
 * و اگر جلوی درخواست گرفته نشود، HTMLشان سرو می‌شود.
 *
 * انقضای لینک از همه‌چیز بالاتر است: بعد از آن حتی کوکی معتبر هم به `/expired`
 * می‌رود.
 */

const PUBLIC_PATHS = ['/gate', '/api/verify', '/expired'];
const PUBLIC_PREFIXES = ['/_next/', '/fonts/', '/art/'];
const PUBLIC_FILES = ['/robots.txt', '/favicon.ico', '/icon.svg'];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (PUBLIC_FILES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // انقضا: قبل از هر بررسی دیگری، و بدون استثنا برای کوکی معتبر.
  const expiresAt = Date.parse(process.env.LINK_EXPIRES_AT ?? '');
  const expired = Number.isFinite(expiresAt) && Date.now() > expiresAt;

  if (expired) {
    if (
      pathname === '/expired' ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/fonts/')
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/expired', request.url));
  }

  if (isPublic(pathname)) return NextResponse.next();

  const secret = process.env.SESSION_SECRET ?? '';
  const granted = await verifyCookie(request.cookies.get(COOKIE_NAME)?.value, secret);
  if (granted) return NextResponse.next();

  return NextResponse.redirect(new URL('/gate', request.url));
}

export const config = {
  // همه‌چیز جز فایل‌های ایستای Next. بقیه‌ی استثناها بالا بررسی می‌شوند.
  matcher: ['/((?!_next/static|_next/image).*)'],
};
