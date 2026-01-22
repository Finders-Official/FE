import {
  oauth,
  type SocialSignupCompleteData,
  type SocialSignupCompleteReq,
} from "@/api/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type Variables = SocialSignupCompleteReq;
type Response = ApiResponse<SocialSignupCompleteData>;

export function useOauth(
  options?: UseMutationOptions<Response, unknown, Variables>,
) {
  return useMutation<Response, unknown, Variables>({
    mutationKey: ["auth", "completeSocialSignup"],
    mutationFn: (vars) => oauth(vars),
    ...options,
  });
}
