import { STAGES } from '@/content/index';
import { MAP_NODES } from '@/content/map';
import { ACHIEVEMENTS } from '@/content/achievements';
import { EGGS } from '@/content/eggs';

/**
 * محاسبه‌ی «چه چیزی جمع شده» و «چه چیزی دیده نشده» — فاز ۹.
 *
 * توابع خالص‌اند و ورودی‌شان همان چیزی است که در `localStorage` هست. هیچ‌کدام
 * چیزی نمی‌فرستند و هیچ‌کدام به سرور کاری ندارند — موزه و پخش دوباره کاملاً
 * از روی داده‌ی خود مرورگر ساخته می‌شوند.
 */

export type StageReplay = {
  id: string;
  title: string;
  folder: number;
  /** کل گزینه‌های متنی این برگه. برگه‌های روایی صفر دارند. */
  total: number;
  seen: number;
  /** برچسب گزینه‌هایی که هنوز انتخاب نشده‌اند. */
  unseen: string[];
};

/** همه‌ی گزینه‌های متنی یک برگه، صاف‌شده روی تعامل‌ها. */
function optionsOf(stage: (typeof STAGES)[number]) {
  return stage.interactions.flatMap((interaction) =>
    interaction.kind === 'choice' || interaction.kind === 'pick' ? interaction.options : [],
  );
}

export function replayFor(seenOptions: Record<string, string[]>): StageReplay[] {
  return STAGES.map((stage) => {
    const options = optionsOf(stage);
    const seen = new Set(seenOptions[stage.id] ?? []);
    return {
      id: stage.id,
      title: stage.title,
      folder: stage.folder,
      total: options.length,
      seen: options.filter((option) => seen.has(option.id)).length,
      unseen: options.filter((option) => !seen.has(option.id)).map((option) => option.label),
    };
  });
}

export type CollectionTotals = {
  achievements: { got: number; total: number };
  nodes: { got: number; total: number };
  eggs: { got: number; total: number };
  reactions: { got: number; total: number };
};

export function totalsFor(
  achievements: readonly string[],
  unlockedNodes: readonly string[],
  foundEggs: readonly string[],
  seenOptions: Record<string, string[]>,
): CollectionTotals {
  const replay = replayFor(seenOptions);
  return {
    achievements: { got: achievements.length, total: ACHIEVEMENTS.length },
    nodes: { got: unlockedNodes.length, total: MAP_NODES.length },
    eggs: { got: foundEggs.length, total: EGGS.length },
    reactions: {
      got: replay.reduce((sum, stage) => sum + stage.seen, 0),
      total: replay.reduce((sum, stage) => sum + stage.total, 0),
    },
  };
}
