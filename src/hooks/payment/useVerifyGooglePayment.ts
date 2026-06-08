import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { verifyGooglePayment } from "@/apis/payment";
import {
  CREDIT_HISTORIES_QUERY_KEY,
  CREDIT_PURCHASE_PAGE_QUERY_KEY,
} from "@/hooks/credit";
import { ME_QUERY_KEY } from "@/hooks/member";
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
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["credit-balance"] });
      queryClient.invalidateQueries({
        queryKey: CREDIT_PURCHASE_PAGE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: CREDIT_HISTORIES_QUERY_KEY });
    },
  });
}
