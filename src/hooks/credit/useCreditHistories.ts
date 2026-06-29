import { useQuery } from "@tanstack/react-query";
import { getCreditHistories } from "@/apis/credit";

export const CREDIT_HISTORIES_QUERY_KEY = ["credit", "histories"] as const;

export function useCreditHistories({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: CREDIT_HISTORIES_QUERY_KEY,
    queryFn: getCreditHistories,
    select: (res) => res.data,
    enabled,
  });
}
