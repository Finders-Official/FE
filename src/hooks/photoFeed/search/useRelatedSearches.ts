import { getRelatedSearches } from "@/apis/photoFeed/search.api";
import { useQuery } from "@tanstack/react-query";

export function useRelatedSearches(keyword: string) {
  return useQuery<string[]>({
    queryKey: ["relatedSearches", keyword],
    queryFn: () => getRelatedSearches(keyword),
    enabled: keyword.trim().length > 0,
  });
}
