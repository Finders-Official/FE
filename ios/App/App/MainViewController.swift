import UIKit
import Capacitor

// Android MainActivity.registerPlugin의 iOS 대응 — 앱 로컬 Capacitor 플러그인 수동 등록
class MainViewController: CAPBridgeViewController {

    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(FindersBillingPlugin())
        bridge?.registerPluginInstance(FindersFcmPlugin())

        // 엣지 스와이프 뒤로가기 — SPA(pushState) 히스토리에도 동작
        webView?.allowsBackForwardNavigationGestures = true
    }
}
