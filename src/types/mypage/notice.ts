export type TabName = "일반공지" | "이벤트 안내" | "약관/정책";

export type NoticeType = "GENERAL" | "EVENT" | "POLICY";

export interface NoticeItem {
  id: number;
  title: string;
  type: NoticeType;
  createdAt: string;
  content?: string;
  isNew: boolean;
}

export interface NoticeResponse {
  contents: NoticeItem[];
  totalElements: number;
}
