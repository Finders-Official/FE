import type { CreditProduct } from "@/types/credit";

export type PaymentMethod = "CARD" | "EASY_PAY" | "PHONE";

// PAYCO는 서버 PgProvider 미지원으로 제외
export type EasyPayProvider = "KAKAO_PAY" | "TOSS" | "NAVER_PAY";

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
