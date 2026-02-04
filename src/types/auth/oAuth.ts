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
