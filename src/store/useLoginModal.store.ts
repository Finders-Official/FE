import { create } from "zustand";

interface LoginModalState {
  isOpen: boolean;
  openLoginModal: (onConfirm?: () => void) => void;
  closeLoginModal: () => void;
  onConfirm: (() => void) | null;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isOpen: false,
  onConfirm: null,
  openLoginModal: (onConfirm) =>
    set({
      isOpen: true,
      onConfirm: onConfirm || null,
    }),
  closeLoginModal: () => set({ isOpen: false, onConfirm: null }),
}));
