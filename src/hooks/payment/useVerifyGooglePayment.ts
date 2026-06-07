import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyGooglePayment } from "@/apis/payment";
import {
  CREDIT_HISTORIES_QUERY_KEY,
  CREDIT_PURCHASE_PAGE_QUERY_KEY,
} from "@/hooks/credit";
import { ME_QUERY_KEY } from "@/hooks/member";
import type { GooglePaymentVerifyRequest } from "@/types/payment";

// Google Play 결제 검증 성공 시, 잔액·카탈로그·내역 캐시를 모두 무효화해 충전 결과를 반영한다.
// (잔액은 MyPage의 ME_QUERY_KEY와 사진복원 화면의 ["credit-balance"] 두 곳에서 읽는다.)
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
