import { useInfiniteQuery } from "@tanstack/react-query";
import type { NoticeType } from "@/types/mypage/notice";
import { getNoticeList } from "@/apis/my";

export const useNoticeListInfinite = (type: NoticeType, size = 10) => {
  return useInfiniteQuery({
    queryKey: ["notices", type, size],
    queryFn: ({ pageParam = 0 }) => getNoticeList(type, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // API 응답의 pagination 정보를 확인하여 다음 페이지가 있으면 page + 1 반환
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined; // 더 이상 페이지가 없으면 undefined 반환
    },
  });
};
