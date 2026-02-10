import { useQuery } from "@tanstack/react-query";
import { getPhotoLabNotices } from "@/apis/photoLab";

interface UsePhotoLabNoticesParams {
  lat?: number;
  lng?: number;
}

export function usePhotoLabNotices(params?: UsePhotoLabNoticesParams) {
  return useQuery({
    queryKey: ["photoLab", "notices", params],
    queryFn: () => getPhotoLabNotices(params),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}
