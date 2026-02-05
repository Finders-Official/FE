import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/apis/photoFeed/comment.api";

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: (commentId: number) => deleteComment(commentId),

    onSuccess: () => {
      // 댓글 리스트 최신화
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
