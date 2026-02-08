/**
 * 게시글 검색 요청 (CO-010)
 */
export type SearchRequest = {
  keyword: string;
  filter: Filter;
  page: number;
  size?: number;
  sort?: Sort;
};

/**
 * 최근 검색어 조회 응답 (CO-011)
 */
export type SearchHistory = {
  searchHistoryId: number;
  keyword: string;
  imageUrl: string;
  width: number;
  height: number;
};

/**
 * 연관 검색어 응답 (CO-012)
 */
export type RelatedKeyword = {
  keyword: string;
  type: Filter;
};

export type Filter = "TITLE" | "TITLE_CONTENT" | "LAB_NAME" | "LAB_REVIEW";
export type Sort = "DESC" | "ASC";
