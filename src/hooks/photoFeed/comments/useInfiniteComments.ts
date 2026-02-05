import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "@/types/photoFeed/postPreview";
import { getComments } from "@/apis/photoFeed";
import type { PostCommentList } from "@/types/photoFeed/postDetail";

/**
 * 사진수다 게시글 댓글 조회 (CO-030)
 */
export function useInfiniteComments(postId: number) {
  return useInfiniteQuery<PostCommentList>({
    queryKey: ["comments", PAGE_SIZE],
    queryFn: ({ pageParam = 0 }) => getComments(postId, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.commentList.length < PAGE_SIZE ? undefined : allPages.length,
  });
}
