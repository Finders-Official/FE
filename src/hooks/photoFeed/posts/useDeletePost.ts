import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/apis/photoFeed/post.api";

export function useDeletePost(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deletePost", postId],
    mutationFn: () => deletePost(postId),

    onSuccess: (_data, postId) => {
      // 1) 피드 리스트 최신화
      queryClient.invalidateQueries({ queryKey: ["photoFeed"] });

      // 2) 게시글 상세 최신화/제거
      queryClient.invalidateQueries({ queryKey: ["postDetail", postId] });

      // 3) 검색 결과 페이지 최신화
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
  });
}
