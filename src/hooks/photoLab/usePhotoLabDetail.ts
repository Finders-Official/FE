import { useQuery } from "@tanstack/react-query";
import { getPhotoLabDetail } from "@/api/photoLab";

interface UsePhotoLabDetailParams {
  lat?: number;
  lng?: number;
}

export function usePhotoLabDetail(
  photoLabId: number | undefined,
  params?: UsePhotoLabDetailParams,
) {
  return useQuery({
    queryKey: ["photoLab", "detail", photoLabId, params],
    queryFn: () => getPhotoLabDetail(photoLabId!, params),
    select: (res) => res.data,
    enabled: !!photoLabId,
  });
}
