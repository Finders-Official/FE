import { useEffect } from "react";
import type { NavigateFunction } from "react-router";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useRegisterDeviceToken } from "./useRegisterDeviceToken";
import { FindersFcm } from "@/lib/notifications/finders-fcm";
import { usePushTokenStore } from "@/store/usePushToken.store";
import type { DevicePlatform } from "@/types/notification/deviceToken";

function toDevicePlatform(platform: string): DevicePlatform | null {
  if (platform === "android") return "ANDROID";
  if (platform === "ios") return "IOS";
  return null;
}

// FCM 기기 토큰 획득/등록 및 푸시 수신 리스너 등록
// enabled(로그인 상태)일 때만 활성화되며, 네이티브 앱이 아니면 아무 것도 하지 않는다
export function usePushNotifications(
  enabled: boolean,
  navigate: NavigateFunction,
) {
  const setPushToken = usePushTokenStore((s) => s.setToken);

  const { mutate: registerDeviceToken } = useRegisterDeviceToken({
    // 서버 등록이 성공했을 때만 로컬 참조를 채운다 (해제 쪽과 같은 규칙)
    onSuccess: (_data, variables) => {
      setPushToken(variables.token);
    },
    // mutate는 rejection을 삼키므로 여기서 잡지 않으면 실패가 흔적 없이 사라진다
    onError: (error) => {
      console.error("FCM 기기 토큰 서버 등록 실패", error);
    },
  });

  useEffect(() => {
    if (!enabled || !Capacitor.isNativePlatform()) return;

    const platform = toDevicePlatform(Capacitor.getPlatform());
    if (!platform) return;

    // requestPermissions가 비동기라, 그 사이 effect가 재실행되면
    // 리스너가 제거된 뒤에 register()가 호출되어 registration 이벤트가 유실된다
    // (Capacitor는 이 이벤트를 버퍼링하지 않음)
    let cancelled = false;

    const registrationHandle = PushNotifications.addListener(
      "registration",
      async (token) => {
        // iOS의 registration 값은 APNs 디바이스 토큰이라 FCM 발송에 쓸 수 없다.
        // 네이티브 브릿지로 FCM 등록 토큰을 따로 받아온다 (Android는 이 값이 이미 FCM 토큰)
        try {
          const fcmToken =
            platform === "IOS"
              ? (await FindersFcm.getToken()).token
              : token.value;

          registerDeviceToken({ token: fcmToken, platform });
        } catch (error) {
          console.error("FCM 기기 토큰 조회 실패", error);
        }
      },
    );

    const registrationErrorHandle = PushNotifications.addListener(
      "registrationError",
      (error) => {
        console.error("FCM 기기 토큰 등록 실패", error);
      },
    );

    // Android는 토큰이 회전하면 registration 이벤트가 다시 발생하지만 iOS는 그 경로가 없어
    // 네이티브 브릿지가 대신 알려준다. 갱신하지 않으면 서버에 죽은 토큰이 남는다
    const tokenRefreshHandle =
      platform === "IOS"
        ? FindersFcm.addListener("tokenRefresh", ({ token }) => {
            registerDeviceToken({ token, platform });
          })
        : null;

    const pushReceivedHandle = PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.info("포그라운드 푸시 수신", notification);
      },
    );

    const pushActionHandle = PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        // 백엔드가 AdminPushRequest.data에 실어 보낸 딥링크 경로로 이동
        // (예: { "route": "/home" }) — 앱이 종료된 상태에서 탭해도
        // 콜드 스타트 후 리스너가 등록되는 시점에 버퍼링된 이벤트가 발생함
        const route = action.notification.data?.route;
        if (typeof route === "string" && route.length > 0) {
          navigate(route);
        }
      },
    );

    PushNotifications.requestPermissions().then((result) => {
      if (cancelled) return;
      if (result.receive === "granted") {
        PushNotifications.register();
      }
    });

    return () => {
      cancelled = true;
      registrationHandle.then((handle) => handle.remove());
      registrationErrorHandle.then((handle) => handle.remove());
      pushReceivedHandle.then((handle) => handle.remove());
      pushActionHandle.then((handle) => handle.remove());
      tokenRefreshHandle?.then((handle) => handle.remove());
    };
  }, [enabled, navigate, registerDeviceToken]);
}
