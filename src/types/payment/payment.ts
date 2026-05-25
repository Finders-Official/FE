import type { ApiResponse } from "@/types/common/apiResponse";
import type { CreditProduct } from "@/types/credit";

export type PaymentMethod = "CARD" | "EASY_PAY" | "PHONE";

export type EasyPayProvider = "KAKAO_PAY" | "TOSS" | "PAYCO" | "NAVER_PAY";

export interface PaymentResultSuccess {
  status: "success";
  product: CreditProduct;
  methodLabel: string;
}

export interface PaymentResultFail {
  status: "fail";
  errorCode?: string;
}

export type PaymentResult = PaymentResultSuccess | PaymentResultFail;

export interface CardOption {
  id: string;
  name: string;
}

export interface EasyPayOption {
  id: EasyPayProvider;
  name: string;
}

export interface OrdererInfo {
  name: string;
  phoneNumber: string;
}

export interface PaymentRequest {
  productId: string;
  method: PaymentMethod;
  cardId?: string;
  easyPayProvider?: EasyPayProvider;
  agreedToTerms: boolean;
}

export interface PaymentInitResponse {
  paymentId: string;
  pgRedirectUrl?: string;
}

export type PaymentInitApiResponse = ApiResponse<PaymentInitResponse>;
