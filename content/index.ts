import { stageSchema, type Stage } from './schema';
import { p00 } from './stages/p00';
import { p01 } from './stages/p01';

/**
 * ثبت برگه‌ها. ترتیب همین آرایه ترتیب پرونده است.
 *
 * هر برگه همین‌جا با zod سنجیده می‌شود، پس یک فایل خراب در همان لحظه‌ی import
 * خطا می‌دهد — چه در dev، چه در build، چه در اسکریپت اعتبارسنجی.
 *
 * برگه‌های ۰۲ تا ۲۷ در فاز ۴ اضافه می‌شوند. متن‌شان هنوز نوشته نشده:
 * `docs/06-migration-v2.md` بخش ۶.
 */
const registry = [p00, p01];

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

/** کل برگه‌های پرونده‌ی کامل — `MERGED-SPEC` بخش ۶: ۲۸ برگه در ۶ دفتر. */
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

export { stageSchema };
export type { Stage };
