import { defineStage } from '../schema';

/** برگه ۱۸ — برنامه‌ی بیرون. `STORY-28.md` بخش PHASE 18. */
export const p18 = defineStage({
  id: 'p18',
  folder: 4,
  title: 'برنامه‌ی بیرون',
  skin: 'map',
  mapNode: 'outing',
  setting: 'outside',
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [
    {
      speaker: 'nazoo',
      text: 'قرار بود فقط یک ساعت بیرون بروند. اما شیفت بیمارستان، رئیس، برنامه‌ی خانواده و چندین عامل انسانی دیگر تصمیم گرفتند این کار را تقریباً غیرممکن کنند.',
    },
  ],
  interactions: [
    {
      kind: 'pick',
      prompt: 'گرگ کدام ساعت را پیشنهاد می‌دهد؟',
      note: 'هیچ‌کدام کاملاً جور نمی‌شود. مسئله پیدا کردن ساعت نیست، پافشاری برای پیدا کردنش است.',
      options: [
        {
          id: 'before-shift',
          label: 'قبل از شیفت، صبح زود',
          reaction:
            'صبح زود یعنی یکی از دو نفر نخوابیده. گرگ داوطلب شد نخوابد. این را در پرونده به نفعش نوشتند.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'after-shift',
          label: 'بعد از شیفت، شب',
          reaction:
            'بعد از شیفت یعنی یکی از دو نفر خسته است. قرار برگزار شد و نصفش در سکوت گذشت — که بد نبود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'day-off',
          label: 'روز تعطیل، هر وقت شد',
          reaction:
            'روز تعطیل پیدا شد. سه بار جابه‌جا شد. بار چهارم واقعاً اتفاق افتاد و هیچ‌کس باور نکرد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'short',
          label: 'همین حالا، فقط بیست دقیقه',
          reaction: 'بیست دقیقه شد یک ساعت و نیم. تنها باری که برنامه‌ریزی گرگ از خودش جلو زد.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
      ],
    },
  ],
  panda:
    'تقویم غیرممکن ضمیمه شد. تعداد قرارهای لغوشده: قابل توجه. تعداد قرارهای برگزارشده: کمتر، ولی صفر نیست.',
});
