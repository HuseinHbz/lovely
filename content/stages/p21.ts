import { defineStage } from '../schema';

/** برگه ۲۱ — ملکه. دیالوگ از `STORY-28.md` بخش PHASE 21. */
export const p21 = defineStage({
  id: 'p21',
  folder: 5,
  title: 'ملکه',
  skin: 'interrogation',
  setting: 'work',
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  lines: [
    { speaker: 'wolf', text: 'تو ملکه‌ای.' },
    { speaker: 'hedgehog', text: 'ملکه‌ها اینجوری باهاشون رفتار نمی‌شه.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه می‌گوید؟',
      options: [
        {
          id: 'youre-right',
          label: 'راست می‌گی. حرف قشنگ کافی نیست.',
          reaction: 'گرگ پذیرفت. این کوتاه‌ترین و مفیدترین جمله‌ی او در کل دفتر پنجم است.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'but-i-meant',
          label: 'منظورم این نبود.',
          reaction:
            'گرگ منظورش را توضیح داد. منظور مشکل نبود؛ رفتار بود. توضیح رفتار را عوض نمی‌کند.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'more-words',
          label: 'یک تعریف قشنگ‌تر پیدا می‌کنم.',
          reaction:
            'گرگ فکر کرد مشکل کیفیت تعریف بوده. تعریف بعدی قشنگ‌تر بود و دقیقاً همان‌قدر بی‌اثر.',
          reactionSpeaker: 'nazoo',
          stamp: 'مردود',
          draft: true,
        },
      ],
    },
  ],
  panda: 'حرف قشنگ جای رفتار درست را نمی‌گیرد. این جمله در دبیرخانه قاب شد.',
});
