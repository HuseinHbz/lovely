import { defineStage } from '../schema';

/** برگه ۱۱ — خانواده‌ی آینده. دیالوگ از `STORY-28.md` بخش PHASE 11. */
export const p11 = defineStage({
  id: 'p11',
  folder: 3,
  title: 'خانواده‌ی آینده',
  skin: 'interrogation',
  setting: { wolf: 'home', hedgehog: 'home' },
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  faces: { wolf: 'neutral', hedgehog: 'melting' },
  lines: [
    { speaker: 'nazoo', text: 'بحث به مادرشوهر و خواهرشوهر و بچه‌ها رسید. کسی نپرسید چطور.' },
    { speaker: 'hedgehog', text: 'دوس ندارم بچه‌هام عمه داشته باشن.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه واکنشی نشان می‌دهد؟',
      options: [
        {
          id: 'eee',
          label: 'اییی.',
          reaction:
            'گرگ کل تحلیلش را در چهار حرف خلاصه کرد. پرونده این را دقیق‌ترین جواب او تا اینجا می‌داند.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'negotiate',
          label: 'سر عمه می‌شود مذاکره کرد.',
          reaction:
            'گرگ پیشنهاد مذاکره داد. طرف مقابل اعلام کرد این بند غیرقابل مذاکره است و جلسه بسته شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مردود',
        },
        {
          id: 'slow-down',
          label: 'ما هنوز درباره‌ی خودمان به نتیجه نرسیده‌ایم.',
          reaction:
            'حرف درستی بود. آن‌ها هنوز درباره‌ی رابطه‌شان به نتیجه نرسیده بودند، اما ظاهراً ساختار خانواده‌ی آینده تقریباً کامل شده بود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
      ],
    },
  ],
  panda: 'ساختار خانواده کامل شد، رابطه نه. پرونده ترتیب این دو را عجیب ولی مرسوم می‌داند.',
});
