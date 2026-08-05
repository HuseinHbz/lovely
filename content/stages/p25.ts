import { defineStage } from '../schema';

/**
 * برگه ۲۵ — ترمیم. `STORY-28.md` بخش PHASE 25.
 * دیالوگ پیشنهادی سند عیناً به‌عنوان یکی از گزینه‌ها آمده.
 */
export const p25 = defineStage({
  id: 'p25',
  folder: 6,
  title: 'ترمیم',
  skin: 'interrogation',
  mapNode: 'repair',
  achievement: 'ashti',
  setting: 'outside',
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [{ speaker: 'nazoo', text: 'حالا نوبت گرگ بود که سهم خودش را بپذیرد. فقط سهم خودش.' }],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چطور مسئولیت می‌پذیرد؟',
      options: [
        {
          id: 'not-proving',
          label: 'من نمی‌خوام ثابت کنم حق با من بوده. می‌خوام بفهمم کجای رفتاری که کردم اذیتت کرد.',
          reaction:
            'و بعد اضافه کرد: «اگر چیزی اذیتت می‌کنه، لازم نیست حدس بزنم. خودت بهم بگو و من هم واضح‌تر حرف می‌زنم.» بهترین لحظه‌ی این پرونده همین بود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'both-wrong',
          label: 'هر دومون اشتباه کردیم.',
          reaction:
            'درست است، ولی زود گفته شد. وقتی هنوز سهم خودت را نگفته‌ای، «هر دومون» یعنی «تو هم».',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'promise',
          label: 'قول می‌دم دیگه تکرار نشه.',
          reaction:
            'قول داده شد. قول‌ها در این پرونده سابقه‌ی خوبی ندارند؛ توضیح‌ها سابقه‌ی بهتری دارند.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'listen',
          label: 'چیزی نمی‌گویم. فقط گوش می‌دهم.',
          reaction:
            'گرگ ساکت ماند و گوش داد. گاهی این کافی است — به شرطی که سکوت از سر شنیدن باشد نه از سر فرار.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
      ],
    },
  ],
  meters: { hamkari: 3, ezharat: 3, amniyat: 3, mokhtome: 4 },
  panda:
    'بهترین لحظه‌ی پرونده. برای اولین بار کسی دنبال برنده شدن در بحث نبود. دبیرخانه پیشنهاد داد این برگه قاب شود.',
});
