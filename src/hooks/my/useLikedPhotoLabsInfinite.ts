import { favoritePhotoLab } from "@/apis/my";
import type { GetFavoritePhotoLabsResponse } from "@/types/mypage/photolab";
import {
  useInfiniteQuery,
  keepPreviousData,
  type InfiniteData,
} from "@tanstack/react-query";

export const FAVORITE_PHOTO_LABS_QUERY_KEY = [
  "photoLabs",
  "favorites",
] as const;

export function useLikedPhotoLabsInfinite(
  size = 10,
  lat?: number,
  lng?: number,
) {
  return useInfiniteQuery<
    GetFavoritePhotoLabsResponse,
    Error,
    InfiniteData<GetFavoritePhotoLabsResponse>,
    readonly unknown[],
    number
  >({
    queryKey: [...FAVORITE_PHOTO_LABS_QUERY_KEY, { size, lat, lng }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      favoritePhotoLab({ page: pageParam, size, lat, lng }),
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.pageInfo.isLast;
      if (isLast) return undefined;
      return allPages.length; // page가 0부터 시작 -> 다음은 pages.length
    },
    // 위치 정보가 뒤늦게 들어와 queryKey가 바뀔 때 스켈레톤 재깜빡임 방지
    placeholderData: keepPreviousData,
  });
}
