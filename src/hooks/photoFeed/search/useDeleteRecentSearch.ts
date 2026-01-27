import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecentSearch } from "@/apis/photoFeed/search.api";

export function useDeleteRecentSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: number) => deleteRecentSearch(historyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recentSearches"],
      });
    },
  });
}
