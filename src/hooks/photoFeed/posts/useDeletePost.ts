import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/apis/photoFeed/post.api";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),

    onSuccess: (_data, postId) => {
      // 1) 피드 리스트 최신화
      // 삭제 후 피드로 이동하는 흐름이라 이 시점엔 피드 쿼리가 비활성 상태일 수 있으므로,
      // refetchType: "all"로 마운트 여부와 무관하게 즉시 갱신한다.
      queryClient.invalidateQueries({
        queryKey: ["photoFeed"],
        refetchType: "all",
      });

      // 2) 게시글 상세 최신화/제거
      queryClient.invalidateQueries({ queryKey: ["postDetail", postId] });

      // 3) 검색 결과 페이지 최신화
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
  });
}
