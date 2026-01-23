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

// API 요청 타입 (API 연동용)
export interface CreateReservationRequest {
  photoLabId: number;
  reservationDate: string; // "2026-01-20" 형식
  reservationTime: string; // "9:00" 형식
  taskTypes: TaskType[];
  filmCount: number;
  memo?: string;
}

// API 응답 타입
export interface CreateReservationResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: {
    reservationId: number;
  } | null;
}

// 예약 조회 응답 타입
export interface ReservationDetail {
  reservationId: number;
  storeName: string;
  reservationDate: string;
  reservationTime: string;
  taskTypes: TaskType[];
  filmCount: number;
  memo: string;
  address: string;
  addressDetail: string | null;
}
