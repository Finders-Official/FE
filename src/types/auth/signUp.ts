export type AgreementItem = {
  termsId: number;
  isAgreed: boolean;
};

export interface SocialSignupCompleteReq {
  nickname: string;
  phone: string;
  verifiedPhoneToken: string;
}

export type SocialSignupCompleteData = {
  accessToken: string;
  refreshToken: string;
  member: {
    memberId: number;
    nickname: string;
  };
};
