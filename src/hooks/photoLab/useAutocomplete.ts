import { useQuery } from "@tanstack/react-query";
import { getAutocomplete } from "@/apis/photoLab";
import { useDebouncedValue } from "@/hooks/common";

export function useAutocomplete(keyword: string) {
  const debouncedKeyword = useDebouncedValue(keyword, 300);

  return useQuery({
    queryKey: ["photoLab", "autocomplete", debouncedKeyword],
    queryFn: () => getAutocomplete(debouncedKeyword),
    enabled: !!debouncedKeyword.trim(),
    staleTime: 1000 * 60 * 2,
    select: (data) => data.data,
  });
}
