import { useQuery } from "@tanstack/react-query";
import { getReservationDetail } from "@/api/photoLab";

export function useReservationDetail(
  photoLabId: number | undefined,
  reservationId: number | undefined,
) {
  return useQuery({
    queryKey: ["photoLab", "reservation", photoLabId, reservationId],
    queryFn: () => getReservationDetail(photoLabId!, reservationId!),
    select: (res) => res.data,
    enabled: !!photoLabId && !!reservationId,
  });
}
