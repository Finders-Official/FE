import { Capacitor } from "@capacitor/core";

// 네이티브 Android 앱에서 실행 중인지 (Google Play 인앱결제 분기용)
export const isAndroidApp = (): boolean =>
  Capacitor.getPlatform() === "android";
