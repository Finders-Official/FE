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

    alert(`사진 ${files.length}장 선택됨`);
    set({ files });
  },

  clear: () => {
    const prevCount = get().files.length;
    if (prevCount === 0) return;

    alert(`사진 ${prevCount}장 삭제됨`);
    set({ files: [] });
  },
}));
