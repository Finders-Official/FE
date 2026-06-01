import type { TermsType } from "./terms";

export type AgreementItem = {
  termsId: number;
  isAgreed: boolean;
};

export interface SocialSignupCompleteReq {
  nickname: string;
  phone: string;
  verifiedPhoneToken: string;
  agreedTermTypes: TermsType[];
}

export type SocialSignupCompleteData = {
  accessToken: string;
  member: {
    memberId: number;
    nickname: string;
  };
};
