import { defineStage } from '../schema';

/** برگه ۰۳ — جنگ لقب‌ها. فهرست القاب از `STORY-28.md` بخش PHASE 03. */
export const p03 = defineStage({
  id: 'p03',
  folder: 1,
  title: 'جنگ لقب‌ها',
  skin: 'interrogation',
  mapNode: 'nicknames',
  achievement: 'bazras',
  setting: 'work',
  wardrobe: { wolf: 'formal', hedgehog: 'nurse' },
  lines: [
    { speaker: 'nazoo', text: 'دفتر القاب باز شد. هیچ‌کس نمی‌دانست دیگر بسته نمی‌شود.' },
    {
      speaker: 'nazoo',
      text: 'هیچ‌کس نمی‌دانست چرا بازرس. اما وقتی یک لقب جا افتاد، دیگر کسی جرئت تغییرش را نداشت.',
    },
  ],
  interactions: [
    {
      kind: 'pick',
      prompt: 'گرگ کدام لقب را ثبت می‌کند؟',
      note: 'هیچ‌کدام غلط نیست. هر لقبی که ثبت شود، تا آخر پرونده می‌ماند.',
      options: [
        {
          id: 'khanoom-moosh',
          label: 'خانم موش',
          reaction: 'ثبت شد. صاحب لقب اعتراض کرد، ولی اعتراضش هم با همین لقب در پرونده بایگانی شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'khanoom-bazras',
          label: 'خانم بازرس',
          reaction:
            'خطرناک‌ترین انتخاب ممکن. از این لحظه هر جمله‌ی گرگ می‌تواند به‌عنوان مدرک استفاده شود.',
          reactionSpeaker: 'nazoo',
          stamp: 'وکیل خبر شد',
          draft: true,
        },
        {
          id: 'agha-gorg',
          label: 'آقا گرگ',
          reaction:
            'گرگ لقب خودش را انتخاب کرد. این تنها مرحله‌ای از پرونده است که گرگ کاملاً راضی به‌نظر می‌رسید.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'agha-ghazi',
          label: 'آقای قاضی',
          reaction: 'لقب سنگینی است. صاحبش دو برگه بعد پشت میز قضاوت نشست و از آن پشیمان شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
      ],
    },
  ],
  meters: { ezharat: 2 },
  panda:
    'دفتر القاب رسماً افتتاح شد. تعداد القاب ثبت‌شده تا امروز: بیش از حد. تعداد القاب پس‌گرفته‌شده: صفر.',
});
