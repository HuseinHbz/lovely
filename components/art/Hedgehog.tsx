'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { FaceState } from './faces';
import type { HedgehogOutfit } from '@/lib/wardrobe';

/**
 * جوجه‌تیغی — تمام‌قد، با لباس.
 *
 * راهنمای شخصیت: داخل بیمارستان همیشه روپوش پرستاری، کفش سفید، موی جمع،
 * کارت پرسنلی. بیرون مانتوی کوتاه اسپرت یا هودی، جین، کتانی سفید، موی باز.
 * شیفت شب همان روپوش با چشم خواب‌آلود و لیوان قهوه. حالت طوفانی همان روپوش
 * با ابر و رعد بالای سر.
 *
 * تیغ‌ها با `--tigh` می‌آیند — همان کهربایی که اسمش از روی همین شخصیت است.
 */

const QUILL = 'var(--color-tigh)';
const SKIN = 'var(--color-mahtab)';
const INK = 'var(--color-shab)';

function Brows({ state }: { state: FaceState }) {
  const stroke = { stroke: INK, strokeWidth: 2.8, strokeLinecap: 'round' as const, fill: 'none' };
  switch (state) {
    case 'furious':
      return (
        <g {...stroke}>
          <path d="M62 44 l14 7" />
          <path d="M110 44 l-14 7" />
        </g>
      );
    case 'annoyed':
      return (
        <g {...stroke}>
          <path d="M62 46 l14 3" />
          <path d="M110 42 l-14 5" />
        </g>
      );
    case 'hurt':
    case 'crying':
      return (
        <g {...stroke}>
          <path d="M62 50 l14 -6" />
          <path d="M110 50 l-14 -6" />
        </g>
      );
    case 'smug':
      return (
        <g {...stroke}>
          <path d="M62 46 q7 -6 14 -2" />
          <path d="M96 44 q7 -4 14 2" />
        </g>
      );
    default:
      return (
        <g {...stroke}>
          <path d="M62 45 q7 -3 14 0" />
          <path d="M96 45 q7 -3 14 0" />
        </g>
      );
  }
}

function Eyes({ state }: { state: FaceState }) {
  if (state === 'laughing' || state === 'melting') {
    return (
      <g stroke={INK} strokeWidth="2.8" strokeLinecap="round" fill="none">
        <path d="M66 60 q7 -6 14 0" />
        <path d="M92 60 q7 -6 14 0" />
      </g>
    );
  }
  // شیفت شب: پلک نیمه‌افتاده
  const sleepy = state === 'annoyed';
  return (
    <g>
      <ellipse cx="73" cy="60" rx="8.5" ry={sleepy ? 5 : 8.5} fill="var(--color-sefid)" />
      <ellipse cx="99" cy="60" rx="8.5" ry={sleepy ? 5 : 8.5} fill="var(--color-sefid)" />
      <circle cx="74" cy="61" r={sleepy ? 3.4 : 4.6} fill={INK} />
      <circle cx="100" cy="61" r={sleepy ? 3.4 : 4.6} fill={INK} />
      <circle cx="76" cy="59" r="1.5" fill="var(--color-sefid)" />
      <circle cx="102" cy="59" r="1.5" fill="var(--color-sefid)" />
      {state === 'crying' && (
        <g fill="var(--color-abi)" opacity="0.8">
          <ellipse cx="69" cy="73" rx="2.4" ry="4.4" />
          <ellipse cx="103" cy="75" rx="2.4" ry="4.4" />
        </g>
      )}
    </g>
  );
}

function Mouth({ state }: { state: FaceState }) {
  const stroke = { stroke: INK, strokeWidth: 2.8, strokeLinecap: 'round' as const, fill: 'none' };
  switch (state) {
    case 'laughing':
      return <path d="M74 84 q12 14 24 0 Z" fill={INK} />;
    case 'furious':
      return <path d="M74 90 q12 -10 24 0" {...stroke} />;
    case 'annoyed':
      return <path d="M76 88 q10 -3 20 0" {...stroke} />;
    case 'hurt':
    case 'crying':
      return <path d="M74 90 q12 -9 24 0" {...stroke} />;
    case 'smug':
      return <path d="M74 85 q12 9 24 -4" {...stroke} />;
    case 'guilty':
      return <path d="M78 88 h16" {...stroke} />;
    case 'melting':
      return <path d="M74 86 q12 5 24 -2" {...stroke} />;
    default:
      return <path d="M74 84 q12 8 24 0" {...stroke} />;
  }
}

const QUILLS = [
  'M56 34 L40 6 L72 24 Z',
  'M76 24 L72 -2 L94 18 Z',
  'M100 22 L108 -2 L120 26 Z',
  'M40 56 L12 44 L40 38 Z',
  'M126 52 L154 42 L128 34 Z',
  'M36 78 L8 82 L38 66 Z',
];

/** موی باز — فقط بیرون از بیمارستان. */
function LooseHair() {
  return (
    <g fill={QUILL} opacity="0.9">
      <path d="M40 60 q-10 40 4 62 q10 -34 6 -62 Z" />
      <path d="M132 60 q10 40 -4 62 q-10 -34 -6 -62 Z" />
    </g>
  );
}

function NurseBody({ sleepy = false }: { sleepy?: boolean }) {
  return (
    <g>
      {/* شلوار روپوش */}
      <path d="M64 200 h20 v82 h-20 Z" fill="var(--color-parastari)" />
      <path d="M92 200 h20 v82 h-20 Z" fill="var(--color-parastari)" />
      {/* کفش سفید */}
      <path d="M60 282 h26 q6 0 6 6 v6 H60 Z" fill="var(--color-sefid)" />
      <path d="M90 282 h26 q6 0 6 6 v6 H90 Z" fill="var(--color-sefid)" />

      {/* روپوش */}
      <path d="M54 124 q0 -14 16 -18 h36 q16 4 16 18 v84 h-68 Z" fill="var(--color-sefid)" />
      <path d="M88 106 l-14 12 v16 l14 -14 Z" fill="var(--color-parastari)" opacity="0.45" />
      <path d="M88 106 l14 12 v16 l-14 -14 Z" fill="var(--color-parastari)" opacity="0.45" />
      {/* جیب + کارت پرسنلی */}
      <path d="M62 168 h24 v22 h-24 Z" fill="var(--color-parastari)" opacity="0.35" />
      <rect x="98" y="150" width="18" height="24" rx="2" fill="var(--color-parastari)" />
      <rect x="101" y="155" width="12" height="3" rx="1.5" fill="var(--color-sefid)" />
      <rect x="101" y="161" width="12" height="3" rx="1.5" fill="var(--color-sefid)" />
      <path d="M107 132 v18" stroke="var(--color-parastari)" strokeWidth="2" />
      {/* آستین‌ها */}
      <path d="M46 130 q-8 36 -2 68 h18 q-4 -34 -2 -68 Z" fill="var(--color-sefid)" />
      <path d="M130 130 q8 36 2 68 h-18 q4 -34 2 -68 Z" fill="var(--color-sefid)" />
      <circle cx="49" cy="206" r="9" fill={SKIN} />
      <circle cx="127" cy="206" r="9" fill={SKIN} />

      {sleepy && (
        <g>
          {/* لیوان قهوه‌ی شیفت شب */}
          <path d="M132 216 h20 l-3 22 h-14 Z" fill="var(--color-sefid)" />
          <path d="M132 216 h20 v4 h-20 Z" fill="var(--color-parastari)" />
          <path d="M152 221 q9 5 0 12" stroke="var(--color-sefid)" strokeWidth="2.6" fill="none" />
          <path
            d="M138 208 q4 -8 0 -14 M146 208 q4 -8 0 -14"
            stroke="var(--color-sefid)"
            strokeWidth="2"
            fill="none"
            opacity="0.55"
          />
        </g>
      )}
    </g>
  );
}

function CasualBody() {
  return (
    <g>
      {/* جین */}
      <path d="M64 200 h20 v82 h-20 Z" fill="var(--color-jean)" />
      <path d="M92 200 h20 v82 h-20 Z" fill="var(--color-jean)" />
      <path d="M64 200 h48 v10 h-48 Z" fill="var(--color-jean)" opacity="0.6" />
      {/* کتانی سفید */}
      <path d="M60 282 h26 q7 0 7 7 v5 H60 Z" fill="var(--color-sefid)" />
      <path d="M90 282 h26 q7 0 7 7 v5 H90 Z" fill="var(--color-sefid)" />
      {/* مانتوی کوتاه اسپرت */}
      <path d="M54 124 q0 -14 16 -18 h36 q16 4 16 18 v80 h-68 Z" fill="var(--color-kaj)" />
      <path d="M88 106 v98" stroke={INK} strokeWidth="2" opacity="0.35" />
      <path d="M70 140 h14 v4 h-14 Z" fill="var(--color-tigh)" opacity="0.6" />
      <path d="M46 130 q-8 34 -2 64 h18 q-4 -32 -2 -64 Z" fill="var(--color-kaj)" />
      <path d="M130 130 q8 34 2 64 h-18 q4 -32 2 -64 Z" fill="var(--color-kaj)" />
      <circle cx="49" cy="202" r="9" fill={SKIN} />
      <circle cx="127" cy="202" r="9" fill={SKIN} />
    </g>
  );
}

/** ابر و رعد بالای سر — حالت طوفانی. */
function StormCloud() {
  return (
    <g aria-hidden="true">
      <ellipse cx="86" cy="-8" rx="30" ry="14" fill="var(--color-jooheh)" opacity="0.9" />
      <ellipse cx="62" cy="-2" rx="18" ry="11" fill="var(--color-jooheh)" opacity="0.8" />
      <ellipse cx="112" cy="-2" rx="18" ry="11" fill="var(--color-jooheh)" opacity="0.8" />
      <path d="M84 8 l-8 14 h9 l-6 14 l16 -18 h-9 l7 -10 Z" fill={QUILL} />
    </g>
  );
}

export function Hedgehog({
  face = 'neutral',
  outfit = 'nurse',
  className = '',
  title = 'جوجه‌تیغی',
}: {
  face?: FaceState;
  outfit?: HedgehogOutfit;
  className?: string;
  title?: string;
}) {
  const isNurseFamily = outfit !== 'casual';

  return (
    <svg viewBox="-10 -30 200 330" role="img" aria-label={title} className={className}>
      {outfit === 'storm' && <StormCloud />}

      {isNurseFamily ? <NurseBody sleepy={outfit === 'night-shift'} /> : <CasualBody />}

      {/* گردن */}
      <path d="M78 92 h20 v20 h-20 Z" fill={SKIN} />

      {/* تیغ‌ها */}
      {QUILLS.map((d, index) => (
        <path key={index} d={d} fill={QUILL} opacity="0.9" />
      ))}
      {outfit === 'casual' && <LooseHair />}

      {/* سر */}
      <path
        d="M86 18 C120 18 138 40 138 66 C138 92 116 108 86 108 C56 108 34 92 34 66 C34 40 52 18 86 18 Z"
        fill={QUILL}
      />
      {/* صورت روشن */}
      <path
        d="M86 36 C112 36 126 52 126 72 C126 94 108 108 86 108 C64 108 46 94 46 72 C46 52 60 36 86 36 Z"
        fill={SKIN}
      />
      {/* بینی */}
      <ellipse cx="86" cy="76" rx="5" ry="3.6" fill={INK} />

      {/* موی جمع‌شده — فقط وقتی روپوش تن اوست */}
      {isNurseFamily && (
        <g>
          <circle cx="86" cy="18" r="12" fill={QUILL} />
          <circle cx="86" cy="18" r="12" fill={INK} opacity="0.18" />
        </g>
      )}

      <AnimatePresence mode="wait">
        <motion.g
          key={face}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <Brows state={face} />
          <Eyes state={face} />
          <Mouth state={face} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
