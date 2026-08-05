import { defineStage } from '../schema';

/**
 * برگه ۱۰ — هدیه و توجه. `STORY-28.md` بخش PHASE 10.
 * `MERGED-SPEC` بخش ۶: دو مسیر — گران یا بافکر.
 */
export const p10 = defineStage({
  id: 'p10',
  folder: 3,
  title: 'هدیه و توجه',
  skin: 'interrogation',
  mapNode: 'gifts',
  setting: { wolf: 'outside', hedgehog: 'outside' },
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  faces: { wolf: 'neutral', hedgehog: 'melting' },
  lines: [
    { speaker: 'hedgehog', text: 'مهم تلاششه.' },
    { speaker: 'wolf', text: 'خوشحال میشی؟' },
    { speaker: 'hedgehog', text: 'آره.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه می‌خرد؟',
      options: [
        {
          id: 'expensive',
          label: 'گران‌ترین چیزی که پیدا کنم.',
          reaction:
            'قیمت بالا ثبت شد، فکر پشتش پیدا نشد. گرگ در دفاع گفت «ولی گرون بود» و همین جمله علیه خودش ضبط شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
        {
          id: 'thoughtful',
          label: 'چیزی که می‌دانم لازم دارد.',
          reaction: 'گرگ بالاخره فهمید مسئله فقط قیمت نیست. مسئله این است که کسی حواسش به تو بوده.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'ask',
          label: 'می‌پرسم چی دوست داری.',
          reaction:
            'پرسیدن جواب داد، ولی نصفه. طرف مقابل گفت «فرقی نمی‌کنه» — که در این پرونده یعنی خیلی هم فرق می‌کند.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
        {
          id: 'time',
          label: 'وقت و حضور، به‌جای هر چیزی که بسته‌بندی دارد.',
          reaction: 'ثبت شد. گرگ پرسید یعنی دیگر چیزی نخرم، و مثل همیشه پاسخ روشنی نگرفت.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
      ],
    },
  ],
  meters: { shavahed: 2, hamkari: 1 },
  panda: 'قیمت دیده می‌شود، فکر احساس. هیچ فاکتوری تا امروز نتوانسته جای دومی را بگیرد.',
});
