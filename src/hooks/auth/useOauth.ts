import {
  oauth,
  type SocialoginCompleteData,
  type SocialoginCompleteReq,
} from "@/api/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type Variables = SocialoginCompleteReq;
type Response = ApiResponse<SocialoginCompleteData>;

export function useOauth(
  options?: UseMutationOptions<Response, unknown, Variables>,
) {
  return useMutation<Response, unknown, Variables>({
    mutationKey: ["auth", "completeSocialSignup"],
    mutationFn: (vars) => oauth(vars),
    ...options,
  });
}
