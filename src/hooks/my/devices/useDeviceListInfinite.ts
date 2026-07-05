import { getDeviceList } from "@/apis/my";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useDeviceListInfinite = (size = 10) => {
  return useInfiniteQuery({
    queryKey: ["equipments", size],
    queryFn: ({ pageParam }) => getDeviceList(pageParam, size),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 존재하면 nextCursor 반환, 없으면 undefined 반환하여 중단
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
};
