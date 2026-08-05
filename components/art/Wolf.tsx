'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { FaceState } from '@/lib/faces';
import type { WolfOutfit } from '@/lib/wardrobe';

/**
 * گرگ — تمام‌قد، با لباس.
 *
 * راهنمای شخصیت: گرگ خاکستری خوش‌تیپ، قدبلند، چشم آبی، لبخند شیطنت‌آمیز،
 * همیشه مرتب. در محیط کاری همیشه کت و شلوار سرمه‌ای با پیراهن سفید و
 * کراوات زرشکی؛ بیرون هودی و جین و کتانی سفید.
 *
 * لایه‌بندی از عقب به جلو: پاها → تنه و لباس → دست‌ها → گردن → سر → صورت.
 * فقط گروه صورت با `AnimatePresence` عوض می‌شود.
 */

const FUR = 'var(--color-khakestari)';
const FUR_DARK = 'var(--color-khakestari-tire)';
const INK = 'var(--color-shab)';

function Brows({ state }: { state: FaceState }) {
  const stroke = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  switch (state) {
    case 'smug':
      return (
        <g {...stroke}>
          <path d="M40 40 q8 -6 16 -2" />
          <path d="M74 38 q8 -4 16 2" />
        </g>
      );
    case 'furious':
    case 'annoyed':
      return (
        <g {...stroke}>
          <path d="M40 36 l16 8" />
          <path d="M90 36 l-16 8" />
        </g>
      );
    case 'hurt':
    case 'crying':
      return (
        <g {...stroke}>
          <path d="M40 44 l16 -6" />
          <path d="M90 44 l-16 -6" />
        </g>
      );
    case 'guilty':
      return (
        <g {...stroke}>
          <path d="M40 42 q8 4 16 0" />
          <path d="M74 42 q8 4 16 0" />
        </g>
      );
    default:
      return (
        <g {...stroke}>
          <path d="M40 39 q8 -3 16 0" />
          <path d="M74 39 q8 -3 16 0" />
        </g>
      );
  }
}

/** چشم آبی — نشانه‌ی ثابت شخصیت. در حالت‌های بسته به خط تبدیل می‌شود. */
function Eyes({ state }: { state: FaceState }) {
  const closed = state === 'laughing' || state === 'melting';
  if (closed) {
    return (
      <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M46 55 q7 -7 14 0" />
        <path d="M70 55 q7 -7 14 0" />
      </g>
    );
  }
  const squint = state === 'annoyed' ? 0.55 : 1;
  return (
    <g>
      <ellipse cx="53" cy="55" rx="9" ry={9 * squint} fill="var(--color-sefid)" />
      <ellipse cx="77" cy="55" rx="9" ry={9 * squint} fill="var(--color-sefid)" />
      <circle cx="54" cy="55" r={5 * squint} fill="var(--color-abi)" />
      <circle cx="78" cy="55" r={5 * squint} fill="var(--color-abi)" />
      <circle cx="54" cy="55" r={2.4 * squint} fill={INK} />
      <circle cx="78" cy="55" r={2.4 * squint} fill={INK} />
      <circle cx="56" cy="53" r="1.6" fill="var(--color-sefid)" />
      <circle cx="80" cy="53" r="1.6" fill="var(--color-sefid)" />
      {state === 'crying' && (
        <g fill="var(--color-abi)" opacity="0.75">
          <ellipse cx="49" cy="68" rx="2.6" ry="4.6" />
          <ellipse cx="81" cy="70" rx="2.6" ry="4.6" />
        </g>
      )}
    </g>
  );
}

function Mouth({ state }: { state: FaceState }) {
  const stroke = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  switch (state) {
    // لبخند شیطنت‌آمیز — نشانه‌ی ثابت گرگ
    case 'smug':
      return (
        <g {...stroke}>
          <path d="M56 84 q12 10 24 -4" />
          <path d="M80 80 l3 -4" />
        </g>
      );
    case 'laughing':
      return (
        <g>
          <path d="M56 82 q11 16 22 0 Z" fill={INK} />
          <path d="M60 82 q7 8 14 0 Z" fill="var(--color-mohr)" opacity="0.55" />
        </g>
      );
    case 'furious':
      return <path d="M56 88 q11 -10 22 0" {...stroke} />;
    case 'annoyed':
      return <path d="M56 86 h22" {...stroke} />;
    case 'hurt':
    case 'crying':
      return <path d="M56 88 q11 -8 22 0" {...stroke} />;
    case 'guilty':
      return <path d="M58 86 h18" {...stroke} />;
    case 'melting':
      return <path d="M56 84 q11 6 22 -2" {...stroke} />;
    default:
      return <path d="M56 82 q11 8 22 0" {...stroke} />;
  }
}

function FormalBody() {
  return (
    <g>
      {/* پاها — شلوار سرمه‌ای */}
      <path d="M64 208 h20 v76 h-20 Z" fill="var(--color-sormeii)" />
      <path d="M96 208 h20 v76 h-20 Z" fill="var(--color-sormeii)" />
      {/* کفش رسمی */}
      <path d="M60 284 h26 q6 0 6 6 v6 H60 Z" fill={INK} />
      <path d="M94 284 h26 q6 0 6 6 v6 H94 Z" fill={INK} />

      {/* پیراهن سفید — فقط باریکه‌ی وسط سینه، بقیه زیر کت است */}
      <path d="M74 110 h32 v104 h-32 Z" fill="var(--color-sefid)" />
      {/* کراوات زرشکی */}
      <path d="M86 122 h8 l4 6 l-5 56 l-3 8 l-3 -8 l-5 -56 Z" fill="var(--color-zereshki)" />
      <path d="M84 112 h12 l3 8 l-9 8 l-9 -8 Z" fill="var(--color-zereshki)" />
      {/* کت — دو لنگه که یقه‌ی V می‌سازند */}
      <path
        d="M54 124 q0 -14 16 -18 l16 -4 l4 20 l-12 12 l6 82 h-34 q-6 -46 -4 -92 Z"
        fill="var(--color-sormeii)"
      />
      <path
        d="M126 124 q0 -14 -16 -18 l-16 -4 l-4 20 l12 12 l-6 82 h34 q6 -46 4 -92 Z"
        fill="var(--color-sormeii)"
      />
      {/* یقه‌ی برگشته */}
      <path d="M86 102 l4 20 l-14 12 l-8 -22 Z" fill="var(--color-sormeii-tire)" />
      <path d="M94 102 l-4 20 l14 12 l8 -22 Z" fill="var(--color-sormeii-tire)" />
      {/* دستمال جیب */}
      <path d="M62 148 h12 v5 h-12 Z" fill="var(--color-sefid)" opacity="0.9" />

      {/* دست‌ها + ساعت کلاسیک */}
      <path d="M46 126 q-8 40 -2 76 h18 q-4 -40 -2 -76 Z" fill="var(--color-sormeii)" />
      <path d="M134 126 q8 40 2 76 h-18 q4 -40 2 -76 Z" fill="var(--color-sormeii)" />
      <rect x="118" y="196" width="18" height="6" rx="2" fill="var(--color-tigh)" />
      <circle cx="127" cy="199" r="6" fill="var(--color-sefid)" stroke={INK} strokeWidth="1.6" />
      <circle cx="49" cy="210" r="9" fill={FUR} />
      <circle cx="131" cy="210" r="9" fill={FUR} />
    </g>
  );
}

function CasualBody() {
  return (
    <g>
      {/* شلوار جین */}
      <path d="M64 206 h22 v78 h-22 Z" fill="var(--color-jean)" />
      <path d="M94 206 h22 v78 h-22 Z" fill="var(--color-jean)" />
      <path d="M64 206 h52 v10 h-52 Z" fill="var(--color-jean)" opacity="0.6" />
      {/* کتانی سفید */}
      <path d="M60 284 h26 q7 0 7 7 v5 H60 Z" fill="var(--color-sefid)" />
      <path d="M94 284 h26 q7 0 7 7 v5 H94 Z" fill="var(--color-sefid)" />

      {/* هودی */}
      <path d="M56 122 q0 -14 16 -18 h36 q16 4 16 18 v88 h-68 Z" fill={FUR_DARK} />
      <path d="M76 104 q14 14 28 0 q-4 20 -14 20 q-10 0 -14 -20 Z" fill={INK} opacity="0.3" />
      <path d="M86 118 v34" stroke="var(--color-sefid)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M94 118 v34" stroke="var(--color-sefid)" strokeWidth="2.6" strokeLinecap="round" />
      {/* جیب کانگورویی */}
      <path d="M68 168 h44 v26 h-44 Z" fill={INK} opacity="0.16" />
      {/* آستین‌ها + ساعت */}
      <path d="M48 128 q-8 40 -2 74 h18 q-4 -38 -2 -74 Z" fill={FUR_DARK} />
      <path d="M132 128 q8 40 2 74 h-18 q4 -38 2 -74 Z" fill={FUR_DARK} />
      <rect x="118" y="196" width="17" height="6" rx="2" fill="var(--color-tigh)" />
      <circle cx="126" cy="199" r="5.6" fill="var(--color-sefid)" stroke={INK} strokeWidth="1.5" />
      <circle cx="51" cy="210" r="9" fill={FUR} />
      <circle cx="129" cy="210" r="9" fill={FUR} />
    </g>
  );
}

/** پشت لپ‌تاپ: باز هم کت و شلوار، به‌علاوه‌ی میز و مانیتور و قهوه. */
function DeskProps() {
  return (
    <g>
      {/* میز */}
      <path d="M20 244 h140 v8 h-140 Z" fill="var(--color-kaj)" />
      {/* لپ‌تاپ */}
      <path d="M56 214 h50 l6 30 h-62 Z" fill={INK} />
      <path d="M62 218 h38 l4 22 h-46 Z" fill="var(--color-abi)" opacity="0.5" />
      <path d="M68 224 h24 M68 230 h18 M68 236 h28" stroke="var(--color-sefid)" strokeWidth="1.6" />
      {/* لیوان قهوه */}
      <path d="M126 226 h18 l-3 18 h-12 Z" fill="var(--color-sefid)" />
      <path d="M126 226 h18 v4 h-18 Z" fill={FUR_DARK} />
      <path d="M144 230 q8 4 0 10" stroke="var(--color-sefid)" strokeWidth="2.6" fill="none" />
    </g>
  );
}

export function Wolf({
  face = 'neutral',
  outfit = 'formal',
  className = '',
  title = 'گرگ',
}: {
  face?: FaceState;
  outfit?: WolfOutfit;
  className?: string;
  title?: string;
}) {
  return (
    // همان viewBox جوجه‌تیغی، تا دو شخصیت در یک عرض CSS هم‌مقیاس بمانند.
    <svg viewBox="-10 -30 200 330" role="img" aria-label={title} className={className}>
      {outfit === 'desk' && <DeskProps />}

      {outfit === 'casual' ? <CasualBody /> : <FormalBody />}

      {/* گردن */}
      <path d="M78 88 h24 v22 h-24 Z" fill={FUR_DARK} />

      {/* گوش‌ها */}
      <path d="M44 44 L52 4 L76 30 Z" fill={FUR} />
      <path d="M136 44 L128 4 L104 30 Z" fill={FUR} />
      <path d="M50 40 L55 16 L69 32 Z" fill={FUR_DARK} />
      <path d="M130 40 L125 16 L111 32 Z" fill={FUR_DARK} />

      {/* سر */}
      <path
        d="M90 16 C124 16 140 40 140 62 C140 90 118 104 90 104 C62 104 40 90 40 62 C40 40 56 16 90 16 Z"
        fill={FUR}
      />
      {/* پوزه */}
      <path
        d="M90 62 C106 62 116 72 116 82 C116 96 104 104 90 104 C76 104 64 96 64 82 C64 72 74 62 90 62 Z"
        fill="var(--color-sefid)"
      />
      <path d="M90 68 L97 75 L90 80 L83 75 Z" fill={INK} />

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
