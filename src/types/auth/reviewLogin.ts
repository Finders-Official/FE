import type { SocialLoginSuccess } from "./oAuth";

// 스토어 심사용 로그인 요청 (POST /auth/review/login)
export interface ReviewLoginReq {
  email: string;
  password: string;
}

// 서버가 소셜 로그인 기존 회원과 동일한 형태로 응답한다.
// 로그인 성공 후처리를 한 경로로 유지하기 위해 타입도 그대로 재사용한다.
export type ReviewLoginData = SocialLoginSuccess;
