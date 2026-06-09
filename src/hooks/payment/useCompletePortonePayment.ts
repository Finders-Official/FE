import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { completePortonePayment } from "@/apis/payment";
import {
  CREDIT_HISTORIES_QUERY_KEY,
  CREDIT_PURCHASE_PAGE_QUERY_KEY,
} from "@/hooks/credit";
import { ME_QUERY_KEY } from "@/hooks/member";
import type { PortoneCompleteRequest } from "@/types/payment";

// PortOne 결제 완료 처리. 충전 성공(PAID) 시 캐시 무효화
export function useCompletePortonePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PortoneCompleteRequest) =>
      completePortonePayment(request),
    // 네트워크/5xx 등 일시 오류만 재시도
    retry: (failureCount, error) =>
      failureCount < 2 &&
      isAxiosError(error) &&
      (!error.response || error.response.status >= 500),
    onSuccess: (response) => {
      if (response.data.status !== "PAID") return;
      queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["credit-balance"] });
      queryClient.invalidateQueries({
        queryKey: CREDIT_PURCHASE_PAGE_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: CREDIT_HISTORIES_QUERY_KEY });
    },
  });
}
