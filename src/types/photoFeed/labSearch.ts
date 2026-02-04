/**
 * 현상소 검색 요청 (CO-023)
 */
export type LabSearchRequest = {
  keyword: string;
  latitude: number;
  longitude: number;
  locationAgreed: boolean;
};

/**
 * 현상소 검색 응답 (CO-023)
 */
export type LabSearchResponse = {
  labId: number;
  name: string;
  address: string;
  distance: string;
};

export type LabSearchResponseList = {
  labSearchList: LabSearchResponse[];
};
