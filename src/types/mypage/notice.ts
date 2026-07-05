export type TabName = "일반공지" | "이벤트 안내" | "약관/정책";

export type NoticeType = "GENERAL" | "EVENT" | "POLICY";

export interface NoticeItem {
  id: string;
  title: string;
  type: NoticeType;
  createdAt: string;
  content?: string;
  isNew: boolean;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface NoticeListResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: NoticeItem[];
  pagination: Pagination;
}

export interface NoticeDetailResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: NoticeItem;
}
