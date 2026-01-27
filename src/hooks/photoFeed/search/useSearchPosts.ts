import { getPostSearches } from "@/apis/photoFeed/search.api";
import {
  PAGE_SIZE,
  type PhotoFeedResponse,
} from "@/types/photoFeed/postPreview";
import type { SearchRequest } from "@/types/photoFeed/postSearch";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * 사진수다 검색 결과 리스트 조회 (CO-013)
 */
export function useSearchPosts(params: Omit<SearchRequest, "page">) {
  const { keyword, filter, sort } = params;

  return useInfiniteQuery<PhotoFeedResponse>({
    queryKey: ["postSearch", keyword, filter, sort],
    enabled: keyword.trim().length > 0, // 빈 검색어면 호출 안 함
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getPostSearches({
        keyword,
        filter,
        sort,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.previewList.length < PAGE_SIZE ? undefined : allPages.length,
  });
}
