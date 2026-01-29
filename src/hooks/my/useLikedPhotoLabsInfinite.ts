import { favoritePhotoLab } from "@/apis/my";
import type { GetFavoritePhotoLabsResponse } from "@/types/mypage/photolab";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

export const FAVORITE_PHOTO_LABS_QUERY_KEY = [
  "photoLabs",
  "favorites",
] as const;

export function useLikedPhotoLabsInfinite(size = 10) {
  return useInfiniteQuery<
    GetFavoritePhotoLabsResponse,
    Error,
    InfiniteData<GetFavoritePhotoLabsResponse>,
    readonly unknown[],
    number
  >({
    queryKey: [...FAVORITE_PHOTO_LABS_QUERY_KEY, { size }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => favoritePhotoLab({ page: pageParam, size }),
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.pageInfo.isLast;
      if (isLast) return undefined;
      return allPages.length; // page가 0부터 시작이면 다음은 pages.length가 딱 맞음
    },
  });
}
