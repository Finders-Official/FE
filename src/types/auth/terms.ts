// BE 약관 타입 (POST /members/social/signup/complete 의 agreedTermTypes)
export type TermsType =
  | "SERVICE"
  | "PRIVACY"
  | "SERVICE_INFO"
  | "LOCATION"
  | "MARKETING";

// 약관 동의 화면 아코디언 본문 그룹
export type AgreementGroup = {
  heading?: string;
  text?: string;
  items?: string[];
  ordered?: boolean;
  note?: string;
};

// 약관 동의 화면 항목 (체크박스 + 아코디언)
export type AgreementTerm = {
  id: string;
  label: string;
  required: boolean;
  // 이 항목 동의 시 agreedTermTypes에 포함될 타입
  agreeTypes: TermsType[];
  groups: AgreementGroup[];
};
