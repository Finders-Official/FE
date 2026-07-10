import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { postComment } from "@/apis/photoFeed/comment.api";
import type { PostComment } from "@/types/photoFeed/postDetail";
import { patchPostInFeed } from "@/hooks/photoFeed/updateFeedCache";

type CreateCommentResult = PostComment;
type CreateCommentVars = { postId: string; content: string };
type CreateCommentError = Error;

export function useCreateComment(
  options?: UseMutationOptions<
    CreateCommentResult,
    CreateCommentError,
    CreateCommentVars
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCommentResult,
    CreateCommentError,
    CreateCommentVars
  >({
    mutationKey: ["createComment"],
    mutationFn: ({ postId, content }) => postComment(postId, content),
    ...options,
    onSuccess: (data, vars, onMutateResult, ctx) => {
      // 댓글 리스트 최신화
      queryClient.invalidateQueries({ queryKey: ["comments", vars.postId] });
      // 상세 헤더의 댓글 수 갱신
      queryClient.invalidateQueries({
        queryKey: ["postDetail", vars.postId],
      });
      // 피드 카드의 댓글 수도 즉시 +1 (전체 리페치 없이)
      patchPostInFeed(queryClient, vars.postId, (p) => ({
        ...p,
        commentCount: p.commentCount + 1,
      }));
      options?.onSuccess?.(data, vars, onMutateResult, ctx);
    },
  });
}
