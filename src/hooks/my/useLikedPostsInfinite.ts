import { getLikedPosts } from "@/apis/my";
import type { GetPostPreviewPageResponse } from "@/types/mypage/post";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

export const LIKED_POSTS_QUERY_KEY = ["posts", "likes"] as const;

export function useLikedPostsInfinite(size = 10) {
  return useInfiniteQuery<
    GetPostPreviewPageResponse,
    Error,
    InfiniteData<GetPostPreviewPageResponse>,
    readonly unknown[],
    number
  >({
    queryKey: [...LIKED_POSTS_QUERY_KEY, { size }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getLikedPosts({ page: pageParam, size }),
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.isLast;
      if (isLast) return undefined;
      return allPages.length; // page가 0부터 시작이면 다음은 pages.length가 딱 맞음
    },
  });
}
