import type { ApiResponse } from "@/types/common/apiResponse";

// POST /payments/google/verify 요청 바디
export interface GooglePaymentVerifyRequest {
  productId: string;
  purchaseToken: string;
  orderId?: string;
}

// 서버가 검증·충전 후 data 없이 성공만 반환 (ApiResponse<Void>)
export type GooglePaymentVerifyResponse = ApiResponse<null>;
