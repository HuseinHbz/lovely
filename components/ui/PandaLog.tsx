import type { ReactNode } from 'react';

/**
 * لایه‌ی پاندا — `MERGED-SPEC` بخش ۲.
 *
 * پاندا بعد از هر صحنه با لحن منشی دادگاه وارد می‌شود و همان صحنه را به‌عنوان
 * «مدرک» ثبت می‌کند. عمداً شکل «برگه‌ی الصاق‌شده» دارد، نه حباب دیالوگ — چون
 * صدای پرونده است، نه یک شخصیت داخل صحنه.
 */
export function PandaLog({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-md border border-dashed border-mohr/45 bg-mohr/[0.05] px-4 py-3">
      <p className="mb-1 font-ui text-xs tracking-[0.04em] text-mohr">ثبت در پرونده</p>
      <p className="text-sm leading-[1.9] text-kaj">{children}</p>
    </aside>
  );
}
