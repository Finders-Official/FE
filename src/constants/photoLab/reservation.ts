import type { TaskOption, DisabledTimesMap } from "@/types/reservation";

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
  "원활한 작업을 위해 예약 시간 15분 전까지 매장 방문을 권장합니다.",
  "예약 시간보다 30분 이상 늦을 경우, 예약이 자동으로 취소될 수 있습니다.",
  "별도 연락 없이 방문하지 않으시는 경우(노쇼), 향후 한 달간 서비스 이용 및 예약이 제한될 수 있습니다.",
  "예약 취소 및 일시 변경은 방문 1시간 전까지 앱을 통해 가능합니다.",
  "현장에서 필름 상태 확인 후 작업 옵션(스캔/인화 등)을 변경하실 수 있습니다. 단, 작업량에 따라 소요 시간이 변동될 수 있습니다.",
];

// Mock: 날짜별 비활성화 시간 슬롯 (테스트용)
export const MOCK_DISABLED_TIMES: DisabledTimesMap = {
  "2026-01-20": ["10:00"],
  "2026-01-21": ["9:00", "2:00"],
  "2026-01-22": [],
  "2026-01-23": "ALL", // 전체 비활성화
};
