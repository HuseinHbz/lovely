import { NextResponse, type NextRequest } from 'next/server';
import { assertEnv, expiresAtMs, isExpired } from '@/lib/env';
import { COOKIE_NAME, cookieMaxAgeSeconds, grantSignature, verifyToken } from '@/lib/gate';
import { clearFailures, isBlocked, recordFailure, retryAfterSeconds } from '@/lib/rate-limit';

/**
 * تنها روت API این پروژه.
 *
 * قاعده ۲: هیچ چیزی جز اعتبارسنجی توکن اینجا اتفاق نمی‌افتد. هیچ انتخابی
 * دریافت نمی‌شود، هیچ‌چیز ذخیره نمی‌شود، و **توکن واردشده هیچ‌جا لاگ نمی‌شود**
 * — نه در موفقیت، نه در شکست، نه در خطا.
 *
 * پاسخ شکست همیشه یکسان است: نه طول توکن لو می‌رود، نه فرمتش، نه اینکه
 * اصلاً توکنی تنظیم شده یا نه.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GENERIC_FAILURE = { ok: false as const, error: 'کد دسترسی درست نیست.' };

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded !== null && forwarded !== '') return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // لینک منقضی شده: دیگر هیچ توکنی کار نمی‌کند.
  if (isExpired()) {
    return NextResponse.json({ ok: false, error: 'این پرونده بسته شد.' }, { status: 410 });
  }

  const ip = clientIp(request);
  if (isBlocked(ip)) {
    return NextResponse.json(GENERIC_FAILURE, {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds(ip)) },
    });
  }

  let supplied = '';
  try {
    const body: unknown = await request.json();
    if (typeof body === 'object' && body !== null && 'token' in body) {
      const value = (body as { token: unknown }).token;
      if (typeof value === 'string') supplied = value;
    }
  } catch {
    // بدنه‌ی خراب دقیقاً مثل توکن غلط رفتار می‌کند تا تفاوتی قابل اندازه‌گیری نباشد.
  }

  const env = assertEnv();
  const ok = await verifyToken(supplied, env.ACCESS_TOKEN);

  if (!ok) {
    recordFailure(ip);
    return NextResponse.json(GENERIC_FAILURE, { status: 401 });
  }

  clearFailures(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: await grantSignature(env.SESSION_SECRET),
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: cookieMaxAgeSeconds(expiresAtMs()),
  });
  return response;
}
