/**
 * شش شاخص پرونده — **فقط طنز**.
 *
 * `MERGED-SPEC` بخش ۴، سه قاعده‌ی سفت:
 *   ۱. هیچ شاخصی هیچ صحنه، پایان یا محتوایی را قفل نمی‌کند.
 *   ۲. هیچ عددی به کاربر نمی‌گوید «رد شدی».
 *   ۳. اعداد فقط برای طنز و برگه‌ی خلاصه‌ی پایانی‌اند.
 *
 * به همین دلیل موتور اصلاً این‌ها را نمی‌خواند. هیچ تابعی در `lib/engine.ts`
 * به شاخص‌ها نگاه نمی‌کند — اگر روزی نگاه کرد، قاعده‌ی ۱ شکسته است.
 */

export const METERS = [
  {
    id: 'hamkari',
    label: 'میزان همکاری متهم',
    display: 'percent',
    note: 'نوار با درصد',
  },
  {
    id: 'shavahed',
    label: 'شواهد علاقه‌ی مکشوفه',
    display: 'count',
    note: 'تعداد مدرک',
  },
  {
    id: 'ezharat',
    label: 'کیفیت اظهارات',
    display: 'rank',
    note: 'رتبه‌بندی طنز',
  },
  {
    id: 'dadresi',
    label: 'رعایت آیین دادرسی',
    display: 'stars',
    note: 'ستاره',
  },
  {
    id: 'amniyat',
    label: 'امنیت اتاق بازجویی',
    display: 'light',
    note: 'چراغ سبز یا زرد — قرمز نداریم',
  },
  {
    id: 'mokhtome',
    label: 'نرخ مختومه‌سازی',
    display: 'percent',
    note: 'درصد',
  },
] as const;

export type MeterId = (typeof METERS)[number]['id'];
export type MeterDisplay = (typeof METERS)[number]['display'];

export const METER_IDS: readonly MeterId[] = METERS.map((meter) => meter.id);

export function getMeter(id: MeterId) {
  return METERS.find((meter) => meter.id === id);
}
