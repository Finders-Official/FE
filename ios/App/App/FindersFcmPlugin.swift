import Foundation
import Capacitor
import FirebaseMessaging

/**
 * FCM 등록 토큰 브릿지 (iOS 전용)
 * @capacitor/push-notifications의 registration 이벤트는 iOS에서 APNs 디바이스 토큰을 주는데,
 * 서버는 FCM으로 발송하므로 그 토큰을 쓸 수 없다. 이 플러그인으로 FCM 토큰을 따로 받아온다.
 * JS 계약: src/lib/notifications/finders-fcm.ts
 */
@objc(FindersFcmPlugin)
public class FindersFcmPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FindersFcmPlugin"
    public let jsName = "FindersFcm"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getToken", returnType: CAPPluginReturnPromise)
    ]

    // Firebase가 토큰을 회전시킬 때(앱 재설치·장기 미사용 등) 알림을 받기 위해 델리게이트를 잡는다.
    // Android는 push-notifications의 registration 이벤트가 다시 발생해 자동 갱신되지만,
    // iOS는 이 경로가 없어 서버에 죽은 토큰이 남는다.
    public override func load() {
        Messaging.messaging().delegate = self
    }

    // AppDelegate가 Messaging.apnsToken을 세팅한 뒤(= registration 이벤트 이후) 호출해야 한다
    @objc func getToken(_ call: CAPPluginCall) {
        Messaging.messaging().token { token, error in
            if let error = error {
                call.reject(error.localizedDescription)
                return
            }

            guard let token = token else {
                call.reject("FCM token is nil")
                return
            }

            call.resolve(["token": token])
        }
    }
}

extension FindersFcmPlugin: MessagingDelegate {
    public func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let token = fcmToken else { return }
        notifyListeners("tokenRefresh", data: ["token": token])
    }
}
