import { axiosInstance } from "@/lib/axiosInstance";
import type {
  GooglePaymentVerifyRequest,
  GooglePaymentVerifyResponse,
} from "@/types/payment";

// Google Play 인앱결제 검증 + 크레딧 충전
// 서버가 purchaseToken을 Google Play Developer API로 검증하고, consume·충전까지 멱등 처리한다.
export async function verifyGooglePayment(
  request: GooglePaymentVerifyRequest,
): Promise<GooglePaymentVerifyResponse> {
  const res = await axiosInstance.post<GooglePaymentVerifyResponse>(
    "/payments/google/verify",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
