import { defineStage } from '../schema';

/**
 * مرحله ۲ — معرفی گرگ. متن کامل از `docs/STORY.md`.
 * داستان برای هر سه گزینه یک «نتیجه‌ی مشترک» دارد، پس هر سه همان واکنش را می‌گیرند.
 */
const sharedReaction =
  'پاسخ شما ثبت شد. گرگ درخواست تجدیدنظر داد، ولی درخواستش به علت «ازخودراضی بودن مفرط» رد شد.';

export const s02 = defineStage({
  id: 's02',
  act: 1,
  title: 'معرفی گرگ',
  skin: 'interrogation',
  lines: [
    {
      speaker: 'nazoo',
      text: 'طبق اسناد، این گرگ گاهی مهربان، گاهی کرمو و گاهی برج زهرمار بوده است.',
    },
    { speaker: 'nazoo', text: 'آیا او پسر خوبی است؟' },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      options: [
        { id: 'karam', label: 'بله، ولی زیادی کرم دارد.', reaction: sharedReaction },
        { id: 'oon-akhlagh', label: 'خیر، عن‌اخلاق است.', reaction: sharedReaction },
        {
          id: 'saat',
          label: 'بستگی دارد چه ساعتی از شبانه‌روز باشد.',
          reaction: sharedReaction,
        },
      ],
    },
  ],
});
