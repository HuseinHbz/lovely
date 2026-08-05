/**
 * لباس و محیط شخصیت‌ها — راهنمای شخصیت پروژه.
 *
 * دو قاعده‌ی سفت کارفرما، که اینجا با کد سنجیده می‌شوند:
 *   ۱. گرگ هیچ‌وقت در محیط کاری بدون کت و شلوار دیده نمی‌شود.
 *   ۲. جوجه‌تیغی هیچ‌وقت داخل بیمارستان بدون روپوش پرستاری دیده نمی‌شود.
 *
 * **محیط برای هر شخصیت جداست.** نسخه‌ی اول یک `setting` مشترک داشت و در
 * صحنه‌های از راه دور — چت، ریپلای استوری، تماس شبانه — دو نفر در دو جا بودند
 * و مجبور می‌شدیم `setting` را خالی بگذاریم. نتیجه این بود که قاعده روی حدود
 * نیمی از داستان اصلاً اجرا نمی‌شد و گرگ می‌توانست با هودی سر کار ظاهر شود.
 * حالا هر شخصیت محیط خودش را دارد و قاعده همه‌جا زنده است.
 *
 * `checkWardrobe` را `content/schema.ts` صدا می‌زند، پس نقض قاعده build را
 * می‌شکند نه اینکه با چشم پیدا شود.
 *
 * شرح کامل در `docs/05-characters.md`.
 */

export const SETTINGS = ['work', 'hospital', 'outside', 'home', 'car'] as const;
export type SettingId = (typeof SETTINGS)[number];

export const SETTING_LABELS: Record<SettingId, string> = {
  work: 'محیط کاری',
  hospital: 'بیمارستان',
  outside: 'بیرون',
  home: 'خانه',
  car: 'ماشین',
};

export const WOLF_OUTFITS = ['formal', 'casual', 'desk'] as const;
export type WolfOutfit = (typeof WOLF_OUTFITS)[number];

export const WOLF_OUTFIT_LABELS: Record<WolfOutfit, string> = {
  formal: 'کت و شلوار سرمه‌ای',
  casual: 'هودی و جین',
  desk: 'پشت لپ‌تاپ — باز هم کت و شلوار',
};

export const HEDGEHOG_OUTFITS = ['nurse', 'casual', 'night-shift', 'storm'] as const;
export type HedgehogOutfit = (typeof HEDGEHOG_OUTFITS)[number];

export const HEDGEHOG_OUTFIT_LABELS: Record<HedgehogOutfit, string> = {
  nurse: 'روپوش پرستاری',
  casual: 'مانتوی کوتاه و جین، موی باز',
  'night-shift': 'شیفت شب — همان روپوش، چشم خواب‌آلود',
  storm: 'حالت طوفانی — همان روپوش، ابر و رعد بالای سر',
};

/**
 * لباس مجاز هر شخصیت در هر محیط.
 *
 * `desk` هم کت و شلوار است، فقط پشت میز؛ پس در محیط کاری مجاز است.
 * `night-shift` و `storm` هم همان روپوش پرستاری‌اند با حال و هوای متفاوت،
 * پس در بیمارستان مجازند — قاعده درباره‌ی **لباس** است، نه حال و هوا.
 */
const WOLF_ALLOWED: Record<SettingId, readonly WolfOutfit[]> = {
  work: ['formal', 'desk'],
  hospital: ['formal', 'desk'],
  outside: ['casual'],
  home: ['casual'],
  car: ['casual', 'formal'],
};

const HEDGEHOG_ALLOWED: Record<SettingId, readonly HedgehogOutfit[]> = {
  work: ['nurse', 'night-shift', 'storm'],
  hospital: ['nurse', 'night-shift', 'storm'],
  outside: ['casual'],
  home: ['casual', 'night-shift'],
  car: ['casual'],
};

export type Who = 'wolf' | 'hedgehog';
export type WardrobeViolation = { who: Who; setting: SettingId; outfit: string };

const WHO_LABELS: Record<Who, string> = { wolf: 'گرگ', hedgehog: 'جوجه‌تیغی' };

/**
 * لباس هر شخصیت را با محیط **خودش** می‌سنجد.
 *
 * اگر شخصیتی در صحنه نباشد، محیطش تعریف نمی‌شود و بررسی نمی‌شود.
 */
export function checkWardrobe(
  setting: { wolf?: SettingId | undefined; hedgehog?: SettingId | undefined },
  outfits: { wolf?: WolfOutfit | undefined; hedgehog?: HedgehogOutfit | undefined },
): WardrobeViolation | undefined {
  if (setting.wolf !== undefined && outfits.wolf !== undefined) {
    if (!WOLF_ALLOWED[setting.wolf].includes(outfits.wolf)) {
      return { who: 'wolf', setting: setting.wolf, outfit: outfits.wolf };
    }
  }
  if (setting.hedgehog !== undefined && outfits.hedgehog !== undefined) {
    if (!HEDGEHOG_ALLOWED[setting.hedgehog].includes(outfits.hedgehog)) {
      return { who: 'hedgehog', setting: setting.hedgehog, outfit: outfits.hedgehog };
    }
  }
  return undefined;
}

export function describeViolation(violation: WardrobeViolation): string {
  return `${WHO_LABELS[violation.who]} در «${SETTING_LABELS[violation.setting]}» نمی‌تواند لباس «${violation.outfit}» بپوشد`;
}
