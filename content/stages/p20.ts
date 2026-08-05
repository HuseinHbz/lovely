import { defineStage } from '../schema';

/**
 * برگه ۲۰ — سوءتفاهم بزرگ. `STORY-28.md` بخش PHASE 20.
 *
 * قانون ۹ سند: هر دو شخصیت باید اشتباه کنند. اینجا هر دو می‌کنند — یکی توضیح
 * نمی‌دهد، دیگری زودتر از واقعیت نتیجه می‌گیرد. هیچ گزینه‌ای «غلط» اعلام نمی‌شود.
 */
export const p20 = defineStage({
  id: 'p20',
  folder: 5,
  title: 'سوءتفاهم بزرگ',
  skin: 'interrogation',
  mapNode: 'misunderstanding',
  achievement: 'ghahr-tarikhi',
  setting: { wolf: 'work', hedgehog: 'hospital' },
  wardrobe: { wolf: 'desk', hedgehog: 'nurse' },
  lines: [
    {
      speaker: 'nazoo',
      text: 'ذهن گرگ جای دیگری بود. یک مشکل مالی که نمی‌خواست درباره‌اش حرف بزند.',
    },
    { speaker: 'wolf', text: 'تمرکز ندارم.' },
    { speaker: 'nazoo', text: 'و طرف مقابل شنید: «حوصله‌ات را ندارم.»' },
    {
      speaker: 'nazoo',
      text: 'مشکل همیشه چیزی نیست که گفته می‌شود. گاهی چیزی است که هر دو نفر فکر می‌کنند طرف مقابل منظورش بوده.',
    },
  ],
  interactions: [
    {
      kind: 'choice',
      multi: false,
      prompt: 'گرگ توضیح می‌دهد یا نه؟',
      options: [
        {
          id: 'explain',
          label: 'می‌گویم مشکل چیست، حتی اگر سخت باشد.',
          reaction:
            'گرگ توضیح داد. سوءتفاهم همان‌جا تمام نشد، ولی دیگر بزرگ‌تر هم نشد. همین کافی بود.',
          reactionSpeaker: 'nazoo',
          stamp: 'ثبت شد',
          draft: true,
        },
        {
          id: 'stay-quiet',
          label: 'نمی‌خواهم درگیرش کنم. چیزی نمی‌گویم.',
          reaction:
            'گرگ سکوت کرد تا کسی نگران نشود. نتیجه‌اش این شد که طرف مقابل نگران چیز دیگری شد.',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'later',
          label: 'الان نه. بعداً حرف می‌زنیم.',
          reaction: 'به تعویق افتاد. «بعداً» در این پرونده معمولاً یعنی «وقتی هر دو خسته‌تر شدیم».',
          reactionSpeaker: 'nazoo',
          stamp: 'مشکوک',
          draft: true,
        },
        {
          id: 'deflect',
          label: 'چیزی نیست. تو زیادی فکر می‌کنی.',
          reaction:
            'این جمله هیچ‌وقت در تاریخ هیچ رابطه‌ای کار نکرده. پرونده آن را به‌عنوان مدرک ثبت کرد و سراغ برگه‌ی بعد رفت.',
          reactionSpeaker: 'nazoo',
          stamp: 'مردود',
          draft: true,
        },
      ],
    },
  ],
  meters: { hamkari: -1, amniyat: -1 },
  panda:
    'هر دو روایت کنار هم ثبت شد. روایت اول: قصد بی‌احترامی نبود. روایت دوم: گارد باید بالا می‌رفت. هر دو درست‌اند و این بدترین حالت ممکن است.',
});
