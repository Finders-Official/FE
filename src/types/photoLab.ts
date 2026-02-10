// 현상소 아이템 (GET /photo-labs 응답)
export interface PhotoLabItem {
  photoLabId: number;
  name: string;
  tags: string[];
  address: string;
  distanceKm: number | null;
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
  parentRegionId?: number;
  regionIds?: number[];
  date?: string;
  time?: string[]; // ["HH:mm:ss", ...] 형식, 복수 선택
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

// 현상소 롤링 공지
export type NoticeType = "GENERAL" | "EVENT" | "POLICY";

export interface PhotoLabNoticeRolling {
  photoLabId: number;
  photoLabName: string;
  noticeTitle: string;
  noticeType: NoticeType;
  // TODO: 백엔드 response에 startDate, endDate 추가 예정
  startDate?: string;
  endDate?: string;
}

// 지역 선택 항목 (복수 선택용)
export interface RegionSelection {
  parentName: string; // "서울"
  subRegion: string; // "전체" | "강남구" 등
}

// 필터 상태 (바텀시트용)
export interface FilterState {
  date?: string; // "2026-01-15" 형식 (yyyy-MM-dd)
  time?: string[]; // ["오전 10:00", "오후 2:00"] 형식 (display용, 복수 선택)
  regionSelections?: RegionSelection[]; // 지역 선택 목록 (복수, 최대 10개)
  regionIds?: number[]; // 하위(구/군) regionId 배열 (API용)
}

// GET /photo-labs/regions 응답
export interface RegionParent {
  parentId: number;
  parentName: string;
  photoLabCount: number;
}

export interface RegionChild {
  regionId: number;
  regionName: string;
  parentId: number;
}

export interface RegionFilterData {
  parents: RegionParent[];
  regions: RegionChild[];
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
export interface PhotoLabLocation {
  latitude: number;
  longitude: number;
}

export interface PhotoLabNotice {
  noticeType: "EVENT" | "NOTICE";
  title: string;
}

export interface PhotoLabDetail {
  photoLabId: number;
  name: string;
  imageUrls: string[];
  tags: string[];
  address: string;
  addressDetail: string | null;
  distanceKm: number | null;
  isFavorite: boolean;
  workCount: number;
  reviewCount: number;
  avgWorkTime: number | null;
  mainNotice: PhotoLabNotice | null;
  postImageUrls: string[];
  latitude: number;
  longitude: number;
}
