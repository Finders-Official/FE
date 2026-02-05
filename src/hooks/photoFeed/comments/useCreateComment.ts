import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { postComment } from "@/apis/photoFeed/comment.api";
import type { PostComment } from "@/types/photoFeed/postDetail";

type CreateCommentResult = PostComment;
type CreateCommentVars = { postId: number; content: string };
type CreateCommentError = Error; // 또는 unknown

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
