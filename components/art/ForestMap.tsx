'use client';

import { motion, useReducedMotion } from 'motion/react';
import { MAP_NODES } from '@/content/map';

/**
 * نقشه‌ی جنگل با نه نقطه.
 *
 * مختصات از `content/map.ts` می‌آید (درصدی روی viewBox صد در صد)، پس نقشه و
 * محتوا نمی‌توانند از هم جدا بیفتند.
 *
 * پین خاموش فقط یک دایره‌ی توخالی است؛ پین روشن رنگ کهربایی می‌گیرد و دایره‌ی
 * جوهر دورش باز می‌شود (بخش ۴ سند).
 */
export function ForestMap({
  unlocked,
  onSelect,
  selectableIds,
  onSecretFound,
  className = '',
}: {
  unlocked: readonly string[];
  onSelect?: ((nodeId: string) => void) | undefined;
  /** فقط این نقطه‌ها قابل کلیک‌اند؛ بقیه تزئینی می‌مانند. */
  selectableIds?: readonly string[] | undefined;
  /**
   * Easter Egg فاز ۶ — گل‌سر مخفی.
   *
   * سند فازبندی نسخه ۱ گل‌سر را «در موزه» گذاشته بود، ولی در ساختار ۲۸ برگه‌ای
   * هیچ موزه‌ای وجود ندارد. نزدیک‌ترین معادلش نقشه است: تنها جای پروژه که
   * گشتن در آن معنی دارد. گل‌سر لای درخت‌های گوشه‌ی پایین-چپ است و هیچ نشانه‌ای
   * ندارد؛ فقط کسی پیدایش می‌کند که واقعاً بگردد.
   */
  onSecretFound?: (() => void) | undefined;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;

  // نقش SVG به محتوایش بستگی دارد.
  //
  // `role="img"` یعنی «این یک تصویر واحد است» و محتوایش برای صفحه‌خوان
  // presentational می‌شود — پس یک کنترل focusable داخلش (گل‌سر) هم غیرقابل
  // دسترس می‌ماند و هم axe آن را `nested-interactive` می‌گیرد. وقتی چیز
  // تعاملی داخل نقشه هست، نقش به `group` می‌رود که اجازه‌ی فرزند focusable
  // دارد. فهرست متنی نقاط هم در `MapSkin` جداگانه هست.
  const interactive = onSecretFound !== undefined || onSelect !== undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label="نقشه‌ی جنگل"
    >
      {/* زمین */}
      <rect width="100" height="100" fill="var(--color-kaj)" opacity="0.35" rx="2" />

      {/* رودخانه */}
      <path
        d="M-2 34 C18 30 26 46 44 44 C64 42 70 60 88 58 C96 57 100 62 104 60"
        fill="none"
        stroke="var(--color-jooheh)"
        strokeWidth="1.6"
        opacity="0.5"
      />

      {/* درخت‌ها — تزئینی، کاملاً بیرون از مسیر پین‌ها */}
      {[
        [10, 12],
        [88, 16],
        [62, 12],
        [16, 42],
        [92, 42],
        [8, 66],
        [40, 68],
        [86, 80],
        [66, 92],
        [24, 92],
      ].map(([x, y], index) => (
        <path
          key={index}
          d={`M${x} ${(y ?? 0) + 4} L${(x ?? 0) - 3} ${(y ?? 0) + 4} L${x} ${(y ?? 0) - 4} L${(x ?? 0) + 3} ${(y ?? 0) + 4} Z`}
          fill="var(--color-kaj)"
          opacity="0.8"
        />
      ))}

      {MAP_NODES.map((node) => {
        const isOn = unlocked.includes(node.id);
        const isSelectable = onSelect !== undefined && (selectableIds ?? []).includes(node.id);

        return (
          <g key={node.id}>
            {isOn && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={5}
                fill="var(--color-tigh)"
                initial={reduceMotion ? { opacity: 0.25 } : { scale: 0, opacity: 0.6 }}
                animate={reduceMotion ? { opacity: 0.25 } : { scale: 1, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.2 : 1.1 }}
              />
            )}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={isOn ? 2.1 : 1.6}
              fill={isOn ? 'var(--color-tigh)' : 'transparent'}
              stroke={isOn ? 'var(--color-tigh)' : 'var(--color-jooheh)'}
              strokeWidth="0.7"
              initial={reduceMotion ? false : { scale: 0 }}
              animate={reduceMotion ? {} : { scale: [0, 1.2, 1] }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              style={isSelectable ? { cursor: 'pointer' } : {}}
              onClick={isSelectable ? () => onSelect(node.id) : undefined}
            />
            <text
              x={node.x}
              y={node.y - 3.4}
              textAnchor="middle"
              className="font-ui"
              fontSize="2.6"
              fill={isOn ? 'var(--color-mahtab)' : 'var(--color-jooheh)'}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* گل‌سر مخفی — بدون برچسب، لای درخت‌های گوشه. */}
      {onSecretFound !== undefined && (
        <g
          onClick={onSecretFound}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          aria-label="یک چیز کوچک لای درخت‌ها"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSecretFound();
            }
          }}
        >
          {/* سطح کلیک بزرگ‌تر از خود گل‌سر، وگرنه روی موبایل غیرقابل زدن است */}
          <circle cx="21.5" cy="88.5" r="4" fill="transparent" />
          <path
            d="M20 88 q1.5 -2 3 0 q1.5 2 -1.5 2.4 q-3 -0.4 -1.5 -2.4 Z"
            fill="var(--color-tigh)"
            opacity="0.55"
          />
          <circle cx="21.5" cy="88.4" r="0.5" fill="var(--color-mahtab)" opacity="0.8" />
        </g>
      )}
    </svg>
  );
}
