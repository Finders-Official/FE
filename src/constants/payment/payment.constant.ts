import type { CardOption, EasyPayOption } from "@/types/payment";

export const CREDIT_CARD_OPTIONS: CardOption[] = [
  { id: "HYUNDAI", name: "현대" },
  { id: "SHINHAN", name: "신한" },
  { id: "BC", name: "비씨(페이북)" },
  { id: "KB", name: "KB국민" },
  { id: "SAMSUNG", name: "삼성" },
  { id: "LOTTE", name: "롯데" },
  { id: "HANA", name: "하나(외환)" },
  { id: "NH", name: "NH채움" },
  { id: "WOORI", name: "우리" },
  { id: "SUHYUP", name: "수협" },
  { id: "CITI", name: "씨티" },
  { id: "GWANGJU", name: "광주" },
  { id: "JEONBUK", name: "전북" },
  { id: "JEJU", name: "제주" },
  { id: "SHINHYUP_CHECK", name: "신협체크" },
  { id: "MG_CHECK", name: "MG새마을체크" },
  { id: "SAVINGS_CHECK", name: "저축은행체크" },
  { id: "POST", name: "우체국카드" },
  { id: "KDB", name: "KDB산업은행" },
  { id: "KAKAO_BANK", name: "카카오뱅크" },
];

export const EASY_PAY_OPTIONS: EasyPayOption[] = [
  { id: "KAKAO_PAY", name: "카카오페이" },
  { id: "TOSS", name: "토스" },
  { id: "NAVER_PAY", name: "네이버페이" },
];

// 서버 ErrorCode, 성공/실패 단정 불가
export const PAYMENT_ALREADY_PROCESSED_CODE = "PAYMENT_410";

export const PAYMENT_TERMS = [
  { id: "PRIVACY", label: "개인정보 수집·이용 및 처리 동의" },
  { id: "EPAYMENT", label: "전자지급 결제대행 서비스 이용약관 동의" },
] as const;

export const PAYMENT_REFUND_NOTICES = [
  "결제 완료 후, 크레딧 환불이 불가능합니다.",
  "크레딧의 부분 환불은 불가능합니다.",
  "구매한 크레딧은 결제일로부터 12개월 이내 사용해야 하며, 기간 초과 시 자동 소멸됩니다.",
];
