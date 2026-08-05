import { defineStage } from '../schema';

/**
 * برگه ۰۶ — «من منم». `STORY-28.md` بخش PHASE 06.
 * `MERGED-SPEC` بخش ۶ برای این برگه تعامل بازیکن نگذاشته؛ فقط ثبت می‌شود.
 */
export const p06 = defineStage({
  id: 'p06',
  folder: 2,
  title: 'من منم',
  skin: 'mind',
  lines: [
    { speaker: 'hedgehog', text: 'من منم سننع.' },
    {
      speaker: 'nazoo',
      text: 'این جمله کوتاه، احتمالاً مهم‌ترین فلسفه‌ی زندگی جوجه‌تیغی بود.',
    },
    {
      speaker: 'nazoo',
      text: 'گرگ سه بار خواست جوابش را بدهد. هر سه بار پشیمان شد. این تنها تصمیم درست آن هفته بود.',
    },
  ],
  interactions: [],
  panda:
    'به‌عنوان فلسفه‌ی رسمی متهم دوم ثبت شد. تلاش برای تفسیر آن ممنوع است. تلاش برای تغییر آن بی‌فایده است.',
});
