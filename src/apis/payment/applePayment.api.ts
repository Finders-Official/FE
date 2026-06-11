import { axiosInstance } from "@/lib/axiosInstance";
import type {
  ApplePaymentVerifyRequest,
  ApplePaymentVerifyResponse,
} from "@/types/payment";

// Apple App Store 인앱결제 검증 + 크레딧 충전
export async function verifyApplePayment(
  request: ApplePaymentVerifyRequest,
): Promise<ApplePaymentVerifyResponse> {
  const res = await axiosInstance.post<ApplePaymentVerifyResponse>(
    "/payments/apple/verify",
    request,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
