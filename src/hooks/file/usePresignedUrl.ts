import { issuePresignedUrl } from "@/apis/file";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PresignedUrlIssueReqDto,
  PresignedUrlIssueResDto,
} from "@/types/file/presignedUrl";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type Response = ApiResponse<PresignedUrlIssueResDto>;
type Variables = PresignedUrlIssueReqDto;
type TError = Error;
type TContext = unknown;

export function useIssuePresignedUrl(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["files", "issuePresignedUrl"],
    mutationFn: (vars) => issuePresignedUrl(vars),
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
