import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { createPost } from "@/apis/photoFeed/post.api";
import type { PostUploadRequest } from "@/types/photoFeed/postDetail";

type CreatePostResult = number;
type CreatePostVars = PostUploadRequest;
type CreatePostError = unknown;

export function useCreatePost(
  options?: UseMutationOptions<
    CreatePostResult,
    CreatePostError,
    CreatePostVars
  >,
) {
  return useMutation<CreatePostResult, CreatePostError, CreatePostVars>({
    mutationKey: ["createPost"],
    mutationFn: createPost,
    ...options,
  });
}
