import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  memberId: number;
  nickname: string;
};

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;

  setNickname: (nickname: string) => void;
  setMemberId: (memberId: number) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),

      setNickname: (nickname) => {
        const cur = get().user;
        if (!cur) return;
        set({ user: { ...cur, nickname } });
      },

      setMemberId: (memberId) => {
        const cur = get().user;
        if (!cur) return;
        set({ user: { ...cur, memberId } });
      },
    }),
    {
      name: "finders-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
