import { mapNodeSchema, type MapNode } from './schema';

/**
 * نقشه‌ی داستان — `STORY-28.md` بخش ۱۹.
 *
 * نسخه ۱ نُه نقطه‌ی **مکانی** داشت (مغازه‌ی تراول‌ماگ، بلوار دوردور و…). نسخه ۲
 * به‌جای مکان، **گره‌های داستانی** دارد: هر گره یک لحظه‌ی پرونده است، نه یک آدرس.
 * از نُه نقطه‌ی قبلی فقط بیمارستان بازگشت.
 *
 * `x` و `y` درصدی روی viewBox نقشه‌اند و مسیر را از بالا به پایین می‌سازند.
 */
export const MAP_NODES = [
  { id: 'first-meeting', label: 'آشنایی', x: 22, y: 8 },
  { id: 'first-chat', label: 'اولین چت', x: 48, y: 14 },
  { id: 'nicknames', label: 'لقب‌ها', x: 74, y: 12 },
  { id: 'court', label: 'دادگاه', x: 82, y: 24 },
  { id: 'panda', label: 'پاندا', x: 60, y: 30 },
  { id: 'gifts', label: 'هدیه', x: 34, y: 34 },
  { id: 'night', label: 'شب‌نشینی', x: 16, y: 42 },
  { id: 'dragon', label: 'اژدها', x: 38, y: 48 },
  { id: 'food', label: 'غذا', x: 64, y: 52 },
  { id: 'outing', label: 'بیرون رفتن', x: 84, y: 58 },
  { id: 'misunderstanding', label: 'سوءتفاهم', x: 62, y: 68 },
  { id: 'conflict', label: 'قهر', x: 34, y: 72 },
  { id: 'repair', label: 'ترمیم', x: 20, y: 82 },
  { id: 'trust', label: 'اعتماد', x: 48, y: 88 },
  { id: 'next-chapter', label: 'فصل بعد', x: 76, y: 92 },
] as const satisfies readonly MapNode[];

for (const node of MAP_NODES) {
  mapNodeSchema.parse(node);
}

export type MapNodeId = (typeof MAP_NODES)[number]['id'];

export const MAP_NODE_IDS: readonly string[] = MAP_NODES.map((node) => node.id);

export function getMapNode(id: string): MapNode | undefined {
  return MAP_NODES.find((node) => node.id === id);
}
