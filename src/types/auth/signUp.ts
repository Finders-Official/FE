import type { TermsType } from "./terms";

export interface SocialSignupCompleteReq {
  nickname: string;
  phone: string;
  verifiedPhoneToken: string;
  agreedTermTypes: TermsType[];
}

export type SocialSignupCompleteData = {
  accessToken: string;
  member: {
    memberId: string;
    nickname: string;
  };
};
