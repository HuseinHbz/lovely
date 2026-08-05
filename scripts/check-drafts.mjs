#!/usr/bin/env node
/**
 * گارد پیش‌نویس.
 *
 * `draft: true` یعنی آن متن را من نوشته‌ام و هنوز کسی تأییدش نکرده. این
 * اسکریپت آن برچسب را از یک یادداشت به یک **گارد واقعی** تبدیل می‌کند:
 * در تولید، حتی یک پیش‌نویس تأییدنشده جلوی build را می‌گیرد.
 *
 *   node scripts/check-drafts.mjs          هشدار در development
 *   node scripts/check-drafts.mjs --list   فهرست خوانا برای مرور
 *
 * تولید یعنی `NODE_ENV=production` یا `CI=true`. `prebuild` این را صدا می‌زند،
 * و چون `prebuild` قبل از `next build` در یک پروسه‌ی جدا اجرا می‌شود،
 * `NODE_ENV` باید صریح ست شود — دقیقاً همان چیزی که معیار پذیرش می‌گوید:
 * `NODE_ENV=production pnpm build`.
 */

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./ts-loader.mjs', pathToFileURL(`${import.meta.dirname}/`));

const listOnly = process.argv.includes('--list');
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true';

const { STAGES } = await import('../content/index.ts');

/** هر مورد تأییدنشده: کدام برگه، کدام گزینه، چه متنی. */
const drafts = [];

for (const stage of STAGES) {
  const where = `content/stages/${stage.id}.ts`;

  for (const [index, interaction] of stage.interactions.entries()) {
    const options =
      interaction.kind === 'choice' || interaction.kind === 'pick' ? interaction.options : [];
    for (const option of options) {
      if (option.draft === true) {
        drafts.push({
          file: where,
          stage: stage.id,
          title: stage.title,
          id: option.id,
          text: option.label,
        });
      }
    }
    void index;
  }

  for (const ending of stage.endings ?? []) {
    if (ending.draft === true) {
      drafts.push({
        file: where,
        stage: stage.id,
        title: stage.title,
        id: `پایان:${ending.id}`,
        text: ending.label,
      });
    }
  }
}

if (listOnly) {
  if (drafts.length === 0) {
    console.log('\nهیچ پیش‌نویس تأییدنشده‌ای نمانده.\n');
    process.exit(0);
  }
  console.log(`\n${drafts.length} گزینه‌ی تأییدنشده\n`);
  let current = '';
  for (const item of drafts) {
    if (item.stage !== current) {
      current = item.stage;
      console.log(`\n${item.stage} — ${item.title}   (${item.file})`);
    }
    console.log(`   ✎ ${item.id.padEnd(18)} ${item.text}`);
  }
  console.log('\nبعد از تأیید هرکدام، `draft: true` را از همان گزینه بردار.\n');
  process.exit(0);
}

if (drafts.length === 0) {
  console.log('گارد پیش‌نویس: هیچ مورد تأییدنشده‌ای نیست.');
  process.exit(0);
}

if (isProduction) {
  console.error(
    [
      '',
      `BUILD BLOCKED: ${drafts.length} draft options are unapproved.`,
      'This project ships to a real person. Every line must be reviewed first.',
      'Run `pnpm drafts:list` to see them.',
      '',
    ].join('\n'),
  );
  process.exit(1);
}

console.warn(
  `\n⚠  ${drafts.length} گزینه هنوز تأیید نشده. در build تولیدی این جلوی انتشار را می‌گیرد.` +
    '\n   فهرستشان: pnpm drafts:list\n',
);
