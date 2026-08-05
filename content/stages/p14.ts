import { defineStage } from '../schema';

/**
 * برگه ۱۴ — اژدها. دیالوگ از `STORY-28.md` بخش PHASE 14.
 * لایه‌ی پاندا برای همین برگه در `MERGED-SPEC` بخش ۲ نمونه آمده و عیناً استفاده شد.
 */
export const p14 = defineStage({
  id: 'p14',
  folder: 3,
  title: 'اژدها',
  skin: 'mind',
  mapNode: 'dragon',
  achievement: 'gorg-sookhte',
  lines: [
    { speaker: 'hedgehog', text: 'کاش اژدها بودم.' },
    { speaker: 'wolf', text: 'می‌خوای به آتیش بکشونی یا قورت بدی؟' },
    { speaker: 'nazoo', text: 'جواب نیامد. آتش آمد.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ بعد از سوختن چه می‌گوید؟',
      options: [
        {
          id: 'burned',
          label: 'سوختم.',
          reaction: 'جواب گرفت: «خوبت شد.» پرونده این را پایان کامل و منصفانه‌ی ماجرا می‌داند.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'again',
          label: 'یه بار دیگه.',
          reaction:
            'گرگ درخواست تکرار داد. اژدها بدون مکث اجابت کرد. این تنها درخواستی است که در این پرونده سریع جواب گرفت.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'insurance',
          label: 'بیمه‌ی آتش‌سوزی داریم؟',
          reaction:
            'گرگ وسط سوختن سراغ بیمه رفت. مدیر پروژه بودن گاهی در بدترین لحظات خودش را نشان می‌دهد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
      ],
    },
  ],
  meters: { ezharat: 2, amniyat: 1 },
  panda:
    'مدرک شماره ۱۴ ثبت شد. نوع حادثه: آتش‌سوزی عمدی. خسارت: یک گرگ. پیگرد قانونی: منتفی، چون متهم بامزه بود.',
});
