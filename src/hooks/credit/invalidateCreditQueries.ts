import type { QueryClient } from "@tanstack/react-query";
import { ME_QUERY_KEY } from "@/hooks/member";
import { CREDIT_HISTORIES_QUERY_KEY } from "./useCreditHistories";
import { CREDIT_PURCHASE_PAGE_QUERY_KEY } from "./useCreditPurchasePage";

// 크레딧 잔액이 변하는 결제 플로우(Google/PortOne) 공통 — 잔액을 반영하는 캐시 무효화
export function invalidateCreditQueries(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ["credit-balance"] });
  queryClient.invalidateQueries({ queryKey: CREDIT_PURCHASE_PAGE_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: CREDIT_HISTORIES_QUERY_KEY });
}
