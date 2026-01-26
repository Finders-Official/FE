import { axiosInstance } from "@/lib/axiosInstance";
import type {
  SocialSignupCompleteData,
  SocialSignupCompleteReq,
} from "@/types/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

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
