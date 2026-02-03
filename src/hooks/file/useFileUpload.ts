import { uploadToPresignedUrl } from "@/apis/file";
import type { UploadToPresignedUrlArgs } from "@/types/file/presignedUrl";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type Response = void;
type Variables = UploadToPresignedUrlArgs;
type TError = Error;
type TContext = unknown;

export function useUploadToPresignedUrl(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["files", "uploadToPresignedUrl"],
    mutationFn: (vars) => uploadToPresignedUrl(vars),
    ...restOptions,

    onSuccess: (data, variables, onMutateResult, context) => {
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      onError?.(error, variables, onMutateResult, context);
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
}
