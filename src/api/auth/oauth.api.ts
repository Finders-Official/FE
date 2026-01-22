import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

export interface SocialSignupCompleteReq {
  provider: string;
  code: string;
}
export type EmptyObject = Record<string, never>;

export type SocialSignupCompleteData = EmptyObject;

//소셜 로그인 (웹 브라우저용)
export async function oauth(
  payload: SocialSignupCompleteReq,
): Promise<ApiResponse<SocialSignupCompleteData>> {
  const res = await axiosInstance.post<ApiResponse<SocialSignupCompleteData>>(
    "/auth/social/login/code",
    payload,
  );
  const body = res.data;

  //apiresponse 내부 success 가 false로 올 경우
  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
