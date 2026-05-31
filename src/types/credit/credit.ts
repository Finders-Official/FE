import type { ApiResponse } from "@/types/common/apiResponse";

export interface CreditProduct {
  productId: string;
  name: string;
  creditAmount: number;
  price: number;
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
