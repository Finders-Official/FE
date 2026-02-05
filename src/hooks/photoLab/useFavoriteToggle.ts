import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/apis/photoLab";
import type { PagedApiResponse, PhotoLabItem } from "@/types/photoLab";
import type { InfiniteData } from "@tanstack/react-query";

interface ToggleParams {
  photoLabId: number;
  isFavorite: boolean;
}

export function useFavoriteToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoLabId, isFavorite }: ToggleParams) =>
      isFavorite ? removeFavorite(photoLabId) : addFavorite(photoLabId),

    onMutate: async ({ photoLabId, isFavorite }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["photoLab", "list"] });

      // 이전 데이터 백업
      const previous = queryClient.getQueriesData<
        InfiniteData<PagedApiResponse<PhotoLabItem[]>>
      >({ queryKey: ["photoLab", "list"] });

      // Optimistic update
      queryClient.setQueriesData<
        InfiniteData<PagedApiResponse<PhotoLabItem[]>>
      >({ queryKey: ["photoLab", "list"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((lab) =>
              lab.photoLabId === photoLabId
                ? { ...lab, isFavorite: !isFavorite }
                : lab,
            ),
          })),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // 롤백
      if (context?.previous) {
        for (const [queryKey, data] of context.previous) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["photoLab", "list"] });
    },
  });
}
