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
  type: "공지" | "이벤트" | "할인";
  labName: string;
  content: string;
}

// 기존 타입 (FindPhotoLabPage에서 사용)
export type PhotoLab = {
  id: number;
  name: string;
  addr: string;
  dist: string;
};

export const results: PhotoLab[] = [
  {
    id: 1,
    name: "파인더스 상도점",
    addr: "서울 동작구 상도 1동",
    dist: "1.5km",
  },
  {
    id: 2,
    name: "파인더스 흑석점",
    addr: "서울 동작구 상도 1동",
    dist: "1.5km",
  },
  {
    id: 3,
    name: "파인더스 홍대점",
    addr: "서울 동작구 상도 1동",
    dist: "1.5km",
  },
  {
    id: 4,
    name: "파인더스 강남점",
    addr: "서울 동작구 상도 1동",
    dist: "1.5km",
  },
  {
    id: 5,
    name: "파인더스 건대점",
    addr: "서울 동작구 상도 1동",
    dist: "1.5km",
  },
];
