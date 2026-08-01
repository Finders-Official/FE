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
