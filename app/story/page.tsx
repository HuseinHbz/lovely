'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/store';
import { getStage, FIRST_STAGE_ID } from '@/lib/engine';

/**
 * `/story` کاربر را به همان مرحله‌ای می‌برد که رهایش کرده بود.
 *
 * این تصمیم سمت کلاینت گرفته می‌شود چون تنها منبعش `localStorage` است —
 * سرور نمی‌داند و نباید بداند کاربر کجای داستان است (قاعده ۲).
 */
export default function StoryIndexPage() {
  const router = useRouter();
  const currentStage = useStoryStore((state) => state.currentStage);

  useEffect(() => {
    const target = getStage(currentStage) === undefined ? FIRST_STAGE_ID : currentStage;
    router.replace(`/story/${target}`);
  }, [currentStage, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-safe">
      <p className="font-ui text-sm text-jooheh-text">در حال باز کردن پرونده…</p>
    </main>
  );
}
