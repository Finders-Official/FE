import type { TaskOption } from "@/types/reservation";

// 작업 옵션 설정
export const TASK_OPTIONS: TaskOption[] = [
  { type: "DEVELOP", label: "현상" },
  { type: "SCAN", label: "스캔" },
  { type: "PRINT", label: "인화" },
];

// 필름 롤 수 제한
export const FILM_ROLL_MIN = 1;
export const FILM_ROLL_MAX = 10;

// 요청사항 최대 글자수
export const REQUEST_MEMO_MAX_LENGTH = 300;

// 오전 시간 슬롯 (9:00 - 11:00)
export const AM_TIME_SLOTS: string[] = ["9:00", "10:00", "11:00"];

// 오후 시간 슬롯 (12:00 - 8:00)
export const PM_TIME_SLOTS: string[] = [
  "12:00",
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
];

// 주의사항 목록
export const CAUTION_ITEMS: string[] = [
  "노쇼, 당일 취소 / 변경 불가",
  "예약 날짜 변경 1회 가능",
];

// Mock: 날짜별 비활성화 시간 슬롯 (테스트용)
export const MOCK_DISABLED_TIMES: Record<string, string[]> = {
  "2026-01-20": ["10:00"],
  "2026-01-21": ["9:00", "2:00"],
  "2026-01-22": [],
};
