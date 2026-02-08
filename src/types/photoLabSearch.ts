// 검색 페이지 상태
export type SearchState = "idle" | "typing" | "results";

// 최근 검색어 (localStorage 저장용)
export interface RecentSearch {
  id: string;
  keyword: string;
  timestamp: number;
}

// 인기 현상소 랭킹
export interface PopularLab {
  rank: number;
  photoLabId: number;
  name: string;
}

// 현상소 프리뷰 (검색 미리보기용)
export interface LabPreview {
  photoLabId: number;
  name: string;
  address: string;
  imageUrl: string | null;
}
