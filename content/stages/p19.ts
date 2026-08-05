import { defineStage } from '../schema';

/**
 * برگه ۱۹ — مسئله‌ی رئیس. `STORY-28.md` بخش PHASE 19.
 *
 * قانون ۱۴ سند: جغد رئیس فقط واسطه‌ی آشناییست و وارد جزئیات رابطه نمی‌شود.
 * تعامل `split` همین را می‌سازد: هر پرونده باید در کشوی خودش برود.
 */
export const p19 = defineStage({
  id: 'p19',
  folder: 4,
  title: 'مسئله‌ی رئیس',
  skin: 'interrogation',
  setting: 'hospital',
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  lines: [
    { speaker: 'hedgehog', text: 'من اصلاً نمی‌خوام رئیس بو ببره.' },
    {
      speaker: 'nazoo',
      text: 'گاهی سخت‌ترین دشمن یک رابطه، خانواده نیست. یک رئیس کنجکاو است.',
    },
    { speaker: 'owl', text: 'من فقط معرفی کردم؛ بقیه‌اش پرونده‌ی خودتان است.' },
  ],
  interactions: [
    {
      kind: 'split',
      prompt: 'هر پرونده را در کشوی خودش بگذار.',
      buckets: [
        { id: 'work', label: 'کار' },
        { id: 'family', label: 'خانواده' },
        { id: 'private', label: 'به میز من نمی‌آید' },
      ],
      cards: [
        { id: 'shift', label: 'شیفت و مرخصی', bucket: 'work' },
        { id: 'aunt', label: 'خاله بودن و فامیلی', bucket: 'family' },
        { id: 'relationship', label: 'رابطه', bucket: 'private' },
      ],
      rejections: [
        {
          cardId: 'relationship',
          bucketId: 'work',
          reaction: 'کشو پرونده را پس داد. این کشو فقط شیفت، مرخصی و گزارش قبول می‌کند.',
        },
        {
          cardId: 'shift',
          bucketId: 'private',
          reaction: 'جغد رئیس بدون اینکه سرش را بلند کند گفت: «نه.»',
        },
        {
          cardId: 'aunt',
          bucketId: 'work',
          reaction: 'این یکی از نظر فنی درست است، ولی از نظر اخلاقی فاجعه است.',
        },
      ],
      message:
        'هر سه پرونده سر جایشان رفتند. جغد رئیس کشوی سوم را بست و گفت فردا ساعت هفت شیفت دارید. شب بخیر.',
    },
  ],
  closing:
    'هیچ رابطه‌ای نباید امنیت شغلی یا آرامش کاری کسی را تهدید کند. پرونده‌ی بیمارستان حرفه‌ای و مستقل می‌ماند.',
  meters: { dadresi: 3, amniyat: 2 },
  panda:
    'ثبت شد: در کل این پرونده، تنها موجود کاملاً حرفه‌ای جغد رئیس بود. هیچ‌کدام از طرفین موفق نشدند از دیگری شکایت کنند. پاندا این را یک پیروزی بزرگ برای جنگل می‌داند.',
});
