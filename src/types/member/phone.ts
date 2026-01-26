export interface PhoneVerifyConfirmReq {
  requestId: string;
  code: string;
}

export interface PhoneVerifyConfirmData {
  phoneVerified: boolean;
  verifiedPhoneToken: string;
  phone: string;
  expiresIn: number;
}

export type PhoneVerifyPurpose = "SIGNUP" | "MY_PAGE";

export interface PhoneVerifyRequestReq {
  phone: string;
  purpose: PhoneVerifyPurpose;
}

export interface PhoneVerifyRequestData {
  requestId: string;
  expiresIn: number;
}
