import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getMyPosts } from "@/apis/my";
import type { GetPostPreviewPageResponse } from "@/types/mypage/post";

export const MY_POSTS_QUERY_KEY = ["posts", "me"] as const;

export function useMyPostsInfinite(size = 10) {
  return useInfiniteQuery<
    GetPostPreviewPageResponse,
    Error,
    InfiniteData<GetPostPreviewPageResponse>,
    readonly unknown[],
    number
  >({
    queryKey: [...MY_POSTS_QUERY_KEY, { size }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getMyPosts({ page: pageParam, size }),
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.isLast;
      if (isLast) return undefined;
      return allPages.length;
    },
  });
}
