'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { FaceState } from './faces';

/** جوجه‌تیغی — سمت چپ کارت. تیغ‌ها با رنگ `--tigh` می‌آیند، همان کهربایی تعامل. */

function HedgehogFace({ state }: { state: FaceState }) {
  switch (state) {
    case 'smug':
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M62 62 q5 -4 10 0" />
          <path d="M84 62 q5 -4 10 0" />
          <path d="M70 82 q9 7 18 -2" />
        </g>
      );
    case 'hurt':
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M62 58 q5 5 10 3" />
          <path d="M94 58 q-5 5 -10 3" />
          <circle cx="68" cy="66" r="3" fill="var(--color-shab)" stroke="none" />
          <circle cx="88" cy="66" r="3" fill="var(--color-shab)" stroke="none" />
          <path d="M70 86 q9 -6 18 0" />
        </g>
      );
    case 'guilty':
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M62 64 q5 3 10 0" />
          <path d="M84 64 q5 3 10 0" />
          <path d="M72 85 h14" />
        </g>
      );
    default:
      return (
        <g stroke="var(--color-shab)" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <circle cx="68" cy="63" r="3.4" fill="var(--color-shab)" stroke="none" />
          <circle cx="88" cy="63" r="3.4" fill="var(--color-shab)" stroke="none" />
          <path d="M70 84 q9 5 18 0" />
        </g>
      );
  }
}

const SPIKES = [
  'M46 34 L34 12 L58 26 Z',
  'M62 26 L58 4 L76 22 Z',
  'M80 24 L84 4 L96 26 Z',
  'M30 50 L8 40 L30 34 Z',
  'M26 70 L2 70 L26 58 Z',
  'M30 90 L8 100 L34 96 Z',
];

export function Hedgehog({
  face = 'neutral',
  className = '',
  title = 'جوجه‌تیغی',
}: {
  face?: FaceState;
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 120 130" role="img" aria-label={title} className={className}>
      {SPIKES.map((d, index) => (
        <path key={index} d={d} fill="var(--color-tigh)" opacity="0.85" />
      ))}

      {/* بدن */}
      <path
        d="M52 24 C86 24 108 46 108 74 C108 100 88 114 62 114 C34 114 20 96 20 70 C20 44 30 24 52 24 Z"
        fill="var(--color-tigh)"
      />
      {/* صورت روشن */}
      <path
        d="M78 44 C98 44 110 58 110 76 C110 96 94 110 74 110 C58 110 50 96 50 78 C50 58 60 44 78 44 Z"
        fill="var(--color-mahtab)"
      />
      <circle cx="104" cy="76" r="4.5" fill="var(--color-shab)" />

      <AnimatePresence mode="wait">
        <motion.g
          key={face}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <HedgehogFace state={face} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
