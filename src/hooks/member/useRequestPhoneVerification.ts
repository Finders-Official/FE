import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { ApiResponse } from "@/types/common/apiResponse";
import { requestPhoneVerification } from "@/apis/member";
import type {
  PhoneVerifyRequestData,
  PhoneVerifyRequestReq,
} from "@/types/member";

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

// axios 에러(HTTP 에러 상태) 또는 200 + success:false로 던져진 에러 모두에서 서버 ApiResponse.code(MEMBER_xxx) 추출
export function extractPhoneVerifyErrorCode(
  error: unknown,
): string | undefined {
  if (isAxiosError<{ code?: string }>(error)) {
    return error.response?.data?.code ?? error.code;
  }
  if (error instanceof Error && "code" in error) {
    return (error as Error & { code?: string }).code;
  }
  return error instanceof Error ? error.message : undefined;
}
