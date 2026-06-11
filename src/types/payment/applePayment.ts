import type { ApiResponse } from "@/types/common/apiResponse";

// POST /payments/apple/verify 요청 바디
export interface ApplePaymentVerifyRequest {
  productId: string;
  transactionId: string;
}

// 서버가 검증·충전 후 data 없이 성공만 반환 (ApiResponse<Void>)
export type ApplePaymentVerifyResponse = ApiResponse<null>;
