import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import {
  requestPhoneVerification,
  type PhoneVerifyRequestData,
  type PhoneVerifyRequestReq,
} from "@/api/member";

type Variables = PhoneVerifyRequestReq;
type Response = ApiResponse<PhoneVerifyRequestData>;

export function useRequestPhoneVerification(
  options?: UseMutationOptions<Response, Error, Variables>,
) {
  return useMutation<Response, Error, Variables>({
    mutationKey: ["member", "phoneVerify", "request"],
    mutationFn: (vars) => requestPhoneVerification(vars),
    ...options,
  });
}
