import { useQuery } from "@tanstack/react-query";
import { getCreditPurchasePage } from "@/apis/credit";
import type { PaymentProvider } from "@/types/payment/provider";

export const CREDIT_PURCHASE_PAGE_QUERY_KEY = [
  "credit",
  "purchase-page",
] as const;

export function useCreditPurchasePage({
  provider,
  enabled = true,
}: {
  provider: PaymentProvider;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: [...CREDIT_PURCHASE_PAGE_QUERY_KEY, provider],
    queryFn: () => getCreditPurchasePage(provider),
    select: (res) => res.data,
    enabled,
  });
}
