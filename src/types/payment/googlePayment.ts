import type { ApiResponse } from "@/types/common/apiResponse";

// POST /payments/google/verify 요청 바디
// productId는 Google Play 콘솔 상품 ID(externalProductId)이며,
// 내부 크레딧 상품 productId(TSID)와는 다르다.
export interface GooglePaymentVerifyRequest {
  productId: string;
  purchaseToken: string;
  orderId?: string;
}

// 서버가 검증·충전 후 data 없이 성공만 반환 (ApiResponse<Void>)
export type GooglePaymentVerifyResponse = ApiResponse<null>;
