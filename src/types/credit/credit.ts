import type { ApiResponse } from "@/types/common/apiResponse";

export interface CreditProduct {
  productId: string;
  name: string;
  creditAmount: number;
  price: number;
  // Google Play 인앱결제 상품 ID. Android 결제 시 사용하며 BE가 /credits/purchase-page 응답에 포함한다.
  externalProductId?: string;
}

export interface CreditPurchasePage {
  currentCredit: number;
  products: CreditProduct[];
}

export interface CreditHistoryItem {
  title: string;
  date: string;
  amount: number;
  balanceAfter: number;
}

export type CreditPurchasePageResponse = ApiResponse<CreditPurchasePage>;
export type CreditHistoriesResponse = ApiResponse<CreditHistoryItem[]>;
