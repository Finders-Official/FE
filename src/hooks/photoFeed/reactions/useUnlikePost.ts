import { deleteLike } from "@/apis/photoFeed";
import type { PostDetailResponse } from "@/types/photoFeed/postDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unlikePost"],
    mutationFn: (postId: number) => deleteLike(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["postDetail", postId] });

      const prev = queryClient.getQueryData(["postDetail", postId]);

      queryClient.setQueryData(
        ["postDetail", postId],
        (old?: PostDetailResponse) =>
          old
            ? {
                ...old,
                isLiked: false,
                likeCount: Math.max(0, old.likeCount - 1),
              }
            : old,
      );

      return { prev };
    },

    onError: (_err, postId, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["postDetail", postId], context.prev);
      }
    },

    onSuccess: (_data, postId) => {
      // 게시글 상세 갱신
      queryClient.invalidateQueries({
        queryKey: ["postDetail", postId],
      });
    },
  });
}
