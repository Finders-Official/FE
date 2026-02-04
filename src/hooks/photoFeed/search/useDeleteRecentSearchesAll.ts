import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllRecentSearch } from "@/apis/photoFeed/search.api";
import type { SearchHistory } from "@/types/photoFeed/postSearch";

export function useDeleteRecentSearchesAll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllRecentSearch(),

    // 1️. 서버 요청 전에 UI 먼저 비움
    onMutate: async () => {
      // 지금 돌고 있는 recentSearches 쿼리 중단
      await queryClient.cancelQueries({
        queryKey: ["recentSearches"],
      });

      // 롤백용 백업
      const previous = queryClient.getQueryData<SearchHistory[]>([
        "recentSearches",
      ]);

      // UI 즉시 반영: 최근 검색어 전부 제거
      queryClient.setQueryData<SearchHistory[]>(["recentSearches"], []);

      // onError에서 사용할 컨텍스트
      return { previous };
    },

    // 2️. 실패 시 롤백
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["recentSearches"], ctx.previous);
      }
    },

    // 3️. 마지막엔 서버 상태로 재동기화
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["recentSearches"],
      });
    },
  });
}
