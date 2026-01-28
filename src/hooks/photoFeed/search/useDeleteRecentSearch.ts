import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecentSearch } from "@/apis/photoFeed/search.api";
import type { SearchHistory } from "@/types/photoFeed/postSearch";

export function useDeleteRecentSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: number) => deleteRecentSearch(historyId),

    // 1. 요청 직전에 UI 먼저 변경
    onMutate: async (historyId: number) => {
      // 진행 중인 refetch 중단 (덮어쓰기 방지)
      await queryClient.cancelQueries({
        queryKey: ["recentSearches"],
      });

      // 롤백용 스냅샷 저장
      const previous = queryClient.getQueryData<SearchHistory[]>([
        "recentSearches",
      ]);

      // 캐시에서 해당 검색어 즉시 제거
      queryClient.setQueryData<SearchHistory[]>(
        ["recentSearches"],
        (old) => old?.filter((item) => item.id !== historyId) ?? [],
      );

      // onError에서 쓸 컨텍스트 반환
      return { previous };
    },

    // 2. 실패하면 롤백
    onError: (_error, _historyId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["recentSearches"], context.previous);
      }
    },

    // 3. 최종적으로 서버와 동기화
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["recentSearches"] });
    },
  });
}
