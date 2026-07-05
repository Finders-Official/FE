import { getCameraCatalog, getFilmCatalog } from "@/apis/my";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCamerasInfinite = (
  keyword: string,
  enabled: boolean,
  size = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["catalog", "cameras", keyword, size],
    queryFn: ({ pageParam }) => getCameraCatalog(keyword, pageParam, size),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled, // 바텀시트가 'camera' 모드일 때만 동작
  });
};

// 필름 검색 훅
export const useFilmsInfinite = (
  keyword: string,
  enabled: boolean,
  size = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["catalog", "films", keyword, size],
    queryFn: ({ pageParam }) => getFilmCatalog(keyword, pageParam, size),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled, // 바텀시트가 'film' 모드일 때만 동작
  });
};
