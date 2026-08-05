#!/usr/bin/env node
/**
 * تست محتوا — فاز ۷.
 *
 *   node scripts/test-content.mjs
 *
 * دو چیز را می‌سنجد که `validate-content.mjs` نمی‌سنجد:
 *
 *   ۱. **هیچ نام واقعی در محتوا، UI یا کد نیست.** قاعده ۴ پروژه.
 *   ۲. **هیچ مسیری بن‌بست نیست.** ثابت‌شده به‌صورت ساختاری، نه نمونه‌ای.
 *
 * ---
 *
 * ## چرا فهرست ممنوعه به‌صورت هش است، نه متن ساده
 *
 * یک فایل که فهرست نام‌های واقعی را به‌صورت متن ساده نگه دارد، **خودش** همان
 * چیزی را لو می‌دهد که قرار است جلویش را بگیرد — به‌خصوص در مخزنی که عمومی
 * است. پس اینجا فقط هش SHA-256 (۱۶ کاراکتر اول) نگه داشته می‌شود.
 *
 * روش کار: هر واژه‌ی متن نرمال و هش می‌شود و با فهرست مقایسه می‌شود. از روی
 * هش نمی‌شود نام را بازساخت، ولی اگر نامی در محتوا بیاید، هشش برابر می‌شود و
 * تست می‌شکند.
 *
 * محدودیت صادقانه: این روش فقط **واژه‌ی کامل** را می‌گیرد. برای چیزهایی که
 * نام داخلشان چسبیده است (ایمیل، دامنه، شماره تلفن) الگوهای ساختاری جداگانه
 * چک می‌شوند. برای بازبینی سخت‌گیرانه‌تر می‌شود یک فایل `.forbidden-names`
 * کنار مخزن گذاشت (در `.gitignore` هست) که هر خطش یک واژه‌ی ساده است؛ اگر
 * باشد، جست‌وجوی زیررشته‌ای هم انجام می‌شود.
 */

import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./ts-loader.mjs', pathToFileURL(`${import.meta.dirname}/`));

const repoRoot = join(import.meta.dirname, '..');

/** سطحی که قاعده ۴ رویش حرف می‌زند: «کد، UI یا محتوا». */
const SCANNED = ['content', 'components', 'app', 'lib'];
const SCANNED_EXT = new Set(['.ts', '.tsx', '.css', '.json', '.svg']);

/**
 * هش نام‌های ممنوعه. متن ساده‌شان عمداً هیچ‌جای این مخزن نیست.
 * برای افزودن مورد تازه، هشش را با همان `normalise` پایین بساز.
 */
const BLOCKED_HASHES = new Set([
  'e37c8b67a6413c5b',
  '84481685a95ce3d8',
  '44e66a79afd2c4ae',
  'd77c55c628ee3ecf',
  '192effcecea16d76',
  '50e1e1d7e8a2bee7',
  '10a9569b42c0ace8',
  'f359246d5eb3fca7',
  '39593e8a6750dd03',
  'e2a2e0eac9b7b767',
  '6b4dd43fec5260e6',
  '1b9e08c5d43f1b85',
  '8e45e55fde70b589',
  'aa53a259e056f35d',
  '7103a261bebcb6d4',
]);

/** الگوهای ساختاری — چیزهایی که حتی بدون دانستن نام هم نباید در محتوا باشند. */
const STRUCTURAL = [
  { name: 'نشانی ایمیل', re: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi },
  { name: 'شماره‌ی موبایل ایران', re: /(?:\+?98|0)9\d{9}/g },
  { name: 'شماره‌ی طولانی (احتمال شماره‌ی واقعی)', re: /\b\d{10,}\b/g },
  { name: 'نشانی اینستاگرام/تلگرام', re: /(?:instagram\.com|t\.me|telegram\.me)\/\S+/gi },
];

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/‌/g, '')
    .replace(/[يی]/g, 'ی')
    .replace(/[كک]/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[ً-ْ]/g, '')
    .trim();
}

const hash = (word) => createHash('sha256').update(normalise(word)).digest('hex').slice(0, 16);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.next') continue;
      walk(full, out);
    } else if (SCANNED_EXT.has(extname(entry))) {
      out.push(full);
    }
  }
  return out;
}

const errors = [];
let filesScanned = 0;
let wordsChecked = 0;

// فهرست اختیاری متن ساده، اگر کاربر محلی گذاشته باشد.
const extraPath = join(repoRoot, '.forbidden-names');
const extraWords = existsSync(extraPath)
  ? readFileSync(extraPath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('#'))
  : [];

for (const dir of SCANNED) {
  const full = join(repoRoot, dir);
  if (!existsSync(full)) continue;

  for (const file of walk(full)) {
    filesScanned += 1;
    const source = readFileSync(file, 'utf8');
    const where = relative(repoRoot, file);

    source.split('\n').forEach((line, index) => {
      const lineNo = index + 1;

      // ۱) واژه‌به‌واژه، با هش
      for (const word of line.split(/[^\p{L}\p{N}_@.-]+/u)) {
        if (word.length < 3) continue;
        wordsChecked += 1;
        if (BLOCKED_HASHES.has(hash(word))) {
          errors.push(`${where}:${lineNo} — واژه‌ی ممنوعه پیدا شد`);
        }
      }

      // ۲) الگوهای ساختاری
      for (const { name, re } of STRUCTURAL) {
        re.lastIndex = 0;
        if (re.test(line)) errors.push(`${where}:${lineNo} — ${name}`);
      }

      // ۳) زیررشته‌ای، فقط اگر فهرست محلی موجود باشد
      const flat = normalise(line);
      for (const word of extraWords) {
        if (flat.includes(normalise(word))) {
          errors.push(`${where}:${lineNo} — واژه‌ی فهرست محلی پیدا شد`);
        }
      }
    });
  }
}

// ---------------------------------------------------------------------------
// تست مسیر — ساختاری
//
// موتور خطی است: `getNextStageId` فقط `STAGES[index + 1]` را برمی‌گرداند و در
// کل اسکیما هیچ فیلد `goto`/`branch`/`nextStage` وجود ندارد. یعنی انتخاب‌ها
// روی مسیر اثر ندارند و «هر ترکیب گزینه‌ها» به همان دنباله‌ی ۲۸ برگه می‌رسد.
// پس پوشش کامل یعنی: هر گزینه‌ی هر برگه یک واکنش بدهد و هر برگه (جز آخری) یک
// برگه‌ی بعد داشته باشد — نه ضرب دکارتی ۳^۱۹ حالت که نه شدنی است نه لازم.
// ---------------------------------------------------------------------------

const { STAGES } = await import('../content/index.ts');
const { getNextStageId, reactionsFor } = await import('../lib/engine.ts');

let optionsCovered = 0;
let interactionsCovered = 0;

for (const [index, stage] of STAGES.entries()) {
  const isLast = index === STAGES.length - 1;
  const next = getNextStageId(stage.id);

  if (!isLast && next === undefined) {
    errors.push(`${stage.id}: برگه‌ی بعد ندارد — بن‌بست`);
  }
  if (isLast && next !== undefined) {
    errors.push(`${stage.id}: آخرین برگه است ولی برگه‌ی بعد دارد`);
  }

  for (const interaction of stage.interactions) {
    interactionsCovered += 1;
    const options =
      interaction.kind === 'choice' || interaction.kind === 'pick' ? interaction.options : [];

    // تعامل‌های بدون گزینه (split/find) خودشان `onDone` دارند و در تست مرورگر
    // پوشش داده می‌شوند؛ اینجا فقط وجود مقصدشان مهم است.
    for (const option of options) {
      optionsCovered += 1;
      const reactions = reactionsFor(interaction, [option.id]);
      if (reactions.length === 0) {
        errors.push(`${stage.id}/${option.id}: انتخاب این گزینه هیچ واکنشی برنمی‌گرداند`);
      }
      if (option.reaction === undefined || option.reaction.trim() === '') {
        errors.push(`${stage.id}/${option.id}: بدون واکنش`);
      }
    }
  }
}

// ---------------------------------------------------------------------------

const green = (s) => `[32m${s}[0m`;
const red = (s) => `[31m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

console.log('\nتست محتوا و مسیر\n');

if (errors.length > 0) {
  console.log(red(`${errors.length} ایراد:\n`));
  for (const error of errors) console.log(`  ${red('✗')} ${error}`);
  console.log('');
  process.exit(1);
}

console.log(`  ${green('✓')} هیچ نام واقعی در ${filesScanned} فایل کد/UI/محتوا نیست`);
console.log(`  ${green('✓')} هیچ ایمیل، شماره تلفن یا نشانی شبکه‌ی اجتماعی نیست`);
console.log(`  ${green('✓')} هر ${optionsCovered} گزینه واکنش دارد`);
console.log(`  ${green('✓')} هر ${STAGES.length} برگه مقصد دارد — هیچ بن‌بستی نیست`);
console.log('');
console.log(dim(`  ${wordsChecked} واژه بررسی شد · ${interactionsCovered} تعامل`));
console.log(
  dim(
    extraWords.length > 0
      ? `  فهرست محلی .forbidden-names با ${extraWords.length} واژه هم اعمال شد`
      : '  فهرست محلی .forbidden-names موجود نیست — فقط بررسی هش انجام شد',
  ),
);
console.log('');
