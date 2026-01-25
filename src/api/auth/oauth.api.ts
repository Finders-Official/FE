import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

export interface SocialoginCompleteReq {
  provider: string;
  code: string;
}
export type SocialProfile = {
  provider: "KAKAO" | string;
  providerId: string;
  name: string;
  nickname: string;
  profileImage: string;
};

export type SocialoginCompleteData = {
  isNewMember: boolean;
  signupToken?: string;
  socialProfile?: SocialProfile;
  // 만약 기존 회원이면 백이 access/refresh를 줄 수도 있으니 확장 가능
  accessToken?: string;
  refreshToken?: string;
};

//소셜 로그인 (웹 브라우저용)
export async function oauth(
  payload: SocialoginCompleteReq,
): Promise<ApiResponse<SocialoginCompleteData>> {
  const res = await axiosInstance.post<ApiResponse<SocialoginCompleteData>>(
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
