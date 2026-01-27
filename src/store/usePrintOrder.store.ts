// src/entities/printOrder/store/printCount.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PrintCountState = {
  totalPrintCount: number;

  setTotalPrintCount: (count: number) => void;
  inc: (delta?: number) => void;
  dec: (delta?: number) => void;
  reset: () => void;
};

const clampNonNegativeInt = (n: number) => {
  if (!Number.isFinite(n)) return 0;
  const v = Math.floor(n);
  return v < 0 ? 0 : v;
};

export const usePrintOrderStore = create<PrintCountState>()(
  persist(
    (set, get) => ({
      totalPrintCount: 0,

      setTotalPrintCount: (count) =>
        set({ totalPrintCount: clampNonNegativeInt(count) }),

      inc: (delta = 1) =>
        set({
          totalPrintCount: clampNonNegativeInt(get().totalPrintCount + delta),
        }),

      dec: (delta = 1) =>
        set({
          totalPrintCount: clampNonNegativeInt(get().totalPrintCount - delta),
        }),

      reset: () => set({ totalPrintCount: 0 }),
    }),
    {
      name: "print-count",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
