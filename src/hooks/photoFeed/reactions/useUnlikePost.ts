import { deleteLike } from "@/apis/photoFeed";
import type { PostDetailResponse } from "@/types/photoFeed/postDetail";
import type { CommunityPost } from "@/apis/mainPage/mainPage.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const COMMUNITY_PREVIEW_QK = ["community", "posts", "preview"] as const;
const POST_DETAIL_QK = (postId: number) => ["postDetail", postId] as const;

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unlikePost"],
    mutationFn: (postId: number) => deleteLike(postId),

    onMutate: async (postId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: POST_DETAIL_QK(postId) }),
        queryClient.cancelQueries({ queryKey: COMMUNITY_PREVIEW_QK }),
      ]);

      const prevDetail = queryClient.getQueryData<PostDetailResponse>(
        POST_DETAIL_QK(postId),
      );
      const prevPreview =
        queryClient.getQueryData<CommunityPost[]>(COMMUNITY_PREVIEW_QK);

      queryClient.setQueryData(
        POST_DETAIL_QK(postId),
        (old?: PostDetailResponse) =>
          old
            ? {
                ...old,
                isLiked: false,
                likeCount: Math.max(0, old.likeCount - 1),
              }
            : old,
      );

      queryClient.setQueryData<CommunityPost[]>(COMMUNITY_PREVIEW_QK, (old) =>
        old?.map((p) =>
          p.postId === postId
            ? {
                ...p,
                isLiked: false,
                likeCount: Math.max(0, p.likeCount - 1),
              }
            : p,
        ),
      );

      return { prevDetail, prevPreview };
    },

    onError: (_err, postId, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(POST_DETAIL_QK(postId), context.prevDetail);
      }
      if (context?.prevPreview) {
        queryClient.setQueryData(COMMUNITY_PREVIEW_QK, context.prevPreview);
      }
    },

    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: POST_DETAIL_QK(postId) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_PREVIEW_QK });
    },
  });
}
