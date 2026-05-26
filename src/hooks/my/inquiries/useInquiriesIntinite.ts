import { getInquiries } from "@/apis/my";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInquiriesInfinite = (size = 10) => {
  return useInfiniteQuery({
    queryKey: ["inquiries", size],
    queryFn: ({ pageParam = 0 }) => getInquiries(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 응답 데이터 안의 페이지 정보 추출
      const { totalCount, page, size: currentSize } = lastPage.data;

      // 다음 페이지 번호
      const nextPageIndex = page + 1;

      // 지금까지 불러온 데이터 개수(또는 다음 페이지의 시작점)가 전체 개수보다 작으면 다음 페이지 존재
      if (nextPageIndex * currentSize < totalCount) {
        return nextPageIndex;
      }
      return undefined; // 더 이상 데이터가 없으면 undefined 반환하여 호출 중단
    },
  });
};
