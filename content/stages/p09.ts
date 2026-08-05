import { defineStage } from '../schema';

/** برگه ۰۹ — کل‌کل و لاس. دیالوگ از `STORY-28.md` بخش PHASE 09. */
export const p09 = defineStage({
  id: 'p09',
  folder: 3,
  title: 'کل‌کل',
  skin: 'interrogation',
  setting: 'outside',
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [{ speaker: 'hedgehog', text: 'همون آدمای آروم کسل‌کنندن.' }],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه می‌گوید؟',
      options: [
        {
          id: 'depends',
          label: 'بستگی داره طرف مقابلش کی باشه.',
          reaction: 'جواب گرفت: «اومم شاید.» پرونده این «شاید» را به‌عنوان مدرک علاقه ثبت کرد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'defend-calm',
          label: 'آروم بودن عیب نیست.',
          reaction:
            'گرگ از آرامش دفاع کرد. دفاعش منطقی بود و دقیقاً به همین دلیل کسی تحت تأثیر قرار نگرفت.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'agree',
          label: 'راست می‌گی. منم از خودم خسته می‌شم.',
          reaction: 'گرگ با طرف مقابل موافقت کرد تا بحث تمام شود. بحث تمام نشد، ولی خنده‌دار شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
      ],
    },
  ],
  meters: { shavahed: 2, ezharat: 1 },
  panda: 'مدرک علاقه ثبت شد. نوع مدرک: یک «شاید». ارزش حقوقی: صفر. ارزش پرونده‌ای: زیاد.',
});
