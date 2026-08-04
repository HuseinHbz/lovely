'use client';

import { useState } from 'react';
import type { Interaction, Option } from '@/content/schema';
import { Button } from '@/components/ui/Button';
import { faNumber } from '@/lib/format';

/**
 * فهرست گزینه — تعامل‌های `choice` (تکی و چندتایی) و `pick`.
 *
 * قاعده ۳: هیچ گزینه‌ای بن‌بست نیست و هیچ گزینه‌ای غلط اعلام نمی‌شود. تنها کاری
 * که اینجا انجام می‌شود، جمع کردن انتخاب و دادنش به بالادست است.
 */
export function ChoiceList({
  interaction,
  onSubmit,
  disabled = false,
}: {
  interaction: Extract<Interaction, { kind: 'choice' | 'pick' }>;
  onSubmit: (selected: string[]) => void;
  disabled?: boolean;
}) {
  const isMulti = interaction.kind === 'choice' && interaction.multi;
  const [selected, setSelected] = useState<string[]>([]);

  const min = isMulti ? (interaction.min ?? 1) : 1;
  const max = isMulti ? (interaction.max ?? interaction.options.length) : 1;
  const canSubmit = selected.length >= min && selected.length <= max;

  function toggle(option: Option) {
    if (disabled) return;
    if (!isMulti) {
      // در حالت تکی هم انتخاب را نگه می‌داریم تا بعد از پاسخ دادن معلوم بماند
      // کاربر کدام را زده؛ وگرنه همه‌ی گزینه‌ها یک‌شکل خاکستری می‌شوند.
      setSelected([option.id]);
      onSubmit([option.id]);
      return;
    }
    setSelected((current) =>
      current.includes(option.id)
        ? current.filter((id) => id !== option.id)
        : current.length >= max
          ? current
          : [...current, option.id],
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {interaction.prompt !== undefined && (
        <p className="text-lg font-medium text-kaj">{interaction.prompt}</p>
      )}

      <ul className="flex flex-col gap-2" role={isMulti ? 'group' : undefined}>
        {interaction.options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={isMulti ? isSelected : undefined}
                onClick={() => toggle(option)}
                className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-start text-base transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected
                    ? 'border-tigh bg-tigh/15 text-kaj'
                    : 'border-kaj/25 text-kaj hover:border-tigh hover:bg-tigh/10'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-4 shrink-0 border ${isMulti ? 'rounded-[3px]' : 'rounded-full'} ${
                    isSelected ? 'border-tigh bg-tigh' : 'border-kaj/40'
                  }`}
                />
                <span>{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {interaction.kind === 'pick' && (
        <p className="text-sm text-kaj/70 italic">{interaction.note}</p>
      )}

      {isMulti && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="solid"
            disabled={disabled || !canSubmit}
            onClick={() => onSubmit(selected)}
          >
            ثبت در پرونده
          </Button>
          <span className="font-ui text-xs text-kaj/70">
            {faNumber(selected.length)} از {faNumber(max)} انتخاب شد
            {min > 1 ? ` — حداقل ${faNumber(min)} مورد` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
