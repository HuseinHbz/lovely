'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { clearProgress } from '@/lib/store';

/**
 * پاک کردن کامل داده‌ها.
 *
 * فقط کلید خود پروژه را نمی‌برد — **کل `localStorage` این دامنه** را خالی
 * می‌کند، چون متن این صفحه همین را قول داده و متن باید راست باشد.
 */
export function ClearDataButton() {
  const [done, setDone] = useState(false);

  function handleClear() {
    clearProgress();
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // مرورگری که حافظه را قفل کرده؛ چیزی برای پاک کردن هم نمانده.
    }
    setDone(true);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={handleClear}>
        پاک کردن همه‌ی داده‌های من
      </Button>
      {done && (
        <p role="status" className="text-sm text-kaj/75">
          پاک شد. دیگر هیچ چیزی از انتخاب‌های شما در این مرورگر نمانده.
        </p>
      )}
    </div>
  );
}
