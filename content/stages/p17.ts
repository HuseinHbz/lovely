import { defineStage } from '../schema';

/**
 * برگه ۱۷ — حدس غذا. `STORY-28.md` بخش PHASE 17.
 *
 * `MERGED-SPEC` بخش ۳ و ۷: این از یک آزمون به یک شوخی تبدیل می‌شود و
 * جریمه‌ی `Wrong Guess -5` **حذف شده**. گرگ حدس می‌زند، هیچ حدسی غلط نیست.
 */
export const p17 = defineStage({
  id: 'p17',
  folder: 4,
  title: 'حدس غذا',
  skin: 'interrogation',
  mapNode: 'food',
  setting: 'outside',
  wardrobe: { wolf: 'casual', hedgehog: 'casual' },
  lines: [
    { speaker: 'nazoo', text: 'سؤال ساده بود: الان چی می‌خوای؟' },
    { speaker: 'nazoo', text: 'گرگ فکر کرد این یک سؤال است. در واقع یک آزمون بود که نمره ندارد.' },
  ],
  interactions: [
    {
      kind: 'pick',
      prompt: 'گرگ چه حدس می‌زند؟',
      note: 'هیچ حدسی غلط نیست. جواب درست همیشه «هر پنج‌تا» بوده.',
      options: [
        {
          id: 'chocolate',
          label: 'شکلات',
          reaction: 'درست بود. البته بقیه هم درست بودند.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'pastil',
          label: 'پاستیل',
          reaction: 'درست بود. گرگ خوشحال شد که یک بار حدسش گرفت.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'pasta',
          label: 'پاستا',
          reaction: 'درست بود، ولی نه همین الان. زمان‌بندی همیشه بخش سخت‌تر ماجراست.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'icecream',
          label: 'بستنی',
          reaction: 'درست بود. بستنی در این پرونده هیچ‌وقت جواب غلطی نبوده.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
        {
          id: 'sweets',
          label: 'شیرینی',
          reaction: 'درست بود. گرگ کم‌کم دارد الگو را می‌فهمد. الگو این است: همه‌اش.',
          reactionSpeaker: 'nazoo',
          draft: true,
        },
      ],
    },
  ],
  panda: 'گرگ باز هم حدس زد. این بار اشتباه نکرد، چون در این پرسش اشتباهی وجود ندارد.',
});
