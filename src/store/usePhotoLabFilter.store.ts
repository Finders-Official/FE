import { create } from "zustand";
import type { FilterState } from "@/types/photoLab";

type PhotoLabFilterState = {
  filter: FilterState;
  selectedTagIds: number[];

  setFilter: (filter: FilterState) => void;
  setSelectedTagIds: (
    updater: number[] | ((prev: number[]) => number[]),
  ) => void;
  resetFilter: () => void;
};

export const usePhotoLabFilter = create<PhotoLabFilterState>()((set) => ({
  filter: {},
  selectedTagIds: [],

  setFilter: (filter) => set({ filter }),
  setSelectedTagIds: (updater) =>
    set((state) => ({
      selectedTagIds:
        typeof updater === "function" ? updater(state.selectedTagIds) : updater,
    })),
  resetFilter: () => set({ filter: {}, selectedTagIds: [] }),
}));
