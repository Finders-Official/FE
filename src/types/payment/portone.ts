import type { ApiResponse } from "@/types/common/apiResponse";

// 포트원 V2 결제 상태 (서버 PaymentStatus 미러)
export type PortonePaymentStatus =
  | "READY"
  | "PENDING"
  | "VIRTUAL_ACCOUNT_ISSUED"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

// 포트원 V2 결제 수단 (서버 PaymentMethod 미러)
export type PortonePaymentMethod =
  | "CARD"
  | "TRANSFER"
  | "VIRTUAL_ACCOUNT"
  | "EASY_PAY"
  | "MOBILE"
  | "IN_APP";

// POST /payments/pre-register 요청 바디
export interface PortonePreRegisterRequest {
  creditProductId: string;
}

// 사전등록 응답 — paymentId는 서버가 생성(UUID), amount는 서버가 확정한 결제 금액
export interface PortonePreRegistered {
  id: string;
  paymentId: string;
  orderName: string;
  amount: number;
  status: PortonePaymentStatus;
}

// POST /payments/complete 요청 바디
export interface PortoneCompleteRequest {
  paymentId: string;
}

// 완료 응답 — FAILED일 수 있으므로 status로 분기 핑료
export interface PortonePaymentDetail {
  id: string;
  paymentId: string;
  orderName: string;
  amount: number;
  creditAmount: number | null;
  status: PortonePaymentStatus;
  method: PortonePaymentMethod | null;
  failCode: string | null;
  failMessage: string | null;
}

export type PortonePreRegisterResponse = ApiResponse<PortonePreRegistered>;
export type PortoneCompleteResponse = ApiResponse<PortonePaymentDetail>;
