'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

/**
 * فرم دروازه.
 *
 * تنها `fetch` کل پروژه، و مقصدش same-origin است. پیام خطا همیشه همان چیزی
 * است که سرور می‌دهد — هیچ سرنخی درباره‌ی طول یا فرمت توکن اضافه نمی‌شود.
 */
export function GateForm() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy || token.trim() === '') return;

    setBusy(true);
    setError(undefined);
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        router.replace('/story');
        return;
      }
      const data: unknown = await response.json().catch(() => ({}));
      const message =
        typeof data === 'object' && data !== null && 'error' in data
          ? String((data as { error: unknown }).error)
          : 'کد دسترسی درست نیست.';
      setError(
        response.status === 429 ? 'تلاش‌های ناموفق زیاد شد. کمی بعد دوباره امتحان کنید.' : message,
      );
    } catch {
      setError('ارتباط برقرار نشد.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="gate-token" className="font-ui text-xs tracking-[0.04em] text-kaj/80">
        کد دسترسی
      </label>
      <input
        id="gate-token"
        name="token"
        type="password"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        dir="ltr"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={error !== undefined ? 'gate-error' : undefined}
        className="min-h-11 rounded-md border border-kaj/30 bg-transparent px-3 py-2 text-base text-kaj"
      />

      {error !== undefined && (
        <p id="gate-error" role="alert" className="text-sm text-mohr">
          {error}
        </p>
      )}

      <Button type="submit" variant="solid" disabled={busy || token.trim() === ''}>
        {busy ? 'در حال بررسی…' : 'باز کن'}
      </Button>
    </form>
  );
}
