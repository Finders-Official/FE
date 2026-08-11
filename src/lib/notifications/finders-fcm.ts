import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";

export interface FindersFcmPlugin {
  // FCM 등록 토큰 조회 (iOS 전용 — Android는 push-notifications의 registration 이벤트가 이미 FCM 토큰을 준다)
  getToken(): Promise<{ token: string }>;

  // Firebase가 토큰을 회전시켰을 때 발생 (iOS 전용)
  addListener(
    eventName: "tokenRefresh",
    listenerFunc: (data: { token: string }) => void,
  ): Promise<PluginListenerHandle>;
}

export const FindersFcm = registerPlugin<FindersFcmPlugin>("FindersFcm");
