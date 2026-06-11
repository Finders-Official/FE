import UIKit
import Capacitor

// Android MainActivity.registerPlugin의 iOS 대응 — 앱 로컬 Capacitor 플러그인 수동 등록
class MainViewController: CAPBridgeViewController {

    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(FindersBillingPlugin())
    }
}
