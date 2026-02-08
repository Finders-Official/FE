import { useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getSearchPreview } from "@/apis/photoLab";
import type { PhotoLabListParams, PagedApiResponse } from "@/types/photoLab";
import type { LabPreview } from "@/types/photoLabSearch";

type PreviewParams = Pick<PhotoLabListParams, "q" | "lat" | "lng">;

const MAX_RESULTS = 10;

export function useSearchPreview(params: PreviewParams, enabled = true) {
  const q = params.q ?? "";
  const queryClient = useQueryClient();

  // 캐시에서 현재 쿼리의 prefix에 해당하는 max 미만 결과 찾기
  const cachedPrefixData = useMemo(() => {
    if (!q.trim()) return null;

    // 캐시 TanStack Query가 처리
    const exact = queryClient.getQueryData<PagedApiResponse<LabPreview[]>>([
      "photoLab",
      "searchPreview",
      params,
    ]);
    if (exact) return null;

    for (let i = q.length - 1; i >= 1; i--) {
      const prefix = q.slice(0, i);
      const cached = queryClient.getQueryData<PagedApiResponse<LabPreview[]>>([
        "photoLab",
        "searchPreview",
        { ...params, q: prefix },
      ]);
      if (cached) {
        return cached.data.length < MAX_RESULTS ? cached.data : null;
      }
    }
    return null;
  }, [q, params, queryClient]);

  const canFilterLocally = !!cachedPrefixData;

  const query = useQuery({
    queryKey: ["photoLab", "searchPreview", params],
    queryFn: ({ signal }) => getSearchPreview({ ...params, size: 10 }, signal),
    enabled: enabled && !!q.trim() && !canFilterLocally,
    staleTime: 1000 * 60 * 2,
    select: (data) => data.data,
    placeholderData: keepPreviousData,
  });

  // preview는 일반 검색이므로 includes로 필터
  const localFiltered = useMemo(() => {
    if (!cachedPrefixData || !q.trim()) return [];
    const lower = q.toLowerCase();
    return cachedPrefixData.filter(
      (lab) =>
        lab.name.toLowerCase().includes(lower) ||
        lab.address.toLowerCase().includes(lower),
    );
  }, [cachedPrefixData, q]);

  // 상태 정합성
  if (canFilterLocally) {
    return {
      data: localFiltered,
      isLoading: false,
      isPending: false,
      isError: false,
      error: null,
      isPlaceholderData: false,
    };
  }

  return {
    data: query.data,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
  };
}
