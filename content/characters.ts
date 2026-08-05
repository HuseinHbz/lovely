import { characterSchema, type Character, type Speaker } from './schema';

/**
 * شخصیت‌ها — نام‌ها مستقیم از `docs/STORY.md` می‌آیند، نه از تخیل من (قاعده ۱).
 *
 * `side` سمت ورود در RTL است. بخش ۳٫۴ سند: گرگ سمت راست کارت، جوجه‌تیغی سمت چپ.
 * پاندا و جغد رئیس وسط می‌مانند چون صدای پرونده‌اند و رو به کاربر حرف می‌زنند،
 * نه رو به یکدیگر — اگر ترجیح دیگری داشتی، همین یک فیلد است.
 */
const characters: Record<Speaker, Character> = {
  // پاندا هم منشی پرونده است و هم راوی — `MERGED-SPEC` بخش ۱.
  nazoo: { id: 'nazoo', name: 'پاندا', side: 'center' },
  wolf: { id: 'wolf', name: 'گرگ', side: 'start' },
  hedgehog: { id: 'hedgehog', name: 'جوجه‌تیغی', side: 'end' },
  // جغد رئیس فقط واسطه‌ی آشناییست و وارد جزئیات رابطه نمی‌شود (قانون ۱۴ سند).
  owl: { id: 'owl', name: 'جغد رئیس', side: 'center' },
  // ابی: نقش آرام‌کننده و شوخی، گاهی شاهد دعوا (قانون ۱۵ سند).
  abi: { id: 'abi', name: 'ابی', side: 'end' },
  system: { id: 'system', name: 'پرونده', side: 'center' },
};

for (const character of Object.values(characters)) {
  characterSchema.parse(character);
}

export function getCharacter(speaker: Speaker): Character {
  return characters[speaker];
}

/** `system` نام گوینده نشان نمی‌دهد؛ صدای خود پرونده است. */
export function speakerName(speaker: Speaker): string | undefined {
  return speaker === 'system' ? undefined : characters[speaker].name;
}

export { characters };
