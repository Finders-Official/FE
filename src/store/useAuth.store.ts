import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  memberId: string;
  nickname: string;
};

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;
  clearUser: () => void;

  setNickname: (nickname: string) => void;
  setMemberId: (memberId: string) => void;
};

const AUTH_STORAGE_KEY = "finders-auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      // 완전 로그아웃: zustand state + persist 모두 제거
      clearUser: () => {
        set({ user: null });
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (e) {
          console.error(
            "로그아웃 처리 중 로컬 스토리지 삭제에 실패했습니다.",
            e,
          );
        }
      },

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
      version: 1,
      // memberId가 number(구 형식)로 저장된 세션은 폐기 (TSID string 전환)
      migrate: (persistedState) => {
        const state = persistedState as { user: User | null } | undefined;
        if (typeof state?.user?.memberId === "number") {
          return { user: null };
        }
        return state;
      },
    },
  ),
);
