export type SearchHistory = {
  historyId: number;
  keyword: string;
  imageUrl: string;
  createdAt: string;
};

export type SearchHistoryList = {
  historyList: SearchHistory;
};

export type RelatedKeyword = {
  keyword: string;
  type: SearchType;
};

export type SearchType = "LAB_NAME" | "POST_TITLE" | "POST_CONTENT";
