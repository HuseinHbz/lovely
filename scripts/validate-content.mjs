#!/usr/bin/env node
/**
 * اعتبارسنجی محتوا — معیار پذیرش فاز ۴، ولی از فاز ۲ اجرا می‌شود.
 *
 *   node scripts/validate-content.mjs            گزارش کامل
 *   node scripts/validate-content.mjs --strict   با هر پیش‌نویس تأییدنشده خطا می‌دهد
 *
 * خود import شدن `content/index.ts` مراحل را با zod می‌سنجد، پس فایل خراب
 * همان‌جا خطا می‌دهد. این اسکریپت چیزهایی را چک می‌کند که اسکیما نمی‌تواند:
 * گزینه‌ی بی‌واکنش، شناسه‌ی تکراری، نقطه‌ی نقشه‌ی ناموجود و پیش‌نویس تأییدنشده.
 */

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./ts-loader.mjs', pathToFileURL(`${import.meta.dirname}/`));

const strict = process.argv.includes('--strict');

const { STAGES, TOTAL_STAGES } = await import('../content/index.ts');
const { MAP_NODE_IDS, MAP_NODES } = await import('../content/map.ts');

const errors = [];
const drafts = [];
const seenStageIds = new Set();

for (const stage of STAGES) {
  const where = `${stage.id} («${stage.title}»)`;

  if (seenStageIds.has(stage.id)) errors.push(`${where}: شناسه‌ی تکراری`);
  seenStageIds.add(stage.id);

  if (stage.mapNode !== undefined && !MAP_NODE_IDS.includes(stage.mapNode)) {
    errors.push(`${where}: نقطه‌ی نقشه‌ی «${stage.mapNode}» در content/map.ts نیست`);
  }

  for (const [index, interaction] of stage.interactions.entries()) {
    const options =
      interaction.kind === 'choice' || interaction.kind === 'pick' ? interaction.options : [];

    const seenOptionIds = new Set();
    for (const option of options) {
      if (seenOptionIds.has(option.id)) {
        errors.push(`${where} تعامل ${index}: شناسه‌ی گزینه‌ی تکراری «${option.id}»`);
      }
      seenOptionIds.add(option.id);

      // قاعده‌ی سند: گزینه‌ی بی‌واکنش یعنی گزینه‌ی تنبیهی.
      if (option.reaction.trim() === '') {
        errors.push(`${where} تعامل ${index}: گزینه‌ی «${option.label}» واکنش ندارد`);
      }
      if (option.draft === true) {
        drafts.push(`${where} → «${option.label}»`);
      }
    }

    for (const ending of stage.endings ?? []) {
      if (ending.draft === true) drafts.push(`${where} → پایان «${ending.label}»`);
    }
  }

  if (stage.status === 'pending-content') {
    drafts.push(`${where}: کل مرحله pending-content است`);
  }
}

const unlockable = new Set(
  STAGES.filter((stage) => stage.mapNode !== undefined).map((stage) => stage.mapNode),
);
const unreachable = MAP_NODES.filter((node) => !unlockable.has(node.id));

console.log(`\nاعتبارسنجی محتوا — ${STAGES.length} مرحله از ${TOTAL_STAGES}\n`);

if (unreachable.length > 0) {
  console.log(`نقاط نقشه‌ای که هنوز هیچ مرحله‌ای روشنشان نمی‌کند (${unreachable.length}):`);
  for (const node of unreachable) console.log(`   · ${node.label}`);
  console.log('');
}

if (drafts.length > 0) {
  console.log(`پیش‌نویس تأییدنشده (${drafts.length}):`);
  for (const item of drafts) console.log(`   ✎ ${item}`);
  console.log('');
}

if (errors.length > 0) {
  console.error(`خطا (${errors.length}):`);
  for (const item of errors) console.error(`   ✗ ${item}`);
  console.error('');
  process.exit(1);
}

if (strict && drafts.length > 0) {
  console.error(
    `--strict: ${drafts.length} مورد هنوز تأیید نشده. تا تأیید، محتوا منتشر نمی‌شود.\n`,
  );
  process.exit(1);
}

console.log('اسکیمای همه‌ی مراحل درست است و هیچ گزینه‌ای بدون واکنش نمانده.\n');
