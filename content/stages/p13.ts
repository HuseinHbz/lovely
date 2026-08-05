import { defineStage } from '../schema';

/**
 * برگه ۱۳ — قرارداد بغل. `STORY-28.md` بخش PHASE 13.
 * تعامل `split` است: بندهای قرارداد باید بین «قابل امضا» و «نیاز به اصلاح» تقسیم شوند.
 */
export const p13 = defineStage({
  id: 'p13',
  folder: 3,
  title: 'قرارداد بغل',
  skin: 'interrogation',
  setting: { wolf: 'home', hedgehog: 'home' },
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  faces: { wolf: 'smug', hedgehog: 'laughing' },
  lines: [
    { speaker: 'wolf', text: 'نا محرمی دیگه وگرنه بغلت می‌کردم.' },
    { speaker: 'hedgehog', text: 'از اون بغل‌های زورکی؟' },
    { speaker: 'wolf', text: 'بغلت کردم، در مدت معلوم، با مهر معلوم…' },
    {
      speaker: 'nazoo',
      text: 'و بدین ترتیب، ساده‌ترین بغل تاریخ به یک قرارداد حقوقی تبدیل شد.',
    },
  ],
  interactions: [
    {
      kind: 'split',
      prompt: 'بندهای قرارداد را مرتب کن.',
      buckets: [
        { id: 'sign', label: 'قابل امضا' },
        { id: 'amend', label: 'نیاز به اصلاح' },
      ],
      cards: [
        { id: 'consent', label: 'با رضایت هر دو طرف', bucket: 'sign' },
        { id: 'no-force', label: 'بدون اجبار', bucket: 'sign' },
        { id: 'anytime-cancel', label: 'هر طرف هر وقت بخواهد می‌تواند لغو کند', bucket: 'sign' },
        { id: 'fixed-duration', label: 'در مدت معلوم، با مهر معلوم', bucket: 'amend' },
      ],
      rejections: [
        {
          cardId: 'fixed-duration',
          bucketId: 'sign',
          reaction: 'بندی که برای بغل «مدت» و «مهر» تعیین می‌کند، بغل نیست. قرارداد اجاره است.',
        },
        {
          cardId: 'consent',
          bucketId: 'amend',
          reaction: 'رضایت دوطرفه اصلاح نمی‌خواهد. اگر بخواهد، اصلاً قرارداد نیست.',
        },
      ],
      message:
        'قرارداد با سه بند امضا شد و یک بند به دبیرخانه برگشت. تعهد سالم با اجبار شروع نمی‌شود.',
    },
  ],
  meters: { dadresi: 1, shavahed: 1 },
  panda:
    'قرارداد در دبیرخانه ثبت شد. موضوع: یک بغل. تعداد بندها: بیش از نیاز. تعداد امضاها: هنوز صفر.',
});
