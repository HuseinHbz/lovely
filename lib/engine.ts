import { STAGES, TOTAL_STAGES } from '@/content';
import type { Interaction, Option, Stage } from '@/content/schema';

/**
 * موتور داستان — ناوبری، اعتبارسنجی انتخاب و محاسبه‌ی نقاط نقشه.
 *
 * هیچ state ای اینجا نیست؛ همه‌چیز تابع خالص است تا هم در کامپوننت و هم در
 * اسکریپت تست مسیر (فاز ۷) بدون مرورگر قابل اجرا باشد.
 *
 * قاعده ۳ (هیچ مسیر بن‌بستی): مرحله‌ی بعد فقط به ترتیب آرایه بستگی دارد، نه به
 * انتخاب کاربر. هیچ گزینه‌ای مسیر را نمی‌بندد و هیچ‌کس به عقب برنمی‌گردد.
 */

export const FIRST_STAGE_ID = STAGES[0]?.id ?? 'p00';

export function getStage(stageId: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === stageId);
}

export function stageIndex(stageId: string): number {
  return STAGES.findIndex((stage) => stage.id === stageId);
}

export function getNextStageId(stageId: string): string | undefined {
  const index = stageIndex(stageId);
  if (index < 0) return undefined;
  return STAGES[index + 1]?.id;
}

export function getPrevStageId(stageId: string): string | undefined {
  const index = stageIndex(stageId);
  if (index <= 0) return undefined;
  return STAGES[index - 1]?.id;
}

export function isLastStage(stageId: string): boolean {
  return getNextStageId(stageId) === undefined;
}

/** گزینه‌های یک تعامل، اگر آن تعامل اصلاً گزینه داشته باشد. */
export function optionsOf(interaction: Interaction): readonly Option[] {
  switch (interaction.kind) {
    case 'choice':
    case 'pick':
      return interaction.options;
    default:
      return [];
  }
}

export function findOption(interaction: Interaction, optionId: string): Option | undefined {
  return optionsOf(interaction).find((option) => option.id === optionId);
}

export type SelectionError =
  | { reason: 'unknown-option'; optionId: string }
  | { reason: 'too-few'; min: number }
  | { reason: 'too-many'; max: number }
  | { reason: 'single-only' }
  | { reason: 'empty' };

/**
 * انتخاب کاربر را می‌سنجد.
 *
 * «نامعتبر» فقط یعنی شکل انتخاب با تعامل نمی‌خواند (مثلاً دو گزینه در تعامل تکی)
 * — نه اینکه کاربر جواب غلط داده. هیچ گزینه‌ای غلط نیست.
 */
export function validateSelection(
  interaction: Interaction,
  selected: readonly string[],
): SelectionError | undefined {
  const options = optionsOf(interaction);
  if (options.length === 0) return undefined;

  for (const optionId of selected) {
    if (!options.some((option) => option.id === optionId)) {
      return { reason: 'unknown-option', optionId };
    }
  }

  if (interaction.kind === 'choice' && interaction.multi) {
    const min = interaction.min ?? 1;
    const max = interaction.max ?? options.length;
    if (selected.length < min) return { reason: 'too-few', min };
    if (selected.length > max) return { reason: 'too-many', max };
    return undefined;
  }

  if (selected.length === 0) return { reason: 'empty' };
  if (selected.length > 1) return { reason: 'single-only' };
  return undefined;
}

/** واکنش‌هایی که باید بعد از انتخاب نشان داده شوند، به ترتیب گزینه‌ها. */
export function reactionsFor(
  interaction: Interaction,
  selected: readonly string[],
): readonly Option[] {
  return optionsOf(interaction).filter((option) => selected.includes(option.id));
}

export type Choices = Readonly<Record<string, readonly string[]>>;

/**
 * برگه وقتی تمام‌شده حساب می‌شود که برای هر تعاملش انتخابی ثبت شده باشد.
 * برگه‌ی صرفاً روایی (بدون تعامل) با یک بار دیده شدن تمام می‌شود.
 */
export function isStageComplete(stage: Stage, choices: Choices): boolean {
  const recorded = choices[stage.id];
  if (recorded === undefined) return false;
  return recorded.length >= Math.max(stage.interactions.length, 1);
}

export function completedStageIds(choices: Choices): readonly string[] {
  return STAGES.filter((stage) => isStageComplete(stage, choices)).map((stage) => stage.id);
}

/** نقاط نقشه‌ای که با تمام‌شدن مراحل روشن شده‌اند. */
export function unlockedNodesFor(choices: Choices): readonly string[] {
  const nodes = new Set<string>();
  for (const stage of STAGES) {
    if (stage.mapNode !== undefined && isStageComplete(stage, choices)) {
      nodes.add(stage.mapNode);
    }
  }
  return [...nodes];
}

export type Progress = {
  /** شماره‌ی مرحله‌ی جاری، از ۱ */
  current: number;
  /** تعداد مراحل تمام‌شده */
  done: number;
  /** کل مراحل داستان کامل (۲۰)، نه فقط پیاده‌شده‌ها */
  total: number;
  /** تعداد مراحلی که واقعاً در مخزن هستند */
  implemented: number;
};

export function progressFor(stageId: string, choices: Choices): Progress {
  return {
    current: stageIndex(stageId) + 1,
    done: completedStageIds(choices).length,
    total: TOTAL_STAGES,
    implemented: STAGES.length,
  };
}

export { STAGES, TOTAL_STAGES };
