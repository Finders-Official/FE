import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/apis/photoFeed/post.api";
import {
  PAGE_SIZE,
  type PhotoFeedResponse,
} from "@/types/photoFeed/postPreview";

/**
 * 사진수다 메인 피드 모든 게시글 조회 (CO-010)
 */
export function useInfinitePosts() {
  return useInfiniteQuery<PhotoFeedResponse>({
    queryKey: ["photoFeed", PAGE_SIZE],
    queryFn: ({ pageParam = 0 }) =>
      getPosts({ pageParam: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.previewList.length < PAGE_SIZE ? undefined : allPages.length,

    staleTime: 1000 * 60 * 5, // 5분 동안은 "신선" → 마운트돼도 refetch 안 함
    gcTime: 1000 * 60 * 30, // 30분간 캐시 유지 (v5, v4면 cacheTime)
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 막기
    refetchOnWindowFocus: false, // 탭 다시 클릭/포커스 시 재요청 막기
    refetchOnReconnect: false, // 네트워크 재연결 시 재요청 막기
    retry: 1, // (선택) 실패 시 재시도 횟수 줄이기
  });
}
