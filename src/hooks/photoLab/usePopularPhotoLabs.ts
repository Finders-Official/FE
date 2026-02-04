import { useQuery } from "@tanstack/react-query";
import { getPopularPhotoLabs } from "@/apis/photoLab";

export function usePopularPhotoLabs() {
  return useQuery({
    queryKey: ["photoLab", "popular"],
    queryFn: getPopularPhotoLabs,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
