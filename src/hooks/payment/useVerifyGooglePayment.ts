import { useMutation, useQueryClient } from "@tanstack/react-query";
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
