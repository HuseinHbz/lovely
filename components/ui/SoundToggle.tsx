'use client';

import { useStoryStore } from '@/lib/store';
import { playSound } from '@/lib/sound';

/**
 * کلید خاموش‌کن صدا.
 *
 * `PHASE-PLAN` فاز ۶: «همه با کلید خاموش‌کن و **پیش‌فرض خاموش**». مقدار
 * پیش‌فرض در `lib/store.ts` روی `soundOn: false` است و همان‌جا هم در
 * `localStorage` می‌ماند — مثل بقیه‌ی وضعیت، هیچ‌جای دیگری نمی‌رود.
 *
 * موقع روشن کردن یک «تیک» کوتاه پخش می‌شود تا کاربر بفهمد صدا واقعاً آمد؛
 * موقع خاموش کردن هیچ صدایی نمی‌آید.
 */
export function SoundToggle() {
  const soundOn = useStoryStore((state) => state.soundOn);
  const toggleSound = useStoryStore((state) => state.toggleSound);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={soundOn}
      onClick={() => {
        const next = !soundOn;
        toggleSound();
        if (next) playSound('pin', true);
      }}
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-3 py-2 font-ui text-sm text-jooheh-text transition-colors hover:text-mahtab"
    >
      <span
        aria-hidden="true"
        className={`size-3 rounded-full border transition-colors ${
          soundOn ? 'border-tigh bg-tigh' : 'border-jooheh/60 bg-transparent'
        }`}
      />
      {soundOn ? 'صدا روشن' : 'صدا خاموش'}
    </button>
  );
}
