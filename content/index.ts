import { stageSchema, type Stage } from './schema';
import { s01 } from './stages/s01';
import { s02 } from './stages/s02';
import { s03 } from './stages/s03';

/**
 * ثبت مراحل. ترتیب همین آرایه ترتیب داستان است.
 *
 * هر مرحله همین‌جا با zod سنجیده می‌شود، پس یک فایل خراب در همان لحظه‌ی import
 * خطا می‌دهد — چه در dev، چه در build، چه در اسکریپت اعتبارسنجی.
 *
 * مراحل ۴ تا ۲۰ در فاز ۴ اضافه می‌شوند.
 */
const registry = [s01, s02, s03];

export const STAGES: readonly Stage[] = registry.map((stage, index) => {
  const parsed = stageSchema.safeParse(stage);
  if (!parsed.success) {
    const where = stage.id ?? `#${index}`;
    throw new Error(
      `محتوای مرحله‌ی ${where} نامعتبر است:\n${JSON.stringify(parsed.error.issues, null, 2)}`,
    );
  }
  return parsed.data;
});

export const STAGE_IDS: readonly string[] = STAGES.map((stage) => stage.id);

/** شماره‌ی کل مراحل داستان کامل — برای نوار پیشرفت، مستقل از تعداد پیاده‌شده. */
export const TOTAL_STAGES = 20;

export { stageSchema };
export type { Stage };
