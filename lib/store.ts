'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FIRST_STAGE_ID, unlockedNodesFor, getStage } from './engine';

/**
 * وضعیت پیشرفت کاربر.
 *
 * قاعده ۲: این داده **فقط** در `localStorage` مرورگر خود کاربر می‌ماند.
 * هیچ endpoint ای آن را نمی‌گیرد، هیچ‌جا لاگ نمی‌شود و هیچ‌جا فرستاده نمی‌شود.
 * تنها راه خارج شدنش از دستگاه کاربر این است که خودش فایل را بردارد.
 */

export const STORAGE_KEY = 'wolf-hedgehog-v2';

type StoryState = {
  currentStage: string;
  /** به‌ازای هر برگه، انتخاب هر تعامل به ترتیب. */
  choices: Record<string, string[]>;
  unlockedNodes: string[];
  /** نشان‌های باز‌شده — `content/achievements.ts`. */
  achievements: string[];
  /**
   * برگه‌هایی که اثرشان (نشان و شاخص) یک بار اعمال شده.
   * بدون این، بازدید دوباره‌ی یک برگه شاخص‌ها را دوباره جمع می‌زد.
   */
  applied: string[];
  /**
   * شاخص‌های طنز پرونده. `MERGED-SPEC` بخش ۴:
   * هیچ‌کدام هیچ صحنه، پایان یا محتوایی را قفل نمی‌کنند و هیچ عددی نمی‌گوید
   * «رد شدی». فقط برگه‌ی خلاصه‌ی پایانی از رویشان ساخته می‌شود.
   */
  meters: Record<string, number>;
  /** افکت صوتی — پیش‌فرض خاموش (بخش فاز ۶). */
  soundOn: boolean;
  /**
   * هر گزینه‌ای که **تا به حال** انتخاب شده، به‌ازای هر برگه — فاز ۹.
   *
   * جدا از `choices` است و باید هم باشد: `choices` فقط **آخرین** انتخاب هر
   * تعامل را نگه می‌دارد و بازدید دوباره رویش می‌نویسد. برای اینکه «پخش
   * دوباره» بتواند بگوید کدام واکنش‌ها هنوز دیده نشده‌اند، به یک مجموعه‌ی
   * انباشتی نیاز است که هیچ‌وقت پاک نمی‌شود.
   */
  seenOptions: Record<string, string[]>;
  /** تخم‌مرغ‌های عید پاک پیداشده — فاز ۹، برای موزه. */
  foundEggs: string[];
};

type StoryActions = {
  goTo: (stageId: string) => void;
  /** انتخاب یک تعامل را ثبت می‌کند. `interactionIndex` جای آن در آرایه‌ی تعامل‌هاست. */
  recordChoice: (stageId: string, interactionIndex: number, selected: readonly string[]) => void;
  choiceFor: (stageId: string, interactionIndex: number) => string[] | undefined;
  /** برگه‌ی صرفاً روایی را تمام‌شده علامت می‌زند (تعاملی ندارد که ثبت شود). */
  markSeen: (stageId: string) => void;
  /** نشان و شاخص‌های یک برگه را اعمال می‌کند. هیچ‌کدام مسیر را عوض نمی‌کنند. */
  applyStage: (stageId: string) => void;
  toggleSound: () => void;
  /** یک تخم‌مرغ عید پاک را پیداشده علامت می‌زند. idempotent. */
  markEgg: (eggId: string) => void;
  reset: () => void;
};

const initialState: StoryState = {
  currentStage: FIRST_STAGE_ID,
  choices: {},
  unlockedNodes: [],
  achievements: [],
  applied: [],
  meters: {},
  soundOn: false,
  seenOptions: {},
  foundEggs: [],
};

export const useStoryStore = create<StoryState & StoryActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      goTo: (stageId) => set({ currentStage: stageId }),

      recordChoice: (stageId, interactionIndex, selected) =>
        set((state) => {
          const forStage = [...(state.choices[stageId] ?? [])];
          // انتخاب چندتایی با «،» در یک خانه ذخیره می‌شود تا شکل state ساده بماند.
          forStage[interactionIndex] = [...selected].join('،');
          const choices = { ...state.choices, [stageId]: forStage };

          // انباشت جداگانه: این یکی هیچ‌وقت بازنویسی نمی‌شود، چون «پخش دوباره»
          // باید بداند کدام واکنش‌ها **تا به حال** دیده شده‌اند، نه اینکه
          // آخرین بار چه انتخاب شد.
          const seenForStage = new Set(state.seenOptions[stageId] ?? []);
          for (const id of selected) seenForStage.add(id);

          return {
            choices,
            unlockedNodes: [...unlockedNodesFor(choices)],
            seenOptions: { ...state.seenOptions, [stageId]: [...seenForStage] },
          };
        }),

      choiceFor: (stageId, interactionIndex) => {
        const raw = get().choices[stageId]?.[interactionIndex];
        return raw === undefined || raw === '' ? undefined : raw.split('،');
      },

      markSeen: (stageId) =>
        set((state) => {
          if ((state.choices[stageId] ?? []).length > 0) return state;
          const choices = { ...state.choices, [stageId]: ['—'] };
          return { choices, unlockedNodes: [...unlockedNodesFor(choices)] };
        }),

      applyStage: (stageId) =>
        set((state) => {
          const stage = getStage(stageId);
          // اعمال دقیقاً یک بار: وگرنه بازدید دوباره شاخص‌ها را دوبار جمع می‌زند.
          if (stage === undefined || state.applied.includes(stageId)) return state;

          const achievements = [...state.achievements];
          if (stage.achievement !== undefined && !achievements.includes(stage.achievement)) {
            achievements.push(stage.achievement);
          }

          const meters = { ...state.meters };
          for (const [id, delta] of Object.entries(stage.meters ?? {})) {
            meters[id] = (meters[id] ?? 0) + delta;
          }

          return { achievements, meters, applied: [...state.applied, stageId] };
        }),

      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),

      markEgg: (eggId) =>
        set((state) =>
          state.foundEggs.includes(eggId) ? state : { foundEggs: [...state.foundEggs, eggId] },
        ),

      reset: () => set({ ...initialState }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 2,
      partialize: (state) => ({
        currentStage: state.currentStage,
        choices: state.choices,
        unlockedNodes: state.unlockedNodes,
        achievements: state.achievements,
        applied: state.applied,
        meters: state.meters,
        soundOn: state.soundOn,
        seenOptions: state.seenOptions,
        foundEggs: state.foundEggs,
      }),
    },
  ),
);

/**
 * پاک کردن کامل پیشرفت — پشت دکمه‌ی «شروع دوباره».
 * هم state و هم خود کلید `localStorage` را می‌برد.
 */
export function clearProgress(): void {
  useStoryStore.getState().reset();
  useStoryStore.persist.clearStorage();
}
