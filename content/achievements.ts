/**
 * نشان‌های پرونده — `STORY-28.md` بخش ۲۰.
 *
 * شرط باز شدن هر نشان **رسیدن به یک برگه** است، نه رسیدن به یک عدد. سند اصلی
 * برای «پرونده مختومه؟» شرط `Trust > 80` گذاشته بود، ولی `MERGED-SPEC` بخش ۴
 * قاعده‌ی ۱ می‌گوید هیچ شاخصی هیچ‌چیز را قفل نمی‌کند — پس آن شرط به «رسیدن به
 * آخرین برگه» تبدیل شد.
 *
 * نام‌ها فقط حیوانی‌اند؛ شرط‌های سند اصلی که به نام واقعی اشاره داشتند بازنویسی
 * شده‌اند (قاعده ۴).
 */

export const ACHIEVEMENTS = [
  { id: 'bazras', label: 'خانم بازرس', unlockedBy: 'p03', note: 'اولین لقب رسمی ثبت شد' },
  { id: 'ghazi', label: 'آقای قاضی', unlockedBy: 'p05', note: 'دادگاه رابطه تشکیل شد' },
  { id: 'panda-bigonah', label: 'پاندا بی‌گناه', unlockedBy: 'p07', note: 'اولین استوری پاندا' },
  { id: 'gorg-sookhte', label: 'گرگ سوخته', unlockedBy: 'p14', note: 'صحنه‌ی اژدها' },
  { id: 'kafsh-sefid', label: 'کفش سفید', unlockedBy: 'p15', note: 'حادثه‌ی کفش' },
  { id: 'ghafase-ketab', label: 'قفسه کتاب', unlockedBy: 'p23', note: 'شرط آشتی' },
  { id: 'ghahr-tarikhi', label: 'قهر تاریخی', unlockedBy: 'p20', note: 'سوءتفاهم بزرگ' },
  { id: 'ashti', label: 'آشتی', unlockedBy: 'p25', note: 'ترمیم' },
  { id: 'mokhtome', label: 'پرونده مختومه؟', unlockedBy: 'p27', note: 'رسیدن به فصل بعد' },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]['id'];

export const ACHIEVEMENT_IDS: readonly string[] = ACHIEVEMENTS.map((item) => item.id);

export function achievementFor(stageId: string) {
  return ACHIEVEMENTS.find((item) => item.unlockedBy === stageId);
}
