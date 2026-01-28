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
  });
}
