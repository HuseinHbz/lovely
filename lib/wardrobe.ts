/**
 * لباس و حالت شخصیت‌ها — راهنمای شخصیت پروژه.
 *
 * دو قاعده‌ی سفت که کارفرما گذاشته و اینجا قابل بررسی با کد شده‌اند:
 *   ۱. گرگ هیچ‌وقت در محیط کاری بدون کت و شلوار دیده نمی‌شود.
 *   ۲. جوجه‌تیغی هیچ‌وقت داخل بیمارستان بدون لباس پرستاری دیده نمی‌شود.
 *
 * `assertWardrobe` این دو را می‌سنجد و `pnpm validate:content` صدایش می‌زند،
 * پس نقض قاعده در زمان build گرفته می‌شود نه با چشم.
 *
 * شرح کامل در `docs/05-characters.md`.
 */

/** جایی که صحنه اتفاق می‌افتد — تعیین می‌کند کدام لباس مجاز است. */
export const SETTINGS = ['work', 'hospital', 'outside', 'night-shift'] as const;
export type Setting = (typeof SETTINGS)[number];

export const SETTING_LABELS: Record<Setting, string> = {
  work: 'محیط کاری',
  hospital: 'بیمارستان',
  outside: 'بیرون',
  'night-shift': 'شیفت شب',
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

/** لباس‌هایی که در هر محیط مجازند. */
const WOLF_ALLOWED: Record<Setting, readonly WolfOutfit[]> = {
  work: ['formal', 'desk'],
  hospital: ['formal', 'desk'],
  outside: ['casual'],
  'night-shift': ['formal', 'desk', 'casual'],
};

const HEDGEHOG_ALLOWED: Record<Setting, readonly HedgehogOutfit[]> = {
  work: ['nurse', 'night-shift', 'storm'],
  hospital: ['nurse', 'night-shift', 'storm'],
  outside: ['casual'],
  'night-shift': ['night-shift', 'storm'],
};

export type WardrobeViolation = { who: 'wolf' | 'hedgehog'; setting: Setting; outfit: string };

/** اگر لباس با محیط نخواند برمی‌گرداند چه چیزی نقض شده، وگرنه `undefined`. */
export function checkWardrobe(
  setting: Setting,
  outfits: { wolf?: WolfOutfit | undefined; hedgehog?: HedgehogOutfit | undefined },
): WardrobeViolation | undefined {
  const { wolf, hedgehog } = outfits;
  if (wolf !== undefined && !WOLF_ALLOWED[setting].includes(wolf)) {
    return { who: 'wolf', setting, outfit: wolf };
  }
  if (hedgehog !== undefined && !HEDGEHOG_ALLOWED[setting].includes(hedgehog)) {
    return { who: 'hedgehog', setting, outfit: hedgehog };
  }
  return undefined;
}

export function describeViolation(violation: WardrobeViolation): string {
  const who = violation.who === 'wolf' ? 'گرگ' : 'جوجه‌تیغی';
  return `${who} در «${SETTING_LABELS[violation.setting]}» نمی‌تواند لباس «${violation.outfit}» بپوشد`;
}
