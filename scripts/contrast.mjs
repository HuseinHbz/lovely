#!/usr/bin/env node
/**
 * تست کنتراست پالت — معیار پذیرش فاز ۱.
 *
 * رنگ‌ها را مستقیم از `app/globals.css` می‌خواند تا هیچ‌وقت از پالت واقعی عقب نماند،
 * نسبت کنتراست WCAG 2.1 هر جفت را حساب می‌کند و اگر جفتی از حد خودش بیفتد
 * با کد خروج ۱ تمام می‌شود.
 *
 *   node scripts/contrast.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'app', 'globals.css'), 'utf8');

/** رنگ‌های `--color-*` را از بلوک @theme بیرون می‌کشد. */
function readPalette(source) {
  const palette = {};
  const pattern = /--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    palette[match[1]] = match[2];
  }
  return palette;
}

/** روشنایی نسبی طبق WCAG 2.1 */
function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const palette = readPalette(css);

/**
 * جفت‌هایی که واقعاً در UI کنار هم می‌نشینند.
 * `min` حد لازم است: ۴٫۵ برای متن معمولی AA، ۳ برای متن بزرگ و اجزای غیرمتنی.
 */
const pairs = [
  { fg: 'mahtab', bg: 'shab', min: 4.5, note: 'متن اصلی روی پس‌زمینه‌ی شب' },
  { fg: 'tigh', bg: 'shab', min: 4.5, note: 'گزینه و CTA روی پس‌زمینه‌ی شب' },
  { fg: 'jooheh', bg: 'shab', min: 3, note: 'خط و حاشیه — غیرمتنی، برای متن استفاده نشود' },
  { fg: 'jooheh-text', bg: 'shab', min: 4.5, note: 'متن ثانویه روی پس‌زمینه‌ی شب' },
  { fg: 'shab', bg: 'mahtab', min: 4.5, note: 'متن تیره روی کاغذ پرونده' },
  { fg: 'kaj', bg: 'mahtab', min: 4.5, note: 'متن سبز روی کاغذ' },
  { fg: 'mohr', bg: 'mahtab', min: 3, note: 'مُهر روی کاغذ — عنصر گرافیکی' },
  { fg: 'mahtab', bg: 'kaj', min: 4.5, note: 'متن روی لایه‌ی میانی (اسکین ذهن)' },
  { fg: 'shab', bg: 'tigh', min: 4.5, note: 'متن دکمه‌ی پرشده' },
];

let failed = 0;
const rows = pairs.map(({ fg, bg, min, note }) => {
  const fgHex = palette[fg];
  const bgHex = palette[bg];
  if (!fgHex || !bgHex) {
    failed += 1;
    return { pair: `${fg} / ${bg}`, value: '—', min, ok: false, note: 'رنگ در پالت نیست' };
  }
  const value = ratio(fgHex, bgHex);
  const ok = value >= min;
  if (!ok) failed += 1;
  return { pair: `${fg} / ${bg}`, value: value.toFixed(2), min, ok, note };
});

const width = Math.max(...rows.map((r) => r.pair.length));
console.log('\nکنتراست پالت — WCAG 2.1\n');
for (const row of rows) {
  const mark = row.ok ? '✅' : '❌';
  console.log(
    `${mark}  ${row.pair.padEnd(width)}  ${String(row.value).padStart(5)} : 1   (حداقل ${row.min})   ${row.note}`,
  );
}

/**
 * تنها رنگ لفظی مجاز خارج از globals.css در `lib/theme.ts` است، چون
 * `<meta name="theme-color">` متغیر CSS قبول نمی‌کند. اینجا مطمئن می‌شویم
 * از `--color-shab` جدا نیفتاده.
 */
const themeSource = readFileSync(join(root, 'lib', 'theme.ts'), 'utf8');
const themeColor = /THEME_COLOR\s*=\s*'(#[0-9a-fA-F]{6})'/.exec(themeSource)?.[1];
if (themeColor?.toLowerCase() !== palette.shab?.toLowerCase()) {
  console.error(`\n❌ THEME_COLOR (${themeColor}) با --color-shab (${palette.shab}) یکی نیست.\n`);
  failed += 1;
} else {
  console.log(`\n✅  THEME_COLOR با --color-shab یکی است (${themeColor})`);
}

if (failed > 0) {
  console.error(`\n${failed} مورد از حد خودش افتاد.\n`);
  process.exit(1);
}
console.log('\nهمه‌ی جفت‌ها پاس شدند.\n');
