import { oauth } from "@/apis/auth";
import type { SocialLoginData, SocialLoginReq } from "@/types/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type Variables = SocialLoginReq;
type Response = ApiResponse<SocialLoginData>;

export function useOauth(
  options?: UseMutationOptions<Response, unknown, Variables>,
) {
  return useMutation<Response, Error, Variables>({
    mutationKey: ["auth", "socialLogin"],
    mutationFn: (vars) => oauth(vars),
    ...options,
  });
}
