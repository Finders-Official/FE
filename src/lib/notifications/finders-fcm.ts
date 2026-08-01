import { registerPlugin } from "@capacitor/core";

export interface FindersFcmPlugin {
  // FCM 등록 토큰 조회 (iOS 전용 — Android는 push-notifications의 registration 이벤트가 이미 FCM 토큰을 준다)
  getToken(): Promise<{ token: string }>;
}

export const FindersFcm = registerPlugin<FindersFcmPlugin>("FindersFcm");
