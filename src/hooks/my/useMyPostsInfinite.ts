import { getMyPosts } from "@/apis/my";
import type { GetPostPreviewPageResponse } from "@/types/mypage/post";
import { useInfiniteQuery } from "@tanstack/react-query";

export const MY_POSTS_QUERY_KEY = ["posts", "me"] as const;

export function useMyPostsInfinite(size = 10) {
  return useInfiniteQuery<
    GetPostPreviewPageResponse,
    Error,
    GetPostPreviewPageResponse,
    readonly unknown[],
    number
  >({
    queryKey: [...MY_POSTS_QUERY_KEY, { size }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getMyPosts({ page: pageParam, size }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.isLast) return undefined;
      return allPages.length; // page=0부터 시작이면 다음 페이지는 pages.length
    },
  });
}
