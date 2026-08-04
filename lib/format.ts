/**
 * قالب‌بندی عدد فارسی.
 *
 * `Intl` رقم‌ها را به فارسی می‌دهد؛ گروه‌بندی خاموش است چون همه‌ی عددهای این
 * پروژه کوچک‌اند (شماره‌ی مرحله، تعداد انتخاب) و جداکننده فقط شلوغی می‌آورد.
 * روی `body` هم `font-variant-numeric: tabular-nums` هست تا نلرزند.
 */
const formatter = new Intl.NumberFormat('fa-IR', { useGrouping: false });

export function faNumber(value: number): string {
  return formatter.format(value);
}
