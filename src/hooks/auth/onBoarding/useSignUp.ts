import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import { socialSignup } from "@/api/auth";
import type {
  SocialSignupCompleteData,
  SocialSignupCompleteReq,
} from "@/types/auth";

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
