import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import {
  socialSignup,
  type SocialSignupCompleteData,
  type SocialSignupCompleteReq,
} from "@/api/auth";

type Variables = SocialSignupCompleteReq;
type Response = ApiResponse<SocialSignupCompleteData>;

export function useSocialSignup(
  options?: UseMutationOptions<Response, Error, Variables>,
) {
  return useMutation<Response, Error, Variables>({
    mutationKey: ["member", "socialSignupComplete"],
    mutationFn: (vars) => socialSignup(vars),
    ...options,
  });
}
