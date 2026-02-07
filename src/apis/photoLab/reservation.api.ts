import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";
import type {
  AvailableTimesResponse,
  CreateReservationRequest,
  CreateReservationResponse,
  ReservationDetailResponse,
} from "@/types/reservation";

// 예약 가능 시간 조회
export async function getAvailableTimes(
  photoLabId: number,
  date: string,
): Promise<ApiResponse<AvailableTimesResponse>> {
  const res = await axiosInstance.get<ApiResponse<AvailableTimesResponse>>(
    `/photo-labs/${photoLabId}/reservations/available-times`,
    { params: { date } },
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 예약 생성
export async function createReservation(
  photoLabId: number,
  data: CreateReservationRequest,
): Promise<ApiResponse<CreateReservationResponse>> {
  const res = await axiosInstance.post<ApiResponse<CreateReservationResponse>>(
    `/photo-labs/${photoLabId}/reservations`,
    data,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}

// 예약 상세 조회
export async function getReservationDetail(
  photoLabId: number,
  reservationId: number,
): Promise<ApiResponse<ReservationDetailResponse>> {
  const res = await axiosInstance.get<ApiResponse<ReservationDetailResponse>>(
    `/photo-labs/${photoLabId}/reservations/${reservationId}`,
  );

  const body = res.data;

  if (!body.success) {
    throw new Error(body.message);
  }

  return body;
}
