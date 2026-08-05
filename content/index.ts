import { stageSchema, type Stage } from './schema';
import { p00 } from './stages/p00';
import { p01 } from './stages/p01';
import { p02 } from './stages/p02';
import { p03 } from './stages/p03';
import { p04 } from './stages/p04';
import { p05 } from './stages/p05';
import { p06 } from './stages/p06';
import { p07 } from './stages/p07';
import { p08 } from './stages/p08';
import { p09 } from './stages/p09';
import { p10 } from './stages/p10';
import { p11 } from './stages/p11';
import { p12 } from './stages/p12';
import { p13 } from './stages/p13';
import { p14 } from './stages/p14';
import { p15 } from './stages/p15';
import { p16 } from './stages/p16';
import { p17 } from './stages/p17';
import { p18 } from './stages/p18';
import { p19 } from './stages/p19';
import { p20 } from './stages/p20';
import { p21 } from './stages/p21';
import { p22 } from './stages/p22';
import { p23 } from './stages/p23';
import { p24 } from './stages/p24';
import { p25 } from './stages/p25';
import { p26 } from './stages/p26';
import { p27 } from './stages/p27';

/**
 * ثبت برگه‌ها. ترتیب همین آرایه ترتیب پرونده است.
 *
 * هر برگه همین‌جا با zod سنجیده می‌شود، پس یک فایل خراب در همان لحظه‌ی import
 * خطا می‌دهد — چه در dev، چه در build، چه در اسکریپت اعتبارسنجی.
 */
const registry = [
  p00,
  p01,
  p02,
  p03,
  p04,
  p05,
  p06,
  p07,
  p08,
  p09,
  p10,
  p11,
  p12,
  p13,
  p14,
  p15,
  p16,
  p17,
  p18,
  p19,
  p20,
  p21,
  p22,
  p23,
  p24,
  p25,
  p26,
  p27,
];

export const STAGES: readonly Stage[] = registry.map((stage, index) => {
  const parsed = stageSchema.safeParse(stage);
  if (!parsed.success) {
    const where = stage.id ?? `#${index}`;
    throw new Error(
      `محتوای برگه‌ی ${where} نامعتبر است:\n${JSON.stringify(parsed.error.issues, null, 2)}`,
    );
  }
  return parsed.data;
});

export const STAGE_IDS: readonly string[] = STAGES.map((stage) => stage.id);

/** کل برگه‌های پرونده — `MERGED-SPEC` بخش ۶: ۲۸ برگه در ۶ دفتر. */
export const TOTAL_STAGES = 28;
export const TOTAL_FOLDERS = 6;

/** عنوان هر دفتر — `MERGED-SPEC` بخش ۶. */
export const FOLDERS = [
  { number: 1, range: '۰۰–۰۳', title: 'تشکیل پرونده' },
  { number: 2, range: '۰۴–۰۸', title: 'مدارک اولیه' },
  { number: 3, range: '۰۹–۱۴', title: 'شواهد علاقه' },
  { number: 4, range: '۱۵–۱۹', title: 'ضمائم و پیوست‌ها' },
  { number: 5, range: '۲۰–۲۳', title: 'اختلافات و دادرسی' },
  { number: 6, range: '۲۴–۲۷', title: 'مختومه؟' },
] as const;

export function folderOf(number: number) {
  return FOLDERS.find((folder) => folder.number === number);
}

export { stageSchema };
export type { Stage };
