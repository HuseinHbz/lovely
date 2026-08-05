import { z } from 'zod';
import {
  SETTINGS,
  WOLF_OUTFITS,
  HEDGEHOG_OUTFITS,
  checkWardrobe,
  describeViolation,
} from '@/lib/wardrobe';

/**
 * قرارداد محتوا — هسته‌ی پروژه.
 *
 * تایپ‌ها از همین اسکیماها استنتاج می‌شوند تا هیچ‌وقت تعریف تایپ و اعتبارسنجی
 * از هم جدا نیفتند. هر ۲۰ فایل مرحله در زمان build با همین‌ها سنجیده می‌شوند
 * (`pnpm validate:content`) و اگر گزینه‌ای `reaction` نداشته باشد، build می‌شکند.
 *
 * نسبت به بخش ۵ سند فازبندی چهار چیز عوض شده، چون داستان تحویلی
 * (`docs/STORY.md`) در اسکیمای قبلی جا نمی‌شد. جزئیات و دلیل هرکدام در
 * `docs/OPEN-QUESTIONS.md` بند ۳ و در `docs/02-story-engine.md` است.
 */

export const SKIN_IDS = ['cover', 'interrogation', 'map', 'mind', 'ending'] as const;
export const skinIdSchema = z.enum(SKIN_IDS);
export type SkinId = z.infer<typeof skinIdSchema>;

export const SPEAKERS = ['nazoo', 'wolf', 'hedgehog', 'owl', 'squirrel', 'system'] as const;
export const speakerSchema = z.enum(SPEAKERS);
export type Speaker = z.infer<typeof speakerSchema>;

/** شناسه‌ی مرحله: `s01` تا `s20`. */
export const stageIdSchema = z.string().regex(/^s\d{2}$/, 'شناسه‌ی مرحله باید مثل s01 باشد');

const slug = z.string().min(1);
const text = z.string().min(1);

export const optionSchema = z.object({
  id: slug,
  label: text,
  /**
   * دیالوگ واکنش. اجباری است — قاعده‌ی سند: «گزینه‌ی بی‌واکنش یعنی گزینه‌ی تنبیهی».
   */
  reaction: text,
  /** متن مُهر: «ثبت شد»، «مشکوک»، «وکیل خبر شد»، … */
  stamp: text.optional(),
  reactionSpeaker: speakerSchema.optional(),
  /**
   * `true` یعنی این واکنش پیش‌نویس است و هنوز تأیید نشده.
   * `pnpm validate:content --strict` روی هر پیش‌نویس تأییدنشده خطا می‌دهد،
   * پس محتوای تأییدنشده نمی‌تواند بی‌سروصدا به تولید برود.
   */
  draft: z.literal(true).optional(),
});
export type Option = z.infer<typeof optionSchema>;

const optionList = z.array(optionSchema).min(2, 'هر تعامل حداقل دو گزینه لازم دارد');

/**
 * `choice` دو شکل دارد (تکی و چندتایی) و هر دو `kind: 'choice'` هستند، پس
 * نمی‌توانند هر دو عضو مستقیم یک discriminatedUnion روی `kind` باشند.
 * تفکیک داخلی روی `multi` انجام می‌شود و کل این اتحاد یک عضو بیرونی می‌شود.
 */
const choiceInteractionSchema = z.discriminatedUnion('multi', [
  z.object({
    kind: z.literal('choice'),
    multi: z.literal(false),
    prompt: text.optional(),
    options: optionList,
  }),
  z.object({
    kind: z.literal('choice'),
    multi: z.literal(true),
    prompt: text.optional(),
    options: optionList,
    min: z.number().int().positive().optional(),
    max: z.number().int().positive().optional(),
  }),
]);

export const interactionSchema = z.discriminatedUnion('kind', [
  choiceInteractionSchema,
  z.object({
    kind: z.literal('sort'),
    items: z.array(z.object({ id: slug, label: text })).min(2),
    message: text,
  }),
  z.object({
    kind: z.literal('find'),
    hotspots: z
      .array(
        z.object({
          id: slug,
          label: text,
          x: z.number(),
          y: z.number(),
          r: z.number().positive(),
          correct: z.boolean(),
          reaction: text,
        }),
      )
      .min(2),
  }),
  z.object({
    kind: z.literal('split'),
    prompt: text.optional(),
    cards: z.array(z.object({ id: slug, label: text, bucket: slug })).min(1),
    buckets: z.array(z.object({ id: slug, label: text })).min(2),
    message: text,
    /**
     * افزوده نسبت به سند: واکنش رد شدن برای کارت در کشوی اشتباه.
     * مرحله ۱۹ داستان سه واکنش مشخص برای جای اشتباه دارد و بدون این جایی نداشتند.
     */
    rejections: z.array(z.object({ cardId: slug, bucketId: slug, reaction: text })).optional(),
  }),
  z.object({
    kind: z.literal('pick'),
    prompt: text.optional(),
    options: optionList,
    note: text,
  }),
  /**
   * افزوده نسبت به سند: دکمه‌ای که با هر کلیک یک جمله‌ی تازه نشان می‌دهد.
   * مرحله ۱۳ داستان («نمی‌دونم») دقیقاً همین است و هیچ `kind` موجودی پوشش‌اش نمی‌داد.
   */
  z.object({
    kind: z.literal('repeat'),
    label: text,
    phrases: z.array(text).min(1),
    threshold: z.number().int().positive(),
    message: text,
  }),
]);
export type Interaction = z.infer<typeof interactionSchema>;
export type InteractionKind = Interaction['kind'];

export const endingSchema = z.object({
  id: slug,
  label: text,
  message: text,
  draft: z.literal(true).optional(),
});
export type Ending = z.infer<typeof endingSchema>;

export const stageSchema = z
  .object({
    id: stageIdSchema,
    /** فصل داستان. سند ۵ فصل داشت؛ داستان تحویلی ۹ فصل دارد. */
    act: z.number().int().min(1).max(9),
    title: text,
    skin: skinIdSchema,
    /** نقطه‌ای از نقشه که با تمام‌شدن این مرحله روشن می‌شود. */
    mapNode: slug.optional(),
    /**
     * محیط صحنه. لباس مجاز شخصیت‌ها را تعیین می‌کند؛ قاعده‌ی راهنمای شخصیت
     * پایین در `superRefine` سنجیده می‌شود، پس نقض آن build را می‌شکند.
     */
    setting: z.enum(SETTINGS).optional(),
    /** لباس شخصیت‌ها در این مرحله. اگر ندهی، پیش‌فرض کامپوننت اعمال می‌شود. */
    wardrobe: z
      .object({
        wolf: z.enum(WOLF_OUTFITS).optional(),
        hedgehog: z.enum(HEDGEHOG_OUTFITS).optional(),
      })
      .optional(),
    lines: z.array(z.object({ speaker: speakerSchema, text })).min(1),
    /**
     * افزوده نسبت به سند: آرایه به‌جای یک تعامل.
     * مرحله ۲۰ داستان دو تعامل پشت سر هم دارد (سفارش، بعد پاسخ نهایی).
     */
    interactions: z.array(interactionSchema).min(1),
    closing: text.optional(),
    /** فقط مرحله‌ی پایانی: دکمه‌های پایان باز. */
    endings: z.array(endingSchema).min(2).optional(),
    status: z.enum(['ready', 'pending-content']).default('ready'),
  })
  .superRefine((stage, ctx) => {
    for (const [index, interaction] of stage.interactions.entries()) {
      const at = ['interactions', index] as const;

      if (interaction.kind === 'choice' && interaction.multi) {
        const { min, max, options } = interaction;
        if (min !== undefined && max !== undefined && min > max) {
          ctx.addIssue({ code: 'custom', path: [...at, 'min'], message: 'min از max بیشتر است' });
        }
        if (max !== undefined && max > options.length) {
          ctx.addIssue({
            code: 'custom',
            path: [...at, 'max'],
            message: 'max از تعداد گزینه‌ها بیشتر است',
          });
        }
      }

      if (interaction.kind === 'find' && !interaction.hotspots.some((spot) => spot.correct)) {
        ctx.addIssue({
          code: 'custom',
          path: [...at, 'hotspots'],
          message: 'حداقل یک نقطه‌ی درست لازم است',
        });
      }

      if (interaction.kind === 'split') {
        const bucketIds = new Set(interaction.buckets.map((bucket) => bucket.id));
        for (const [cardIndex, card] of interaction.cards.entries()) {
          if (!bucketIds.has(card.bucket)) {
            ctx.addIssue({
              code: 'custom',
              path: [...at, 'cards', cardIndex, 'bucket'],
              message: `کشوی «${card.bucket}» تعریف نشده`,
            });
          }
        }
        const cardIds = new Set(interaction.cards.map((card) => card.id));
        for (const [rejectionIndex, rejection] of (interaction.rejections ?? []).entries()) {
          if (!cardIds.has(rejection.cardId) || !bucketIds.has(rejection.bucketId)) {
            ctx.addIssue({
              code: 'custom',
              path: [...at, 'rejections', rejectionIndex],
              message: 'واکنش رد به کارت یا کشوی ناموجود اشاره می‌کند',
            });
          }
        }
      }

      if (interaction.kind === 'repeat' && interaction.threshold > interaction.phrases.length) {
        ctx.addIssue({
          code: 'custom',
          path: [...at, 'threshold'],
          message: 'threshold از تعداد جمله‌ها بیشتر است',
        });
      }
    }

    // قاعده‌ی راهنمای شخصیت: گرگ در محیط کاری همیشه کت و شلوار، و جوجه‌تیغی
    // داخل بیمارستان همیشه روپوش پرستاری.
    if (stage.setting !== undefined && stage.wardrobe !== undefined) {
      const violation = checkWardrobe(stage.setting, {
        wolf: stage.wardrobe.wolf,
        hedgehog: stage.wardrobe.hedgehog,
      });
      if (violation !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['wardrobe', violation.who],
          message: describeViolation(violation),
        });
      }
    }

    if (stage.endings !== undefined && stage.skin !== 'ending') {
      ctx.addIssue({
        code: 'custom',
        path: ['endings'],
        message: 'فقط مرحله‌ی با اسکین ending می‌تواند endings داشته باشد',
      });
    }
  });

export type Stage = z.infer<typeof stageSchema>;
/** ورودی قبل از اعمال پیش‌فرض‌ها — چیزی که فایل‌های `content/stages/*.ts` می‌نویسند. */
export type StageInput = z.input<typeof stageSchema>;

/** کمک‌کننده‌ی تایپ‌دار برای فایل‌های مرحله. چیزی را تغییر نمی‌دهد. */
export function defineStage(stage: StageInput): StageInput {
  return stage;
}

export const mapNodeSchema = z.object({
  id: slug,
  label: text,
  /** مختصات روی viewBox نقشه، درصدی. */
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});
export type MapNode = z.infer<typeof mapNodeSchema>;

export const characterSchema = z.object({
  id: speakerSchema,
  name: text,
  /** سمت ورود در RTL — بخش ۳٫۴ سند. */
  side: z.enum(['start', 'end', 'center']),
});
export type Character = z.infer<typeof characterSchema>;
