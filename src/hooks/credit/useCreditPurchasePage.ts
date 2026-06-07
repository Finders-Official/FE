import { useQuery } from "@tanstack/react-query";
import { getCreditPurchasePage } from "@/apis/credit";

export const CREDIT_PURCHASE_PAGE_QUERY_KEY = [
  "credit",
  "purchase-page",
] as const;

export function useCreditPurchasePage({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: CREDIT_PURCHASE_PAGE_QUERY_KEY,
    queryFn: getCreditPurchasePage,
    select: (res) => res.data,
    enabled,
  });
}
