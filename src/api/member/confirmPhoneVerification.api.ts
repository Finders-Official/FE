import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

export interface PhoneVerifyConfirmReq {
  requestId: string;
  code: string;
}

export interface PhoneVerifyConfirmData {
  phoneVerified: boolean;
  verifiedPhoneToken: string;
  phone: string;
  expiresIn: number;
}

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
