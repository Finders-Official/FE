import { useQuery } from "@tanstack/react-query";
import { getSearchPreview } from "@/apis/photoLab";
import type { PhotoLabListParams } from "@/types/photoLab";

type PreviewParams = Pick<PhotoLabListParams, "q" | "lat" | "lng">;

export function useSearchPreview(params: PreviewParams, enabled = true) {
  return useQuery({
    queryKey: ["photoLab", "searchPreview", params],
    queryFn: () => getSearchPreview({ ...params, size: 10 }),
    enabled: enabled && !!params.q?.trim(),
    staleTime: 1000 * 60 * 2,
    select: (data) => data.data,
  });
}
