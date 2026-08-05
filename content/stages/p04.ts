import { defineStage } from '../schema';

/** برگه ۰۴ — حادثه‌ی «اوکی». `STORY-28.md` بخش PHASE 04. */
export const p04 = defineStage({
  id: 'p04',
  folder: 2,
  title: 'حادثه‌ی «اوکی»',
  skin: 'interrogation',
  setting: { wolf: 'work', hedgehog: 'hospital' },
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  faces: { wolf: 'guilty', hedgehog: 'annoyed' },
  lines: [
    { speaker: 'nazoo', text: 'یک پیام چهارحرفی رسید. فقط همین: «اوکی».' },
    { speaker: 'hedgehog', text: 'به جان خودم من چیزی تایپ نکردم!' },
    {
      speaker: 'nazoo',
      text: 'و اینجا بود که یک کلمه چهار حرفی، نزدیک بود به یک پرونده حقوقی تبدیل شود.',
    },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ چه واکنشی نشان می‌دهد؟',
      options: [
        {
          id: 'investigate',
          face: { wolf: 'annoyed', hedgehog: 'annoyed' },
          label: 'پس کی فرستاده؟ باید بررسی کنیم.',
          reaction:
            'پرونده‌ی مظنونان باز شد: ایرانسل، سیم‌کارت جابه‌جا شده، و روح سرگردان یک پیام پاک‌شده. هیچ‌کدام حاضر به همکاری نشدند.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
        {
          id: 'let-go',
          face: { wolf: 'neutral', hedgehog: 'hurt' },
          label: 'مهم نیست. بی‌خیالش.',
          reaction:
            'گرگ گفت مهم نیست و بعد سه روز به آن فکر کرد. پرونده این را «بی‌خیالی ادعایی» ثبت کرد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
        },
        {
          id: 'joke',
          face: { wolf: 'smug', hedgehog: 'laughing' },
          label: 'اوکی. منم اوکی‌ام. همه اوکی‌ایم.',
          reaction:
            'شوخی گرفت. تنش خوابید. این تقریباً تنها باری است که گرگ با شوخی از یک بحران بیرون آمد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
        },
      ],
    },
  ],
  meters: { hamkari: 1, ezharat: 2 },
  panda:
    'مدرک شماره ۰۴. کلمه‌ی مورد اختلاف: «اوکی». تعداد حروف: چهار. تعداد جلسات لازم برای حل: بیشتر.',
});
