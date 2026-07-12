import { create } from "zustand";

type PushTokenState = {
  token: string | null;
  setToken: (token: string | null) => void;
};

// 로그아웃/탈퇴 시 기기 토큰 해제(unregister) API 호출에 사용하기 위해
// 마지막으로 등록된 FCM 토큰 값을 메모리에 보관한다 (영속화 불필요)
export const usePushTokenStore = create<PushTokenState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
