import { axiosInstance } from "@/lib/axiosInstance";
import type { SocialLoginData, SocialLoginReq } from "@/types/auth";
import type { ApiResponse } from "@/types/common/apiResponse";

// 통합 소셜 로그인 (KAKAO / APPLE)
export async function oauth(
  payload: SocialLoginReq,
): Promise<ApiResponse<SocialLoginData>> {
  const res = await axiosInstance.post<ApiResponse<SocialLoginData>>(
    "/auth/social/login",
    payload,
  );
  const body = res.data;

  //apiresponse 내부 success 가 false로 올 경우
  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
