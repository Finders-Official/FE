import { useQuery } from "@tanstack/react-query";
import { getPopularPhotoLabs } from "@/api/photoLab";

export function usePopularPhotoLabs() {
  return useQuery({
    queryKey: ["photoLab", "popular"],
    queryFn: getPopularPhotoLabs,
    select: (res) => res.data,
  });
}
