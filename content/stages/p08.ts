import { defineStage } from '../schema';

/** برگه ۰۸ — Close Friends. `STORY-28.md` بخش PHASE 08. */
export const p08 = defineStage({
  id: 'p08',
  folder: 2,
  title: 'فهرست نزدیکان',
  skin: 'mind',
  setting: { wolf: 'home', hedgehog: 'home' },
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [
    { speaker: 'nazoo', text: 'فهرست نزدیکان ساخته شد. یک نفر داخلش بود.' },
    { speaker: 'nazoo', text: 'استوری منتشر شد: متن یک آهنگ، و اشاره‌ای که خیلی مستقیم نبود.' },
    { speaker: 'nazoo', text: 'گاهی سکوت هم یک انتخاب است.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ واکنش نشان می‌دهد یا نه؟',
      options: [
        {
          id: 'react',
          label: 'جواب می‌دهم. اشاره را گرفتم.',
          reaction:
            'گرگ اشاره را گرفت و جواب داد. در تمام این پرونده، این یکی از معدود دفعاتی است که به‌موقع فهمید.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'silence',
          label: 'چیزی نمی‌گویم.',
          reaction: 'سکوت ثبت شد. طرف مقابل آن را دید و چیزی نگفت، که خودش نوع دیگری از سکوت است.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
        {
          id: 'pretend',
          label: 'وانمود می‌کنم ندیدم.',
          reaction:
            'گرگ وانمود کرد ندیده. فهرست نزدیکان یک نفره است؛ وانمود کردن در فهرست یک‌نفره جواب نمی‌دهد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مردود',
        },
      ],
    },
  ],
  panda:
    'مدرک شماره ۰۸. نوع: اشاره‌ی غیرمستقیم. وضعیت: دریافت شد. تأیید دریافت: بستگی به انتخاب دارد.',
});
