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

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
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

/**
 * رنگ نیمه‌شفاف را روی پس‌زمینه می‌نشاند.
 *
 * لازم است چون Tailwind `text-kaj/70` را به همان رنگ با آلفا تبدیل می‌کند و
 * چیزی که چشم (و WCAG) می‌بیند، حاصل ترکیب است نه رنگ خام.
 */
function composite(fgHex, bgHex, alpha) {
  const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const mixed = [0, 1, 2].map((i) =>
    Math.round(alpha * channel(fgHex, i) + (1 - alpha) * channel(bgHex, i)),
  );
  return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
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

  // ------------------------------------------------------------------
  // واریانت‌های نیمه‌شفاف — نقطه‌ی کوری که فاز ۷ پیدا کرد.
  //
  // این فایل قبلاً فقط رنگ‌های خام را می‌سنجید و `kaj / mahtab` با ۹٫۲۵ سبز
  // بود، در حالی که UI همه‌جا `text-kaj/70` می‌نوشت که روی همان کاغذ به
  // ۴٫۲۰ می‌رسید و AA را رد می‌کرد. یعنی گارد سبز بود و رابط قرمز.
  // هر آلفایی که در UI استفاده می‌شود باید همین‌جا ردیف خودش را داشته باشد.
  // ------------------------------------------------------------------
  { fg: 'kaj', bg: 'mahtab', alpha: 0.8, min: 4.5, note: 'برچسب و متن ثانویه روی کاغذ' },
];

/**
 * کمینه‌ی آلفای مجاز برای هر رنگ متن، وقتی روی کاغذ می‌نشیند.
 *
 * عدد محاسبه‌شده است، نه حدسی: `kaj/72` روی کاغذ ۴٫۴۰ می‌دهد و رد می‌شود،
 * `kaj/73` می‌شود ۴٫۵۳ و اولین مقدار قبولی است. در UI از ۸۰ استفاده می‌کنیم
 * (۵٫۴۷) تا حاشیه‌ی امن داشته باشد، ولی حد شکست همین ۷۳ است.
 */
const MIN_TEXT_ALPHA = { kaj: 73 };

let failed = 0;
const rows = pairs.map(({ fg, bg, min, note, alpha }) => {
  const rawFg = palette[fg];
  const bgHex = palette[bg];
  const label = alpha === undefined ? `${fg} / ${bg}` : `${fg}/${Math.round(alpha * 100)} / ${bg}`;
  if (!rawFg || !bgHex) {
    failed += 1;
    return { pair: label, value: '—', min, ok: false, note: 'رنگ در پالت نیست' };
  }
  const fgHex = alpha === undefined ? rawFg : composite(rawFg, bgHex, alpha);
  const value = ratio(fgHex, bgHex);
  const ok = value >= min;
  if (!ok) failed += 1;
  return { pair: label, value: value.toFixed(2), min, ok, note };
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
 * جست‌وجوی کد برای متن نیمه‌شفافِ کم‌کنتراست.
 *
 * جدول بالا فقط ترکیب‌هایی را می‌سنجد که کسی یادش بوده اضافه کند. این بخش
 * برعکس عمل می‌کند: هر `text-<رنگ>/<عدد>` را در `components/` و `app/` پیدا
 * می‌کند و اگر عددش از حد امن پایین‌تر باشد خطا می‌دهد — حتی اگر ردیفی
 * برایش ننوشته باشیم.
 */
function scanAlphaUsage() {
  const problems = [];
  const roots = [join(root, 'components'), join(root, 'app')];
  const files = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules') walk(full);
      } else if (/\.(tsx?|css)$/.test(entry)) {
        files.push(full);
      }
    }
  };
  for (const dir of roots) if (existsSync(dir)) walk(dir);

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    source.split('\n').forEach((line, index) => {
      // کامنت‌ها را نادیده بگیر — وگرنه توضیحی که می‌گوید «قبلاً text-kaj/45
      // بود» خودش باعث خطا می‌شود.
      const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
      if (/^\s*[*]/.test(line)) return;

      for (const match of code.matchAll(/\btext-([a-z-]+)\/(\d{1,3})\b/g)) {
        const [, token, value] = match;
        const floor = MIN_TEXT_ALPHA[token];
        if (floor !== undefined && Number(value) < floor) {
          problems.push(
            `${file.slice(root.length + 1)}:${index + 1} — text-${token}/${value} زیر حد امن ${floor}`,
          );
        }
      }
    });
  }
  return problems;
}

const alphaProblems = scanAlphaUsage();
if (alphaProblems.length > 0) {
  failed += alphaProblems.length;
  console.log('\nمتن نیمه‌شفاف کم‌کنتراست:');
  for (const problem of alphaProblems) console.log(`❌  ${problem}`);
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
