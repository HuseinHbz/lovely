'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FIRST_STAGE_ID, unlockedNodesFor } from './engine';

/**
 * وضعیت پیشرفت کاربر.
 *
 * قاعده ۲: این داده **فقط** در `localStorage` مرورگر خود کاربر می‌ماند.
 * هیچ endpoint ای آن را نمی‌گیرد، هیچ‌جا لاگ نمی‌شود و هیچ‌جا فرستاده نمی‌شود.
 * تنها راه خارج شدنش از دستگاه کاربر این است که خودش فایل را بردارد.
 */

export const STORAGE_KEY = 'wolf-hedgehog-v1';

type StoryState = {
  currentStage: string;
  /** به‌ازای هر مرحله، انتخاب هر تعامل به ترتیب. */
  choices: Record<string, string[]>;
  unlockedNodes: string[];
  /** افکت صوتی — پیش‌فرض خاموش (بخش فاز ۶). */
  soundOn: boolean;
};

type StoryActions = {
  goTo: (stageId: string) => void;
  /** انتخاب یک تعامل را ثبت می‌کند. `interactionIndex` جای آن در آرایه‌ی تعامل‌هاست. */
  recordChoice: (stageId: string, interactionIndex: number, selected: readonly string[]) => void;
  choiceFor: (stageId: string, interactionIndex: number) => string[] | undefined;
  toggleSound: () => void;
  reset: () => void;
};

const initialState: StoryState = {
  currentStage: FIRST_STAGE_ID,
  choices: {},
  unlockedNodes: [],
  soundOn: false,
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
          return { choices, unlockedNodes: [...unlockedNodesFor(choices)] };
        }),

      choiceFor: (stageId, interactionIndex) => {
        const raw = get().choices[stageId]?.[interactionIndex];
        return raw === undefined || raw === '' ? undefined : raw.split('،');
      },

      toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),

      reset: () => set({ ...initialState }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        currentStage: state.currentStage,
        choices: state.choices,
        unlockedNodes: state.unlockedNodes,
        soundOn: state.soundOn,
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
