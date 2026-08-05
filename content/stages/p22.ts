import { defineStage } from '../schema';

/** برگه ۲۲ — دادگاه دوم. دیالوگ از `STORY-28.md` بخش PHASE 22. */
export const p22 = defineStage({
  id: 'p22',
  folder: 5,
  title: 'دادگاه دوم',
  skin: 'interrogation',
  setting: { wolf: 'work', hedgehog: 'hospital' },
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  lines: [
    { speaker: 'nazoo', text: 'پرونده دوباره روی میز آمد. این بار سنگین‌تر بود.' },
    { speaker: 'hedgehog', text: 'پرونده‌ات به اندازه‌ی صفحات رمان شوهر آهو خانم سنگینه.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'دفاع گرگ چیست؟',
      options: [
        {
          id: 'lawyer',
          label: 'پس من باید وکیل بگیرم نه گل بخرم.',
          reaction:
            'دادگاه خندید. خنده در دادگاه سابقه ندارد، ولی این پرونده از اول هم قانونی نبود.',
          reactionSpeaker: 'nazoo',
          stamp: 'وکیل خبر شد',
          draft: true,
        },
        {
          id: 'plead',
          label: 'قبول دارم. سنگینه.',
          reaction: 'گرگ اتهام را پذیرفت. حجم پرونده کم نشد، ولی برای اولین بار کسی سرش داد نزد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'counter',
          label: 'پرونده‌ی تو هم نازک نیست.',
          reaction: 'گرگ پرونده‌ی متقابل باز کرد. حالا دو پرونده‌ی سنگین داریم و همان یک مشکل.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
      ],
    },
  ],
  panda: 'پرونده به قطر رمان رسید. دبیرخانه اعلام کرد قفسه‌ی جدیدی لازم است.',
});
