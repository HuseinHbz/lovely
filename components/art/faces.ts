/**
 * حالت‌های چهره.
 *
 * چهار حالت اول از سند فازبندی می‌آید. چهار حالت بعدی از راهنمای شخصیت
 * کارفرما — همان مودهایی که برای جوجه‌تیغی خواسته شده بود.
 *
 * بدن یک بار رندر می‌شود و فقط گروه صورت عوض می‌شود، پس تعویض حالت
 * هیچ بارگذاری دوباره‌ای ندارد.
 */
export const FACE_STATES = [
  'neutral',
  'smug',
  'hurt',
  'guilty',
  'annoyed',
  'furious',
  'crying',
  'melting',
  'laughing',
] as const;
export type FaceState = (typeof FACE_STATES)[number];

export const FACE_LABELS: Record<FaceState, string> = {
  neutral: 'خنثی',
  smug: 'ازخودراضی',
  hurt: 'دلخور',
  guilty: 'شرمنده',
  annoyed: 'بی‌حوصله',
  furious: 'عصبانی',
  crying: 'گریه',
  melting: 'ذوب‌شده',
  laughing: 'خنده',
};
