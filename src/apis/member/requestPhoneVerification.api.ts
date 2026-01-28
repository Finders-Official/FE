import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PhoneVerifyRequestData,
  PhoneVerifyRequestReq,
} from "@/types/member";

// 휴대폰 인증번호 요청
export async function requestPhoneVerification(
  payload: PhoneVerifyRequestReq,
): Promise<ApiResponse<PhoneVerifyRequestData>> {
  const res = await axiosInstance.post<ApiResponse<PhoneVerifyRequestData>>(
    "/members/phone/verify/request",
    payload,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
