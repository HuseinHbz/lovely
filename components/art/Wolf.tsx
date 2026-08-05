'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { FaceState } from './faces';

/**
 * گرگ — سمت راست کارت (بخش ۳٫۴ سند).
 * بدن ثابت می‌ماند و فقط گروه صورت با `AnimatePresence` عوض می‌شود.
 */

function WolfFace({ state }: { state: FaceState }) {
  switch (state) {
    case 'smug':
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M40 52 q6 -5 12 0" />
          <path d="M68 52 q6 -5 12 0" />
          <path d="M48 76 q12 9 24 -2" />
        </g>
      );
    case 'hurt':
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M40 48 q6 6 12 4" />
          <path d="M80 48 q-6 6 -12 4" />
          <circle cx="46" cy="56" r="3.2" fill="var(--color-shab)" stroke="none" />
          <circle cx="74" cy="56" r="3.2" fill="var(--color-shab)" stroke="none" />
          <path d="M50 80 q10 -7 20 0" />
        </g>
      );
    case 'guilty':
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M40 54 q6 4 12 0" />
          <path d="M68 54 q6 4 12 0" />
          <path d="M52 79 h16" />
          <path d="M84 62 q5 6 0 12" opacity="0.5" />
        </g>
      );
    default:
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <circle cx="46" cy="53" r="3.6" fill="var(--color-shab)" stroke="none" />
          <circle cx="74" cy="53" r="3.6" fill="var(--color-shab)" stroke="none" />
          <path d="M50 78 q10 6 20 0" />
        </g>
      );
  }
}

export function Wolf({
  face = 'neutral',
  className = '',
  title = 'گرگ',
}: {
  face?: FaceState;
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 120 130" role="img" aria-label={title} className={className}>
      {/* گوش‌ها */}
      <path d="M22 40 L30 8 L52 28 Z" fill="var(--color-jooheh)" />
      <path d="M98 40 L90 8 L68 28 Z" fill="var(--color-jooheh)" />
      <path d="M28 36 L33 18 L45 30 Z" fill="var(--color-shab)" opacity="0.55" />
      <path d="M92 36 L87 18 L75 30 Z" fill="var(--color-shab)" opacity="0.55" />

      {/* سر */}
      <path
        d="M60 20 C88 20 102 40 102 62 C102 88 84 106 60 106 C36 106 18 88 18 62 C18 40 32 20 60 20 Z"
        fill="var(--color-jooheh)"
      />
      {/* پوزه */}
      <path
        d="M60 60 C74 60 82 70 82 80 C82 94 72 102 60 102 C48 102 38 94 38 80 C38 70 46 60 60 60 Z"
        fill="var(--color-mahtab)"
        opacity="0.92"
      />
      <path d="M60 66 L66 72 L60 76 L54 72 Z" fill="var(--color-shab)" />

      <AnimatePresence mode="wait">
        <motion.g
          key={face}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <WolfFace state={face} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
