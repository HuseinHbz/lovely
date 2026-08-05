import { defineStage } from '../schema';

/** برگه ۰۷ — حادثه‌ی پاندا. دیالوگ از `STORY-28.md` بخش PHASE 07. */
export const p07 = defineStage({
  id: 'p07',
  folder: 2,
  title: 'حادثه‌ی پاندا',
  skin: 'interrogation',
  mapNode: 'panda',
  achievement: 'panda-bigonah',
  // `setting` عمداً خالی است: این صحنه از راه دور اتفاق می‌افتد. گرگ سر کار
  // است و جوجه‌تیغی از بیرون ریپلای می‌زند، پس یک «محیط» مشترک ندارند و
  // قاعده‌ی لباس — که درباره‌ی *دیده شدن در یک مکان* است — اینجا موضوعیت ندارد.
  wardrobe: { wolf: 'desk', hedgehog: 'casual' },
  lines: [
    { speaker: 'nazoo', text: 'گرگ عکسی از میز کارش منتشر کرد. در تصویر، یک پاندا نشسته بود.' },
    { speaker: 'hedgehog', text: 'اون پانداعه کل ابهت سیستم رو برد زیر سؤال.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه جواب می‌دهد؟',
      options: [
        {
          id: 'never-disagrees',
          label: 'تنها عضو تیمه که هیچ‌وقت باهام مخالفت نمی‌کنه.',
          reaction: 'جواب گرفت: «خوبه باز یکی باهات موافقه.» پرونده این را برد متهم دوم ثبت کرد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'defend',
          label: 'به پاندا کاری نداشته باش.',
          reaction:
            'گرگ از پاندا دفاع کرد. پاندا بدون اینکه بداند، وارد رابطه‌ای شد که هیچ نقشی در آن نداشت.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'seen',
          label: 'سین می‌کنم و جواب نمی‌دهم.',
          reaction:
            'سکوت هم یک اظهارنظر است. متهم دوم آن را یادداشت کرد؛ یادداشت‌هایش پاک نمی‌شوند.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
      ],
    },
  ],
  meters: { shavahed: 1, amniyat: 1 },
  panda:
    'پاندا رسماً اعلام بی‌طرفی کرد. پاندا در هیچ‌یک از اختلافات این پرونده طرف کسی را نگرفته و قصد هم ندارد.',
});
