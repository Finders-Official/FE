import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "@/types/photoFeed/postPreview";
import { getComments } from "@/apis/photoFeed";
import type { PostComment } from "@/types/photoFeed/postDetail";
import type { ApiResponseWithPagination } from "@/types/common/apiResponse";

/**
 * 사진수다 게시글 댓글 조회 (CO-030)
 */
export function useInfiniteComments(postId: number) {
  return useInfiniteQuery<ApiResponseWithPagination<PostComment[]>>({
    queryKey: ["comments", postId, PAGE_SIZE],
    queryFn: ({ pageParam = 0 }) => getComments(postId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < PAGE_SIZE ? undefined : allPages.length,
  });
}
