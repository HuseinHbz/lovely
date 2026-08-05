import { defineStage } from '../schema';

/** برگه ۰۲ — اولین چت. دیالوگ از `STORY-28.md` بخش PHASE 02. */
export const p02 = defineStage({
  id: 'p02',
  folder: 1,
  title: 'اولین چت',
  skin: 'interrogation',
  mapNode: 'first-chat',
  setting: { wolf: 'work', hedgehog: 'hospital' },
  wardrobe: { wolf: 'desk', hedgehog: 'nurse' },
  lines: [
    { speaker: 'nazoo', text: 'اولین مکالمه. هنوز هیچ‌کس نمی‌دانست دارد پرونده می‌سازد.' },
    { speaker: 'hedgehog', text: 'من منم.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه جواب می‌دهد؟',
      options: [
        {
          id: 'nickname',
          label: 'پس اسم مستعار لازم داری.',
          reaction:
            'و همین یک جمله، سیستم لقب‌گذاری را برای همیشه روشن کرد. گرگ فکر می‌کرد دارد شوخی می‌کند.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'not-an-answer',
          label: 'این که جواب سؤال من نبود.',
          reaction:
            'گرگ دنبال جواب بود. در این پرونده، «من منم» کامل‌ترین جوابی است که تا امروز داده شده.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'noted',
          label: 'باشه. فعلاً ثبتش می‌کنم.',
          reaction: 'گرگ عادت دارد همه‌چیز را ثبت کند. این یکی را هم ثبت کرد و بعداً پشیمان نشد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
      ],
    },
  ],
  panda:
    'ضبط مکالمات از این لحظه آغاز شد. هیچ‌کدام از طرفین اطلاع نداشتند. هیچ‌کدام هم اعتراض نکردند.',
});
