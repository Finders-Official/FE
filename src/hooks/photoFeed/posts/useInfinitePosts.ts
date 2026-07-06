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

    // [갱신 전략]
    // 무한스크롤 피드는 자동 리페치를 모두 끈다. 복귀/포커스마다 리페치하면
    // 로드된 여러 페이지를 다시 받아오며 스크롤 위치가 깨지기 때문.
    // 대신 최신화는 mutation이 책임진다:
    //  - 좋아요/댓글: 캐시를 직접 patch (patchPostInFeed) → 전체 리페치 없이 카운트 반영
    //  - 글 작성/삭제: invalidateQueries({ refetchType: "all" })로 즉시 전체 갱신
    staleTime: 1000 * 60, // 1분간 신선 취급
    gcTime: 1000 * 60 * 5, // 5분간 캐시 유지
    refetchOnMount: false, // 복귀 시 재요청 안 함(스크롤/페이지 보존)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
