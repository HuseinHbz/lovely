import { defineStage } from '../schema';

/** مرحله ۱ — احراز هویت جوجه‌تیغی. متن کامل از `docs/STORY.md`. */
export const s01 = defineStage({
  id: 's01',
  act: 1,
  title: 'احراز هویت جوجه‌تیغی',
  skin: 'interrogation',
  lines: [
    {
      speaker: 'nazoo',
      text: 'آیا شما همان جوجه‌تیغی مظلومی هستید که همیشه بی‌دلیل متهم می‌شود؟',
    },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      options: [
        {
          id: 'mazloom',
          label: 'بله، من سراسر مظلومیتم.',
          reaction:
            'سیستم پس از بررسی سوابق، با عبارت «همیشه بی‌گناهم» مواجه شد. ادعای مظلومیت در دست بررسی است.',
          reactionSpeaker: 'system',
        },
        {
          id: 'salite',
          label: 'نه، من سلیطه‌ام.',
          reaction: 'اعتراف داوطلبانه ثبت شد. پاندا تحت تأثیر صداقت متهم قرار گرفت.',
          reactionSpeaker: 'system',
        },
        {
          id: 'salite-mazloom',
          label: 'یک سلیطه‌ی مظلومم.',
          reaction: 'هویت تأیید شد: سلیطه‌ی مظلوم.',
          reactionSpeaker: 'system',
        },
      ],
    },
  ],
});
