import { postLike } from "@/apis/photoFeed";
import type { PostDetailResponse } from "@/types/photoFeed/postDetail";
import type { CommunityPost } from "@/apis/mainPage/mainPage.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PHOTO_FEED_QK,
  patchPostInFeed,
  restoreFeedCache,
} from "@/hooks/photoFeed/updateFeedCache";

const COMMUNITY_PREVIEW_QK = ["community", "posts", "preview"] as const;
const POST_DETAIL_QK = (postId: string) => ["postDetail", postId] as const;

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["likePost"],
    mutationFn: (postId: string) => postLike(postId),

    onMutate: async (postId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: POST_DETAIL_QK(postId) }),
        queryClient.cancelQueries({ queryKey: COMMUNITY_PREVIEW_QK }),
        queryClient.cancelQueries({ queryKey: PHOTO_FEED_QK }),
      ]);

      const prevDetail = queryClient.getQueryData<PostDetailResponse>(
        POST_DETAIL_QK(postId),
      );
      const prevPreview =
        queryClient.getQueryData<CommunityPost[]>(COMMUNITY_PREVIEW_QK);

      // 피드 카드의 좋아요 수/여부도 즉시 반영 (전체 리페치 없이)
      const prevFeed = patchPostInFeed(queryClient, postId, (p) => ({
        ...p,
        isLiked: true,
        likeCount: p.likeCount + 1,
      }));

      queryClient.setQueryData(
        POST_DETAIL_QK(postId),
        (old?: PostDetailResponse) =>
          old
            ? {
                ...old,
                isLiked: true,
                likeCount: old.likeCount + 1,
              }
            : old,
      );

      queryClient.setQueryData<CommunityPost[]>(COMMUNITY_PREVIEW_QK, (old) =>
        old?.map((p) =>
          String(p.postId) === postId
            ? {
                ...p,
                isLiked: true,
                likeCount: p.likeCount + 1,
              }
            : p,
        ),
      );

      return { prevDetail, prevPreview, prevFeed };
    },

    onError: (_err, postId, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(POST_DETAIL_QK(postId), context.prevDetail);
      }
      if (context?.prevPreview) {
        queryClient.setQueryData(COMMUNITY_PREVIEW_QK, context.prevPreview);
      }
      restoreFeedCache(queryClient, context?.prevFeed);
    },

    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: POST_DETAIL_QK(postId) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_PREVIEW_QK });
    },
  });
}
