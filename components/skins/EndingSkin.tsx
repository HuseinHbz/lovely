'use client';

import type { ReactNode } from 'react';

/**
 * اسکین ۵ — پایان باز.
 *
 * سند: «صبح: پالت به `--mahtab` روشن می‌شود، نیمکت، سه دکمه».
 * تنها جایی از پروژه است که پس‌زمینه `--shab` نیست — و همین معنی‌اش را می‌سازد.
 */

function Bench() {
  return (
    <svg viewBox="0 0 200 90" aria-hidden="true" className="w-full max-w-card">
      {/* نیمکت */}
      <rect x="30" y="40" width="140" height="7" rx="3" fill="var(--color-kaj)" />
      <rect x="30" y="52" width="140" height="6" rx="3" fill="var(--color-kaj)" opacity="0.85" />
      <rect x="40" y="58" width="7" height="24" rx="2" fill="var(--color-kaj)" />
      <rect x="153" y="58" width="7" height="24" rx="2" fill="var(--color-kaj)" />
      <rect x="30" y="24" width="140" height="6" rx="3" fill="var(--color-kaj)" opacity="0.7" />

      {/* سفارش‌های روی نیمکت */}
      <path d="M74 34 l4 -12 h8 l4 12 Z" fill="var(--color-tigh)" opacity="0.9" />
      <rect x="100" y="22" width="12" height="14" rx="2" fill="var(--color-jooheh)" opacity="0.8" />
      <circle cx="124" cy="30" r="6" fill="var(--color-mohr)" opacity="0.65" />

      {/* بوته‌ای که پاندا پشتش است */}
      <path
        d="M6 82 C6 66 22 62 26 72 C34 60 50 68 48 82 Z"
        fill="var(--color-kaj)"
        opacity="0.7"
      />
    </svg>
  );
}

export function EndingSkin({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center gap-6 bg-mahtab px-safe py-10 text-shab">
      <p className="font-ui text-xs tracking-[0.04em] text-kaj/70">هوا روشن شد</p>
      <Bench />
      <div className="flex w-full justify-center">{children}</div>
    </section>
  );
}
