import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import type { WithDrawResponse } from "@/types/mypage/info";
import { withDrawMe } from "@/apis/member/me.api";

type Response = ApiResponse<WithDrawResponse>;
type Variables = void;
type TError = Error;
type TContext = unknown;

export function useWithDrawMe(
  options?: UseMutationOptions<Response, TError, Variables, TContext>,
) {
  const { ...restOptions } = options ?? {};

  return useMutation<Response, TError, Variables, TContext>({
    mutationKey: ["member", "withdrawMe"],
    mutationFn: async () => withDrawMe(),
    ...restOptions,
  });
}
