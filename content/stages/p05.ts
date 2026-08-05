import { defineStage } from '../schema';

/**
 * برگه ۰۵ — دادگاه. `STORY-28.md` بخش PHASE 05.
 * `MERGED-SPEC` بخش ۳: گرگ قاضی است، پس چکش دست بازیکن است.
 */
export const p05 = defineStage({
  id: 'p05',
  folder: 2,
  title: 'دادگاه',
  skin: 'interrogation',
  mapNode: 'court',
  achievement: 'ghazi',
  setting: { wolf: 'work', hedgehog: 'hospital' },
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  faces: { wolf: 'guilty', hedgehog: 'furious' },
  lines: [
    { speaker: 'nazoo', text: 'اتاق تبدیل شد به دادگاه. چکش دست گرگ افتاد.' },
    { speaker: 'hedgehog', text: 'من قانونای خودمو دارم.' },
    { speaker: 'nazoo', text: 'منشی دادگاه اعلام کرد جلسه رسمی است. هیچ‌کس جدی نگرفت.' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'حکم قاضی چیست؟',
      options: [
        {
          id: 'no-defense',
          face: { wolf: 'guilty', hedgehog: 'annoyed' },
          label: 'دفاع لازم نیست خانم.',
          reaction:
            'حکم بدون شنیدن دفاع صادر شد. متهم همان‌جا اعلام کرد این دادگاه صلاحیت ندارد و پرونده را بست.',
          reactionSpeaker: 'nazoo',
          stamp: 'مردود',
        },
        {
          id: 'no-winner',
          face: { wolf: 'neutral', hedgehog: 'hurt' },
          label: 'برنده‌ای وجود نداره.',
          reaction:
            'قاضی حکم داد برنده‌ای نیست. پرونده‌ای که دو نفر توش زخمی بشن، جام قهرمانی ندارد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'self-charge',
          face: { wolf: 'guilty', hedgehog: 'melting' },
          label: 'متهم اصلی خودمم. جلسه تمام.',
          reaction:
            'قاضی خودش را متهم کرد. منشی دادگاه اعلام کرد این از نظر آیین دادرسی بی‌سابقه ولی از نظر انسانی قابل قبول است.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
        {
          id: 'adjourn',
          face: { wolf: 'smug', hedgehog: 'furious' },
          label: 'جلسه به وقت دیگری موکول می‌شود.',
          reaction:
            'به تعویق افتاد. مثل بیشتر چیزهای این پرونده، که به تعویق می‌افتند و برمی‌گردند.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
      ],
    },
  ],
  meters: { dadresi: 2, mokhtome: 1 },
  panda: 'صورت‌جلسه‌ی دادگاه شماره یک. قاضی و متهم یک نفر بودند در دو نقش. پرونده باز ماند.',
});
