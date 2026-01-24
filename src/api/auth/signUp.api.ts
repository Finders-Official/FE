import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

export type AgreementItem = {
  termsId: number;
  isAgreed: boolean;
};

export interface SocialSignupCompleteReq {
  nickname: string;
  phone: string;
  verifiedPhoneToken: string;
  agreements: AgreementItem[];
}

export type SocialSignupCompleteData = {
  accessToken: string;
  refreshToken: string;
  member: {
    memberId: number;
    nickname: string;
  };
};

// 소셜 회원가입 완료
export async function socialSignup(
  payload: SocialSignupCompleteReq,
): Promise<ApiResponse<SocialSignupCompleteData>> {
  const res = await axiosInstance.post<ApiResponse<SocialSignupCompleteData>>(
    "/members/social/signup/complete",
    payload,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
