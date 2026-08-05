import { defineStage } from '../schema';

/** برگه ۱۲ — چت شبانه. دیالوگ از `STORY-28.md` بخش PHASE 12. ابی هم اینجاست. */
export const p12 = defineStage({
  id: 'p12',
  folder: 3,
  title: 'چت شبانه',
  skin: 'mind',
  mapNode: 'night',
  setting: 'night-shift',
  wardrobe: { wolf: 'casual', hedgehog: 'night-shift' },
  lines: [
    { speaker: 'nazoo', text: 'شب. هر دو خسته. ابی وسط، بدون هیچ نظری.' },
    { speaker: 'hedgehog', text: 'جیش مسواک بوس لالا.' },
    { speaker: 'wolf', text: 'کی رو بوس کردی؟' },
    { speaker: 'hedgehog', text: 'مامانم.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'کی زودتر می‌خوابد؟',
      options: [
        {
          id: 'you-first',
          label: 'تو بخواب، من بیدارم.',
          reaction:
            'گرگ گفت بیدار می‌ماند و بیدار ماند. ابی زودتر از هر دو خوابید و برنده‌ی واقعی همان شب بود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'both',
          label: 'با هم. سه، دو، یک.',
          reaction: 'شمارش انجام شد. هیچ‌کدام نخوابیدند. مسابقه به دلیل تقلب دوطرفه باطل اعلام شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'jealous',
          label: 'اول درباره‌ی این بوس حرف بزنیم.',
          reaction:
            'گرگ حسود شد و شوخی‌اش را پشت یک سؤال جدی قایم کرد. ابی سرش را بلند کرد و دوباره خوابید.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
      ],
    },
  ],
  panda: 'گزارش شیفت شب. ساعت خواب هیچ‌کدام ثبت نشد. تنها موجودی که به‌موقع خوابید، ابی بود.',
});
