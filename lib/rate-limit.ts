/**
 * محدودیت نرخ برای تلاش‌های ناموفق دروازه.
 *
 * در حافظه نگه‌داری می‌شود چون PM2 با یک instance اجرا می‌شود (`cluster: 1`).
 * اگر روزی instance دوم اضافه شد، این باید به یک ذخیره‌ی مشترک برود — وگرنه
 * سقف تلاش‌ها به‌ازای هر instance جدا می‌شود.
 *
 * **هیچ توکنی اینجا نگه‌داری نمی‌شود** — فقط شمارنده و زمان، به‌ازای هر IP.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

type Bucket = { failures: number; firstFailureAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now - bucket.firstFailureAt > WINDOW_MS) buckets.delete(key);
  }
}

/** آیا این IP فعلاً مسدود است؟ */
export function isBlocked(ip: string, now: number = Date.now()): boolean {
  prune(now);
  const bucket = buckets.get(ip);
  if (bucket === undefined) return false;
  if (now - bucket.firstFailureAt > WINDOW_MS) {
    buckets.delete(ip);
    return false;
  }
  return bucket.failures >= MAX_FAILURES;
}

/** یک تلاش ناموفق را ثبت می‌کند. */
export function recordFailure(ip: string, now: number = Date.now()): void {
  prune(now);
  const bucket = buckets.get(ip);
  if (bucket === undefined || now - bucket.firstFailureAt > WINDOW_MS) {
    buckets.set(ip, { failures: 1, firstFailureAt: now });
    return;
  }
  bucket.failures += 1;
}

/** بعد از ورود موفق، سابقه‌ی همان IP پاک می‌شود. */
export function clearFailures(ip: string): void {
  buckets.delete(ip);
}

/** ثانیه‌های باقی‌مانده تا آزاد شدن — برای هدر `Retry-After`. */
export function retryAfterSeconds(ip: string, now: number = Date.now()): number {
  const bucket = buckets.get(ip);
  if (bucket === undefined) return 0;
  return Math.max(0, Math.ceil((bucket.firstFailureAt + WINDOW_MS - now) / 1000));
}

/** فقط برای تست. */
export function resetAll(): void {
  buckets.clear();
}

export const RATE_LIMIT = { WINDOW_MS, MAX_FAILURES } as const;
