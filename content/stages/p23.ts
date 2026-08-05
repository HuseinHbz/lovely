import { defineStage } from '../schema';

/** برگه ۲۳ — شرط آشتی. دیالوگ از `STORY-28.md` بخش PHASE 23. */
export const p23 = defineStage({
  id: 'p23',
  folder: 5,
  title: 'شرط آشتی',
  skin: 'interrogation',
  mapNode: 'conflict',
  achievement: 'ghafase-ketab',
  setting: 'work',
  wardrobe: { wolf: 'formal', hedgehog: 'storm' },
  lines: [
    {
      speaker: 'hedgehog',
      text: 'کیلو کیلو طلا باشه. قفسه قفسه کتاب باشه. از همه رنگش گل باشه. کمد کمد اکسسوری باشه. شاید آشتی کردم.',
    },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه می‌کند؟',
      options: [
        {
          id: 'start-shopping',
          label: 'باشه. از طلا شروع می‌کنم.',
          reaction:
            'گرگ فهرست را جدی گرفت و رفت خرید. برگشت و فهمید فهرست اصلاً درباره‌ی خرید نبود.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'books-only',
          label: 'قفسه‌ی کتاب را می‌توانم. بقیه‌اش را نه.',
          reaction:
            'گرگ صادقانه گفت چه‌کاری از دستش برمی‌آید. صداقت در فهرست نبود، ولی بیشتر از فهرست جواب داد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'wait',
          label: 'الان جوابت را نمی‌خواهم. وقتی آرام شدی حرف می‌زنیم.',
          reaction:
            'گرگ در این لحظه یک نکته‌ی مهم را فهمید: قیمت آشتی را نباید از زبان کسی که عصبانی است پرسید.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'negotiate-list',
          label: 'کمد اکسسوری قابل مذاکره است؟',
          reaction: 'گرگ وسط قهر وارد مذاکره شد. طوفان یک درجه بیشتر شد و بعد، بی‌دلیل، خنده آمد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
      ],
    },
  ],
  meters: { mokhtome: -1 },
  panda:
    'فهرست شرایط آشتی ضمیمه شد. برآورد هزینه: غیرقابل محاسبه. برآورد نیت واقعی: «حواست به من باشه».',
});
