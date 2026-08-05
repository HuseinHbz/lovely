'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Stage } from '@/content/schema';
import { getNextStageId, reactionsFor, progressFor, FIRST_STAGE_ID } from '@/lib/engine';
import { useStoryStore, clearProgress } from '@/lib/store';
import { speakerName, getCharacter } from '@/content/characters';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SpeakerBubble } from '@/components/ui/SpeakerBubble';
import { ProgressSeal } from '@/components/ui/ProgressSeal';
import { PandaLog } from '@/components/ui/PandaLog';
import { CaseSummary } from '@/components/ui/CaseSummary';
import { EndingChoice } from '@/components/interactions/EndingChoice';
import { ChoiceList } from '@/components/interactions/ChoiceList';
import { CardSplit } from '@/components/interactions/CardSplit';
import { MapFind } from '@/components/interactions/MapFind';
import { SkinFrame } from '@/components/skins/SkinFrame';
import { faNumber } from '@/lib/format';

/**
 * نمای یک مرحله.
 *
 * انیمیشن ورود و خروج طبق بخش ۴ سند؛ با `prefers-reduced-motion: reduce`
 * همه‌شان به یک fade ساده‌ی ۰٫۲ ثانیه تبدیل می‌شوند.
 */
export function StageView({ stage }: { stage: Stage }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const goTo = useStoryStore((state) => state.goTo);
  const recordChoice = useStoryStore((state) => state.recordChoice);
  const markSeen = useStoryStore((state) => state.markSeen);
  const applyStage = useStoryStore((state) => state.applyStage);
  const choices = useStoryStore((state) => state.choices);
  const unlockedNodes = useStoryStore((state) => state.unlockedNodes);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[] | undefined>(undefined);

  // هر بار که برگه عوض می‌شود، تعامل و انتخاب از نو شروع می‌شوند.
  //
  // اثر برگه (نشان، شاخص، و برای برگه‌ی روایی علامت دیده‌شدن) همین‌جا اعمال
  // می‌شود، نه موقع رفتن به برگه‌ی بعد — وگرنه آخرین برگه که «بعدی» ندارد
  // هیچ‌وقت نشان و گره‌ی نقشه‌ی خودش را نمی‌گرفت. `applyStage` idempotent است.
  useEffect(() => {
    setStep(0);
    setSelected(undefined);
    goTo(stage.id);
    applyStage(stage.id);
    if (stage.interactions.length === 0) markSeen(stage.id);
  }, [stage.id, stage.interactions.length, goTo, applyStage, markSeen]);

  const interaction = stage.interactions[step];
  /** برگه‌ی صرفاً روایی — `MERGED-SPEC` بخش ۶ برای برگه ۰۰ تعاملی نگذاشته. */
  const isNarrationOnly = stage.interactions.length === 0;
  const isLastInteraction = step >= stage.interactions.length - 1;
  const nextStageId = getNextStageId(stage.id);
  const progress = progressFor(stage.id, choices);

  const enter = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: { type: 'spring' as const, stiffness: 260, damping: 26 },
      };
  const from = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotate: -1.5 };
  const exit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.2 } }
    : { opacity: 0, x: -30, y: -20, rotate: 2, transition: { duration: 0.35 } };

  function handleSubmit(picked: string[]) {
    if (interaction === undefined) return;
    recordChoice(stage.id, step, picked);
    setSelected(picked);
  }

  function handleAdvance() {
    if (isNarrationOnly) {
      if (nextStageId !== undefined) router.push(`/story/${nextStageId}`);
      return;
    }
    if (!isLastInteraction) {
      setStep((current) => current + 1);
      setSelected(undefined);
      return;
    }
    if (nextStageId !== undefined) router.push(`/story/${nextStageId}`);
  }

  const reactions =
    interaction !== undefined && selected !== undefined ? reactionsFor(interaction, selected) : [];
  const hasDraft = reactions.some((option) => option.draft === true);

  return (
    <main className="flex min-h-dvh flex-col items-center gap-6 px-safe py-8">
      <div className="flex w-full max-w-card flex-col gap-2">
        <ProgressSeal total={progress.total} done={progress.done} current={progress.current} />
        <p className="font-ui text-xs tracking-[0.04em] text-jooheh-text">
          برگه {faNumber(progress.current)} از {faNumber(progress.total)}
          {progress.implemented < progress.total
            ? ` — فعلاً ${faNumber(progress.implemented)} برگه پیاده شده`
            : ''}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${stage.id}-${step}`}
          initial={from}
          animate={enter}
          exit={exit}
          className="flex w-full justify-center"
        >
          <SkinFrame
            skin={stage.skin}
            unlocked={unlockedNodes}
            wolfOutfit={stage.wardrobe?.wolf ?? 'formal'}
            hedgehogOutfit={stage.wardrobe?.hedgehog ?? 'nurse'}
          >
            <Card label="پرونده‌ی محرمانه شماره ۲۷" title={stage.title}>
              <div className="flex flex-col gap-4">
                {stage.lines.map((line, index) => (
                  <SpeakerBubble
                    key={`${line.speaker}-${index}`}
                    // وقتی چند خط پشت سر هم از یک گوینده است، نام فقط یک بار می‌آید.
                    name={
                      stage.lines[index - 1]?.speaker === line.speaker
                        ? undefined
                        : speakerName(line.speaker)
                    }
                    side={getCharacter(line.speaker).side}
                  >
                    {line.text}
                  </SpeakerBubble>
                ))}

                {!isNarrationOnly && <hr className="border-kaj/15" />}

                {isNarrationOnly && (
                  <div className="flex flex-col gap-4">
                    {stage.showSummary === true && <CaseSummary />}

                    {stage.endings !== undefined && (
                      <EndingChoice endings={stage.endings} closing={stage.closing} />
                    )}

                    {stage.panda !== undefined && <PandaLog>{stage.panda}</PandaLog>}

                    {nextStageId !== undefined && (
                      <Button variant="solid" onClick={handleAdvance}>
                        برگه‌ی بعد
                      </Button>
                    )}
                  </div>
                )}

                {interaction !== undefined &&
                  (interaction.kind === 'choice' || interaction.kind === 'pick') && (
                    <ChoiceList
                      interaction={interaction}
                      onSubmit={handleSubmit}
                      disabled={selected !== undefined}
                    />
                  )}

                {interaction !== undefined && interaction.kind === 'split' && (
                  <CardSplit
                    interaction={interaction}
                    onDone={() => handleSubmit([interaction.kind])}
                    disabled={selected !== undefined}
                  />
                )}

                {interaction !== undefined && interaction.kind === 'find' && (
                  <MapFind
                    interaction={interaction}
                    onDone={() => handleSubmit([interaction.kind])}
                    disabled={selected !== undefined}
                  />
                )}

                {interaction !== undefined &&
                  (interaction.kind === 'sort' || interaction.kind === 'repeat') && (
                    <p className="rounded-md border border-dashed border-jooheh/50 p-4 text-sm text-kaj/70">
                      تعامل «{interaction.kind}» در هیچ برگه‌ای استفاده نشده.
                    </p>
                  )}

                <AnimatePresence>
                  {selected !== undefined && (
                    <motion.div
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduceMotion ? 0.2 : 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      {reactions.map((option) => (
                        <SpeakerBubble
                          key={option.id}
                          side={
                            option.reactionSpeaker === undefined
                              ? 'center'
                              : getCharacter(option.reactionSpeaker).side
                          }
                          name={
                            option.reactionSpeaker === undefined
                              ? undefined
                              : speakerName(option.reactionSpeaker)
                          }
                        >
                          {option.reaction}
                        </SpeakerBubble>
                      ))}

                      {isLastInteraction && stage.closing !== undefined && (
                        <p className="text-base leading-[1.9] text-kaj">{stage.closing}</p>
                      )}

                      {isLastInteraction && stage.panda !== undefined && (
                        <PandaLog>{stage.panda}</PandaLog>
                      )}

                      {hasDraft && (
                        <p className="rounded-md border border-dashed border-mohr/60 px-3 py-2 font-ui text-xs text-mohr">
                          این واکنش پیش‌نویس است و هنوز تأیید نشده.
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        {(!isLastInteraction || nextStageId !== undefined) && (
                          <Button variant="solid" onClick={handleAdvance}>
                            {isLastInteraction ? 'برگه‌ی بعد' : 'ادامه'}
                          </Button>
                        )}
                        {isLastInteraction && nextStageId === undefined && (
                          <p className="font-ui text-sm text-kaj/70">
                            فعلاً پرونده تا همین‌جا نوشته شده. بقیه‌ی برگه‌ها در فاز ۴ اضافه
                            می‌شوند.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </SkinFrame>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="quiet"
        onClick={() => {
          clearProgress();
          router.push(`/story/${FIRST_STAGE_ID}`);
          router.refresh();
        }}
      >
        شروع دوباره
      </Button>
    </main>
  );
}
