import { useMutation } from "@tanstack/react-query";
import { createReservation } from "@/apis/photoLab";
import type { CreateReservationRequest } from "@/types/reservation";

interface CreateReservationParams {
  photoLabId: string;
  data: CreateReservationRequest;
}

export function useCreateReservation() {
  return useMutation({
    mutationFn: ({ photoLabId, data }: CreateReservationParams) =>
      createReservation(photoLabId, data),
  });
}
