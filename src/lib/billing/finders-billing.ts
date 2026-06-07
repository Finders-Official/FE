import { registerPlugin } from "@capacitor/core";

// Google Play 인앱결제 상품 정보
export interface BillingProduct {
  productId: string;
  title: string;
  description: string;
  formattedPrice: string;
  priceAmountMicros: string;
  currency: string;
}

// 결제/소유 구매 결과
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
}

export const FindersBilling =
  registerPlugin<FindersBillingPlugin>("FindersBilling");
