import { axiosInstance } from "@/lib/axiosInstance";
import type {
  GooglePaymentVerifyRequest,
  GooglePaymentVerifyResponse,
} from "@/types/payment";

// Google Play 인앱결제 검증 + 크레딧 충전
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
