import { Capacitor } from "@capacitor/core";
import type { PaymentProvider } from "@/types/payment/provider";

// 네이티브 Android 앱에서 실행 중인지 (Google Play 인앱결제 분기용)
export const isAndroidApp = (): boolean =>
  Capacitor.getPlatform() === "android";

// 네이티브 iOS 앱에서 실행 중인지 (Apple 인앱결제 분기용)
export const isIosApp = (): boolean => Capacitor.getPlatform() === "ios";

// 현재 플랫폼의 결제 제공자 (크레딧 상품 조회 시 provider 파라미터)
export const getPaymentProvider = (): PaymentProvider => {
  switch (Capacitor.getPlatform()) {
    case "android":
      return "GOOGLE_PLAY";
    case "ios":
      return "APPLE_IAP";
    default:
      return "PORTONE";
  }
};
