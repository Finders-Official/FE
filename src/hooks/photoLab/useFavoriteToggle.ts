import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/apis/photoLab";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  PagedApiResponse,
  SimplePhotoLabItem,
  PhotoLabDetail,
} from "@/types/photoLab";
import type { GetFavoritePhotoLabsResponse } from "@/types/mypage/photolab";

interface ToggleParams {
  photoLabId: string;
  isFavorite: boolean;
}

const LIST_KEY = ["photoLab", "list"];
const FAVORITES_KEY = ["photoLabs", "favorites"];

export function useFavoriteToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoLabId, isFavorite }: ToggleParams) =>
      isFavorite ? removeFavorite(photoLabId) : addFavorite(photoLabId),

    // 낙관적 업데이트: 별(isFavorite)과 좋아요 수를 즉시 반영, 실패 시 롤백
    onMutate: async ({ photoLabId, isFavorite }) => {
      const nextFavorite = !isFavorite;
      const countDelta = nextFavorite ? 1 : -1;
      const detailKey = ["photoLab", "detail", photoLabId];

      // 진행 중인 refetch가 낙관적 값을 덮어쓰지 않도록 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: LIST_KEY }),
        queryClient.cancelQueries({ queryKey: FAVORITES_KEY }),
        queryClient.cancelQueries({ queryKey: detailKey }),
      ]);

      // 롤백용 백업
      const previousList = queryClient.getQueriesData<
        InfiniteData<PagedApiResponse<SimplePhotoLabItem[]>>
      >({ queryKey: LIST_KEY });
      const previousFavorites = queryClient.getQueriesData<
        InfiniteData<GetFavoritePhotoLabsResponse>
      >({ queryKey: FAVORITES_KEY });
      const previousDetail = queryClient.getQueriesData<
        ApiResponse<PhotoLabDetail>
      >({ queryKey: detailKey });

      // 현상소 목록 캐시 (SimplePhotoLabItem[])
      queryClient.setQueriesData<
        InfiniteData<PagedApiResponse<SimplePhotoLabItem[]>>
      >({ queryKey: LIST_KEY }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((lab) =>
              lab.photoLabId === photoLabId
                ? {
                    ...lab,
                    isFavorite: nextFavorite,
                    favoriteCount: Math.max(0, lab.favoriteCount + countDelta),
                  }
                : lab,
            ),
          })),
        };
      });

      // 관심현상소(마이페이지) 캐시 (FavoritePhotoLabDto[])
      queryClient.setQueriesData<InfiniteData<GetFavoritePhotoLabsResponse>>(
        { queryKey: FAVORITES_KEY },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                photoLabs: page.data.photoLabs.map((lab) =>
                  lab.photoLabId === photoLabId
                    ? {
                        ...lab,
                        isFavorite: nextFavorite,
                        favoriteCount: Math.max(
                          0,
                          lab.favoriteCount + countDelta,
                        ),
                      }
                    : lab,
                ),
              },
            })),
          };
        },
      );

      // 현상소 상세 캐시 (PhotoLabDetail)
      queryClient.setQueriesData<ApiResponse<PhotoLabDetail>>(
        { queryKey: detailKey },
        (old) => {
          if (!old?.data || old.data.photoLabId !== photoLabId) return old;
          return {
            ...old,
            data: {
              ...old.data,
              isFavorite: nextFavorite,
              favoriteCount: Math.max(0, old.data.favoriteCount + countDelta),
            },
          };
        },
      );

      return { previousList, previousFavorites, previousDetail };
    },

    onError: (_err, _vars, context) => {
      // 백업 데이터로 롤백
      context?.previousList?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      context?.previousFavorites?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      context?.previousDetail?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
    },

    onSettled: (_data, _err, { photoLabId }) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      // 화면에 떠 있는 동안 즉시 재조회되어 항목이 사라지지 않도록 stale 마킹만 수행 (진입 시 재조회)
      queryClient.invalidateQueries({
        queryKey: FAVORITES_KEY,
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: ["photoLab", "detail", photoLabId],
      });
    },
    //
  });
}
