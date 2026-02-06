import { getLabSearches } from "@/apis/photoFeed";
import type {
  LabSearchRequest,
  LabSearchResponse,
} from "@/types/photoFeed/labSearch";
import { useQuery } from "@tanstack/react-query";

/**
 * 사진수다 현상소 검색 결과 리스트 조회
 */
export function useSearchLabs(params: LabSearchRequest) {
  const { keyword, latitude, longitude, locationAgreed } = params;

  return useQuery<LabSearchResponse[]>({
    queryKey: ["labSearch", keyword, latitude, longitude, locationAgreed],
    enabled: keyword.trim().length > 0, // 빈 검색어면 호출 안 함
    queryFn: () =>
      getLabSearches({
        keyword,
        latitude,
        longitude,
        locationAgreed,
      }),
  });
}
