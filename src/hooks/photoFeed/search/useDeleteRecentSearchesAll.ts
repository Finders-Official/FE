import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllRecentSearch } from "@/apis/photoFeed/search.api";

export function useDeleteRecentSearchesAll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllRecentSearch(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recentSearches"],
      });
    },
  });
}
