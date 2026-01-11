// 현상소 아이템
export interface PhotoLabItem {
  photoLabId: number;
  name: string;
  keywords: string[];
  address: string;
  distanceKm: number;
  workCount: number;
  avgWorkTimeMinutes: number | null;
  imageUrls: string[];
  isFavorite: boolean;
}

// 필터 태그
export type FilterTag =
  | "따뜻한 색감"
  | "청량한"
  | "빈티지한"
  | "영화용 필름"
  | "택배 접수";

// 현상소 공지
export interface LabNews {
  id: number;
  labName: string;
  content: string;
}
