import { mapNodeSchema, type MapNode } from './schema';

/**
 * نقاط نقشه‌ی جنگل.
 *
 * معیار پذیرش فاز ۴ می‌گوید در پایان داستان باید هر ۹ نقطه روشن باشند، ولی سند
 * فازبندی فقط ۷ نقطه نام برده بود. دو نقطه‌ی «مغازه‌ی عروسک‌ها» و «پمپ‌بنزین» از
 * صحنه‌ی نقشه‌ی مرحله ۸ داستان آمده‌اند، و «کافه‌ی نامعلوم» همان کافه‌ای فرض شده که
 * در مرحله ۱۹ اسمش می‌شود «وافل و نوتلا» — با این فرض دقیقاً ۹ می‌شود.
 * این فرض هنوز تأیید نشده: `docs/OPEN-QUESTIONS.md` بند ۴.
 *
 * `x` و `y` درصدی روی viewBox نقشه‌اند و در فاز ۳ با SVG واقعی هماهنگ می‌شوند.
 */
export const MAP_NODES = [
  { id: 'bimarestan', label: 'بیمارستان جغدها', x: 24, y: 18 },
  { id: 'arousakha', label: 'مغازه‌ی عروسک‌ها', x: 52, y: 26 },
  { id: 'travel-mug', label: 'فروشگاه تراول‌ماگ', x: 71, y: 33 },
  { id: 'boulevard', label: 'بلوار دوردور', x: 46, y: 48 },
  { id: 'pomp-benzin', label: 'پمپ‌بنزین', x: 78, y: 57 },
  { id: 'istgah-story', label: 'ایستگاه استوری‌های مشکوک', x: 30, y: 62 },
  { id: 'golsar', label: 'قبرستان گل‌سر صورتی', x: 60, y: 72 },
  { id: 'dadgah', label: 'دادگاه خانم بازرس', x: 18, y: 80 },
  { id: 'cafe', label: 'کافه‌ی وافل و نوتلا', x: 50, y: 88 },
] as const satisfies readonly MapNode[];

for (const node of MAP_NODES) {
  mapNodeSchema.parse(node);
}

export type MapNodeId = (typeof MAP_NODES)[number]['id'];

export const MAP_NODE_IDS: readonly string[] = MAP_NODES.map((node) => node.id);

export function getMapNode(id: string): MapNode | undefined {
  return MAP_NODES.find((node) => node.id === id);
}
