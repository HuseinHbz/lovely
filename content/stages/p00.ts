import { defineStage } from '../schema';

/**
 * برگه ۰۰ — Intro. متن راوی از `STORY-28.md` بخش PHASE 00.
 *
 * `MERGED-SPEC` بخش ۶ برای این برگه تعامل بازیکن ندارد («—»)، پس فقط روایت است
 * و یک دکمه‌ی ادامه. به همین دلیل اسکیما اجازه‌ی `interactions: []` می‌دهد.
 */
export const p00 = defineStage({
  id: 'p00',
  folder: 1,
  title: 'تشکیل پرونده',
  skin: 'cover',
  lines: [
    { speaker: 'nazoo', text: 'بعضی داستان‌ها با یک نگاه شروع می‌شوند.' },
    { speaker: 'nazoo', text: 'بعضی‌ها با یک پیام.' },
    { speaker: 'nazoo', text: 'بعضی‌ها هم… با دخالت یک جغد رئیس.' },
    {
      speaker: 'nazoo',
      text: 'یکی گرگ بود. یکی جوجه‌تیغی. و هیچ‌کدام نمی‌دانستند قرار است این آشنایی چقدر طول بکشد.',
    },
  ],
  interactions: [],
  panda: 'پرونده‌ای که با دخالت یک جغد باز شد.',
});
