// 문의 유형 및 상태 Enum
export type InquiryType =
  | "SERVICE_ERROR"
  | "MEMBER_INFO"
  | "PROMOTION"
  | "PAYMENT";
export type InquiryStatus = "PENDING" | "ANSWERED" | "CLOSED"; // BE InquiryStatus enum과 일치

// 개별 문의 아이템 타입
export interface InquiryItem {
  id: string;
  type: InquiryType;
  content: string;
  status: InquiryStatus;
  photoLabName?: string | null;
  createdAt: string;
  hasReply: boolean;

  // 답변이 완료(ANSWERED)되었을 경우를 위한 옵셔널 필드
  replyContent?: string;
  replyCreatedAt?: string;
}

// API 응답 전체 래퍼 타입
export interface InquiryListResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: {
    inquiries: InquiryItem[];
    totalCount: number;
    page: number;
    size: number;
  };
}

// 문의 유형 옵션 타입 정의
export type InquiryOption = {
  label: string;
  value: string;
};

// 4가지 고정 옵션 데이터
export const INQUIRY_OPTIONS: InquiryOption[] = [
  { label: "서비스 이용 오류", value: "SERVICE_ERROR" },
  { label: "회원정보/정보변경", value: "MEMBER_INFO" },
  { label: "프로모션/크레딧", value: "PROMOTION" },
  { label: "결제", value: "PAYMENT" },
];

export interface CreateInquiryRequest {
  photoLabId?: string | null; // 특정 포토랩에 대한 문의가 아닐 경우 처리
  type: InquiryType;
  content: string;
  objectPaths?: string[]; // 첨부파일 경로 (현재 UI에 없으므로 옵셔널)
}
