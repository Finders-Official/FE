import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/apis/photoFeed/comment.api";

export function useDeleteComment(commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteComment", commentId],
    mutationFn: () => deleteComment(commentId),

    onSuccess: () => {
      // 댓글 리스트 최신화
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
