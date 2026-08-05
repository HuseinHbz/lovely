/**
 * حالت‌های چهره.
 *
 * بخش فاز ۳ سند: هر شخصیت چهار حالت دارد و تعویض حالت نباید بارگذاری دوباره
 * بخواهد. به همین دلیل آرت‌ورک به‌جای فایل در `public/art`، کامپوننت SVG است:
 * بدن یک‌بار رندر می‌شود و فقط لایه‌ی صورت عوض می‌شود.
 */
export const FACE_STATES = ['neutral', 'smug', 'hurt', 'guilty'] as const;
export type FaceState = (typeof FACE_STATES)[number];

export const FACE_LABELS: Record<FaceState, string> = {
  neutral: 'خنثی',
  smug: 'ازخودراضی',
  hurt: 'دلخور',
  guilty: 'شرمنده',
};
