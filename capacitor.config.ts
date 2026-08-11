import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.finders.app",
  appName: "Finders",
  webDir: "dist",
  appendUserAgent: "FindersApp",
  ios: {
    packageManager: "cocoapods",
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
    // 미설정 시 iOS 네이티브가 빈 배열로 해석해 포그라운드 푸시가 아무것도 표시되지 않는다
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
