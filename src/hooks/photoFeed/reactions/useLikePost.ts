import { postLike } from "@/apis/photoFeed";
import type { PostDetailResponse } from "@/types/photoFeed/postDetail";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["likePost"],
    mutationFn: (postId: number) => postLike(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["postDetail", postId] });

      const prev = queryClient.getQueryData(["postDetail", postId]);

      queryClient.setQueryData(
        ["postDetail", postId],
        (old?: PostDetailResponse) =>
          old
            ? {
                ...old,
                isLiked: true,
                likeCount: old.likeCount + 1,
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
