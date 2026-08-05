import { defineStage } from '../schema';

/** برگه ۱۶ — مجموعه کلاه. `STORY-28.md` بخش PHASE 16. */
export const p16 = defineStage({
  id: 'p16',
  folder: 4,
  title: 'مجموعه کلاه',
  skin: 'interrogation',
  setting: 'outside',
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [
    { speaker: 'hedgehog', text: 'کلاهاتو پک کن برا من.' },
    { speaker: 'wolf', text: 'همشو نمی‌تونم تو سرم کنم.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: true,
      prompt: 'کدام کلاه‌ها پک می‌شوند؟',
      min: 1,
      options: [
        {
          id: 'cream',
          label: 'کرم',
          reaction: 'کرم رفت. گرگ گفت این را بیشتر از بقیه دوست داشت. کسی گوش نداد.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'black',
          label: 'مشکی',
          reaction: 'مشکی رفت. با همه‌چیز می‌آید و دقیقاً به همین دلیل اول از همه درخواست شد.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'navy',
          label: 'سرمه‌ای',
          reaction: 'سرمه‌ای رفت. هم‌رنگ کت و شلوار بود؛ گرگ متوجه این تناسب نشد.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'white',
          label: 'سفید',
          reaction: 'سفید رفت. با توجه به سابقه‌ی کفش سفید، پرونده نگران آینده‌ی این کلاه است.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'green',
          label: 'سبز',
          reaction: 'سبز رفت. هیچ‌کس نپرسید چرا سبز. سؤال‌های خوب معمولاً پرسیده نمی‌شوند.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
      ],
    },
  ],
  closing: 'هر تعداد که پک شد، درخواست بعدی برای بقیه‌شان هم خواهد آمد.',
  panda:
    'صورت‌جلسه‌ی تحویل اموال. تعداد کلاه‌های تحویل‌شده: به انتخاب متهم. تعداد کلاه‌های برگشتی تا امروز: صفر.',
});
