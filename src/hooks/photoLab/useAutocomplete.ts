import { useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getAutocomplete } from "@/apis/photoLab";
import { useDebouncedValue } from "@/hooks/common";
import { SEARCH_DEBOUNCE_MS } from "@/constants/photoLab";
import type { ApiResponse } from "@/types/common/apiResponse";

const MAX_RESULTS = 4;

export function useAutocomplete(keyword: string) {
  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);
  const queryClient = useQueryClient();

  // 캐시에서 현재 키워드의 prefix에 해당하는 max 미만 결과 찾기
  const cachedPrefixData = useMemo(() => {
    if (!debouncedKeyword.trim()) return null;

    const exact = queryClient.getQueryData<ApiResponse<string[]>>([
      "photoLab",
      "autocomplete",
      debouncedKeyword,
    ]);
    if (exact) return null;

    for (let i = debouncedKeyword.length - 1; i >= 1; i--) {
      const prefix = debouncedKeyword.slice(0, i);
      const cached = queryClient.getQueryData<ApiResponse<string[]>>([
        "photoLab",
        "autocomplete",
        prefix,
      ]);
      if (cached) {
        return cached.data.length < MAX_RESULTS ? cached.data : null;
      }
    }
    return null;
  }, [debouncedKeyword, queryClient]);

  const canFilterLocally = !!cachedPrefixData;

  const query = useQuery({
    queryKey: ["photoLab", "autocomplete", debouncedKeyword],
    queryFn: ({ signal }) => getAutocomplete(debouncedKeyword, signal), // AbortSignal
    enabled: !!debouncedKeyword.trim() && !canFilterLocally,
    staleTime: 1000 * 60 * 2,
    select: (data) => data.data,
    placeholderData: keepPreviousData, // 키워드 변경 시 이전 결과 유지
  });

  // 서버 prefix 검색과 일치
  const localFiltered = useMemo(() => {
    if (!cachedPrefixData || !debouncedKeyword.trim()) return [];
    const q = debouncedKeyword.toLowerCase();
    return cachedPrefixData.filter((k) => k.toLowerCase().startsWith(q));
  }, [cachedPrefixData, debouncedKeyword]);

  // canFilterLocally일 때 query의 isPending 등 전파 방지
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
