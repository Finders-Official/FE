import type { ApiResponse } from "@/types/common/apiResponse";
import type { PaymentProvider } from "@/types/payment/provider";

export interface CreditProduct {
  productId: string;
  name: string;
  creditAmount: number;
  price: number;
  // 인앱결제 상품 ID (Google Play / Apple). 해당 결제 시 사용.
  externalProductId?: string;
  provider?: PaymentProvider;
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
