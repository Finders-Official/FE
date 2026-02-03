// 작업 종류
export type TaskType = "DEVELOP" | "SCAN" | "PRINT";

// 작업 옵션 (라벨 포함)
export interface TaskOption {
  type: TaskType;
  label: string;
}

// 예약 폼 데이터
export interface ReservationFormData {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedTasks: TaskType[];
  filmRollCount: number;
  requestMemo: string;
  cautionConfirmed: boolean;
}

// 시간 슬롯
export interface TimeSlot {
  time: string;
  disabled: boolean;
}

// 날짜별 비활성화 시간 (string[] = 특정 시간, "ALL" = 전체 비활성화)
export type DisabledTimesMap = Record<string, string[] | "ALL">;

// 예약 생성 요청
export interface CreateReservationRequest {
  reservationDate: string; // yyyy-MM-dd
  reservationTime: string; // HH:mm (24시간)
  taskTypes: TaskType[];
  filmCount: number;
  memo?: string;
}

// 예약 가능 시간 응답
export interface AvailableTimesResponse {
  storeId: number;
  reservationDate: string;
  availableTimes: string[]; // HH:mm (24시간)
}

// 예약 생성 응답
export interface CreateReservationResponse {
  reservationId: number;
}

// 예약 상세 응답
export interface ReservationDetailResponse {
  reservationId: number;
  storeName: string;
  reservationDate: string;
  reservationTime: string; // HH:mm (24시간)
  taskTypes: TaskType[];
  filmCount: number;
  photoLabNotice: string | null;
  memo: string | null;
  latitude: number;
  longitude: number;
  estimatedCompletion: string | null;
  address: string;
  addressDetail: string;
}
