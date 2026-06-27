import Foundation
import Capacitor
import StoreKit

/**
 * App Store 인앱결제 브리지 (StoreKit 2, iOS 15+)
 * JS 계약은 Android FindersBillingPlugin과 동일: src/lib/billing/finders-billing.ts
 * 트랜잭션 종료는 서버 검증 후 JS가 finishPurchase로 호출한다 — purchase 내부에서 finish 금지
 */
@objc(FindersBillingPlugin)
public class FindersBillingPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FindersBillingPlugin"
    public let jsName = "FindersBilling"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "queryProducts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getOwnedPurchases", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "finishPurchase", returnType: CAPPluginReturnPromise)
    ]

    private var isPurchasing = false
    private var updatesTask: Task<Void, Never>?

    override public func load() {
        // 앱 외부에서 갱신되는 트랜잭션(Ask to Buy 승인 등) 수신 유지
        // 종료는 reconcile 담당
        updatesTask = Task {
            for await _ in Transaction.updates {}
        }
    }

    deinit {
        updatesTask?.cancel()
    }

    @objc func queryProducts(_ call: CAPPluginCall) {
        guard let productIds = call.getArray("productIds", String.self), !productIds.isEmpty else {
            call.reject("productIds is required")
            return
        }

        Task {
            do {
                let products = try await Product.products(for: productIds)
                call.resolve(["products": products.map { self.productDict($0) }])
            } catch {
                call.reject("QUERY_FAILED: \(error.localizedDescription)")
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId"), !productId.isEmpty else {
            call.reject("productId is required")
            return
        }
        guard AppStore.canMakePayments else {
            call.reject("BILLING_UNAVAILABLE: purchases are not allowed on this device")
            return
        }
        guard !isPurchasing else {
            call.reject("PURCHASE_IN_PROGRESS")
            return
        }
        isPurchasing = true

        Task {
            defer { self.isPurchasing = false }
            do {
                // 검증/종료가 누락된 동일 상품 트랜잭션은 재결제 대신 그대로 반환해 재검증
                if let unfinished = await self.firstUnfinishedTransaction(productId: productId) {
                    call.resolve(self.purchaseDict(unfinished))
                    return
                }

                guard let product = try await Product.products(for: [productId]).first else {
                    call.reject("PRODUCT_NOT_FOUND: \(productId)")
                    return
                }

                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        call.resolve(self.purchaseDict(transaction))
                    case .unverified(_, let error):
                        call.reject("PURCHASE_FAILED: \(error.localizedDescription)")
                    }
                case .userCancelled:
                    call.reject("USER_CANCELED")
                case .pending:
                    call.reject("PENDING")
                @unknown default:
                    call.reject("PURCHASE_FAILED: unknown purchase result")
                }
            } catch {
                call.reject("PURCHASE_FAILED: \(error.localizedDescription)")
            }
        }
    }

    @objc func getOwnedPurchases(_ call: CAPPluginCall) {
        Task {
            var purchases: [[String: Any]] = []
            for await verification in Transaction.unfinished {
                // 로컬 검증 실패(.unverified)도 서버가 최종 검증
                let transaction = self.unwrap(verification)
                if transaction.revocationDate == nil {
                    purchases.append(self.purchaseDict(transaction))
                }
            }
            call.resolve(["purchases": purchases])
        }
    }

    @objc func finishPurchase(_ call: CAPPluginCall) {
        guard let token = call.getString("purchaseToken"), let transactionId = UInt64(token) else {
            call.reject("purchaseToken is required")
            return
        }

        Task {
            for await verification in Transaction.unfinished {
                let transaction = self.unwrap(verification)
                if transaction.id == transactionId {
                    await transaction.finish()
                    call.resolve()
                    return
                }
            }
            call.resolve()
        }
    }

    private func unwrap(_ verification: VerificationResult<Transaction>) -> Transaction {
        switch verification {
        case .verified(let transaction):
            return transaction
        case .unverified(let transaction, _):
            return transaction
        }
    }

    private func firstUnfinishedTransaction(productId: String) async -> Transaction? {
        for await verification in Transaction.unfinished {
            // 검증 여부와 무관하게 미완료 트랜잭션을 찾아 새 결제로 꼬이지 않도록
            let transaction = self.unwrap(verification)
            if transaction.productID == productId,
               transaction.revocationDate == nil {
                return transaction
            }
        }
        return nil
    }

    private func purchaseDict(_ transaction: Transaction) -> [String: Any] {
        return [
            "productId": transaction.productID,
            "purchaseToken": String(transaction.id),
            "orderId": String(transaction.originalID)
        ]
    }

    private func productDict(_ product: Product) -> [String: Any] {
        let currency: String
        if #available(iOS 16.0, *) {
            currency = product.priceFormatStyle.currencyCode
        } else {
            currency = Locale.current.currencyCode ?? ""
        }
        let micros = NSDecimalNumber(decimal: product.price * 1_000_000).int64Value
        return [
            "productId": product.id,
            "title": product.displayName,
            "description": product.description,
            "formattedPrice": product.displayPrice,
            "priceAmountMicros": String(micros),
            "currency": currency
        ]
    }
}
