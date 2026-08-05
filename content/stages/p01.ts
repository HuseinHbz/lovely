import { defineStage } from '../schema';

/**
 * برگه ۰۱ — آشنایی در بیمارستان.
 *
 * دیالوگ و روایت از `STORY-28.md` بخش PHASE 01. صحنه‌ی بیمارستان و معرفی جغد
 * رئیس از نسخه ۱ هم زنده ماند (`STORY-v1-superseded.md` مرحله ۳).
 *
 * تعاملی که `MERGED-SPEC` بخش ۶ خواسته «انتخاب اولین برداشت گرگ» است، ولی متن
 * گزینه‌ها هیچ‌جا نوشته نشده. سه گزینه‌ی زیر پیش‌نویس من‌اند و `draft: true`
 * دارند، پس `pnpm validate:content:strict` تا تأیید نشدنشان خطا می‌دهد.
 */
export const p01 = defineStage({
  id: 'p01',
  folder: 1,
  title: 'آشنایی در بیمارستان',
  skin: 'interrogation',
  mapNode: 'first-meeting',
  setting: { wolf: 'hospital', hedgehog: 'hospital' },
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  lines: [
    {
      speaker: 'nazoo',
      text: 'بیمارستان جغدها. یکی با کت و شلوار وارد شد، یکی با روپوش پرستاری، و جغد رئیس هر دو را به هم معرفی کرد.',
    },
    { speaker: 'owl', text: 'یه گرگ می‌شناسم... بد نیست باهاش آشنا بشی.' },
    { speaker: 'wolf', text: 'این همون جوجه‌تیغیه؟' },
    {
      speaker: 'nazoo',
      text: 'گرگ هنوز نمی‌دانست که این جمله در آینده می‌تواند علیه خودش استفاده شود.',
    },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'اولین برداشت گرگ چه بود؟',
      options: [
        {
          id: 'professional',
          label: 'حرفه‌ای به‌نظر می‌رسد. احتمالاً دردسری ندارد.',
          reaction:
            'این جمله در دفتر اول ثبت شد و در دفتر پنجم دوباره خوانده شد. پاندا هنوز به آن می‌خندد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'sharp',
          label: 'زبانش تیزتر از تیغ‌هایش است.',
          reaction: 'ارزیابی دقیق بود. گرگ معمولاً دقیق است — مشکل جای دیگری شروع می‌شود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'no-idea',
          label: 'هیچ برداشتی ندارم، فقط آمده بودم کارم را بکنم.',
          reaction: 'ادعای بی‌طرفی ثبت شد. پرونده‌ای که بعداً تشکیل شد با این ادعا هم‌خوانی ندارد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
      ],
    },
  ],
  panda: 'مدرک شماره ۰۱ ثبت شد. نوع: معرفی رسمی. معرف: جغد رئیس. عواقب: نامعلوم، ولی طولانی.',
});
