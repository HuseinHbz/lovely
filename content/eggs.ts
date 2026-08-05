/**
 * تخم‌مرغ‌های عید پاک — فاز ۶ ساختشان، فاز ۹ در موزه نشانشان می‌دهد.
 *
 * `hint` عمداً مبهم است. اگر موزه دقیق بگوید کجا را کلیک کن، دیگر پیدا کردنی
 * در کار نیست. متن `found` فقط بعد از پیدا شدن دیده می‌شود.
 */

export type Egg = {
  id: string;
  /** قبل از پیدا شدن — باید کنجکاو کند، نه لو بدهد. */
  hint: string;
  /** بعد از پیدا شدن. */
  label: string;
  where: string;
};

export const EGGS = [
  {
    id: 'nazoo-secret',
    hint: 'دبیرخانه یک بند نانوشته دارد. کسی که حوصله کند پیدایش می‌کند.',
    label: 'جمله‌ی مخفی نازو',
    where: 'لایه‌ی ثبت پرونده، هر برگه‌ای',
  },
  {
    id: 'hairclip',
    hint: 'چیزی کوچک، جایی که کسی دنبالش نمی‌گردد.',
    label: 'گل‌سر',
    where: 'نقشه‌ی جنگل',
  },
  {
    id: 'lawyer-stamp',
    hint: 'یک مُهر که از بقیه بلندتر حرف می‌زند.',
    label: 'مُهر «وکیل خبر شد»',
    where: 'برگه‌های ۰۳ و ۲۲',
  },
] as const satisfies readonly Egg[];

export const EGG_IDS = EGGS.map((egg) => egg.id);
export type EggId = (typeof EGGS)[number]['id'];
