import { create } from "zustand";

type SelectedPhotosState = {
  files: File[];
  setFiles: (files: File[]) => void;
  clear: () => void;
};

export const useSelectedPhotos = create<SelectedPhotosState>((set, get) => ({
  files: [],

  setFiles: (files) => {
    if (files.length === 0) return;
    set({ files });
  },

  clear: () => {
    const prevCount = get().files.length;
    if (prevCount === 0) return;
    set({ files: [] });
  },
}));
