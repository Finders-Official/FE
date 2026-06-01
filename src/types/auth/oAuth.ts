export type SocialProvider = "KAKAO" | "APPLE";

export type CredentialType = "ACCESS_TOKEN" | "AUTHORIZATION_CODE";

// 통합 소셜 로그인 요청 (POST /auth/social/login)
// - KAKAO: ACCESS_TOKEN | AUTHORIZATION_CODE
// - APPLE: AUTHORIZATION_CODE
export interface SocialLoginReq {
  provider: SocialProvider;
  credentialType: CredentialType;
  credential: string;
}

export type SocialProfile = {
  provider: SocialProvider | string;
  providerId: string;
  name: string;
  nickname: string;
  profileImage: string;
  email: string;
};

// 신규 회원: 약관 동의 + 휴대폰 인증으로 가입
export type SocialLoginSignupRequired = {
  isNewMember: true;
  signupToken: string;
  socialProfile: SocialProfile;
};

// 기존 회원: 바로 서비스 accessToken 발급 (refreshToken은 httpOnly 쿠키)
export type SocialLoginSuccess = {
  accessToken: string;
  member: {
    id: number;
    nickname: string;
  };
};

export type SocialLoginData = SocialLoginSignupRequired | SocialLoginSuccess;
