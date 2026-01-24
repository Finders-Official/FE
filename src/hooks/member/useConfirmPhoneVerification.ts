import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/apiResponse";
import {
  confirmPhoneVerification,
  type PhoneVerifyConfirmReq,
  type PhoneVerifyConfirmData,
} from "@/api/member/confirmPhoneVerification.api";

type Variables = PhoneVerifyConfirmReq;
type Response = ApiResponse<PhoneVerifyConfirmData>;

export function useConfirmPhoneVerification(
  options?: UseMutationOptions<Response, Error, Variables>,
) {
  return useMutation<Response, Error, Variables>({
    mutationKey: ["member", "phoneVerify", "confirm"],
    mutationFn: (vars) => confirmPhoneVerification(vars),
    ...options,
  });
}
