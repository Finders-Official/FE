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

// 1. 소셜 로그인에서 이제 하나의 API만 사용함
// POST /auth/social/login

//   {
//     "provider": "KAKAO",
//     "credentialType": "ACCESS_TOKEN",
//     "credential": "kakao_access_token"
//   }
// 카카오는 accessToken/authorizationCode 모두 사용이 가능한데 필요한걸로 연결하면 됨
// 애플은 accessToken 이용 불가
