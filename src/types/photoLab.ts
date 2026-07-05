// 현상소 아이템 (GET /photo-labs 응답)
export interface SimplePhotoLabItem {
  photoLabId: string;
  name: string;
  imageUrls: string[];
  address: string;
  distanceKm: number | null;
  isFavorite: boolean;
  favoriteCount: number;
}

// 즐겨찾기 응답
export interface PhotoLabFavoriteStatus {
  photoLabId: string;
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
  parentRegionId?: string;
  regionIds?: string[];
  page?: number;
  size?: number;
  lat?: number;
  lng?: number;
}

// 위치 정보 상태
export interface GeolocationState {
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: string | null;
  isDefault: boolean;
}

// 지역 선택 항목 (복수 선택용)
export interface RegionSelection {
  parentName: string; // "서울"
  subRegion: string; // "전체" | "강남구" 등
}

// 필터 상태 (바텀시트용)
export interface FilterState {
  regionSelections?: RegionSelection[]; // 지역 선택 목록 (복수, 최대 10개)
  regionIds?: string[]; // 하위(구/군) regionId 배열 (API용)
}

// GET /photo-labs/regions 응답
export interface RegionParent {
  parentId: string;
  parentName: string;
  photoLabCount: number;
}

export interface RegionChild {
  regionId: string;
  regionName: string;
  parentId: string;
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
  id: string;
  name: string;
  addr: string;
  dist: string;
};

// 현상소 상세 페이지 타입 (PL-020)
export interface PhotoLabLocation {
  latitude: number;
  longitude: number;
}

export interface PhotoLabDetail {
  photoLabId: string;
  name: string;
  imageUrls: string[];
  address: string;
  addressDetail: string | null;
  distanceKm: number | null;
  isFavorite: boolean;
  favoriteCount: number;
  postImageUrls: string[];
  latitude: number;
  longitude: number;
}
