import { useQuery } from "@tanstack/react-query";
import { getRegionFilters } from "@/apis/photoLab";

export function useRegionFilters() {
  return useQuery({
    queryKey: ["photoLab", "regions"],
    queryFn: getRegionFilters,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    select: (data) => data.data,
  });
}
