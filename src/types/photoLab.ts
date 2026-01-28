// 현상소 아이템 (GET /photo-labs 응답)
export interface PhotoLabItem {
  photoLabId: number;
  name: string;
  tags: string[];
  address: string;
  distanceKm: number;
  workCount: number;
  avgWorkTime: number;
  imageUrls: string[];
  isFavorite: boolean;
}

// 즐겨찾기 응답
export interface PhotoLabFavoriteStatus {
  isFavorite: boolean;
}

// 페이지네이션 정보
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 페이지네이션 포함 API 응답
export interface PagedApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
  pagination: PaginationInfo;
}

// 현상소 목록 조회 파라미터
export interface PhotoLabListParams {
  q?: string;
  tagIds?: number[];
  regionId?: number;
  date?: string;
  page?: number;
  size?: number;
  lat?: number;
  lng?: number;
}

// 태그 정의
export interface PhotoLabTag {
  id: number;
  name: string;
}

// 위치 정보 상태
export interface GeolocationState {
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: string | null;
  isDefault: boolean;
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

// 필터 상태 (바텀시트용)
export interface FilterState {
  date?: string; // "2026-1-xx" 형식
  time?: string; // "오전 10:00" 형식
  region?: string; // "서울"
  subRegion?: string; // "동작구"
  regionId?: number; // TODO: BottomSheet API 연동 시 사용
}

// 지역 정보
export interface Region {
  name: string;
  count: number;
  subRegions: string[];
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

// 현상소 상세 페이지 타입 (PL-020)
export interface PhotoLabDetailImage {
  imageUrl: string;
  isMain: boolean;
  displayOrder: number;
}

export interface PhotoLabNotice {
  noticeId: number;
  noticeType: "EVENT" | "NOTICE";
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PhotoLabWorkResults {
  count: number;
  previewImageUrls: string[];
}

export interface PhotoLabLocation {
  latitude: number;
  longitude: number;
}

export interface PhotoLabDetail {
  photoLabId: number;
  name: string;
  keywords: string[];
  isFavorite: boolean;
  address: string;
  distanceKm: number;
  location: PhotoLabLocation;
  workCount: number;
  avgWorkTimeMinutes: number | null;
  images: PhotoLabDetailImage[];
  notices: PhotoLabNotice[];
  workResults: PhotoLabWorkResults;
}
