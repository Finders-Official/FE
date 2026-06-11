import { registerPlugin } from "@capacitor/core";

// 인앱결제 상품 정보 (Android: Google Play / iOS: App Store)
export interface BillingProduct {
  productId: string;
  title: string;
  description: string;
  formattedPrice: string;
  priceAmountMicros: string;
  currency: string;
}

// 결제/소유 구매 결과 — purchaseToken은 Android: Play purchaseToken / iOS: transactionId
export interface BillingPurchase {
  productId: string;
  purchaseToken: string;
  orderId: string | null;
}

export interface FindersBillingPlugin {
  // 상품 ID 목록으로 Play 콘솔 상품 정보 조회
  queryProducts(options: {
    productIds: string[];
  }): Promise<{ products: BillingProduct[] }>;
  // 네이티브 결제 시트
  purchase(options: { productId: string }): Promise<BillingPurchase>;
  // 아직 consume되지 않은 보유 구매 목록
  getOwnedPurchases(): Promise<{ purchases: BillingPurchase[] }>;
  // iOS 전용: 서버 검증 완료 후 StoreKit 트랜잭션 종료 (Android는 서버가 consume하므로 호출하지 않음)
  finishPurchase(options: { purchaseToken: string }): Promise<void>;
}

export const FindersBilling =
  registerPlugin<FindersBillingPlugin>("FindersBilling");
