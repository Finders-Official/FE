import { getScanResults } from "@/apis/photoManage/developmentOrder.api";
import type { ApiResponseWithSlice } from "@/types/common/apiResponse";
import type { ScanResultList } from "@/types/photomanage/scanResult";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteScanResults(developmentOrderId: number) {
  return useInfiniteQuery<ApiResponseWithSlice<ScanResultList>>({
    queryKey: ["scanResults", developmentOrderId],
    queryFn: ({ pageParam = 0 }) =>
      getScanResults(developmentOrderId, pageParam as number),
    enabled: !!developmentOrderId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.slice?.hasNext ? allPages.length : undefined,
  });
}
