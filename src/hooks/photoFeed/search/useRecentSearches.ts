import { getRecentSearches } from "@/apis/photoFeed/search.api";
import type { SearchHistory } from "@/types/photoFeed/postSearch";
import { useQuery } from "@tanstack/react-query";

export function useRecentSearches() {
  return useQuery<SearchHistory[]>({
    queryKey: ["recentSearches"],
    queryFn: getRecentSearches,
  });
}
