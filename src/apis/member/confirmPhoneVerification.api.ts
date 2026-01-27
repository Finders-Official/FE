import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PhoneVerifyConfirmData,
  PhoneVerifyConfirmReq,
} from "@/types/member";

// 휴대폰 인증번호 확인
export async function confirmPhoneVerification(
  payload: PhoneVerifyConfirmReq,
): Promise<ApiResponse<PhoneVerifyConfirmData>> {
  const res = await axiosInstance.post<ApiResponse<PhoneVerifyConfirmData>>(
    "/members/phone/verify/confirm",
    payload,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
