import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { verifyGooglePayment } from "@/apis/payment";
import { invalidateCreditQueries } from "@/hooks/credit";
import type { GooglePaymentVerifyRequest } from "@/types/payment";

// Google Play 결제 검증 성공 시, 캐시 무효화
export function useVerifyGooglePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GooglePaymentVerifyRequest) =>
      verifyGooglePayment(request),
    // 서버 검증은 purchaseToken 기준, 네트워크/5xx 등 일시 오류만 재시도
    retry: (failureCount, error) =>
      failureCount < 2 &&
      isAxiosError(error) &&
      (!error.response || error.response.status >= 500),
    onSuccess: () => {
      invalidateCreditQueries(queryClient);
    },
  });
}
