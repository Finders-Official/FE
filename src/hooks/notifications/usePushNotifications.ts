import { useEffect, useRef } from "react";
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

// Android 8+는 채널의 importance가 메시지 priority를 이긴다 — 앱이 채널을 만들지 않으면
// FCM 기본 채널(importance DEFAULT)로 떨어져 서버가 high priority를 보내도 헤즈업/소리가 없다.
// id는 AndroidManifest의 default_notification_channel_id와 반드시 같아야 한다
const ANDROID_CHANNEL_ID = "finders_default";

// 서버는 경로 문자열 대신 action + resourceId를 보낸다 (BE #714)
// null이면 이동하지 않는다 — action이 아예 없는 건 계약 이전 서버가 보낸 메시지다
function toRoute(action: unknown, resourceId: unknown): string | null {
  if (typeof action !== "string") return null;

  const id =
    typeof resourceId === "string" ? encodeURIComponent(resourceId) : "";

  switch (action) {
    case "PHOTO_FEED":
      return "/photoFeed";
    case "POST_DETAIL":
      return id ? `/photoFeed/post/${id}` : "/photoFeed";
    case "PHOTO_LAB_LIST":
      return "/photolab";
    case "PHOTO_LAB_DETAIL":
      return id ? `/photolab/${id}` : "/photolab";
    case "PHOTO_MANAGE":
      return "/photoManage/main";
    case "DEVELOPMENT_HISTORY":
      return "/development-history";
    default:
      // HOME + 앱보다 나중에 추가된 action
      return "/mainpage";
  }
}

// FCM 기기 토큰 획득/등록 및 푸시 수신 리스너 등록
// enabled(로그인 상태)일 때만 활성화되며, 네이티브 앱이 아니면 아무 것도 하지 않는다
export function usePushNotifications(
  enabled: boolean,
  navigate: NavigateFunction,
) {
  const setPushToken = usePushTokenStore((s) => s.setToken);

  // iOS는 초기 토큰 발급 때 registration과 tokenRefresh가 같은 값으로 둘 다 발생한다.
  // 등록 성공(store)을 기준으로 비교하면 두 요청이 이미 나간 뒤라, 보낸 시점으로 막는다
  const sentTokenRef = useRef<string | null>(null);

  const { mutate: registerDeviceToken } = useRegisterDeviceToken({
    // 서버 등록이 성공했을 때만 로컬 참조를 채운다 (해제 쪽과 같은 규칙)
    onSuccess: (_data, variables) => {
      setPushToken(variables.token);
    },
    // mutate는 rejection을 삼키므로 여기서 잡지 않으면 실패가 흔적 없이 사라진다
    onError: (error) => {
      // 실패한 토큰을 보낸 것으로 남겨두면 남은 경로의 재시도까지 막힌다
      sentTokenRef.current = null;
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

    const sendDeviceToken = (token: string) => {
      if (sentTokenRef.current === token) return;
      sentTokenRef.current = token;
      registerDeviceToken({ token, platform });
    };

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

          sendDeviceToken(fcmToken);
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
            sendDeviceToken(token);
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
        // 백엔드가 data에 실어 보낸 action으로 목적지를 결정한다
        // (예: { "action": "POST_DETAIL", "resourceId": "..." }) — 앱이 종료된
        // 상태에서 탭해도 콜드 스타트 후 리스너가 등록되는 시점에 버퍼링된 이벤트가 발생함
        const data = action.notification.data;
        const route = toRoute(data?.action, data?.resourceId);
        if (route) navigate(route);
      },
    );

    if (platform === "ANDROID") {
      PushNotifications.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: "알림",
        importance: 4, // IMPORTANCE_HIGH — 헤즈업 배너 + 소리
      }).catch((error) => {
        console.error("알림 채널 생성 실패", error);
      });
    }

    PushNotifications.requestPermissions().then((result) => {
      if (cancelled) return;
      if (result.receive === "granted") {
        PushNotifications.register();
      }
    });

    return () => {
      cancelled = true;
      // 계정이 바뀌면 같은 기기 토큰이라도 다시 등록해야 한다
      sentTokenRef.current = null;
      registrationHandle.then((handle) => handle.remove());
      registrationErrorHandle.then((handle) => handle.remove());
      pushReceivedHandle.then((handle) => handle.remove());
      pushActionHandle.then((handle) => handle.remove());
      tokenRefreshHandle?.then((handle) => handle.remove());
    };
  }, [enabled, navigate, registerDeviceToken]);
}
