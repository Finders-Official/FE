import { TIME_SLOT_TO_API } from "@/constants/photoLab/reservation";

export function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * 필터 디스플레이 시간을 API 형식으로 변환
 * "오전 9:00" → "09:00"
 * "오후 2:00" → "14:00"
 */
export function displayTimeToApiTime(displayTime: string): string {
  const bare = displayTime.replace(/^(오전|오후)\s*/, "");
  return TIME_SLOT_TO_API[bare];
}

/**
 * 디스플레이 시간 배열을 API 형식 배열로 변환
 * ["오전 9:00", "오후 2:00"] → ["09:00", "14:00"]
 */
export function displayTimesToApiTimes(displayTimes: string[]): string[] {
  return displayTimes.map(displayTimeToApiTime);
}
