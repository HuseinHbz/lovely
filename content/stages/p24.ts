import { defineStage } from '../schema';

/**
 * برگه ۲۴ — ملاقات. `STORY-28.md` بخش PHASE 24.
 * چهار رویکرد سند: شوخی / توضیح / عذرخواهی / فشار آوردن.
 */
export const p24 = defineStage({
  id: 'p24',
  folder: 6,
  title: 'ملاقات',
  skin: 'interrogation',
  setting: { wolf: 'outside', hedgehog: 'outside' },
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  faces: { wolf: 'guilty', hedgehog: 'hurt' },
  lines: [
    { speaker: 'nazoo', text: 'بدون فشار. بدون بازجویی. بدون مرور تمام گذشته. تمرکز روی حال.' },
    { speaker: 'wolf', text: 'بیا بشینیم حرف بزنیم.' },
    { speaker: 'hedgehog', text: 'با فاصله هم میشه حرف زد.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چطور شروع می‌کند؟',
      options: [
        {
          id: 'joke',
          face: { wolf: 'smug', hedgehog: 'laughing' },
          label: 'با شوخی',
          reaction:
            'فضا سبک شد. شوخی در این پرونده همیشه جواب داده — تا وقتی جای حرف اصلی را نگیرد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'explain',
          face: { wolf: 'neutral', hedgehog: 'hurt' },
          label: 'با توضیح',
          reaction: 'گرگ توضیح داد که ذهنش کجا بود. برای اولین بار توضیح، دفاع نبود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'apologise',
          face: { wolf: 'guilty', hedgehog: 'melting' },
          label: 'با عذرخواهی',
          reaction: 'گرگ عذرخواهی کرد، بدون «ولی». حذف همان یک کلمه، کل جمله را عوض کرد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'pressure',
          face: { wolf: 'annoyed', hedgehog: 'furious' },
          label: 'با فشار آوردن',
          reaction:
            'فشار آمد و فاصله بیشتر شد. پرونده این را ثبت کرد و بلافاصله زیرش نوشت: قابل جبران.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
      ],
    },
  ],
  meters: { hamkari: 2, amniyat: 2 },
  panda:
    'جلسه‌ی ملاقات بدون بازجویی برگزار شد. این اولین جلسه‌ی این پرونده است که کسی در آن متهم نبود.',
});
