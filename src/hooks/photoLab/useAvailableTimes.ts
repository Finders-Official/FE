import { useQuery } from "@tanstack/react-query";
import { getAvailableTimes } from "@/api/photoLab";

export function useAvailableTimes(
  photoLabId: number | undefined,
  date: string | undefined,
) {
  return useQuery({
    queryKey: ["photoLab", "availableTimes", photoLabId, date],
    queryFn: () => getAvailableTimes(photoLabId!, date!),
    select: (res) => res.data.availableTimes,
    enabled: !!photoLabId && !!date,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
