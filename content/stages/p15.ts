import { defineStage } from '../schema';

/**
 * برگه ۱۵ — کفش سفید. `STORY-28.md` بخش PHASE 15.
 * تعامل `find` است: بازیکن باید مسیر تمیز را پیدا کند.
 */
export const p15 = defineStage({
  id: 'p15',
  folder: 4,
  title: 'کفش سفید',
  skin: 'map',
  achievement: 'kafsh-sefid',
  setting: { wolf: 'outside', hedgehog: 'outside' },
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [
    {
      speaker: 'nazoo',
      text: 'او کفش‌های سفیدش را دوست داشت. دنیا اما تصمیم گرفته بود شخصاً با این علاقه مخالفت کند.',
    },
    { speaker: 'wolf', text: 'از این‌ور بریم کوتاه‌تره.' },
    { speaker: 'nazoo', text: 'از آن‌ور گِل بود. گرگ این را بعداً فهمید.' },
  ],
  interactions: [
    {
      kind: 'find',
      hotspots: [
        {
          id: 'mud',
          label: 'میان‌بر گِلی',
          x: 30,
          y: 55,
          r: 9,
          correct: false,
          reaction: 'کفش سفید وارد گِل شد. پرونده‌ی خسارت همان‌جا باز شد و هنوز باز است.',
        },
        {
          id: 'stones',
          label: 'سنگ‌فرش',
          x: 62,
          y: 40,
          r: 9,
          correct: true,
          reaction: 'مسیر سنگ‌فرش انتخاب شد. کفش سالم ماند. گرگ برای اولین بار مسیر درست را دید.',
        },
        {
          id: 'grass',
          label: 'چمن',
          x: 48,
          y: 72,
          r: 9,
          correct: false,
          reaction: 'چمن خیس بود. کفش سفید نجات پیدا کرد ولی حیثیتش نه.',
        },
      ],
    },
  ],
  panda:
    'پرونده‌ی خسارت شماره ۱۵. مال‌الاجاره: یک جفت کفش سفید. متهم: دنیا. شریک جرم: هر میان‌بری که گرگ پیشنهاد داد.',
});
