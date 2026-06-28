import { create } from "zustand";
import type { FilterState } from "@/types/photoLab";

type PhotoLabFilterState = {
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  resetFilter: () => void;
};

export const usePhotoLabFilter = create<PhotoLabFilterState>()((set) => ({
  filter: {},
  setFilter: (filter) => set({ filter }),
  resetFilter: () => set({ filter: {} }),
}));
