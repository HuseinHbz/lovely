'use client';

import type { ReactNode } from 'react';
import { Wolf } from '@/components/art/Wolf';
import { Hedgehog } from '@/components/art/Hedgehog';
import type { FaceState } from '@/components/art/faces';
import type { HedgehogOutfit, WolfOutfit } from '@/lib/wardrobe';

/**
 * اسکین ۲ — اتاق بازجویی.
 *
 * بخش ۳٫۴ سند: کارت مرکزی، گرگ سمت راست، جوجه‌تیغی سمت چپ. در موبایل دو
 * شخصیت بالای کارت کنار هم می‌نشینند تا کارت تمام‌عرض بماند و چیزی سرریز نکند.
 */
export function InterrogationSkin({
  children,
  wolfFace = 'neutral',
  hedgehogFace = 'neutral',
  wolfOutfit = 'formal',
  hedgehogOutfit = 'nurse',
}: {
  children: ReactNode;
  wolfFace?: FaceState;
  hedgehogFace?: FaceState;
  wolfOutfit?: WolfOutfit;
  hedgehogOutfit?: HedgehogOutfit;
}) {
  return (
    <section className="relative flex w-full flex-col items-center gap-4">
      {/* در RTL اولین فرزند سمت راست می‌نشیند، پس گرگ باید اول بیاید. */}

      {/* موبایل: شخصیت‌ها بالای کارت */}
      <div className="flex w-full max-w-card items-end justify-between lg:hidden">
        <Wolf face={wolfFace} outfit={wolfOutfit} className="w-20" />
        <Hedgehog face={hedgehogFace} outfit={hedgehogOutfit} className="w-20" />
      </div>

      {/* دسکتاپ: گرگ راست، جوجه‌تیغی چپ */}
      <div className="flex w-full items-end justify-center gap-6">
        <Wolf
          face={wolfFace}
          outfit={wolfOutfit}
          className="hidden w-28 shrink-0 lg:block xl:w-36"
        />
        <div className="flex w-full justify-center">{children}</div>
        <Hedgehog
          face={hedgehogFace}
          outfit={hedgehogOutfit}
          className="hidden w-28 shrink-0 lg:block xl:w-36"
        />
      </div>
    </section>
  );
}
