export type TabName = "일반공지" | "이벤트 안내" | "약관/정책";

export type NoticeType = "GENERAL" | "EVENT" | "POLICY";

export interface NoticeItem {
  noticeTitle: string;
  noticeType: NoticeType;
  startDate: string; // UI에 노출될 날짜
  endDate?: string;
  photoLabId?: number;
  photoLabName?: string;
}

export interface NoticeResponse {
  contents: NoticeItem[];
  totalElements: number;
}
