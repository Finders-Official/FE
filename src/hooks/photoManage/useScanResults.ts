import { useQuery } from "@tanstack/react-query";
import { getScanResults } from "@/apis/photoManage";

export function useScanResults(developmentOrderId: number | null) {
  return useQuery({
    queryKey: ["photoManage", "scanResults", developmentOrderId],
    queryFn: () => getScanResults(developmentOrderId!, 0, 100),
    select: (res) => res.data.content,
    enabled: developmentOrderId !== null,
    staleTime: 1000 * 60 * 5,
  });
}
