'use client';

import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ForestMap } from '@/components/art/ForestMap';
import { Button } from '@/components/ui/Button';
import { faNumber } from '@/lib/format';
import { MAP_NODES } from '@/content/map';
import { useStoryStore } from '@/lib/store';
import { playSound } from '@/lib/sound';

/**
 * اسکین ۳ — نقشه‌ی جنگل.
 *
 * pan و zoom در موبایل: بزرگنمایی با دو دکمه‌ی صریح انجام می‌شود، نه با pinch.
 * دلیلش این است که pinch روی صفحه‌ی کوچک با اسکرول صفحه دعوا می‌کند و کاربر
 * کیبوردی هم راهی به آن ندارد؛ دکمه هر دو مشکل را ندارد و `aria-label` می‌گیرد.
 * جابه‌جایی با کشیدن انگشت داخل قاب اسکرول‌شونده انجام می‌شود.
 */
export function MapSkin({
  children,
  unlocked,
  onSelect,
  selectableIds,
}: {
  children?: ReactNode;
  unlocked: readonly string[];
  onSelect?: ((nodeId: string) => void) | undefined;
  selectableIds?: readonly string[] | undefined;
}) {
  const [zoom, setZoom] = useState(1);
  const [foundClip, setFoundClip] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const soundOn = useStoryStore((state) => state.soundOn);
  const markEgg = useStoryStore((state) => state.markEgg);

  return (
    <section className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-card items-center justify-between gap-3">
        <p className="font-ui text-xs tracking-[0.04em] text-jooheh-text">
          {faNumber(unlocked.length)} نقطه از {faNumber(MAP_NODES.length)} روشن شده
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            aria-label="کوچک‌نمایی نقشه"
            disabled={zoom <= 1}
            onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
            className="px-3"
          >
            −
          </Button>
          <Button
            variant="outline"
            aria-label="بزرگ‌نمایی نقشه"
            disabled={zoom >= 3}
            onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
            className="px-3"
          >
            +
          </Button>
        </div>
      </div>

      <div className="w-full max-w-card overflow-auto rounded-lg border border-jooheh/30 bg-shab">
        <div style={{ width: `${zoom * 100}%` }} className="aspect-square">
          <ForestMap
            unlocked={unlocked}
            onSelect={onSelect}
            selectableIds={selectableIds}
            onSecretFound={() => {
              setFoundClip(true);
              markEgg('hairclip');
              playSound('pin', soundOn);
            }}
            className="h-full w-full"
          />
        </div>
      </div>

      {foundClip && (
        <motion.p
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.35 }}
          className="w-full max-w-card rounded-md border border-dashed border-tigh/50 px-4 py-3 text-sm leading-[1.9] text-mahtab"
        >
          یک گل‌سر، لای درخت‌ها. در هیچ صورت‌جلسه‌ای ثبت نشده و صاحبش هم چیزی نگفته. دبیرخانه آن را
          همان‌جا می‌گذارد — بعضی چیزها مدرک نیستند، فقط یادگاری‌اند.
        </motion.p>
      )}

      {/* فهرست متنی همان نقاط — راه دسترسی برای کاربر کیبورد و صفحه‌خوان */}
      <ul className="flex w-full max-w-card flex-wrap gap-2">
        {MAP_NODES.map((node) => {
          const isOn = unlocked.includes(node.id);
          return (
            <li
              key={node.id}
              className={`rounded-full border px-3 py-1 font-ui text-xs ${
                isOn ? 'border-tigh text-tigh' : 'border-jooheh/40 text-jooheh-text'
              }`}
            >
              {node.label}
            </li>
          );
        })}
      </ul>

      {children}
    </section>
  );
}
