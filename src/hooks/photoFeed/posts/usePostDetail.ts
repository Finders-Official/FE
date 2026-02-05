import { getPostDetail } from "@/apis/photoFeed";
import type { PostDetailResponse } from "@/types/photoFeed/postDetail";
import { useQuery } from "@tanstack/react-query";

/**
 * 사진수다 게시글 상세 조회 (CO-030)
 */
export function usePostDetail(postId: number) {
  return useQuery<PostDetailResponse>({
    queryKey: ["postDetail"],
    queryFn: () => getPostDetail(postId),
  });
}
